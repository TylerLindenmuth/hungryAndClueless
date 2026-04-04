/**
 * tokens.ts — design token source of truth.
 * Mirrors every CSS variable in theme.css / globals.css.
 */

import { useColorScheme } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Base type (shared shape for both themes)
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeTokens = {
  background: string;
  card: string;
  popover: string;
  muted: string;
  accent: string;
  sidebar: string;
  sidebarAccent: string;

  foreground: string;
  cardForeground: string;
  popoverForeground: string;
  mutedForeground: string;
  accentForeground: string;
  sidebarForeground: string;
  sidebarAccentForeground: string;

  primary: string;
  primaryForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;

  secondary: string;
  secondaryForeground: string;

  destructive: string;
  destructiveForeground: string;

  border: string;
  input: string;
  inputBackground: string;
  switchBackground: string;
  ring: string;
  sidebarBorder: string;
  sidebarRing: string;

  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;

  fontWeightNormal: '400' | '500';
  fontWeightMedium: '400' | '500';

  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  radiusXl: number;

  fontSize: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Light theme
// ─────────────────────────────────────────────────────────────────────────────

export const lightTokens = {
  background: '#f8fafc',
  card: '#ffffff',
  popover: '#ffffff',
  muted: '#f1f5f9',
  accent: '#dbeafe',
  sidebar: '#ffffff',
  sidebarAccent: '#f8fafc',

  foreground: '#0f172a',
  cardForeground: '#0f172a',
  popoverForeground: '#0f172a',
  mutedForeground: '#64748b',
  accentForeground: '#1e40af',
  sidebarForeground: '#0f172a',
  sidebarAccentForeground: '#0f172a',

  primary: '#2563eb',
  primaryForeground: '#ffffff',
  sidebarPrimary: '#2563eb',
  sidebarPrimaryForeground: '#ffffff',

  secondary: '#e2e8f0',
  secondaryForeground: '#0f172a',

  destructive: '#dc2626',
  destructiveForeground: '#ffffff',

  border: '#cbd5e1',
  input: 'transparent',
  inputBackground: '#ffffff',
  switchBackground: '#e2e8f0',
  ring: '#2563eb',
  sidebarBorder: '#cbd5e1',
  sidebarRing: '#2563eb',

  chart1: '#2563eb',
  chart2: '#3b82f6',
  chart3: '#60a5fa',
  chart4: '#93c5fd',
  chart5: '#dbeafe',

  fontWeightNormal: '400',
  fontWeightMedium: '500',

  radiusSm: 6,
  radiusMd: 8,
  radiusLg: 10,
  radiusXl: 14,

  fontSize: 16,
} satisfies ThemeTokens;

// ─────────────────────────────────────────────────────────────────────────────
// Dark theme
// ─────────────────────────────────────────────────────────────────────────────

export const darkTokens = {
  background: '#0f172a',
  card: '#1e293b',
  popover: '#1e293b',
  muted: '#1e293b',
  accent: '#1e40af',
  sidebar: '#1e293b',
  sidebarAccent: '#334155',

  foreground: '#f1f5f9',
  cardForeground: '#f1f5f9',
  popoverForeground: '#f1f5f9',
  mutedForeground: '#94a3b8',
  accentForeground: '#e0e7ff',
  sidebarForeground: '#f1f5f9',
  sidebarAccentForeground: '#f1f5f9',

  primary: '#3b82f6',
  primaryForeground: '#ffffff',
  sidebarPrimary: '#3b82f6',
  sidebarPrimaryForeground: '#ffffff',

  secondary: '#334155',
  secondaryForeground: '#f1f5f9',

  destructive: '#ef4444',
  destructiveForeground: '#ffffff',

  border: '#334155',
  input: '#1e293b',
  inputBackground: '#1e293b',
  switchBackground: '#334155',
  ring: '#3b82f6',
  sidebarBorder: '#334155',
  sidebarRing: '#3b82f6',

  chart1: '#3b82f6',
  chart2: '#60a5fa',
  chart3: '#93c5fd',
  chart4: '#bfdbfe',
  chart5: '#dbeafe',

  fontWeightNormal: '400',
  fontWeightMedium: '500',

  radiusSm: 6,
  radiusMd: 8,
  radiusLg: 10,
  radiusXl: 14,

  fontSize: 16,
} satisfies ThemeTokens;

// ─────────────────────────────────────────────────────────────────────────────
// Color-only tokens (useful for StyleSheet)
// ─────────────────────────────────────────────────────────────────────────────

export type ColorTokens = {
  [K in keyof ThemeTokens as ThemeTokens[K] extends string ? K : never]: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Theme mode
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark';

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useThemeTokens(): ThemeTokens {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTokens : lightTokens;
}

// ─────────────────────────────────────────────────────────────────────────────
// Standalone helpers
// ─────────────────────────────────────────────────────────────────────────────

export const radius = {
  sm: lightTokens.radiusSm,
  md: lightTokens.radiusMd,
  lg: lightTokens.radiusLg,
  xl: lightTokens.radiusXl,
} as const;

export const fontWeight = {
  normal: lightTokens.fontWeightNormal,
  medium: lightTokens.fontWeightMedium,
} as const;

export const fontSize = {
  base: lightTokens.fontSize,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Typography scale
// ─────────────────────────────────────────────────────────────────────────────

export const TypeScale = {
  h1: { fontSize: 24, fontWeight: '500' as const, lineHeight: 36 },
  h2: { fontSize: 20, fontWeight: '500' as const, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '500' as const, lineHeight: 27 },
  h4: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  label: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  sm: { fontSize: 14, fontWeight: '400' as const, lineHeight: 21 },
  xs: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  btn: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Default export
// ─────────────────────────────────────────────────────────────────────────────

const tokens = {
  light: lightTokens,
  dark: darkTokens,
  radius,
  fontWeight,
  fontSize,
  TypeScale,
};

export default tokens;