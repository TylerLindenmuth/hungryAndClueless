import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { buildPath } from '../../src/api';
import { storeToken, storeUser } from '../../src/tokenStorage';
import { useTheme } from '../../src/theme/useTheme';
import type { User } from '../../src/types';

interface JwtPayload {
  userId: string;
  name: string;
  email: string;
}

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const { bg, card, text, muted, border, primary, inputBg, placeholder, destructive } = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const route = isLogin ? 'api/login' : 'api/register';
      const body = isLogin ? { email, password } : { name, email, password };

      const response = await fetch(buildPath(route), {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();
      if (res.error && res.error.length > 0) {
        setError(res.error);
        return;
      }

      const { accessToken } = res;
      await storeToken(accessToken);
      const decoded = jwtDecode<JwtPayload>(accessToken);

      const user: User = {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        meals: [],
      };

      await storeUser(user);
      onLogin(user);
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.title, { color: text }]}>What Do I Want to Eat?</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Never be indecisive about meals again</Text>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: text }]}>Name</Text>
              <TextInput
                style={[styles.input, { borderColor: border, backgroundColor: inputBg, color: text }]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={placeholder}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: text }]}>Email</Text>
            <TextInput
              style={[styles.input, { borderColor: border, backgroundColor: inputBg, color: text }]}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: text }]}>Password</Text>
            <TextInput
              style={[styles.input, { borderColor: border, backgroundColor: inputBg, color: text }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={placeholder}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {error ? <Text style={[styles.error, { color: destructive }]}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: primary }, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: muted }]}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setError(''); }}>
              <Text style={[styles.switchLink, { color: primary }]}>
                {isLogin ? 'Sign up' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: {
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { fontSize: 24, fontWeight: '500', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: { fontSize: 13, marginBottom: 12 },
  button: { borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '500' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' },
  switchText: { fontSize: 14 },
  switchLink: { fontSize: 14, fontWeight: '500' },
});