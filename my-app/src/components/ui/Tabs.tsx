/**
 * Tabs.tsx
 * React Native port of the shadcn/ui Tabs (Radix @radix-ui/react-tabs).
 *
 * Usage:
 *   <Tabs defaultValue="account">
 *     <TabsList>
 *       <TabsTrigger value="account">Account</TabsTrigger>
 *       <TabsTrigger value="password">Password</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="account"><AccountPanel /></TabsContent>
 *     <TabsContent value="password"><PasswordPanel /></TabsContent>
 *   </Tabs>
 */

import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';

// ─── Context ──────────────────────────────────────────────────────────────────

type TabsCtx = {
  value: string;
  onValueChange: (v: string) => void;
};

const TabsContext = React.createContext<TabsCtx>({
  value: '',
  onValueChange: () => {},
});

// ─── Tabs (root) ──────────────────────────────────────────────────────────────

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  /** Allow horizontal scrolling of the TabsList */
  scrollable?: boolean;
}

export function Tabs({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  children,
  style,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue! : internalValue;

  const handleChange = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <View style={[styles.root, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

// ─── TabsList ────────────────────────────────────────────────────────────────

export interface TabsListProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  /** Allow horizontal scroll when there are many tabs */
  scrollable?: boolean;
}

export function TabsList({ children, style, scrollable = false }: TabsListProps) {
  const { colors } = useTheme();

  const inner = (
    <View style={[styles.list, { backgroundColor: colors.muted }, style]}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {inner}
      </ScrollView>
    );
  }

  return inner;
}

// ─── TabsTrigger ─────────────────────────────────────────────────────────────

export interface TabsTriggerProps {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Optional leading icon */
  icon?: React.ReactNode;
}

export function TabsTrigger({
  value,
  children,
  disabled,
  style,
  textStyle,
  icon,
}: TabsTriggerProps) {
  const { colors, isDark } = useTheme();
  const { value: activeValue, onValueChange } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (disabled) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onValueChange(value);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled }}
      style={[styles.triggerOuter, disabled && styles.disabled]}
    >
      <Animated.View
        style={[
          styles.trigger,
          isActive && {
            backgroundColor: isDark ? colors.inputBackground : colors.card,
            borderColor: isDark ? colors.border : 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 2,
            elevation: 1,
          },
          !isActive && { borderColor: 'transparent' },
          { transform: [{ scale: scaleAnim }] },
          style,
        ]}
      >
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text
          style={[
            styles.triggerText,
            {
              color: isActive
                ? colors.foreground
                : isDark
                ? colors.mutedForeground
                : colors.foreground,
              fontWeight: isActive ? '500' : '400',
            },
            textStyle,
          ]}
          numberOfLines={1}
        >
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── TabsContent ─────────────────────────────────────────────────────────────

export interface TabsContentProps {
  value: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  /** Keep content mounted even when not active (for state preservation) */
  keepMounted?: boolean;
}

export function TabsContent({
  value,
  children,
  style,
  keepMounted = false,
}: TabsContentProps) {
  const { value: activeValue } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  if (!keepMounted && !isActive) return null;

  return (
    <View
        style={[styles.content, !isActive && styles.contentHidden, style]}
        accessibilityRole="none" // or "tab"
        >
        {children}
        </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    gap: 8,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 10,
    padding: 3,
  },
  triggerOuter: {
    flex: 1,
    height: '100%',
  },
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    gap: 6,
  },
  triggerText: {
    fontSize: 14,
    includeFontPadding: false,
  },
  iconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentHidden: {
    display: 'none',
  },
  disabled: {
    opacity: 0.5,
  },
});