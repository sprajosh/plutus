// Storage mode flag — 'db' uses Turso (Drizzle), 'local' uses JSON file fallback
export const STORAGE_MODE: 'local' | 'db' = 'db';

export const CATEGORIES = [
  'Housing',
  'Loans',
  'Utilities',
  'Insurance',
  'Subscriptions',
  'Transport',
  'Food',
  'Healthcare',
  'Other',
] as const;

export type Category = typeof CATEGORIES[number];

export const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly (every 3 months)' },
  { value: 'biannual', label: 'Biannual (every 6 months)' },
  { value: 'annual', label: 'Annual (once a year)' },
] as const;

export type Frequency = 'monthly' | 'quarterly' | 'biannual' | 'annual';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
