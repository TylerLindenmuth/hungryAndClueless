/**
 * Badge.tsx
 * React Native port of the shadcn/ui Badge.
 *
 * Variants: default | secondary | destructive | outline
 *
 * Usage:
 *   <Badge>New</Badge>
 *   <Badge variant="destructive">Error</Badge>
 *   <Badge variant="outline" icon={<StarIcon />}>Featured</Badge>
 */

import * as React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeTokens, ThemeTokens } from '../../theme/tokens';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  variant = 'default',
  icon,
  children,
  style,
  textStyle,
}: BadgeProps) {
  const colors = useThemeTokens();
  const isDark = colors.background === '#0f172a';
  const { containerStyle, labelColor } = getVariantStyles(variant, colors, isDark);

  return (
    <View style={[styles.base, containerStyle, style]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text
        style={[styles.label, { color: labelColor }, textStyle]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </View>
  );
}

// ─── Variant helpers ──────────────────────────────────────────────────────────

function getVariantStyles(
  variant: BadgeVariant,
  colors: ThemeTokens,
  isDark: boolean,
): { containerStyle: ViewStyle; labelColor: string } {
  switch (variant) {
    case 'default':
      return {
        containerStyle: { backgroundColor: colors.primary as string, borderColor: 'transparent', borderWidth: 1 },
        labelColor: colors.primaryForeground as string,
      };
    case 'secondary':
      return {
        containerStyle: { backgroundColor: colors.secondary as string, borderColor: 'transparent', borderWidth: 1 },
        labelColor: colors.secondaryForeground as string,
      };
    case 'destructive':
      return {
        containerStyle: {
          backgroundColor: isDark ? (colors.destructive as string) + '99' : colors.destructive as string,
          borderColor: 'transparent',
          borderWidth: 1,
        },
        labelColor: '#ffffff',
      };
    case 'outline':
      return {
        containerStyle: { backgroundColor: 'transparent', borderColor: colors.border as string, borderWidth: 1 },
        labelColor: colors.foreground as string,
      };
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
    gap: 4,
  },
  iconWrap: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    includeFontPadding: false,
  },
});