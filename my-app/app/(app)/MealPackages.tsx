import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buildPath } from '../../src/api';
import { retrieveToken, storeToken } from '../../src/tokenStorage';
import type { Meal } from '../../src/types';

interface Package {
  _id: string;
  name: string;
  description: string;
  meals: Omit<Meal, 'id'>[];
}

interface MealPackagesProps {
  visible: boolean;
  onClose: () => void;
  onAddPackage: (meals: Meal[]) => void;
}

export default function MealPackages({ visible, onClose, onAddPackage }: MealPackagesProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    const fetchPackages = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = await retrieveToken();
        const response = await fetch(buildPath('api/getpackages'), {
          method: 'POST',
          body: JSON.stringify({ jwtToken: token }),
          headers: { 'Content-Type': 'application/json' },
        });
        const res = await response.json();
        if (res.error && res.error.length > 0) {
          setError('Failed to load packages: ' + res.error);
          return;
        }
        if (res.jwtToken) await storeToken(res.jwtToken);
        setPackages(res.packages || []);
      } catch (e: any) {
        setError('Failed to load packages. Please try again.');
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, [visible]);

  const handleAddPackage = (pkg: Package) => {
    setAdding(pkg._id);
    const meals: Meal[] = pkg.meals.map(meal => ({
      ...meal,
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    onAddPackage(meals);
    setAdding(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Meal Packages</Text>
            <Text style={styles.subtitle}>Add multiple meals at once</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Loading packages...</Text>
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : packages.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No packages available yet.</Text>
            </View>
          ) : (
            packages.map(pkg => (
              <View key={pkg._id} style={styles.card}>
                <Text style={styles.pkgName}>{pkg.name}</Text>
                <Text style={styles.pkgDesc}>{pkg.description}</Text>
                <Text style={styles.pkgCount}>{pkg.meals.length} meals included</Text>
                <TouchableOpacity
                  style={[styles.addBtn, adding === pkg._id && styles.addBtnDisabled]}
                  onPress={() => handleAddPackage(pkg)}
                  disabled={adding === pkg._id}
                >
                  {adding === pkg._id ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.addBtnText}>Add Package</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, borderBottomWidth: 1, borderBottomColor: '#cbd5e1', backgroundColor: '#ffffff' },
  title: { fontSize: 20, fontWeight: '500', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  closeBtn: { padding: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  loadingText: { color: '#64748b', marginTop: 12, fontSize: 15 },
  errorText: { color: '#dc2626', fontSize: 15, textAlign: 'center' },  // --destructive
  emptyText: { color: '#64748b', fontSize: 15 },
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 4 },
  pkgName: { fontSize: 17, fontWeight: '500', color: '#0f172a', marginBottom: 6 },
  pkgDesc: { fontSize: 14, color: '#64748b', marginBottom: 6 },
  pkgCount: { fontSize: 12, color: '#94a3b8', marginBottom: 12 },
  addBtn: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },  // --primary
  addBtnDisabled: { opacity: 0.6 },
  addBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '500' },
});