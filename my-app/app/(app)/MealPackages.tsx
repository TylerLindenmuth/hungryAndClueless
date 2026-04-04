import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MealPackage {
  id: string;
  name: string;
  description: string;
  meals: string[];
  price?: string;
  tag?: string;
}

const PACKAGES: MealPackage[] = [
  {
    id: '1',
    name: 'Quick Weeknight Pack',
    description: 'Fast, easy meals ready in under 30 minutes',
    meals: ["McDonald's", 'Taco Bell', 'Frozen Pizza', 'Ramen'],
    price: 'Free',
    tag: 'Popular',
  },
  {
    id: '2',
    name: 'Healthy Eating Pack',
    description: 'Balanced meals to support your goals',
    meals: ['Grilled Chicken', 'Sushi', 'Greek Salad', 'Smoothie Bowl'],
    price: 'Free',
    tag: 'New',
  },
  {
    id: '3',
    name: 'Comfort Food Pack',
    description: 'Hearty meals for when you need a pick-me-up',
    meals: ['Spaghetti', 'Mac & Cheese', 'Grilled Cheese', 'Soup'],
    price: 'Free',
  },
];

export default function MealPackagesScreen() {
  const isDark  = useColorScheme() === 'dark';
  const bg      = isDark ? '#09090b' : '#ffffff';
  const surface = isDark ? '#18181b' : '#f4f4f5';
  const text    = isDark ? '#fafafa' : '#09090b';
  const muted   = isDark ? '#a1a1aa' : '#71717a';
  const border  = isDark ? '#27272a' : '#e4e4e7';

  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <View style={[s.header, { borderBottomColor: border }]}>
        <Text style={[s.title, { color: text }]}>Meal packages</Text>
        <Text style={[s.subtitle, { color: muted }]}>Curated collections to help you decide</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {PACKAGES.map(pkg => {
          const isActive = activeId === pkg.id;
          return (
            <Pressable
              key={pkg.id}
              onPress={() => setActiveId(isActive ? null : pkg.id)}
              style={[
                s.card,
                { backgroundColor: surface, borderColor: isActive ? '#2563eb' : border, borderWidth: isActive ? 2 : 1 },
              ]}
            >
              {/* Top row */}
              <View style={s.cardTop}>
                <View style={s.cardTitles}>
                  <View style={s.nameRow}>
                    <Text style={[s.pkgName, { color: text }]}>{pkg.name}</Text>
                    {pkg.tag && (
                      <View style={[s.tag, { backgroundColor: isDark ? '#1e3a5f' : '#eff6ff' }]}>
                        <Text style={[s.tagText, { color: '#2563eb' }]}>{pkg.tag}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[s.pkgDesc, { color: muted }]}>{pkg.description}</Text>
                </View>
                <Ionicons
                  name={isActive ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={muted}
                />
              </View>

              {/* Meals list — expands on tap */}
              {isActive && (
                <View style={[s.mealList, { borderTopColor: border }]}>
                  {pkg.meals.map((meal, i) => (
                    <View key={i} style={s.mealRow}>
                      <Ionicons name="restaurant-outline" size={14} color="#2563eb" />
                      <Text style={[s.mealItem, { color: text }]}>{meal}</Text>
                    </View>
                  ))}
                  <Pressable style={s.useBtn}>
                    <Text style={s.useBtnText}>Use this package</Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1 },
  header:     { paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, gap: 4 },
  title:      { fontSize: 20, fontWeight: '700' },
  subtitle:   { fontSize: 13 },
  scroll:     { padding: 16, gap: 12 },
  card:       { borderRadius: 14, padding: 16, gap: 0 },
  cardTop:    { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  cardTitles: { flex: 1, gap: 4 },
  nameRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  pkgName:    { fontSize: 15, fontWeight: '600' },
  pkgDesc:    { fontSize: 13 },
  tag:        { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  tagText:    { fontSize: 11, fontWeight: '600' },
  mealList:   { marginTop: 14, paddingTop: 14, borderTopWidth: 1, gap: 10 },
  mealRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mealItem:   { fontSize: 14 },
  useBtn:     { marginTop: 8, backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  useBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});