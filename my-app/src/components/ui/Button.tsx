/**
 * Button.tsx
 * React Native port of the shadcn/ui Button.
 *
 * Variants: default | destructive | outline | secondary | ghost | link
 * Sizes:    default | sm | lg | icon
 */

import * as React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  PressableProps,
  View,
} from 'react-native';
import type { ThemeTokens } from '../../theme/tokens';
import { useTheme, type ThemeColors } from '../../theme/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
  /** Left-side icon element */
  icon?: React.ReactNode;
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  icon,
  children,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const { colors, isDark } = useTheme();
  const isDisabled = disabled || loading;

  const containerStyle = getContainerStyle(variant, size, colors, isDark);
  const labelStyle = getLabelStyle(variant, size, colors, isDark);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        sizeContainerMap[size],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={labelStyle.color as string}
        />
      ) : (
        <View style={styles.inner}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          {children != null && (
            <Text style={[styles.label, labelStyle, textStyle]}>
              {children}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function getContainerStyle(
  variant: ButtonVariant,
  _size: ButtonSize,
  colors: ThemeColors,
  isDark: boolean,
): ViewStyle {
  switch (variant) {
    case 'default':
      return { backgroundColor: colors.primary };
    case 'destructive':
      return {
        backgroundColor: isDark
          ? colors.destructive + '99' // /60 opacity
          : colors.destructive,
      };
    case 'outline':
      return {
        backgroundColor: isDark ? colors.inputBackground : colors.background,
        borderWidth: 1,
        borderColor: isDark ? colors.border : colors.border,
      };
    case 'secondary':
      return { backgroundColor: colors.secondary };
    case 'ghost':
      return { backgroundColor: 'transparent' };
    case 'link':
      return { backgroundColor: 'transparent' };
  }
}

// getLabelStyle signature
function getLabelStyle(
  variant: ButtonVariant,
  size: ButtonSize,
  colors: ThemeColors,
  _isDark: boolean,
): TextStyle {
  const base: TextStyle = { fontSize: sizeLabelMap[size] };
  switch (variant) {
    case 'default':
      return { ...base, color: colors.primaryForeground };
    case 'destructive':
      return { ...base, color: '#ffffff' };
    case 'outline':
      return { ...base, color: colors.foreground };
    case 'secondary':
      return { ...base, color: colors.secondaryForeground };
    case 'ghost':
      return { ...base, color: colors.foreground };
    case 'link':
      return { ...base, color: colors.primary, textDecorationLine: 'underline' };
  }
}

const sizeLabelMap: Record<ButtonSize, number> = {
  default: 14,
  sm:      13,
  lg:      15,
  icon:    14,
};

const sizeContainerMap: Record<ButtonSize, ViewStyle> = {
  default: { height: 36, paddingHorizontal: 16 },
  sm:      { height: 32, paddingHorizontal: 12 },
  lg:      { height: 40, paddingHorizontal: 24 },
  icon:    { height: 36, width: 36, paddingHorizontal: 0 },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '500',
    includeFontPadding: false,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});