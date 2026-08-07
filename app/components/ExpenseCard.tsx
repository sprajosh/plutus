'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import { togglePaidAction, deleteExpenseAction } from '@/lib/actions';
import Link from 'next/link';
import type { Expense } from '@/lib/types';
import { getNextBillingInfo } from '@/lib/billing';
import { Spinner } from './Spinner';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

const categoryColors: Record<string, string> = {
  'Food': '#22C55E',
  'Transport': '#F59E0B',
  'Entertainment': '#8B5CF6',
  'Bills': '#EF4444',
  'Shopping': '#EC4899',
  'Health': '#14B8A6',
  'Education': '#3B82F6',
  'Other': '#6B7280',
};

function getCategoryColor(category: string): string {
  return categoryColors[category] || '#6B7280';
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function ExpenseCard({
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
  const [openAbove, setOpenAbove] = useState(false);
  const [optimisticPaid, setOptimisticPaid] = useState(expense.isPaid);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

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
    if (showDue || isPending) return;
    const newPaid = !optimisticPaid;
    setOptimisticPaid(newPaid);
    startTransition(() => {
      togglePaidAction(expense.id);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm(`Delete "${expense.name}"?`)) {
      setHidden(true);
      startTransition(() => {
        deleteExpenseAction(expense.id);
      });
    }
  };

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const nearBottom = rect.bottom + 100 > window.innerHeight;
      setOpenAbove(nearBottom);
    }
    setMenuOpen(!menuOpen);
  };

  if (hidden) return null;

  const nextInfo = showDue ? getNextBillingInfo(expense, currentMonth) : null;
  const categoryColor = getCategoryColor(expense.category);
  const isPaid = showDue ? expense.isPaid : optimisticPaid;

  return (
    <div
      className={`expense-card ${isPaid && !showDue ? 'is-paid' : ''} ${dimmed ? 'dimmed' : ''} ${isPending ? 'is-pending' : ''} ${menuOpen ? 'has-open-menu' : ''}`}
      onClick={handleToggle}
      title={showDue ? undefined : `Click to toggle paid status`}
    >
      <div className="expense-card-left">
        <div className="expense-card-avatar" style={{ background: `${categoryColor}20`, color: categoryColor }}>
          {getInitials(expense.name)}
        </div>
        <div className="expense-card-info">
          <div className="expense-card-name">
            {expense.name}
            {expense.frequency !== 'monthly' && (
              <span className={`freq-badge ${expense.frequency}`}>{expense.frequency}</span>
            )}
          </div>
          <div className="expense-card-meta">
            {expense.category}
            {showDue && nextInfo ? (
              <span className="due-badge">{nextInfo.monthName}</span>
            ) : (
              <span className={`paid-badge ${isPaid ? 'paid' : 'unpaid'}`}>
                {isPending && <Spinner size={12} />}
                {isPaid ? 'Paid' : 'Unpaid'}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="expense-card-right">
        <span className="expense-card-amount">{formatCurrency(expense.amount)}</span>
        <div className="kebab-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            ref={btnRef}
            className="kebab-btn"
            onClick={openMenu}
            aria-label="More options"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          {menuOpen && (
            <div className={`kebab-dropdown ${openAbove ? 'open-above' : ''}`}>
              <Link
                href={`/expenses/${expense.id}/edit`}
                className="kebab-dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </Link>
              <button
                className="kebab-dropdown-item danger"
                onClick={(e) => { handleDelete(e); setMenuOpen(false); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    </div>
  );
}
