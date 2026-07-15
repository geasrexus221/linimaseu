import React from 'react';
import { Plus, Bell, Calendar } from 'lucide-react';

export default function DesktopOverview({
  setActiveMenu,
  setShowAnnouncementModal,
  announcements,
  setAnnouncements,
  selectedClassroom,
  setSelectedClassroom,
  classroomKeys,
  selectedDiagnosticClassId,
  setSelectedDiagnosticClassId,
  selectedDiagnosticTopicIndex,
  setSelectedDiagnosticTopicIndex,
  getDiagnosticData,
  classroomsState,
  activeTaskFilter,
  setActiveTaskFilter
}) {
  return (
    <div className="desktop-only">
      {/* SECTION PINTASAN AKSI (Quick Actions) */}
      <div className="quick-actions-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', margin: '24px 0' }}>
        <button className="quick-action-btn" onClick={() => setActiveMenu('quizzes')}>
          <Plus size={18} />
          <span>Buat Kuis/PR</span>
        </button>
        <button className="quick-action-btn" onClick={() => setShowAnnouncementModal(true)}>
          <Bell size={18} />
          <span>Kirim Pengumuman Kelas</span>
        </button>
        <button className="quick-action-btn" onClick={() => {
          setActiveMenu('students');
          if (!selectedClassroom && classroomKeys.length > 0) {
            setSelectedClassroom(classroomKeys[0]);
          }
        }}>
          <Calendar size={18} />
          <span>Buka Absensi Hari Ini</span>
        </button>
      </div>

      {/* PENGUMUMAN SAAT INI */}
      {announcements.length > 0 && (
        <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', margin: '12px 0 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Bell size={20} color="#D97706" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#B45309', fontWeight: '800' }}>Pengumuman Baru</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.map((ann, idx) => (
              <div key={ann.id} style={{ paddingBottom: idx !== announcements.length - 1 ? '12px' : '0', borderBottom: idx !== announcements.length - 1 ? '1px solid rgba(217, 119, 6, 0.2)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '0.95rem', lineHeight: '1.5', color: '#92400E', whiteSpace: 'pre-line', textAlign: 'left' }}>
                    {ann.message}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#B45309', fontWeight: '600' }}>
                    <span>Kelas: <strong style={{ color: '#D97706' }}>{ann.className}</strong></span>
                    <span>Waktu: <strong>{ann.timestamp}</strong></span>
                  </div>
                </div>
                <button 
                  onClick={() => setAnnouncements(prev => prev.filter(a => a.id !== ann.id))} 
                  style={{ background: '#FDE68A', border: 'none', color: '#B45309', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', flexShrink: 0, padding: '6px 12px', borderRadius: '8px' }}
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Dashboard Main Section */}
      <div className="dashboard-columns-grid">
        
        {/* KOLOM KIRI (70% Width - Pusat Monitoring Tugas & Materi) */}
        <div className="dashboard-column-left-main">
          
          {/* Card Tugas & PR Berjalan */}
          <div className="dashboard-card-navy">
            <div className="card-navy-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0 }}>Tugas & PR Berjalan</h3>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                <button 
                  onClick={() => setActiveTaskFilter('ALL')}
                  style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: 'none', cursor: 'pointer', background: activeTaskFilter === 'ALL' ? '#10B981' : '#F1F5F9', color: activeTaskFilter === 'ALL' ? '#FFF' : '#64748B' }}
                >
                  Semua
                </button>
                {classroomKeys.map(key => (
                  <button 
                    key={key}
                    onClick={() => setActiveTaskFilter(key)}
                    style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: 'none', cursor: 'pointer', background: activeTaskFilter === key ? '#10B981' : '#F1F5F9', color: activeTaskFilter === key ? '#FFF' : '#64748B', whiteSpace: 'nowrap' }}
                  >
                    {classroomsState[key].name}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-navy-body">
              <div className="task-progress-item">
                <div className="task-progress-info">
                  <span>PR IPAS 1</span>
                  <span className="success-accent">25/35 Siswa</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill green-fill" style={{ width: '71.4%' }}></div>
                </div>
              </div>
              <div className="task-progress-item">
                <div className="task-progress-info">
                  <span>TUGAS MATEMATIKA 1</span>
                  <span className="success-accent">22/35 Siswa</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill green-fill" style={{ width: '62.8%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Diagnostik Materi */}
          <div className="dashboard-card-navy">
            <div className="card-navy-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Diagnostik Materi</h3>
              <select
                value={selectedDiagnosticClassId}
                onChange={(e) => {
                  setSelectedDiagnosticClassId(e.target.value);
                  setSelectedDiagnosticTopicIndex(0); // Reset selected topic to first one
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--background-color)',
                  color: 'var(--text-color)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">Semua Kelas</option>
                {classroomKeys.map(key => (
                  <option key={key} value={key}>{classroomsState[key].name}</option>
                ))}
              </select>
            </div>
            <div className="card-navy-body">
              {getDiagnosticData(selectedDiagnosticClassId).map((item, idx) => {
                const isSelected = selectedDiagnosticTopicIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className="diagnostic-visual-item" 
                    onClick={() => setSelectedDiagnosticTopicIndex(idx)}
                    style={{ 
                      marginBottom: '12px', 
                      cursor: 'pointer', 
                      padding: '8px 12px', 
                      borderRadius: '12px', 
                      background: isSelected ? 'var(--primary-bg-light)' : 'transparent',
                      border: isSelected ? '1px solid #3B82F6' : '1px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.95rem', fontWeight: '600' }}>
                      <span>{item.topic}</span>
                      <span style={{ color: item.color, fontWeight: '800' }}>
                        {item.accuracy}% <span style={{ fontSize: '0.75rem', fontWeight: '600', color: item.trend >= 0 ? '#10B981' : '#EF4444' }}>
                          ({item.trend >= 0 ? 'Naik' : 'Turun'} {Math.abs(item.trend)}%)
                        </span>
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${item.accuracy}%`, background: item.color }}></div>
                    </div>
                  </div>
                );
              })}

              {/* Detail area for active selected topic */}
              {(() => {
                const activeTopic = getDiagnosticData(selectedDiagnosticClassId)[selectedDiagnosticTopicIndex] || getDiagnosticData(selectedDiagnosticClassId)[0];
                if (!activeTopic) return null;
                return (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-color)' }}>
                      Detail Topik: {activeTopic.topic}
                    </h4>
                    
                    {/* Mastery Distribution */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                        Distribusi Pemahaman Siswa:
                      </span>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                        <div style={{ flex: 1, background: 'var(--background-color)', padding: '8px', borderRadius: '8px', borderLeft: '3px solid #10B981', textAlign: 'center' }}>
                          <div style={{ color: '#10B981', fontWeight: '800' }}>{activeTopic.mastery.paham}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Paham</div>
                        </div>
                        <div style={{ flex: 1, background: 'var(--background-color)', padding: '8px', borderRadius: '8px', borderLeft: '3px solid #F59E0B', textAlign: 'center' }}>
                          <div style={{ color: '#F59E0B', fontWeight: '800' }}>{activeTopic.mastery.cukup}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cukup</div>
                        </div>
                        <div style={{ flex: 1, background: 'var(--background-color)', padding: '8px', borderRadius: '8px', borderLeft: '3px solid #EF4444', textAlign: 'center' }}>
                          <div style={{ color: '#EF4444', fontWeight: '800' }}>{activeTopic.mastery.kurang}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Belum</div>
                        </div>
                      </div>
                    </div>

                    {/* Underperforming Students */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                        Siswa Butuh Bantuan:
                      </span>
                      {activeTopic.underperformingStudents.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {activeTopic.underperformingStudents.map((name, sIdx) => (
                            <span 
                              key={sIdx} 
                              style={{ 
                                fontSize: '0.8rem', 
                                background: '#7F1D1D33', 
                                color: '#FCA5A5', 
                                padding: '4px 10px', 
                                borderRadius: '20px', 
                                border: '1px solid #7F1D1D66',
                                fontWeight: '600'
                              }}
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '700', background: '#064E3B33', padding: '8px 12px', borderRadius: '8px', border: '1px solid #064E3B66' }}>
                          Hebat! Semua siswa telah mencapai target ketuntasan.
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => alert(`Mengirimkan sesi ulasan khusus topik "${activeTopic.topic}" ke siswa yang memerlukan.`)}
                        style={{ 
                          flex: 1, 
                          padding: '8px 12px', 
                          background: '#10B981', 
                          color: '#FFF', 
                          border: 'none', 
                          borderRadius: '10px', 
                          fontSize: '0.8rem', 
                          fontWeight: '700', 
                          cursor: 'pointer',
                          boxShadow: '0 3px 0 #059669'
                        }}
                      >
                        Kirim Tugas Ulasan
                      </button>
                      <button 
                        onClick={() => alert(`Membuka buku panduan belajar untuk topik "${activeTopic.topic}".`)}
                        style={{ 
                          flex: 1, 
                          padding: '8px 12px', 
                          background: '#3B82F6', 
                          color: '#FFF', 
                          border: 'none', 
                          borderRadius: '10px', 
                          fontSize: '0.8rem', 
                          fontWeight: '700', 
                          cursor: 'pointer',
                          boxShadow: '0 3px 0 #1D4ED8'
                        }}
                      >
                        Buka Modul Ajar
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

        </div>

        {/* KOLOM KANAN (30% Width - Pusat Perhatian & Tindakan) */}
        <div className="dashboard-column-right-main">

          {/* Card Perlu Tindakan Guru */}
          <div className="dashboard-card-navy">
            <div className="card-navy-header">
              <h3>Perlu Tindakan Guru</h3>
            </div>
            <div className="card-navy-body">
              <ul className="todo-list-navy">
                <li className="todo-item-navy">
                  <span className="todo-dot danger-dot"></span>
                  <span>Ada 3 soal esai perlu dinilai</span>
                </li>
                <li className="todo-item-navy">
                  <span className="todo-dot danger-dot"></span>
                  <span>Batas waktu PR Matematika habis hari ini</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
