import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { FieldGroup } from '@/components/ui/field-group';
import { Spacing } from '@/constants/theme';
import { REMINDER_OPTIONS } from '@/notifications/reminders';

type ReminderPickerProps = {
  value: number | null;
  onChange: (value: number | null) => void;
};

/** Shared by Add Payment and Edit Payment via `PaymentForm` — not duplicated. */
export function ReminderPicker({ value, onChange }: ReminderPickerProps) {
  return (
    <FieldGroup label="Remind me">
      <View style={styles.row}>
        {REMINDER_OPTIONS.map((option) => (
          <Chip
            key={option.label}
            label={option.label}
            selected={value === option.value}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </FieldGroup>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
