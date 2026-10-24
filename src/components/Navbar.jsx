import React from 'react';
import { Shield, User, AlertOctagon, LogOut } from 'lucide-react';
import { usePreferences } from '../preferences/PreferencesContext';
import PreferenceControls from './PreferenceControls';

export default function Navbar({ user, onLogout }) {
  const { t } = usePreferences();
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
            {t('Road Damage & Repair Tracker')}
          </span>
        </div>
      </div>

      <div className="header-actions">
        <span className={`role-badge ${isAuthority ? 'authority' : 'citizen'}`} title={user?.email}>
          {isAuthority ? <Shield size={13} /> : <User size={13} />}
          <span>{isAuthority ? t('Admin') : t('Citizen')}</span>
        </span>

        <PreferenceControls className="header-preferences" />
        <button onClick={onLogout} className="header-icon-button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title={t('Sign out')} aria-label={t('Sign out')}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
