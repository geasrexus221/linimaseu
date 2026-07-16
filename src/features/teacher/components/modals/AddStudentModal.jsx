import React, { useState } from 'react';
import { X, Copy, Check, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddStudentModal({ isOpen, onClose, onAddStudent, activeClassroom }) {
  const [activeTab, setActiveTab] = useState('manual'); 
  const [studentName, setStudentName] = useState('');
  const [studentNis, setStudentNis] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activeClassroom) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentNis.trim()) return;

    onAddStudent({
      name: studentName.trim(),
      nis: studentNis.trim()
    });

    
    setStudentName('');
    setStudentNis('');
  };

  const handleCopyCode = () => {
    
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '450px' }}
      >
        <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={24} /> Tambah Murid
          </h2>
          <p>Tambahkan murid ke kelas <strong>{activeClassroom.name}</strong></p>
        </div>

        
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '20px', paddingBottom: '10px' }}>
          <button 
            onClick={() => setActiveTab('manual')}
            style={{ flex: 1, padding: '8px 16px', background: activeTab === 'manual' ? '#10B981' : 'transparent', color: activeTab === 'manual' ? 'white' : 'var(--text-color)', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Input Manual
          </button>
          <button 
            onClick={() => setActiveTab('invite')}
            style={{ flex: 1, padding: '8px 16px', background: activeTab === 'invite' ? '#3B82F6' : 'transparent', color: activeTab === 'invite' ? 'white' : 'var(--text-color)', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Undang via Kode
          </button>
        </div>

        <div className="modal-body-section" style={{ padding: '0 24px 24px 24px' }}>
          
          {activeTab === 'manual' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Nama Lengkap Murid</label>
                <input 
                  type="text" 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)} 
                  placeholder="Cth: Budi Santoso"
                  className="game-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>NIS / NISN</label>
                <input 
                  type="text" 
                  value={studentNis} 
                  onChange={(e) => setStudentNis(e.target.value)} 
                  placeholder="Cth: 10293847"
                  className="game-input"
                  required
                />
              </div>
              <div style={{ padding: '12px', background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '8px', fontSize: '0.8rem', color: '#92400E', marginTop: '8px' }}>
                <strong>Catatan:</strong> Murid ini akan dibuatkan akun otomatis. Kata sandi bawaan (default) adalah: <strong>123456</strong>
              </div>
              <button type="submit" className="save-btn" style={{ marginTop: '16px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                Tambahkan Murid
              </button>
            </form>
          )}

          {activeTab === 'invite' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Suruh murid Anda memasukkan kode di bawah ini pada halaman "Gabung Kelas" di perangkat mereka.
              </p>
              
              <div style={{ background: '#F0F9FF', border: '2px dashed #7DD3FC', borderRadius: '16px', padding: '24px', marginBottom: '24px', display: 'inline-block' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '4px', color: '#0284C7' }}>
                  LMS-5A-DEV
                </div>
              </div>

              <button 
                onClick={handleCopyCode}
                style={{ width: '100%', padding: '14px', background: copied ? '#10B981' : 'var(--card-bg)', border: copied ? '2px solid #10B981' : '2px solid var(--border-color)', color: copied ? 'white' : 'var(--text-color)', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: copied ? '0 4px 0 #059669' : '0 4px 0 var(--border-color)', transition: 'all 0.2s' }}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Kode Tersalin!' : 'Salin Kode Kelas'}
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
