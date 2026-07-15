import React from 'react';

export default function TurnOverlay({ isVisible, playerName, playerColor }) {
  if (!isVisible) return null;

  return (
    <div className="turn-overlay">
      <div className="turn-card">
        <div className="player-indicator" style={{ backgroundColor: playerColor }} />
        <div className="turn-text-group">
          <h2 className="turn-title">GILIRAN {playerName.toUpperCase()}</h2>
          <p className="turn-subtitle">Siapkan strategi terbaikmu!</p>
        </div>
      </div>

      <style>{`
        .turn-overlay {
          position: absolute; top: 6%; left: 0;
          z-index: 100; pointer-events: none; width: 100%; display: flex; justify-content: center;
        }
        .turn-card {
          background: linear-gradient(135deg, #FEF3C7, #F3E5AB);
          padding: 8px 20px; border-radius: 18px;
          border: 2.5px dashed #8B4513;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 4px 0 #6A3E16, 0 6px 20px rgba(106,62,22,0.3);
          animation: slideInDown 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-family: 'Outfit', sans-serif;
        }
        .player-indicator { 
          width: 20px; height: 20px; border-radius: 50%; 
          border: 3px solid #8B4513;
          box-shadow: 0 2px 0 #6A3E16, 0 0 8px rgba(234,179,8,0.4);
        }
        .turn-text-group { display: flex; flex-direction: column; }
        .turn-title { color: #4A2E1B; font-size: 0.85rem; font-weight: 900; margin: 0; letter-spacing: 1px; text-shadow: 0 1px 0 rgba(255,255,255,0.5); }
        .turn-subtitle { color: #8B4513; font-size: 0.65rem; font-weight: 800; margin: 0; }

        @keyframes slideInDown {
          from { transform: translateY(-120px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
