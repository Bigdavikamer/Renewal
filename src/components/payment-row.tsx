import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Subscription } from '@/types/subscription';
import { formatCurrency } from '@/utils/currency';
import { renewalLabel } from '@/utils/date';
import { formatFrequency } from '@/utils/subscriptions';

type PaymentRowProps = {
  subscription: Subscription;
};

export function PaymentRow({ subscription }: PaymentRowProps) {
  const theme = useTheme();
  const initial = subscription.name.charAt(0).toUpperCase();
  const renewal = renewalLabel(subscription.nextRenewalDate);
  const frequency = formatFrequency(subscription.frequency);

  return (
    <Card
      style={styles.card}
      accessible
      accessibilityLabel={`${subscription.name}, ${subscription.category}, ${formatCurrency(subscription.amount)}, ${frequency}, ${renewal}`}>
      <View style={[styles.iconPlaceholder, { backgroundColor: `${theme.primary}1A` }]}>
        <ThemedText variant="body" style={{ color: theme.primary, fontWeight: '700' }}>
          {initial}
        </ThemedText>
      </View>

      <View style={styles.details}>
        <ThemedText variant="body" numberOfLines={1}>
          {subscription.name}
        </ThemedText>
        <ThemedText variant="caption" color="textMuted" numberOfLines={1}>
          {subscription.category} · {frequency}
        </ThemedText>
      </View>

      <View style={styles.trailing}>
        <ThemedText variant="body" style={styles.tabularNums}>
          {formatCurrency(subscription.amount)}
        </ThemedText>
        <ThemedText variant="caption" color="textMuted">
          {renewal}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: 2,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
});
