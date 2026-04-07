'use client';

import { useState, useEffect, useRef } from 'react';

const themes = [
  { id: 'midnight-blue', name: 'Midnight Blue', color: '#2563EB' },
  { id: 'forest', name: 'Forest', color: '#4ade80' },
  { id: 'sunset', name: 'Sunset', color: '#fb923c' },
  { id: 'slate', name: 'Slate', color: '#38bdf8' },
  { id: 'rose', name: 'Rose', color: '#f472b6' },
  { id: 'forest-minimal', name: 'Forest Minimal', color: '#2F855A' },
  { id: 'sunset-warm', name: 'Sunset Warm', color: '#F97316' },
  { id: 'cool-teal', name: 'Cool Teal', color: '#14B8A6' },
  { id: 'graphite-lime', name: 'Graphite Lime', color: '#84CC16' },
  { id: 'deep-purple', name: 'Deep Purple', color: '#8B5CF6' },
  { id: 'ocean-blue', name: 'Ocean Blue', color: '#3B82F6' },
  { id: 'rose-soft', name: 'Rose Soft', color: '#F43F5E' },
  { id: 'ice-blue', name: 'Ice Blue', color: '#38BDF8' },
  { id: 'sand-light', name: 'Sand Light', color: '#D97706' },
  { id: 'mint-light', name: 'Mint Light', color: '#14B8A6' },
  { id: 'pastel-simple', name: 'Pastel Simple', color: '#A5B4FC' },
  { id: 'soft-lavender', name: 'Soft Lavender', color: '#C4B5FD' },
  { id: 'peach-calm', name: 'Peach Calm', color: '#FDBA74' },
  { id: 'mint-breeze', name: 'Mint Breeze', color: '#99F6E4' },
  { id: 'baby-blue', name: 'Baby Blue', color: '#93C5FD' },
];

export default function SettingsPage() {
  const [currentTheme, setCurrentTheme] = useState('midnight-blue');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('fintrack-theme') || 'midnight-blue';
    setCurrentTheme(saved);
    document.body.className = `theme-${saved}`;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleThemeChange = (themeId: string) => {
    const className = `theme-${themeId}`;
    setCurrentTheme(themeId);
    localStorage.setItem('fintrack-theme', themeId);
    document.body.className = className;
    setDropdownOpen(false);
  };

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

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
              <span className="settings-label-desc">Choose your preferred color scheme</span>
            </div>
            <div className="theme-dropdown" ref={dropdownRef}>
              <button 
                className="theme-dropdown-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="theme-dot" style={{ background: currentThemeData.color }} />
                {currentThemeData.name}
                <svg className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="theme-dropdown-menu">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      className={`theme-dropdown-item ${currentTheme === theme.id ? 'active' : ''}`}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <span className="theme-dot" style={{ background: theme.color }} />
                      {theme.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-heading">Account</h2>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-title">Profile</span>
              <span className="settings-label-desc">Manage your account details</span>
            </div>
            <button className="btn btn-secondary" disabled>Coming Soon</button>
          </div>
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-title">Logout</span>
              <span className="settings-label-desc">Sign out of your account</span>
            </div>
            <button className="btn btn-secondary" disabled>Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
}