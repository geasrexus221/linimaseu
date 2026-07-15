import React, { useEffect, useState } from 'react';
import Dice3D from '../../../../../components/common/Dice3D';
import { useStore } from '../../../../../store/useStore';
import { useGameStore } from '../../../../../store/useGameStore';
import { soundEngine } from '../../logic/soundEngine';

import character1podium1 from '../../../../../assets/UI/Character/character1podium1.svg';
import character2podium1 from '../../../../../assets/UI/Character/character2podium1.svg';
import character1podium5 from '../../../../../assets/UI/Character/character1podium5.svg';
import character2podium5 from '../../../../../assets/UI/Character/character2podium5.svg';
import character1podium2 from '../../../../../assets/UI/Character/character1podium2.svg';
import character2podium2 from '../../../../../assets/UI/Character/character2podium2.svg';
import character1podium3 from '../../../../../assets/UI/Character/character1podium3.svg';
import character2podium3 from '../../../../../assets/UI/Character/character2podium3.svg';

export default function DuelBattleContent() {
  const activeEvent = useGameStore(state => state.activeEvent);
  const selectDuelDefense = useGameStore(state => state.selectDuelDefense);
  const rollDuelChallenger = useGameStore(state => state.rollDuelChallenger);
  const rollDuelDefender = useGameStore(state => state.rollDuelDefender);

  const theme = useStore(state => state.theme);
  const isDark = theme === 'dark';


  if (!activeEvent) return null;

  const { challenger, opponent, stage, challengerRoll, defenderRoll, challengerScore, defenderScore, defenderStrategy, isRolling, message, damageDealt } = activeEvent;
  const isOpponentAI = opponent.type === 'ai';
  const isChallengerAI = challenger.type === 'ai';

  // Determine player sprites based on characterId and battle stage outcome
  const getChallengerSprite = () => {
    const charId = challenger.characterId || 1;
    if (stage === 'CHALLENGER_ROLL' && isRolling) {
      return charId === 2 ? character2podium5 : character1podium5;
    }
    if (stage === 'RESULT') {
      const challengerWon = activeEvent.result === 'WIN';
      if (challengerWon) {
        return charId === 2 ? character2podium2 : character1podium2;
      } else {
        return charId === 2 ? character2podium3 : character1podium3;
      }
    }
    return charId === 2 ? character2podium1 : character1podium1;
  };

  const getDefenderSprite = () => {
    const charId = opponent.characterId || 1;
    if (stage === 'DEFENDER_ROLL' && isRolling) {
      return charId === 2 ? character2podium5 : character1podium5;
    }
    if (stage === 'RESULT') {
      const challengerWon = activeEvent.result === 'WIN';
      if (!challengerWon) {
        return charId === 2 ? character2podium2 : character1podium2;
      } else {
        return charId === 2 ? character2podium3 : character1podium3;
      }
    }
    return charId === 2 ? character2podium1 : character1podium1;
  };

  // AI Automation Effect
  useEffect(() => {
    let timer;

    if (stage === 'DEFENSE_SELECT' && isOpponentAI) {
      timer = setTimeout(() => {
        const strategy = Math.random() < 0.5 ? 'defend' : 'evade';
        selectDuelDefense(strategy);
      }, 2000);
    } else if (stage === 'CHALLENGER_ROLL' && isChallengerAI && !isRolling) {
      timer = setTimeout(() => {
        rollDuelChallenger();
      }, 1500);
    } else if (stage === 'DEFENDER_ROLL' && isOpponentAI && !isRolling) {
      timer = setTimeout(() => {
        rollDuelDefender();
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [stage, isOpponentAI, isChallengerAI, isRolling]);

  return (
    <div className="orange-juice-duel">
      {/* TOP HEADER */}
      <div className="duel-header-retro">
        {stage === 'DEFENSE_SELECT' && (
          <div className="action-banner announce-banner">
            {isOpponentAI 
              ? `🤖 LAWAN SEDANG BERPIKIR...` 
              : `👉 SERAHKAN PERANGKAT KE ${opponent.name.toUpperCase()}!`
            }
          </div>
        )}
        {stage === 'CHALLENGER_ROLL' && <div className="action-banner">GILIRAN SERANG: {challenger.name.toUpperCase()}</div>}
        {stage === 'DEFENDER_ROLL' && <div className="action-banner">GILIRAN BERTAHAN: {opponent.name.toUpperCase()}</div>}
        {stage === 'RESULT' && <div className="action-banner">HASIL PERTEMPURAN</div>}
      </div>

      {/* MAIN VIEW */}
      {stage === 'DEFENSE_SELECT' ? (
        /* DEDICATED DEFENSE STRATEGY SELECTION VIEW (Defender Centered) */
        <div className="defense-select-view">
          <div className="defender-centered-card">
            <div className="fighter-name-label">{opponent.name}</div>
            <div className="sprite-flip-wrapper">
              <img src={getDefenderSprite()} alt={opponent.name} className="fighter-sprite-retro" />
            </div>
          </div>
          <div className="strategy-buttons">
            <button className="strategy-btn btn-defend" onClick={() => { soundEngine.playSound('click'); selectDuelDefense('defend'); }}>
              BERTAHAN
            </button>
            <button className="strategy-btn btn-evade" onClick={() => { soundEngine.playSound('click'); selectDuelDefense('evade'); }}>
              MENGHINDAR
            </button>
          </div>
        </div>
      ) : (
        /* STANDARD 3-COLUMN FIGHT STAGE */
        <div className="duel-stage">
          {/* CHALLENGER (LEFT FIGHTER) */}
          <div className={`fighter-container left-side ${stage === 'CHALLENGER_ROLL' ? 'active-turn' : ''} ${activeEvent.result === 'WIN' && stage === 'RESULT' ? 'winner-pulse' : ''}`}>
            <div className="fighter-name-label">{challenger.name}</div>
            {activeEvent.duelRewardType && (
              <div className={`strategy-chosen-badge ${activeEvent.duelRewardType === 'koin' ? 'evade' : 'defend'}`}>
                {activeEvent.duelRewardType === 'koin' ? 'REBUT KOIN' : 'SERANG TEKAD'}
              </div>
            )}
            <img src={getChallengerSprite()} alt={challenger.name} className="fighter-sprite-retro" />
            {stage === 'RESULT' && activeEvent.result === 'WIN' && <div className="victory-text">MENANG!</div>}
            
            {/* CHALLENGER SCORE BUBBLE */}
            {challengerRoll !== null && !(stage === 'CHALLENGER_ROLL' && isRolling) && (
              <div className="arena-score-bubble challenger-bubble">
                <span className="bubble-lbl">SKOR</span>
                <span className="bubble-num">{challengerScore}</span>
              </div>
            )}
          </div>

          {/* CENTER ACTION AREA */}
          <div className="center-action-zone">
            {(stage === 'CHALLENGER_ROLL' || stage === 'DEFENDER_ROLL') && (
              <div className="dice-roll-zone">
                <div className="dice-bubble">
                  {isRolling ? (
                    <Dice3D value={stage === 'CHALLENGER_ROLL' ? (challengerRoll || 1) : (defenderRoll || 1)} isRolling={true} size={64} />
                  ) : stage === 'CHALLENGER_ROLL' && challengerRoll !== null ? (
                    <div className="dice-display">
                      <Dice3D value={challengerRoll} isRolling={false} size={64} />
                      <div className="score-math">
                        {challengerRoll} + {challenger.stats?.serangan || 0} (🗡️) = <strong>{challengerScore}</strong>
                      </div>
                    </div>
                  ) : stage === 'DEFENDER_ROLL' && defenderRoll !== null ? (
                    <div className="dice-display">
                      <Dice3D value={defenderRoll} isRolling={false} size={64} />
                      <div className="score-math">
                        {defenderRoll} + {defenderStrategy === 'defend' ? (opponent.stats?.pertahanan || 0) : (opponent.stats?.kelincahan || 0)} ({defenderStrategy === 'defend' ? '🛡️' : '💨'}) = <strong>{defenderScore}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="dice-placeholder">?</div>
                  )}
                </div>

                <div className="roll-action-container">
                  {stage === 'CHALLENGER_ROLL' && !isChallengerAI && !isRolling && (
                    <button className="retro-roll-btn" onClick={rollDuelChallenger}>
                      🗡️ SERANG!
                    </button>
                  )}
                  {stage === 'DEFENDER_ROLL' && !isOpponentAI && !isRolling && (
                    <button className="retro-roll-btn defend-btn" onClick={rollDuelDefender}>
                      {defenderStrategy === 'defend' ? '🛡️ BERTAHAN!' : '💨 MENGHINDAR!'}
                    </button>
                  )}
                  {isRolling && <div className="rolling-text">MELEMPAR DADU...</div>}
                  {((stage === 'CHALLENGER_ROLL' && isChallengerAI) || (stage === 'DEFENDER_ROLL' && isOpponentAI)) && !isRolling && (
                    <div className="rolling-text ai">AI MELEMPAR...</div>
                  )}
                </div>
              </div>
            )}

            {stage === 'RESULT' && (
              <div className="result-damage-zone">
                <div className="result-text-summary calculation-summary">{message}</div>
                {activeEvent.duelRewardType === 'koin' ? (
                  <>
                    <div className="damage-header-tag gold-reward">KOIN DIREBUT</div>
                    <div className="damage-value-bubble gold-reward-bubble">🪙 {activeEvent.stolenAmount || 0}</div>
                  </>
                ) : (
                  <>
                    <div className="damage-header-tag">DAMAGE</div>
                    <div className="damage-value-bubble">-{damageDealt}</div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* DEFENDER (RIGHT FIGHTER) - FLIPPED sprite */}
          <div className={`fighter-container right-side ${stage === 'DEFENDER_ROLL' ? 'active-turn' : ''} ${activeEvent.result === 'LOSE' && stage === 'RESULT' ? 'winner-pulse' : ''}`}>
            <div className="fighter-name-label">{opponent.name}</div>
            
            {/* STRATEGY CHOSEN INDICATOR BADGE */}
            {defenderStrategy && (
              <div className={`strategy-chosen-badge ${defenderStrategy}`}>
                {defenderStrategy === 'defend' ? '🛡️ BERTAHAN' : '💨 MENGHINDAR'}
              </div>
            )}

            {/* FALLING TEKAD PARTICLES EFFECT (Splash Burst) */}
            {stage === 'RESULT' && damageDealt > 0 && (
              <div className="falling-particles-container">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const dx = (Math.random() - 0.5) * 110;
                  const dyPeak = -Math.random() * 45 - 20;
                  const dyFall = Math.random() * 60 + 50;
                  const delay = Math.random() * 0.3;
                  const duration = Math.random() * 0.5 + 0.7;
                  return (
                    <span 
                      key={idx} 
                      className="falling-particle" 
                      style={{
                        '--dx': `${dx}px`,
                        '--dy-peak': `${dyPeak}px`,
                        '--dy-fall': `${dyFall}px`,
                        animationDelay: `${delay}s`,
                        animationDuration: `${duration}s`,
                        fontSize: `${Math.random() * 6 + 12}px`
                      }}
                    >
                      💔
                    </span>
                  );
                })}
              </div>
            )}

            <div className="sprite-flip-wrapper">
              <img src={getDefenderSprite()} alt={opponent.name} className="fighter-sprite-retro" />
            </div>
            {stage === 'RESULT' && activeEvent.result === 'LOSE' && <div className="victory-text">MENANG!</div>}

            {/* DEFENDER SCORE BUBBLE */}
            {defenderRoll !== null && !(stage === 'DEFENDER_ROLL' && isRolling) && (
              <div className="arena-score-bubble defender-bubble">
                <span className="bubble-lbl">SKOR</span>
                <span className="bubble-num">{defenderScore}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM HUD PANEL */}
      <div className="duel-hud-row">
        {/* CHALLENGER HUD */}
        <div className="hud-panel left-hud">
          <div className="hud-hp-circle">
            <span className="hp-label">TEKAD</span>
            <span className="hp-value">{challenger.tekad}</span>
          </div>
          <div className="hud-stats-pill">
            <div className="stat-col">
              <span className="stat-lbl">🗡️</span>
              <span className="stat-val">{challenger.stats?.serangan >= 0 ? `+${challenger.stats.serangan}` : challenger.stats?.serangan}</span>
            </div>
            <div className="stat-col">
              <span className="stat-lbl">🛡️</span>
              <span className="stat-val">{challenger.stats?.pertahanan >= 0 ? `+${challenger.stats.pertahanan}` : challenger.stats?.pertahanan}</span>
            </div>
            <div className="stat-col">
              <span className="stat-lbl">💨</span>
              <span className="stat-val">{challenger.stats?.kelincahan >= 0 ? `+${challenger.stats.kelincahan}` : challenger.stats?.kelincahan}</span>
            </div>
          </div>
        </div>

        {/* DEFENDER HUD */}
        <div className="hud-panel right-hud">
          <div className="hud-stats-pill">
            <div className="stat-col">
              <span className="stat-lbl">🗡️</span>
              <span className="stat-val">{opponent.stats?.serangan >= 0 ? `+${opponent.stats.serangan}` : opponent.stats?.serangan}</span>
            </div>
            <div className="stat-col">
              <span className="stat-lbl">🛡️</span>
              <span className="stat-val">{opponent.stats?.pertahanan >= 0 ? `+${opponent.stats.pertahanan}` : opponent.stats?.pertahanan}</span>
            </div>
            <div className="stat-col">
              <span className="stat-lbl">💨</span>
              <span className="stat-val">{opponent.stats?.kelincahan >= 0 ? `+${opponent.stats.kelincahan}` : opponent.stats?.kelincahan}</span>
            </div>
          </div>
          <div className="hud-hp-circle">
            <span className="hp-label">TEKAD</span>
            <span className="hp-value">{opponent.isFainted ? '0' : opponent.tekad}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .orange-juice-duel {
          width: 100%;
          font-family: 'Outfit', 'Inter', sans-serif;
          background: linear-gradient(to bottom, #FFE8D6, #FFD8A8);
          border: 4.5px solid #4A2E10;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(74, 46, 16, 0.25);
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* --- retro header --- */
        .duel-header-retro {
          background: #4A2E10;
          padding: 10px 16px;
          border-bottom: 4px solid #3C240A;
          display: flex;
          align-items: center;
          justify-content: center; /* Center the banner */
        }
        .action-banner {
          background: #f4c265;
          color: white;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 3px 10px;
          border-radius: 8px;
          border: 2px solid white;
          text-transform: uppercase;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .announce-banner {
          background: #3B82F6;
          animation: pulse 1.5s infinite;
        }

        /* --- defense select view --- */
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
        .defender-centered-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* --- main arena --- */
        .duel-stage {
          display: flex;
          height: 190px;
          position: relative;
          align-items: flex-end;
          justify-content: space-between;
          padding: 12px 20px;
          background-image: radial-gradient(#FFECE0 20%, transparent 20%),
                            radial-gradient(#FFECE0 20%, transparent 20%);
          background-size: 16px 16px;
          background-position: 0 0, 8px 8px;
        }
        .fighter-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 95px;
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .fighter-container.active-turn {
          opacity: 1;
          transform: scale(1.05);
        }
        .fighter-sprite-retro {
          width: 90px;
          height: 90px;
          object-fit: contain;
          animation: idlePulse 2s ease-in-out infinite alternate;
        }
        .left-side {
          transform-origin: bottom left;
        }
        .right-side {
          transform-origin: bottom right;
        }
        .right-side .sprite-flip-wrapper {
          transform: scaleX(-1);
          display: flex;
          align-items: center;
          justify-content: center;
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
        .strategy-chosen-badge {
          font-size: 0.58rem;
          font-weight: 950;
          padding: 2px 8px;
          border-radius: 6px;
          border: 2px solid #4A2E10;
          box-shadow: 0 1.5px 0 #4A2E10;
          text-transform: uppercase;
          margin-bottom: 6px;
          white-space: nowrap;
          z-index: 2;
          color: white;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .strategy-chosen-badge.defend {
          background: #10B981;
        }
        .strategy-chosen-badge.evade {
          background: #F59E0B;
        }
        .falling-particles-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          pointer-events: none;
          z-index: 15;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .falling-particle {
          position: absolute;
          animation: splashParticle 1s ease-out infinite;
          opacity: 0;
        }
        @keyframes splashParticle {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          50% {
            transform: translate(calc(var(--dx) * 0.7), var(--dy-peak)) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy-fall)) scale(0.6);
            opacity: 0;
          }
        }
        .victory-text {
          position: absolute;
          top: -24px;
          background: #58CC02;
          color: white;
          font-weight: 950;
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 6px;
          border: 2px solid white;
          animation: bounce 1s infinite;
        }
        .arena-score-bubble {
          position: absolute;
          top: 35px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 3px solid #4A2E10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 0 #4A2E10;
          animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
        }
        .challenger-bubble {
          right: -25px;
          background: #3B82F6;
        }
        .defender-bubble {
          left: -25px;
          background: #10B981;
        }
        .bubble-lbl {
          font-size: 0.45rem;
          font-weight: 950;
          color: white;
          line-height: 1;
        }
        .bubble-num {
          font-size: 0.95rem;
          font-weight: 950;
          color: white;
          line-height: 1;
        }

        /* --- center actions & dice --- */
        .center-action-zone {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          z-index: 5;
        }

        .strategy-buttons {
          display: flex;
          gap: 12px;
        }
        .strategy-btn {
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 950;
          font-size: 0.8rem;
          cursor: pointer;
          color: white;
          transition: transform 0.1s;
          box-shadow: 0 4px 0 #4A2E10;
        }
        .strategy-btn:active {
          transform: translateY(3px);
          box-shadow: 0 1px 0 #4A2E10;
        }
        .btn-defend {
          background: #10B981;
        }
        .btn-evade {
          background: #F59E0B;
        }

        .dice-roll-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .dice-bubble {
          background: white;
          border: 4px solid #4A2E10;
          border-radius: 20px;
          padding: 8px;
          box-shadow: 0 4px 0 #4A2E10;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 80px;
          min-height: 80px;
        }
        .dice-placeholder {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F3F4F6;
          border-radius: 14px;
          color: #9CA3AF;
          font-size: 1.6rem;
          font-weight: 950;
          border: 3.5px dashed #D1D5DB;
        }
        .dice-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .score-math {
          font-size: 0.58rem;
          font-weight: 800;
          color: #6B7280;
        }
        .score-math strong {
          font-size: 0.72rem;
          color: #EF4444;
          font-weight: 950;
        }

        .dice-throw-wrapper.throwing-left {
          animation: throwDiceLeft 1.2s cubic-bezier(0.25, 0.8, 0.25, 1.2) forwards;
        }
        .dice-throw-wrapper.throwing-right {
          animation: throwDiceRight 1.2s cubic-bezier(0.25, 0.8, 0.25, 1.2) forwards;
        }

        .roll-action-container {
          min-height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .retro-roll-btn {
          border: none;
          padding: 8px 16px;
          border-radius: 12px;
          background: linear-gradient(to bottom, #FF5C5C, #D31A1A);
          color: white;
          font-weight: 950;
          font-size: 0.75rem;
          cursor: pointer;
          box-shadow: 0 4px 0 #881212;
          transition: all 0.1s;
        }
        .retro-roll-btn:active {
          transform: translateY(3px);
          box-shadow: 0 1px 0 #881212;
        }
        .retro-roll-btn.defend-btn {
          background: linear-gradient(to bottom, #10B981, #047857);
          box-shadow: 0 4px 0 #065F46;
        }
        .retro-roll-btn.defend-btn:active {
          box-shadow: 0 1px 0 #065F46;
        }
        .rolling-text {
          font-size: 0.65rem;
          font-weight: 950;
          color: #4A2E10;
          animation: pulse 1.2s infinite;
        }

        /* --- result damage zone --- */
        .result-damage-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .damage-header-tag {
          font-size: 0.65rem;
          font-weight: 950;
          color: #A82828;
          letter-spacing: 1px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
          margin-top: 4px;
        }
        .damage-header-tag.gold-reward {
          color: #D97706;
        }
        .damage-value-bubble {
          font-size: 2.2rem;
          font-weight: 950;
          color: #FF1E1E;
          background: white;
          border: 4px solid #4A2E10;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 0 #4A2E10;
          text-shadow: 0 2px 0 #E5E7EB;
        }
        .damage-value-bubble.gold-reward-bubble {
          color: #D97706;
          font-size: 1.1rem;
        }
        .result-text-summary {
          font-size: 0.68rem;
          font-weight: 950;
          color: #5C3D24;
          background: #FFE8D6;
          border: 2.5px solid #4A2E10;
          padding: 4px 10px;
          border-radius: 8px;
          max-width: 180px;
          text-align: center;
          line-height: 1.3;
          margin-bottom: 6px;
        }

        /* --- bottom HUD panel --- */
        .duel-hud-row {
          display: flex;
          background: #FFE3C9;
          border-top: 4.5px solid #4A2E10;
          padding: 10px 16px;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }
        .hud-panel {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        .right-hud {
          justify-content: flex-end;
        }
        .hud-hp-circle {
          width: 50px;
          height: 50px;
          background: white;
          border: 3.5px solid #4A2E10;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 0 #4A2E10;
          flex-shrink: 0;
        }
        .hp-label {
          font-size: 0.48rem;
          font-weight: 950;
          color: #888888;
          line-height: 1;
        }
        .hp-value {
          font-size: 1.1rem;
          font-weight: 950;
          color: #111;
          line-height: 1.1;
        }
        .hud-stats-pill {
          background: white;
          border: 3.5px solid #4A2E10;
          border-radius: 16px;
          padding: 4px 10px;
          display: flex;
          gap: 10px;
          box-shadow: 0 3px 0 #4A2E10;
        }
        .stat-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 22px;
        }
        .stat-lbl {
          font-size: 0.72rem;
          font-weight: 950;
          line-height: 1;
          margin-bottom: 2px;
        }
        .stat-val {
          font-size: 0.78rem;
          font-weight: 950;
          color: #4A2E10;
          line-height: 1;
        }

        /* --- keyframes --- */
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes idlePulse {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes throwDiceLeft {
          0% {
            transform: translate(-90px, -20px) rotate(0deg) scale(0.3);
            opacity: 0;
          }
          20% { opacity: 1; }
          80% { transform: translate(10px, 5px) rotate(540deg) scale(1.1); }
          100% { transform: translate(0, 0) rotate(720deg) scale(1); opacity: 1; }
        }
        @keyframes throwDiceRight {
          0% {
            transform: translate(90px, -20px) rotate(0deg) scale(0.3);
            opacity: 0;
          }
          20% { opacity: 1; }
          80% { transform: translate(-10px, 5px) rotate(540deg) scale(1.1); }
          100% { transform: translate(0, 0) rotate(720deg) scale(1); opacity: 1; }
        }

        @media (max-width: 600px) {
          .duel-stage, .defense-select-view { height: 170px; padding: 10px; }
          .fighter-sprite-retro { width: 70px; height: 70px; }
          .dice-bubble { min-width: 65px; min-height: 65px; }
          .duel-hud-row { padding: 8px 10px; gap: 8px; }
          .hud-hp-circle { width: 44px; height: 44px; }
          .hud-stats-pill { padding: 3px 8px; gap: 8px; }
          .stat-col { min-width: 18px; }
          .stat-val { font-size: 0.7rem; }
        }
      `}</style>
    </div>
  );
}
