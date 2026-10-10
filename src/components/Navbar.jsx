import React from 'react';
import { Shield, User, Sun, Moon, AlertOctagon, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout, theme, onToggleTheme }) {
  const isAuthority = (user?.role === 'admin' || user?.role === 'authority') && user.isApproved;
  return (
    <header className="app-header">
      <div className="brand-logo">
        <div className="brand-icon">
          <AlertOctagon size={20} />
        </div>
        <div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            RoadGuard
          </span>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-3px' }}>
            Road Damage & Repair Tracker
          </span>
        </div>
      </div>

      <div className="header-actions">
        <span className={`role-badge ${isAuthority ? 'authority' : 'citizen'}`} title={user?.email}>
          {isAuthority ? <Shield size={13} /> : <User size={13} />}
          <span>{isAuthority ? 'Admin' : 'Citizen'}</span>
        </span>

        {/* Theme Toggle */}
        <button 
          onClick={onToggleTheme}
          className="header-icon-button"
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>
        <button onClick={onLogout} className="header-icon-button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
