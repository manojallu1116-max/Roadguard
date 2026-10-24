import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ComplaintCard from './components/ComplaintCard';
import MapView from './components/MapView';
import NewComplaintModal from './components/NewComplaintModal';
import AuthorityDashboard from './components/AuthorityDashboard';
import { ROAD_CATEGORIES } from './data/mockComplaints';
import { Search, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { apiUrl, parseApiResponse } from './api';
import { usePreferences } from './preferences/PreferencesContext';

async function getApiError(response, fallback) {
  try {
    const payload = await parseApiResponse(response);
    const details = Array.isArray(payload.details)
      ? payload.details.map(item => item.message).filter(Boolean).join(' ')
      : '';
    if (details) return `${payload.error || fallback}: ${details}`;
    return payload.error || payload.message || fallback;
  } catch (error) {
    return error.message || fallback;
  }
}

export default function App() {
  const { user, logout } = useAuth();
  const { t } = usePreferences();
  const [complaints, setComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const isAuthority = (user?.role === 'admin' || user?.role === 'authority') && user.isApproved;
  const [activeTab, setActiveTab] = useState(isAuthority ? 'admin' : 'feed'); // 'feed', 'map', 'admin', 'my-reports'
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedComplaintForModal, setSelectedComplaintForModal] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);
  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('roadguard.jwt')}` });

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const endpoints = isAuthority
          ? ['/api/complaints']
          : ['/api/complaints/community', '/api/complaints/mine'];
        const responses = await Promise.all(endpoints.map(endpoint => fetch(apiUrl(endpoint), { headers: authHeaders() })));
        const failedResponse = responses.find(response => !response.ok);
        if (failedResponse) throw new Error(await getApiError(failedResponse, t('Unable to load reports ({status})', { status: failedResponse.status })));
        const data = await Promise.all(responses.map(parseApiResponse));
        setComplaints(data[0]);
        setMyComplaints(isAuthority ? [] : data[1].map(complaint => ({ ...complaint, isMine: true })));
      } catch (error) {
        console.error('Failed to load complaints', error);
      }
    };

    loadComplaints();
  }, [isAuthority]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddComplaint = async (newComplaint) => {
    try {
      const response = await fetch(apiUrl('/api/complaints'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(newComplaint)
      });
      if (!response.ok) {
        throw new Error(await getApiError(response, t('Unable to submit report ({status})', { status: response.status })));
      }
      const createdComplaint = await parseApiResponse(response);
      setComplaints(current => [{ ...createdComplaint, isMine: true }, ...current]);
      setMyComplaints(current => [{ ...createdComplaint, isMine: true }, ...current]);
      setActiveTab('my-reports');
      showToast(t('Complaint #{id} submitted successfully!', { id: createdComplaint.id }));
      return true;
    } catch (error) {
      console.error('Failed to create complaint:', error);
      showToast(t(error.message || 'Unable to save your report right now.'));
      return false;
    }
  };

  const handleUpvote = async (complaintId) => {
    try {
      const complaint = complaints.find((c) => c.id === complaintId);
      if (!complaint) return;
      const response = await fetch(apiUrl(`/api/complaints/${complaintId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ upvotes: (complaint.upvotes || 0) + 1 })
      });
      if (!response.ok) {
        throw new Error(await getApiError(response, t('Unable to upvote ({status})', { status: response.status })));
      }
      const updated = await parseApiResponse(response);
      setComplaints(current => current.map(c => c.id === complaintId ? { ...c, ...updated } : c));
      setMyComplaints(current => current.map(c => c.id === complaintId ? { ...c, ...updated } : c));
      showToast(t('Upvoted! Thank you for prioritizing this issue.'));
    } catch (error) {
      console.error('Failed to upvote:', error);
      showToast(t(error.message || 'Unable to upvote this report.'));
    }
  };

  const handleAddRating = async (complaintId, rating) => {
    try {
      const response = await fetch(apiUrl(`/api/complaints/${complaintId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ citizenRating: rating })
      });
      if (!response.ok) {
        throw new Error(await getApiError(response, t('Unable to save rating ({status})', { status: response.status })));
      }
      const updated = await parseApiResponse(response);
      setComplaints(current => current.map(c => c.id === complaintId ? { ...c, ...updated } : c));
      setMyComplaints(current => current.map(c => c.id === complaintId ? { ...c, ...updated } : c));
      showToast(t('Rating recorded: {rating} Star(s)!', { rating }));
    } catch (error) {
      console.error('Failed to save rating:', error);
      showToast(t(error.message || 'Unable to save rating.'));
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

      const response = await fetch(apiUrl(`/api/complaints/${complaintId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          status,
          assignedDepartment: department || complaint.assignedDepartment,
          authorityNotes: note || complaint.authorityNotes,
          proofPhotoUrl: proofPhotoUrl || complaint.proofPhotoUrl,
          timeline: newTimeline
        })
      });
      if (!response.ok) {
        throw new Error(await getApiError(response, t('Unable to update complaint ({status})', { status: response.status })));
      }
      const updated = await parseApiResponse(response);

      setComplaints(current => current.map(c => c.id === complaintId ? { ...c, ...updated } : c));
      setMyComplaints(current => current.map(c => c.id === complaintId ? { ...c, ...updated } : c));
      showToast(t('Updated Complaint #{id} status to "{status}"', { id: complaintId, status: t(status) }));
      return true;
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast(t(error.message || 'Unable to update the complaint status.'));
      return false;
    }
  };

  // Filter complaints for feed view
  const filteredComplaints = complaints.filter(c => {
    if (c.isMine) return false;
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
        user={user}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <main className="content-area">
        {/* FEED TAB */}
        {!isAuthority && activeTab === 'feed' && (
          <div>
            {/* Quick Hero Banner */}
            <div className="card hero-card">
              <div className="hero-content">
                <div className="hero-copy">
                  <h2 className="hero-title">{t('Community Road Reports')}</h2>
                  <p className="hero-text">
                        {t('Browse road issues reported by other members of your community.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Search & Category Filters */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={t('Search by area, road name, or complaint ID...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <div className="chip-row">
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
                {t('All Issues')}
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
                  {t(cat)}
                </button>
              ))}
            </div>

            {/* Complaints Feed List */}
            {filteredComplaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <AlertOctagon size={40} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <p>{t('No road damage reports match your search criteria.')}</p>
              </div>
            ) : (
              filteredComplaints.map(comp => (
                <ComplaintCard 
                  key={comp.id} 
                  complaint={comp} 
                  onUpvote={handleUpvote}
                  onAddRating={handleAddRating}
                  isAuthorityMode={isAuthority}
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
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('Interactive Damage Map')}</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('Showing all registered potholes & hazard spots')}</p>
              </div>
            </div>
            <MapView 
              complaints={complaints} 
              onSelectComplaint={(c) => {
                if (isAuthority) {
                  setSelectedComplaintForModal(c);
                  setActiveTab('admin');
                } else if (c.isMine) {
                  setActiveTab('my-reports');
                } else {
                  setActiveTab('feed');
                  setSearchQuery(c.id);
                }
              }}
            />
          </div>
        )}

        {/* AUTHORITY / ADMIN TAB */}
        {activeTab === 'admin' && isAuthority && (
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
        {!isAuthority && activeTab === 'my-reports' && (
          <div>
            <div className="card" style={{ background: 'var(--bg-card)', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{t('My Submitted Activity')}</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('Your submitted reports and their latest repair status')}</p>
            </div>
            {myComplaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <AlertOctagon size={36} style={{ opacity: 0.5, marginBottom: '8px' }} />
                <p>{t('You have not submitted any reports yet.')}</p>
              </div>
            ) : myComplaints.map(comp => (
              <ComplaintCard 
                key={comp.id} 
                complaint={comp} 
                onUpvote={handleUpvote}
                onAddRating={handleAddRating}
                isAuthorityMode={isAuthority}
                onOpenAuthorityModal={(c) => setSelectedComplaintForModal(c)}
              />
            ))}
          </div>
        )}
      </main>

      {/* New Complaint Modal */}
      <NewComplaintModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitComplaint={handleAddComplaint}
      />

      {/* Bottom Nav Bar */}
      <BottomNav 
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenNewReport={() => setIsReportModalOpen(true)}
        role={isAuthority ? 'admin' : 'citizen'}
      />
    </div>
  );
}
