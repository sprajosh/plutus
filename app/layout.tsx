import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { MobileNav } from './components/MobileNav';

export const metadata: Metadata = {
  title: 'Fintrack — Expense Planner',
  description: 'Personal finance expense tracker',
};

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    return 'theme-' + (localStorage.getItem('fintrack-theme') || 'midnight-blue');
  }
  return 'theme-midnight-blue';
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const theme = getInitialTheme();

  return (
    <html lang="en">
      <body className={theme}>
        <div className="app-shell">
          <header className="topbar">
            <Link href="/" className="topbar-logo">
              <span className="topbar-logo-dot" />
              Fintrack
            </Link>
            <span className="topbar-month">{monthYear}</span>
          </header>

          <nav className="sidebar">
            <div className="sidebar-nav">
              <span className="nav-label">Overview</span>
              <Link href="/" className="nav-link">
                {/* Grid/dashboard icon — 4 small squares */}
                <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="1" width="6" height="6" rx="1"/>
                  <rect x="9" y="1" width="6" height="6" rx="1"/>
                  <rect x="1" y="9" width="6" height="6" rx="1"/>
                  <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
                Dashboard
              </Link>

              <span className="nav-label">Expenses</span>
              <Link href="/expenses" className="nav-link">
                {/* List icon */}
                <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="4" x2="14" y2="4"/>
                  <line x1="5" y1="8" x2="14" y2="8"/>
                  <line x1="5" y1="12" x2="14" y2="12"/>
                  <circle cx="2" cy="4" r="0.8" fill="currentColor" stroke="none"/>
                  <circle cx="2" cy="8" r="0.8" fill="currentColor" stroke="none"/>
                  <circle cx="2" cy="12" r="0.8" fill="currentColor" stroke="none"/>
                </svg>
                All Expenses
              </Link>
              <Link href="/expenses/new" className="nav-link">
                {/* Plus-circle icon */}
                <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6.5"/>
                  <line x1="8" y1="5" x2="8" y2="11"/>
                  <line x1="5" y1="8" x2="11" y2="8"/>
                </svg>
                Add Expense
              </Link>
            </div>
          </nav>

          {/* Mobile bottom nav */}
          <MobileNav />

          <main className="main-content fade-in">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
