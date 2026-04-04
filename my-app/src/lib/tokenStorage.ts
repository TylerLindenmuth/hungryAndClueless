import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/lib/constants';
import type { User } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// Low-level cross-platform storage
//   Native  → expo-secure-store (Keychain on iOS, Keystore on Android)
//   Web     → localStorage (mirrors original Vite tokenStorage.ts behaviour)
// Use this for sensitive values like auth tokens.
// For non-sensitive data (user profile, meal list) use the helpers below which
// go through AsyncStorage so large payloads don't hit SecureStore size limits.
// ─────────────────────────────────────────────────────────────────────────────
export const tokenStorage = {
  async get(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') return localStorage.getItem(key);
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
      await SecureStore.setItemAsync(key, value);
    } catch {
      console.warn('tokenStorage.set failed for key:', key);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
      await SecureStore.deleteItemAsync(key);
    } catch {
      console.warn('tokenStorage.remove failed for key:', key);
    }
  },

  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.clear();
      return;
    }
    // SecureStore has no bulk-clear; remove known keys individually
    await Promise.allSettled([
      SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN),
    ]);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Auth token helpers (SecureStore on native, localStorage on web)
// ─────────────────────────────────────────────────────────────────────────────
export const getToken    = () => tokenStorage.get(STORAGE_KEYS.AUTH_TOKEN);
export const saveToken   = (token: string) => tokenStorage.set(STORAGE_KEYS.AUTH_TOKEN, token);
export const removeToken = () => tokenStorage.remove(STORAGE_KEYS.AUTH_TOKEN);

// ─────────────────────────────────────────────────────────────────────────────
// User data helpers (AsyncStorage — no size limit concerns)
// User objects can be large (many meals), so AsyncStorage is more appropriate
// than SecureStore which has a ~2KB value limit on some Android devices.
// ─────────────────────────────────────────────────────────────────────────────
export const saveUser = (user: User): Promise<void> =>
  AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

export const getUser = async (): Promise<User | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const removeUser = (): Promise<void> =>
  AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);

// ─────────────────────────────────────────────────────────────────────────────
// User list helpers (all registered accounts)
// ─────────────────────────────────────────────────────────────────────────────
export const getUsers = async (): Promise<User[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: User[]): Promise<void> =>
  AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

// ─────────────────────────────────────────────────────────────────────────────
// Full logout — clears token (SecureStore) + user session (AsyncStorage)
// ─────────────────────────────────────────────────────────────────────────────
export const clearSession = async (): Promise<void> => {
  await Promise.allSettled([
    tokenStorage.remove(STORAGE_KEYS.AUTH_TOKEN),
    AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
  ]);
};