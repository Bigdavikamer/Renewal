import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AnimatedCurrency } from '@/components/ui/animated-currency';
import { Spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/currency';

type SpendingSummaryProps = {
  monthlyTotal: number;
  yearlyTotal: number;
};

export function SpendingSummary({ monthlyTotal, yearlyTotal }: SpendingSummaryProps) {
  return (
    <View
      accessible
      accessibilityLabel={`Your recurring spending: ${formatCurrency(monthlyTotal)} per month, approximately ${formatCurrency(yearlyTotal)} per year.`}>
      <ThemedText variant="label" color="textMuted" style={styles.eyebrow}>
        Your recurring spending
      </ThemedText>

      <View style={styles.amountRow}>
        <AnimatedCurrency value={monthlyTotal} variant="hero" style={styles.tabularNums} animateFromZero />
        <ThemedText variant="body" color="textSecondary">
          {' '}
          per month
        </ThemedText>
      </View>

      <ThemedText variant="caption" color="textMuted">
        ≈ <AnimatedCurrency value={yearlyTotal} variant="caption" color="textMuted" animateFromZero />{' '}
        per year
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    textTransform: 'uppercase',
  },
  amountRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    marginTop: Spacing.one,
    marginBottom: Spacing.half,
  },
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
});
