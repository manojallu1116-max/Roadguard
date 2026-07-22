import React, { useState } from 'react';
import { X, Camera, MapPin, AlertOctagon, Navigation, Upload, CheckCircle2 } from 'lucide-react';
import MapView from './MapView';
import { ROAD_CATEGORIES, SEVERITY_LEVELS } from '../data/mockComplaints';

export default function NewComplaintModal({ isOpen, onClose, onSubmitComplaint }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ROAD_CATEGORIES[0]);
  const [severity, setSeverity] = useState('High');
  const [isHazardous, setIsHazardous] = useState(false);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 });
  const [photoUrl, setPhotoUrl] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  if (!isOpen) return null;

  const handleLocationSelect = (latlng) => {
    setCoords(latlng);
    setAddress(`Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)} (Selected on Map)`);
  };

  const handleUseGPS = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(latlng);
          setAddress(`GPS Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`);
          setIsGettingLocation(false);
        },
        () => {
          setIsGettingLocation(false);
          alert("Could not fetch GPS. Please select on the map or type address.");
        }
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSamplePhoto = () => {
    // Provide realistic photo samples for instant testing
    const samplePhotos = [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80"
    ];
    const picked = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setPhotoPreview(picked);
    setPhotoUrl(picked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title for the complaint.");
      return;
    }
    if (!address.trim()) {
      alert("Please specify the location or select on map.");
      return;
    }

    const newComplaint = {
      id: `COMP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      category,
      severity,
      isHazardous,
      description: description.trim() || "No additional description provided.",
      location: {
        address: address.trim(),
        lat: coords.lat,
        lng: coords.lng
      },
      photoUrl: photoUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
      status: "Received",
      reportedBy: "Citizen User",
      createdAt: new Date().toISOString(),
      upvotes: 1,
      assignedDepartment: "Pending Department Assignment",
      timeline: [
        {
          status: "Received",
          timestamp: new Date().toISOString(),
          note: "Complaint submitted successfully by citizen."
        }
      ],
      authorityNotes: "New complaint queued for review."
    };

    onSubmitComplaint(newComplaint);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={22} color="#38bdf8" />
            Report Damaged Road
          </h3>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Complaint Title */}
          <div className="form-group">
            <label className="form-label">Issue Title / Short Summary *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Deep Pothole near School Gate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category & Severity Grid */}
          <div className="form-group form-grid">
            <div>
              <label className="form-label">Damage Type</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {ROAD_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Severity Level</label>
              <select className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                {SEVERITY_LEVELS.map(sev => (
                  <option key={sev} value={sev}>{sev}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Emergency Hazard Toggle */}
          <div 
            onClick={() => setIsHazardous(!isHazardous)}
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: isHazardous ? 'rgba(220, 38, 38, 0.15)' : 'var(--bg-primary)',
              border: `1px solid ${isHazardous ? '#dc2626' : 'var(--border-color)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertOctagon size={20} color={isHazardous ? '#ef4444' : '#94a3b8'} />
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block', color: isHazardous ? '#ef4444' : 'var(--text-main)' }}>
                  Tag as Emergency Hazard
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  High risk for accidents or vehicle damage
                </span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={isHazardous} 
              onChange={(e) => setIsHazardous(e.target.checked)} 
              style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
            />
          </div>

          {/* Photo Upload & Preview Section */}
          <div className="form-group">
            <label className="form-label">Upload Damage Photo *</label>
            <div className="upload-row" style={{ marginBottom: '10px' }}>
              <label className="btn-secondary" style={{ flex: 1, cursor: 'pointer' }}>
                <Camera size={16} /> Take Photo / Choose File
                <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
              <button type="button" className="btn-secondary" onClick={handleSamplePhoto} style={{ fontSize: '0.75rem' }}>
                Use Demo Photo
              </button>
            </div>

            {photoPreview && (
              <div className="photo-preview" style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img src={photoPreview} alt="Damage Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(16,185,129,0.9)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Photo Attached
                </span>
              </div>
            )}
          </div>

          {/* Location Section with Live GPS & Map Picker */}
          <div className="form-group">
            <div className="form-row" style={{ marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Location & Address *</label>
              <button 
                type="button" 
                onClick={handleUseGPS}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <Navigation size={13} className={isGettingLocation ? 'animate-spin' : ''} />
                {isGettingLocation ? 'Detecting GPS...' : 'Auto-Detect Live Location'}
              </button>
            </div>

            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Near HDFC Bank, Main Street, Ward 12"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ marginBottom: '8px' }}
              required
            />

            <MapView 
              isPickerMode={true} 
              onLocationSelect={handleLocationSelect} 
              initialPos={coords} 
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Notes / Landmark</label>
            <textarea 
              className="form-textarea" 
              rows="3" 
              placeholder="Provide any additional details to help field workers locate and repair this issue faster..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary">
            <Upload size={18} /> Submit Complaint to Authorities
          </button>
        </form>
      </div>
    </div>
  );
}
