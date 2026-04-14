import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/useTheme';
import DarkModeToggle from '../../src/components/DarkModeToggle';
import MealLibrary from './MealLibrary';
import Quiz from './Quiz';
import type { User } from '../../src/types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

type Tab = 'library' | 'quiz';

export default function Dashboard({ user, onLogout, onUpdateUser }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('library');
  const { bg, card, text, muted, border, primary, secondary, toggleTheme, isDark } = useTheme(); // ← merged here

  return (
    <SafeAreaView style={[styles.container]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.appTitle, { color: text }]}>What Do I Want to Eat?</Text>
          <Text style={[styles.welcomeText, { color: muted }]}>Welcome back, {user.name}!</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Debug: shows current mode and forces a toggle */}
          <Text style={{ color: text, fontSize: 11 }}>{isDark ? 'DARK' : 'LIGHT'}</Text>
          <TouchableOpacity onPress={toggleTheme} style={{ padding: 8, backgroundColor: 'red', borderRadius: 6 }}>
            <Text style={{ color: 'white', fontSize: 11 }}>TEST</Text>
          </TouchableOpacity>
          <DarkModeToggle />
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={22} color={muted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab bar */}
      <View style={[styles.tabBar, { backgroundColor: card, borderBottomColor: border }]}>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: secondary }, activeTab === 'library' && { backgroundColor: primary }]}
          onPress={() => setActiveTab('library')}
        >
          <Ionicons name="book-outline" size={18} color={activeTab === 'library' ? '#fff' : muted} />
          <Text style={[styles.tabText, { color: muted }, activeTab === 'library' && styles.tabTextActive]}>
            My Meals ({user.meals.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: secondary }, activeTab === 'quiz' && { backgroundColor: primary }]}
          onPress={() => setActiveTab('quiz')}
        >
          <Ionicons name="help-circle-outline" size={18} color={activeTab === 'quiz' ? '#fff' : muted} />
          <Text style={[styles.tabText, { color: muted }, activeTab === 'quiz' && styles.tabTextActive]}>
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
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: { flex: 1 },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appTitle: { fontSize: 18, fontWeight: '500' },
  welcomeText: { fontSize: 13, marginTop: 2 },
  logoutBtn: { padding: 8 },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabText: { fontSize: 13, fontWeight: '500' },
  tabTextActive: { color: '#ffffff' },
  content: { flex: 1 },
});