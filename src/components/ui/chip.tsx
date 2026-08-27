import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { PressScale } from '@/constants/motion';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Tint used when selected. Defaults to the brand accent. */
  accentColor?: string;
  accessibilityLabel?: string;
};

/** Selectable pill used by every picker in the Add Payment form. */
export function Chip({ label, selected, onPress, accentColor, accessibilityLabel }: ChipProps) {
  const theme = useTheme();
  const accent = accentColor ?? theme.primary;

  return (
    <AnimatedPressable
      scaleTo={PressScale.card}
      haptic="selection"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? `${accent}26` : theme.surface,
          borderColor: selected ? accent : theme.border,
        },
      ]}>
      <ThemedText
        variant="caption"
        style={[styles.label, { color: selected ? accent : theme.textSecondary }]}>
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
  },
});
