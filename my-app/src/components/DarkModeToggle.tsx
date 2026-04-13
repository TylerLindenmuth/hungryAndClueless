import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';

export default function DarkModeToggle() {
  const { isDark, toggleTheme, secondary, text } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.btn, { backgroundColor: secondary }]}
      accessibilityLabel="Toggle dark mode"
      accessibilityRole="button"
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={20}
        color={text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 8,
    borderRadius: 10,
  },
});