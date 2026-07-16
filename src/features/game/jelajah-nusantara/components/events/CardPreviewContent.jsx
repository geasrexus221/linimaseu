import React from 'react';
import { Heart } from 'lucide-react';

export default function CardPreviewContent({ card }) {
  if (!card) return null;

  return (
    <div className="card-preview-container">
      <div className="preview-card">
        
        <div className="card-cost">
          <Heart size={12} fill="#FF4B4B" color="#FF4B4B" />
          <span>{card.cost}</span>
        </div>

        
        <div className="card-illustration" style={{ background: `linear-gradient(135deg, ${card.color}, rgba(255,255,255,0.35))` }}>
          <div className="card-icon">{card.icon}</div>
        </div>

        
        <div className="card-name-banner">
          {card.name}
        </div>

        
        <div className="card-desc-box">
          <p className="card-desc-text">{card.description}</p>
        </div>
      </div>

      <style jsx>{`
        .card-preview-container {
          display: flex; justify-content: center; padding: 10px 0;
          perspective: 1000px;
        }
        .preview-card {
          width: 220px; height: 320px; border-radius: 24px;
          display: flex; flex-direction: column; overflow: hidden;
          background: #FFF7E6; /* Cream card background */
          border: 6px solid #5E3A24; /* Thick brown border */
          box-shadow: 0 15px 40px rgba(0,0,0,0.5), 0 4px 0 #3A2315;
          position: relative;
          animation: cardPop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.1);
        }
        .card-cost {
          position: absolute; top: 12px; right: 12px; background: white;
          border: 2.5px solid #5E3A24; border-radius: 12px;
          height: 26px; padding: 0 8px; display: flex; align-items: center; justify-content: center; gap: 4px;
          font-size: 0.82rem; font-weight: 950; color: #5E3A24;
          box-shadow: 0 3px 0 rgba(0,0,0,0.15); z-index: 10;
        }
        .card-illustration {
          margin: 12px 12px 6px 12px;
          height: 120px; border-radius: 12px;
          border: 3.5px solid #5E3A24;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          box-shadow: inset 0 4px 10px rgba(0,0,0,0.15);
        }
        .card-icon { font-size: 3.5rem; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.25)); }
        
        .card-name-banner {
          background: white; border: 3.5px solid #5E3A24;
          margin: 4px 12px; padding: 6px; text-align: center;
          border-radius: 10px; font-weight: 950; font-size: 0.82rem;
          color: #3E2723; text-transform: uppercase;
          box-shadow: 0 3px 0 rgba(0,0,0,0.1);
        }
        .card-desc-box {
          background: #FAF4D0; border: 3.5px solid #5E3A24;
          margin: 4px 12px 12px 12px; padding: 10px;
          border-radius: 12px; flex: 1; display: flex;
          align-items: center; justify-content: center;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
        }
        .card-desc-text {
          margin: 0; font-size: 0.72rem; color: #4E342E;
          line-height: 1.4; font-weight: 800; text-align: center;
        }

        @keyframes cardPop {
          0% { transform: scale(0.4) rotateY(-30deg) translateY(40px); opacity: 0; }
          100% { transform: scale(1) rotateY(0) translateY(0); opacity: 1; }
        }

        @media (max-height: 500px) {
          .preview-card { width: 300px; height: 160px; flex-direction: row; border-radius: 20px; }
          .card-illustration { width: 42%; height: calc(100% - 24px); margin: 12px; }
          .card-desc-box { margin: 4px 12px 12px 12px; }
        }
      `}</style>
    </div>
  );
}
