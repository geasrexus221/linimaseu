import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function QuizCollectionModal({
  showAddCollectionModal,
  setShowAddCollectionModal,
  newCollectionTitle,
  setNewCollectionTitle,
  newCollectionTargetClassId,
  setNewCollectionTargetClassId,
  newCollectionDurationLimit,
  setNewCollectionDurationLimit,
  newCollectionDescription,
  setNewCollectionDescription,
  newCollectionXpReward,
  setNewCollectionXpReward,
  classroomKeys,
  classroomsState,
  setQuizCollections
}) {
  return (
    <AnimatePresence>
      {showAddCollectionModal && (
        <div className="modal-overlay" onClick={() => setShowAddCollectionModal(false)}>
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
                <BookOpen size={48} color="#f4c265" />
              </div>
              <h2>Tambah Kumpulan Soal</h2>
              <p>Masukkan judul dan detail kuis baru Anda.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newCollectionTitle.trim()) return;

              const targetClassName = newCollectionTargetClassId === 'ALL' ? 'Semua Kelas' : classroomsState[newCollectionTargetClassId]?.name || 'Kelas';

              const newCol = {
                id: `col-${Date.now()}`,
                title: newCollectionTitle.trim(),
                targetClassId: newCollectionTargetClassId,
                targetClassName,
                durationLimit: newCollectionDurationLimit,
                description: newCollectionDescription.trim(),
                xpReward: newCollectionXpReward,
                questions: []
              };

              setQuizCollections(prev => [...prev, newCol]);
              setShowAddCollectionModal(false);
              setNewCollectionTitle('');
              setNewCollectionDescription('');
              setNewCollectionDurationLimit(30);
              setNewCollectionXpReward(200);
            }} className="auth-form" style={{ marginTop: '20px' }}>
              
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ textAlign: 'left', display: 'block', marginBottom: '6px' }}>Judul Kumpulan Soal</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Kuis Pahlawan Nasional"
                  value={newCollectionTitle}
                  onChange={(e) => setNewCollectionTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ textAlign: 'left', display: 'block', marginBottom: '6px' }}>Deskripsi Singkat</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Kuis untuk bab 4 tentang perjuangan bangsa"
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ textAlign: 'left', display: 'block', marginBottom: '6px' }}>Pilih Kelas Target</label>
                <select 
                  value={newCollectionTargetClassId} 
                  onChange={(e) => setNewCollectionTargetClassId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none' }}
                >
                  <option value="ALL">Semua Kelas</option>
                  {classroomKeys.map(key => (
                    <option key={key} value={key}>{classroomsState[key].name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="input-group">
                  <label style={{ textAlign: 'left', display: 'block', marginBottom: '6px' }}>Durasi / Soal (Detik)</label>
                  <input 
                    type="number" 
                    value={newCollectionDurationLimit}
                    onChange={(e) => setNewCollectionDurationLimit(parseInt(e.target.value, 10) || 30)}
                    required
                    min={5}
                  />
                </div>
                <div className="input-group">
                  <label style={{ textAlign: 'left', display: 'block', marginBottom: '6px' }}>Reward ⭐ Bintang Selesai Kuis</label>
                  <input 
                    type="number" 
                    value={newCollectionXpReward}
                    onChange={(e) => setNewCollectionXpReward(parseInt(e.target.value, 10) || 200)}
                    required
                    min={10}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="close-detail-btn" style={{ flex: 1, background: '#f4c265', boxShadow: '0 4px 0 #d1a34b' }}>SIMPAN KUMPULAN SOAL</button>
                <button 
                  type="button" 
                  className="close-detail-btn" 
                  style={{ flex: 1, background: '#EF4444', boxShadow: '0 4px 0 #DC2626' }}
                  onClick={() => setShowAddCollectionModal(false)}
                >
                  BATAL
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
