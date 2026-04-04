/**
 * Select.tsx
 * React Native port of the shadcn/ui Select (Radix @radix-ui/react-select).
 *
 * Uses a Modal + FlatList dropdown — no native picker — to match the web
 * component's look and behaviour as closely as possible.
 *
 * Usage:
 *   const [value, setValue] = React.useState('');
 *
 *   <Select value={value} onValueChange={setValue}>
 *     <SelectTrigger placeholder="Pick a fruit…" />
 *     <SelectContent>
 *       <SelectGroup>
 *         <SelectLabel>Fruits</SelectLabel>
 *         <SelectItem value="apple">Apple</SelectItem>
 *         <SelectItem value="banana">Banana</SelectItem>
 *       </SelectGroup>
 *       <SelectSeparator />
 *       <SelectItem value="other">Other</SelectItem>
 *     </SelectContent>
 *   </Select>
 */

import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  TextStyle,
  LayoutRectangle,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';

const SCREEN_H = Dimensions.get('window').height;
const CHECK = '✓';
const CHEVRON_DOWN = '⌄';
const CHEVRON_UP = '⌃';

// ─── Context ──────────────────────────────────────────────────────────────────

type SelectCtx = {
  value: string;
  onValueChange: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  items: SelectItemDef[];
  registerItem: (item: SelectItemDef) => void;
};

const SelectContext = React.createContext<SelectCtx>({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  items: [],
  registerItem: () => {},
});

type SelectItemDef = { value: string; label: string; disabled?: boolean };

// ─── Select (root) ────────────────────────────────────────────────────────────

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Select({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  disabled,
  children,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpenState] = React.useState(false);
  const [items, setItems] = React.useState<SelectItemDef[]>([]);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue! : internalValue;

  const handleValueChange = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v);
      onValueChange?.(v);
      setOpenState(false);
    },
    [isControlled, onValueChange],
  );

  const setOpen = React.useCallback(
    (v: boolean) => { if (!disabled) setOpenState(v); },
    [disabled],
  );

  const registerItem = React.useCallback((item: SelectItemDef) => {
    setItems(prev => {
      if (prev.find(i => i.value === item.value)) return prev;
      return [...prev, item];
    });
  }, []);

  return (
    <SelectContext.Provider
      value={{ value, onValueChange: handleValueChange, open, setOpen, items, registerItem }}
    >
      {children}
    </SelectContext.Provider>
  );
}

// ─── SelectGroup ─────────────────────────────────────────────────────────────

export interface SelectGroupProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function SelectGroup({ children, style }: SelectGroupProps) {
  return <View style={[styles.group, style]}>{children}</View>;
}

// ─── SelectLabel ─────────────────────────────────────────────────────────────

export interface SelectLabelProps {
  children?: React.ReactNode;
  style?: TextStyle;
}

export function SelectLabel({ children, style }: SelectLabelProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.label, { color: colors.mutedForeground }, style]}>
      {children}
    </Text>
  );
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────

export interface SelectTriggerProps {
  placeholder?: string;
  size?: 'sm' | 'default';
  invalid?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  /** Layout ref used to position the dropdown */
  triggerRef?: React.RefObject<View>;
  onLayout?: (layout: LayoutRectangle) => void;
}

export function SelectTrigger({
  placeholder = 'Select…',
  size = 'default',
  invalid = false,
  disabled,
  style,
}: SelectTriggerProps) {
  const { colors } = useTheme();
  const { value, open, setOpen, items } = React.useContext(SelectContext);

  const label = items.find(i => i.value === value)?.label ?? '';
  const hasValue = Boolean(label);

  return (
    <Pressable
      onPress={() => setOpen(!open)}
      disabled={disabled}
      accessibilityRole="combobox"
      accessibilityState={{ expanded: open, disabled }}
      style={({ pressed }) => [
        styles.trigger,
        size === 'sm' ? styles.triggerSm : styles.triggerDefault,
        {
          backgroundColor: colors.inputBackground,
          borderColor: invalid
            ? colors.destructive
            : open
            ? colors.ring
            : colors.border,
          borderWidth: open ? 2 : 1,
        },
        pressed && styles.triggerPressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.triggerText,
          { color: hasValue ? colors.foreground : colors.mutedForeground },
        ]}
        numberOfLines={1}
      >
        {hasValue ? label : placeholder}
      </Text>
      <Text style={[styles.chevron, { color: colors.mutedForeground }]}>
        {open ? CHEVRON_UP : CHEVRON_DOWN}
      </Text>
    </Pressable>
  );
}

// ─── SelectContent ────────────────────────────────────────────────────────────

export interface SelectContentProps {
  children?: React.ReactNode;
  maxHeight?: number;
  style?: ViewStyle;
}

export function SelectContent({
  children,
  maxHeight = SCREEN_H * 0.45,
  style,
}: SelectContentProps) {
  const { colors } = useTheme();
  const { open, setOpen } = React.useContext(SelectContext);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 22, stiffness: 320 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [open]);

  if (!open) return null;

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={() => setOpen(false)}
    >
      {/* Dismiss overlay */}
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={() => setOpen(false)}
      />
      {/* Dropdown — rendered at top of modal so we can position it freely */}
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: colors.popover,
            borderColor: colors.border,
            maxHeight,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.scrollUpBtn}>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{CHEVRON_UP}</Text>
        </View>
        <View style={styles.viewport}>{children}</View>
        <View style={styles.scrollDownBtn}>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{CHEVRON_DOWN}</Text>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── SelectItem ───────────────────────────────────────────────────────────────

export interface SelectItemProps {
  value: string;
  children: string; // label text
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function SelectItem({
  value,
  children,
  disabled,
  style,
  textStyle,
}: SelectItemProps) {
  const { colors } = useTheme();
  const { value: selected, onValueChange, registerItem } = React.useContext(SelectContext);
  const isSelected = selected === value;

  // Register this item so SelectTrigger can resolve the label
  React.useEffect(() => {
    registerItem({ value, label: children, disabled });
  }, [value, children, disabled]);

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(value)}
      disabled={disabled}
      style={({ pressed, hovered }) => [
        styles.item,
        pressed && { backgroundColor: colors.accent },
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: isSelected, disabled }}
    >
      <Text
        style={[
          styles.itemText,
          { color: colors.popoverForeground },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
      {isSelected && (
        <View style={styles.itemCheck}>
          <Text style={{ color: colors.foreground, fontSize: 12 }}>{CHECK}</Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── SelectSeparator ─────────────────────────────────────────────────────────

export interface SelectSeparatorProps {
  style?: ViewStyle;
}

export function SelectSeparator({ style }: SelectSeparatorProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.separator,
        { backgroundColor: colors.border },
        style,
      ]}
    />
  );
}

// ─── SelectValue (display only — use SelectTrigger's placeholder prop) ────────

/** In RN the value display is handled inside SelectTrigger. This is a no-op
 *  shim for API compatibility when migrating code. */
export function SelectValue(_props: { placeholder?: string }) {
  return null;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    paddingHorizontal: 12,
    gap: 8,
    width: '100%',
  },
  triggerDefault: { height: 36 },
  triggerSm:     { height: 32 },
  triggerPressed:{ opacity: 0.85 },
  triggerText: {
    flex: 1,
    fontSize: 14,
    includeFontPadding: false,
  },
  chevron: { fontSize: 16, lineHeight: 20 },
  content: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    width: '80%',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  viewport: { paddingVertical: 4 },
  group: { marginBottom: 2 },
  label: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 32,
    borderRadius: 4,
    marginHorizontal: 4,
    gap: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    includeFontPadding: false,
  },
  itemCheck: {
    position: 'absolute',
    right: 8,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    marginVertical: 4,
    marginHorizontal: -4,
  },
  scrollUpBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  scrollDownBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  disabled: { opacity: 0.5 },
});