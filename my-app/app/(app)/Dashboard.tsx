import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MealLibrary } from './MealLibrary';
import { Quiz } from './Quiz';
import type { User } from '../../src/types/index.ts';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

type Tab = 'library' | 'quiz';

export function Dashboard({ user, onLogout, onUpdateUser }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('library');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>What Do I Want to Eat?</Text>
          <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'library' && styles.tabActive]}
          onPress={() => setActiveTab('library')}
        >
          <Ionicons
            name="book-outline"
            size={18}
            color={activeTab === 'library' ? '#fff' : '#6b7280'}
          />
          <Text style={[styles.tabText, activeTab === 'library' && styles.tabTextActive]}>
            My Meals ({user.meals.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quiz' && styles.tabActive]}
          onPress={() => setActiveTab('quiz')}
        >
          <Ionicons
            name="help-circle-outline"
            size={18}
            color={activeTab === 'quiz' ? '#fff' : '#6b7280'}
          />
          <Text style={[styles.tabText, activeTab === 'quiz' && styles.tabTextActive]}>
            What Should I Eat?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'library' ? (
          <MealLibrary user={user} onUpdateUser={onUpdateUser} />
        ) : (
          <Quiz user={user} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  appTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  welcomeText: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  logoutBtn: { padding: 8 },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  tabActive: { backgroundColor: '#f97316' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#fff' },
  content: { flex: 1 },
});