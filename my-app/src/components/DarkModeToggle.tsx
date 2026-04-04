// src/components/DarkModeToggle.tsx
import { Moon, Sun } from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';

export function DarkModeToggle() {
  const { isDark, toggle } = useThemeMode();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-accent-foreground" />
      )}
    </button>
  );
}