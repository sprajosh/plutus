import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { readExpenses } from '@/lib/storage';
import { isActiveInMonth } from '@/lib/billing';
import { ExpenseCard } from './components/ExpenseCard';
import { AnnualSection } from './components/AnnualSection';
import { ResetButton } from './components/ResetButton';
import { MobileStatsCard } from './components/MobileStatsCard';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const expenses = await readExpenses(session.user.id);
  const currentMonth = new Date().getMonth() + 1;

  const activeExpenses = expenses.filter((e) => isActiveInMonth(e, currentMonth));
  const inactiveExpenses = expenses.filter((e) => !isActiveInMonth(e, currentMonth));

  const total = activeExpenses.reduce((sum, e) => sum + e.amount, 0);
  const paid = activeExpenses.filter((e) => e.isPaid).reduce((sum, e) => sum + e.amount, 0);
  const pending = total - paid;
  const paidCount = activeExpenses.filter((e) => e.isPaid).length;
  const unpaidCount = activeExpenses.filter((e) => !e.isPaid).length;

  const sortedActive = [...activeExpenses].sort((a, b) => b.amount - a.amount);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Click any card to toggle paid status</p>
        </div>
        <div className="actions-bar">
          <ResetButton />
          <Link href="/expenses/new" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Expense
          </Link>
        </div>
      </div>

      <div className="stats-grid desktop-stats">
        <div className="stat-card">
          <div className="stat-label">Total Monthly</div>
          <div className="stat-value">{formatCurrency(total)}</div>
          <div className="stat-sub">{activeExpenses.length} active expenses</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{formatCurrency(pending)}</div>
          <div className="stat-sub">{unpaidCount} unpaid</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Paid</div>
          <div className="stat-value">{formatCurrency(paid)}</div>
          <div className="stat-sub">{paidCount} cleared</div>
        </div>
      </div>

      <MobileStatsCard
        total={total}
        pending={pending}
        paid={paid}
        activeCount={activeExpenses.length}
        unpaidCount={unpaidCount}
        paidCount={paidCount}
      />

      <div className="section-header">
        <div className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          This Month
          <span className="section-badge">{activeExpenses.length} expenses</span>
        </div>
      </div>

      {sortedActive.length === 0 ? (
        <div className="empty-state">No active expenses this month</div>
      ) : (
        <div className="expense-card-list">
          {sortedActive.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} currentMonth={currentMonth} />
          ))}
        </div>
      )}

      <AnnualSection expenses={inactiveExpenses} currentMonth={currentMonth} />
    </>
  );
}
