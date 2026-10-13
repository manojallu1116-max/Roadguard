import React from 'react';
import { Home, Map, PlusCircle, Shield, ListFilter } from 'lucide-react';

export default function BottomNav({ activeTab, onChangeTab, onOpenNewReport, role }) {
  const isAuthority = role === 'admin' || role === 'authority';
  return (
    <nav className={`bottom-nav ${isAuthority ? 'authority-nav' : 'citizen-nav'}`} aria-label="Dashboard navigation">
      {!isAuthority && <button
        className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => onChangeTab('feed')}
      >
        <Home size={20} />
        <span>Complaints</span>
      </button>}

      <button 
        className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
        onClick={() => onChangeTab('map')}
      >
        <Map size={20} />
        <span>Live Map</span>
      </button>

      {!isAuthority && <button
        onClick={onOpenNewReport}
        className="nav-report-button"
        title="Report damaged road"
        aria-label="Report damaged road"
      >
        <PlusCircle size={26} />
      </button>}

      {isAuthority && <button
        className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
        onClick={() => onChangeTab('admin')}
      >
        <Shield size={20} />
        <span>Admin</span>
      </button>}

      {!isAuthority && <button
        className={`nav-item ${activeTab === 'my-reports' ? 'active' : ''}`}
        onClick={() => onChangeTab('my-reports')}
      >
        <ListFilter size={20} />
        <span>My Activity</span>
      </button>}
    </nav>
  );
}
