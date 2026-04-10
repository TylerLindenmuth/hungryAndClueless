import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemeProvider } from './ThemeContext';                        
import AuthPage from '../../app/(auth)/AuthPage';            
import Dashboard from '../../app/(app)/Dashboard';
import { retrieveToken, retrieveUser, clearToken, storeUser } from '../tokenStorage'; 
import type { User } from '../types/index';

function AppContent() {
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

  const handleLogin = (user: User) => setCurrentUser(user);

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

// ThemeProvider wraps everything so every useTheme() call in the tree works
export default function Root() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' },
});