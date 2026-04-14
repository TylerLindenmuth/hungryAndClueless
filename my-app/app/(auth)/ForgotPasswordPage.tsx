import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../../src/theme/useTheme';
import { buildPath } from '../../src/api';

// ─── Forgot / Reset Password Page ───────────────────────────────────────────
// Drop this file at:  app/(auth)/ForgotPasswordPage.tsx
// Then add a route in your layout that renders <ForgotPasswordPage />.
// The component walks the user through two steps:
//   Step 1 – enter email  →  backend sends a reset code
//   Step 2 – enter code + new password  →  backend resets the password
// Adjust the API endpoint paths to match your actual backend routes.
// ─────────────────────────────────────────────────────────────────────────────

interface ForgotPasswordPageProps {
  onBack: () => void; // called when user wants to return to login
}

type Step = 'request' | 'reset' | 'success';

export default function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const { bg, card, text, muted, border, primary, inputBg, placeholder } = useTheme();

  // ── shared state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ── Step 1 – request reset code ───────────────────────────────────────────
  const handleRequestReset = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      // POST /api/forgot-password  →  { message: string }
      // Adjust this path to match your backend route.
      const response = await fetch(buildPath('api/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the server message if available, otherwise a generic fallback.
        // We intentionally keep the message vague so we don't reveal whether
        // an email address exists in our system.
        setError(data.message || 'Something went wrong. Please try again.');
        return;
      }

      // Move to step 2 regardless of whether the email exists (security best
      // practice – don't reveal which emails are registered).
      setStep('reset');
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 2 – submit code + new password ───────────────────────────────────
  const handleResetPassword = async () => {
    setError('');

    if (!code.trim()) {
      setError('Please enter the verification code from your email.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      // POST /api/reset-password  →  { message: string }
      const response = await fetch(buildPath('api/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          token: code.trim(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid or expired code. Please try again.');
        return;
      }

      setStep('success');
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Resend code ───────────────────────────────────────────────────────────
  const handleResend = async () => {
    setStep('request');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderInput = (
    value: string,
    setter: (v: string) => void,
    placeholder_: string,
    secure = false,
    keyboardType: any = 'default',
  ) => (
    <TextInput
      style={[styles.input, { backgroundColor: inputBg, borderColor: border, color: text }]}
      value={value}
      onChangeText={setter}
      placeholder={placeholder_}
      placeholderTextColor={placeholder}
      secureTextEntry={secure}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>

        {/* ── Header ── */}
        <Text style={[styles.title, { color: text }]}>
          {step === 'success' ? '✅ Password Reset' : 'Forgot Password'}
        </Text>

        {/* ── Step 1: Request reset code ── */}
        {step === 'request' && (
          <>
            <Text style={[styles.subtitle, { color: muted }]}>
              Enter the email address associated with your account and we'll send you a
              password reset link.
            </Text>

            {renderInput(email, setEmail, 'Email address', false, 'email-address')}

            {!!error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: primary }, isSubmitting && styles.buttonDisabled]}
              onPress={handleRequestReset}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Send Reset Email</Text>
              }
            </TouchableOpacity>
          </>
        )}

        {/* ── Step 2: Enter code + new password ── */}
        {step === 'reset' && (
          <>
            <Text style={[styles.subtitle, { color: muted }]}>
              We sent a verification code to <Text style={{ color: text, fontWeight: '600' }}>{email}</Text>.
              Enter it below along with your new password.
            </Text>

            {renderInput(code, setCode, 'Verification code', false, 'numeric')}
            {renderInput(newPassword, setNewPassword, 'New password (min 8 chars)', true)}
            {renderInput(confirmPassword, setConfirmPassword, 'Confirm new password', true)}

            {!!error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: primary }, isSubmitting && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Reset Password</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResend} style={styles.link}>
              <Text style={[styles.linkText, { color: primary }]}>Didn't receive an email? Resend</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Step 3: Success ── */}
        {step === 'success' && (
          <>
            <Text style={[styles.subtitle, { color: muted }]}>
              Your password has been reset successfully. You can now log in with your new
              password.
            </Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: primary }]}
              onPress={onBack}
            >
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Back link (shown on steps 1 & 2) ── */}
        {step !== 'success' && (
          <TouchableOpacity onPress={onBack} style={styles.link}>
            <Text style={[styles.linkText, { color: muted }]}>← Back to Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 28,
    gap: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  button: {
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: -4,
  },
  link: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  linkText: {
    fontSize: 14,
  },
});