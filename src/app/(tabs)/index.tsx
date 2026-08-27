import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PaymentRow } from '@/components/payment-row';
import { EmptyState } from '@/components/home/empty-state';
import { ErrorState } from '@/components/home/error-state';
import { Greeting } from '@/components/home/greeting';
import { HomeSkeleton } from '@/components/home/home-skeleton';
import { SpendingSummary } from '@/components/spending-summary';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { StaggerStep } from '@/constants/motion';
import { Spacing } from '@/constants/theme';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import type { Subscription } from '@/types/subscription';
import { getMonthlyTotal, getYearlyTotal, sortByNextRenewal } from '@/utils/subscriptions';

// Entrance stagger order: greeting, spending, section header, then each card.
const CARDS_START_AT = 3;

export default function HomeScreen() {
  const router = useRouter();
  const data = useSubscriptions();
  // Only the very first paint gets the coordinated page-load stagger; a
  // payment added afterwards should feel immediate, not delayed.
  const hasRevealedOnce = useRef(false);
  const isInitialReveal = data.status === 'ready' && !hasRevealedOnce.current;

  useEffect(() => {
    if (data.status === 'ready') hasRevealedOnce.current = true;
  }, [data.status]);

  const goToAddPayment = () => router.push('/add-payment');

  return (
    <Screen>
      <Greeting />

      {data.status === 'loading' && <HomeSkeleton />}

      {data.status === 'error' && <ErrorState message={data.message} onRetry={data.reload} />}

      {data.status === 'ready' && data.subscriptions.length === 0 && (
        <EmptyState onAddPayment={goToAddPayment} />
      )}

      {data.status === 'ready' && data.subscriptions.length > 0 && (
        <HomeContent
          subscriptions={data.subscriptions}
          staggered={isInitialReveal}
          onAddPayment={goToAddPayment}
        />
      )}
    </Screen>
  );
}

function HomeContent({
  subscriptions,
  staggered,
  onAddPayment,
}: {
  subscriptions: Subscription[];
  staggered: boolean;
  onAddPayment: () => void;
}) {
  const upcoming = sortByNextRenewal(subscriptions);
  const monthlyTotal = getMonthlyTotal(subscriptions);
  const yearlyTotal = getYearlyTotal(subscriptions);

  return (
    <>
      <Reveal delay={staggered ? 1 * StaggerStep : 0}>
        <SpendingSummary monthlyTotal={monthlyTotal} yearlyTotal={yearlyTotal} />
      </Reveal>

      <View style={styles.section}>
        <Reveal delay={staggered ? 2 * StaggerStep : 0}>
          <SectionHeader label="Upcoming" />
        </Reveal>
        <View style={styles.list}>
          {upcoming.map((subscription, i) => (
            <PaymentRow
              key={subscription.id}
              subscription={subscription}
              index={staggered ? CARDS_START_AT + i : 0}
            />
          ))}
        </View>
      </View>

      <Reveal delay={staggered ? (CARDS_START_AT + upcoming.length) * StaggerStep : 0}>
        <Button label="Add payment" onPress={onAddPayment} />
      </Reveal>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.three,
  },
});
