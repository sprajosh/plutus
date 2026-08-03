import { sqliteTable, text, integer, real, unique } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// ── User ──────────────────────────────────────────────
export const user = sqliteTable('user', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('email_verified', { mode: 'timestamp' }),
  image: text('image'),
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  expenses: many(expense),
}));

// ── Account (NextAuth OAuth) ──────────────────────────
export const account = sqliteTable('account', {
  id: text('id').primaryKey().$defaultFn(createId),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
}, (t) => [
  unique('account_provider_provider_account_id_unique').on(t.provider, t.providerAccountId),
]);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

// ── Session (NextAuth database sessions) ──────────────
export const session = sqliteTable('session', {
  id: text('id').primaryKey().$defaultFn(createId),
  sessionToken: text('session_token').notNull().unique(),
  userId: text('user_id')
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
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  amount: real('amount').notNull(),
  category: text('category').notNull(),
  isPaid: integer('is_paid', { mode: 'boolean' }).notNull().default(false),
  frequency: text('frequency').notNull(),
  billingStartMonth: integer('billing_start_month').notNull(),
  notes: text('notes').notNull().default(''),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const expenseRelations = relations(expense, ({ one }) => ({
  user: one(user, { fields: [expense.userId], references: [user.id] }),
}));
