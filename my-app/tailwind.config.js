// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 requires the preset — handles RN style transforms
  presets: [require('nativewind/preset')],

  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      // ── Colour tokens (mirrors your theme.css CSS variables) ──────────────
      colors: {
        background:   'var(--background)',
        foreground:   'var(--foreground)',
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT:    'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border:       'var(--border)',
        input:        'var(--input)',
        ring:         'var(--ring)',
      },

      // ── Border radius (mirrors --radius: 0.625rem = 10px) ────────────────
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
      },

      // ── Font families ─────────────────────────────────────────────────────
      fontFamily: {
        sans:  ['Inter-Regular', 'System'],
        mono:  ['SpaceMono-Regular', 'monospace'],
      },

      // ── Font weights matching --font-weight-normal / medium ───────────────
      fontWeight: {
        normal: '400',
        medium: '500',
      },
    },
  },

  plugins: [],
};