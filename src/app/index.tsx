import { StyleSheet, View } from 'react-native';

import { PaymentRow } from '@/components/payment-row';
import { SpendingSummary } from '@/components/spending-summary';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Spacing } from '@/constants/theme';
import { mockSubscriptions } from '@/data/mock-subscriptions';
import { getGreeting } from '@/utils/date';
import { getMonthlyTotal, getYearlyTotal, sortByNextRenewal } from '@/utils/subscriptions';

function handleAddPayment() {
  console.log('Add payment tapped');
}

export default function HomeScreen() {
  const upcoming = sortByNextRenewal(mockSubscriptions);
  const monthlyTotal = getMonthlyTotal(mockSubscriptions);
  const yearlyTotal = getYearlyTotal(mockSubscriptions);

  return (
    <Screen>
      <ThemedText variant="title" accessibilityRole="header">
        {getGreeting()} 👋
      </ThemedText>

      <SpendingSummary monthlyTotal={monthlyTotal} yearlyTotal={yearlyTotal} />

      <View style={styles.section}>
        <SectionHeader label="Upcoming" />
        <View style={styles.list}>
          {upcoming.map((subscription) => (
            <PaymentRow key={subscription.id} subscription={subscription} />
          ))}
        </View>
      </View>

      <Button label="Add payment" onPress={handleAddPayment} />
    </Screen>
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
