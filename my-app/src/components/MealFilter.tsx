import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Meal } from '../../src/types/index';
import {
  CATEGORIES,
  CUISINES,
  PREP_TIMES,
  FLAVOR_TAGS,
  TIME_OF_DAY_TAGS,
  COMMON_TAGS,
} from '../../constants/Mealconstants';
import { useTheme } from '../../src/theme/useTheme';

interface MealFilterProps {
  meals: Meal[];
  onFilteredMeals: (meals: Meal[]) => void;
}

interface FilterState {
  category: string;
  cuisine: string;
  prepTime: string;
  flavorTags: string[];
  timeOfDayTags: string[];
  tags: string[];
}

const EMPTY_FILTERS: FilterState = {
  category: '',
  cuisine: '',
  prepTime: '',
  flavorTags: [],
  timeOfDayTags: [],
  tags: [],
};

// ── Mini picker ───────────────────────────────────────────────────────────────
function FilterPicker({
  label,
  value,
  options,
  onSelect,
  th,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (v: string) => void;
  th: ReturnType<typeof useTheme>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: th.text }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.picker, { borderColor: th.border, backgroundColor: th.inputBg }]}
        onPress={() => setOpen(o => !o)}
      >
        <Text style={{ color: value ? th.text : th.placeholder, fontSize: 14 }}>
          {value || 'Any'}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={th.muted}
        />
      </TouchableOpacity>
      {open && (
        <View style={[styles.dropdown, { borderColor: th.border, backgroundColor: th.card }]}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
            {['', ...options].map((opt: string) => (
              <TouchableOpacity
                key={opt || '__any__'}
                style={[
                  styles.dropdownItem,
                  opt === value && { backgroundColor: th.accent },
                ]}
                onPress={() => { onSelect(opt); setOpen(false); }}
              >
                <Text style={[
                  styles.dropdownText,
                  { color: opt === value ? th.accentText : th.text },
                ]}>
                  {opt || 'Any'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ── Tag chip row ──────────────────────────────────────────────────────────────
function TagRow({
  label,
  tags,
  selected,
  onToggle,
  th,
}: {
  label: string;
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  th: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.label, { color: th.text }]}>{label}</Text>
      <View style={styles.chipWrap}>
        {tags.map((tag: string) => {
          const active = selected.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[
                styles.chip,
                active
                  ? { backgroundColor: th.primary }
                  : { backgroundColor: th.secondary },
              ]}
              onPress={() => onToggle(tag)}
            >
              <Text style={[
                styles.chipText,
                { color: active ? th.primaryText : th.text },
              ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MealFilter({ meals, onFilteredMeals }: MealFilterProps) {
  const th = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const hasActiveFilters =
    !!filters.category ||
    !!filters.cuisine ||
    !!filters.prepTime ||
    filters.flavorTags.length > 0 ||
    filters.timeOfDayTags.length > 0 ||
    filters.tags.length > 0;

  const applyFilters = () => {
    let filtered = [...meals];
    if (filters.category)   filtered = filtered.filter((m: Meal) => m.category === filters.category);
    if (filters.cuisine)    filtered = filtered.filter((m: Meal) => m.cuisine === filters.cuisine);
    if (filters.prepTime)   filtered = filtered.filter((m: Meal) => m.prepTime === filters.prepTime);
    if (filters.flavorTags.length > 0)
      filtered = filtered.filter((m: Meal) => filters.flavorTags.some((t: string) => m.flavorTags.includes(t)));
    if (filters.timeOfDayTags.length > 0)
      filtered = filtered.filter((m: Meal) => filters.timeOfDayTags.some((t: string) => m.timeOfDayTags.includes(t)));
    if (filters.tags.length > 0)
      filtered = filtered.filter((m: Meal) => filters.tags.some((t: string) => m.tags.includes(t)));
    onFilteredMeals(filtered);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    onFilteredMeals(meals);
  };

  const toggleArrayFilter = (
    key: 'flavorTags' | 'timeOfDayTags' | 'tags',
    value: string,
  ) => {
    const current = filters[key];
    setFilters({
      ...filters,
      [key]: current.includes(value)
        ? current.filter((t: string) => t !== value)
        : [...current, value],
    });
  };

  return (
    <View style={styles.container}>
      {/* Toggle row */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: th.secondary }]}
          onPress={() => setShowFilters(v => !v)}
        >
          <Ionicons name="filter" size={16} color={th.text} />
          <Text style={[styles.filterBtnText, { color: th.text }]}>
            Filter Meals{hasActiveFilters ? ' (Active)' : ''}
          </Text>
        </TouchableOpacity>

        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
            <Text style={[styles.clearBtnText, { color: th.muted }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Expanded panel */}
      {showFilters && (
        <View style={[styles.panel, { backgroundColor: th.card, borderColor: th.border }]}>
          <FilterPicker
            label="Category"
            value={filters.category}
            options={CATEGORIES}
            onSelect={(v: string) => setFilters({ ...filters, category: v })}
            th={th}
          />
          <FilterPicker
            label="Cuisine"
            value={filters.cuisine}
            options={CUISINES}
            onSelect={(v: string) => setFilters({ ...filters, cuisine: v })}
            th={th}
          />
          <FilterPicker
            label="Prep Time"
            value={filters.prepTime}
            options={PREP_TIMES}
            onSelect={(v: string) => setFilters({ ...filters, prepTime: v })}
            th={th}
          />

          <TagRow
            label="Time of Day"
            tags={TIME_OF_DAY_TAGS}
            selected={filters.timeOfDayTags}
            onToggle={(tag: string) => toggleArrayFilter('timeOfDayTags', tag)}
            th={th}
          />
          <TagRow
            label="Flavors"
            tags={FLAVOR_TAGS}
            selected={filters.flavorTags}
            onToggle={(tag: string) => toggleArrayFilter('flavorTags', tag)}
            th={th}
          />
          <TagRow
            label="Dietary & Other Tags"
            tags={COMMON_TAGS}
            selected={filters.tags}
            onToggle={(tag: string) => toggleArrayFilter('tags', tag)}
            th={th}
          />

          <TouchableOpacity
            style={[styles.applyBtn, { backgroundColor: th.primary }]}
            onPress={applyFilters}
          >
            <Text style={[styles.applyBtnText, { color: th.primaryText }]}>
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { marginBottom: 16 },
  toggleRow:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  filterBtn:      { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  filterBtnText:  { fontSize: 14, fontWeight: '600' },
  clearBtn:       { paddingHorizontal: 10, paddingVertical: 10 },
  clearBtnText:   { fontSize: 14 },
  panel:          { marginTop: 12, borderWidth: 1, borderRadius: 14, padding: 16 },
  label:          { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  picker:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  dropdown:       { borderWidth: 1, borderRadius: 10, marginTop: 4, overflow: 'hidden' },
  dropdownItem:   { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownText:   { fontSize: 14 },
  chipWrap:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:           { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  chipText:       { fontSize: 13, fontWeight: '500' },
  applyBtn:       { borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 8 },
  applyBtnText:   { fontSize: 15, fontWeight: '700' },
});