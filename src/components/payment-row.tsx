import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Card } from '@/components/ui/card';
import { Duration, PressScale, SpringSettle, StaggerStep } from '@/constants/motion';
import { Radii, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { Subscription } from '@/types/subscription';
import { getAvatarAccent } from '@/utils/avatar';
import { formatCurrency } from '@/utils/currency';
import { isRenewingSoon, renewalLabel } from '@/utils/date';
import { formatFrequency } from '@/utils/subscriptions';

type PaymentRowProps = {
  subscription: Subscription;
  /** Position within the list, used to stagger the entrance animation. */
  index?: number;
  /** Reserved for future navigation into payment detail. */
  onPress?: () => void;
};

export function PaymentRow({ subscription, index = 0, onPress }: PaymentRowProps) {
  const reducedMotion = useReducedMotion();
  const initial = subscription.name.charAt(0).toUpperCase();
  const renewal = renewalLabel(subscription.nextRenewalDate);
  const frequency = formatFrequency(subscription.frequency);
  const accent = getAvatarAccent(subscription.category);
  const soon = isRenewingSoon(subscription.nextRenewalDate);

  const entering = reducedMotion
    ? FadeIn.duration(Duration.fast)
    : FadeInDown.duration(Duration.normal).delay(index * StaggerStep);

  return (
    <Animated.View
      entering={entering}
      exiting={FadeOut.duration(Duration.fast)}
      layout={
        reducedMotion
          ? undefined
          : LinearTransition.springify()
              .damping(SpringSettle.damping)
              .stiffness(SpringSettle.stiffness)
              .mass(SpringSettle.mass)
      }>
      <AnimatedPressable
        scaleTo={PressScale.card}
        haptic="selection"
        onPress={onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${subscription.name}, ${subscription.category}, ${formatCurrency(subscription.amount, subscription.currency)}, ${frequency}, ${renewal}`}>
        <Card style={styles.card}>
          <View style={[styles.iconPlaceholder, { backgroundColor: `${accent}26` }]}>
            <ThemedText variant="body" style={{ color: accent, fontWeight: '700' }}>
              {initial}
            </ThemedText>
          </View>

          <View style={styles.details}>
            <ThemedText variant="body" style={styles.name} numberOfLines={1}>
              {subscription.name}
            </ThemedText>
            <ThemedText variant="caption" color="textMuted" numberOfLines={1}>
              {subscription.category} · {frequency}
            </ThemedText>
          </View>

          <View style={styles.trailing}>
            <ThemedText variant="body" style={[styles.amount, styles.tabularNums]}>
              {formatCurrency(subscription.amount, subscription.currency)}
            </ThemedText>
            <ThemedText variant="caption" color={soon ? 'primary' : 'textMuted'} style={soon ? styles.soon : undefined}>
              {renewal}
            </ThemedText>
          </View>
        </Card>
      </AnimatedPressable>
    </Animated.View>
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
  name: {
    fontWeight: '700',
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    fontWeight: '700',
  },
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
  soon: {
    fontWeight: '700',
  },
});
