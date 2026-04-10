import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem('token_data', token);
  } catch (e) {
    console.log('storeToken error:', e);
  }
}

export async function retrieveToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('token_data');
  } catch (e) {
    console.log('retrieveToken error:', e);
    return null;
  }
}

export async function clearToken(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(['token_data', 'user_data']);
  } catch (e) {
    console.log('clearToken error:', e);
  }
}

export async function storeUser(user: object): Promise<void> {
  try {
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
  } catch (e) {
    console.log('storeUser error:', e);
  }
}

export async function retrieveUser(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('user_data');
  } catch (e) {
    console.log('retrieveUser error:', e);
    return null;
  }
}