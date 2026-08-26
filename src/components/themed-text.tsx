import { Text, type TextProps } from 'react-native';

import { Typography, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextVariant = keyof typeof Typography;

export type ThemedTextProps = TextProps & {
  variant?: ThemedTextVariant;
  color?: ThemeColor;
};

export function ThemedText({ style, variant = 'body', color, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[{ color: theme[color ?? 'text'] }, Typography[variant], style]}
      {...rest}
    />
  );
}
