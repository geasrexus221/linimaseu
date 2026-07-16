import React from 'react';
import { Star, Crown } from 'lucide-react';
import { useStore } from '../../../store/useStore';

export default function CurrencyHeader() {
  const { stars, streak } = useStore(); 

  return (
    <div className="currency-header-box">
      <div className="currency-pill star-3d">
        <div className="pill-icon">
          <Star size={18} fill="#FFD700" color="#FFD700" />
        </div>
        <span className="pill-value">{stars}</span>
        <div className="pill-plus">+</div>
      </div>

      <div className="currency-pill torch-3d">
        <div className="pill-icon">
          <div className="mini-flame">🔥</div>
        </div>
        <span className="pill-value">{streak}</span>
        <div className="pill-plus">+</div>
      </div>

      <style jsx>{`
        .currency-header-box {
          display: flex; justify-content: center; gap: 15px;
          padding: 15px 20px; background: var(--card-bg); border-bottom: 2px solid var(--border-color);
          position: sticky; top: 0; z-index: 100;
        }
        .currency-pill {
          background: var(--background-color); border-radius: 50px; border: 2px solid var(--border-color);
          padding: 4px 12px 4px 6px; display: flex; align-items: center; gap: 8px;
          min-width: 90px; position: relative; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }
        .pill-icon {
          width: 30px; height: 30px; background: var(--card-bg); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1); border: 1.5px solid var(--border-color);
        }
        .pill-value { font-weight: 900; font-size: 1rem; color: var(--text-color); }
        .pill-plus {
          position: absolute; right: -8px; width: 18px; height: 18px;
          background: var(--accent-color); border-radius: 50%; color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 900; border: 2px solid var(--card-bg);
        }
        .mini-flame { font-size: 1.1rem; filter: drop-shadow(0 2px 2px rgba(255,150,0,0.3)); }
        
        .star-3d .pill-value { color: var(--primary-color); }
        .torch-3d .pill-value { color: #FF4B4B; }
      `}</style>
    </div>
  );
}
