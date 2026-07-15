import React from 'react';
import { BookOpen, Sparkles, Target } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { getModulePathData } from '../../../data/modules/sifat-cahaya';

export default function ModuleInfoPanel() {
  const { unlockedNodes = [] } = useStore();
  const pathData = getModulePathData('cahaya');
  
  const unlockedCount = pathData.filter(node => unlockedNodes.includes(node.id)).length;
  const totalToUnlock = pathData.filter(node => !node.isUnlockedByDefault).length;
  const progressPercent = totalToUnlock === 0 ? 0 : Math.min(100, Math.round((unlockedCount / totalToUnlock) * 100));

  return (
    <div className="module-info-panel" style={{ padding: '20px', fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#1CB0F6', padding: '12px', borderRadius: '14px', color: 'white', boxShadow: '0 4px 0 #1899D6' }}>
          <BookOpen size={24} />
        </div>
        <h2 style={{ margin: 0, color: 'var(--text-color)', fontWeight: 900, fontSize: '1.4rem' }}>Sifat Cahaya</h2>
      </div>

      {/* Progress Section */}
      <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '16px', border: '2px solid var(--border-color)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="#f4c265" />
            <span style={{ fontWeight: 800, color: 'var(--text-color)' }}>Progres Modul</span>
          </div>
          <span style={{ fontWeight: 900, color: '#1CB0F6' }}>{progressPercent}%</span>
        </div>
        <div style={{ height: '16px', background: 'var(--background-color)', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--border-color)' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: '#58CC02', transition: 'width 0.5s ease-out' }} />
        </div>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>
          {progressPercent === 100 ? 'Luar biasa! Modul selesai! 🎉' : 'Ayo selesaikan semua tantangan!'}
        </p>
      </div>
      
      <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '16px', border: '2px solid var(--border-color)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#1CB0F6' }}>
          <Sparkles size={100} />
        </div>
        <h3 style={{ marginTop: 0, color: 'var(--text-color)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '12px' }}>Tentang Pelajaran Ini</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0, fontWeight: 500, position: 'relative', zIndex: 1 }}>
          Dalam modul ini, kamu akan berpetualang dan mempelajari berbagai keajaiban cahaya! Mulai dari bagaimana cahaya <strong style={{ color: '#f4c265' }}>merambat lurus</strong>, kemampuannya <strong style={{ color: '#58CC02' }}>menembus benda bening</strong>, hingga proses cahaya <strong style={{ color: '#CE82FF' }}>dipantulkan</strong> dan <strong style={{ color: '#FF4B4B' }}>dibiaskan</strong>.
          <br /><br />
          Selesaikan materi, jawab kuisnya dengan benar, dan buktikan bahwa kamu adalah ilmuwan sejati! 🌟
        </p>
      </div>
    </div>
  );
}
