import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../src/theme/ThemeContext';
import { tokenStorage, getUser } from '@/lib/tokenStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import type { User } from '@/lib/types';

export default function DashboardScreen() {
  const router     = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { isDark, toggle } = useThemeMode();
  const bg      = isDark ? '#09090b' : '#ffffff';
  const surface = isDark ? '#18181b' : '#f4f4f5';
  const text    = isDark ? '#fafafa' : '#09090b';
  const muted   = isDark ? '#a1a1aa' : '#71717a';
  const border  = isDark ? '#27272a' : '#e4e4e7';

  useEffect(() => {
    getUser().then(setUser).catch(() => {});
  }, []);

  async function handleLogout() {
    await tokenStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
    router.replace('/(auth)/AuthPage');
  }

  const cards = [
    {
      label: 'My Meals',
      sub:   'View and manage your saved meal library',
      icon:  'restaurant-outline' as const,
      route: '/(app)/MealLibrary',
    },
    {
      label: 'Meal Packages',
      sub:   'Browse curated meal package deals',
      icon:  'grid-outline' as const,
      route: '/(app)/MealPackages',
    },
    {
      label: 'What should I eat?',
      sub:   'Take the quiz to get a personalised recommendation',
      icon:  'help-circle-outline' as const,
      route: '/(app)/Quiz',
    },
  ];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <View style={[s.header, { borderBottomColor: border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[s.title, { color: text }]}>What do I want to eat?</Text>
          <Text style={[s.sub, { color: muted }]}>
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </Text>
        </View>

        <Pressable
            onPress={toggle}
            hitSlop={8}
            style={({ pressed }) => [
              {
                marginRight: 12,
                padding: 6,
                borderRadius: 8,
                backgroundColor: pressed ? border : 'transparent',
              },
            ]}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={muted}
            />
          </Pressable>

        <Pressable onPress={handleLogout} hitSlop={8}>
          <Ionicons name="log-out-outline" size={22} color={muted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {cards.map((c, i) => (
          <Pressable
            key={i}
            onPress={() => router.push(c.route as any)}
            style={({ pressed }) => [
              s.card,
              { backgroundColor: surface, borderColor: border },
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={[s.iconWrap, { backgroundColor: isDark ? '#1e3a5f' : '#eff6ff' }]}>
              <Ionicons name={c.icon} size={24} color="#2563eb" />
            </View>
            <View style={s.cardBody}>
              <Text style={[s.cardLabel, { color: text }]}>{c.label}</Text>
              <Text style={[s.cardSub,   { color: muted }]}>{c.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={muted} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1 },
  header:    {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title:     { fontSize: 18, fontWeight: '700' },
  sub:       { fontSize: 12, marginTop: 2 },
  scroll:    { padding: 16, gap: 8 },
  card:      {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 10, borderWidth: 1,
  },
  iconWrap:  {
    width: 38, height: 38, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  cardBody:  { flex: 1, gap: 2 },
  cardLabel: { fontSize: 14, fontWeight: '600' },
  cardSub:   { fontSize: 11 },
});