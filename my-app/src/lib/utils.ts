/**
 * utils.ts
 * React Native style-merging utilities — replaces the web `cn()` / clsx helper.
 */

import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;
type StyleProp = Style | Style[] | null | undefined | false;

/**
 * Merges an arbitrary number of RN style objects / arrays / falsy values.
 * Works the same way `cn()` does for Tailwind — later entries win.
 *
 * @example
 *   style={cs(styles.base, isActive && styles.active, props.style)}
 */
export function cn(...args: StyleProp[]): Style {
  const flat: Style[] = [];
  for (const arg of args) {
    if (!arg) continue;
    if (Array.isArray(arg)) flat.push(...(arg.filter(Boolean) as Style[]));
    else flat.push(arg);
  }
  return StyleSheet.flatten(flat) as Style;
}

export default cn;