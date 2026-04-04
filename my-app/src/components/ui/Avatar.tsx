/**
 * Avatar.tsx
 * React Native port of the shadcn/ui Avatar (Root + Image + Fallback).
 *
 * Usage:
 *   <Avatar>
 *     <AvatarImage source={{ uri: 'https://…' }} />
 *     <AvatarFallback>JD</AvatarFallback>
 *   </Avatar>
 */

import * as React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';

// ─── Context ──────────────────────────────────────────────────────────────────

type AvatarCtx = { imageLoaded: boolean; setImageLoaded: (v: boolean) => void };
const AvatarContext = React.createContext<AvatarCtx>({
  imageLoaded: false,
  setImageLoaded: () => {},
});

// ─── Avatar (root) ────────────────────────────────────────────────────────────

export interface AvatarProps {
  size?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function Avatar({ size = 40, style, children }: AvatarProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const { colors } = useTheme();

  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded }}>
      <View
        style={[
          styles.root,
          { width: size, height: size, borderRadius: size / 2 },
          { backgroundColor: colors.muted },
          style,
        ]}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
}

// ─── AvatarImage ──────────────────────────────────────────────────────────────

export interface AvatarImageProps {
  source: ImageSourcePropType;
  style?: ImageStyle;
}

export function AvatarImage({ source, style }: AvatarImageProps) {
  const { setImageLoaded } = React.useContext(AvatarContext);

  return (
    <Image
      source={source}
      style={[styles.image, style]}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageLoaded(false)}
    />
  );
}

// ─── AvatarFallback ───────────────────────────────────────────────────────────

export interface AvatarFallbackProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AvatarFallback({
  children,
  style,
  textStyle,
}: AvatarFallbackProps) {
  const { imageLoaded } = React.useContext(AvatarContext);
  const { colors } = useTheme();

  if (imageLoaded) return null;

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.fallback, style]}>
      <Text
        style={[styles.fallbackText, { color: colors.mutedForeground }, textStyle]}
      >
        {children}
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 14,
    fontWeight: '500',
    includeFontPadding: false,
  },
});