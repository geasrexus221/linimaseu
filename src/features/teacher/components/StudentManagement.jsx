import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, LayoutGrid, List } from 'lucide-react';

export default function StudentManagement({
  selectedClassroom,
  setSelectedClassroom,
  classroomKeys,
  classroomsState,
  setClassroomsState,
  setShowAddModal,
  setNewClassName,
  setShowEditModal,
  setEditClassName,
  activeClassroom,
  sortedStudents,
  handleSort,
  renderSortIndicator,
  handleOpenStudentDetail,
  setShowAddStudentModal
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const toggleAttendance = (e, key) => {
    e.stopPropagation();
    const nextState = {
      ...classroomsState,
      [key]: {
        ...classroomsState[key],
        isAttendanceActive: !classroomsState[key].isAttendanceActive
      }
    };
    setClassroomsState(nextState);
  };

  return (
    <motion.div 
      key="students"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="students-view"
    >
      {!selectedClassroom ? (
        // TINGKAT 1: Daftar Kelas
        <div className="classroom-selection-wrapper">
          {/* DESKTOP VIEW */}
          <div className="classroom-selection-view desktop-only">
            <div className="card-box-header flex-between">
              <div>
                <h2>Daftar Kelas</h2>
                <p>Pilih kelas di bawah ini untuk melihat perkembangan belajar murid.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ display: 'flex', background: 'var(--card-bg)', border: '2px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => setViewMode('grid')}
                    style={{ padding: '8px 12px', background: viewMode === 'grid' ? '#1CB0F6' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
                    title="Mode Grid"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')}
                    style={{ padding: '8px 12px', background: viewMode === 'table' ? '#1CB0F6' : 'transparent', color: viewMode === 'table' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
                    title="Mode Tabel"
                  >
                    <List size={18} />
                  </button>
                </div>
                <button 
                  className="add-class-btn-header"
                  onClick={() => {
                    setNewClassName('');
                    setShowAddModal(true);
                  }}
                >
                  <Plus size={18} />
                  <span>Tambah Kelas</span>
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="classroom-grid">
              {classroomKeys.map((key) => {
                const room = classroomsState[key];
                const roomStudents = room.students || [];
                const onlineCount = roomStudents.filter(s => s.isOnline).length;

                return (
                  <div 
                    key={key} 
                    className="classroom-card"
                    onClick={() => setSelectedClassroom(key)}
                  >
                    <div className="classroom-card-header">
                      <h3 style={{ margin: 0 }}>{room.name}</h3>
                    </div>
                    <div className="classroom-card-stats">
                      <div className="class-stat">
                        <span className="stat-num">{roomStudents.length}</span>
                        <span className="stat-txt">Murid</span>
                      </div>
                      <div className="class-stat">
                        <span className="stat-num">{onlineCount}/{roomStudents.length}</span>
                        <span className="stat-txt">Online</span>
                      </div>
                    </div>
                    
                    <div className="class-card-footer" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="open-class-btn" 
                        style={{ 
                          background: room.isAttendanceActive ? '#FEF2F2' : '#ECFDF5', 
                          color: room.isAttendanceActive ? '#EF4444' : '#10B981', 
                          border: `2px solid ${room.isAttendanceActive ? '#FCA5A5' : '#6EE7B7'}` 
                        }}
                        onClick={(e) => toggleAttendance(e, key)}
                      >
                        {room.isAttendanceActive ? 'Nonaktifkan Presensi' : 'Aktifkan Presensi'}
                      </button>
                      <button 
                        className="edit-class-action-btn"
                        onClick={() => {
                          setEditClassName(room.name);
                          setShowEditModal(key);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-class-action-btn"
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus ${room.name}?`)) {
                            const nextState = { ...classroomsState };
                            delete nextState[key];
                            setClassroomsState(nextState);
                          }
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            ) : (
              <div className="table-responsive">
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Nama Kelas</th>
                      <th>Total Murid</th>
                      <th>Murid Online</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classroomKeys.map((key) => {
                      const room = classroomsState[key];
                      const roomStudents = room.students || [];
                      const onlineCount = roomStudents.filter(s => s.isOnline).length;
                      
                      return (
                        <tr key={key} onClick={() => setSelectedClassroom(key)} style={{ cursor: 'pointer' }}>
                          <td style={{ fontWeight: '800' }}>{room.name}</td>
                          <td style={{ fontWeight: '600' }}>{roomStudents.length}</td>
                          <td>
                            <span style={{ color: '#10B981', fontWeight: '800', background: '#ECFDF5', padding: '4px 8px', borderRadius: '8px' }}>
                              {onlineCount} Online
                            </span>
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                className="table-action-btn" 
                                style={{ 
                                  background: room.isAttendanceActive ? '#FEF2F2' : '#ECFDF5', 
                                  color: room.isAttendanceActive ? '#EF4444' : '#10B981' 
                                }}
                                onClick={(e) => toggleAttendance(e, key)}
                              >
                                {room.isAttendanceActive ? 'Nonaktifkan' : 'Aktifkan Presensi'}
                              </button>
                              <button 
                                className="table-action-btn" 
                                style={{ background: '#F4F4F5', color: '#4B4B4B' }}
                                onClick={() => { setEditClassName(room.name); setShowEditModal(key); }}
                              >
                                Edit
                              </button>
                              <button 
                                className="table-action-btn" 
                                style={{ background: '#FEF2F2', color: '#EF4444' }}
                                onClick={() => {
                                  if (confirm(`Apakah Anda yakin ingin menghapus ${room.name}?`)) {
                                    const nextState = { ...classroomsState };
                                    delete nextState[key];
                                    setClassroomsState(nextState);
                                  }
                                }}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* MOBILE VIEW */}
          <div className="classroom-selection-mobile mobile-only" style={{ paddingBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', margin: '0 0 4px 0', color: 'var(--text-color)' }}>Daftar Kelas</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Kelola progres murid Anda.</p>
            </div>
            
            <button 
              onClick={() => { setNewClassName(''); setShowAddModal(true); }}
              style={{ width: '100%', padding: '14px', background: '#10B981', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '20px', boxShadow: '0 4px 0 #059669', cursor: 'pointer' }}
            >
              <Plus size={20} /> Tambah Kelas Baru
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {classroomKeys.map((key) => {
                const room = classroomsState[key];
                const roomStudents = room.students || [];
                const onlineCount = roomStudents.filter(s => s.isOnline).length;
                return (
                  <div key={key} onClick={() => setSelectedClassroom(key)} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '16px', border: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 0 var(--border-color)', cursor: 'pointer' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-color)' }}>{room.name}</h3>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{roomStudents.length} Murid</span>
                        <span style={{ color: '#10B981' }}>{onlineCount} Online</span>
                      </div>
                    </div>
                    <ChevronRight size={24} color="var(--border-color)" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // TINGKAT 2: Daftar Murid di dalam Kelas Terpilih
        <div className="card-box">
          {/* DESKTOP HEADER */}
          <div className="card-box-header flex-between desktop-only">
            <div>
              <button 
                className="back-to-classes-btn"
                onClick={() => setSelectedClassroom(null)}
              >
                Kembali ke Daftar Kelas
              </button>
              <h2 style={{ marginTop: '15px' }}>Daftar Murid: {activeClassroom?.name}</h2>
              <p>Memantau keaktifan, total mahkota, dan total Bintang murid di {activeClassroom?.name}.</p>
            </div>
            <button 
              className="add-class-btn-header"
              onClick={() => setShowAddStudentModal(true)}
            >
              <Plus size={18} />
              <span>Tambah Murid</span>
            </button>
          </div>

          {/* MOBILE HEADER (Action Bar Style) */}
          <div className="mobile-action-bar mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '2px solid var(--border-color)', marginBottom: '16px' }}>
            <button 
              onClick={() => setSelectedClassroom(null)}
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--border-color)', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-color)', padding: 0, cursor: 'pointer', flexShrink: 0 }}
            >
              <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--text-color)' }}>{activeClassroom?.name}</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sortedStudents.length} Murid</p>
            </div>
            <button 
              onClick={() => setShowAddStudentModal(true)}
              style={{ marginLeft: 'auto', background: '#10B981', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 12px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', boxShadow: '0 3px 0 #059669' }}
            >
              <Plus size={16} /> Murid
            </button>
          </div>

          {/* KODE AKSES KELAS (Responsive) */}
          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#0284C7' }}>Kode Akses Kelas</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#0369A1' }}>Bagikan kode ini ke siswa untuk bergabung ke kelas {activeClassroom?.name}.</p>
            </div>
            <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: '900', fontSize: '1.1rem', color: '#0284C7', border: '2px dashed #7DD3FC', letterSpacing: '2px' }}>
              LMS-5A-DEV
            </div>
          </div>

          {/* DESKTOP VIEW - Table representation */}
          <div className="table-responsive desktop-only">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Nama Murid{renderSortIndicator('name')}
                  </th>
                  <th onClick={() => handleSort('nis')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    NIS/NISN{renderSortIndicator('nis')}
                  </th>
                  <th onClick={() => handleSort('id_akun')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    ID Akun{renderSortIndicator('id_akun')}
                  </th>
                  <th onClick={() => handleSort('keaktifan')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Status Keaktifan{renderSortIndicator('keaktifan')}
                  </th>
                  <th onClick={() => handleSort('tugas')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Status Tugas{renderSortIndicator('tugas')}
                  </th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student) => {
                  const { mockNIS, mockID, isOnline, hasFinishedTask } = student;

                  return (
                    <tr key={student.id}>
                      <td className="student-name-cell">
                        <div className="student-avatar-small" style={{ fontSize: '0.85rem', fontWeight: '800', background: 'var(--border-color)', color: '#3B82F6', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <span>{student.name}</span>
                      </td>
                      <td><span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{mockNIS}</span></td>
                      <td><span style={{ color: '#1CB0F6', fontWeight: '800' }}>{mockID}</span></td>
                      <td>
                        <span className="level-badge" style={{ 
                          background: isOnline ? '#ECFDF5' : '#FEF2F2', 
                          color: isOnline ? '#10B981' : '#EF4444',
                          fontWeight: '800' 
                        }}>
                          {isOnline ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', color: hasFinishedTask ? '#10B981' : '#EF4444' }}>
                        {hasFinishedTask ? 'Selesai' : 'Belum Selesai'}
                      </td>
                      <td>
                        <button className="table-action-btn" onClick={() => handleOpenStudentDetail(student)}>Detail</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW - Beautiful card grid for Android */}
          <div className="student-cards-mobile mobile-only">
            {sortedStudents.map((student) => {
              const { mockNIS, mockID, isOnline, hasFinishedTask } = student;

              return (
                <div 
                  key={student.id} 
                  className="mobile-student-card"
                  onClick={() => handleOpenStudentDetail(student)}
                >
                  <div className="card-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="mobile-student-avatar-circle" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '800' }}>
                      {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="mobile-student-info">
                      <h4>{student.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: '600' }}>
                        NIS: {mockNIS} | ID: {mockID}
                      </div>
                      <div className="mobile-badges-row">
                        <span className={`mobile-pill-badge ${isOnline ? 'green-badge' : 'red-badge'}`}>
                          {isOnline ? 'Online' : 'Offline'}
                        </span>
                        <span className={`mobile-pill-badge ${hasFinishedTask ? 'orange-badge' : 'red-badge'}`}>
                          {hasFinishedTask ? 'Selesai' : 'Belum'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-right">
                    <ChevronRight size={18} color="#AFAFAF" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
