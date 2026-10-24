import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Clock, AlertTriangle, Layers, Filter, FileText, Camera, Upload, X } from 'lucide-react';
import ComplaintCard from './ComplaintCard';
import { STATUS_TYPES } from '../data/mockComplaints';
import { usePreferences } from '../preferences/PreferencesContext';

export default function AuthorityDashboard({ 
  complaints, 
  onUpdateStatus, 
  onUpvote,
  selectedComplaintForModal,
  onCloseModal,
  onOpenModal
}) {
  const { t } = usePreferences();
  const isCompleted = (status) => status === 'Completed' || status === 'Resolved';
  const [filterStatus, setFilterStatus] = useState('All');
  const [newStatus, setNewStatus] = useState('');
  const [departmentNote, setDepartmentNote] = useState('');
  const [assignedDept, setAssignedDept] = useState('');
  const [proofPhoto, setProofPhoto] = useState('');

  useEffect(() => {
    if (!selectedComplaintForModal) return;
    setNewStatus(selectedComplaintForModal.status);
    setDepartmentNote(selectedComplaintForModal.authorityNotes || '');
    setAssignedDept(selectedComplaintForModal.assignedDepartment || '');
    setProofPhoto(selectedComplaintForModal.proofPhotoUrl || '');
  }, [selectedComplaintForModal]);

  // Analytics
  const total = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Received').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const completedCount = complaints.filter(c => isCompleted(c.status)).length;
  const criticalHazards = complaints.filter(c => c.isHazardous && !isCompleted(c.status)).length;

  const filteredComplaints = complaints.filter(c => {
    if (filterStatus === 'All') return true;
    return filterStatus === 'Completed' ? isCompleted(c.status) : c.status === filterStatus;
  });

  const handleOpenActionModal = (complaint) => {
    onOpenModal(complaint);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaintForModal) return;

    const didUpdate = await onUpdateStatus(selectedComplaintForModal.id, {
      status: newStatus,
      note: departmentNote,
      department: assignedDept,
      proofPhotoUrl: proofPhoto
    });
    if (didUpdate) onCloseModal();
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      {/* Authority Banner */}
      <div className="card admin-dashboard-banner" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #3b82f6' }}>
        <div className="authority-banner-heading" style={{ marginBottom: '8px' }}>
          <div style={{ background: '#3b82f6', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{t('Road Authority Management Portal')}</h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t('Complaint review and repair progress management')}</p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="analytics-grid" style={{ marginTop: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', display: 'block' }}>{total}</span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{t('Total')}</span>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.1)', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(245,158,11,0.2)' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', display: 'block' }}>{pendingCount}</span>
            <span style={{ fontSize: '0.65rem', color: '#fbbf24' }}>{t('Received')}</span>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.1)', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(59,130,246,0.2)' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa', display: 'block' }}>{inProgressCount}</span>
            <span style={{ fontSize: '0.65rem', color: '#60a5fa' }}>{t('Active')}</span>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', display: 'block' }}>{completedCount}</span>
            <span style={{ fontSize: '0.65rem', color: '#34d399' }}>{t('Fixed')}</span>
          </div>
        </div>

        {criticalHazards > 0 && (
          <div style={{ marginTop: '10px', background: 'rgba(220, 38, 38, 0.2)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(220, 38, 38, 0.4)', fontSize: '0.75rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} />
            <span><strong>{criticalHazards} {t('Emergency Safety Hazard(s)')}</strong> {t('require urgent field dispatch!')}</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="chip-row">
        {['All', 'Received', 'In Progress', 'On Hold', 'Completed', 'Rejected'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: filterStatus === st ? '1px solid #38bdf8' : '1px solid var(--border-color)',
              background: filterStatus === st ? '#2563eb' : 'var(--bg-card)',
              color: filterStatus === st ? 'white' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t(st)}
          </button>
        ))}
      </div>

      {/* Complaint List for Officers */}
      {filteredComplaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <FileText size={36} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <p>{t('No complaints found under status "{status}".', { status: t(filterStatus) })}</p>
        </div>
      ) : (
        filteredComplaints.map(comp => (
          <ComplaintCard
            key={comp.id}
            complaint={comp}
            onUpvote={onUpvote}
            isAuthorityMode={true}
            onOpenAuthorityModal={handleOpenActionModal}
          />
        ))
      )}

      {/* Authority Update Status Modal */}
      {selectedComplaintForModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
                <Shield size={20} />
                {t('Update Complaint #{id}', { id: selectedComplaintForModal.id })}
              </h3>
              <button onClick={onCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus}>
              {/* Select Status */}
              <div className="form-group">
                <label className="form-label">{t('Set New Status *')}</label>
                <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {STATUS_TYPES.map(st => (
                    <option key={st} value={st}>{t(st)}</option>
                  ))}
                </select>
              </div>

              {/* Assign Department */}
              <div className="form-group">
                <label className="form-label">{t('Assigned Department / Field Wing')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={assignedDept} 
                  onChange={(e) => setAssignedDept(e.target.value)}
                  placeholder={t('e.g. Road maintenance team')}
                />
              </div>

              {/* Official Note */}
              <div className="form-group">
                <label className="form-label">{t('Officer Progress / Resolution Note')}</label>
                <textarea 
                  className="form-textarea" 
                  rows="3" 
                  value={departmentNote} 
                  onChange={(e) => setDepartmentNote(e.target.value)}
                  placeholder={t('Provide updates for citizen tracking (e.g. Work crew dispatched with asphalt compaction roller)...')}
                />
              </div>

              {/* Proof Photo URL */}
              <div className="form-group">
                <label className="form-label">{t('Attach Completion / Inspection Proof Photo')}</label>
                <div className="upload-row" style={{ marginBottom: '8px' }}>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder={t('https://... (Image URL of completed repair)')}
                    value={proofPhoto}
                    onChange={(e) => setProofPhoto(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    onClick={() => setProofPhoto("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80")}
                  >
                    {t('Demo Proof')}
                  </button>
                </div>
                {proofPhoto && (
                  <img src={proofPhoto} alt={t('Proof')} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                )}
              </div>

              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}>
                <CheckCircle2 size={18} /> {t('Save & Broadcast Status Update')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
