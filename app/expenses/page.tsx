import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { readExpenses } from '@/lib/storage';
import { isActiveInMonth } from '@/lib/billing';
import { ExpenseRow } from '../components/ExpenseRow';
import { AnnualSection } from '../components/AnnualSection';
import { ResetButton } from '../components/ResetButton';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default async function ExpensesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const expenses = await readExpenses(session.user.id);
  const currentMonth = new Date().getMonth() + 1;

  const activeExpenses = expenses.filter((e) => isActiveInMonth(e, currentMonth));
  const inactiveExpenses = expenses.filter((e) => !isActiveInMonth(e, currentMonth));
  const sortedActive = [...activeExpenses].sort((a, b) => b.amount - a.amount);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Expenses</h1>
          <p className="page-subtitle">{expenses.length} total · {activeExpenses.length} active this month</p>
        </div>
        <div className="actions-bar">
          <ResetButton />
          <Link href="/expenses/new" className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Expense
          </Link>
        </div>
      </div>

      <div className="section-header">
        <div className="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          Active This Month
          <span className="section-badge">{activeExpenses.length}</span>
        </div>
      </div>

      <div className="table-wrap">
        {sortedActive.length === 0 ? (
          <div className="empty-state">No active expenses this month</div>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th className="col-expense">Expense</th>
                <th className="col-category">Category</th>
                <th className="col-spacer"></th>
                <th className="col-status">Status</th>
                <th className="col-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sortedActive.map((expense) => (
                <ExpenseRow key={expense.id} expense={expense} currentMonth={currentMonth} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnnualSection expenses={inactiveExpenses} currentMonth={currentMonth} />
    </>
  );
}
