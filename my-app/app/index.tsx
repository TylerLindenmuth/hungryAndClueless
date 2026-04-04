import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { getToken } from '@/lib/tokenStorage';

/**
 * Entry point. Reads the stored auth token and redirects immediately:
 *   token found  → (tabs) — the main tab navigator
 *   no token     → (app)/AuthPage — login screen
 *
 * The ActivityIndicator is shown only for the brief async moment before
 * the redirect fires; users should never see it for more than ~100ms.
 */
export default function Index() {
  useEffect(() => {
    async function redirect() {
      try {
        const token = await getToken();
        if (token) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/AuthPage');
        }
      } catch {
        router.replace('/(auth)/AuthPage');
      }
    }
    redirect();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
});