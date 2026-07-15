import React from 'react';

export default function DiscardCardContent({ currentInventory, newCard, onDiscard }) {
  const allCards = [...currentInventory, newCard];

  return (
    <div className="discard-container">
      <div className="discard-grid">
        {allCards.map((card, idx) => (
          <button key={card.instanceId} className="discard-card-item" onClick={() => onDiscard(card.instanceId)}>
            <div className="discard-card-icon">{card.icon || '🃏'}</div>
            <div className="discard-card-info">
              <span className="name">{card.name}</span>
              <span className="desc">{card.description}</span>
            </div>
            {idx === allCards.length - 1 && <div className="new-badge">BARU</div>}
            <div className="discard-overlay">BUANG</div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .discard-container { margin-top: 10px; }
        .discard-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .discard-card-item {
          display: flex; align-items: center; gap: 12px; padding: 10px;
          background: #2B2B2B; border: 2px solid #3C3C3C; border-radius: 12px;
          cursor: pointer; position: relative; text-align: left; transition: all 0.2s;
        }
        .discard-card-item:hover { border-color: #FF4B4B; transform: translateX(5px); }
        .discard-card-item:hover .discard-overlay { opacity: 1; }
        
        .discard-card-icon { font-size: 1.5rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #222; border-radius: 8px; }
        .discard-card-info { display: flex; flex-direction: column; flex: 1; }
        .discard-card-info .name { font-weight: 900; color: #FFF; font-size: 0.85rem; }
        .discard-card-info .desc { font-size: 0.7rem; color: #AFAFAF; }
        
        .new-badge {
          position: absolute; top: -5px; right: -5px; background: #1CB0F6; color: white;
          font-size: 0.6rem; font-weight: 900; padding: 2px 6px; border-radius: 6px;
        }
        
        .discard-overlay {
          position: absolute; inset: 0; background: rgba(255, 75, 75, 0.8);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 900; font-size: 0.9rem; opacity: 0;
          border-radius: 10px; transition: opacity 0.2s;
        }
      `}</style>
    </div>
  );
}
