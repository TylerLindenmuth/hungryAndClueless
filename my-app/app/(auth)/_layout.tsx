import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { getToken } from '@/lib/tokenStorage';

export default function AuthLayout() {
  // If the user already has a token, skip login entirely
  useEffect(() => {
    async function checkAlreadyAuthed() {
      const token = await getToken();
      if (token) router.replace('/(tabs)');
    }
    checkAlreadyAuthed();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthPage" />
    </Stack>
  );
}