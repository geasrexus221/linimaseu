import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function AnnouncementModal({
  showAnnouncementModal,
  setShowAnnouncementModal,
  announcementInput,
  setAnnouncementInput,
  selectedTargetClassId,
  setSelectedTargetClassId,
  classroomKeys,
  classroomsState,
  setAnnouncements
}) {
  return (
    <div className="modal-overlay" onClick={() => setShowAnnouncementModal(false)}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="student-detail-modal"
        style={{ maxWidth: '550px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-section">
          <div className="student-modal-avatar" style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Bell size={48} color="#10B981" />
          </div>
          <h2>Kirim Pengumuman Kelas</h2>
          <p>Masukkan pengumuman kelas yang ingin Anda sampaikan.</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          if (!announcementInput.trim()) return;

          const targetClassName = selectedTargetClassId === 'ALL' ? 'Semua Kelas' : classroomsState[selectedTargetClassId]?.name || 'Kelas';
          const timestamp = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

          const newAnnouncement = {
            id: Date.now().toString(),
            classId: selectedTargetClassId,
            className: targetClassName,
            message: announcementInput.trim(),
            timestamp
          };

          setAnnouncements(prev => [newAnnouncement, ...prev]);
          setShowAnnouncementModal(false);
          setAnnouncementInput('');
          setSelectedTargetClassId('ALL');
        }} className="auth-form" style={{ marginTop: '20px' }}>
          
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label style={{ textAlign: 'left', display: 'block', marginBottom: '6px' }}>Pilih Kelas Tujuan</label>
            <select 
              value={selectedTargetClassId} 
              onChange={(e) => setSelectedTargetClassId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none' }}
            >
              <option value="ALL">Semua Kelas</option>
              {classroomKeys.map(key => (
                <option key={key} value={key}>{classroomsState[key].name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label style={{ textAlign: 'left', display: 'block' }}>Pesan Pengumuman</label>
            <textarea 
              placeholder="Contoh: Besok pagi kuis sejarah bab 3 akan dibuka. Persiapkan diri kalian!"
              value={announcementInput}
              onChange={(e) => setAnnouncementInput(e.target.value)}
              required
              rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
              autoFocus
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" className="close-detail-btn" style={{ flex: 1 }}>KIRIM SEKARANG</button>
            <button 
              type="button" 
              className="close-detail-btn" 
              style={{ flex: 1, background: '#EF4444', boxShadow: '0 4px 0 #DC2626' }}
              onClick={() => setShowAnnouncementModal(false)}
            >
              BATAL
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
