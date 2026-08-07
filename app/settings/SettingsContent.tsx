'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Spinner } from '@/app/components/Spinner';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SettingsContentProps {
  user: User | null;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function SettingsContent({ user }: SettingsContentProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

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

  const handleSignOut = () => {
    setSigningOut(true);
    signOut({ callbackUrl: '/' });
  };

  if (!mounted) return null;

  const showAvatarImage = user?.image && !imgError;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-heading">Profile</h2>
        <div className="settings-card">
          <div className="profile-card">
            <div className="profile-avatar-wrapper">
              {showAvatarImage ? (
                <img
                  src={user!.image!}
                  alt={user!.name ?? 'User'}
                  className="profile-avatar-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="profile-avatar">
                  {getInitials(user?.name)}
                </div>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-name">{user?.name ?? 'Unknown User'}</div>
              <div className="profile-email">{user?.email ?? 'No email'}</div>
            </div>
            <button
              className="btn btn-secondary profile-signout"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <Spinner size={14} />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              )}
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
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
    </div>
  );
}
