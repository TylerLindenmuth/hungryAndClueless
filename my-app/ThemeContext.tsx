/**
 * ThemeContext.tsx
 *
 * Wraps the app so that toggleTheme() persists across the entire component
 * tree — not just within a single component. Place <ThemeProvider> at the
 * root in app/index.tsx (or app/_layout.tsx).
 *
 * Usage:
 *   // app/index.tsx
 *   import { ThemeProvider } from '../src/theme/ThemeContext';
 *   export default function Root() {
 *     return <ThemeProvider><App /></ThemeProvider>;
 *   }
 */

import React, { createContext, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';

export interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  // Start from the system preference; user can override with the toggle button
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}