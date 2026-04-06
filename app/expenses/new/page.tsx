import Link from 'next/link';
import { addExpenseAction } from '@/lib/actions';
import { ExpenseForm } from '../../components/ExpenseForm';

export default function NewExpensePage() {
  return (
    <div className="form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Expense</h1>
          <p className="page-subtitle">Create a new recurring or one-time expense</p>
        </div>
        <Link href="/expenses" className="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </Link>
      </div>

      <div className="form-card">
        <ExpenseForm action={addExpenseAction} submitLabel="Add Expense" />
      </div>
    </div>
  );
}
