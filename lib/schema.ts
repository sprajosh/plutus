import { sqliteTable, text, integer, real, unique, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// ── User ──────────────────────────────────────────────
export const user = sqliteTable('user', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp' }),
  image: text('image'),
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  expenses: many(expense),
}));

// ── Account (NextAuth OAuth) ──────────────────────────
export const account = sqliteTable('account', {
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compositePk: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

// ── Session (NextAuth database sessions) ──────────────
export const session = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

// ── Expense ───────────────────────────────────────────
export const expense = sqliteTable('expense', {
  id: text('id').primaryKey().$defaultFn(createId),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  amount: real('amount').notNull(),
  category: text('category').notNull(),
  isPaid: integer('isPaid', { mode: 'boolean' }).notNull().default(false),
  frequency: text('frequency').notNull(),
  billingStartMonth: integer('billingStartMonth').notNull(),
  notes: text('notes').notNull().default(''),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const expenseRelations = relations(expense, ({ one }) => ({
  user: one(user, { fields: [expense.userId], references: [user.id] }),
}));
