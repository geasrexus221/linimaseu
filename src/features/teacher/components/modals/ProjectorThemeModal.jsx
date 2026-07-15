import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, X, Layout, School } from 'lucide-react';

export default function ProjectorThemeModal({ collection, onClose, onStart }) {
  const [selectedTheme, setSelectedTheme] = useState('MODERN');

  if (!collection) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <motion.div 
        className="modal-content"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{ maxWidth: '500px', background: 'var(--bg-color, white)', padding: '24px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
      >
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Mode Proyektor</h2>
          <button className="close-btn" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
            Anda akan memulai sesi interaktif untuk kuis <strong>{collection.title}</strong>. Silakan pilih tema visual untuk ditampilkan di proyektor:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div 
              onClick={() => setSelectedTheme('MODERN')}
              style={{
                border: selectedTheme === 'MODERN' ? '2px solid #3B82F6' : '2px solid var(--border-color)',
                borderRadius: '16px', padding: '16px', cursor: 'pointer',
                background: selectedTheme === 'MODERN' ? '#EFF6FF' : 'var(--card-bg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layout size={24} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-color)' }}>Modern Blue</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bersih & futuristik</p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedTheme('KELAS')}
              style={{
                border: selectedTheme === 'KELAS' ? '2px solid #8B4513' : '2px solid var(--border-color)',
                borderRadius: '16px', padding: '16px', cursor: 'pointer',
                background: selectedTheme === 'KELAS' ? '#FFFBEB' : 'var(--card-bg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#8B4513', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <School size={24} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-color)' }}>Ruang Kelas</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Papan & alat tulis</p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedTheme('LAUT')}
              style={{
                border: selectedTheme === 'LAUT' ? '2px solid #0EA5E9' : '2px solid var(--border-color)',
                borderRadius: '16px', padding: '16px', cursor: 'pointer',
                background: selectedTheme === 'LAUT' ? '#F0F9FF' : 'var(--card-bg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5Z"/><path d="M12 12c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5Z"/><path d="M22 12c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5Z"/></svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-color)' }}>Bawah Air</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gelembung & biota laut</p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedTheme('ANGKASA')}
              style={{
                border: selectedTheme === 'ANGKASA' ? '2px solid #8B5CF6' : '2px solid var(--border-color)',
                borderRadius: '16px', padding: '16px', cursor: 'pointer',
                background: selectedTheme === 'ANGKASA' ? '#F5F3FF' : 'var(--card-bg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #6D28D9, #4C1D95)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-color)' }}>Luar Angkasa</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bintang & roket</p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedTheme('HUTAN')}
              style={{
                border: selectedTheme === 'HUTAN' ? '2px solid #10B981' : '2px solid var(--border-color)',
                borderRadius: '16px', padding: '16px', cursor: 'pointer',
                background: selectedTheme === 'HUTAN' ? '#ECFDF5' : 'var(--card-bg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #047857)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v12"/><path d="M12 22c4.2 0 7-3.66 7-7 0-4.2-4.6-7.23-7-10-2.4 2.77-7 5.8-7 10 0 3.34 2.8 7 7 7Z"/></svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-color)' }}>Hutan Alam</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daun & pepohonan</p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedTheme('GURUN')}
              style={{
                border: selectedTheme === 'GURUN' ? '2px solid #F59E0B' : '2px solid var(--border-color)',
                borderRadius: '16px', padding: '16px', cursor: 'pointer',
                background: selectedTheme === 'GURUN' ? '#FFFBEB' : 'var(--card-bg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #B45309)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h8"/><path d="M12 2v20"/><path d="M12 2a5 5 0 0 0-5 5v5"/><path d="M12 2a5 5 0 0 1 5 5v5"/></svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-color)' }}>Gurun Pasir</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kaktus & bukit pasir</p>
              </div>
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            onClick={() => onStart(selectedTheme)}
          >
            <MonitorPlay size={20} /> Mulai Presentasi
          </button>
        </div>
      </motion.div>
    </div>
  );
}
