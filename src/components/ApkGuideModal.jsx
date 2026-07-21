import React from 'react';
import { Download, Smartphone, CheckCircle, ExternalLink, Code2, Sparkles, X } from 'lucide-react';

export default function ApkGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
            <Smartphone size={22} />
            Build Native Android APK (.apk)
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>
              ⚡ Ready for Instant Android APK Export
            </strong>
            This app is pre-configured with a Web App Manifest and PWA meta tags so you can easily package it into a ready-to-install `.apk` for mobile devices.
          </div>

          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '6px' }}>
            Option A: No-Code APK Build via PWABuilder (Easiest)
          </h4>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-muted)' }}>
            <li>Run <code style={{ background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>npm run build</code> to produce production files.</li>
            <li>Deploy the app to any static hosting (Vercel, Netlify, or Cloudflare Pages).</li>
            <li>Visit <strong>PWABuilder.com</strong>, paste your app URL, and click <strong>"Build Android APK Package"</strong>.</li>
            <li>Download the generated <code style={{ color: '#10b981' }}>.apk</code> file directly onto your Android phone!</li>
          </ol>

          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '6px' }}>
            Option B: Native Android Studio Build via Capacitor
          </h4>
          <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.75rem', color: '#38bdf8' }}>
            # 1. Install Capacitor<br/>
            npm install @capacitor/core @capacitor/cli @capacitor/android<br/>
            <br/>
            # 2. Initialize Capacitor Project<br/>
            npx cap init RoadGuard com.roadguard.app<br/>
            <br/>
            # 3. Add Android Platform & Open in Android Studio<br/>
            npx cap add android<br/>
            npx cap open android
          </div>

          <div style={{ marginTop: '10px' }}>
            <button onClick={onClose} className="btn-primary">
              <CheckCircle size={18} /> Got It! Return to App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
