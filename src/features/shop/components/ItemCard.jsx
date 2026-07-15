import React from 'react';
import { Check } from 'lucide-react';

export default function ItemCard({ item, onBuy, isOwned }) {
  const { name, price, icon, color, rarity } = item;

  // Determine card header background based on rarity or custom color
  const headerBg = rarity === 'epic' ? '#FFD700' : rarity === 'rare' ? '#1CB0F6' : color || '#f4c265';
  const shadowBg = rarity === 'epic' ? '#D97706' : rarity === 'rare' ? '#1485BA' : '#d1a34b';

  // Cute corner badge for premium or cheap items
  const showBadge = null;

  return (
    <div className={`shop-item-card-ref ${rarity || 'common'}`} style={{ '--accent-color': headerBg }}>
      {showBadge && <div className="card-ribbon-badge">{showBadge}</div>}
      
      <div className="card-header-bar" style={{ backgroundColor: headerBg, borderBottomColor: shadowBg }}>
        {name.toUpperCase()}
      </div>

      <div className="card-body-content">
        <div className="icon-spotlight-wrapper">
          <span className="item-emoji-display">{icon}</span>
        </div>

        <div className="item-price-tag">
          {isOwned ? 'DIPEROLEH' : 'HARGA BARANG'}
        </div>

        <button 
          className={`buy-chunky-btn ${isOwned ? 'owned' : ''}`}
          onClick={() => !isOwned && onBuy(item)}
          disabled={isOwned}
        >
          <div className="btn-face-chunky">
            {isOwned ? (
              <div className="owned-status">
                <Check size={18} strokeWidth={4} />
                <span>MILIK</span>
              </div>
            ) : (
              <div className="price-display">
                <span>{price}</span>
                <span className="star-inline">⭐</span>
              </div>
            )}
          </div>
          <div className="btn-bottom-chunky"></div>
        </button>
      </div>

      <style jsx>{`
        .shop-item-card-ref {
          background: var(--card-bg);
          border: 3px solid var(--border-color);
          border-bottom-width: 6px;
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          transition: transform 0.15s, border-color 0.2s;
        }
        .shop-item-card-ref:hover {
          transform: translateY(-5px);
          border-color: var(--accent-color);
        }
        
        .card-ribbon-badge {
          position: absolute;
          top: 15px;
          right: -25px;
          background: #FF4B4B;
          color: white;
          font-weight: 900;
          font-size: 0.55rem;
          padding: 4px 24px;
          transform: rotate(45deg);
          z-index: 5;
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
          letter-spacing: 0.5px;
        }

        .card-header-bar {
          padding: 10px 14px;
          color: white;
          font-weight: 900;
          font-size: 0.8rem;
          text-align: center;
          letter-spacing: 0.5px;
          border-bottom: 4px solid;
          text-shadow: 0 1.5px 0 rgba(0,0,0,0.15);
        }

        .card-body-content {
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .icon-spotlight-wrapper {
          width: 80px;
          height: 80px;
          background: var(--background-color);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          box-shadow: inset 0 3px 0 rgba(0,0,0,0.02);
          transition: transform 0.2s;
        }
        .shop-item-card-ref:hover .icon-spotlight-wrapper {
          transform: scale(1.08) rotate(-3deg);
        }

        .item-emoji-display {
          font-size: 2.8rem;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }

        .item-price-tag {
          font-weight: 900;
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .buy-chunky-btn {
          position: relative;
          width: 100%;
          height: 42px;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .btn-face-chunky {
          position: absolute;
          inset: 0;
          background: #58CC02;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          font-size: 0.95rem;
          z-index: 2;
          transition: transform 0.1s;
          border: 1.5px solid rgba(255,255,255,0.1);
        }
        .btn-bottom-chunky {
          position: absolute;
          inset: 0;
          bottom: -5px;
          background: #46A302;
          border-radius: 14px;
          z-index: 1;
          transition: bottom 0.1s;
        }

        .price-display {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .star-inline {
          font-size: 0.95rem;
        }

        .buy-chunky-btn:hover:not(:disabled) .btn-face-chunky {
          filter: brightness(1.05);
        }

        .buy-chunky-btn:active:not(:disabled) .btn-face-chunky {
          transform: translateY(3px);
        }
        .buy-chunky-btn:active:not(:disabled) .btn-bottom-chunky {
          bottom: -2px;
        }

        .buy-chunky-btn.owned .btn-face-chunky {
          background: var(--border-color);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        .buy-chunky-btn.owned .btn-bottom-chunky {
          background: var(--border-color);
          opacity: 0.5;
        }

        .owned-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 900;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
