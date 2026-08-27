import { NOTIFICATION_CHANNEL_ID, configureNotifications, ensurePermissionGranted } from '@/notifications/client';
import { isExpoGo } from '@/notifications/environment';
import type { Subscription } from '@/types/subscription';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

export const DEFAULT_REMINDER_DAYS_BEFORE = 3;

/** The only reminder offsets Renewal's UI offers — keep in sync with the picker copy. */
export const REMINDER_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'None', value: null },
  { label: 'Same day', value: 0 },
  { label: '1 day', value: 1 },
  { label: '3 days', value: 3 },
  { label: '7 days', value: 7 },
];

export function reminderLabel(daysBefore: number | null): string {
  if (daysBefore === null) return 'No reminder';
  if (daysBefore === 0) return 'Same day as renewal';
  if (daysBefore === 1) return '1 day before renewal';
  return `${daysBefore} days before renewal`;
}

/** Local hour the reminder fires at, rather than whatever time the record happened to be saved. */
const REMINDER_HOUR_LOCAL = 9;

/**
 * `daysBefore` calendar days before the renewal date, at a fixed local hour.
 * Built from local date *components* (not millisecond arithmetic), matching
 * the approach `daysUntil` already uses — this keeps it correct across
 * month/year boundaries and DST transitions, where subtracting a fixed
 * `days * 86400000` from a timestamp would not be.
 */
export function computeReminderDate(nextRenewalDate: string, daysBefore: number): Date {
  const renewal = new Date(nextRenewalDate);
  return new Date(
    renewal.getFullYear(),
    renewal.getMonth(),
    renewal.getDate() - daysBefore,
    REMINDER_HOUR_LOCAL,
    0,
    0,
    0
  );
}

function buildReminderContent(subscription: Subscription, daysBefore: number) {
  const amount = formatCurrency(subscription.amount, subscription.currency);
  const dateLabel = formatDate(subscription.nextRenewalDate, { includeYear: true });

  const title =
    daysBefore === 0
      ? `${subscription.name} renews today`
      : `${subscription.name} renews in ${daysBefore} day${daysBefore === 1 ? '' : 's'}`;

  const body =
    daysBefore === 0
      ? `Your ${amount} subscription renews today.`
      : `Your ${amount} subscription renews on ${dateLabel}.`;

  return { title, body, data: { subscriptionId: subscription.id } };
}

export type ScheduleReminderResult =
  | { status: 'scheduled'; notificationId: string }
  | { status: 'skipped' }
  | { status: 'permission-denied' };

/**
 * Schedules (or skips) a subscription's reminder. Never throws — a failure
 * here should never block saving the subscription itself. Skips silently
 * when reminders are off or the computed date has already passed; only
 * requests permission when a reminder is actually wanted.
 */
export async function scheduleReminder(subscription: Subscription): Promise<ScheduleReminderResult> {
  if (subscription.reminderDaysBefore === null) return { status: 'skipped' };
  if (isExpoGo) return { status: 'skipped' };

  const triggerDate = computeReminderDate(subscription.nextRenewalDate, subscription.reminderDaysBefore);
  if (triggerDate.getTime() <= Date.now()) return { status: 'skipped' };

  const granted = await ensurePermissionGranted();
  if (!granted) return { status: 'permission-denied' };

  try {
    await configureNotifications();
    const Notifications = await import('expo-notifications');
    const { title, body, data } = buildReminderContent(subscription, subscription.reminderDaysBefore);
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: NOTIFICATION_CHANNEL_ID,
      },
    });
    return { status: 'scheduled', notificationId };
  } catch (error) {
    if (__DEV__) console.error('[reminders] schedule failed:', error);
    return { status: 'skipped' };
  }
}

/** Best-effort cancel — a stale or already-fired id is a harmless no-op, never thrown. No-op in Expo Go. */
export async function cancelReminder(notificationId: string | null): Promise<void> {
  if (!notificationId || isExpoGo) return;
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    if (__DEV__) console.error('[reminders] cancel failed:', error);
  }
}

/**
 * Cancels the previous reminder (if any) and schedules the new one. The one
 * entry point both Add Payment and Edit Payment use, so create/edit/delete
 * never leave an orphaned notification behind.
 */
export async function syncReminder(
  subscription: Subscription,
  previousNotificationId: string | null
): Promise<{ notificationId: string | null; permissionDenied: boolean }> {
  await cancelReminder(previousNotificationId);
  const result = await scheduleReminder(subscription);
  return {
    notificationId: result.status === 'scheduled' ? result.notificationId : null,
    permissionDenied: result.status === 'permission-denied',
  };
}
