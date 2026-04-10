import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { User, QuizAnswers } from '../../src/types';

interface QuizProps {
  user: User;
}

export default function Quiz({ user }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [results, setResults] = useState<string[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const categories = Array.from(new Set(user.meals.map(m => m.category)));
  const cuisines = Array.from(new Set(user.meals.map(m => m.cuisine).filter(Boolean) as string[]));

  const questions = [
    {
      question: 'What type of meal are you in the mood for?',
      options: ['Any', ...categories],
      key: 'category' as keyof QuizAnswers,
    },
    {
      question: 'What cuisine sounds good?',
      options: ['Any', ...cuisines],
      key: 'cuisine' as keyof QuizAnswers,
    },
    {
      question: 'How much time do you have?',
      options: ['Any', 'Quick (under 15min)', 'Medium (15-30min)', 'Longer (30min+)'],
      key: 'prepTime' as keyof QuizAnswers,
    },
  ];

  const handleAnswer = (value: string, key: keyof QuizAnswers) => {
    const newAnswers = { ...answers, [key]: value === 'Any' ? undefined : value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      filterMeals(newAnswers);
    }
  };

  const filterMeals = (finalAnswers: QuizAnswers) => {
    let filtered = [...user.meals];
    if (finalAnswers.category) filtered = filtered.filter(m => m.category === finalAnswers.category);
    if (finalAnswers.cuisine)  filtered = filtered.filter(m => m.cuisine === finalAnswers.cuisine);
    if (finalAnswers.prepTime) {
      const timeMap: Record<string, string[]> = {
        'Quick (under 15min)': ['5min', '10min', '15min', 'quick'],
        'Medium (15-30min)':   ['20min', '25min', '30min'],
        'Longer (30min+)':     ['45min', '1hr', '1.5hr', '2hr', '3hr'],
      };
      const validTimes = timeMap[finalAnswers.prepTime] || [];
      filtered = filtered.filter(m =>
        m.prepTime && validTimes.some(t => m.prepTime?.toLowerCase().includes(t.toLowerCase()))
      );
    }
    setResults(filtered.map(m => m.name));
  };

  const pickRandomMeal = () => {
    if (results.length > 0) {
      setSelectedMeal(results[Math.floor(Math.random() * results.length)]);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setResults([]);
    setSelectedMeal(null);
  };

  if (user.meals.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="restaurant-outline" size={48} color="#d1d5db" />
        <Text style={styles.emptyText}>Add some meals to your library first!</Text>
      </View>
    );
  }

  if (results.length > 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding}>
        <Text style={styles.pageTitle}>Your Options</Text>

        {selectedMeal ? (
          <View style={styles.resultCard}>
            <Ionicons name="sparkles" size={40} color="#fff" style={{ marginBottom: 12 }} />
            <Text style={styles.resultLabel}>You should eat:</Text>
            <Text style={styles.resultMeal}>{selectedMeal}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.optionsIntro}>
              Based on your preferences, here are {results.length} option{results.length !== 1 ? 's' : ''}:
            </Text>
            <View style={styles.optionsGrid}>
              {results.map((mealName, i) => (
                <View key={i} style={styles.optionChip}>
                  <Text style={styles.optionChipText}>{mealName}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.buttonRow}>
          {!selectedMeal && (
            <TouchableOpacity style={[styles.primaryBtn, { flex: 1, marginRight: 10 }]} onPress={pickRandomMeal}>
              <Ionicons name="shuffle" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Pick One For Me!</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.secondaryBtn} onPress={resetQuiz}>
            <Ionicons name="refresh" size={18} color="#374151" />
            <Text style={styles.secondaryBtnText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding}>
      <View style={styles.progressMeta}>
        <Text style={styles.progressLabel}>Question {step + 1} of {questions.length}</Text>
        <Text style={styles.progressLabel}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
      </View>

      <Text style={styles.question}>{currentQuestion.question}</Text>

      <View style={styles.optionsList}>
        {currentQuestion.options.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.optionRow}
            onPress={() => handleAnswer(option, currentQuestion.key)}
          >
            <Text style={styles.optionText}>{option}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      {step > 0 && (
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentPadding: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { color: '#6b7280', fontSize: 16, textAlign: 'center', marginTop: 16 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 20 },
  resultCard: { backgroundColor: '#f97316', borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 20 },
  resultLabel: { color: '#fff', fontSize: 16, opacity: 0.9, marginBottom: 8 },
  resultMeal: { color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center' },
  optionsIntro: { fontSize: 15, color: '#374151', textAlign: 'center', marginBottom: 16 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  optionChip: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  optionChipText: { color: '#374151', fontSize: 14, fontWeight: '500' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f97316', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, gap: 8, justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  secondaryBtnText: { color: '#374151', fontWeight: '600', fontSize: 15 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: '#6b7280' },
  progressTrack: { height: 6, backgroundColor: '#e5e7eb', borderRadius: 999, marginBottom: 32, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: '#f97316', borderRadius: 999 },
  question: { fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 24 },
  optionsList: { gap: 12 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  optionText: { fontSize: 16, color: '#111827' },
  backBtn: { alignItems: 'center', marginTop: 24 },
  backBtnText: { color: '#6b7280', fontSize: 15 },
});