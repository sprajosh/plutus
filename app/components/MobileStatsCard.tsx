'use client';

import { useEffect, useState } from 'react';

interface Props {
  total: number;
  pending: number;
  paid: number;
  activeCount: number;
  unpaidCount: number;
  paidCount: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function MobileStatsCard({ total, pending, paid, activeCount, unpaidCount, paidCount }: Props) {
  const [showPaid, setShowPaid] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setShowPaid((v) => !v), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mobile-stats-row">
      {/* Card 1: Total */}
      <div className="stat-card mobile-stat">
        <div className="stat-label">Total Monthly</div>
        <div className="stat-value">{fmt(total)}</div>
        <div className="stat-sub">{activeCount} active</div>
      </div>

      {/* Card 2: Pending ↔ Paid toggle */}
      <div className={`stat-card mobile-stat ${showPaid ? 'green' : 'amber'}`}>
        <div className="mobile-flip-wrap">
          {/* Pending face */}
          <div className={`mobile-flip-face ${showPaid ? 'flip-out' : 'flip-in'}`}>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{fmt(pending)}</div>
            <div className="stat-sub">{unpaidCount} unpaid</div>
          </div>
          {/* Paid face */}
          <div className={`mobile-flip-face ${showPaid ? 'flip-in' : 'flip-out'}`} aria-hidden={!showPaid}>
            <div className="stat-label">Paid</div>
            <div className="stat-value">{fmt(paid)}</div>
            <div className="stat-sub">{paidCount} cleared</div>
          </div>
        </div>
        {/* Dots indicator */}
        <div className="flip-dots">
          <span className={`flip-dot ${!showPaid ? 'active' : ''}`} />
          <span className={`flip-dot ${showPaid ? 'active' : ''}`} />
        </div>
      </div>
    </div>
  );
}
