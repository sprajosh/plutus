'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, FREQUENCIES, MONTHS } from '@/lib/constants';
import type { Expense } from '@/lib/types';

interface ExpenseFormProps {
  defaultValues?: Partial<Expense>;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export function ExpenseForm({ defaultValues, action, submitLabel }: ExpenseFormProps) {
  const router = useRouter();
  const [frequency, setFrequency] = useState(defaultValues?.frequency ?? 'monthly');
  const [isPending, setIsPending] = useState(false);

  const showBillingMonth = frequency !== 'monthly';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    if (frequency === 'monthly') {
      formData.set('billingStartMonth', '1');
    }
    try {
      await action(formData);
    } catch {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Expense Name</label>
        <input
          name="name"
          className="form-input"
          placeholder="e.g. Amazon Prime"
          defaultValue={defaultValues?.name ?? ''}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            className="form-input"
            placeholder="0.00"
            defaultValue={defaultValues?.amount ?? ''}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-select"
            defaultValue={defaultValues?.category ?? 'Other'}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Billing Frequency</label>
          <select
            name="frequency"
            className="form-select"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as typeof frequency)}
            required
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {showBillingMonth && (
          <div className="form-group">
            <label className="form-label">First Billing Month</label>
            <select
              name="billingStartMonth"
              className="form-select"
              defaultValue={defaultValues?.billingStartMonth ?? new Date().getMonth() + 1}
              required
            >
              {MONTHS.map((month, i) => (
                <option key={i + 1} value={i + 1}>{month}</option>
              ))}
            </select>
            <p className="form-hint">
              {frequency === 'quarterly' && 'Repeats every 3 months from this month'}
              {frequency === 'biannual' && 'Repeats every 6 months from this month'}
              {frequency === 'annual' && 'Repeats every year in this month'}
            </p>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          name="notes"
          className="form-textarea"
          placeholder="Any additional details..."
          defaultValue={defaultValues?.notes ?? ''}
        />
      </div>

      <div className="form-footer">
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Saving...' : submitLabel}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
