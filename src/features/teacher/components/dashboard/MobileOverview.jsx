import React from 'react';
import { Plus, Bell, Calendar } from 'lucide-react';

export default function MobileOverview({
  setActiveMenu,
  setShowAnnouncementModal,
  announcements,
  setAnnouncements,
  selectedClassroom,
  setSelectedClassroom,
  classroomKeys,
  classroomsState,
  activeTaskFilter,
  setActiveTaskFilter
}) {
  return (
    <div className="mobile-only mobile-dashboard-container" style={{ paddingBottom: '20px' }}>
      
      
      {announcements.length > 0 && (
        <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', padding: '12px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Bell size={20} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#B45309', marginBottom: '4px' }}>Pengumuman Baru</div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400E', lineHeight: '1.4' }}>{announcements[0].message}</p>
          </div>
          <button onClick={() => setAnnouncements(prev => prev.filter(a => a.id !== announcements[0].id))} style={{ background: 'none', border: 'none', padding: 0 }}>
             <div style={{ background: '#FDE68A', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309', fontWeight: 'bold' }}>✕</div>
          </button>
        </div>
      )}

      
      <h3 style={{ fontSize: '1rem', margin: '0 0 12px 0', color: 'var(--text-color)' }}>Pintasan</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div onClick={() => setActiveMenu('quizzes')} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '2px solid var(--border-color)', boxShadow: '0 4px 0 var(--border-color)' }}>
          <div style={{ background: '#EEF2F6', padding: '12px', borderRadius: '50%', color: '#3B82F6' }}><Plus size={24} /></div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textAlign: 'center', color: 'var(--text-color)' }}>Buat Kuis</span>
        </div>
        <div onClick={() => setShowAnnouncementModal(true)} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '2px solid var(--border-color)', boxShadow: '0 4px 0 var(--border-color)' }}>
          <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '50%', color: '#F59E0B' }}><Bell size={24} /></div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textAlign: 'center', color: 'var(--text-color)' }}>Info Kelas</span>
        </div>
        <div onClick={() => { setActiveMenu('students'); if (!selectedClassroom && classroomKeys.length > 0) setSelectedClassroom(classroomKeys[0]); }} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '2px solid var(--border-color)', boxShadow: '0 4px 0 var(--border-color)' }}>
          <div style={{ background: '#ECFDF5', padding: '12px', borderRadius: '50%', color: '#10B981' }}><Calendar size={24} /></div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textAlign: 'center', color: 'var(--text-color)' }}>Absensi</span>
        </div>
      </div>

      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-color)' }}>Tugas & PR Berjalan</h3>
      </div>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '8px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        <button 
          onClick={() => setActiveTaskFilter('ALL')}
          style={{ scrollSnapAlign: 'start', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', border: 'none', cursor: 'pointer', background: activeTaskFilter === 'ALL' ? '#3B82F6' : 'var(--card-bg)', border: activeTaskFilter === 'ALL' ? '2px solid #3B82F6' : '2px solid var(--border-color)', color: activeTaskFilter === 'ALL' ? '#FFF' : 'var(--text-muted)' }}
        >
          Semua
        </button>
        {classroomKeys.map(key => (
          <button 
            key={key}
            onClick={() => setActiveTaskFilter(key)}
            style={{ scrollSnapAlign: 'start', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', border: 'none', cursor: 'pointer', background: activeTaskFilter === key ? '#3B82F6' : 'var(--card-bg)', border: activeTaskFilter === key ? '2px solid #3B82F6' : '2px solid var(--border-color)', color: activeTaskFilter === key ? '#FFF' : 'var(--text-muted)', whiteSpace: 'nowrap' }}
          >
            {classroomsState[key].name}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px', margin: '0 -12px', padding: '0 12px 16px 12px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        
        <div style={{ minWidth: '220px', background: 'var(--card-bg)', borderRadius: '16px', padding: '16px', border: '2px solid var(--border-color)', scrollSnapAlign: 'center', boxShadow: '0 4px 0 var(--border-color)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', color: '#10B981' }}>IPAS 1</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-color)' }}>Kuis Ekosistem</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Progress</span>
            <span style={{ color: 'var(--text-color)' }}>25/35</span>
          </div>
          <div style={{ height: '8px', background: 'var(--background-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '71%', background: '#10B981', borderRadius: '4px' }}></div>
          </div>
        </div>
        
        <div style={{ minWidth: '220px', background: 'var(--card-bg)', borderRadius: '16px', padding: '16px', border: '2px solid var(--border-color)', scrollSnapAlign: 'center', boxShadow: '0 4px 0 var(--border-color)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', color: '#3B82F6' }}>MATEMATIKA</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-color)' }}>PR Pecahan</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Progress</span>
            <span style={{ color: 'var(--text-color)' }}>22/35</span>
          </div>
          <div style={{ height: '8px', background: 'var(--background-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '62%', background: '#3B82F6', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>

      
      <h3 style={{ fontSize: '1rem', margin: '16px 0 12px 0', color: 'var(--text-color)' }}>Timeline Kelas</h3>
      <div style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '2px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 0 var(--border-color)' }}>
        
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', background: '#FEF2F2' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#991B1B' }}>Ada 3 soal esai perlu dinilai</div>
          </div>
        </div>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', background: '#FEF2F2' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#991B1B' }}>Batas waktu PR Matematika habis hari ini</div>
          </div>
        </div>
        
        
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', marginTop: '6px' }}></div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-color)' }}><strong>Budi</strong> menyelesaikan kuis IPAS</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>Baru saja</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '8px', height: '8px', background: '#F59E0B', borderRadius: '50%', marginTop: '6px' }}></div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-color)' }}><strong>Siti</strong> memulai PR Matematika</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>5 menit yang lalu</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
