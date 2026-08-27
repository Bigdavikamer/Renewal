import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemeMode = 'system' | 'dark' | 'light';
export type ResolvedScheme = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedScheme: ResolvedScheme;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

/**
 * Renewal defaults to dark regardless of OS preference until a Settings
 * screen exposes System/Dark/Light. Everything below is already wired so
 * that screen only needs to call `setMode`.
 */
const DEFAULT_MODE: ThemeMode = 'dark';

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_MODE);

  const resolvedScheme = useMemo<ResolvedScheme>(() => {
    if (mode === 'system') return systemScheme === 'light' ? 'light' : 'dark';
    return mode;
  }, [mode, systemScheme]);

  const value = useMemo(() => ({ mode, setMode, resolvedScheme }), [mode, resolvedScheme]);

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}
