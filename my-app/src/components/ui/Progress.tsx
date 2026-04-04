/**
 * Progress.tsx
 * React Native port of the shadcn/ui Progress (Radix @radix-ui/react-progress).
 *
 * Usage:
 *   <Progress value={60} />
 *   <Progress value={progress} animated={false} />
 *   <Progress indeterminate />
 */

import * as React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  Easing,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';

export interface ProgressProps {
  /** 0–100. Ignored when `indeterminate` is true. */
  value?: number;
  /** Show a looping animation instead of a fixed value */
  indeterminate?: boolean;
  /** Animate changes to `value` (default: true) */
  animated?: boolean;
  style?: ViewStyle;
  trackStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
}

export function Progress({
  value = 0,
  indeterminate = false,
  animated = true,
  style,
  trackStyle,
  indicatorStyle,
}: ProgressProps) {
  const { colors } = useTheme();

  const clampedValue = Math.min(100, Math.max(0, value));

  // ── Fixed-value animation ──────────────────────────────────────────────────
  // We animate translateX from -100 % (empty) to -(100 - value) %
  // matching the web's `transform: translateX(-${100 - value}%)`
  const progressAnim = React.useRef(
    new Animated.Value(-(100 - clampedValue)),
  ).current;

  React.useEffect(() => {
    if (indeterminate) return;
    const toValue = -(100 - clampedValue);
    if (animated) {
      Animated.timing(progressAnim, {
        toValue,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      progressAnim.setValue(toValue);
    }
  }, [clampedValue, indeterminate, animated]);

  // ── Indeterminate looping animation ───────────────────────────────────────
  const loopAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    if (!indeterminate) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(loopAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(loopAnim, {
          toValue: 100,
          duration: 400,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(loopAnim, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [indeterminate]);

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: colors.primary + '33' }, // /20 opacity
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={
        indeterminate ? undefined : { min: 0, max: 100, now: clampedValue }
      }
    >
      {/* Clip container so translateX overflow is hidden */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor: colors.primary },
            indeterminate
              ? { transform: [{ translateX: loopAnim }] }
              : {
                  transform: [
                    {
                      translateX: progressAnim.interpolate({
                        inputRange: [-100, 0],
                        outputRange: ['-100%' as any, '0%' as any],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
            indicatorStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});