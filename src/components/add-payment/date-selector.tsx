import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Chip } from '@/components/ui/chip';
import { FieldGroup } from '@/components/ui/field-group';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { addDays, daysUntil, formatDate, isRenewingSoon, renewalLabel } from '@/utils/date';

type DateSelectorProps = {
  value: string;
  onChange: (isoDate: string) => void;
  error?: string;
};

const PRESETS: { label: string; days: number }[] = [
  { label: 'Today', days: 0 },
  { label: '1 week', days: 7 },
  { label: '1 month', days: 30 },
  { label: '3 months', days: 90 },
  { label: '1 year', days: 365 },
];

export function DateSelector({ value, onChange, error }: DateSelectorProps) {
  const theme = useTheme();

  function step(deltaDays: number) {
    onChange(addDays(new Date(value), deltaDays).toISOString());
  }

  return (
    <FieldGroup label="Next renewal" error={error}>
      <View style={[styles.display, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel="One day earlier"
          haptic="selection"
          onPress={() => step(-1)}
          style={styles.stepButton}>
          <ThemedText style={[styles.stepGlyph, { color: theme.primary }]}>–</ThemedText>
        </AnimatedPressable>

        <View style={styles.dateTextWrap}>
          <ThemedText variant="body" style={styles.dateText}>
            {formatDate(value, { includeYear: true })}
          </ThemedText>
          <ThemedText variant="caption" color={isRenewingSoon(value) ? 'primary' : 'textMuted'}>
            {renewalLabel(value)}
          </ThemedText>
        </View>

        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel="One day later"
          haptic="selection"
          onPress={() => step(1)}
          style={styles.stepButton}>
          <ThemedText style={[styles.stepGlyph, { color: theme.primary }]}>+</ThemedText>
        </AnimatedPressable>
      </View>

      <View style={styles.presetRow}>
        {PRESETS.map((preset) => (
          <Chip
            key={preset.label}
            label={preset.label}
            selected={daysUntil(value) === preset.days}
            onPress={() => onChange(addDays(new Date(), preset.days).toISOString())}
          />
        ))}
      </View>
    </FieldGroup>
  );
}

const styles = StyleSheet.create({
  display: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.two,
  },
  stepButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepGlyph: {
    fontSize: 20,
    fontWeight: '700',
  },
  dateTextWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.two,
  },
  dateText: {
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
