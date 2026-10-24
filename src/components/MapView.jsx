import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, AlertTriangle, CheckCircle, Clock, MapPin, Eye } from 'lucide-react';
import { usePreferences } from '../preferences/PreferencesContext';

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon Generator function for colored status pins
const createCustomMarker = (status, isHazardous) => {
  let color = '#f59e0b'; // pending
  if (status === 'In Progress') color = '#3b82f6';
  if (status === 'Completed' || status === 'Resolved') color = '#10b981';
  if (status === 'Rejected') color = '#ef4444';
  if (isHazardous) color = '#dc2626';

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-map-pin',
    html: svgIcon,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
};

function LocationMarker({ onLocationSelect, selectedPos }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng);
      }
    },
  });

  return selectedPos ? (
    <Marker 
      position={selectedPos} 
      icon={L.divIcon({
        className: 'selected-pin',
        html: `<div style="background:#2563eb; width:24px; height:24px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(37,99,235,0.8);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })}
    />
  ) : null;
}

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15);
    }
  }, [center, map]);
  return null;
}

function getGeolocationErrorMessage(error) {
  if (error.code === 1) return 'Location permission was denied.';
  if (error.code === 2) return 'Your current location is unavailable.';
  if (error.code === 3) return 'The location request timed out.';
  return 'Unable to retrieve your current location.';
}

export default function MapView({ complaints, onSelectComplaint, isPickerMode, onLocationSelect, onLocationError, locationRequestId = 0, initialPos }) {
  const { t } = usePreferences();
  const [currentPos, setCurrentPos] = useState(initialPos || { lat: 12.9716, lng: 77.5946 });
  const [selectedPos, setSelectedPos] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const lastLocationRequestId = useRef(0);

  useEffect(() => {
    if (!initialPos) {
      if (isPickerMode) setSelectedPos(null);
      return;
    }
    setCurrentPos(initialPos);
    if (isPickerMode) setSelectedPos(initialPos);
  }, [initialPos, isPickerMode]);

  const handleGetLiveLocation = useCallback(() => {
    setIsLocating(true);
    if (!('geolocation' in navigator)) {
      setIsLocating(false);
      onLocationError?.('This browser does not support location detection.');
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPos(pos);
          if (isPickerMode && onLocationSelect) {
            setSelectedPos(pos);
            Promise.resolve()
              .then(() => onLocationSelect(pos, 'gps'))
              .catch((error) => {
                console.error('Failed to process selected GPS location:', error);
                onLocationError?.('Your coordinates were detected, but address lookup failed.');
              })
              .finally(() => setIsLocating(false));
          } else {
            setIsLocating(false);
          }
        },
        (error) => {
          console.warn("GPS geolocation failed or permission was denied.", error);
          setIsLocating(false);
          onLocationError?.(getGeolocationErrorMessage(error));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } catch (error) {
      console.error('Unable to start browser geolocation:', error);
      setIsLocating(false);
      onLocationError?.('Unable to start location detection.');
    }
  }, [isPickerMode, onLocationError, onLocationSelect]);

  useEffect(() => {
    if (!locationRequestId || lastLocationRequestId.current === locationRequestId) return;
    lastLocationRequestId.current = locationRequestId;
    handleGetLiveLocation();
  }, [handleGetLiveLocation, locationRequestId]);

  const handleMapClick = (latlng) => {
    if (isPickerMode && onLocationSelect) {
      setSelectedPos(latlng);
      onLocationSelect(latlng, 'map');
    }
  };

  return (
    <div className={`map-container-box ${isPickerMode ? 'picker-map' : ''}`} style={{ position: 'relative' }}>
      <MapContainer 
        center={[currentPos.lat, currentPos.lng]} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <ChangeView center={[currentPos.lat, currentPos.lng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Location Picker Mode */}
        {isPickerMode && (
          <LocationMarker onLocationSelect={handleMapClick} selectedPos={selectedPos} />
        )}

        {/* Render Complaint Pin Markers */}
        {!isPickerMode && complaints && complaints.filter(c => (
          Number.isFinite(c.location?.lat) &&
          Number.isFinite(c.location?.lng) &&
          c.location.lat >= -90 && c.location.lat <= 90 &&
          c.location.lng >= -180 && c.location.lng <= 180
        )).map((c) => (
          <Marker
            key={c.id}
            position={[c.location.lat, c.location.lng]}
            icon={createCustomMarker(c.status, c.isHazardous)}
          >
            <Popup>
              <div style={{ padding: '4px', maxWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span className={`status-pill status-${c.status.toLowerCase().replace(' ', '')}`}>
                    {t(c.status)}
                  </span>
                  {c.isHazardous && (
                    <span style={{ background: '#ef4444', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {t('HAZARD')}
                    </span>
                  )}
                </div>
                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>{c.title}</strong>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0' }}>{c.location.address}</p>
                <button
                  onClick={() => onSelectComplaint && onSelectComplaint(c)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={12} /> {t('View Details')}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating GPS Button */}
      <button
        onClick={handleGetLiveLocation}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#38bdf8',
          border: '1px solid #334155',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        title={t('Get Live GPS Location')}
        aria-label={t('Get Live GPS Location')}
      >
        <Navigation size={18} className={isLocating ? 'animate-spin' : ''} />
      </button>

      {isPickerMode && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          right: '8px',
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#f8fafc',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          textAlign: 'center',
          border: '1px solid #334155'
        }}>
          {t('Tap anywhere on the map or use GPS to set damage location')}
        </div>
      )}
    </div>
  );
}
