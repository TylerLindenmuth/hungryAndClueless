import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { saveToken } from '@/lib/tokenStorage';
import { useThemeMode } from '@/theme/ThemeContext';  
import { Ionicons } from '@expo/vector-icons';         

export default function AuthPage() {
  const router  = useRouter();
  const { isDark, toggle } = useThemeMode();     
  const bg      = isDark ? '#09090b' : '#ffffff';
  const surface = isDark ? '#18181b' : '#f4f4f5';
  const text    = isDark ? '#fafafa' : '#09090b';
  const muted   = isDark ? '#a1a1aa' : '#71717a';
  const border  = isDark ? '#27272a' : '#e4e4e7';

  const [mode,     setMode]     = useState<'login' | 'signup'>('login');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit() {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }
    setLoading(true); setError('');
    try {
      await new Promise(r => setTimeout(r, 800)); // TODO: replace with real API
      await saveToken('mock-token-' + Date.now());
      router.replace('/(app)/Dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* App title */}
          <View style={s.heroWrap}>
            {/* Dark mode toggle — top right */}
            <Pressable onPress={toggle} style={s.toggleBtn} hitSlop={8}>
              <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color={muted}
              />
            </Pressable>

            <Text style={[s.heroTitle, { color: text }]}>What do I want to eat?</Text>
            <Text style={[s.heroSub, { color: muted }]}>Never be indecisive about meals again</Text>
          </View>

          {/* Form card */}
          <View style={[s.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[s.cardTitle, { color: text }]}>
              {mode === 'login' ? 'Sign in to your account' : 'Create an account'}
            </Text>

            {error ? (
              <View style={s.errorBox}>
                <Text style={s.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Name — signup only */}
            {mode === 'signup' && (
              <View style={s.field}>
                <Text style={[s.label, { color: text }]}>Name</Text>
                <TextInput
                  style={[s.input, { backgroundColor: bg, borderColor: border, color: text }]}
                  placeholder="Your name"
                  placeholderTextColor={muted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            {/* Email */}
            <View style={s.field}>
              <Text style={[s.label, { color: text }]}>Email</Text>
              <TextInput
                style={[s.input, { backgroundColor: bg, borderColor: border, color: text }]}
                placeholder="your@email.com"
                placeholderTextColor={muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={s.field}>
              <Text style={[s.label, { color: text }]}>Password</Text>
              <TextInput
                style={[s.input, { backgroundColor: bg, borderColor: border, color: text }]}
                placeholder="••••••••"
                placeholderTextColor={muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Submit */}
            <Pressable
              style={({ pressed }) => [s.btn, pressed && { opacity: 0.85 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.btnText}>
                    {mode === 'login' ? 'Sign in' : 'Create account'}
                  </Text>
              }
            </Pressable>

            {/* Toggle */}
            <View style={s.toggleRow}>
              <Text style={[s.toggleText, { color: muted }]}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              </Text>
              <Pressable onPress={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); }}>
                <Text style={s.link}>{mode === 'login' ? 'Sign up' : 'Sign in'}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1 },
  flex:       { flex: 1 },
  scroll:     { flexGrow: 1, justifyContent: 'center', padding: 24 },
  heroWrap:   { alignItems: 'center', marginBottom: 32, gap: 8 },
  heroTitle:  { fontSize: 26, fontWeight: '700', textAlign: 'center' },
  heroSub:    { fontSize: 14, textAlign: 'center' },
  card:       { borderRadius: 16, borderWidth: 1, padding: 24, gap: 16 },
  cardTitle:  { fontSize: 18, fontWeight: '600' },
  errorBox:   { backgroundColor: '#fef2f2', borderRadius: 8, padding: 12 },
  errorText:  { color: '#ef4444', fontSize: 13 },
  field:      { gap: 6 },
  label:      { fontSize: 13, fontWeight: '500' },
  input:      { height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, fontSize: 15 },
  btn:        { backgroundColor: '#2563eb', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center' },
  btnText:    { color: '#fff', fontWeight: '700', fontSize: 15 },
  toggleRow:  { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  toggleText: { fontSize: 13 },
  link:       { fontSize: 13, color: '#2563eb', fontWeight: '600' },
  toggleBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  }
});