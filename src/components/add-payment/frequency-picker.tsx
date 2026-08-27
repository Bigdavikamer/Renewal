import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { FieldGroup } from '@/components/ui/field-group';
import { Spacing } from '@/constants/theme';
import type { BillingFrequency } from '@/types/subscription';
import { formatFrequency } from '@/utils/subscriptions';

// V1 only exposes the two frequencies people actually pick when adding a
// subscription; `weekly`/`quarterly` already work end-to-end in the model
// (see utils/subscriptions.ts) and just aren't offered here yet.
const FREQUENCY_OPTIONS: BillingFrequency[] = ['monthly', 'yearly'];

type FrequencyPickerProps = {
  value: BillingFrequency;
  onChange: (frequency: BillingFrequency) => void;
  error?: string;
};

export function FrequencyPicker({ value, onChange, error }: FrequencyPickerProps) {
  return (
    <FieldGroup label="Frequency" error={error}>
      <View style={styles.row}>
        {FREQUENCY_OPTIONS.map((frequency) => (
          <Chip
            key={frequency}
            label={formatFrequency(frequency)}
            selected={value === frequency}
            onPress={() => onChange(frequency)}
          />
        ))}
      </View>
    </FieldGroup>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
