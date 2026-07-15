import React from 'react';
import { soundEngine } from '../../logic/soundEngine';

export default function DuelThemeSelectionContent({ themes, onSelect }) {
  return (
    <div className="theme-selection">
      {/* Category selection banner */}
      <div className="theme-selection-banner">
        💡 <strong>Kategori Duel:</strong> Pilih topik paling sulit agar peluang lawan menjawab salah lebih besar!
      </div>

      <div className="themes-grid">
        {themes.map(theme => (
          <button 
            key={theme.id} 
            className="theme-card" 
            onClick={() => { soundEngine.playSound('click'); onSelect(theme); }}
            style={{ '--theme-color': theme.color }}
          >
            <div className="theme-icon">{theme.icon}</div>
            <div className="theme-name">{theme.name}</div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .theme-selection { padding: 10px 0; font-family: 'Outfit', sans-serif; }
        .theme-selection-banner {
          background: #E0F2FE; border: 2px solid #BAE6FD; border-radius: 16px;
          padding: 12px 16px; color: #0284C7; font-size: 0.8rem; font-weight: 800;
          margin-bottom: 15px; text-align: left; line-height: 1.45;
        }
        .theme-selection-banner strong { color: #0369A1; font-weight: 950; }
        .themes-grid { display: flex; flex-direction: column; gap: 12px; }
        
        .theme-card {
          width: 100%; padding: 20px; border-radius: 20px;
          background: #222; border: 2px solid #333;
          display: flex; align-items: center; gap: 20px;
          color: white; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 5px 0 #111;
        }
        .theme-card:hover { border-color: var(--theme-color); transform: scale(1.02); }
        .theme-card:active { transform: translateY(3px); box-shadow: 0 2px 0 #111; }

        .theme-icon { 
          font-size: 2rem; width: 60px; height: 60px; 
          background: rgba(255,255,255,0.05); border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--theme-color);
        }
        .theme-name { font-weight: 900; font-size: 1.1rem; letter-spacing: 0.5px; }

        @media (max-height: 500px) {
          .themes-grid { flex-direction: row; }
          .theme-card { flex-direction: column; gap: 8px; padding: 10px; height: 110px; flex: 1; }
          .theme-icon { width: 45px; height: 45px; font-size: 1.5rem; }
          .theme-name { font-size: 0.75rem; text-align: center; }
        }
      `}</style>
    </div>
  );
}
