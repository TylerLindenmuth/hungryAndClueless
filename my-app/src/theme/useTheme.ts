/**
 * useTheme.ts
 *
 * Provides TWO access patterns so every component works without changes:
 *
 *   1. colors object  →  const { colors } = useTheme()
 *      Used by: Card, Modal, Input, Badge, Avatar, Button
 *
 *   2. Flat aliases   →  const { bg, text, primary } = useTheme()
 *      Used by: screens, legacy components
 *
 * Both read from the same token map so they're always in sync.
 */

import { useColorScheme } from 'react-native';
import { lightTokens, darkTokens, TypeScale, type ThemeTokens } from './tokens';

// ── colors sub-object shape ───────────────────────────────────────────────────
export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  inputBackground: string;
  ring: string;

  // add this line:
  switchBackground: string;
}

// ── Full theme shape ──────────────────────────────────────────────────────────
export interface Theme {
  /** Structured colors — used by Card, Modal, Input, Badge, Avatar */
  colors: ThemeColors;
  /** Complete token map — every CSS variable as a typed key */
  t: ThemeTokens;
  /** True when device is in dark mode */
  isDark: boolean;
  /** Typography scale: h1–h4, label, body, sm, xs, btn */
  type: typeof TypeScale;

  // Flat shorthand aliases
  bg:          string;
  card:        string;
  text:        string;
  muted:       string;
  surface:     string;
  secondary:   string;
  border:      string;
  inputBg:     string;
  primary:     string;
  primaryText: string;
  destructive: string;
  accent:      string;
  accentText:  string;
  placeholder: string;
  errorBg:     string;
}

export type UseThemeReturn = Theme;

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const t = isDark ? darkTokens : lightTokens;

const colors: ThemeColors = {
  background: t.background,
  foreground: t.foreground,
  card: t.card,
  cardForeground: t.cardForeground,
  popover: t.popover,
  popoverForeground: t.popoverForeground,
  primary: t.primary,
  primaryForeground: t.primaryForeground,
  secondary: t.secondary,
  secondaryForeground: t.secondaryForeground,
  muted: t.muted,
  mutedForeground: t.mutedForeground,
  accent: t.accent,
  accentForeground: t.accentForeground,
  destructive: t.destructive,
  destructiveForeground: t.destructiveForeground,
  border: t.border,
  input: t.input,
  inputBackground: t.inputBackground,
  ring: t.ring,

  // add this line:
  switchBackground: t.switchBackground,
};

  return {
    colors,
    t,
    isDark,
    type: TypeScale,

    bg:          t.background,
    card:        t.card,
    text:        t.foreground,
    muted:       t.mutedForeground,
    surface:     t.muted,
    secondary:   t.secondary,
    border:      t.border,
    inputBg:     t.inputBackground,
    primary:     t.primary,
    primaryText: t.primaryForeground,
    destructive: t.destructive,
    accent:      t.accent,
    accentText:  t.accentForeground,
    placeholder: isDark ? '#6B7280' : '#9CA3AF',
    errorBg:     isDark ? '#450A0A' : '#FEF2F2',
  };
}

/**
 * useThemeColor — pick one color by token name.
 *   const border = useThemeColor('border');
 */
export function useThemeColor(key: keyof ThemeColors): string {
  return useTheme().colors[key];
}