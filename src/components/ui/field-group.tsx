import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type FieldGroupProps = PropsWithChildren<{
  label: string;
  error?: string;
  hint?: string;
}>;

/** Consistent label + control + error/hint layout shared by every form field. */
export function FieldGroup({ label, error, hint, children }: FieldGroupProps) {
  return (
    <View style={styles.container}>
      <ThemedText variant="label" color="textMuted" style={styles.label}>
        {label.toUpperCase()}
      </ThemedText>
      {children}
      {error ? (
        <ThemedText variant="caption" color="destructive" accessibilityLiveRegion="polite">
          {error}
        </ThemedText>
      ) : hint ? (
        <ThemedText variant="caption" color="textMuted">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  label: {
    paddingHorizontal: Spacing.one,
  },
});
