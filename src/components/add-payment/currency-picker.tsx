import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { FieldGroup } from '@/components/ui/field-group';
import { Spacing } from '@/constants/theme';
import type { CurrencyCode } from '@/types/subscription';
import { SUPPORTED_CURRENCIES } from '@/utils/currency';

type CurrencyPickerProps = {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
  error?: string;
};

export function CurrencyPicker({ value, onChange, error }: CurrencyPickerProps) {
  return (
    <FieldGroup label="Currency" error={error}>
      <View style={styles.row}>
        {SUPPORTED_CURRENCIES.map((currency) => (
          <Chip
            key={currency}
            label={currency}
            selected={value === currency}
            onPress={() => onChange(currency)}
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
