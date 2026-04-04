// Requires: npx expo install expo-checkbox
// or use a Pressable-based approach below (no extra deps)

import React from "react";
import {
  Pressable,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

function Checkbox({
  checked,
  onCheckedChange,
  disabled = false,
  style,
}: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      onPress={() => !disabled && onCheckedChange(!checked)}
      style={({ pressed }) => [
        styles.box,
        checked && styles.checked,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {checked && (
        <View style={styles.indicator}>
          <Ionicons name="checkmark" size={11} color="#fff" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.75,
  },
  indicator: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export { Checkbox };