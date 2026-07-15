import React from 'react';
import { Swords } from 'lucide-react';
import Dice3D from '../../../../../components/common/Dice3D';
import { useStore } from '../../../../../store/useStore';

import character1podium1 from '../../../../../assets/UI/Character/character1podium1.svg';
import character2podium1 from '../../../../../assets/UI/Character/character2podium1.svg';
import character1podium5 from '../../../../../assets/UI/Character/character1podium5.svg';
import character2podium5 from '../../../../../assets/UI/Character/character2podium5.svg';
import character1podium2 from '../../../../../assets/UI/Character/character1podium2.svg';
import character2podium2 from '../../../../../assets/UI/Character/character2podium2.svg';
import character1podium3 from '../../../../../assets/UI/Character/character1podium3.svg';
import character2podium3 from '../../../../../assets/UI/Character/character2podium3.svg';

export default function BattleContent({ player, guardian, playerRoll, isRolling, isPending, onRoll, loser }) {
  const theme = useStore(state => state.theme);
  const isDark = theme === 'dark';

  const getPlayerSprite = () => {
    const charId = player?.characterId || 1;
    if (isRolling) {
      return charId === 2 ? character2podium5 : character1podium5;
    }
    if (loser === 'guardian') {
      return charId === 2 ? character2podium2 : character1podium2;
    }
    if (loser === 'player') {
      return charId === 2 ? character2podium3 : character1podium3;
    }
    return charId === 2 ? character2podium1 : character1podium1;
  };

  return (
    <div className="battle-container">
      <div className="battle-stats">
        {/* PLAYER SIDE (LEFT) */}
        <div className={`stat-column player ${loser === 'player' ? 'defeated' : ''}`}>
          <div className="player-wrapper">
            <img src={getPlayerSprite()} alt="Player" className="player-podium-sprite" />
          </div>
          <span className="side-label">KAMU</span>
        </div>

        {/* CENTER COLUMN (DICE / VS) */}
        <div className="center-column">
          <div className="vs-badge">VS</div>
          <div className="battle-dice-container">
            {(playerRoll || isRolling) ? (
              <Dice3D value={playerRoll || 1} isRolling={isRolling} size={64} />
            ) : (
              <div className="dice-placeholder">?</div>
            )}
          </div>
        </div>

        {/* GUARDIAN SIDE (RIGHT) */}
        <div className={`stat-column guardian ${loser === 'guardian' ? 'defeated' : ''}`}>
           <div className="battle-avatar-wrapper guardian-avatar">
             <span className="avatar-emoji">{guardian.emoji || '👹'}</span>
             <div className="power-badge" title="Target Kekuatan">{guardian.power}</div>
           </div>
           <span className="side-label">PENJAGA</span>
        </div>
      </div>

      <div className="battle-target-hint">
        Dapatkan angka dadu <strong>lebih besar dari {guardian.power}</strong> untuk mengalahkan Penjaga!
      </div>
      
      {(isPending || isRolling) && (
        <div className="battle-actions">
          {isPending && !isRolling && (
            <button className="battle-roll-btn" onClick={onRoll}>
                <Swords size={20} /> SERANG!
            </button>
          )}
          
          {isRolling && (
            <button className="battle-roll-btn disabled" disabled>
                MENUNGGU HASIL...
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .battle-container { margin-top: 10px; text-align: center; }
        .battle-actions { min-height: 50px; display: flex; align-items: center; justify-content: center; margin-top: 8px; }
        .battle-stats { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 12px; }
        
        .stat-column { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; }
        
        .player-wrapper {
          width: 100px; height: 100px;
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .player-podium-sprite {
          width: 100%; height: 100%; object-fit: contain;
          animation: idlePulse 2s ease-in-out infinite alternate;
        }

        .battle-avatar-wrapper {
          position: relative; width: 100px; height: 100px;
          background: ${isDark ? '#333' : '#F0F0F0'}; border-radius: 24px;
          border: 4px solid ${isDark ? '#444' : '#E5E5E5'};
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 0 ${isDark ? '#222' : '#E5E5E5'};
          transition: all 0.3s;
          overflow: visible !important; /* Force overflow visible so badge isn't cut off */
        }

        .center-column {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 8px; width: 80px; z-index: 10;
        }

        .battle-dice-container {
          width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;
        }

        .dice-placeholder {
          width: 52px; height: 52px; display: flex; align-items: center; justify-content: center;
          background: ${isDark ? '#111' : '#EEE'}; border-radius: 14px;
          color: ${isDark ? '#555' : '#999'}; font-size: 1.5rem; font-weight: 950;
          border: 3.5px dashed ${isDark ? '#333' : '#CCC'};
        }

        .battle-target-hint {
          background: ${isDark ? '#221A0F' : '#FFF9EB'};
          border: 2px solid ${isDark ? '#4A3319' : '#FCD34D'};
          color: ${isDark ? '#F59E0B' : '#B45309'};
          padding: 8px 12px; border-radius: 12px; font-size: 0.78rem; font-weight: 800;
          margin-bottom: 12px; text-align: center;
        }
        .battle-target-hint strong {
          color: #EF4444; font-weight: 950;
        }

        @keyframes idlePulse {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }

        @media (max-width: 600px) {
          .battle-avatar-wrapper, .player-wrapper { width: 75px !important; height: 75px !important; border-radius: 18px !important; }
          .avatar-emoji { font-size: 2.5rem !important; }
          .power-badge { width: 30px !important; height: 30px !important; font-size: 1rem !important; }
          .battle-roll-btn { padding: 12px !important; font-size: 0.9rem !important; }
          .vs-badge { width: 30px !important; height: 20px !important; font-size: 0.75rem !important; }
          .battle-target-hint { font-size: 0.7rem !important; padding: 6px 10px !important; }
          .center-column { width: 64px !important; }
        }

        @media (max-height: 500px) {
          .battle-avatar-wrapper, .player-wrapper { width: 60px !important; height: 60px !important; border-radius: 16px !important; box-shadow: 0 4px 0 ${isDark ? '#222' : '#E5E5E5'} !important; }
          .avatar-emoji { font-size: 2rem !important; }
          .power-badge { width: 28px !important; height: 28px !important; font-size: 0.9rem !important; top: -6px !important; right: -6px !important; }
          .vs-badge { width: 26px !important; height: 18px !important; font-size: 0.65rem !important; }
          .battle-stats { gap: 8px !important; margin-bottom: 8px !important; }
          .battle-roll-btn { padding: 10px !important; font-size: 0.8rem !important; border-radius: 10px !important; }
          .battle-target-hint { font-size: 0.68rem !important; margin-bottom: 8px !important; }
        }
        
        .battle-avatar-wrapper.guardian-avatar {
          background: linear-gradient(135deg, #FF4B4B, #D33131) !important;
          border-color: #FFF !important;
          box-shadow: 0 8px 0 #A82828 !important;
          overflow: visible !important;
        }
        
        .avatar-emoji { font-size: 3.5rem; }
        
        .power-badge {
          position: absolute; top: -10px; right: -10px;
          background: #FFD700; color: #000; font-weight: 900; font-size: 1.2rem;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 3px solid #FFF; box-shadow: 0 4px 0 #B8860B;
          z-index: 15 !important; /* Ensure it stays above cards */
        }
        
        .side-label { font-size: 0.7rem; font-weight: 900; color: ${isDark ? '#777' : '#AFAFAF'}; text-transform: uppercase; letter-spacing: 1px; }

        .vs-badge { 
          font-size: 0.8rem; font-weight: 950; color: white;
          background: #2B2B2B; padding: 2px 8px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          border: 2.5px solid #3C3C3C; box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        }
        
        /* ANIMATION CLASS */
        .defeated { animation: hitDefeat 1s forwards; }
        
        @keyframes hitDefeat {
          0% { transform: translateX(0); filter: none; }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
          100% { 
            transform: translateX(0); 
            filter: sepia(1) saturate(10) hue-rotate(-50deg) brightness(0.7); 
            opacity: 0.4;
          }
        }

        .battle-roll-btn {
          width: 100%; padding: 14px; border-radius: 16px; 
          background: linear-gradient(to bottom, #FF4B4B, #D33131);
          border: none; color: white; font-weight: 900; font-size: 1rem; cursor: pointer;
          box-shadow: 0 5px 0 #A82828, 0 8px 16px rgba(255, 75, 75, 0.3); 
          transition: all 0.1s; display: flex; align-items: center; justify-content: center; gap: 12px;
          text-transform: uppercase; letter-spacing: 1.5px;
        }
        .battle-roll-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #A82828; }
        .battle-roll-btn.disabled { 
          background: #444; box-shadow: 0 3px 0 #222; opacity: 0.6; cursor: not-allowed;
          animation: pulseStatus 2s infinite;
        }
        @keyframes pulseStatus { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
