import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthPage } from './(auth)/AuthPage';
import { Dashboard } from './(app)/Dashboard';
import { retrieveToken, retrieveUser, clearToken, storeUser } from '../src/lib/tokenStorage';
import type { User } from '../src/types/index.ts';

export default function RootLayout() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [savedUser, token] = await Promise.all([retrieveUser(), retrieveToken()]);
        if (savedUser && token) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.log('Session restore error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await clearToken();
    setCurrentUser(null);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    await storeUser(updatedUser);
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      user={currentUser}
      onLogout={handleLogout}
      onUpdateUser={handleUpdateUser}
    />
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' },
});