import type { Category, Frequency } from './constants';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: Category;
  isPaid: boolean;
  frequency: Frequency;
  billingStartMonth: number; // 1–12
  notes: string;
}

export interface ExpenseFormData {
  name: string;
  amount: string;
  category: Category;
  frequency: Frequency;
  billingStartMonth: string;
  notes: string;
}
