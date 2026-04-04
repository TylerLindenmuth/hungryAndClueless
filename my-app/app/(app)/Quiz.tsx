import { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Question {
  id: number;
  question: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  { id: 1, question: "How much time do you have?",         options: ['< 15 min', '30 min', '1 hour', 'All the time I need'] },
  { id: 2, question: "What cuisine are you in the mood for?", options: ['American', 'Mexican', 'Italian', 'Asian', 'Surprise me'] },
  { id: 3, question: "How hungry are you?",                options: ['Light snack', 'Medium meal', 'I\'m starving'] },
  { id: 4, question: "Cooking at home or going out?",      options: ['Cooking at home', 'Going out', 'Delivery', 'Either is fine'] },
  { id: 5, question: "Any dietary restrictions?",          options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free'] },
];

const RESULTS = [
  "McDonald's — fast, satisfying, and close by!",
  "Spaghetti Bolognese — comforting home-cooked meal",
  "Sushi — fresh and healthy option",
  "Tacos — quick and flavourful",
];

export default function QuizScreen() {
  const isDark  = useColorScheme() === 'dark';
  const bg      = isDark ? '#09090b' : '#ffffff';
  const surface = isDark ? '#18181b' : '#f4f4f5';
  const text    = isDark ? '#fafafa' : '#09090b';
  const muted   = isDark ? '#a1a1aa' : '#71717a';
  const border  = isDark ? '#27272a' : '#e4e4e7';

  const [step,      setStep]      = useState(0);        // 0 = intro
  const [answers,   setAnswers]   = useState<number[]>([]);
  const [selected,  setSelected]  = useState<number | null>(null);
  const [result,    setResult]    = useState<string | null>(null);

  const currentQ = QUESTIONS[step - 1];
  const progress = step > 0 ? step / QUESTIONS.length : 0;

  function handleStart() { setStep(1); setAnswers([]); setResult(null); }

  function handleSelect(i: number) { setSelected(i); }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (step >= QUESTIONS.length) {
      const r = RESULTS[newAnswers[0] % RESULTS.length];
      setResult(r);
      setStep(QUESTIONS.length + 1);
    } else {
      setStep(s => s + 1);
    }
  }

  function handleRestart() { setStep(0); setAnswers([]); setSelected(null); setResult(null); }

  // Intro
  if (step === 0) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
        <View style={s.center}>
          <Ionicons name="help-circle-outline" size={64} color="#2563eb" />
          <Text style={[s.introTitle, { color: text }]}>What should I eat?</Text>
          <Text style={[s.introSub, { color: muted }]}>
            Answer {QUESTIONS.length} quick questions and we'll recommend the perfect meal for you right now.
          </Text>
          <Pressable style={s.startBtn} onPress={handleStart}>
            <Text style={s.startBtnText}>Start quiz</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Result
  if (result) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
        <View style={s.center}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#22c55e" />
          <Text style={[s.resultTitle, { color: text }]}>You should eat…</Text>
          <View style={[s.resultCard, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[s.resultMeal, { color: text }]}>{result}</Text>
          </View>
          <Pressable style={s.startBtn} onPress={handleRestart}>
            <Text style={s.startBtnText}>Take quiz again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Question
  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      {/* Progress bar */}
      <View style={[s.progressTrack, { backgroundColor: surface }]}>
        <View style={[s.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={s.questionScroll}>
        <Text style={[s.stepLabel, { color: muted }]}>
          Question {step} of {QUESTIONS.length}
        </Text>
        <Text style={[s.question, { color: text }]}>{currentQ.question}</Text>

        <View style={s.options}>
          {currentQ.options.map((opt, i) => (
            <Pressable
              key={i}
              onPress={() => handleSelect(i)}
              style={[
                s.option,
                { backgroundColor: surface, borderColor: selected === i ? '#2563eb' : border },
                selected === i && s.optionSelected,
              ]}
            >
              <Text style={[s.optionText, { color: selected === i ? '#2563eb' : text }]}>
                {opt}
              </Text>
              {selected === i && (
                <Ionicons name="checkmark-circle" size={20} color="#2563eb" />
              )}
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={[s.nextBtn, selected === null && s.nextBtnDisabled]}
          disabled={selected === null}
        >
          <Text style={s.nextBtnText}>
            {step === QUESTIONS.length ? 'See my result' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1 },
  center:          { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 },
  introTitle:      { fontSize: 26, fontWeight: '700', textAlign: 'center' },
  introSub:        { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  startBtn:        { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40, marginTop: 8 },
  startBtnText:    { color: '#fff', fontWeight: '700', fontSize: 16 },
  progressTrack:   { height: 4, borderRadius: 999, marginHorizontal: 24, marginTop: 12 },
  progressFill:    { height: 4, backgroundColor: '#2563eb', borderRadius: 999 },
  questionScroll:  { padding: 24, gap: 20 },
  stepLabel:       { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  question:        { fontSize: 22, fontWeight: '700', lineHeight: 30 },
  options:         { gap: 10 },
  option:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, borderWidth: 1.5 },
  optionSelected:  { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  optionText:      { fontSize: 15, fontWeight: '500', flex: 1 },
  nextBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, marginTop: 8 },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText:     { color: '#fff', fontWeight: '700', fontSize: 16 },
  resultTitle:     { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  resultCard:      { width: '100%', padding: 24, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  resultMeal:      { fontSize: 18, fontWeight: '600', textAlign: 'center', lineHeight: 26 },
});