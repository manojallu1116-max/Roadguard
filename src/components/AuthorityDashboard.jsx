import React, { useState } from 'react';
import { Shield, CheckCircle2, Clock, AlertTriangle, Layers, Filter, FileText, Camera, Upload, X } from 'lucide-react';
import ComplaintCard from './ComplaintCard';
import { STATUS_TYPES } from '../data/mockComplaints';

export default function AuthorityDashboard({ 
  complaints, 
  onUpdateStatus, 
  onUpvote,
  selectedComplaintForModal,
  onCloseModal,
  onOpenModal
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [newStatus, setNewStatus] = useState('');
  const [departmentNote, setDepartmentNote] = useState('');
  const [assignedDept, setAssignedDept] = useState('');
  const [proofPhoto, setProofPhoto] = useState('');

  // Analytics
  const total = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Received').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const completedCount = complaints.filter(c => c.status === 'Completed').length;
  const criticalHazards = complaints.filter(c => c.isHazardous && c.status !== 'Completed').length;

  const filteredComplaints = complaints.filter(c => {
    if (filterStatus === 'All') return true;
    return c.status === filterStatus;
  });

  const handleOpenActionModal = (complaint) => {
    onOpenModal(complaint);
    setNewStatus(complaint.status);
    setDepartmentNote(complaint.authorityNotes || '');
    setAssignedDept(complaint.assignedDepartment || 'PWD Road Repair Wing');
    setProofPhoto(complaint.proofPhotoUrl || '');
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!selectedComplaintForModal) return;

    onUpdateStatus(selectedComplaintForModal.id, {
      status: newStatus,
      note: departmentNote,
      department: assignedDept,
      proofPhotoUrl: proofPhoto
    });
    onCloseModal();
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      {/* Authority Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #3b82f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ background: '#3b82f6', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', color: '#f8fafc' }}>Road Authority Management Portal</h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Municipal Corporation & PWD Command Center</p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', display: 'block' }}>{total}</span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Total</span>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.1)', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(245,158,11,0.2)' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', display: 'block' }}>{pendingCount}</span>
            <span style={{ fontSize: '0.65rem', color: '#fbbf24' }}>Received</span>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.1)', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(59,130,246,0.2)' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa', display: 'block' }}>{inProgressCount}</span>
            <span style={{ fontSize: '0.65rem', color: '#60a5fa' }}>Active</span>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', display: 'block' }}>{completedCount}</span>
            <span style={{ fontSize: '0.65rem', color: '#34d399' }}>Fixed</span>
          </div>
        </div>

        {criticalHazards > 0 && (
          <div style={{ marginTop: '10px', background: 'rgba(220, 38, 38, 0.2)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(220, 38, 38, 0.4)', fontSize: '0.75rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} />
            <span><strong>{criticalHazards} Emergency Safety Hazard(s)</strong> require urgent field dispatch!</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
        {['All', 'Received', 'In Progress', 'Completed'].map(st => (
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
            {st}
          </button>
        ))}
      </div>

      {/* Complaint List for Officers */}
      {filteredComplaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <FileText size={36} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <p>No complaints found under status "{filterStatus}".</p>
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
                Update Complaint #{selectedComplaintForModal.id}
              </h3>
              <button onClick={onCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus}>
              {/* Select Status */}
              <div className="form-group">
                <label className="form-label">Set New Status *</label>
                <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {STATUS_TYPES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Assign Department */}
              <div className="form-group">
                <label className="form-label">Assigned Department / Field Wing</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={assignedDept} 
                  onChange={(e) => setAssignedDept(e.target.value)}
                  placeholder="e.g. PWD Asphalt Patching Unit 3"
                />
              </div>

              {/* Official Note */}
              <div className="form-group">
                <label className="form-label">Officer Progress / Resolution Note</label>
                <textarea 
                  className="form-textarea" 
                  rows="3" 
                  value={departmentNote} 
                  onChange={(e) => setDepartmentNote(e.target.value)}
                  placeholder="Provide updates for citizen tracking (e.g. Work crew dispatched with asphalt compaction roller)..."
                />
              </div>

              {/* Proof Photo URL */}
              <div className="form-group">
                <label className="form-label">Attach Completion / Inspection Proof Photo</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://... (Image URL of completed repair)" 
                    value={proofPhoto}
                    onChange={(e) => setProofPhoto(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    onClick={() => setProofPhoto("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80")}
                  >
                    Demo Proof
                  </button>
                </div>
                {proofPhoto && (
                  <img src={proofPhoto} alt="Proof" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                )}
              </div>

              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}>
                <CheckCircle2 size={18} /> Save & Broadcast Status Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
