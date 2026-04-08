import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { MobileNav } from './components/MobileNav';

export const metadata: Metadata = {
  title: 'Fintrack — Expense Planner',
  description: 'Personal finance expense tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('fintrack-theme') || 'midnight-blue';
                document.body.className = 'theme-' + theme;
              })();
            `,
          }}
        />
      </head>
      <body>
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

              <span className="nav-label">System</span>
              <Link href="/settings" className="nav-link">
                {/* Gear icon */}
                <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="2.5"/>
                  <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M2.9 13.1l1.4-1.4M11.7 4.3l1.4-1.4"/>
                </svg>
                Settings
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
