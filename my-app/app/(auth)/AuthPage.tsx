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
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import type { User } from '../../src/types';

// ─── Types ─────────────────────────────────────────────

interface JwtPayload {
  userId: string;
  name: string;
  email: string;
}

interface AuthPageProps {
  onLogin: (user: User) => void;
}

type ViewMode = 'auth' | 'forgotPassword' | 'forgotPasswordSuccess';

// ─── Component ─────────────────────────────────────────

export default function AuthPage({ onLogin }: AuthPageProps) {
  const { bg, card, text, muted, border, primary, inputBg, placeholder, destructive } = useTheme();

  const [viewMode, setViewMode] = useState<ViewMode>('auth');
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  // ─── helpers ─────────────────────────────

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const goToForgotPassword = () => {
    setForgotEmail(email);
    setForgotError('');
    setViewMode('forgotPassword');
  };

  const goBackToAuth = () => {
    setError('');
    setViewMode('auth');
  };

  // ─── submit auth ─────────────────────────

  const handleSubmit = async () => {
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const route = isLogin ? 'api/login' : 'api/register';

      const response = await fetch(buildPath(route), {
        method: 'POST',
        body: JSON.stringify(
          isLogin
            ? { email, password }
            : { name, email, password }
        ),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();

      if (res.error) {
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
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── forgot password ─────────────────────

  const handleForgotPassword = async () => {
    setForgotError('');

    if (!forgotEmail) {
      setForgotError('Please enter your email address.');
      return;
    }

    if (!validateEmail(forgotEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setIsSendingReset(true);

    try {
      await fetch(buildPath('api/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });

      setViewMode('forgotPasswordSuccess');
    } catch {
      setForgotError('Network error. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  // ─── UI: SUCCESS ─────────────────────────

  if (viewMode === 'forgotPasswordSuccess') {
    return (
      <ScreenWrapper>
        <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={[styles.card, { backgroundColor: card }]}>
              <Text style={[styles.title, { color: text }]}>Check Your Email</Text>

              <Text style={[styles.subtitle, { color: muted }]}>
                If an account exists for {forgotEmail}, a reset link will be sent.
              </Text>

              <TouchableOpacity style={[styles.button, { backgroundColor: primary }]} onPress={goBackToAuth}>
                <Text style={styles.buttonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenWrapper>
    );
  }

  // ─── UI: FORGOT PASSWORD ────────────────

  if (viewMode === 'forgotPassword') {
    return (
      <ScreenWrapper>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={[styles.card, { backgroundColor: card }]}>
              <Text style={[styles.title, { color: text }]}>Reset Password</Text>

              <TextInput
                style={[styles.input, { borderColor: border, backgroundColor: inputBg, color: text }]}
                value={forgotEmail}
                onChangeText={setForgotEmail}
                placeholder="Email"
                placeholderTextColor={placeholder}
              />

              {!!forgotError && (
                <Text style={[styles.error, { color: destructive }]}>{forgotError}</Text>
              )}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: primary }]}
                onPress={handleForgotPassword}
                disabled={isSendingReset}
              >
                {isSendingReset ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={goBackToAuth}>
                <Text style={[styles.switchLink, { color: primary }]}>← Back</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenWrapper>
    );
  }

  // ─── UI: AUTH ───────────────────────────

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={[styles.card, { backgroundColor: card }]}>
            <Text style={[styles.title, { color: text }]}>What Do I Want to Eat?</Text>

            {!isLogin && (
              <TextInput
                style={[styles.input, { borderColor: border, backgroundColor: inputBg, color: text }]}
                placeholder="Name"
                placeholderTextColor={placeholder}
                value={name}
                onChangeText={setName}
              />
            )}

            <TextInput
              style={[styles.input, { borderColor: border, backgroundColor: inputBg, color: text }]}
              placeholder="Email"
              placeholderTextColor={placeholder}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={[styles.input, { borderColor: border, backgroundColor: inputBg, color: text }]}
              placeholder="Password"
              placeholderTextColor={placeholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {isLogin && (
              <TouchableOpacity onPress={goToForgotPassword}>
                <Text style={[styles.switchLink, { color: primary }]}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {!!error && <Text style={[styles.error, { color: destructive }]}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: primary }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={switchMode}>
              <Text style={[styles.switchLink, { color: primary }]}>
                {isLogin ? 'Create account' : 'Back to login'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

// ─── styles ───────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: { borderRadius: 16, padding: 24 },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 16 },
  subtitle: { textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '500' },
  error: { marginBottom: 10 },
  switchLink: { textAlign: 'center', marginTop: 12, fontWeight: '500' },
});