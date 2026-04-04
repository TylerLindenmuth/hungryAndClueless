// src/lib/constants.ts

// ── AsyncStorage key registry ─────────────────────────────────────────────────
// Single source of truth for every AsyncStorage key used in the app.
// Import STORAGE_KEYS wherever you call AsyncStorage directly so key strings
// never drift out of sync across files.
export const STORAGE_KEYS = {
  USERS:        'users',       // User[] — all registered accounts
  USER_DATA:    'user_data',   // User   — currently logged-in user
  AUTH_TOKEN:   'auth_token',  // string — JWT / session token
} as const;

// ── API ───────────────────────────────────────────────────────────────────────
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

// ── Meal form options ─────────────────────────────────────────────────────────
export const CATEGORIES = [
  'Fast Food',
  'Home Cooked',
  'Restaurant',
  'Takeout',
  'Delivery',
  'Meal Prep',
  'Other',
];

export const CUISINES = [
  'American',
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Thai',
  'Indian',
  'French',
  'Greek',
  'Vietnamese',
  'Korean',
  'Mediterranean',
  'Spanish',
  'British',
  'Other',
];

export const PREP_TIMES = [
  '5min',
  '10min',
  '15min',
  '20min',
  '25min',
  '30min',
  '45min',
  '1hr',
  '1.5hr',
  '2hr',
  '3hr+',
];

export const FLAVOR_TAGS = [
  'Spicy',
  'Sweet',
  'Salty',
  'Sour',
  'Savory',
  'Bitter',
  'Umami',
  'Mild',
  'Rich',
  'Light',
];

export const TIME_OF_DAY_TAGS = [
  'Breakfast',
  'Brunch',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
  'Late Night',
];

export const COMMON_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Carb',
  'High-Protein',
  'Healthy',
  'Comfort Food',
  'Quick & Easy',
  'Kid-Friendly',
  'Fancy',
  'Casual',
  'Leftovers-Friendly',
];