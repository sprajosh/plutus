'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createExpense, updateExpense, deleteExpense, readExpenses, writeExpenses } from './storage';
import { isActiveInMonth } from './billing';
import type { Category, Frequency } from './constants';

export async function addExpenseAction(formData: FormData) {
  const name = formData.get('name') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as Category;
  const frequency = formData.get('frequency') as Frequency;
  const billingStartMonth = parseInt(formData.get('billingStartMonth') as string, 10);
  const notes = (formData.get('notes') as string) || '';

  if (!name || isNaN(amount) || amount <= 0) {
    throw new Error('Invalid expense data');
  }

  createExpense({
    name,
    amount,
    category,
    isPaid: false,
    frequency,
    billingStartMonth,
    notes,
  });

  revalidatePath('/');
  revalidatePath('/expenses');
  redirect('/expenses');
}

export async function editExpenseAction(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as Category;
  const frequency = formData.get('frequency') as Frequency;
  const billingStartMonth = parseInt(formData.get('billingStartMonth') as string, 10);
  const notes = (formData.get('notes') as string) || '';

  if (!name || isNaN(amount) || amount <= 0) {
    throw new Error('Invalid expense data');
  }

  updateExpense(id, {
    name,
    amount,
    category,
    frequency,
    billingStartMonth,
    notes,
  });

  revalidatePath('/');
  revalidatePath('/expenses');
  redirect('/expenses');
}

export async function togglePaidAction(id: string) {
  const expenses = readExpenses();
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return;

  updateExpense(id, { isPaid: !expense.isPaid });
  revalidatePath('/');
  revalidatePath('/expenses');
}

export async function deleteExpenseAction(id: string) {
  deleteExpense(id);
  revalidatePath('/');
  revalidatePath('/expenses');
}

export async function monthlyResetAction() {
  const currentMonth = new Date().getMonth() + 1;
  const expenses = readExpenses();

  const updated = expenses.map((expense) => {
    if (isActiveInMonth(expense, currentMonth)) {
      return { ...expense, isPaid: false };
    }
    return expense;
  });

  writeExpenses(updated);
  revalidatePath('/');
  revalidatePath('/expenses');
}
