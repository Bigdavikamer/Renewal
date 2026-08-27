/**
 * Renewal design tokens: colors (light/dark), spacing, radii, and typography.
 * Kept intentionally small — extend only when a new screen genuinely needs it.
 */

import '@/global.css';

export const Colors = {
  light: {
    background: '#F6F6FB',
    surface: '#FFFFFF',
    surfaceElevated: '#F0F0F7',
    text: '#15151F',
    textSecondary: '#5B5C6B',
    textMuted: '#93949F',
    border: '#E5E5EE',
    primary: '#6C63FF',
    primarySoft: 'rgba(108, 99, 255, 0.12)',
    success: '#1F9D63',
    warning: '#B9720F',
    destructive: '#D14343',
  },
  dark: {
    background: '#0E0E14',
    surface: '#1A1A24',
    surfaceElevated: '#22222F',
    text: '#F4F4FA',
    textSecondary: '#B2B3C2',
    textMuted: '#797A8A',
    border: '#2A2A38',
    primary: '#8B84FF',
    primarySoft: 'rgba(139, 132, 255, 0.16)',
    success: '#37C883',
    warning: '#E0A23D',
    destructive: '#F0685C',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Restrained accent palette used only for avatar placeholders, so payment
 * rows stay scannable by category without leaning on the purple brand accent.
 */
export const AvatarAccents = [
  '#8B84FF', // indigo (brand)
  '#4FD1C5', // teal
  '#F0B429', // amber
  '#F472B6', // pink
  '#5AC8FA', // sky
  '#34D399', // emerald
] as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const Typography = {
  hero: { fontSize: 44, fontWeight: '700', lineHeight: 50 },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '500', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '700', lineHeight: 16, letterSpacing: 0.6 },
} as const;

export const MaxContentWidth = 800;
