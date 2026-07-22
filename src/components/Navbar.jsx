import React from 'react';
import { Shield, User, Smartphone, Sun, Moon, AlertOctagon } from 'lucide-react';

export default function Navbar({ role, onToggleRole, theme, onToggleTheme, onOpenApkGuide }) {
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
        {/* APK Guide Button */}
        <button 
          onClick={onOpenApkGuide} 
          style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '5px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
          title="Get APK Build Instructions"
        >
          <Smartphone size={13} />
          APK
        </button>

        {/* Role Toggle Pill */}
        <button 
          className={`role-badge ${role.toLowerCase()}`}
          onClick={onToggleRole}
          title={`Click to switch to ${role === 'Citizen' ? 'Authority' : 'Citizen'} view`}
        >
          {role === 'Citizen' ? <User size={13} /> : <Shield size={13} />}
          <span>{role} Mode</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={onToggleTheme}
          className="header-icon-button"
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>
      </div>
    </header>
  );
}
