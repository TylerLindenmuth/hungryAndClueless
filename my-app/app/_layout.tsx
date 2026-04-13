import { Stack } from "expo-router";
import { useFonts } from "../src/theme/fonts";
import { View, ActivityIndicator } from "react-native";
import { ThemeProvider } from '../src/theme/ThemeContext';

export default function RootLayout() {
  const loaded = useFonts();
  if (!loaded) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>;

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}