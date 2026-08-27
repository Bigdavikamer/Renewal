import { useEffect, type PropsWithChildren } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';

import { useNotificationRouting } from '@/hooks/use-notification-routing';
import { useTheme } from '@/hooks/use-theme';
import { ThemeModeProvider, useThemeMode } from '@/hooks/use-theme-mode';
import { configureNotifications } from '@/notifications/client';

function NavigationThemeProvider({ children }: PropsWithChildren) {
  const { resolvedScheme } = useThemeMode();
  const theme = useTheme();

  // Configuration only (foreground behavior + Android channel) — never
  // prompts for permission, so this is safe to run on every launch.
  useEffect(() => {
    configureNotifications();
  }, []);

  useNotificationRouting();

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
          <Stack.Screen name="subscription/[id]" />
          <Stack.Screen
            name="edit-payment/[id]"
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
