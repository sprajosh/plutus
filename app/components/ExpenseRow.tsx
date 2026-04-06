'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import { togglePaidAction, deleteExpenseAction } from '@/lib/actions';
import Link from 'next/link';
import type { Expense } from '@/lib/types';
import { MONTHS } from '@/lib/constants';
import { getNextBillingInfo } from '@/lib/billing';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ExpenseRow({
  expense,
  showDue,
  currentMonth,
  dimmed,
}: {
  expense: Expense;
  showDue?: boolean;
  currentMonth: number;
  dimmed?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!showDue) {
      startTransition(() => togglePaidAction(expense.id));
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm(`Delete "${expense.name}"?`)) {
      startTransition(() => deleteExpenseAction(expense.id));
    }
  };

  const nextInfo = showDue ? getNextBillingInfo(expense, currentMonth) : null;

  return (
    <tr
      className={`${expense.isPaid && !showDue ? 'is-paid' : ''} ${dimmed ? 'annual-row' : ''} ${isPending ? 'opacity-50' : ''}`}
      onClick={handleToggle}
      title={showDue ? undefined : `Click to toggle paid status`}
    >
      <td className="col-expense">
        <div className="expense-name">
          {expense.name}
          {expense.frequency !== 'monthly' && (
            <span className={`freq-badge ${expense.frequency}`}>{expense.frequency}</span>
          )}
        </div>
      </td>
      <td className="col-category">
        <span className="category-pill">{expense.category}</span>
      </td>
      <td className="col-spacer"></td>
      <td className="col-status">
        {showDue && nextInfo ? (
          <span className="due-badge">{nextInfo.monthName}</span>
        ) : (
          <span className={`paid-badge ${expense.isPaid ? 'paid' : 'unpaid'}`}>
            {expense.isPaid ? '✓ paid' : '○ unpaid'}
          </span>
        )}
      </td>
      <td className="col-amount">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="expense-amount">{formatCurrency(expense.amount)}</span>
          <div className="kebab-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button 
              className="kebab-btn" 
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              aria-label="More options"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
            {menuOpen && (
              <div className="kebab-dropdown">
                <Link 
                  href={`/expenses/${expense.id}/edit`}
                  className="kebab-dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </Link>
                <button 
                  className="kebab-dropdown-item danger" 
                  onClick={(e) => { handleDelete(e); setMenuOpen(false); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
