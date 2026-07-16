import React, { useEffect } from 'react';
import { useGameStore } from '../../../../../store/useGameStore';

import character1podium1 from '../../../../../assets/UI/Character/character1podium1.svg';
import character2podium1 from '../../../../../assets/UI/Character/character2podium1.svg';

export default function DuelTargetSelectionContent({ onSelectTarget }) {
  const players = useGameStore(state => state.players);
  const turnIdx = useGameStore(state => state.turnIdx);
  const activeEvent = useGameStore(state => state.activeEvent);

  const challenger = players[turnIdx];

  const getChallengerSprite = () => {
    const charId = challenger?.characterId || 1;
    return charId === 2 ? character2podium1 : character1podium1;
  };

  
  useEffect(() => {
    if (challenger?.type === 'ai') {
      const timer = setTimeout(() => {
        const choice = Math.random() < 0.5 ? 'koin' : 'tekad';
        onSelectTarget(choice);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [challenger, onSelectTarget]);

  if (!challenger) return null;

  return (
    <div className="orange-juice-duel">
      
      <div className="duel-header-retro">
        <div className="action-banner announce-banner">
          {challenger.type === 'ai' 
            ? `🤖 PENANTANG AI SEDANG MEMILIH...` 
            : `👉 PILIH TARGET DUEL: ${challenger.name.toUpperCase()}!`
          }
        </div>
      </div>

      
      <div className="defense-select-view">
        {challenger.type === 'ai' ? (
          <div className="ai-thinking-box">
            <p>🤖 Penantang sedang memilih target kemenangan...</p>
          </div>
        ) : (
          <>
            <div className="defender-centered-card">
              <div className="fighter-name-label">{challenger.name}</div>
              <div className="sprite-flip-wrapper">
                <img src={getChallengerSprite()} alt={challenger.name} className="fighter-sprite-retro" />
              </div>
            </div>

            <div className="strategy-buttons">
              <button className="strategy-btn btn-evade" onClick={() => onSelectTarget('koin')}>
                REBUT KOIN
              </button>
              <button className="strategy-btn btn-defend" onClick={() => onSelectTarget('tekad')}>
                SERANG TEKAD
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .orange-juice-duel {
          display: flex;
          flex-direction: column;
          border: 4px solid #4A2E10;
          border-radius: 20px;
          overflow: hidden;
          background: white;
          box-shadow: 0 8px 0 #4A2E10;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          font-family: 'Outfit', sans-serif;
        }
        .duel-header-retro {
          background: #4A2E10;
          padding: 6px;
          display: flex;
          justify-content: center;
        }
        .action-banner {
          font-size: 0.65rem;
          font-weight: 950;
          color: white;
          padding: 4px 12px;
          border-radius: 8px;
          text-align: center;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .announce-banner {
          background: #3B82F6;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        .defense-select-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 190px;
          padding: 12px;
          gap: 14px;
          background-image: radial-gradient(#FFECE0 20%, transparent 20%),
                            radial-gradient(#FFECE0 20%, transparent 20%);
          background-size: 16px 16px;
          background-position: 0 0, 8px 8px;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .defender-centered-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .fighter-name-label {
          font-size: 0.7rem;
          font-weight: 950;
          color: #4A2E10;
          background: white;
          border: 2.5px solid #4A2E10;
          padding: 2px 8px;
          border-radius: 8px;
          box-shadow: 0 2px 0 #4A2E10;
          margin-bottom: 6px;
          text-align: center;
          white-space: nowrap;
          z-index: 2;
        }
        .sprite-flip-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fighter-sprite-retro {
          width: 90px;
          height: 90px;
          object-fit: contain;
          animation: idlePulse 2s ease-in-out infinite alternate;
        }
        @keyframes idlePulse {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }

        .strategy-buttons {
          display: flex;
          gap: 8px;
        }
        .strategy-btn {
          border: none;
          padding: 8px 12px;
          border-radius: 10px;
          font-weight: 950;
          font-size: 0.72rem;
          cursor: pointer;
          color: white;
          transition: transform 0.1s;
          box-shadow: 0 3px 0 #4A2E10;
          white-space: nowrap;
        }
        .strategy-btn:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #4A2E10;
        }
        .btn-defend {
          background: #10B981;
        }
        .btn-evade {
          background: #F59E0B;
        }

        .ai-thinking-box {
          background: rgba(0,0,0,0.05);
          padding: 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.82rem;
          color: #555;
          text-align: center;
        }

        @media (max-width: 600px) {
          .defense-select-view { height: 170px; padding: 10px; }
          .fighter-sprite-retro { width: 70px; height: 70px; }
        }
      `}</style>
    </div>
  );
}
