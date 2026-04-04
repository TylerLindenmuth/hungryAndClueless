/**
 * src/index.ts — barrel export for all UI components and theme utilities.
 * Import from '@/src' instead of deep paths.
 *
 * Examples:
 *   import { Card, CardContent, useTheme, Badge } from '@/src';
 *   import { useFonts, fontFamilies } from '@/src';
 */

// ─── UI Components ────────────────────────────────────────────────────────────

export { Button } from '../components/ui/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from '../components/ui/Button';

export { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps } from '../components/ui/Avatar';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '../components/ui/Card';
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardActionProps,
  CardContentProps,
  CardFooterProps,
} from '../components/ui/Card';

export { Input } from '../components/ui/Input';
export type { InputProps } from '../components/ui/Input';

export { Badge } from '../components/ui/Badge';
export type { BadgeProps, BadgeVariant } from '../components/ui/Badge';

export {
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,

  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,

  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,

  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '../components/ui/Modal';
export type {
  DialogProps,
  DialogContentProps,
  DrawerProps,
  DrawerContentProps,
  DrawerDirection,
  SheetProps,
  SheetContentProps,
  SheetSide,
} from '../components/ui/Modal';

// ─── Utils ────────────────────────────────────────────────────────────────────

export { cn } from '../lib/utils';

// ─── Theme ────────────────────────────────────────────────────────────────────

// tokens — default export + named helpers
export {
  default as tokens,
  lightTokens,
  darkTokens,
  radius,
  fontWeight,
  fontSize,
  TypeScale,
  useThemeTokens,
} from '../theme/tokens';
export type { ThemeTokens, ColorTokens, ThemeMode } from '../theme/tokens';

// useTheme — hook + color helper
export { useTheme, useThemeColor } from '../theme/useTheme';
export type { Theme, ThemeColors, UseThemeReturn } from '../theme/useTheme';

// fonts — hook + family map
export { useFonts, fontFamilies, useAppFonts } from '../theme/fonts';
export type { FontFamilyName } from '../theme/fonts';