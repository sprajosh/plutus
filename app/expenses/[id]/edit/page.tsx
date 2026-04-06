import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExpenseById } from '@/lib/storage';
import { editExpenseAction } from '@/lib/actions';
import { ExpenseForm } from '../../../components/ExpenseForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditExpensePage({ params }: Props) {
  const { id } = await params;
  const expense = getExpenseById(id);

  if (!expense) notFound();

  async function handleEdit(formData: FormData) {
    'use server';
    await editExpenseAction(id, formData);
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Expense</h1>
          <p className="page-subtitle">{expense.name}</p>
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
        <ExpenseForm
          defaultValues={expense}
          action={handleEdit}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
