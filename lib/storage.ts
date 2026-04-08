import { prisma } from './prisma';
import type { Expense } from './types';

export async function readExpenses(userId: string): Promise<Expense[]> {
  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return expenses as unknown as Expense[];
}

export async function createExpense(userId: string, data: Omit<Expense, 'id'>): Promise<Expense> {
  const expense = await prisma.expense.create({
    data: {
      ...data,
      userId,
    },
  });
  return expense as unknown as Expense;
}

export async function updateExpense(userId: string, id: string, data: Partial<Expense>): Promise<Expense | null> {
  try {
    const expense = await prisma.expense.update({
      where: { id, userId },
      data,
    });
    return expense as unknown as Expense;
  } catch {
    return null;
  }
}

export async function deleteExpense(userId: string, id: string): Promise<boolean> {
  await prisma.expense.delete({
    where: { id, userId },
  });
  return true;
}

export async function getExpenseById(userId: string, id: string): Promise<Expense | undefined> {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });
  return expense as unknown as Expense | undefined;
}