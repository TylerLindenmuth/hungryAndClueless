/**
 * theme/ThemeContext.tsx
 *
 * Cross-platform theme context for React Native + Expo.
 * Replaces the web-only localStorage version.
 *
 * - Reads the saved preference from AsyncStorage on mount
 * - Falls back to the device's system color scheme
 * - Persists the user's manual override via AsyncStorage
 * - Exposes { isDark, toggle } — same API as the old web version
 *
 * Wrap the root in app/_layout.tsx:
 *   <ThemeProvider><Stack /></ThemeProvider>
 *
 * Then in any component:
 *   const { isDark, toggle } = useThemeMode();
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'user_theme_preference'; // stored as 'dark' | 'light'

// ── Context shape ─────────────────────────────────────────────────────────────
interface ThemeContextType {
  /** True when the active theme is dark */
  isDark: boolean;
  /** Toggle between light and dark, persisting the choice */
  toggle: () => void;
  /** True while AsyncStorage hasn't resolved yet — use to avoid flash */
  isLoading: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggle: () => {},
  isLoading: true,
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const systemDark = systemScheme === 'dark';
  const [isDark, setIsDark] = useState(false);
  const [isLoading,        setIsLoading]        = useState(true);
  const [hasManualPref,    setHasManualPref]    = useState(false);

  // Read saved preference once on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        if (saved === 'dark')  { setIsDark(true);  setHasManualPref(true); }
        if (saved === 'light') { setIsDark(false); setHasManualPref(true); }
        // null / undefined → no manual pref, keep following system
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // If user hasn't manually overridden, follow system changes live
  useEffect(() => {
    if (!hasManualPref) setIsDark(systemDark);
  }, [systemDark, hasManualPref]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      setHasManualPref(true);
      AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggle, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useThemeMode(): ThemeContextType {
  return useContext(ThemeContext);
}