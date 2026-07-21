import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ComplaintCard from './components/ComplaintCard';
import MapView from './components/MapView';
import NewComplaintModal from './components/NewComplaintModal';
import AuthorityDashboard from './components/AuthorityDashboard';
import ApkGuideModal from './components/ApkGuideModal';
import { ROAD_CATEGORIES } from './data/mockComplaints';
import { Plus, Search, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [complaints, setComplaints] = useState([]);

  const [role, setRole] = useState('Citizen'); // 'Citizen' or 'Authority'
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'map', 'admin', 'my-reports'
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);
  const [selectedComplaintForModal, setSelectedComplaintForModal] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const response = await fetch('/api/complaints');
        const data = await response.json();
        setComplaints(data);
      } catch (error) {
        console.error('Failed to load complaints', error);
      }
    };

    loadComplaints();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleRole = () => {
    const nextRole = role === 'Citizen' ? 'Authority' : 'Citizen';
    setRole(nextRole);
    if (nextRole === 'Authority') {
      setActiveTab('admin');
      showToast("Switched to Authority / Officer Dashboard");
    } else {
      setActiveTab('feed');
      showToast("Switched to Citizen Mode");
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAddComplaint = async (newComplaint) => {
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComplaint)
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Backend error response:', text);
        throw new Error(`Server error: ${response.status} ${response.statusText}\n${text}`);
      }
      const createdComplaint = await response.json();
      setComplaints([createdComplaint, ...complaints]);
      setActiveTab('feed');
      showToast(`Complaint #${createdComplaint.id} submitted successfully!`);
    } catch (error) {
      console.error('Failed to create complaint:', error);
      showToast('Unable to save your report right now.');
    }
  };

  const handleUpvote = async (complaintId) => {
    try {
      const complaint = complaints.find((c) => c.id === complaintId);
      if (!complaint) return;
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upvotes: (complaint.upvotes || 0) + 1 })
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Backend error response:', text);
        throw new Error(`Server error: ${response.status} ${response.statusText}\n${text}`);
      }
      const updated = await response.json();
      setComplaints(complaints.map((c) => c.id === complaintId ? updated : c));
      showToast('Upvoted! Thank you for prioritizing this issue.');
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  const handleAddRating = async (complaintId, rating) => {
    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizenRating: rating })
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Backend error response:', text);
        throw new Error(`Server error: ${response.status} ${response.statusText}\n${text}`);
      }
      const updated = await response.json();
      setComplaints(complaints.map((c) => c.id === complaintId ? updated : c));
      showToast(`Rating recorded: ${rating} Star(s)!`);
    } catch (error) {
      console.error('Failed to save rating:', error);
    }
  };

  const handleUpdateStatus = async (complaintId, { status, note, department, proofPhotoUrl }) => {
    try {
      const complaint = complaints.find((c) => c.id === complaintId);
      if (!complaint) return;
      const newTimeline = [...(complaint.timeline || [])];
      newTimeline.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${status} by authority.`
      });

      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          assignedDepartment: department || complaint.assignedDepartment,
          authorityNotes: note || complaint.authorityNotes,
          proofPhotoUrl: proofPhotoUrl || complaint.proofPhotoUrl,
          timeline: newTimeline
        })
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Backend error response:', text);
        throw new Error(`Server error: ${response.status} ${response.statusText}\n${text}`);
      }
      const updated = await response.json();

      setComplaints(complaints.map((c) => c.id === complaintId ? updated : c));
      showToast(`Updated Complaint #${complaintId} status to "${status}"`);
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('Unable to update the complaint status.');
    }
  };

  // Filter complaints for feed view
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle2 size={18} color="#10b981" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Navbar 
        role={role}
        onToggleRole={handleToggleRole}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenApkGuide={() => setIsApkGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="content-area">
        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div>
            {/* Quick Hero Banner */}
            <div className="card" style={{ background: 'var(--accent-gradient)', color: 'white', padding: '16px', borderRadius: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Report Road Hazards</h2>
                  <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>
                    Capture photo, share GPS location & track repair progress live.
                  </p>
                </div>
                <button 
                  onClick={() => setIsReportModalOpen(true)}
                  style={{
                    background: 'white',
                    color: '#2563eb',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  + New Report
                </button>
              </div>
            </div>

            {/* Search & Category Filters */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search by area, road name, or complaint ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
              <button 
                onClick={() => setCategoryFilter('All')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  border: categoryFilter === 'All' ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                  background: categoryFilter === 'All' ? '#2563eb' : 'var(--bg-card)',
                  color: categoryFilter === 'All' ? 'white' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                All Issues
              </button>
              {ROAD_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '16px',
                    border: categoryFilter === cat ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                    background: categoryFilter === cat ? '#2563eb' : 'var(--bg-card)',
                    color: categoryFilter === cat ? 'white' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Complaints Feed List */}
            {filteredComplaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <AlertOctagon size={40} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <p>No road damage reports match your search criteria.</p>
              </div>
            ) : (
              filteredComplaints.map(comp => (
                <ComplaintCard 
                  key={comp.id} 
                  complaint={comp} 
                  onUpvote={handleUpvote}
                  onAddRating={handleAddRating}
                  isAuthorityMode={role === 'Authority'}
                  onOpenAuthorityModal={(c) => setSelectedComplaintForModal(c)}
                />
              ))
            )}
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <div>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Interactive Damage Map</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Showing all registered potholes & hazard spots</p>
              </div>
            </div>
            <MapView 
              complaints={complaints} 
              onSelectComplaint={(c) => {
                setActiveTab('feed');
                setSearchQuery(c.id);
              }}
            />
          </div>
        )}

        {/* AUTHORITY / ADMIN TAB */}
        {activeTab === 'admin' && (
          <AuthorityDashboard 
            complaints={complaints}
            onUpdateStatus={handleUpdateStatus}
            onUpvote={handleUpvote}
            selectedComplaintForModal={selectedComplaintForModal}
            onOpenModal={(c) => setSelectedComplaintForModal(c)}
            onCloseModal={() => setSelectedComplaintForModal(null)}
          />
        )}

        {/* MY ACTIVITY TAB */}
        {activeTab === 'my-reports' && (
          <div>
            <div className="card" style={{ background: 'var(--bg-card)', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>My Submitted Activity</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Track complaints filed from this device</p>
            </div>
            {complaints.map(comp => (
              <ComplaintCard 
                key={comp.id} 
                complaint={comp} 
                onUpvote={handleUpvote}
                onAddRating={handleAddRating}
                isAuthorityMode={role === 'Authority'}
                onOpenAuthorityModal={(c) => setSelectedComplaintForModal(c)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button className="fab-report" onClick={() => setIsReportModalOpen(true)} title="File New Complaint">
        <Plus size={28} />
      </button>

      {/* New Complaint Modal */}
      <NewComplaintModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitComplaint={handleAddComplaint}
      />

      {/* APK Export Guide Modal */}
      <ApkGuideModal 
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
      />

      {/* Bottom Nav Bar */}
      <BottomNav 
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenNewReport={() => setIsReportModalOpen(true)}
        role={role}
      />
    </div>
  );
}
