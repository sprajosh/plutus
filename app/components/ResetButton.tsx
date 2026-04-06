'use client';

import { useTransition } from 'react';
import { monthlyResetAction } from '@/lib/actions';

export function ResetButton() {
  const [isPending, startTransition] = useTransition();

  const handleReset = () => {
    if (confirm('Reset all payment statuses for a new month? This will mark all active expenses as unpaid.')) {
      startTransition(() => monthlyResetAction());
    }
  };

  return (
    <button
      className="btn btn-secondary"
      onClick={handleReset}
      disabled={isPending}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
      </svg>
      {isPending ? 'Resetting...' : 'New Month Reset'}
    </button>
  );
}
