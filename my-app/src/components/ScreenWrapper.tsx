import React from "react";
import { ImageBackground, StyleSheet, useWindowDimensions } from "react-native";
import { useThemeMode } from "../theme/ThemeContext";

const lightPattern = require("../../assets/images/food-pattern-light.png");
const darkPattern = require("../../assets/images/food-pattern-dark.png");

export function ScreenWrapper({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeMode();
  const { width, height } = useWindowDimensions();

  return (
    <ImageBackground
      key={isDark ? "dark" : "light"}   // 🔥 forces refresh on toggle
      source={isDark ? darkPattern : lightPattern}
      style={[styles.bg, { width, height }]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});