import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Meal } from '../../src/types/index.ts';
import {
  CATEGORIES,
  CUISINES,
  PREP_TIMES,
  FLAVOR_TAGS,
  TIME_OF_DAY_TAGS,
  COMMON_TAGS,
} from '../../constants/mealConstants';

interface EditMealModalProps {
  meal: Meal;
  visible: boolean;
  onClose: () => void;
  onSave: (meal: Meal) => void;
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
          <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => { onSelect(''); setOpen(false); }}
            >
              <Text style={styles.dropdownItemText}>— None —</Text>
            </TouchableOpacity>
            {options.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownItem, value === opt && styles.dropdownItemActive]}
                onPress={() => { onSelect(opt); setOpen(false); }}
              >
                <Text style={[styles.dropdownItemText, value === opt && styles.dropdownItemTextActive]}>
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

function TagSelector({
  label,
  selected,
  options,
  onToggle,
  customValue,
  onCustomChange,
  onCustomAdd,
}: {
  label: string;
  selected: string[];
  options: string[];
  onToggle: (tag: string) => void;
  customValue: string;
  onCustomChange: (v: string) => void;
  onCustomAdd: () => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.tagWrap}>
        {selected.map(tag => (
          <TouchableOpacity key={tag} style={styles.tagActive} onPress={() => onToggle(tag)}>
            <Text style={styles.tagActiveText}>{tag} ✕</Text>
          </TouchableOpacity>
        ))}
        {options.filter(t => !selected.includes(t)).map(tag => (
          <TouchableOpacity key={tag} style={styles.tagInactive} onPress={() => onToggle(tag)}>
            <Text style={styles.tagInactiveText}>+ {tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.customTagRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          value={customValue}
          onChangeText={onCustomChange}
          placeholder="Custom tag"
          placeholderTextColor="#9ca3af"
          onSubmitEditing={onCustomAdd}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addTagBtn} onPress={onCustomAdd}>
          <Text style={styles.addTagBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function EditMealModal({ meal, visible, onClose, onSave }: EditMealModalProps) {
  const [editedMeal, setEditedMeal] = useState<Meal>({ ...meal });
  const [newTag, setNewTag] = useState('');
  const [newFlavorTag, setNewFlavorTag] = useState('');
  const [newTimeTag, setNewTimeTag] = useState('');

  const toggleTag = (tag: string, field: 'tags' | 'flavorTags' | 'timeOfDayTags') => {
    const current = editedMeal[field];
    setEditedMeal({
      ...editedMeal,
      [field]: current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag],
    });
  };

  const addCustomTag = (
    val: string,
    field: 'tags' | 'flavorTags' | 'timeOfDayTags',
    setter: (v: string) => void
  ) => {
    const trimmed = val.trim();
    if (trimmed && !editedMeal[field].includes(trimmed)) {
      setEditedMeal({ ...editedMeal, [field]: [...editedMeal[field], trimmed] });
    }
    setter('');
  };

  const handleSave = () => {
    if (!editedMeal.name || !editedMeal.category) {
      alert('Please fill in at least name and category');
      return;
    }
    onSave(editedMeal);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit Meal</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Name *</Text>
            <TextInput
              style={styles.input}
              value={editedMeal.name}
              onChangeText={v => setEditedMeal({ ...editedMeal, name: v })}
              placeholder="Meal name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <PickerRow
            label="Category *"
            value={editedMeal.category}
            options={CATEGORIES}
            onSelect={v => setEditedMeal({ ...editedMeal, category: v })}
          />

          <PickerRow
            label="Cuisine"
            value={editedMeal.cuisine || ''}
            options={CUISINES}
            onSelect={v => setEditedMeal({ ...editedMeal, cuisine: v })}
          />

          <PickerRow
            label="Prep Time"
            value={editedMeal.prepTime || ''}
            options={PREP_TIMES}
            onSelect={v => setEditedMeal({ ...editedMeal, prepTime: v })}
          />

          <TagSelector
            label="Time of Day"
            selected={editedMeal.timeOfDayTags}
            options={TIME_OF_DAY_TAGS}
            onToggle={tag => toggleTag(tag, 'timeOfDayTags')}
            customValue={newTimeTag}
            onCustomChange={setNewTimeTag}
            onCustomAdd={() => addCustomTag(newTimeTag, 'timeOfDayTags', setNewTimeTag)}
          />

          <TagSelector
            label="Flavor Tags"
            selected={editedMeal.flavorTags}
            options={FLAVOR_TAGS}
            onToggle={tag => toggleTag(tag, 'flavorTags')}
            customValue={newFlavorTag}
            onCustomChange={setNewFlavorTag}
            onCustomAdd={() => addCustomTag(newFlavorTag, 'flavorTags', setNewFlavorTag)}
          />

          <TagSelector
            label="Dietary & Other Tags"
            selected={editedMeal.tags}
            options={COMMON_TAGS}
            onToggle={tag => toggleTag(tag, 'tags')}
            customValue={newTag}
            onCustomChange={setNewTag}
            onCustomAdd={() => addCustomTag(newTag, 'tags', setNewTag)}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={editedMeal.notes || ''}
              onChangeText={v => setEditedMeal({ ...editedMeal, notes: v })}
              placeholder="Add notes, recipes, nutritional info, etc."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 8 }]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: '#f9fafb' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  closeBtn: { padding: 4 },
  modalScroll: { padding: 16 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textarea: { height: 100, paddingTop: 12 },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: { fontSize: 15, color: '#111827' },
  pickerPlaceholder: { fontSize: 15, color: '#9ca3af' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 11 },
  dropdownItemActive: { backgroundColor: '#fff7ed' },
  dropdownItemText: { fontSize: 15, color: '#374151' },
  dropdownItemTextActive: { color: '#f97316', fontWeight: '600' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  tagActive: {
    backgroundColor: '#f97316',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagActiveText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  tagInactive: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagInactiveText: { color: '#374151', fontSize: 13 },
  customTagRow: { flexDirection: 'row', alignItems: 'center' },
  addTagBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  addTagBtnText: { fontSize: 14, color: '#374151', fontWeight: '600' },
  actionRow: { flexDirection: 'row', marginBottom: 40 },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#374151', fontSize: 16, fontWeight: '600' },
});