'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from './auth';
import { createExpense, updateExpense, deleteExpense, readExpenses } from './storage';
import { isActiveInMonth } from './billing';
import type { Category, Frequency } from './constants';
import { prisma } from './prisma';

async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }
  return session.user.id;
}

export async function addExpenseAction(formData: FormData) {
  const userId = await getUserId();
  
  const name = formData.get('name') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as Category;
  const frequency = formData.get('frequency') as Frequency;
  const billingStartMonth = parseInt(formData.get('billingStartMonth') as string, 10);
  const notes = (formData.get('notes') as string) || '';

  if (!name || isNaN(amount) || amount <= 0) {
    throw new Error('Invalid expense data');
  }

  await createExpense(userId, {
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
  const userId = await getUserId();
  
  const name = formData.get('name') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as Category;
  const frequency = formData.get('frequency') as Frequency;
  const billingStartMonth = parseInt(formData.get('billingStartMonth') as string, 10);
  const notes = (formData.get('notes') as string) || '';

  if (!name || isNaN(amount) || amount <= 0) {
    throw new Error('Invalid expense data');
  }

  await updateExpense(userId, id, {
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
  const userId = await getUserId();
  
  const expenses = await readExpenses(userId);
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return;

  await updateExpense(userId, id, { isPaid: !expense.isPaid });
  revalidatePath('/');
  revalidatePath('/expenses');
}

export async function deleteExpenseAction(id: string) {
  const userId = await getUserId();
  await deleteExpense(userId, id);
  revalidatePath('/');
  revalidatePath('/expenses');
}

export async function monthlyResetAction() {
  const userId = await getUserId();
  
  const currentMonth = new Date().getMonth() + 1;
  const expenses = await readExpenses(userId);

  for (const expense of expenses) {
    if (isActiveInMonth(expense, currentMonth)) {
      await updateExpense(userId, expense.id, { isPaid: false });
    }
  }
  
  revalidatePath('/');
  revalidatePath('/expenses');
}