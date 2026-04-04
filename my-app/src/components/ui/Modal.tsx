/**
 * Modal.tsx
 * React Native port of the three web modal primitives merged into one file:
 *
 *   • Dialog  – centered overlay modal  (replaces @radix-ui/react-dialog)
 *   • Drawer  – edge-attached panel     (replaces vaul Drawer)
 *   • Sheet   – slide-in side/edge panel (replaces @radix-ui/react-dialog Sheet)
 *
 * All three share the same Overlay, Header, Footer, Title, Description sub-
 * components. Each exposes its own Content variant.
 *
 * Usage — Dialog:
 *   <Dialog visible={open} onClose={() => setOpen(false)}>
 *     <DialogContent>
 *       <DialogHeader>
 *         <DialogTitle>Are you sure?</DialogTitle>
 *         <DialogDescription>This cannot be undone.</DialogDescription>
 *       </DialogHeader>
 *       <DialogFooter>
 *         <Button onPress={() => setOpen(false)}>Cancel</Button>
 *       </DialogFooter>
 *     </DialogContent>
 *   </Dialog>
 *
 * Usage — Drawer (bottom sheet):
 *   <Drawer visible={open} onClose={() => setOpen(false)} direction="bottom">
 *     <DrawerContent>…</DrawerContent>
 *   </Drawer>
 *
 * Usage — Sheet (side panel):
 *   <Sheet visible={open} onClose={() => setOpen(false)} side="right">
 *     <SheetContent>…</SheetContent>
 *   </Sheet>
 */

import * as React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  TextStyle,
  ScrollView,
  Platform,
  PanResponder,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CLOSE_ICON = '✕';

// ─── Shared Overlay ───────────────────────────────────────────────────────────

interface OverlayProps {
  visible: boolean;
  onClose: () => void;
  anim: Animated.Value;
}

function ModalOverlay({ visible, onClose, anim }: OverlayProps) {
  if (!visible) return null;
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.overlay,
        { opacity: anim },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
    </Animated.View>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

export function ModalHeader({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function ModalFooter({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

export function ModalTitle({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: TextStyle;
}) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.title, { color: colors.foreground }, style]}>
      {children}
    </Text>
  );
}

export function ModalDescription({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: TextStyle;
}) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.description, { color: colors.mutedForeground }, style]}>
      {children}
    </Text>
  );
}

// ─── Close button ─────────────────────────────────────────────────────────────

function CloseButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
      accessibilityLabel="Close"
      hitSlop={8}
    >
      <Text style={{ color: colors.foreground, fontSize: 13 }}>{CLOSE_ICON}</Text>
    </Pressable>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIALOG  – centered modal
// ═══════════════════════════════════════════════════════════════════════════════

export interface DialogProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function Dialog({ visible, onClose, children }: DialogProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 300 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.dialogContainer}>
        <ModalOverlay visible={visible} onClose={onClose} anim={fadeAnim} />
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], width: '100%' }}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export interface DialogContentProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export function DialogContent({
  children,
  style,
  showCloseButton = true,
  onClose,
}: DialogContentProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.dialogContent,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          shadowColor: '#000',
        },
        style,
      ]}
    >
      {showCloseButton && onClose && (
        <CloseButton onPress={onClose} />
      )}
      {children}
    </View>
  );
}

// Convenience aliases matching the web API
export const DialogHeader = ModalHeader;
export const DialogFooter = ModalFooter;
export const DialogTitle = ModalTitle;
export const DialogDescription = ModalDescription;


// ═══════════════════════════════════════════════════════════════════════════════
// DRAWER  – edge-attached panel (vaul replacement)
// ═══════════════════════════════════════════════════════════════════════════════

export type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';

export interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  direction?: DrawerDirection;
  children?: React.ReactNode;
}

export function Drawer({
  visible,
  onClose,
  direction = 'bottom',
  children,
}: DrawerProps) {
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, damping: 25, stiffness: 300 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const translateStyle = getDrawerTranslate(direction, slideAnim);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={StyleSheet.absoluteFillObject}>
        <ModalOverlay visible={visible} onClose={onClose} anim={fadeAnim} />
        <Animated.View
          style={[
            styles.drawerBase,
            drawerPositionStyle(direction),
            translateStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export interface DrawerContentProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  direction?: DrawerDirection;
  onClose?: () => void;
}

export function DrawerContent({
  children,
  style,
  direction = 'bottom',
  onClose,
}: DrawerContentProps) {
  const { colors } = useTheme();

  // Drag-handle visible for bottom drawers
  const showHandle = direction === 'bottom';

  return (
    <View
      style={[
        styles.drawerContent,
        drawerContentRadius(direction),
        drawerBorderSide(direction, colors.border),
        { backgroundColor: colors.background },
        style,
      ]}
    >
      {showHandle && <View style={[styles.handle, { backgroundColor: colors.muted }]} />}
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {children}
      </ScrollView>
      {onClose && (
        <View style={styles.drawerClose}>
          <CloseButton onPress={onClose} />
        </View>
      )}
    </View>
  );
}

export const DrawerHeader = ModalHeader;
export const DrawerFooter = ModalFooter;
export const DrawerTitle = ModalTitle;
export const DrawerDescription = ModalDescription;


// ═══════════════════════════════════════════════════════════════════════════════
// SHEET  – slide-in overlay panel (Radix Sheet replacement)
// ═══════════════════════════════════════════════════════════════════════════════

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  side?: SheetSide;
  children?: React.ReactNode;
}

export function Sheet({
  visible,
  onClose,
  side = 'right',
  children,
}: SheetProps) {
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, damping: 28, stiffness: 280 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const translateStyle = getDrawerTranslate(side, slideAnim);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={StyleSheet.absoluteFillObject}>
        <ModalOverlay visible={visible} onClose={onClose} anim={fadeAnim} />
        <Animated.View
          style={[
            styles.sheetBase,
            sheetPositionStyle(side),
            translateStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export interface SheetContentProps {
  children?: React.ReactNode;
  side?: SheetSide;
  style?: ViewStyle;
  onClose?: () => void;
}

export function SheetContent({
  children,
  side = 'right',
  style,
  onClose,
}: SheetContentProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.sheetContent,
        sheetBorderSide(side, colors.border),
        { backgroundColor: colors.background },
        style,
      ]}
    >
      {onClose && (
        <View style={styles.sheetClose}>
          <CloseButton onPress={onClose} />
        </View>
      )}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export const SheetHeader = ModalHeader;
export const SheetFooter = ModalFooter;
export const SheetTitle = ModalTitle;
export const SheetDescription = ModalDescription;


// ─── Animation helpers ────────────────────────────────────────────────────────

function getDrawerTranslate(
  direction: DrawerDirection | SheetSide,
  anim: Animated.Value,
): Animated.WithAnimatedObject<ViewStyle> {
  const progress = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  switch (direction) {
    case 'bottom':
      return {
        transform: [
          {
            translateY: progress as Animated.AnimatedInterpolation<number>,
          },
        ],
      };
    case 'top':
      return {
        transform: [
          {
            translateY: progress as Animated.AnimatedInterpolation<number>,
          },
        ],
      };
    case 'right':
      return {
        transform: [
          {
            translateX: progress as Animated.AnimatedInterpolation<number>,
          },
        ],
      };
    case 'left':
      return {
        transform: [
          {
            translateX: progress as Animated.AnimatedInterpolation<number>,
          },
        ],
      };
  }
}

function drawerPositionStyle(dir: DrawerDirection): ViewStyle {
  switch (dir) {
    case 'bottom': return { bottom: 0, left: 0, right: 0 };
    case 'top':    return { top: 0, left: 0, right: 0 };
    case 'right':  return { top: 0, bottom: 0, right: 0, width: SCREEN_W * 0.75 };
    case 'left':   return { top: 0, bottom: 0, left: 0, width: SCREEN_W * 0.75 };
  }
}

function sheetPositionStyle(side: SheetSide): ViewStyle {
  return drawerPositionStyle(side);
}

function drawerContentRadius(dir: DrawerDirection): ViewStyle {
  switch (dir) {
    case 'bottom': return { borderTopLeftRadius: 12, borderTopRightRadius: 12 };
    case 'top':    return { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 };
    default:       return {};
  }
}

function drawerBorderSide(
  dir: DrawerDirection,
  color: string,
): ViewStyle {
  switch (dir) {
    case 'bottom': return { borderTopWidth: 1, borderColor: color };
    case 'top':    return { borderBottomWidth: 1, borderColor: color };
    case 'right':  return { borderLeftWidth: 1, borderColor: color };
    case 'left':   return { borderRightWidth: 1, borderColor: color };
  }
}

function sheetBorderSide(side: SheetSide, color: string): ViewStyle {
  return drawerBorderSide(side, color);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  // Dialog
  dialogContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 50,
  },
  dialogContent: {
    width: '100%',
    maxWidth: 512,
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    gap: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.12,
    elevation: 8,
    zIndex: 51,
  },
  // Drawer
  drawerBase: {
    position: 'absolute',
    zIndex: 51,
    maxHeight: SCREEN_H * 0.85,
  },
  drawerContent: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // safe area
  },
  handle: {
    width: 100,
    height: 8,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  drawerClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  // Sheet
  sheetBase: {
    position: 'absolute',
    zIndex: 51,
  },
  sheetContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  sheetClose: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 16,
    right: 16,
    zIndex: 10,
  },
  // Shared
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 8,
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    includeFontPadding: false,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});