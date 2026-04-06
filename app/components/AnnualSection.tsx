'use client';

import { useState } from 'react';
import type { Expense } from '@/lib/types';
import { ExpenseRow } from './ExpenseRow';

export function AnnualSection({
  expenses,
  currentMonth,
}: {
  expenses: Expense[];
  currentMonth: number;
}) {
  const [open, setOpen] = useState(true);

  if (expenses.length === 0) return null;

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.6 }}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Upcoming Periodic Expenses
          <span className="section-badge amber">{expenses.length} inactive</span>
        </div>
        <button className="collapsible-btn" onClick={() => setOpen(!open)}>
          <svg className={`chevron ${open ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
          {open ? 'collapse' : 'expand'}
        </button>
      </div>

      {open && (
        <div className="table-wrap" style={{ opacity: 0.85 }}>
          <table className="expense-table">
            <thead>
              <tr>
                <th className="col-expense">Expense</th>
                <th className="col-category">Category</th>
                <th className="col-spacer"></th>
                <th className="col-status">Next Due</th>
                <th className="col-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  showDue
                  currentMonth={currentMonth}
                  dimmed
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
