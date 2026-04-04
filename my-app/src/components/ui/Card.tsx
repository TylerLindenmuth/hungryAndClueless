/**
 * Card.tsx
 * React Native port of the shadcn/ui Card family.
 *
 * Usage:
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>Hello</CardTitle>
 *       <CardDescription>Subtitle</CardDescription>
 *       <CardAction><Button size="icon" /></CardAction>
 *     </CardHeader>
 *     <CardContent>…</CardContent>
 *     <CardFooter>…</CardFooter>
 *   </Card>
 */

import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ─── CardHeader ───────────────────────────────────────────────────────────────

export interface CardHeaderProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

// ─── CardTitle ────────────────────────────────────────────────────────────────

export interface CardTitleProps {
  children?: React.ReactNode;
  style?: TextStyle;
}

export function CardTitle({ children, style }: CardTitleProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[styles.title, { color: colors.cardForeground }, style]}
      numberOfLines={2}
    >
      {children}
    </Text>
  );
}

// ─── CardDescription ─────────────────────────────────────────────────────────

export interface CardDescriptionProps {
  children?: React.ReactNode;
  style?: TextStyle;
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.description, { color: colors.mutedForeground }, style]}>
      {children}
    </Text>
  );
}

// ─── CardAction ───────────────────────────────────────────────────────────────
// Absolutely positioned top-right slot (mirrors col-start-2 row-span-2 CSS)

export interface CardActionProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function CardAction({ children, style }: CardActionProps) {
  return (
    <View style={[styles.action, style]}>
      {children}
    </View>
  );
}

// ─── CardContent ─────────────────────────────────────────────────────────────

export interface CardContentProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

// ─── CardFooter ───────────────────────────────────────────────────────────────

export interface CardFooterProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function CardFooter({ children, style }: CardFooterProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.footer,
        { borderTopColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    flex: 1,
    includeFontPadding: false,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  action: {
    alignSelf: 'flex-start',
    marginLeft: 'auto',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 8,
  },
});