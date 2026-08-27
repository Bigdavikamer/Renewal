import type { PressableProps } from 'react-native';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { PressScale } from '@/constants/motion';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  /** Set to null to render without a leading icon. */
  icon?: string | null;
};

export function Button({ label, icon = '+', disabled, ...rest }: ButtonProps) {
  const theme = useTheme();

  return (
    <AnimatedPressable
      scaleTo={PressScale.button}
      haptic="impact"
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      style={[styles.button, { backgroundColor: theme.primary, opacity: disabled ? 0.6 : 1 }]}
      {...rest}>
      {icon ? <ThemedText style={styles.icon}>{icon}</ThemedText> : null}
      <ThemedText variant="body" style={styles.label}>
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Radii.pill,
    minHeight: 56,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
