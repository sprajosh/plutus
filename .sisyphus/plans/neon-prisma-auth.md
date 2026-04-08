# Fintrack — Add Neon PostgreSQL + Prisma + Google Auth

## Context

Next.js 16 App Router expense tracker. Currently uses file-based JSON storage (`lib/storage.ts` + `data/expenses.json`). Need to replace with Neon PostgreSQL + Prisma, add Google OAuth via NextAuth, keep all existing UI/logic intact.

---

## TODOs

- [x] 1. Install packages
- [x] 2. Initialize Prisma: `npx prisma init`
- [x] 3. Create Prisma schema (paste exact schema provided)
- [x] 4. Create Prisma client singleton (`lib/prisma.ts`)
- [x] 5. Set up NextAuth with Google provider (`lib/auth.ts`)
- [x] 6. Create NextAuth route handler (`app/api/auth/[...nextauth]/route.ts`)
- [x] 7. Rewrite `lib/storage.ts` to use Prisma with userId
- [x] 8. Update `lib/actions.ts` to require auth and pass userId
- [x] 9. Update `app/page.tsx` to require auth
- [x] 10. Update `app/expenses/page.tsx` to require auth
- [x] 11. Update `app/expenses/[id]/edit/page.tsx` to require auth
- [x] 12. Update `app/expenses/new/page.tsx` to require auth
- [x] 13. Add Sign In / Sign Out UI to Settings page (`app/settings/page.tsx`)
- [x] 14. Create `.env.example` with all required variables
- [ ] 15. Test local development with Prisma (requires Neon + Google OAuth setup)

---

## Step 1: Install packages

Run in terminal:
```bash
npm install @prisma/client @auth/prisma-adapter next-auth@beta
npm install -D prisma
npx prisma init
```

---

## Step 2: Prisma schema (`prisma/schema.prisma`)

Replace the generated file with:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  expenses      Expense[]
}

model Expense {
  id                String  @id @default(cuid())
  userId            String
  name              String
  amount            Float
  category          String
  isPaid            Boolean @default(false)
  frequency         String  // "monthly" | "quarterly" | "biannual" | "annual"
  billingStartMonth Int
  notes             String  @default("")
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt         DateTime @default(now())
}
```

Then run:
```bash
npx prisma db push
```

---

## Step 3: Prisma client singleton (`lib/prisma.ts`)

Create new file:

```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Step 4: NextAuth (`lib/auth.ts`)

Create new file:

```ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'database',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
```

---

## Step 5: NextAuth route handler (`app/api/auth/[...nextauth]/route.ts`)

Create new file:

```ts
export { GET, POST } from '@/auth';
```

---

## Step 6: Rewrite `lib/storage.ts`

Replace all file I/O with Prisma calls. Every function takes `userId: string` as first param:

```ts
import { prisma } from './prisma';
import type { Expense } from './types';

export function readExpenses(userId: string): Expense[] {
  return prisma.expense.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  }) as unknown as Expense[];
}

export function createExpense(userId: string, data: Omit<Expense, 'id'>): Expense {
  return prisma.expense.create({
    data: {
      ...data,
      userId,
    },
  }) as unknown as Expense;
}

export function updateExpense(userId: string, id: string, data: Partial<Expense>): Expense | null {
  return prisma.expense.update({
    where: { id, userId },
    data,
  }) as unknown as Expense;
}

export function deleteExpense(userId: string, id: string): boolean {
  const result = prisma.expense.delete({
    where: { id, userId },
  });
  return true;
}

export function getExpenseById(userId: string, id: string): Expense | undefined {
  return prisma.expense.findFirst({
    where: { id, userId },
  }) as unknown as Expense | undefined;
}
```

---

## Step 7: Update Server Actions (`lib/actions.ts`)

Every action must:
1. Call `auth()` to get session
2. If no session → redirect to sign in
3. Pass `session.user.id` to all storage calls

Add to top of file:
```ts
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
```

Update each action, for example:
```ts
export async function togglePaidAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }
  
  const expenses = readExpenses(session.user.id);
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return;

  updateExpense(session.user.id, id, { isPaid: !expense.isPaid });
  revalidatePath('/');
  revalidatePath('/expenses');
}
```

Repeat for `deleteExpenseAction`, `createExpenseAction`, `updateExpenseAction`, `monthlyResetAction`.

---

## Step 8: Update pages

All pages that call storage must:
1. `const session = await auth()`
2. Redirect if unauthenticated
3. Pass `session.user.id` to storage functions

### `app/page.tsx`
```ts
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const expenses = readExpenses(session.user.id);
  // ... rest of code
}
```

Repeat for `app/expenses/page.tsx`, `app/expenses/[id]/edit/page.tsx`, `app/expenses/new/page.tsx`.

---

## Step 9: Add Sign In / Sign Out UI to Settings page (`app/settings/page.tsx`)

Instead of topbar, add to the Settings page:

```ts
import { auth, signIn, signOut } from '@/auth';

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div>
      {/* existing content */}
      
      <div className="settings-section">
        <h2 className="settings-heading">Account</h2>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-title">
                {session ? session.user?.name || 'Signed in' : 'Sign in'}
              </span>
              <span className="settings-label-desc">
                {session ? session.user?.email : 'Sign in with Google'}
              </span>
            </div>
            {session ? (
              <form action={async () => {
                'use server';
                await signOut();
              }}>
                <button className="btn btn-secondary" type="submit">
                  Sign Out
                </button>
              </form>
            ) : (
              <a href="/api/auth/signin" className="btn btn-primary">
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

Note: The existing "Profile" and "Logout" buttons in Settings page should be removed or replaced with this new auth section.

---

## Step 10: Environment variables (`.env.example`)

```
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

Generate secret:
```bash
openssl rand -base64 32
```

---

## Verification

1. Run `npx prisma db push` to create tables
2. Set up Google OAuth in Google Cloud Console
3. Add credentials to `.env`
4. Run `npm run dev`
5. Test Google Sign In
6. Create, edit, delete expenses - verify persistence in Neon
7. Test sign out

---

## What NOT to change

- All UI components (`ExpenseRow`, `AnnualSection`, `MobileStatsCard`, etc.)
- `lib/billing.ts`, `lib/types.ts`, `lib/constants.ts`
- CSS / styling
- Billing frequency logic

---

## Success Criteria

- [ ] Google Sign In works
- [ ] Expenses persist in PostgreSQL (Neon)
- [ ] Unauthenticated users redirected to sign in
- [ ] Sign Out clears session
- [ ] All CRUD operations work
- [ ] No regressions in UI/logic
