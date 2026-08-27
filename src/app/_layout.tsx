import type { PropsWithChildren } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { ThemeModeProvider, useThemeMode } from '@/hooks/use-theme-mode';

function NavigationThemeProvider({ children }: PropsWithChildren) {
  const { resolvedScheme } = useThemeMode();
  const theme = useTheme();

  return (
    <ThemeProvider
      value={{
        ...(resolvedScheme === 'dark' ? DarkTheme : DefaultTheme),
        colors: {
          ...(resolvedScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.border,
          primary: theme.primary,
        },
      }}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <NavigationThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="add-payment"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </NavigationThemeProvider>
    </ThemeModeProvider>
  );
}
