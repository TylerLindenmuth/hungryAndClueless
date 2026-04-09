/**
 * components/index.ts
 * Barrel export for all React Native UI components.
 */

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

// Modal family (Dialog + Drawer + Sheet unified)
export {
  // Shared
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,

  // Dialog
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,

  // Drawer
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,

  // Sheet
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

export {
  Select,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectValue,
} from '../components/ui/Select';
export type {
  SelectProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectSeparatorProps,
} from '../components/ui/Select';

export { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from '../components/ui/Tabs';

export { Switch } from '../components/ui/Switch';
export type { SwitchProps } from '../components/ui/Switch';

export { Progress } from '../components/ui/Progress';
export type { ProgressProps } from '../components/ui/Progress';

export { cn } from '../lib/utils';