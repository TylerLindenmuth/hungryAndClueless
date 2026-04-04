/**
 * fonts.ts — font loading config for Expo.
 * Exports useFonts (hook) and fontFamilies (constant map) to match the barrel index.ts.
 */

import { useFonts as useExpoFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export type FontFamilyName =
  | 'Inter-Regular'
  | 'Inter-Medium'
  | 'Inter-SemiBold'
  | 'Inter-Bold'
  | 'SpaceMono-Regular';

/**
 * fontFamilies — reference map so components never use raw strings.
 * Uncomment Inter entries after adding the .ttf files to assets/fonts/.
 */
export const fontFamilies: Record<string, FontFamilyName | undefined> = {
  regular:  'Inter-Regular',
  medium:   'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold:     'Inter-Bold',
  mono:     'SpaceMono-Regular',
  system:   undefined,
};

/**
 * useFonts — loads all app fonts and hides the splash screen when ready.
 * Named export matches the barrel: import { useFonts } from '@/src'
 */
export function useFonts(): boolean {
  const [loaded, error] = useExpoFonts({
    'SpaceMono-Regular': require('../../assets/fonts/SpaceMono-Regular.ttf'),
    // Uncomment after adding Inter .ttf files to assets/fonts/:
    // 'Inter-Regular':  require('../../assets/fonts/Inter-Regular.ttf'),
    // 'Inter-Medium':   require('../../assets/fonts/Inter-Medium.ttf'),
    // 'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
    // 'Inter-Bold':     require('../../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => { if (error) throw error; }, [error]);
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);

  return loaded;
}

/** @deprecated use useFonts() — kept for backward compat */
export const useAppFonts = useFonts;