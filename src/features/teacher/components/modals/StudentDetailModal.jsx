import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StudentDetailModal({
  selectedStudent,
  onClose,
  activeClassroom,
  getStudentRecord,
  updateStudentRecord,
  onSave,
  averageScore
}) {
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentNIS, setEditStudentNIS] = useState('');

  const [openSections, setOpenSections] = useState({
    stats: true,
    tasks: true,
    attendance: true,
    journal: true,
    quizLog: true
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  
  const [editingAcademicIndex, setEditingAcademicIndex] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectScore, setEditSubjectScore] = useState('');
  const [editSubjectClassAvg, setEditSubjectClassAvg] = useState('');
  const [editSubjectDateShared, setEditSubjectDateShared] = useState('');
  const [editSubjectDateCompleted, setEditSubjectDateCompleted] = useState('');

  const [showAddAcademicForm, setShowAddAcademicForm] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectScore, setNewSubjectScore] = useState('');
  const [newSubjectClassAvg, setNewSubjectClassAvg] = useState('');
  const [newSubjectDateShared, setNewSubjectDateShared] = useState('');
  const [newSubjectDateCompleted, setNewSubjectDateCompleted] = useState('');

  
  useEffect(() => {
    if (selectedStudent) {
      setEditStudentName(selectedStudent.name || '');
      setEditStudentNIS(selectedStudent.nis || selectedStudent.mockNIS || '');
    }
  }, [selectedStudent]);

  if (!selectedStudent) return null;

  const record = getStudentRecord(selectedStudent.id, selectedStudent.score);

  
  const maxQuizzes = 50;
  const correctQuizzes = Math.min(maxQuizzes, Math.round((selectedStudent.score / 1550) * 45));
  const accuracy = Math.min(100, Math.round((selectedStudent.score / 1550) * 40 + 55));
  const lastQuizTime = `${Math.max(1, 12 - Math.round(selectedStudent.score / 200))} jam yang lalu`;

  
  const weeks = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'];
  const attendanceCounts = weeks.reduce((acc, w) => {
    const status = record.attendance[w] || 'Hadir';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { Hadir: 0, Sakit: 0, Izin: 0, Alpa: 0 });

  const handleSave = () => {
    onSave(selectedStudent.id, editStudentName, editStudentNIS);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="student-detail-modal"
        style={{ maxWidth: '950px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: '24px 24px 12px 24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-section" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div className="student-avatar-circle" style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: '1.5rem', fontWeight: '800' }}>
            {(editStudentName || '').split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '360px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="Nama Murid"
              value={editStudentName} 
              onChange={(e) => setEditStudentName(e.target.value)} 
              style={{ width: '100%', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '1.4rem', fontWeight: '800', textAlign: 'center', outline: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>NIS/NISN:</span>
              <input 
                type="text" 
                placeholder="NIS/NISN"
                value={editStudentNIS} 
                onChange={(e) => setEditStudentNIS(e.target.value)} 
                style={{ width: '140px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: '700', textAlign: 'center', outline: 'none' }}
              />
            </div>
          </div>
          <p className="student-status-badge" style={{ marginTop: '4px', marginBottom: '12px' }}>Kelas: {activeClassroom?.name || 'Sejarah'}</p>
        </div>

        <div className="modal-body-section modal-body-grid" style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', marginBottom: '12px' }}>
          
          
          <div className="modal-column-left">
            
            <div style={{ margin: '10px 0' }}>
              <div 
                onClick={() => toggleSection('stats')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'var(--border-color)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  marginBottom: '10px',
                  userSelect: 'none'
                }}
              >
                <span>Statistik Performa Kuis</span>
                <span>{openSections.stats ? '▲' : '▼'}</span>
              </div>

              {openSections.stats && (
                <div className="detail-stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                  <div className="detail-stat-item" style={{ padding: '10px' }}>
                    <span className="stat-label">Total Kuis Benar</span>
                    <span className="stat-val primary-text" style={{ fontSize: '1.1rem' }}>{correctQuizzes} / {maxQuizzes} Soal</span>
                  </div>
                  <div className="detail-stat-item" style={{ padding: '10px' }}>
                    <span className="stat-label">Akurasi Jawaban</span>
                    <span className="stat-val success-text" style={{ fontSize: '1.1rem', color: '#10B981' }}>{accuracy}%</span>
                  </div>
                  <div className="detail-stat-item" style={{ padding: '10px' }}>
                    <span className="stat-label">Kuis Terakhir</span>
                    <span className="stat-val danger-text" style={{ fontSize: '0.9rem' }}>Bab 2 ({lastQuizTime})</span>
                  </div>
                </div>
              )}
            </div>

            <div className="divider-line"></div>

            
            <div style={{ margin: '15px 0' }}>
              <div 
                onClick={() => toggleSection('tasks')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'var(--border-color)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  marginBottom: '10px',
                  userSelect: 'none'
                }}
              >
                <span>Ringkasan Tugas Murid</span>
                <span>{openSections.tasks ? '▲' : '▼'}</span>
              </div>

              {openSections.tasks && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px 5px' }}>
                  
                  <div>
                    <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-muted)' }}>Tugas Manual (Input Guru)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(record.academic || []).map((item, index) => {
                        const isEditing = editingAcademicIndex === index;
                        if (isEditing) {
                          return (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--background-color)', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input 
                                  type="text" 
                                  value={editSubjectName} 
                                  onChange={(e) => setEditSubjectName(e.target.value)} 
                                  style={{ flex: 1, padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                                />
                                <input 
                                  type="number" 
                                  placeholder="Nilai"
                                  value={editSubjectScore} 
                                  onChange={(e) => setEditSubjectScore(e.target.value)} 
                                  style={{ width: '60px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                                />
                                <input 
                                  type="number" 
                                  placeholder="Rata-rata"
                                  value={editSubjectClassAvg} 
                                  onChange={(e) => setEditSubjectClassAvg(e.target.value)} 
                                  style={{ width: '60px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                                />
                              </div>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dibagikan</span>
                                    <input 
                                      type="date" 
                                      value={editSubjectDateShared} 
                                      onChange={(e) => setEditSubjectDateShared(e.target.value)} 
                                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.8rem' }}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dikerjakan</span>
                                    <input 
                                      type="date" 
                                      value={editSubjectDateCompleted} 
                                      onChange={(e) => setEditSubjectDateCompleted(e.target.value)} 
                                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.8rem' }}
                                    />
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
                                  <button 
                                    onClick={() => {
                                      const updated = [...record.academic];
                                      updated[index] = { 
                                        subject: editSubjectName.trim(), 
                                        score: parseInt(editSubjectScore, 10) || 0,
                                        classAvg: parseInt(editSubjectClassAvg, 10) || 0,
                                        dateShared: editSubjectDateShared,
                                        dateCompleted: editSubjectDateCompleted
                                      };
                                      updateStudentRecord(selectedStudent.id, 'academic', updated);
                                      setEditingAcademicIndex(null);
                                    }} 
                                    style={{ padding: '4px 10px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer' }}
                                  >
                                    Simpan
                                  </button>
                                  <button 
                                    onClick={() => setEditingAcademicIndex(null)} 
                                    style={{ padding: '4px 10px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer' }}
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px 14px', background: 'var(--background-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '700' }}>{item.subject}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                  Nilai: <strong style={{ color: '#10B981' }}>{item.score}</strong> | Rata-rata: <strong>{item.classAvg || 0}</strong>
                                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    onClick={() => {
                                      setEditingAcademicIndex(index);
                                      setEditSubjectName(item.subject);
                                      setEditSubjectScore(item.score);
                                      setEditSubjectClassAvg(item.classAvg || 0);
                                      setEditSubjectDateShared(item.dateShared || '');
                                      setEditSubjectDateCompleted(item.dateCompleted || '');
                                    }} 
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#3B82F6', fontWeight: '700' }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (confirm(`Hapus tugas ${item.subject}?`)) {
                                        const updated = record.academic.filter((_, i) => i !== index);
                                        updateStudentRecord(selectedStudent.id, 'academic', updated);
                                      }
                                    }} 
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#EF4444', fontWeight: '700' }}
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            </div>
                            {(item.dateShared || item.dateCompleted) && (
                              <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {item.dateShared && <span>Dibagikan: <strong>{item.dateShared}</strong></span>}
                                {item.dateCompleted && <span>Dikerjakan: <strong>{item.dateCompleted}</strong></span>}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {showAddAcademicForm ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--background-color)', padding: '12px', border: '2px dashed var(--border-color)', borderRadius: '12px', marginTop: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="text" 
                              placeholder="Nama Tugas/Mapel" 
                              value={newSubjectName} 
                              onChange={(e) => setNewSubjectName(e.target.value)} 
                              style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                            />
                            <input 
                              type="number" 
                              placeholder="Nilai" 
                              value={newSubjectScore} 
                              onChange={(e) => setNewSubjectScore(e.target.value)} 
                              style={{ width: '70px', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                            />
                            <input 
                              type="number" 
                              placeholder="Rata-rata" 
                              value={newSubjectClassAvg} 
                              onChange={(e) => setNewSubjectClassAvg(e.target.value)} 
                              style={{ width: '70px', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dibagikan</span>
                                <input 
                                  type="date" 
                                  value={newSubjectDateShared} 
                                  onChange={(e) => setNewSubjectDateShared(e.target.value)} 
                                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                                />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dikerjakan</span>
                                <input 
                                  type="date" 
                                  value={newSubjectDateCompleted} 
                                  onChange={(e) => setNewSubjectDateCompleted(e.target.value)} 
                                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                                />
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <button 
                                onClick={() => {
                                  if (!newSubjectName.trim()) return;
                                  const updated = [...(record.academic || []), { 
                                    subject: newSubjectName.trim(), 
                                    score: parseInt(newSubjectScore, 10) || 0,
                                    classAvg: parseInt(newSubjectClassAvg, 10) || 0,
                                    dateShared: newSubjectDateShared,
                                    dateCompleted: newSubjectDateCompleted
                                  }];
                                  updateStudentRecord(selectedStudent.id, 'academic', updated);
                                  setNewSubjectName('');
                                  setNewSubjectScore('');
                                  setNewSubjectClassAvg('');
                                  setNewSubjectDateShared('');
                                  setNewSubjectDateCompleted('');
                                  setShowAddAcademicForm(false);
                                }} 
                                style={{ padding: '6px 12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}
                              >
                                Tambah
                              </button>
                              <button 
                                onClick={() => setShowAddAcademicForm(false)} 
                                style={{ padding: '6px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddAcademicForm(true)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            background: 'transparent',
                            border: '2px dashed var(--border-color)',
                            borderRadius: '12px',
                            color: 'var(--text-muted)',
                            fontWeight: '800',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            marginTop: '8px',
                            transition: 'all 0.2s'
                          }}
                        >
                          Tambah Tugas Manual
                        </button>
                      )}
                    </div>
                  </div>

                  
                  <div style={{ marginTop: '10px' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-muted)' }}>Tugas Otomatis (Aktivitas Sistem)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px 14px', background: 'var(--background-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '700' }}><span style={{ color: '#3B82F6', fontWeight: '800' }}>[Kuis]</span> Bab 1: Pahlawan Wanita</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Nilai: <strong style={{ color: '#10B981' }}>{selectedStudent.score || 0} ⭐</strong> | Rata-rata Kelas: <strong>{averageScore || 0} ⭐</strong>
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Dibagikan: <strong>2026-06-01</strong></span>
                          <span>Dikerjakan: <strong>2026-06-02</strong></span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px 14px', background: 'var(--background-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '700' }}><span style={{ color: '#f4c265', fontWeight: '800' }}>[PR]</span> Eksplorasi Peta Kerajaan</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Status Keaktifan: <strong style={{ color: selectedStudent.streak > 2 ? '#10B981' : '#EF4444' }}>{selectedStudent.streak > 2 ? 'Selesai' : 'Belum Selesai'}</strong>
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Dibagikan: <strong>2026-06-03</strong></span>
                          {selectedStudent.streak > 2 && <span>Dikerjakan: <strong>2026-06-04</strong></span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          
          <div className="modal-column-right">
            
            <div style={{ margin: '10px 0' }}>
              <div 
                onClick={() => toggleSection('attendance')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'var(--border-color)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  marginBottom: '10px',
                  userSelect: 'none'
                }}
              >
                <span>Tabel Absensi Mandiri Guru</span>
                <span>{openSections.attendance ? '▲' : '▼'}</span>
              </div>

              {openSections.attendance && (
                <div style={{ padding: '0 5px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ textAlign: 'left', padding: '10px 5px' }}>Minggu</th>
                        <th style={{ textAlign: 'center', padding: '10px 5px' }}>Status Absensi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeks.map(week => (
                        <tr key={week} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '10px 5px', fontWeight: '700' }}>{week}</td>
                          <td style={{ padding: '10px 5px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              {['Hadir', 'Sakit', 'Izin', 'Alpa'].map(status => {
                                const isSelected = record.attendance[week] === status;
                                let btnBg = 'transparent';
                                let btnColor = 'var(--text-muted)';
                                let btnBorder = '2px solid var(--border-color)';
                                if (isSelected) {
                                  if (status === 'Hadir') { btnBg = '#ECFDF5'; btnColor = '#10B981'; btnBorder = '2px solid #10B981'; }
                                  else if (status === 'Sakit') { btnBg = '#FFF3CD'; btnColor = '#D97706'; btnBorder = '2px solid #D97706'; }
                                  else if (status === 'Izin') { btnBg = '#E0F2FE'; btnColor = '#0284C7'; btnBorder = '2px solid #0284C7'; }
                                  else if (status === 'Alpa') { btnBg = '#FEF2F2'; btnColor = '#EF4444'; btnBorder = '2px solid #EF4444'; }
                                }
                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => {
                                      const updatedAttendance = { ...record.attendance, [week]: status };
                                      updateStudentRecord(selectedStudent.id, 'attendance', updatedAttendance);
                                    }}
                                    style={{
                                      padding: '4px 10px',
                                      borderRadius: '8px',
                                      border: btnBorder,
                                      background: btnBg,
                                      color: btnColor,
                                      fontWeight: '800',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      transition: 'all 0.1s'
                                    }}
                                  >
                                    {status === 'Hadir' ? 'H' : status === 'Sakit' ? 'S' : status === 'Izin' ? 'I' : 'A'}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-around', 
                    background: 'var(--border-color)', 
                    padding: '10px', 
                    borderRadius: '12px', 
                    marginTop: '10px',
                    fontSize: '0.8rem',
                    fontWeight: '800'
                  }}>
                    <span style={{ color: '#10B981' }}>Hadir: {attendanceCounts.Hadir}</span>
                    <span style={{ color: '#D97706' }}>Sakit (S): {attendanceCounts.Sakit}</span>
                    <span style={{ color: '#0284C7' }}>Izin (I): {attendanceCounts.Izin}</span>
                    <span style={{ color: '#EF4444' }}>Alpa (A): {attendanceCounts.Alpa}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="divider-line"></div>

            
            <div style={{ margin: '15px 0' }}>
              <div 
                onClick={() => toggleSection('journal')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'var(--border-color)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  marginBottom: '10px',
                  userSelect: 'none'
                }}
              >
                <span>Catatan Jurnal Guru</span>
                <span>{openSections.journal ? '▲' : '▼'}</span>
              </div>

              {openSections.journal && (
                <div style={{ padding: '0 5px' }}>
                  <textarea
                    placeholder="Ketik di sini untuk evaluasi mandiri..."
                    value={record.notes}
                    onChange={(e) => updateStudentRecord(selectedStudent.id, 'notes', e.target.value)}
                    style={{
                      width: '100%',
                      height: '80px',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-color)',
                      fontSize: '0.9rem',
                      resize: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="divider-line"></div>

            
            <div style={{ margin: '15px 0' }}>
              <div 
                onClick={() => toggleSection('quizLog')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'var(--border-color)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  marginBottom: '10px',
                  userSelect: 'none'
                }}
              >
                <span>Referensi Log Kuis Otomatis</span>
                <span>{openSections.quizLog ? '▲' : '▼'}</span>
              </div>

              {openSections.quizLog && (
                <div style={{ 
                  padding: '12px', 
                  border: '2px solid var(--border-color)', 
                  borderTop: 'none', 
                  borderBottomLeftRadius: '12px', 
                  borderBottomRightRadius: '12px',
                  background: 'var(--card-bg)'
                }}>
                  <div className="academic-evaluation-section" style={{ margin: 0 }}>
                    <div className="eval-card" style={{ margin: 0 }}>
                      <div className="eval-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0' }}>
                        <span>[Kuis] Kuis Bab 1 (Pahlawan Sejarah)</span>
                        <span className="badge-pass" style={{ background: '#ECFDF5', color: '#10B981', padding: '2px 8px', borderRadius: '6px' }}>
                          Lulus ({selectedStudent.score} ⭐)
                        </span>
                      </div>
                      <div className="eval-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0' }}>
                        <span>[PR] Keaktifan Eksplorasi Peta</span>
                        <span className="badge-pass font-green" style={{ background: '#ECFDF5', color: '#10B981', padding: '2px 8px', borderRadius: '6px' }}>
                          {selectedStudent.streak > 2 ? 'Sangat Aktif' : 'Cukup Aktif'}
                        </span>
                      </div>
                      <div className="eval-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0' }}>
                        <span>Bantuan Dipakai</span>
                        <span>{selectedStudent.score < 1000 ? '3x' : '1x'} Digunakan</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="modal-footer-section" style={{ flexShrink: 0, borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '0' }}>
          <button className="close-detail-btn" onClick={handleSave}>SIMPAN & TUTUP</button>
        </div>
      </motion.div>
    </div>
  );
}
