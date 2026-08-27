import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Reveal } from '@/components/ui/reveal';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
  /** Defaults to "Try again" — pass e.g. "Go back" for a not-found case. */
  retryLabel?: string;
};

/** Shown only when the very first load fails — database init, or a read error. */
export function ErrorState({ message, onRetry, retryLabel = 'Try again' }: ErrorStateProps) {
  const theme = useTheme();

  return (
    <Reveal delay={0} style={styles.container}>
      <ThemedText variant="body" color="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
      <AnimatedPressable
        haptic="selection"
        accessibilityRole="button"
        accessibilityLabel={retryLabel}
        onPress={onRetry}
        style={styles.retry}>
        <ThemedText variant="body" style={{ color: theme.primary, fontWeight: '700' }}>
          {retryLabel}
        </ThemedText>
      </AnimatedPressable>
    </Reveal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Spacing.six,
    gap: Spacing.three,
  },
  message: {
    textAlign: 'center',
  },
  retry: {
    minHeight: 44,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
