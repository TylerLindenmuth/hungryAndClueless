import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable,
  StyleSheet, SafeAreaView, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Meal {
  id: string;
  name: string;
  category: string;
  tags: string[];
  notes?: string;
}

const INITIAL_MEALS: Meal[] = [
  { id: '1', name: "McDonald's", category: 'Fast food',    tags: ['American', 'Quick'] },
  { id: '2', name: 'Taco Bell',  category: 'Fast food',    tags: ['Mexican', 'Late Night'] },
  { id: '3', name: 'Spaghetti', category: 'Home cooked',   tags: ['Italian', 'Comfort Food'] },
  { id: '4', name: 'Sushi',     category: 'Restaurant',    tags: ['Japanese', 'Healthy'] },
  { id: '5', name: 'Tacos',     category: 'Home cooked',   tags: ['Mexican', 'Quick'] },
];

const FILTER_TAGS = ['All', 'Quick', 'Healthy', 'Comfort Food', 'Late Night'];

export default function MealLibraryScreen() {
  const isDark  = useColorScheme() === 'dark';
  const bg      = isDark ? '#09090b' : '#ffffff';
  const surface = isDark ? '#18181b' : '#f4f4f5';
  const text    = isDark ? '#fafafa' : '#09090b';
  const muted   = isDark ? '#a1a1aa' : '#71717a';
  const border  = isDark ? '#27272a' : '#e4e4e7';

  const [meals,        setMeals]        = useState<Meal[]>(INITIAL_MEALS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search,       setSearch]       = useState('');
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [editName,     setEditName]     = useState('');

  const filtered = meals.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || m.tags.includes(activeFilter);
    return matchSearch && matchFilter;
  });

  const grouped = filtered.reduce<Record<string, Meal[]>>((acc, m) => {
    (acc[m.category] = acc[m.category] ?? []).push(m);
    return acc;
  }, {});

  function deleteMeal(id: string) {
    setMeals(ms => ms.filter(m => m.id !== id));
  }

  function startEdit(meal: Meal) {
    setEditingId(meal.id);
    setEditName(meal.name);
  }

  function saveEdit() {
    if (!editName.trim()) return;
    setMeals(ms => ms.map(m => m.id === editingId ? { ...m, name: editName.trim() } : m));
    setEditingId(null);
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: border }]}>
        <Text style={[s.title, { color: text }]}>Your meal library</Text>
        <Ionicons name="options-outline" size={22} color={muted} />
      </View>

      {/* Search */}
      <View style={[s.searchWrap, { borderBottomColor: border }]}>
        <Ionicons name="search-outline" size={16} color={muted} style={s.searchIcon} />
        <TextInput
          style={[s.search, { color: text }]}
          placeholder="Search meals…"
          placeholderTextColor={muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {FILTER_TAGS.map(f => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              s.chip,
              { backgroundColor: f === activeFilter ? '#2563eb' : surface,
                borderColor: f === activeFilter ? '#2563eb' : border,
                borderWidth: 1 },
            ]}
          >
            <Text style={[s.chipText, { color: f === activeFilter ? '#fff' : muted }]}>{f}</Text>
          </Pressable>
        ))}
        <Pressable style={[s.chip, { borderColor: '#2563eb', borderWidth: 1, backgroundColor: 'transparent' }]}>
          <Text style={[s.chipText, { color: '#2563eb' }]}>+ add filter</Text>
        </Pressable>
      </ScrollView>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {Object.entries(grouped).map(([category, items]) => (
          <View key={category} style={s.group}>
            <Text style={[s.groupLabel, { color: muted }]}>{category}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cardRow}>
              {items.map(meal => (
                <View key={meal.id} style={[s.mealCard, { backgroundColor: surface, borderColor: border }]}>
                  {/* Edit / Delete */}
                  <View style={s.cardActions}>
                    <Pressable onPress={() => startEdit(meal)} hitSlop={8}>
                      <Ionicons name="create-outline" size={16} color={muted} />
                    </Pressable>
                    <Pressable onPress={() => deleteMeal(meal.id)} hitSlop={8}>
                      <Ionicons name="close-outline" size={16} color="#ef4444" />
                    </Pressable>
                  </View>

                  {editingId === meal.id ? (
                    <View style={s.editRow}>
                      <TextInput
                        style={[s.editInput, { color: text, borderColor: '#2563eb' }]}
                        value={editName}
                        onChangeText={setEditName}
                        autoFocus
                      />
                      <Pressable onPress={saveEdit} style={s.saveBtn}>
                        <Text style={s.saveBtnText}>Save</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Text style={[s.mealName, { color: text }]}>{meal.name}</Text>
                  )}

                  <View style={s.tagRow}>
                    {meal.tags.map(tag => (
                      <View key={tag} style={[s.tag, { backgroundColor: isDark ? '#1e3a5f' : '#eff6ff' }]}>
                        <Text style={[s.tagText, { color: '#2563eb' }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}

        {/* Add meal prompt */}
        <Pressable style={[s.addRow, { borderColor: border }]}>
          <Ionicons name="add-circle-outline" size={18} color="#2563eb" />
          <Text style={[s.addText, { color: '#2563eb' }]}>Add a new meal</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1 },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1 },
  title:       { fontSize: 20, fontWeight: '700' },
  searchWrap:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  searchIcon:  { marginRight: 8 },
  search:      { flex: 1, fontSize: 14 },
  chips:       { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip:        { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  chipText:    { fontSize: 13, fontWeight: '500' },
  scroll:      { padding: 16, gap: 24 },
  group:       { gap: 10 },
  groupLabel:  { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardRow:     { gap: 12 },
  mealCard:    { width: 160, borderRadius: 12, borderWidth: 1, padding: 12, gap: 8 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  mealName:    { fontSize: 15, fontWeight: '600' },
  editRow:     { gap: 6 },
  editInput:   { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, fontSize: 14 },
  saveBtn:     { backgroundColor: '#2563eb', borderRadius: 6, paddingVertical: 4, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tagRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag:         { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  tagText:     { fontSize: 11, fontWeight: '500' },
  addRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center' },
  addText:     { fontSize: 14, fontWeight: '500' },
});