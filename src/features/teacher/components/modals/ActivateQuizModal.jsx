import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function ActivateQuizModal({
  isOpen,
  onClose,
  onConfirm,
  quizTitle
}) {
  const [selectedDuration, setSelectedDuration] = useState(60); // Default 60 minutes
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(30);

  if (!isOpen) return null;

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    const duration = isCustom ? parseInt(customValue, 10) : selectedDuration;
    onConfirm(duration);
  };

  const presetDurations = [
    { label: '30 Menit', value: 30 },
    { label: '1 Jam', value: 60 },
    { label: '2 Jam', value: 120 },
    { label: '12 Jam', value: 720 },
    { label: '24 Jam', value: 1440 }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="student-detail-modal"
        style={{ maxWidth: '500px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-section">
          <div className="student-modal-avatar" style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Clock size={48} color="#f4c265" />
          </div>
          <h2>Aktifkan Kuis</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Mengaktifkan kuis <strong>{quizTitle}</strong> agar dapat diakses oleh murid.
          </p>
        </div>

        <form onSubmit={handleConfirmSubmit} className="auth-form" style={{ marginTop: '20px' }}>
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label style={{ textAlign: 'left', display: 'block', marginBottom: '8px', fontWeight: '800' }}>
              Pilih Durasi Aktif
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
              {presetDurations.map((preset) => {
                const isActive = !isCustom && selectedDuration === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedDuration(preset.value);
                    }}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '12px',
                      border: isActive ? '2px solid #f4c265' : '2px solid var(--border-color)',
                      background: isActive ? '#f4c26522' : 'var(--card-bg)',
                      color: isActive ? '#f4c265' : 'var(--text-color)',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                style={{
                  padding: '10px 6px',
                  borderRadius: '12px',
                  border: isCustom ? '2px solid #f4c265' : '2px solid var(--border-color)',
                  background: isCustom ? '#f4c26522' : 'var(--card-bg)',
                  color: isCustom ? '#f4c265' : 'var(--text-color)',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                Kustom
              </button>
            </div>

            {isCustom && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input
                  type="number"
                  min="5"
                  max="10080"
                  value={customValue}
                  onChange={(e) => setCustomValue(parseInt(e.target.value, 10) || '')}
                  required
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    fontSize: '0.95rem',
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Menit</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="submit"
              className="close-detail-btn"
              style={{ flex: 1, background: '#f4c265', boxShadow: '0 4px 0 #d1a34b' }}
            >
              AKTIFKAN KUMPULAN SOAL
            </button>
            <button
              type="button"
              className="close-detail-btn"
              style={{ flex: 1, background: '#EF4444', boxShadow: '0 4px 0 #DC2626' }}
              onClick={onClose}
            >
              BATAL
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
