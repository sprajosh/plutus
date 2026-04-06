# Fintrack — Personal Finance Expense Tracker

A full-featured expense tracker built with **Next.js 16 App Router**, supporting monthly, quarterly, biannual, and annual billing cycles.

## Features

- **Dashboard** with monthly summary stats (total, paid, pending)
- **Smart billing cycles** — expenses auto-activate based on frequency and billing month
- **Annual/periodic section** — inactive expenses shown in a collapsible table with "Due in [Month]" badge
- **Click-to-toggle** paid/unpaid status on any row
- **Add / Edit / Delete** expenses via dedicated pages
- **Monthly Reset** — clears paid status for currently active expenses only
- **File-based storage** via `data/expenses.json` (no database needed)
- **Dark indigo theme** with DM Mono + Syne typography

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
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
finance-planner/
├── app/
│   ├── layout.tsx              # Shell with sidebar nav
│   ├── page.tsx                # Dashboard
│   ├── globals.css             # All styles (dark theme)
│   ├── components/
│   │   ├── ExpenseRow.tsx      # Table row with toggle + actions
│   │   ├── AnnualSection.tsx   # Collapsible inactive expenses
│   │   ├── ExpenseForm.tsx     # Reusable add/edit form
│   │   └── ResetButton.tsx     # Monthly reset button
│   └── expenses/
│       ├── page.tsx            # All expenses list
│       ├── new/page.tsx        # Add expense page
│       └── [id]/edit/page.tsx  # Edit expense page
├── lib/
│   ├── constants.ts            # Categories, frequencies, STORAGE_MODE flag
│   ├── types.ts                # Expense interface
│   ├── billing.ts              # isActiveInMonth(), getNextBillingInfo()
│   ├── storage.ts              # JSON file read/write
│   └── actions.ts              # Server Actions (add, edit, delete, toggle, reset)
└── data/
    └── expenses.json           # Your expense data
```

## Data Model

```json
{
  "id": "1",
  "name": "Amazon Prime",
  "amount": 139,
  "category": "Subscriptions",
  "isPaid": false,
  "frequency": "annual",
  "billingStartMonth": 12,
  "notes": "Annual renewal in December"
}
```

## Phase 2 Roadmap (Production)

Switch `STORAGE_MODE` in `lib/constants.ts` from `'local'` to `'db'` to enable:
- **Neon PostgreSQL** + **Prisma ORM** for persistent storage
- **Google Auth** via NextAuth.js
- Multi-user support with per-user expense isolation

## Tech Stack

- **Next.js 16** (App Router + Server Actions)
- **TypeScript**
- **Custom CSS** (no Tailwind dependency)
- **File-based JSON** storage (dev mode)
