import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { FieldGroup } from '@/components/ui/field-group';
import { Radii, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, onFocus, onBlur, multiline, ...rest }: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? theme.destructive : focused ? theme.primary : theme.border;

  return (
    <FieldGroup label={label} error={error}>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          { backgroundColor: theme.surface, borderColor, color: theme.text },
        ]}
        placeholderTextColor={theme.textMuted}
        multiline={multiline}
        accessibilityLabel={label}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...rest}
      />
    </FieldGroup>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 52,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight,
  },
  multiline: {
    minHeight: 88,
    paddingTop: Spacing.two,
    textAlignVertical: 'top',
  },
});
