import { Platform } from 'react-native';

import { isExpoGo } from '@/notifications/environment';

const ANDROID_CHANNEL_ID = 'default';
export const NOTIFICATION_CHANNEL_ID = ANDROID_CHANNEL_ID;

let configured = false;

/**
 * One-time setup: how notifications behave while the app is foregrounded,
 * plus the Android notification channel required on API 26+. Configuration
 * only — never prompts for permission. Safe to call repeatedly.
 *
 * `expo-notifications` is loaded via dynamic `import()`, never statically,
 * and skipped entirely in Expo Go (see `isExpoGo`) — merely evaluating the
 * module can crash there on Android since SDK 53. This keeps the root
 * layout (which calls this on every launch) loading normally in Expo Go
 * while the real implementation is untouched for a development build.
 */
export async function configureNotifications(): Promise<void> {
  if (isExpoGo || configured) return;
  configured = true;

  const Notifications = await import('expo-notifications');

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: 'Renewal reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

/** Checks current permission without prompting — safe to call anytime. Always false in Expo Go. */
export async function getPermissionGranted(): Promise<boolean> {
  if (isExpoGo) return false;
  const Notifications = await import('expo-notifications');
  const settings = await Notifications.getPermissionsAsync();
  return settings.granted;
}

/**
 * Requests notification permission only if it hasn't been determined yet.
 * Never re-prompts after a denial — the OS won't show its dialog again
 * anyway, so calling requestPermissionsAsync would just silently resolve
 * denied. This should only be called at the moment a reminder is actually
 * needed (enabling one / saving a subscription that wants one), never at
 * app launch. Always false in Expo Go.
 */
export async function ensurePermissionGranted(): Promise<boolean> {
  if (isExpoGo) return false;

  const Notifications = await import('expo-notifications');
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}
