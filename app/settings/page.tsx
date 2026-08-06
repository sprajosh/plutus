'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('plutus-theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    } else {
      setIsDark(false);
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleTheme = (dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      localStorage.setItem('plutus-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      localStorage.setItem('plutus-theme', 'light');
      document.body.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Customize your experience</p>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-heading">Appearance</h2>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-title">Theme</span>
              <span className="settings-label-desc">Choose light or dark mode</span>
            </div>
            <div className="theme-toggle">
              <button
                className={`theme-toggle-btn ${!isDark ? 'active' : ''}`}
                onClick={() => toggleTheme(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                Light
              </button>
              <button
                className={`theme-toggle-btn ${isDark ? 'active' : ''}`}
                onClick={() => toggleTheme(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-heading">Account</h2>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-title">Sign In</span>
              <span className="settings-label-desc">Sign in with Google to sync your data</span>
            </div>
            <a href="/api/auth/signin" className="btn btn-primary">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
}
