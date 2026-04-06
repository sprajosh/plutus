import fs from 'fs';
import path from 'path';
import type { Expense } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'expenses.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

export function readExpenses(): Expense[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

export function writeExpenses(expenses: Expense[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2), 'utf-8');
}

export function getExpenseById(id: string): Expense | undefined {
  return readExpenses().find((e) => e.id === id);
}

export function createExpense(data: Omit<Expense, 'id'>): Expense {
  const expenses = readExpenses();
  const newExpense: Expense = {
    ...data,
    id: Date.now().toString(),
  };
  expenses.push(newExpense);
  writeExpenses(expenses);
  return newExpense;
}

export function updateExpense(id: string, data: Partial<Expense>): Expense | null {
  const expenses = readExpenses();
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  expenses[idx] = { ...expenses[idx], ...data };
  writeExpenses(expenses);
  return expenses[idx];
}

export function deleteExpense(id: string): boolean {
  const expenses = readExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  if (filtered.length === expenses.length) return false;
  writeExpenses(filtered);
  return true;
}
