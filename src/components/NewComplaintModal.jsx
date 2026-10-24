import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, Camera, Images, MapPin, AlertOctagon, Navigation, Upload, CheckCircle2 } from 'lucide-react';
import MapView from './MapView';
import { ROAD_CATEGORIES, SEVERITY_LEVELS } from '../data/mockComplaints';
import { reverseGeocode } from '../utils/reverseGeocode';
import { usePreferences } from '../preferences/PreferencesContext';

export default function NewComplaintModal({ isOpen, onClose, onSubmitComplaint }) {
  const { t } = usePreferences();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ROAD_CATEGORIES[0]);
  const [severity, setSeverity] = useState('Medium');
  const [isHazardous, setIsHazardous] = useState(false);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationRequestId, setLocationRequestId] = useState(0);
  const [locationMessage, setLocationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const photoPreviewRef = useRef(null);
  const lookupSequence = useRef(0);
  const lookupController = useRef(null);
  const lookupTimer = useRef(null);

  useEffect(() => () => {
    lookupSequence.current += 1;
    lookupController.current?.abort();
    clearTimeout(lookupTimer.current);
  }, []);

  useEffect(() => {
    if (isOpen) return;
    lookupSequence.current += 1;
    lookupController.current?.abort();
    clearTimeout(lookupTimer.current);
    setIsGettingLocation(false);
  }, [isOpen]);

  const handleLocationSelect = useCallback((latlng) => {
    const sequence = ++lookupSequence.current;
    lookupController.current?.abort();
    clearTimeout(lookupTimer.current);
    const controller = new AbortController();
    lookupController.current = controller;
    setCoords(latlng);
    setAddress('');
    setLocationMessage(t('Looking up a nearby address…'));
    setIsGettingLocation(true);

    lookupTimer.current = setTimeout(async () => {
      try {
        const resolvedAddress = await reverseGeocode(latlng, { signal: controller.signal });
        if (sequence !== lookupSequence.current) return;
        if (resolvedAddress) {
          setAddress(resolvedAddress);
          setLocationMessage(t('Address detected. You can edit it if needed.'));
        } else {
          setLocationMessage(t('No address was found. Enter a street or landmark manually.'));
        }
      } catch (error) {
        if (sequence !== lookupSequence.current || error.name === 'AbortError') return;
        console.warn('Reverse geocoding failed:', error);
        setLocationMessage(t('Could not find an address. Enter a street or landmark manually.'));
      } finally {
        if (sequence === lookupSequence.current) setIsGettingLocation(false);
      }
    }, 1100);
  }, [t]);

  const handleLocationError = useCallback((message) => {
    setIsGettingLocation(false);
    setLocationMessage(`${t(message)} ${t('Select a point on the map or enter a street or landmark manually.')}`);
  }, [t]);

  const handleUseGPS = () => {
    if (isGettingLocation) return;
    setIsGettingLocation(true);
    setLocationMessage(t('Getting your current GPS location…'));
    setLocationRequestId(requestId => requestId + 1);
  };

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError(t('Please choose a valid image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setPhotoError(t('The selected photo could not be loaded. Please try another image.'));
        return;
      }
      photoPreviewRef.current = reader.result;
      setPhotoPreview(reader.result);
      setPhotoUrl(reader.result);
      setPhotoError('');
    };
    reader.onerror = () => {
      setPhotoError(t('The selected photo could not be loaded. Please try another image.'));
    };
    reader.readAsDataURL(file);
  };

  const handleSamplePhoto = () => {
    // Provide realistic photo samples for instant testing
    const samplePhotos = [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80"
    ];
    const picked = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    photoPreviewRef.current = picked;
    setPhotoPreview(picked);
    setPhotoUrl(picked);
    setPhotoError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!title.trim()) {
      alert(t('Please enter a title for the complaint.'));
      return;
    }
    if (!address.trim()) {
      alert(t('Please specify the location or select on map.'));
      return;
    }
    if (!coords) {
      alert(t('Please use GPS or select the damage location on the map.'));
      return;
    }
    if (!photoUrl) {
      alert(t('Please upload a damage photo or choose the demo photo.'));
      return;
    }

    const newComplaint = {
      title: title.trim(),
      category,
      severity,
      isHazardous,
      description: description.trim(),
      location: {
        address: address.trim(),
        lat: coords.lat,
        lng: coords.lng
      },
      photoUrl
    };

    setIsSubmitting(true);
    try {
      if (await onSubmitComplaint(newComplaint)) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={22} color="#38bdf8" />
            {t('Report Damaged Road')}
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
            <label className="form-label">{t('Issue Title / Short Summary *')}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder={t('e.g. Deep Pothole near School Gate')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category & Severity Grid */}
          <div className="form-group form-grid">
            <div>
              <label className="form-label">{t('Damage Type')}</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {ROAD_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{t(cat)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">{t('Severity Level')}</label>
              <select className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                {SEVERITY_LEVELS.map(sev => (
                  <option key={sev} value={sev}>{t(sev)}</option>
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
                  {t('Tag as Emergency Hazard')}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {t('High risk for accidents or vehicle damage')}
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
            <label className="form-label">{t('Upload Damage Photo *')}</label>
            <div className="photo-upload-actions">
              <label className="btn-secondary photo-upload-button">
                <Camera size={17} /> {t('Take Photo')}
                <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} />
              </label>
              <label className="btn-secondary photo-upload-button">
                <Images size={17} /> {t('Choose File')}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
              <button type="button" className="btn-secondary photo-demo-button" onClick={handleSamplePhoto}>
                {t('Use Demo Photo')}
              </button>
            </div>

            {photoError && <p className="auth-error" role="alert">{photoError}</p>}
            {photoPreview && photoUrl && (
              <div className="photo-preview" style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img
                  src={photoPreview}
                  alt={t('Damage Preview')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => {
                    if (photoPreviewRef.current !== photoPreview) return;
                    photoPreviewRef.current = null;
                    setPhotoPreview(null);
                    setPhotoUrl('');
                    setPhotoError(t('The selected photo could not be displayed. Please choose another image.'));
                  }}
                />
                <span style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(16,185,129,0.9)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> {t('Photo Attached')}
                </span>
              </div>
            )}
          </div>

          {/* Location Section with Live GPS & Map Picker */}
          <div className="form-group">
            <div className="form-row" style={{ marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>{t('Location & Address *')}</label>
              <button
                type="button" 
                onClick={handleUseGPS}
                disabled={isGettingLocation}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <Navigation size={13} className={isGettingLocation ? 'animate-spin' : ''} />
                {isGettingLocation ? t('Detecting GPS...') : t('Auto-Detect Live Location')}
              </button>
            </div>

            <input 
              type="text" 
              className="form-input" 
              placeholder={t('e.g. Near HDFC Bank, Main Street, Ward 12')}
              value={address}
              onChange={(e) => {
                lookupSequence.current += 1;
                lookupController.current?.abort();
                clearTimeout(lookupTimer.current);
                setAddress(e.target.value);
                setIsGettingLocation(false);
                setLocationMessage(e.target.value ? t('Address entered manually.') : t('Enter a street or landmark for this location.'));
              }}
              style={{ marginBottom: '8px' }}
              required
            />
            {locationMessage && (
              <p role="status" style={{ margin: '0 0 8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {locationMessage}
              </p>
            )}
            {coords && (
              <p style={{ margin: '0 0 8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {t('Map pin selected: {lat}, {lng}. Add a street or landmark above.', { lat: coords.lat.toFixed(5), lng: coords.lng.toFixed(5) })}
              </p>
            )}

            <MapView 
              isPickerMode={true} 
              onLocationSelect={handleLocationSelect} 
              onLocationError={handleLocationError}
              locationRequestId={locationRequestId}
              initialPos={coords} 
            />
            <p style={{ margin: '-8px 0 12px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
              {t('Address lookup:')} <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>© OpenStreetMap contributors</a>
            </p>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">{t('Detailed Notes / Landmark')}</label>
            <textarea 
              className="form-textarea" 
              rows="3" 
              placeholder={t('Provide any additional details to help field workers locate and repair this issue faster...')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            <Upload size={18} /> {isSubmitting ? t('Submitting Report…') : t('Submit Complaint to Authorities')}
          </button>
        </form>
      </div>
    </div>
  );
}
