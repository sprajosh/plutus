# Plutus — Personal Finance Expense Tracker

A full-featured expense tracker built with **Next.js 16 App Router**, supporting monthly, quarterly, biannual, and annual billing cycles. Multi-user with Google authentication and persistent Turso database storage.

## Features

- **Dashboard** with monthly summary stats (total, paid, pending)
- **Smart billing cycles** — expenses auto-activate based on frequency and billing month
- **Upcoming periodic section** — inactive expenses shown in a collapsible list with "Due in [Month]" badge
- **Click-to-toggle** paid/unpaid status on any card
- **Add / Edit / Delete** expenses via dedicated pages
- **Monthly Reset** — clears paid status for currently active expenses only
- **Google OAuth** via NextAuth.js with per-user expense isolation
- **Dark / Light theme** toggle, persisted in localStorage
- **Responsive design** — sidebar on desktop, bottom tab bar on mobile
- **Turso database** (SQLite-compatible) via Drizzle ORM

## Billing Frequency Logic

The core function in `lib/billing.ts`:

```ts
function isActiveInMonth(expense, currentMonth) {
  if (expense.frequency === 'monthly') return true;
  const intervals = { quarterly: 3, biannual: 6, annual: 12 };
  const gap = intervals[expense.frequency];
  const diff = ((currentMonth - expense.billingStartMonth) % gap + gap) % gap;
  return diff === 0;
}
```

Examples:
- **Amazon Prime** (annual, billingStartMonth: 12) → active only in December
- **Car Insurance** (quarterly, billingStartMonth: 1) → active in Jan, Apr, Jul, Oct
- **Gym** (biannual, billingStartMonth: 3) → active in March and September

## Getting Started

```bash
npm install
```

Set up environment variables (see `.env.example`):
- `TURSO_DATABASE_URL` — Turso database URL
- `TURSO_AUTH_TOKEN` — Turso auth token
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- `NEXTAUTH_SECRET` — NextAuth secret key
- `NEXTAUTH_URL` — App URL (e.g. `http://localhost:3000`)

```bash
npm run db:push    # Push schema to Turso
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
plutus/
├── app/
│   ├── layout.tsx                 # App shell: topbar, sidebar, mobile nav
│   ├── page.tsx                   # Dashboard (home page)
│   ├── globals.css                # All styles (dark indigo theme)
│   ├── components/
│   │   ├── ExpenseCard.tsx        # Card UI with toggle, kebab menu
│   │   ├── ExpenseRow.tsx         # Table row variant
│   │   ├── ExpenseForm.tsx        # Reusable add/edit form
│   │   ├── AnnualSection.tsx      # Collapsible inactive expenses
│   │   ├── ResetButton.tsx        # Monthly reset button
│   │   ├── MobileNav.tsx          # Bottom tab bar for mobile
│   │   ├── MobileStatsCard.tsx    # Auto-flipping stats card for mobile
│   │   ├── TopbarAvatar.tsx       # User avatar in topbar
│   │   └── Spinner.tsx            # Loading spinner
│   ├── expenses/
│   │   ├── page.tsx               # All expenses list
│   │   ├── new/page.tsx           # Add expense page
│   │   └── [id]/edit/page.tsx     # Edit expense page
│   ├── settings/
│   │   ├── page.tsx               # Settings page
│   │   └── SettingsContent.tsx    # Theme toggle, profile, sign out
│   └── api/auth/[...nextauth]/    # NextAuth API route
├── lib/
│   ├── actions.ts                 # Server Actions (CRUD + toggle + reset)
│   ├── auth.ts                    # NextAuth config (Google, Drizzle adapter)
│   ├── billing.ts                 # Billing cycle logic
│   ├── constants.ts               # Categories, frequencies, storage mode
│   ├── db.ts                      # Turso/Drizzle database client
│   ├── schema.ts                  # Drizzle schema (user, account, session, expense)
│   ├── storage.ts                 # Database CRUD operations
│   └── types.ts                   # TypeScript interfaces
├── data/
│   └── expenses.json              # JSON file fallback (local storage mode)
└── drizzle.config.ts              # Drizzle Kit config for Turso
```

## Data Model

```json
{
  "id": "cuid2",
  "userId": "user-id",
  "name": "Amazon Prime",
  "amount": 139,
  "category": "Subscriptions",
  "isPaid": false,
  "frequency": "annual",
  "billingStartMonth": 12,
  "notes": "Annual renewal in December"
}
```

## Tech Stack

- **Next.js 16** (App Router + Server Actions)
- **TypeScript**
- **NextAuth.js v5** (Google OAuth, database sessions)
- **Drizzle ORM** with **Turso** (SQLite-compatible)
- **Custom CSS** (no Tailwind dependency)

## Database Commands

```bash
npm run db:generate  # Generate migration files
npm run db:push      # Push schema changes to Turso
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```
