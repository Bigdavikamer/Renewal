import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  onAddPayment: () => void;
};

/** Shown when the database has zero subscriptions — first launch, or after clearing everything. */
export function EmptyState({ onAddPayment }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <Reveal delay={0} style={styles.container}>
      <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
        <ThemedText style={[styles.badgeGlyph, { color: theme.primary }]}>+</ThemedText>
      </View>

      <ThemedText variant="title" style={styles.title}>
        Keep your recurring spending in one place.
      </ThemedText>

      <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
        Add your first payment to see your monthly and yearly totals at a glance.
      </ThemedText>

      <Button label="Add your first payment" onPress={onAddPayment} />
    </Reveal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Spacing.six,
    gap: Spacing.three,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  badgeGlyph: {
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
});
