import React from 'react';
import { Home, Map, PlusCircle, Shield, ListFilter } from 'lucide-react';

export default function BottomNav({ activeTab, onChangeTab, onOpenNewReport, role }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => onChangeTab('feed')}
      >
        <Home size={20} />
        <span>Complaints</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
        onClick={() => onChangeTab('map')}
      >
        <Map size={20} />
        <span>Live Map</span>
      </button>

      <button 
        onClick={onOpenNewReport}
        style={{
          background: 'var(--accent-gradient)',
          color: 'white',
          border: 'none',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.5)',
          cursor: 'pointer',
          marginTop: '-18px'
        }}
        title="Report Damaged Road"
      >
        <PlusCircle size={26} />
      </button>

      <button 
        className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
        onClick={() => onChangeTab('admin')}
      >
        <Shield size={20} />
        <span>Authorities</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'my-reports' ? 'active' : ''}`}
        onClick={() => onChangeTab('my-reports')}
      >
        <ListFilter size={20} />
        <span>My Activity</span>
      </button>
    </nav>
  );
}
