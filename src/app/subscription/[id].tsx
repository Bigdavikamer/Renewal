import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ErrorState } from '@/components/home/error-state';
import { ThemedText } from '@/components/themed-text';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { SkeletonBlock } from '@/components/ui/skeleton-block';
import { StaggerStep } from '@/constants/motion';
import { Radii, Spacing } from '@/constants/theme';
import { deleteSubscription } from '@/db/repositories/subscription-repository';
import { useSubscription } from '@/hooks/use-subscription';
import { useTheme } from '@/hooks/use-theme';
import { cancelReminder, reminderLabel } from '@/notifications/reminders';
import type { Subscription, SubscriptionStatus } from '@/types/subscription';
import { getAvatarAccent } from '@/utils/avatar';
import { formatCurrency } from '@/utils/currency';
import { formatDate, isRenewingSoon, renewalLabel } from '@/utils/date';
import { haptics } from '@/utils/haptics';
import { formatFrequency, getMonthlyTotal, getYearlyTotal } from '@/utils/subscriptions';

export default function SubscriptionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const data = useSubscription(id);

  // Lifted above `Screen` (not inside its ScrollView) so the dialog's
  // absolute overlay always covers the real viewport, not just the
  // scrollable content — matters once the page can scroll (long notes, etc).
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (data.status !== 'ready') return;
    setDeleteError(null);
    setDeleting(true);
    haptics.warning();
    try {
      await cancelReminder(data.subscription.reminderNotificationId);
      await deleteSubscription(id);
      router.back();
    } catch (error) {
      setDeleting(false);
      setDeleteError(error instanceof Error ? error.message : "Couldn't delete. Please try again.");
    }
  }

  return (
    <View style={styles.root}>
      <Screen>
        <View style={styles.header}>
          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            haptic="selection"
            onPress={() => router.back()}
            style={styles.back}>
            <ThemedText style={styles.backGlyph}>‹</ThemedText>
          </AnimatedPressable>
        </View>

        {data.status === 'loading' && <DetailsSkeleton />}

        {data.status === 'error' && <ErrorState message={data.message} onRetry={data.reload} />}

        {data.status === 'not-found' && (
          <ErrorState
            message="This payment could not be found. It may have already been removed."
            onRetry={() => router.back()}
            retryLabel="Go back"
          />
        )}

        {data.status === 'ready' && (
          <SubscriptionDetails
            subscription={data.subscription}
            id={id}
            onRequestDelete={() => setConfirmVisible(true)}
          />
        )}
      </Screen>

      {data.status === 'ready' && (
        <ConfirmDialog
          visible={confirmVisible}
          title={`Delete ${data.subscription.name}?`}
          message="This will permanently remove this payment from Renewal."
          confirmLabel={deleting ? 'Deleting…' : 'Delete'}
          destructive
          busy={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => {
            if (!deleting) setConfirmVisible(false);
          }}
        />
      )}
    </View>
  );
}

function SubscriptionDetails({
  subscription,
  id,
  onRequestDelete,
}: {
  subscription: Subscription;
  id: string;
  onRequestDelete: () => void;
}) {
  const theme = useTheme();
  const router = useRouter();
  const accent = getAvatarAccent(subscription.category);
  const frequencyLabel = formatFrequency(subscription.frequency);
  const renewal = renewalLabel(subscription.nextRenewalDate);
  const soon = isRenewingSoon(subscription.nextRenewalDate);
  const statusColor = statusAccent(theme, subscription.status);

  // Only show the derived figure that isn't already restated by the hero amount.
  const monthlyEquivalent = getMonthlyTotal([subscription]);
  const yearlyCost = getYearlyTotal([subscription]);
  const showMonthlyEquivalent = subscription.frequency !== 'monthly';
  const showYearlyCost = subscription.frequency !== 'yearly';
  const showSpending = showMonthlyEquivalent || showYearlyCost;

  // Notification actually scheduled? `reminderDaysBefore` reflects intent, but
  // permission denial, a passed trigger date, or a scheduling error can all
  // leave nothing scheduled — show that honestly rather than assuming it worked.
  const reminderWanted = subscription.reminderDaysBefore !== null;
  const reminderScheduled = reminderWanted && subscription.reminderNotificationId !== null;

  // Entrance stagger order: hero, details, notes (if any), spending (if any), reminder, actions.
  let step = 1;
  const detailsDelay = step++;
  const notesDelay = subscription.notes ? step++ : 0;
  const spendingDelay = showSpending ? step++ : 0;
  const reminderDelay = step++;
  const actionsDelay = step;

  return (
    <>
      <Reveal delay={0} style={styles.hero}>
        <View style={[styles.avatar, { backgroundColor: `${accent}26` }]}>
          <ThemedText variant="title" style={{ color: accent, fontWeight: '700' }}>
            {subscription.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>

        <ThemedText variant="title" style={styles.name}>
          {subscription.name}
        </ThemedText>

        <ThemedText variant="hero" style={styles.tabularNums}>
          {formatCurrency(subscription.amount, subscription.currency)}
        </ThemedText>
        <ThemedText variant="body" color="textSecondary">
          per {frequencyLabel.toLowerCase()}
        </ThemedText>

        <View style={[styles.categoryChip, { backgroundColor: `${accent}26` }]}>
          <ThemedText variant="caption" style={{ color: accent, fontWeight: '700' }}>
            {subscription.category}
          </ThemedText>
        </View>
      </Reveal>

      <Reveal delay={detailsDelay * StaggerStep}>
        <SectionHeader label="Details" />
        <Card style={styles.detailsCard}>
          <DetailRow label="Currency" value={subscription.currency} />
          <DetailRow label="Billing frequency" value={frequencyLabel} />
          <DetailRow
            label="Next renewal"
            value={formatDate(subscription.nextRenewalDate, { includeYear: true })}
            hint={renewal}
            hintColor={soon ? 'primary' : 'textMuted'}
          />
          <DetailRow label="Status" value={capitalize(subscription.status)} dotColor={statusColor} />
        </Card>
      </Reveal>

      {subscription.notes ? (
        <Reveal delay={notesDelay * StaggerStep}>
          <SectionHeader label="Notes" />
          <Card>
            <ThemedText variant="body" color="textSecondary">
              {subscription.notes}
            </ThemedText>
          </Card>
        </Reveal>
      ) : null}

      {showSpending ? (
        <Reveal delay={spendingDelay * StaggerStep}>
          <SectionHeader label="Spending" />
          <Card style={styles.detailsCard}>
            {showMonthlyEquivalent ? (
              <DetailRow
                label="Monthly equivalent"
                value={formatCurrency(monthlyEquivalent, subscription.currency)}
              />
            ) : null}
            {showYearlyCost ? (
              <DetailRow label="Yearly cost" value={formatCurrency(yearlyCost, subscription.currency)} />
            ) : null}
          </Card>
        </Reveal>
      ) : null}

      <Reveal delay={reminderDelay * StaggerStep}>
        <SectionHeader label="Reminder" />
        <Card style={styles.reminderCard}>
          <View style={styles.reminderRow}>
            <ThemedText variant="body" color="textSecondary">
              {reminderLabel(subscription.reminderDaysBefore)}
            </ThemedText>
            <AnimatedPressable
              haptic="selection"
              accessibilityRole="button"
              accessibilityLabel="Edit reminder"
              onPress={() => router.push({ pathname: '/edit-payment/[id]', params: { id } })}
              style={styles.editReminder}>
              <ThemedText variant="caption" style={{ color: theme.primary, fontWeight: '700' }}>
                Edit reminder
              </ThemedText>
            </AnimatedPressable>
          </View>
          {reminderWanted && !reminderScheduled ? (
            <ThemedText variant="caption" color="textMuted">
              No notification is currently scheduled for this reminder.
            </ThemedText>
          ) : null}
        </Card>
      </Reveal>

      <Reveal delay={actionsDelay * StaggerStep} style={styles.actions}>
        <Button
          label="Edit payment"
          icon={null}
          onPress={() => router.push({ pathname: '/edit-payment/[id]', params: { id } })}
        />
        <AnimatedPressable
          haptic="selection"
          accessibilityRole="button"
          accessibilityLabel="Delete payment"
          onPress={onRequestDelete}
          style={styles.deleteAction}>
          <ThemedText variant="body" style={{ color: theme.destructive, fontWeight: '700' }}>
            Delete payment
          </ThemedText>
        </AnimatedPressable>
      </Reveal>
    </>
  );
}

function DetailRow({
  label,
  value,
  hint,
  hintColor,
  dotColor,
}: {
  label: string;
  value: string;
  hint?: string;
  hintColor?: 'primary' | 'textMuted';
  dotColor?: string;
}) {
  return (
    <View style={styles.detailRow}>
      <ThemedText variant="caption" color="textMuted">
        {label}
      </ThemedText>
      <View style={styles.detailValue}>
        <View style={styles.detailValueLine}>
          {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
          <ThemedText variant="body" style={styles.detailValueText}>
            {value}
          </ThemedText>
        </View>
        {hint ? (
          <ThemedText variant="caption" color={hintColor ?? 'textMuted'}>
            {hint}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

function DetailsSkeleton() {
  return (
    <View style={styles.skeleton}>
      <View style={styles.skeletonHero}>
        <SkeletonBlock width={64} height={64} radius={32} />
        <SkeletonBlock width={140} height={20} />
        <SkeletonBlock width={160} height={44} />
        <SkeletonBlock width={90} height={14} />
      </View>
      <SkeletonBlock height={150} radius={Radii.lg} />
      <SkeletonBlock height={80} radius={Radii.lg} />
    </View>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function statusAccent(theme: ReturnType<typeof useTheme>, status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
      return theme.success;
    case 'trial':
      return theme.warning;
    case 'canceled':
      return theme.destructive;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.two,
  },
  backGlyph: {
    fontSize: 28,
    fontWeight: '700',
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  name: {
    marginBottom: Spacing.one,
  },
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
  categoryChip: {
    marginTop: Spacing.three,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.pill,
  },
  detailsCard: {
    gap: Spacing.three,
  },
  reminderCard: {
    gap: Spacing.one,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editReminder: {
    minHeight: 32,
    paddingHorizontal: Spacing.one,
    justifyContent: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailValue: {
    alignItems: 'flex-end',
    gap: 2,
  },
  detailValueLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  detailValueText: {
    fontWeight: '700',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    gap: Spacing.three,
  },
  deleteAction: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeleton: {
    gap: Spacing.five,
  },
  skeletonHero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
});
