import React, { useState } from 'react';
import { ThumbsUp, MapPin, Clock, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, Share2, Star, CheckCircle } from 'lucide-react';

export default function ComplaintCard({ complaint, onUpvote, onOpenAuthorityModal, isAuthorityMode, onAddRating }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userRating, setUserRating] = useState(complaint.citizenRating || 0);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Received': return 'status-received';
      case 'In Progress': return 'status-inprogress';
      case 'Completed': return 'status-completed';
      case 'Rejected': return 'status-rejected';
      default: return 'status-received';
    }
  };

  const getSeverityClass = (sev) => {
    switch (sev) {
      case 'Low': return 'severity-low';
      case 'Medium': return 'severity-medium';
      case 'High': return 'severity-high';
      case 'Critical': return 'severity-critical';
      default: return 'severity-medium';
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Road Damage Report: ${complaint.title}`,
        text: `Reported damaged road at ${complaint.location.address}. Status: ${complaint.status}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${complaint.title} - ${complaint.location.address}`);
      alert("Report details copied to clipboard!");
    }
  };

  return (
    <div className="card card-hover" style={{ position: 'relative' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {complaint.id}
          </span>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0', color: 'var(--text-main)' }}>
            {complaint.title}
          </h3>
        </div>
        <span className={`status-pill ${getStatusClass(complaint.status)}`}>
          {complaint.status}
        </span>
      </div>

      {/* Category & Hazard Tags */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
        <span className={`severity-pill ${getSeverityClass(complaint.severity)}`}>
          {complaint.severity} Severity
        </span>
        <span style={{ fontSize: '0.7rem', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
          {complaint.category}
        </span>
        {complaint.isHazardous && (
          <span style={{ fontSize: '0.7rem', background: 'rgba(220, 38, 38, 0.2)', color: '#ef4444', border: '1px solid rgba(220, 38, 38, 0.4)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <AlertTriangle size={10} /> Emergency Hazard
          </span>
        )}
      </div>

      {/* Location Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
        <MapPin size={14} color="#38bdf8" />
        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '320px' }}>
          {complaint.location.address}
        </span>
      </div>

      {/* Main Image View */}
      {complaint.photoUrl && (
        <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
          <img 
            src={complaint.photoUrl} 
            alt={complaint.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(15, 23, 42, 0.85)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {formatDate(complaint.createdAt)}
          </div>
        </div>
      )}

      {/* Brief Description */}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '12px', lineHeight: '1.4' }}>
        {complaint.description}
      </p>

      {/* Department Assignment Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid var(--border-color)' }}>
        <ShieldCheck size={14} color="#38bdf8" />
        <span>Dept: <strong>{complaint.assignedDepartment || "Pending Officer Review"}</strong></span>
      </div>

      {/* Upvotes, Share & Expand Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onUpvote(complaint.id)}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ThumbsUp size={13} color="#38bdf8" />
            <span>Upvote ({complaint.upvotes || 1})</span>
          </button>

          <button 
            onClick={handleShare}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              padding: '6px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            title="Share complaint"
          >
            <Share2 size={13} />
          </button>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
        >
          {isExpanded ? 'Hide Details' : 'View Timeline'}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Authority Quick Action Button */}
      {isAuthorityMode && (
        <div style={{ marginTop: '12px' }}>
          <button 
            onClick={() => onOpenAuthorityModal(complaint)}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)', fontSize: '0.85rem', padding: '10px' }}
          >
            Update Complaint Status & Notes
          </button>
        </div>
      )}

      {/* Expanded Timeline & Proof View */}
      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
            Repair Status Timeline
          </h4>

          <div className="timeline">
            {complaint.timeline && complaint.timeline.map((step, idx) => (
              <div key={idx} className={`timeline-item ${idx === complaint.timeline.length - 1 ? 'active' : 'completed'}`}>
                <div className="timeline-dot" />
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {step.status}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {formatDate(step.timestamp)}
                </div>
                {step.note && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '4px', background: 'var(--bg-primary)', padding: '6px 10px', borderRadius: '6px' }}>
                    {step.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Proof of Completion Image (if authority uploaded) */}
          {complaint.proofPhotoUrl && (
            <div style={{ marginTop: '14px', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
                <CheckCircle size={15} /> Official Completion Proof Photo
              </div>
              <img 
                src={complaint.proofPhotoUrl} 
                alt="Repair Proof" 
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} 
              />
            </div>
          )}

          {/* Citizen Rating & Feedback Section when Completed */}
          {complaint.status === 'Completed' && (
            <div style={{ marginTop: '14px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Citizen Feedback & Satisfaction Rating:
              </span>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    color={star <= (userRating || complaint.citizenRating || 0) ? "#f59e0b" : "#475569"} 
                    fill={star <= (userRating || complaint.citizenRating || 0) ? "#f59e0b" : "none"}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setUserRating(star);
                      onAddRating && onAddRating(complaint.id, star);
                    }}
                  />
                ))}
              </div>
              {complaint.citizenFeedback && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', italic: 'true' }}>
                  "{complaint.citizenFeedback}"
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
