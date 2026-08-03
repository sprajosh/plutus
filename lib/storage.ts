import { db } from './db';
import { expense } from './schema';
import { eq, and, desc } from 'drizzle-orm';
import type { Expense } from './types';

function toExpense(row: typeof expense.$inferSelect): Expense {
  return {
    id: row.id,
    name: row.name,
    amount: row.amount,
    category: row.category as Expense['category'],
    isPaid: row.isPaid,
    frequency: row.frequency as Expense['frequency'],
    billingStartMonth: row.billingStartMonth,
    notes: row.notes,
  };
}

export async function readExpenses(userId: string): Promise<Expense[]> {
  const rows = await db
    .select()
    .from(expense)
    .where(eq(expense.userId, userId))
    .orderBy(desc(expense.createdAt));
  return rows.map(toExpense);
}

export async function createExpense(userId: string, data: Omit<Expense, 'id'>): Promise<Expense> {
  const [row] = await db
    .insert(expense)
    .values({ ...data, userId })
    .returning();
  return toExpense(row);
}

export async function updateExpense(
  userId: string,
  id: string,
  data: Partial<Expense>
): Promise<Expense | null> {
  const [row] = await db
    .update(expense)
    .set(data)
    .where(and(eq(expense.id, id), eq(expense.userId, userId)))
    .returning();
  return row ? toExpense(row) : null;
}

export async function deleteExpense(userId: string, id: string): Promise<boolean> {
  await db
    .delete(expense)
    .where(and(eq(expense.id, id), eq(expense.userId, userId)));
  return true;
}

export async function getExpenseById(
  userId: string,
  id: string
): Promise<Expense | undefined> {
  const [row] = await db
    .select()
    .from(expense)
    .where(and(eq(expense.id, id), eq(expense.userId, userId)))
    .limit(1);
  return row ? toExpense(row) : undefined;
}
