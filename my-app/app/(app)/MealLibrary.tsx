import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buildPath } from '../../src/api';
import { retrieveToken, storeToken, storeUser } from '../../src/tokenStorage';
import {
  CATEGORIES,
  CUISINES,
  PREP_TIMES,
  FLAVOR_TAGS,
  TIME_OF_DAY_TAGS,
  COMMON_TAGS,
} from '../../constants/MealConstants';
import EditMealModal from './EditMealModal';
import MealPackages from './MealPackages';
import type { Meal, User } from '../../src/types';

interface MealLibraryProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

function PickerRow({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.picker} onPress={() => setOpen(!open)}>
        <Text style={value ? styles.pickerText : styles.pickerPlaceholder}>
          {value || `Select ${label.toLowerCase()}`}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => { onSelect(''); setOpen(false); }}
            >
              <Text style={styles.dropdownText}>— None —</Text>
            </TouchableOpacity>
            {options.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownItem, value === opt && styles.dropdownItemActive]}
                onPress={() => { onSelect(opt); setOpen(false); }}
              >
                <Text style={[styles.dropdownText, value === opt && styles.dropdownTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function TagRow({
  label,
  tags,
  selected,
  onToggle,
  custom,
  setCustom,
  onAddCustom,
}: {
  label: string;
  tags: string[];
  selected: string[];
  onToggle: (t: string) => void;
  custom: string;
  setCustom: (v: string) => void;
  onAddCustom: () => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.tagWrap}>
        {tags.map(tag => (
          <TouchableOpacity
            key={tag}
            style={selected.includes(tag) ? styles.tagActive : styles.tagInactive}
            onPress={() => onToggle(tag)}
          >
            <Text style={selected.includes(tag) ? styles.tagActiveText : styles.tagInactiveText}>
              {selected.includes(tag) ? `${tag} ✕` : `+ ${tag}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.customRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          value={custom}
          onChangeText={setCustom}
          placeholder={`Custom ${label.toLowerCase()} tag`}
          placeholderTextColor="#9ca3af"
          onSubmitEditing={onAddCustom}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addTagBtn} onPress={onAddCustom}>
          <Text style={styles.addTagBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MealLibrary({ user, onUpdateUser }: MealLibraryProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [newMeal, setNewMeal] = useState({
    name: '',
    category: '',
    tags: [] as string[],
    prepTime: '',
    cuisine: '',
    flavorTags: [] as string[],
    timeOfDayTags: [] as string[],
    notes: '',
  });
  const [customTag, setCustomTag] = useState('');
  const [customFlavorTag, setCustomFlavorTag] = useState('');
  const [customTimeTag, setCustomTimeTag] = useState('');

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    setIsLoading(true);
    try {
      const token = await retrieveToken();
      const response = await fetch(buildPath('api/getmeals'), {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, jwtToken: token }),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await response.json();
      if (res.error && res.error.length > 0) {
        setMessage('Failed to load meals: ' + res.error);
        return;
      }
      if (res.jwtToken) await storeToken(res.jwtToken);
      const updatedUser = { ...user, meals: res.meals || [] };
      await storeUser(updatedUser);
      onUpdateUser(updatedUser);
    } catch (e: any) {
      setMessage('Failed to load meals.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!newMeal.name || !newMeal.category) {
      Alert.alert('Missing Fields', 'Please fill in at least name and category');
      return;
    }
    try {
      const token = await retrieveToken();
      const meal = {
        name: newMeal.name,
        category: newMeal.category,
        tags: newMeal.tags,
        prepTime: newMeal.prepTime || undefined,
        cuisine: newMeal.cuisine || undefined,
        flavorTags: newMeal.flavorTags,
        timeOfDayTags: newMeal.timeOfDayTags,
        notes: newMeal.notes || undefined,
      };
      const response = await fetch(buildPath('api/addmeal'), {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, meal, jwtToken: token }),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await response.json();
      if (res.error && res.error.length > 0) {
        setMessage('Error adding meal: ' + res.error);
        return;
      }
      if (res.jwtToken) await storeToken(res.jwtToken);
      const updatedUser = { ...user, meals: [...user.meals, { ...meal, id: res.mealId }] };
      await storeUser(updatedUser);
      onUpdateUser(updatedUser);
      setNewMeal({ name: '', category: '', tags: [], prepTime: '', cuisine: '', flavorTags: [], timeOfDayTags: [], notes: '' });
      setShowAddForm(false);
      setMessage('Meal added!');
      setTimeout(() => setMessage(''), 3000);
    } catch (e: any) {
      setMessage('Error adding meal.');
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    Alert.alert('Delete Meal', 'Are you sure you want to delete this meal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await retrieveToken();
            const response = await fetch(buildPath('api/deletemeal'), {
              method: 'POST',
              body: JSON.stringify({ userId: user.id, mealId, jwtToken: token }),
              headers: { 'Content-Type': 'application/json' },
            });
            const res = await response.json();
            if (res.error && res.error.length > 0) {
              setMessage('Error deleting meal: ' + res.error);
              return;
            }
            if (res.jwtToken) await storeToken(res.jwtToken);
            const updatedUser = { ...user, meals: user.meals.filter(m => m.id !== mealId) };
            await storeUser(updatedUser);
            onUpdateUser(updatedUser);
          } catch (e: any) {
            setMessage('Error deleting meal.');
          }
        },
      },
    ]);
  };

  const handleEditMeal = async (editedMeal: Meal) => {
    try {
      const token = await retrieveToken();
      const response = await fetch(buildPath('api/editmeal'), {
        method: 'PUT',
        body: JSON.stringify({ userId: user.id, mealId: editedMeal.id, meal: editedMeal, jwtToken: token }),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await response.json();
      if (res.error && res.error.length > 0) {
        setMessage('Error editing meal: ' + res.error);
        return;
      }
      if (res.jwtToken) await storeToken(res.jwtToken);
      const updatedUser = { ...user, meals: user.meals.map(m => m.id === editedMeal.id ? editedMeal : m) };
      await storeUser(updatedUser);
      onUpdateUser(updatedUser);
      setEditingMeal(null);
    } catch (e: any) {
      setMessage('Error editing meal.');
    }
  };

  const handleAddPackage = async (meals: Meal[]) => {
    try {
      const token = await retrieveToken();
      const response = await fetch(buildPath('api/addmeals'), {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, meals, jwtToken: token }),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await response.json();
      if (res.error && res.error.length > 0) {
        setMessage('Error adding package: ' + res.error);
        return;
      }
      if (res.jwtToken) await storeToken(res.jwtToken);
      const updatedUser = { ...user, meals: [...user.meals, ...meals] };
      await storeUser(updatedUser);
      onUpdateUser(updatedUser);
    } catch (e: any) {
      setMessage('Error adding package.');
    }
  };

  const toggleTag = (tag: string, field: 'tags' | 'flavorTags' | 'timeOfDayTags') => {
    const current = newMeal[field];
    setNewMeal({
      ...newMeal,
      [field]: current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag],
    });
  };

  const addCustomTag = (tag: string, field: 'tags' | 'flavorTags' | 'timeOfDayTags', setter: (v: string) => void) => {
    const trimmed = tag.trim();
    if (trimmed && !newMeal[field].includes(trimmed)) {
      setNewMeal({ ...newMeal, [field]: [...newMeal[field], trimmed] });
    }
    setter('');
  };

  const categories = Array.from(new Set(user.meals.map(m => m.category)));

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowPackages(true)}>
          <Ionicons name="layers-outline" size={18} color="#374151" />
          <Text style={styles.secondaryBtnText}>Add Package</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowAddForm(!showAddForm)}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Add Meal</Text>
        </TouchableOpacity>
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {showAddForm && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>New Meal</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Name *</Text>
            <TextInput
              style={styles.input}
              value={newMeal.name}
              onChangeText={v => setNewMeal({ ...newMeal, name: v })}
              placeholder="Meal name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <PickerRow label="Category *" value={newMeal.category} options={CATEGORIES} onSelect={v => setNewMeal({ ...newMeal, category: v })} />
          <PickerRow label="Cuisine" value={newMeal.cuisine} options={CUISINES} onSelect={v => setNewMeal({ ...newMeal, cuisine: v })} />
          <PickerRow label="Prep Time" value={newMeal.prepTime} options={PREP_TIMES} onSelect={v => setNewMeal({ ...newMeal, prepTime: v })} />

          <TagRow label="Time of Day" tags={TIME_OF_DAY_TAGS} selected={newMeal.timeOfDayTags} onToggle={t => toggleTag(t, 'timeOfDayTags')} custom={customTimeTag} setCustom={setCustomTimeTag} onAddCustom={() => addCustomTag(customTimeTag, 'timeOfDayTags', setCustomTimeTag)} />
          <TagRow label="Flavors" tags={FLAVOR_TAGS} selected={newMeal.flavorTags} onToggle={t => toggleTag(t, 'flavorTags')} custom={customFlavorTag} setCustom={setCustomFlavorTag} onAddCustom={() => addCustomTag(customFlavorTag, 'flavorTags', setCustomFlavorTag)} />
          <TagRow label="Dietary & Other Tags" tags={COMMON_TAGS} selected={newMeal.tags} onToggle={t => toggleTag(t, 'tags')} custom={customTag} setCustom={setCustomTag} onAddCustom={() => addCustomTag(customTag, 'tags', setCustomTag)} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={newMeal.notes}
              onChangeText={v => setNewMeal({ ...newMeal, notes: v })}
              placeholder="Add notes, recipes, nutritional info, etc."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity style={[styles.primaryBtn, { flex: 1, marginRight: 8 }]} onPress={handleAddMeal}>
              <Text style={styles.primaryBtnText}>Save Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowAddForm(false)}>
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.emptyText}>Loading your meals...</Text>
        </View>
      ) : user.meals.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No meals yet.</Text>
          <Text style={styles.emptySubtext}>Tap "Add Meal" or "Add Package" to get started!</Text>
        </View>
      ) : (
        categories.map(category => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {user.meals
              .filter(m => m.category === category)
              .map(meal => (
                <View key={meal.id} style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      {meal.cuisine ? <Text style={styles.mealMeta}>{meal.cuisine}</Text> : null}
                      {meal.prepTime ? <Text style={styles.mealMeta}>⏱ {meal.prepTime}</Text> : null}
                    </View>
                    <View style={styles.mealActions}>
                      <TouchableOpacity onPress={() => setEditingMeal(meal)} style={styles.iconBtn}>
                        <Ionicons name="pencil-outline" size={18} color="#f97316" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteMeal(meal.id)} style={styles.iconBtn}>
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {meal.timeOfDayTags.length > 0 && (
                    <View style={styles.tagWrap}>
                      {meal.timeOfDayTags.map(tag => (
                        <View key={tag} style={styles.tagBadgePrimary}>
                          <Text style={styles.tagBadgePrimaryText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {meal.flavorTags.length > 0 && (
                    <View style={styles.tagWrap}>
                      {meal.flavorTags.map(tag => (
                        <View key={tag} style={styles.tagBadgeSecondary}>
                          <Text style={styles.tagBadgeSecondaryText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {meal.tags.length > 0 && (
                    <View style={styles.tagWrap}>
                      {meal.tags.map(tag => (
                        <View key={tag} style={styles.tagBadgeAccent}>
                          <Text style={styles.tagBadgeAccentText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {meal.notes ? <Text style={styles.mealNotes} numberOfLines={2}>{meal.notes}</Text> : null}
                </View>
              ))}
          </View>
        ))
      )}

      <MealPackages
        visible={showPackages}
        onClose={() => setShowPackages(false)}
        onAddPackage={handleAddPackage}
      />

      {editingMeal && (
        <EditMealModal
          meal={editingMeal}
          visible={!!editingMeal}
          onClose={() => setEditingMeal(null)}
          onSave={handleEditMeal}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginBottom: 16 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f97316', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, gap: 6 },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  secondaryBtnText: { color: '#374151', fontWeight: '600', fontSize: 14 },
  message: { color: '#f97316', fontSize: 14, marginBottom: 12, fontWeight: '500' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#111827', backgroundColor: '#f9fafb' },
  textarea: { height: 80, paddingTop: 10 },
  picker: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#f9fafb', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerText: { fontSize: 15, color: '#111827' },
  pickerPlaceholder: { fontSize: 15, color: '#9ca3af' },
  dropdown: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, backgroundColor: '#fff', marginTop: 4, zIndex: 10 },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownItemActive: { backgroundColor: '#fff7ed' },
  dropdownText: { fontSize: 14, color: '#374151' },
  dropdownTextActive: { color: '#f97316', fontWeight: '600' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tagActive: { backgroundColor: '#f97316', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  tagActiveText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tagInactive: { backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  tagInactiveText: { color: '#374151', fontSize: 12 },
  customRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  addTagBtn: { backgroundColor: '#f3f4f6', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  addTagBtnText: { fontSize: 14, color: '#374151', fontWeight: '600' },
  formActions: { flexDirection: 'row', marginTop: 4 },
  centered: { alignItems: 'center', justifyContent: 'center', paddingTop: 48 },
  emptyText: { color: '#6b7280', fontSize: 16, marginTop: 12 },
  emptySubtext: { color: '#9ca3af', fontSize: 14, marginTop: 6, textAlign: 'center' },
  categorySection: { marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  mealCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  mealName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  mealMeta: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  mealActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 6 },
  tagBadgePrimary: { backgroundColor: '#fff7ed', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tagBadgePrimaryText: { color: '#f97316', fontSize: 11, fontWeight: '600' },
  tagBadgeSecondary: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tagBadgeSecondaryText: { color: '#374151', fontSize: 11 },
  tagBadgeAccent: { backgroundColor: '#ecfdf5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tagBadgeAccentText: { color: '#065f46', fontSize: 11 },
  mealNotes: { fontSize: 12, color: '#9ca3af', marginTop: 6 },
});