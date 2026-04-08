'use client';

import { useState, useEffect, useRef } from 'react';

const themes = [
  { id: 'midnight-blue', name: 'Midnight Blue', color: '#2563EB' },
  { id: 'graphite-lime', name: 'Graphite Lime', color: '#84CC16' },
  { id: 'obsidian-copper', name: 'Obsidian Copper', color: '#C8762A' },
  { id: 'abyss-violet', name: 'Abyss Violet', color: '#7C6AF0' },
];

export default function SettingsPage() {
  const [currentTheme, setCurrentTheme] = useState('midnight-blue');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
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
    setCurrentTheme(themeId);
    localStorage.setItem('fintrack-theme', themeId);
    document.body.className = `theme-${themeId}`;
    setDropdownOpen(false);
  };

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

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