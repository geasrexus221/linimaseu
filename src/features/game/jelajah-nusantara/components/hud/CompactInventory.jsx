import React from 'react';
import { Zap } from 'lucide-react';
import { useGameStore } from '../../../../../store/useGameStore';
import { useStore } from '../../../../../store/useStore';

export default function CompactInventory({ inventory = [] }) {
  const { useCard, phase } = useGameStore();
  const theme = useStore(state => state.theme);
  const isDark = theme === 'dark';

  
  const slots = [0, 1, 2];

  return (
    <div className="compact-inventory-bar">
      {slots.map(i => {
        const card = inventory[i];
        return (
          <div key={i} className={`inventory-slot ${card ? 'filled' : 'empty'}`}>
            {card ? (
              <button 
                className="card-mini-btn" 
                onClick={() => useCard(card.instanceId)}
                disabled={phase !== 'WAITING_ROLL'}
                title={`${card.name} (${card.cost} Tekad): ${card.description}`}
              >
                <span className="card-emoji">{card.icon || '🃏'}</span>
                <div className="cost-badge">
                  <Zap size={8} fill="#FFD700" color="#FFD700" />
                  <span>{card.cost}</span>
                </div>
              </button>
            ) : (
              <div className="slot-placeholder" />
            )}
          </div>
        );
      })}

      <style jsx>{`
        .compact-inventory-bar {
          display: flex; gap: 10px; margin-top: 12px;
        }
        .inventory-slot {
          width: 44px; height: 44px; border-radius: 14px;
          border: 3px dashed ${isDark ? '#3C3C3C' : '#E5E5E5'};
          background: ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)'}; 
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          position: relative;
        }
        .inventory-slot.filled {
          border: 3px solid #58CC02; background: ${isDark ? '#2B2B2B' : '#FFF'}; 
          border-style: solid;
          box-shadow: 0 4px 12px rgba(88, 204, 2, 0.3), 0 4px 0 #46A302;
          cursor: pointer;
        }
        .inventory-slot.filled:hover { transform: translateY(-4px); }
        
        .card-mini-btn {
          width: 100%; height: 100%; background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
          padding: 0; transition: transform 0.1s;
        }
        .card-mini-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .cost-badge {
          position: absolute; bottom: -4px; right: -4px;
          background: #2B2B2B; border: 1.5px solid #FFD700;
          border-radius: 6px; padding: 1px 4px;
          display: flex; align-items: center; gap: 2px;
          font-size: 0.55rem; color: #FFD700; font-weight: 900;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .slot-placeholder { width: 12px; height: 12px; border-radius: 50%; background: ${isDark ? '#3C3C3C' : '#E5E5E5'}; }
      `}</style>
    </div>
  );
}
