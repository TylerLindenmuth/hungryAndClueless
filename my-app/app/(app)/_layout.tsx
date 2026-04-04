import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getToken } from '@/lib/tokenStorage';

/**
 * (app) group layout — wraps Dashboard, MealLibrary, MealPackages, Quiz.
 * NO font loading here — that only happens in the root app/_layout.tsx.
 */
export default function AppGroupLayout() {
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();
      if (!token) router.replace('/(auth)/AuthPage');
    }
    checkAuth();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
        },
        headerTintColor: isDark ? '#F9FAFB' : '#111827',
        headerShadowVisible: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" />
      <Stack.Screen name="MealLibrary" />
      <Stack.Screen name="MealPackages" />
      <Stack.Screen name="Quiz" />
    </Stack>
  );
}