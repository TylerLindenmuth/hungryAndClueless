/**
 * Switch.tsx
 * React Native port of the shadcn/ui Switch (Radix @radix-ui/react-switch).
 *
 * Usage:
 *   <Switch checked={enabled} onCheckedChange={setEnabled} />
 *   <Switch checked={enabled} onCheckedChange={setEnabled} disabled />
 */

import * as React from 'react';
import {
  Pressable,
  Animated,
  StyleSheet,
  ViewStyle,
  AccessibilityProps,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';

const TRACK_W  = 32;  // w-8
const TRACK_H  = 18;  // ~1.15rem
const THUMB_SZ = 16;  // size-4
const PADDING  = 1;
const TRAVEL   = TRACK_W - THUMB_SZ - PADDING * 2 - 2; // matches translate-x calc

export interface SwitchProps extends AccessibilityProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  style,
  ...accessibilityProps
}: SwitchProps) {
  const { colors, isDark } = useTheme();

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const checked = isControlled ? controlledChecked! : internalChecked;

  // Animate the thumb position
  const thumbAnim = React.useRef(new Animated.Value(checked ? 1 : 0)).current;
  // Animate track colour via interpolation
  const trackAnim = React.useRef(new Animated.Value(checked ? 1 : 0)).current;

  React.useEffect(() => {
    const toValue = checked ? 1 : 0;
    Animated.parallel([
      Animated.spring(thumbAnim, {
        toValue,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }),
      Animated.timing(trackAnim, {
        toValue,
        duration: 180,
        useNativeDriver: false, // backgroundColor can't use native driver
      }),
    ]).start();
  }, [checked]);

  const handlePress = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  // Track background colour interpolation
  const uncheckedTrackColor = isDark
    ? colors.inputBackground + 'cc' // /80 opacity approximation
    : colors.switchBackground;

  const trackBg = trackAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [uncheckedTrackColor, colors.primary],
  });

  // Thumb X translation
  const thumbTranslate = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRAVEL],
  });

  // Thumb colour
  const thumbBg = trackAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isDark ? colors.cardForeground : colors.card,
      isDark ? colors.primaryForeground : colors.card,
    ],
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      hitSlop={8}
      style={[disabled && styles.disabled, style]}
      {...accessibilityProps}
    >
      <Animated.View
        style={[
          styles.track,
          { backgroundColor: trackBg, borderColor: 'transparent' },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbBg,
              transform: [{ translateX: thumbTranslate }],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    borderWidth: 1,
    padding: PADDING,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SZ,
    height: THUMB_SZ,
    borderRadius: THUMB_SZ / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});