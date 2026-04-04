import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from 'react-native';

export default function ModalScreen() {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.textDark]}>Modal</Text>
      <View
        style={[
          styles.separator,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#eee' },
        ]}
      />
      {/* StatusBar: light on iOS (sits on black sheet background), auto elsewhere */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  textDark: {
    color: '#F9FAFB',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});