// Requires: expo install @miblanchard/react-native-slider
// or: npx expo install @react-native-community/slider

import React from "react";
import { View, StyleSheet } from "react-native";
import RNSlider from "@react-native-community/slider";

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;
  style?: object;
}

function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  onSlidingComplete,
  disabled = false,
  style,
}: SliderProps) {
  const initialValue =
    value ?? defaultValue ?? min;

  return (
    <View style={[styles.container, style]}>
      <RNSlider
        style={styles.slider}
        value={initialValue}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
        disabled={disabled}
        minimumTrackTintColor="#2563EB"   // primary
        maximumTrackTintColor="#E5E7EB"   // muted
        thumbTintColor="#2563EB"          // primary
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

export { Slider };