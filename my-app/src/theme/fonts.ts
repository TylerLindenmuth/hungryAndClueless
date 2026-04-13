import { useFonts as useExpoFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export function useFonts(): boolean {
  const [loaded, error] = useExpoFonts({
    'Inter-Regular': require('../../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter_18pt-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  return loaded;
}