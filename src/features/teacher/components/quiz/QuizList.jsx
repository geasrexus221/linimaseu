import React, { useState } from 'react';
import { Plus, HelpCircle, LayoutGrid, List, MonitorPlay } from 'lucide-react';

export default function QuizList({
  quizCollections,
  setSelectedCollectionId,
  setQuizCollections,
  setNewCollectionTitle,
  setNewCollectionDescription,
  setNewCollectionDurationLimit,
  setNewCollectionTargetClassId,
  setNewCollectionXpReward,
  setShowAddCollectionModal,
  onOpenActivateQuiz,
  onDeactivateQuiz,
  onOpenProjector
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const getRemainingTimeStr = (activeUntil) => {
    const remainingMs = activeUntil - Date.now();
    if (remainingMs <= 0) return 'Habis';
    const totalSec = Math.floor(remainingMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}m ${sec}s`;
  };

  const formatType = (t) => {
    if (t === 'CLASSIC') return 'Pilihan Ganda';
    if (t === '3D_MAP') return 'Peta 3D';
    if (t === 'GUESS_ARTIFACT') return 'Tebak Gambar';
    if (t === 'ANAGRAM') return 'Anagram';
    if (t === 'MATCHING') return 'Match Up';
    if (t === 'CATEGORIZATION') return 'Group Sort';
    if (t === 'BLANKS') return 'Lengkapi Kalimat';
    return t;
  };

  return (
    <div className="quiz-selection-wrapper">
      {/* DESKTOP VIEW */}
      <div className="card-box desktop-only">
        <div className="card-box-header flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2>Bank Soal</h2>
            <p>Kelola kumpulan kuis pembelajaran yang dapat diakses oleh siswa.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ display: 'flex', background: 'var(--card-bg)', border: '2px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
              <button 
                onClick={() => setViewMode('grid')}
                style={{ padding: '8px 12px', background: viewMode === 'grid' ? '#f4c265' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
                title="Mode Grid"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                style={{ padding: '8px 12px', background: viewMode === 'table' ? '#f4c265' : 'transparent', color: viewMode === 'table' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
                title="Mode Tabel"
              >
                <List size={18} />
              </button>
            </div>
            <button 
              className="add-class-btn-header"
              onClick={() => {
                setNewCollectionTitle('');
                setNewCollectionDescription('');
                setNewCollectionDurationLimit(30);
                setNewCollectionTargetClassId('ALL');
                setNewCollectionXpReward(200);
                setShowAddCollectionModal(true);
              }}
              style={{ background: '#f4c265', boxShadow: '0 4px 0 #d1a34b' }}
            >
              <Plus size={18} />
              <span>Tambah Kumpulan Soal</span>
            </button>
          </div>
        </div>

        {quizCollections.length === 0 ? (
          <div className="empty-placeholder">
            <HelpCircle size={48} className="empty-icon" />
            <h3>Belum Ada Kumpulan Soal</h3>
            <p>Klik tombol di atas untuk membuat kumpulan soal pertama Anda.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="quiz-collections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
            {quizCollections.map((col) => (
              <div 
                key={col.id} 
                style={{ 
                  background: 'var(--card-bg)', 
                  border: '2px solid var(--border-color)', 
                  borderRadius: '20px', 
                  padding: '20px', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#f4c265';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => setSelectedCollectionId(col.id)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.2rem', fontWeight: '800' }}>{col.title}</h3>
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '8px', background: '#f4c26533', color: '#f4c265', fontWeight: '800' }}>
                      {(col.questions && col.questions.length > 0) 
                        ? [...new Set(col.questions.map(q => q.questionType || 'CLASSIC'))].map(t => formatType(t)).join(', ') 
                        : 'Pilihan Ganda'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineBreak: 'anywhere' }}>{col.description || 'Tidak ada deskripsi.'}</p>
                </div>

                {col.isActive && (
                  <div style={{ background: '#10B98122', border: '1px solid #10B98155', color: '#10B981', padding: '6px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                    AKTIF (Sisa: {getRemainingTimeStr(col.activeUntil)})
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                  <span style={{ background: 'var(--border-color)', color: 'var(--text-color)', padding: '4px 10px', borderRadius: '30px' }}>
                    Kelas: {col.targetClassName}
                  </span>
                  <span style={{ background: 'var(--primary-bg-light)', color: 'var(--primary-text)', padding: '4px 10px', borderRadius: '30px' }}>
                    Durasi: {col.durationLimit}s / Soal
                  </span>
                  <span style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '4px 10px', borderRadius: '30px' }}>
                    Total Soal: {col.questions ? col.questions.length : 0}
                  </span>
                  <span style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', padding: '4px 10px', borderRadius: '30px' }}>
                    Reward: +{col.xpReward} ⭐
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px', borderTop: '2px solid var(--border-color)', paddingTop: '12px' }} onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => onOpenProjector(col)}
                    style={{ padding: '8px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 3px 0 #6D28D9' }}
                    title="Mode Proyektor"
                  >
                    <MonitorPlay size={16} /> Proyektor
                  </button>
                  <button 
                    onClick={() => setSelectedCollectionId(col.id)}
                    style={{ flex: 1.2, padding: '8px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Detail & Soal
                  </button>
                  {col.isActive ? (
                    <button 
                      onClick={() => onDeactivateQuiz(col.id)}
                      style={{ flex: 1.5, padding: '8px', background: '#f4c265', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 3px 0 #d1a34b' }}
                    >
                      Nonaktifkan
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        if (!col.questions || col.questions.length === 0) {
                          alert('Kumpulan soal harus memiliki minimal 1 soal sebelum bisa diaktifkan!');
                          return;
                        }
                        onOpenActivateQuiz(col);
                      }}
                      style={{ flex: 1.5, padding: '8px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 3px 0 #059669' }}
                    >
                      Aktifkan
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin menghapus kumpulan soal "${col.title}"?`)) {
                        setQuizCollections(prev => prev.filter(c => c.id !== col.id));
                      }
                    }}
                    style={{ padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="table-responsive" style={{ marginTop: '20px' }}>
              <table className="teacher-table">
                <thead>
                  <tr>
                    <th>Judul Kuis</th>
                    <th>Tipe Soal</th>
                    <th>Target Kelas</th>
                    <th>Status</th>
                    <th>Detail</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {quizCollections.map(col => (
                    <tr key={col.id} onClick={() => setSelectedCollectionId(col.id)} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: '800' }}>
                        {col.title}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '4px' }}>
                          {col.questions ? col.questions.length : 0} Soal | +{col.xpReward} ⭐
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '8px', background: '#f4c26533', color: '#f4c265', fontWeight: '800' }}>
                          {(col.questions && col.questions.length > 0) 
                            ? [...new Set(col.questions.map(q => q.questionType || 'CLASSIC'))].map(t => formatType(t)).join(', ') 
                            : 'Pilihan Ganda'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700' }}>{col.targetClassName}</td>
                      <td>
                        {col.isActive ? (
                          <span style={{ background: '#10B98122', color: '#10B981', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>
                            Aktif ({getRemainingTimeStr(col.activeUntil)})
                          </span>
                        ) : (
                          <span style={{ background: '#F4F4F5', color: '#A1A1AA', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>
                            Tidak Aktif
                          </span>
                        )}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="table-action-btn" onClick={() => setSelectedCollectionId(col.id)}>Buka Soal</button>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="table-action-btn" 
                            style={{ background: '#F3E8FF', color: '#7E22CE', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => onOpenProjector(col)}
                          >
                            <MonitorPlay size={14} /> Proyektor
                          </button>
                          {col.isActive ? (
                            <button 
                              className="table-action-btn" 
                              style={{ background: '#FFEDD5', color: '#EA580C' }}
                              onClick={() => onDeactivateQuiz(col.id)}
                            >
                              Nonaktifkan
                            </button>
                          ) : (
                            <button 
                              className="table-action-btn" 
                              style={{ background: '#ECFDF5', color: '#10B981' }}
                              onClick={() => {
                                if (!col.questions || col.questions.length === 0) {
                                  alert('Kumpulan soal harus memiliki minimal 1 soal sebelum bisa diaktifkan!');
                                  return;
                                }
                                onOpenActivateQuiz(col);
                              }}
                            >
                              Aktifkan
                            </button>
                          )}
                          <button 
                            className="table-action-btn" 
                            style={{ background: '#FEF2F2', color: '#EF4444' }}
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus kumpulan soal "${col.title}"?`)) {
                                setQuizCollections(prev => prev.filter(c => c.id !== col.id));
                              }
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* MOBILE VIEW */}
      <div className="quiz-selection-mobile mobile-only" style={{ paddingBottom: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 4px 0', color: 'var(--text-color)' }}>Bank Soal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Kelola kumpulan kuis pembelajaran siswa.</p>
        </div>
        
        <button 
          onClick={() => {
            setNewCollectionTitle('');
            setNewCollectionDescription('');
            setNewCollectionDurationLimit(30);
            setNewCollectionTargetClassId('ALL');
            setNewCollectionXpReward(200);
            setShowAddCollectionModal(true);
          }}
          style={{ width: '100%', padding: '14px', background: '#f4c265', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '20px', boxShadow: '0 4px 0 #d1a34b', cursor: 'pointer' }}
        >
          <Plus size={20} /> Tambah Kumpulan Soal
        </button>

        {quizCollections.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              <HelpCircle size={40} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1rem', margin: '0 0 6px 0', color: 'var(--text-color)' }}>Belum Ada Kumpulan Soal</h3>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>Ketuk tombol di atas untuk membuat.</p>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizCollections.map((col) => (
                <div key={col.id} onClick={() => setSelectedCollectionId(col.id)} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '16px', border: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 0 var(--border-color)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-color)', fontWeight: '800' }}>{col.title}</h3>
                    {col.isActive && (
                      <span style={{ background: '#10B98122', color: '#10B981', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800' }}>
                        AKTIF
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', background: 'var(--border-color)', color: 'var(--text-color)', padding: '4px 8px', borderRadius: '8px', fontWeight: '700' }}>Kelas: {col.targetClassName}</span>
                    <span style={{ fontSize: '0.7rem', background: '#10B98122', color: '#10B981', padding: '4px 8px', borderRadius: '8px', fontWeight: '700' }}>{col.questions ? col.questions.length : 0} Soal</span>
                    <span style={{ fontSize: '0.7rem', background: '#FFD70033', color: '#D97706', padding: '4px 8px', borderRadius: '8px', fontWeight: '700' }}>+{col.xpReward} ⭐</span>
                  </div>
                  <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '12px', marginTop: '4px', display: 'flex' }} onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => onOpenProjector(col)}
                      style={{ width: '100%', padding: '10px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 3px 0 #6D28D9' }}
                    >
                      <MonitorPlay size={16} /> Mulai Proyektor
                    </button>
                  </div>
                </div>
              ))}
            </div>
        )}
      </div>
    </div>
  );
}
