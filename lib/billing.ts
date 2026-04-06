import type { Expense } from './types';
import type { Frequency } from './constants';

/**
 * Determines if an expense is active (due) in the given month.
 * Monthly expenses are always active.
 * For quarterly/biannual/annual, checks if currentMonth falls on a billing cycle
 * starting from billingStartMonth.
 */
export function isActiveInMonth(expense: Expense, currentMonth: number): boolean {
  if (expense.frequency === 'monthly') return true;

  const intervals: Record<Exclude<Frequency, 'monthly'>, number> = {
    quarterly: 3,
    biannual: 6,
    annual: 12,
  };

  const gap = intervals[expense.frequency as Exclude<Frequency, 'monthly'>];
  const start = expense.billingStartMonth; // 1–12

  // Normalize to 0-based for modulo math
  const diff = ((currentMonth - start) % gap + gap) % gap;
  return diff === 0;
}

/**
 * Returns the next billing month for an expense after the given month.
 */
export function getNextBillingMonth(expense: Expense, fromMonth: number): number {
  if (expense.frequency === 'monthly') return fromMonth;

  const intervals: Record<Exclude<Frequency, 'monthly'>, number> = {
    quarterly: 3,
    biannual: 6,
    annual: 12,
  };

  const gap = intervals[expense.frequency as Exclude<Frequency, 'monthly'>];
  const start = expense.billingStartMonth;

  // Find the next month (1-12) that is a billing month and is > fromMonth
  for (let offset = 1; offset <= 12; offset++) {
    const candidate = ((fromMonth - 1 + offset) % 12) + 1;
    if (isActiveInMonth({ ...expense, billingStartMonth: start }, candidate)) {
      return candidate;
    }
  }

  return start; // fallback
}

/**
 * Returns all billing months in a year for an expense.
 */
export function getBillingMonths(expense: Expense): number[] {
  if (expense.frequency === 'monthly') {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }

  const months: number[] = [];
  for (let m = 1; m <= 12; m++) {
    if (isActiveInMonth(expense, m)) {
      months.push(m);
    }
  }
  return months;
}

/**
 * Returns months until next billing, and the month name.
 */
export function getNextBillingInfo(
  expense: Expense,
  currentMonth: number
): { monthsUntil: number; monthName: string; monthNumber: number } {
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const nextMonth = getNextBillingMonth(expense, currentMonth);
  let monthsUntil = nextMonth - currentMonth;
  if (monthsUntil <= 0) monthsUntil += 12;

  return {
    monthsUntil,
    monthName: MONTHS[nextMonth - 1],
    monthNumber: nextMonth,
  };
}
