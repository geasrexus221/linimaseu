import React, { useEffect } from 'react';
import { Home, RotateCcw, Share2, Trophy, Medal, Star } from 'lucide-react';
import { useGameStore } from '../../../../store/useGameStore';
import { useNavigationStore } from '../../../../store/useNavigationStore';
import { soundManager } from '../../../../utils/SoundManager';

import character1podium1 from '../../../../assets/UI/Character/character1podium1.svg';
import character2podium1 from '../../../../assets/UI/Character/character2podium1.svg';

export default function VictoryModal() {
  const { winner, players, resetGame } = useGameStore();
  const { setJelajahSubView } = useNavigationStore();

  useEffect(() => {
    if (winner) {
      soundManager.play('success', 0.8);
    }
  }, [winner]);

  if (!winner || !players || players.length === 0) return null;

  const handleExit = () => {
    resetGame();
    setJelajahSubView('intro');
  };

  const handleRestart = () => {
    resetGame();
    setJelajahSubView('setup');
  };

  // Sort players: winner first, then by artifacts, koin, tekad
  const sortedRanks = [...players].sort((a, b) => {
    if (a.id === winner.id) return -1;
    if (b.id === winner.id) return 1;
    if (b.artifacts !== a.artifacts) return b.artifacts - a.artifacts;
    if (b.koin !== a.koin) return b.koin - a.koin;
    return b.tekad - a.tekad;
  });

  const rank1 = sortedRanks[0];
  const rank2 = sortedRanks[1];
  const rank3 = sortedRanks[2];
  const rank4 = sortedRanks[3];

  const getPlayerSprite = (player) => {
    const charId = player?.characterId || 1;
    return charId === 2 ? character2podium1 : character1podium1;
  };

  const getCharacterName = (player) => {
    return player?.characterId === 2 ? 'Wati' : 'Budi';
  };

  const isLocalPlayer = (player) => player?.id === 'player-1';

  return (
    <div className="victory-overlay">


      <div className="victory-popup animate-pop">

        {/* Header Trophy */}
        <div className="popup-header">
          <div className="trophy-badge">
            <Trophy size={36} color="#FFD700" />
          </div>
          <h2 className="popup-title">HASIL AKHIR</h2>
          <p className="popup-subtitle">
            🏆 <strong>{rank1?.name}</strong> memenangkan petualangan!
          </p>
        </div>

        {/* Podium — 2-1-3 layout */}
        <div className="podium-row">

          {/* Rank 2 */}
          {rank2 && (
            <div className="podium-col col-rank-2 animate-rise-2">
              <div className="podium-avatar-wrap silver-ring">
                <div className="podium-avatar-crop">
                  <img src={getPlayerSprite(rank2)} alt={rank2.name} className="podium-sprite" />
                </div>
                <div className="rank-badge rank-2-badge">2</div>
              </div>
              <div className="podium-name">{rank2.name}</div>
              <div className="podium-char">{getCharacterName(rank2)}</div>
              <div className="podium-block block-2">
                <Medal size={16} color="#9CA3AF" />
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {rank1 && (
            <div className="podium-col col-rank-1 animate-rise-1">
              <div className="winner-crown">👑</div>
              <div className="podium-avatar-wrap gold-ring">
                <div className="podium-avatar-crop gold-bg">
                  <img src={getPlayerSprite(rank1)} alt={rank1.name} className="podium-sprite gold-glow" />
                </div>
                <div className="rank-badge rank-1-badge">1</div>
              </div>
              <div className="podium-name name-gold">{rank1.name}</div>
              <div className="podium-char">{getCharacterName(rank1)}</div>
              <div className="podium-block block-1">
                <Trophy size={18} color="#FFD700" />
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {rank3 && (
            <div className="podium-col col-rank-3 animate-rise-3">
              <div className="podium-avatar-wrap bronze-ring">
                <div className="podium-avatar-crop">
                  <img src={getPlayerSprite(rank3)} alt={rank3.name} className="podium-sprite" />
                </div>
                <div className="rank-badge rank-3-badge">3</div>
              </div>
              <div className="podium-name">{rank3.name}</div>
              <div className="podium-char">{getCharacterName(rank3)}</div>
              <div className="podium-block block-3">
                <Medal size={14} color="#D97706" />
              </div>
            </div>
          )}
        </div>

        {/* Score strips */}
        <div className="score-strips">
          {sortedRanks.map((p, i) => (
            <div key={p.id} className={`score-strip ${isLocalPlayer(p) ? 'is-you' : ''}`}>
              <div className="strip-rank-num" style={{ color: i === 0 ? '#D97706' : i === 1 ? '#9CA3AF' : i === 2 ? '#B45309' : '#9CA3AF' }}>
                {i + 1}
              </div>
              <div className="strip-avatar">
                <img src={getPlayerSprite(p)} alt={p.name} className="strip-sprite" />
              </div>
              <div className="strip-info">
                <span className="strip-name">
                  {p.name}
                  {isLocalPlayer(p) && <span className="you-tag">KAMU</span>}
                </span>
                <span className="strip-char">{getCharacterName(p)}</span>
              </div>
              <div className="strip-scores">
                <span className="score-pill peti">📦 {p.artifacts}</span>
                <span className="score-pill koin">🪙 {p.koin || 0}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reward box (rank 1) */}
        <div className="reward-box">
          <Star size={18} color="#D97706" fill="#FACC15" />
          <span>+400 Bintang untuk <strong>{rank1?.name}</strong>!</span>
        </div>

        {/* Action buttons */}
        <div className="action-row">
          <button className="action-btn restart-btn" onClick={handleRestart}>
            <RotateCcw size={18} />
            <span>MAIN LAGI</span>
          </button>
          <button className="action-btn home-btn" onClick={handleExit}>
            <Home size={18} />
            <span>MENU</span>
          </button>
        </div>

        <button className="share-btn" onClick={() => {}}>
          <Share2 size={15} />
          <span>BAGIKAN</span>
        </button>
      </div>

      <style>{`
        /* === OVERLAY === */
        .victory-overlay {
          position: fixed; inset: 0;
          background: rgba(15, 23, 42, 0.82);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; backdrop-filter: blur(8px);
          padding: 16px;
          font-family: 'Outfit', sans-serif;
        }

        /* === POPUP CARD === */
        .victory-popup {
          width: 100%; max-width: 400px;
          background: white;
          border-radius: 32px;
          border: 4px solid #E5E7EB;
          box-shadow: 0 24px 60px rgba(0,0,0,0.35);
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        /* === HEADER === */
        .popup-header {
          background: linear-gradient(135deg, #1CB0F6 0%, #0891B2 100%);
          padding: 22px 20px 18px;
          text-align: center;
        }
        .trophy-badge {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: 3px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 10px;
          animation: trophyPulse 2s ease-in-out infinite;
        }
        @keyframes trophyPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(255,215,0,0); }
        }
        .popup-title {
          font-size: 1.6rem; font-weight: 950; color: white;
          margin: 0 0 6px; letter-spacing: 2px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .popup-subtitle {
          font-size: 0.88rem; font-weight: 700; color: rgba(255,255,255,0.9);
          margin: 0;
        }

        /* === PODIUM === */
        .podium-row {
          display: flex; align-items: flex-end; justify-content: center;
          gap: 8px; padding: 20px 12px 0;
          background: #F9FAFB;
        }
        .podium-col {
          display: flex; flex-direction: column; align-items: center;
          flex: 1; opacity: 0;
        }
        .col-rank-1 { animation: riseUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards; z-index: 3; }
        .col-rank-2 { animation: riseUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s forwards; z-index: 2; }
        .col-rank-3 { animation: riseUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards; z-index: 1; }
        @keyframes riseUp {
          from { transform: translateY(50px) scale(0.85); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .winner-crown { font-size: 1.5rem; margin-bottom: 2px; animation: crownBounce 1s ease-in-out infinite alternate; }
        @keyframes crownBounce { from { transform: translateY(0); } to { transform: translateY(-4px); } }

        .podium-avatar-wrap {
          width: 58px; height: 58px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative; margin-bottom: 4px;
        }
        .col-rank-1 .podium-avatar-wrap { width: 70px; height: 70px; }
        
        .gold-ring { border: 3.5px solid #EAB308; box-shadow: 0 0 14px rgba(234,179,8,0.5); }
        .silver-ring { border: 3px solid #9CA3AF; box-shadow: 0 0 8px rgba(156,163,175,0.3); }
        .bronze-ring { border: 3px solid #B45309; box-shadow: 0 0 6px rgba(180,83,9,0.2); }

        .podium-avatar-crop {
          width: 100%; height: 100%; border-radius: 50%;
          overflow: hidden; background: #EFF6FF;
          display: flex; align-items: flex-start; justify-content: center;
        }
        .gold-bg { background: #FFFBEB; }
        .podium-sprite { width: 120%; height: 120%; object-fit: contain; }
        .gold-glow { filter: drop-shadow(0 0 6px rgba(234,179,8,0.7)); }

        .rank-badge {
          position: absolute; bottom: -4px;
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 950; font-size: 0.65rem;
          border: 2px solid white;
        }
        .rank-1-badge { background: #EAB308; color: white; }
        .rank-2-badge { background: #9CA3AF; color: white; }
        .rank-3-badge { background: #B45309; color: white; }

        .podium-name {
          font-size: 0.72rem; font-weight: 900; color: #1F2937;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 80px; margin-top: 2px;
        }
        .name-gold { color: #D97706; }
        .podium-char {
          font-size: 0.58rem; font-weight: 700; color: #9CA3AF;
          margin-bottom: 6px;
        }

        .podium-block {
          width: 100%; display: flex; align-items: center; justify-content: center;
          border-radius: 12px 12px 0 0;
        }
        .block-1 { background: linear-gradient(180deg, #FEF9C3, #FDE047); height: 64px; }
        .block-2 { background: linear-gradient(180deg, #F1F5F9, #CBD5E1); height: 48px; }
        .block-3 { background: linear-gradient(180deg, #FEF3C7, #FDE68A); height: 36px; }

        /* === SCORE STRIPS === */
        .score-strips {
          padding: 16px 16px 12px;
          display: flex; flex-direction: column; gap: 8px;
          background: white;
        }
        .score-strip {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 16px;
          background: #F9FAFB; border: 2px solid #E5E7EB;
          transition: all 0.2s;
        }
        .score-strip.is-you {
          background: #EFF6FF; border-color: #BFDBFE;
        }
        .strip-rank-num {
          font-weight: 950; font-size: 1.1rem; min-width: 22px;
        }
        .strip-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          overflow: hidden; background: #EFF6FF; flex-shrink: 0;
          display: flex; align-items: flex-start; justify-content: center;
          border: 2px solid #E5E7EB;
        }
        .strip-sprite { width: 120%; height: 120%; object-fit: contain; }
        .strip-info {
          flex: 1; display: flex; flex-direction: column;
        }
        .strip-name {
          font-weight: 900; font-size: 0.85rem; color: #1F2937;
          display: flex; align-items: center; gap: 5px;
        }
        .you-tag {
          background: #1CB0F6; color: white; font-size: 0.55rem;
          padding: 1px 5px; border-radius: 6px; font-weight: 900;
          letter-spacing: 0.5px;
        }
        .strip-char {
          font-size: 0.65rem; font-weight: 700; color: #9CA3AF;
        }
        .strip-scores {
          display: flex; gap: 4px;
        }
        .score-pill {
          font-size: 0.65rem; font-weight: 900;
          padding: 3px 7px; border-radius: 8px;
          white-space: nowrap;
        }
        .peti { background: #FEF3C7; color: #D97706; border: 1px solid #FDE68A; }
        .koin { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }

        /* === REWARD BOX === */
        .reward-box {
          margin: 0 16px 14px;
          background: #FFFBEB; border: 2px solid #FDE68A; border-radius: 16px;
          padding: 12px 16px; display: flex; align-items: center; gap: 8px;
          font-size: 0.88rem; font-weight: 700; color: #D97706;
        }
        .reward-box strong { font-weight: 950; }

        /* === ACTIONS === */
        .action-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          padding: 0 16px 12px;
        }
        .action-btn {
          padding: 13px; border-radius: 18px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          font-weight: 900; font-size: 0.8rem; color: white;
          font-family: 'Outfit', sans-serif; transition: all 0.1s;
        }
        .restart-btn {
          background: #58CC02; box-shadow: 0 5px 0 #46A302;
        }
        .restart-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #46A302; }
        .home-btn {
          background: #1CB0F6; box-shadow: 0 5px 0 #1899D6;
        }
        .home-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #1899D6; }

        .share-btn {
          margin: 0 16px 20px;
          width: calc(100% - 32px);
          background: none; border: 2.5px solid #E5E7EB;
          padding: 11px; border-radius: 14px; color: #6B7280;
          font-weight: 900; font-size: 0.78rem;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          cursor: pointer; transition: all 0.2s; font-family: 'Outfit', sans-serif;
        }
        .share-btn:hover { border-color: #9CA3AF; color: #4B5563; }

        /* === CONFETTI === */
        .confetti-container {
          position: fixed; inset: 0; pointer-events: none; z-index: 10000;
          overflow: hidden;
        }
        .confetti {
          position: absolute; width: 9px; height: 9px; top: -20px;
          border-radius: 2px;
          animation: confettiFall linear infinite;
        }
        .c0 { background: #FFD700; }
        .c1 { background: #FF69B4; }
        .c2 { background: #1CB0F6; }
        .c3 { background: #58CC02; }
        .c4 { background: #f4c265; }
        .c5 { background: #A855F7; }

        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0.4; }
        }
        @keyframes animate-pop {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: animate-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      `}</style>
    </div>
  );
}
