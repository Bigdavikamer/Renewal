import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { FieldGroup } from '@/components/ui/field-group';
import { CATEGORIES } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { getAvatarAccent } from '@/utils/avatar';

type CategoryPickerProps = {
  value: string;
  onChange: (category: string) => void;
  error?: string;
};

export function CategoryPicker({ value, onChange, error }: CategoryPickerProps) {
  return (
    <FieldGroup label="Category" error={error}>
      <View style={styles.wrap}>
        {CATEGORIES.map((category) => (
          <Chip
            key={category}
            label={category}
            selected={value === category}
            accentColor={getAvatarAccent(category)}
            onPress={() => onChange(category)}
          />
        ))}
      </View>
    </FieldGroup>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
