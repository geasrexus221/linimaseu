import React from 'react';

export default function GameLogPill({ log }) {
  if (!log) return null;

  return (
    <div className="log-pill">
      <span className="log-text">{log}</span>
      
      <style>{`
        .log-pill {
          background: linear-gradient(135deg, #FEF3C7, #F3E5AB);
          padding: 10px 24px; border-radius: 50px;
          border: 2.5px dashed #8B4513;
          box-shadow: 0 3px 0 #6A3E16, 0 6px 15px rgba(106,62,22,0.25);
          pointer-events: none; max-width: 320px;
          font-family: 'Outfit', sans-serif;
        }
        .log-text {
          color: #4A2E1B; font-size: 0.9rem; font-weight: 800;
          text-align: center; display: block;
          text-shadow: 0 1px 0 rgba(255,255,255,0.5);
        }
      `}</style>
    </div>
  );
}
