import React from 'react';

const ACHIEVEMENTS = [
  { id: 1, title: 'Pembaca Cepat', icon: '⚡', color: '#f4c265' },
  { id: 2, title: 'Si Paling Tepat', icon: '🎯', color: '#58cc02' },
  { id: 3, title: 'Pejuang Tangguh', icon: '🛡️', color: '#1cb0f6' },
  { id: 4, title: 'Penjelajah Peta', icon: '🗺️', color: '#9333ea' },
];

export default function AchievementBadge() {
  return (
    <div className="achievement-section-card">
      <h3 className="section-title">Medali Pencapaian</h3>
      <div className="badge-list-fun">
        {ACHIEVEMENTS.map(ach => (
          <div key={ach.id} className="badge-item-fun">
            <div className="badge-medal" style={{ '--color': ach.color }}>
              <div className="medal-ring">
                <span className="medal-emoji">{ach.icon}</span>
              </div>
            </div>
            <span className="badge-label">{ach.title}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .achievement-section-card {
          background: var(--card-bg); border-radius: 28px; padding: 22px;
          border: 3px solid var(--border-color); border-bottom-width: 8px;
        }
        .section-title { font-weight: 950; font-size: 1.2rem; color: var(--text-color); margin: 0 0 20px 0; }
        .badge-list-fun { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: none; }
        .badge-list-fun::-webkit-scrollbar { display: none; }

        .badge-item-fun { display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 85px; }
        
        .badge-medal {
          width: 68px; height: 68px; background: var(--color); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative; 
          border: 3px solid var(--border-color);
          box-shadow: 0 5px 0 var(--border-color), 0 8px 16px rgba(0,0,0,0.06);
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
        .medal-ring {
          width: 52px; height: 52px; border: 3px dashed rgba(255,255,255,0.45);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }
        .medal-emoji { font-size: 1.9rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15)); }
        
        .badge-label { font-weight: 900; font-size: 0.75rem; color: var(--text-muted); text-align: center; line-height: 1.25; }
        
        .badge-item-fun:hover .badge-medal {
          transform: scale(1.08) translateY(-4px);
          box-shadow: 0 9px 0 var(--border-color), 0 12px 20px rgba(0,0,0,0.1);
        }
        .badge-item-fun:active .badge-medal {
          transform: translateY(2px);
          box-shadow: 0 3px 0 var(--border-color);
        }
        .badge-item-fun:hover .badge-label {
          color: var(--text-color);
        }
      `}</style>
    </div>
  );
}
