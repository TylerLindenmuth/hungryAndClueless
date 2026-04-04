/**
 * Input.tsx
 * React Native port of the shadcn/ui Input.
 *
 * Usage:
 *   <Input placeholder="Email" value={email} onChangeText={setEmail} />
 *   <Input invalid placeholder="Required" />
 */

import * as React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  ViewStyle,
  Animated,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';

export interface InputProps extends TextInputProps {
  /** Mirrors aria-invalid — shows destructive ring */
  invalid?: boolean;
  containerStyle?: ViewStyle;
}

export function Input({
  invalid = false,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      invalid ? colors.destructive : colors.border,
      invalid ? colors.destructive : colors.ring,
    ],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBackground,
          borderColor,
          shadowColor: invalid ? colors.destructive : colors.ring,
          shadowOpacity,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 0 },
          elevation: 0, // Android — elevation doesn't support animated, use border only
        },
        containerStyle,
      ]}
    >
      <TextInput
        style={[
          styles.input,
          { color: colors.foreground },
          style,
        ]}
        placeholderTextColor={colors.mutedForeground}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 0,
    includeFontPadding: false,
  },
});