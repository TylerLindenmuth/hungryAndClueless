// NativeWind: must be imported once at the root — do not remove
import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useAppFonts } from '@/theme/fonts';
import { ThemeProvider, useThemeMode } from '@/theme/ThemeContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loaded = useAppFonts();
  if (!loaded) return null;
  return (
    // ThemeProvider must wrap everything so useThemeMode() works in all screens
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  // Read isDark from our context (not system directly) so manual toggles take effect
  const { isDark } = useThemeMode();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index"   options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"  options={{ headerShown: false }} />
        <Stack.Screen name="(auth)"  options={{ headerShown: false }} />
        <Stack.Screen name="(app)"   options={{ headerShown: false }} />
        <Stack.Screen name="modal"   options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </NavThemeProvider>
  );
}