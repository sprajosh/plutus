'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function MobileNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="mobile-nav">
      <Link href="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="1" width="6" height="6" rx="1"/>
          <rect x="9" y="1" width="6" height="6" rx="1"/>
          <rect x="1" y="9" width="6" height="6" rx="1"/>
          <rect x="9" y="9" width="6" height="6" rx="1"/>
        </svg>
        Dashboard
      </Link>
      <Link href="/expenses" className={`mobile-nav-link ${isActive('/expenses') ? 'active' : ''}`}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="4" x2="14" y2="4"/>
          <line x1="5" y1="8" x2="14" y2="8"/>
          <line x1="5" y1="12" x2="14" y2="12"/>
          <circle cx="2" cy="4" r="0.8" fill="currentColor" stroke="none"/>
          <circle cx="2" cy="8" r="0.8" fill="currentColor" stroke="none"/>
          <circle cx="2" cy="12" r="0.8" fill="currentColor" stroke="none"/>
        </svg>
        Expenses
      </Link>
      <Link href="/expenses/new" className={`mobile-nav-link mobile-nav-add ${isActive('/expenses/new') ? 'active' : ''}`}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="6.5"/>
          <line x1="8" y1="5" x2="8" y2="11"/>
          <line x1="5" y1="8" x2="11" y2="8"/>
        </svg>
        Add
      </Link>
      <Link href="/settings" className={`mobile-nav-link ${isActive('/settings') ? 'active' : ''}`}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="2"/>
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.6l1.4-1.4M11.1 4.9l1.4-1.4"/>
        </svg>
        Settings
      </Link>
    </nav>
  );
}