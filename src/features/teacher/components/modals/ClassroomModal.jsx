import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Settings } from 'lucide-react';

export default function ClassroomModal({
  showAddModal,
  setShowAddModal,
  newClassName,
  setNewClassName,
  classroomsState,
  setClassroomsState,
  showEditModal,
  setShowEditModal,
  editClassName,
  setEditClassName
}) {
  return (
    <>
      
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
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
                  <Users size={48} color="#10B981" />
                </div>
                <h2>Tambah Kelas Baru</h2>
                <p>Masukkan nama kelas yang ingin Anda daftarkan.</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newClassName.trim()) return;
                const newKey = `KELAS_${Date.now()}`;
                setClassroomsState({
                  ...classroomsState,
                  [newKey]: {
                    id: newKey,
                    name: newClassName.trim(),
                    teacher: '-',
                    chalkboardMessage: 'Pelajari materi sejarah dengan giat!',
                    students: [],
                    maxDesks: 36,
                    assignments: []
                  }
                });
                setShowAddModal(false);
                setNewClassName('');
              }} className="auth-form" style={{ marginTop: '20px' }}>
                <div className="input-group">
                  <label>Nama Kelas</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Kelas 6-C"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button type="submit" className="close-detail-btn" style={{ flex: 1 }}>TAMBAH KELAS</button>
                  <button 
                    type="button" 
                    className="close-detail-btn" 
                    style={{ flex: 1, background: '#EF4444', boxShadow: '0 4px 0 #DC2626' }}
                    onClick={() => setShowAddModal(false)}
                  >
                    BATAL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(null)}>
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
                  <Settings size={48} color="#3B82F6" />
                </div>
                <h2>Ubah Nama Kelas</h2>
                <p>Ubah nama kelas terpilih.</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!editClassName.trim()) return;
                setClassroomsState({
                  ...classroomsState,
                  [showEditModal]: {
                    ...classroomsState[showEditModal],
                    name: editClassName.trim()
                  }
                });
                setShowEditModal(null);
                setEditClassName('');
              }} className="auth-form" style={{ marginTop: '20px' }}>
                <div className="input-group">
                  <label>Nama Kelas</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Kelas 6-C"
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button type="submit" className="close-detail-btn" style={{ flex: 1 }}>SIMPAN PERUBAHAN</button>
                  <button 
                    type="button" 
                    className="close-detail-btn" 
                    style={{ flex: 1, background: '#EF4444', boxShadow: '0 4px 0 #DC2626' }}
                    onClick={() => setShowEditModal(null)}
                  >
                    BATAL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
