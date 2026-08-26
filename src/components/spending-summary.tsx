import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/currency';

type SpendingSummaryProps = {
  monthlyTotal: number;
  yearlyTotal: number;
};

export function SpendingSummary({ monthlyTotal, yearlyTotal }: SpendingSummaryProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      accessible
      accessibilityLabel={`Your recurring spending: ${formatCurrency(monthlyTotal)} per month, approximately ${formatCurrency(yearlyTotal)} per year.`}>
      <ThemedText variant="label" color="textMuted">
        Your recurring spending
      </ThemedText>

      <View style={styles.amountRow}>
        <ThemedText variant="hero" style={styles.tabularNums}>
          {formatCurrency(monthlyTotal)}
        </ThemedText>
        <ThemedText variant="body" color="textSecondary">
          {' '}
          per month
        </ThemedText>
      </View>

      <ThemedText variant="caption" color="textMuted">
        ≈ {formatCurrency(yearlyTotal)} per year
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
