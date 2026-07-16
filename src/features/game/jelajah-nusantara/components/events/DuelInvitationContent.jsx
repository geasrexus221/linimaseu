import React from 'react';
import { Swords, ArrowRight, Shield, Zap } from 'lucide-react';
import { useGameStore } from '../../../../../store/useGameStore';
import { useStore } from '../../../../../store/useStore';
import { soundEngine } from '../../logic/soundEngine';

import character1podium1 from '../../../../../assets/UI/Character/character1podium1.svg';
import character2podium1 from '../../../../../assets/UI/Character/character2podium1.svg';

export default function DuelInvitationContent({ opponent, onChoice }) {
  const players = useGameStore(state => state.players);
  const turnIdx = useGameStore(state => state.turnIdx);
  const remainingSteps = useGameStore(state => state.remainingSteps);
  const theme = useStore(state => state.theme);
  const isDark = theme === 'dark';

  const challenger = players[turnIdx];
  const isPassing = remainingSteps > 0;

  const getChallengerSprite = () => {
    const charId = challenger?.characterId || 1;
    return charId === 2 ? character2podium1 : character1podium1;
  };

  const getOpponentSprite = () => {
    const charId = opponent?.characterId || 1;
    return charId === 2 ? character2podium1 : character1podium1;
  };

  return (
    <div className="invitation-container">
      
      <div className="faceoff-arena">
        
        <div className="faceoff-fighter">
          <div className="fighter-podium-wrapper">
            <img src={getChallengerSprite()} alt={challenger?.name} className="fighter-sprite" />
          </div>
          <div className="fighter-card-info">
            <span className="fighter-tag-title">PENANTANG</span>
            <strong>{challenger?.name}</strong>
            <div className="fighter-stats-list">
              <span className="stat-bullet">🗡️ {challenger?.stats?.serangan >= 0 ? `+${challenger.stats.serangan}` : challenger?.stats?.serangan} | 🛡️ {challenger?.stats?.pertahanan >= 0 ? `+${challenger.stats.pertahanan}` : challenger?.stats?.pertahanan} | 💨 {challenger?.stats?.kelincahan >= 0 ? `+${challenger.stats.kelincahan}` : challenger?.stats?.kelincahan}</span>
            </div>
          </div>
        </div>

        
        <div className="faceoff-vs">VS</div>

        
        <div className="faceoff-fighter">
          <div className="fighter-podium-wrapper">
            <img src={getOpponentSprite()} alt={opponent?.name} className="fighter-sprite" />
          </div>
          <div className="fighter-card-info">
            <span className="fighter-tag-title defender-tag">DITANTANG</span>
            <strong>{opponent?.name}</strong>
            <div className="fighter-stats-list">
              <span className="stat-bullet">🗡️ {opponent?.stats?.serangan >= 0 ? `+${opponent.stats.serangan}` : opponent?.stats?.serangan} | 🛡️ {opponent?.stats?.pertahanan >= 0 ? `+${opponent.stats.pertahanan}` : opponent?.stats?.pertahanan} | 💨 {opponent?.stats?.kelincahan >= 0 ? `+${opponent.stats.kelincahan}` : opponent?.stats?.kelincahan}</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="invitation-msg-card">
        <span className="notice-icon">⚔️</span>
        <p>Kamu berpapasan dengan <strong>{opponent?.name}</strong>! Ingin memulai duel karakter?</p>
      </div>

      <div className="choice-actions">
        <button className="duel-btn" onClick={() => { soundEngine.playSound('click'); onChoice('challenge'); }}>
          <Swords size={20} /> TANTANG SEKARANG!
        </button>
        <button className="ignore-btn" onClick={() => { soundEngine.playSound('click'); onChoice('ignore'); }}>
          {isPassing ? (
            <>
              <ArrowRight size={20} /> LEWAT (LANJUT LANGKAH)
            </>
          ) : (
            <>
              <ArrowRight size={20} /> DIAM DI SINI (LEWATKAN DUEL)
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .invitation-container { 
          text-align: center; 
          font-family: 'Outfit', sans-serif; 
          display: flex;
          flex-direction: column;
          gap: 15px;
          animation: fadeIn 0.4s ease;
        }

        .faceoff-arena {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: ${isDark ? '#1F2937' : '#F9FAFB'};
          border: 3.5px solid ${isDark ? '#374151' : '#E5E7EB'};
          border-radius: 24px;
          padding: 16px;
          gap: 8px;
        }

        .faceoff-fighter {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .fighter-podium-wrapper {
          width: 85px;
          height: 85px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fighter-sprite {
          width: 100%;
          height: 100%;
          object-fit: contain;
          animation: idlePulse 2.5s ease-in-out infinite alternate;
        }

        .fighter-card-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .fighter-tag-title {
          font-size: 0.58rem;
          font-weight: 900;
          color: #3B82F6;
          background: #DBEAFE;
          padding: 2px 6px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }
        .fighter-tag-title.defender-tag {
          color: #10B981;
          background: #D1FAE5;
        }

        .fighter-card-info strong {
          font-size: 0.85rem;
          color: ${isDark ? '#FFF' : '#111'};
        }

        .fighter-stats-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .stat-bullet {
          font-size: 0.58rem;
          font-weight: 800;
          color: ${isDark ? '#9CA3AF' : '#6B7280'};
        }

        .faceoff-vs {
          font-size: 0.95rem;
          font-weight: 950;
          color: white;
          background: #2B2B2B;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #3C3C3C;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .invitation-msg-card {
          background: ${isDark ? '#221A0F' : '#FFF9EB'};
          border: 2px solid ${isDark ? '#4A3319' : '#FCD34D'};
          color: ${isDark ? '#F59E0B' : '#B45309'};
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }
        .notice-icon {
          font-size: 1.5rem;
        }
        .invitation-msg-card p {
          margin: 0;
          line-height: 1.4;
        }

        .choice-actions { 
          display: flex; 
          flex-direction: column; 
          gap: 10px; 
        }
        
        button {
          width: 100%; 
          padding: 14px; 
          border-radius: 16px; 
          border: none;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 10px;
          font-weight: 950; 
          font-size: 0.95rem; 
          cursor: pointer; 
          transition: all 0.1s;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.5px;
        }
        
        .duel-btn { 
          background: linear-gradient(to bottom, #FF4B4B, #D33131); 
          color: white; 
          box-shadow: 0 6px 0 #A82828, 0 8px 16px rgba(255, 75, 75, 0.2); 
        }
        .duel-btn:active { 
          transform: translateY(4px); 
          box-shadow: 0 2px 0 #A82828; 
        }
        
        .ignore-btn { 
          background: ${isDark ? '#374151' : '#E5E5E5'}; 
          color: ${isDark ? '#9CA3AF' : '#6B7280'}; 
          box-shadow: 0 5px 0 ${isDark ? '#1F2937' : '#B5B5B5'}; 
        }
        .ignore-btn:active { 
          transform: translateY(3px); 
          box-shadow: 0 2px 0 ${isDark ? '#1F2937' : '#B5B5B5'}; 
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes idlePulse {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }

        @media (max-width: 600px) {
          .faceoff-arena { padding: 12px; }
          .fighter-podium-wrapper { width: 65px; height: 65px; }
          .choice-actions { flex-direction: column; }
          button { padding: 12px; font-size: 0.85rem; }
        }
      `}</style>
    </div>
  );
}
