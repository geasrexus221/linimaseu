import React, { useEffect } from 'react';
import { useGameStore } from '../../../../store/useGameStore';
import { aiEngine } from '../logic/aiEngine';
import { getEventColor } from '../utils/gameUtils';
import { useStore } from '../../../../store/useStore';
import { soundEngine } from '../logic/soundEngine';
// Sub-components
import QuizContent from './events/QuizContent';
import BattleContent from './events/BattleContent';
import ChoiceContent from './events/ChoiceContent';
import DiscardCardContent from './events/DiscardCardContent';
import CardPreviewContent from './events/CardPreviewContent';
import DuelInvitationContent from './events/DuelInvitationContent';
import DuelTargetSelectionContent from './events/DuelTargetSelectionContent';
import DuelBattleContent from './events/DuelBattleContent';
import BasePurchaseContent from './events/BasePurchaseContent';

export default function EventModal() {
  const { 
    activeEvent, closeEvent, players, turnIdx, 
    handleQuizAnswer, handleBattleRoll, handleBaseChoice, handleDiscardCard,
    handleDuelChoice, handleBasePurchase, selectDuelTarget
  } = useGameStore();

  const theme = useStore(state => state.theme);
  const isDark = theme === 'dark';

  const currentPlayer = players[turnIdx];
  const isAI = currentPlayer?.type === 'ai';

  // AI BOT AUTO-CHOICE LOGIC
  useEffect(() => {
    if (!activeEvent || !isAI) return;

    let timer;
    if (activeEvent.type === 'base_choice') {
      timer = setTimeout(() => {
        const choice = aiEngine.decideBaseChoice(currentPlayer);
        handleBaseChoice(choice);
      }, 2000);
    } else if (activeEvent.type === 'base_purchase') {
      timer = setTimeout(() => {
        // AI always buys treasure if they can afford it
        handleBasePurchase('yes');
      }, 2000);
    } else if (activeEvent.type === 'jejak' && activeEvent.status === 'PENDING') {
      timer = setTimeout(() => {
        const ans = aiEngine.decideQuizAnswer(activeEvent.question);
        handleQuizAnswer(ans);
      }, 3000);
    } else if (activeEvent.type === 'penjaga' && activeEvent.status === 'PENDING') {
      timer = setTimeout(() => {
        handleBattleRoll();
      }, 2000);
    } else if (activeEvent.type === 'duel_invitation') {
      timer = setTimeout(() => {
        // AI 50% chance to challenge
        handleDuelChoice(Math.random() > 0.5 ? 'challenge' : 'ignore');
      }, 2000);
    } else if (activeEvent.status === 'RESOLVED' || ['base', 'peti', 'jebakan', 'kartu', 'base_storage', 'base_purchase_success'].includes(activeEvent.type)) {
      // Auto close for AI turn OR if the opponent in a duel was an AI
      const isDuelWithAI = (activeEvent.type === 'duel_battle' || activeEvent.type === 'duel_defense_selection') && activeEvent.opponent?.type === 'ai';
      
      if (isAI || isDuelWithAI) {
        timer = setTimeout(() => {
          closeEvent();
        }, 3000);
      }
    }

    return () => clearTimeout(timer);
  }, [activeEvent, isAI, currentPlayer, handleBaseChoice, handleQuizAnswer, handleBattleRoll, closeEvent, handleDuelChoice, handleBasePurchase]);

  if (!activeEvent) return null;

  const getEventGraphic = () => {
    switch (activeEvent.type) {
      case 'jejak':
        return { emoji: '💡', color: '#FBBF24' };
      case 'penjaga':
        return { emoji: '🛡️', color: '#EF4444' };
      case 'base_choice':
      case 'base_purchase':
      case 'base_purchase_success':
        return { emoji: '🏰', color: '#3B82F6' };
      case 'discard_card_choice':
      case 'kartu':
        return { emoji: '🃏', color: '#EC4899' };
      case 'duel_invitation':
      case 'duel_target_selection':
      case 'duel_defense_selection':
      case 'duel_battle':
        return { emoji: '⚔️', color: '#F59E0B' };
      default:
        return { emoji: '🌟', color: '#10B981' };
    }
  };

  const graphic = getEventGraphic();

  const isQuiz = activeEvent.type === 'jejak';
  const isBattle = activeEvent.type === 'penjaga';
  const isBaseChoice = activeEvent.type === 'base_choice';
  const isPending = activeEvent.status === 'PENDING';

  return (
    <div className="event-sheet-overlay">
      <div className="event-sheet-container">
        {/* DRAG HANDLE VISUAL */}
        <div className="sheet-handle" />

        <div className="sheet-layout">
          {/* CENTERED: TITLE & SUBTITLE */}
          <div className="sheet-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginBottom: '8px' }}>
            <div className="title-stack" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <h2 className="event-title" style={{ fontSize: '1.4rem', fontWeight: 950, color: '#4A2E1B', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}>{activeEvent.title}</h2>
              <p className="event-msg">{activeEvent.message}</p>
            </div>
            
            {/* Desktop-only graphic card to fill space */}
            <div className="desktop-graphic-card">
              <div className="glowing-orb" style={{ '--glow-color': graphic.color }}>
                <span className="floating-emoji">{graphic.emoji}</span>
              </div>
            </div>
          </div>

          {/* CENTER/RIGHT: CONTENT */}
          <div className="sheet-body">
            {isBattle && (
              <BattleContent 
                player={players[turnIdx]}
                guardian={activeEvent.guardian} 
                playerRoll={activeEvent.playerRoll} 
                isRolling={activeEvent.isRolling}
                isPending={isPending}
                onRoll={handleBattleRoll}
                loser={activeEvent.loser}
              />
            )}

            {isQuiz && isPending && (
              <QuizContent 
                question={activeEvent.question} 
                onAnswer={handleQuizAnswer} 
              />
            )}

            {isBaseChoice && (
              <ChoiceContent 
                message={activeEvent.message} 
                remainingSteps={activeEvent.remainingSteps}
                onChoice={handleBaseChoice}
              />
            )}

            {activeEvent.type === 'base_purchase' && (
              <BasePurchaseContent 
                cost={activeEvent.cost}
                onChoice={handleBasePurchase}
              />
            )}

            {activeEvent.type === 'discard_card_choice' && (
              <DiscardCardContent 
                currentInventory={activeEvent.currentInventory}
                newCard={activeEvent.newCard}
                onDiscard={handleDiscardCard}
              />
            )}

            {activeEvent.type === 'kartu' && (
              <CardPreviewContent card={activeEvent.card} />
            )}

            {activeEvent.type === 'duel_invitation' && (
              <DuelInvitationContent 
                opponent={activeEvent.opponent} 
                onChoice={handleDuelChoice} 
              />
            )}

            {activeEvent.type === 'duel_target_selection' && (
              <DuelTargetSelectionContent 
                onSelectTarget={(targetType) => {
                  soundEngine.playSound('click');
                  selectDuelTarget(targetType);
                }}
              />
            )}

            {(activeEvent.type === 'duel_defense_selection' || activeEvent.type === 'duel_battle') && (
              <DuelBattleContent />
            )}

            {/* ACTION BUTTON - Moved inside sheet-body for consistent positioning */}
            {!isBaseChoice && !isPending && !['duel_invitation', 'base_purchase', 'duel_target_selection'].includes(activeEvent.type) && (
              <div className="sheet-footer content-integrated">
                <button className="sheet-confirm-btn" onClick={() => { soundEngine.playSound('click'); closeEvent(); }}>
                  LANJUTKAN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .event-sheet-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          display: flex; align-items: flex-end; justify-content: center;
          z-index: 1000; backdrop-filter: blur(4px);
          animation: overlayFade 0.3s ease-out;
        }
        
        /* PC/Desktop Mode: No full-screen dark/blur backdrop */
        @media (min-width: 1024px) {
          .event-sheet-overlay {
            background: none;
            backdrop-filter: none;
            align-items: center;
            pointer-events: none; /* Allow clicking through the empty space if needed, but the container should have pointer-events auto */
          }
          .event-sheet-container {
            pointer-events: auto;
            border-radius: 40px !important;
            max-height: 85vh !important;
            border: 4px dashed #6A3E16 !important;
            box-shadow: 0 20px 60px rgba(106,62,22,0.4), inset 0 0 30px rgba(106,62,22,0.1) !important;
            width: 90% !important;
            max-width: 950px !important;
            margin: 0 auto;
          }
          .sheet-handle { display: none; }
        }

        .event-sheet-container {
          background: linear-gradient(180deg, #F3E5AB 0%, #E2C999 100%);
          width: 100%; max-width: 900px;
          border-radius: 40px 40px 0 0;
          border: 4px dashed #6A3E16;
          border-bottom: none;
          box-shadow: 0 -15px 40px rgba(106,62,22,0.4), inset 0 0 40px rgba(106,62,22,0.15);
          padding: 16px 24px 20px;
          position: relative;
          max-height: 95vh;
          overflow-y: auto;
          animation: sheetSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-family: 'Outfit', sans-serif;
        }

        @media (max-width: 600px) {
          .event-sheet-container {
            padding: 12px 16px 16px;
            border-radius: 24px 24px 0 0;
            border-width: 3px;
          }
          .sheet-handle { margin-bottom: 10px; }
          .event-badge { width: 55px !important; height: 55px !important; font-size: 1.8rem !important; }
          .event-title { font-size: 1.1rem !important; }
          .event-msg { font-size: 0.8rem !important; }
          .sheet-confirm-btn { padding: 12px !important; font-size: 1rem !important; border-radius: 14px !important; }
        }

        @media (max-height: 500px) {
          .event-sheet-container {
            padding: 10px 20px 12px;
            border-radius: 20px 20px 0 0;
          }
          .sheet-handle { margin: -6px auto 8px; height: 4px; }
          .sheet-layout { gap: 8px; }
          .event-badge { width: 40px !important; height: 40px !important; font-size: 1.2rem !important; border-radius: 10px !important; }
          .event-title { font-size: 0.9rem !important; }
          .event-msg { font-size: 0.7rem !important; }
          .sheet-confirm-btn { padding: 10px !important; font-size: 0.85rem !important; border-radius: 10px !important; }
          .sheet-header { min-width: auto !important; margin-bottom: 6px; }
        }

        .sheet-handle {
          width: 50px; height: 6px; background: #8B4513; border-radius: 3px;
          margin: -10px auto 10px;
          box-shadow: 0 2px 4px rgba(106,62,22,0.3);
        }

        .sheet-layout {
          display: flex; flex-direction: column; gap: 10px;
        }
        @media (min-width: 850px) {
          .sheet-layout { flex-direction: row; align-items: stretch; gap: 24px; }
        }

        .sheet-header {
          display: flex; align-items: center; gap: 10px; min-width: 280px;
        }
        
        @media (min-width: 1024px) {
          .sheet-header {
            flex: 1;
            padding: 24px 16px;
            background: rgba(106, 62, 22, 0.04);
            border-radius: 28px;
            border: 2px dashed rgba(106, 62, 22, 0.15);
            justify-content: center;
            min-height: 320px;
          }
        }
        
        .desktop-graphic-card {
          display: none;
        }
        
        @media (min-width: 1024px) {
          .desktop-graphic-card {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            width: 100%;
          }
          
          .glowing-orb {
            position: relative;
            width: 130px;
            height: 130px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 35px var(--glow-color), inset 0 0 15px rgba(255,255,255,0.6);
            border: 4px solid white;
          }
          
          .floating-emoji {
            font-size: 5.5rem;
            animation: iconBounce 3s infinite ease-in-out;
            user-select: none;
          }
        }

        .event-badge {
          display: none;
        }
        .title-stack { flex: 1; }
        .event-title { margin: 0; font-size: 1.4rem; font-weight: 900; color: #4A2E1B; text-transform: uppercase; line-height: 1.2; text-shadow: 0 1px 0 rgba(255,255,255,0.4); }
        
        @media (min-width: 1024px) {
          .event-title {
            font-size: 2.1rem !important;
            line-height: 1.25 !important;
          }
        }
        
        .event-msg { 
          margin: 4px 0 0; font-size: 0.9rem; font-weight: 700; 
          color: ${activeEvent.result === 'LOSE' || activeEvent.result === 'WRONG' ? '#EF4444' : '#58CC02'}; 
        }
        
        @media (min-width: 1024px) {
          .event-msg {
            font-size: 1.2rem !important;
            margin-top: 10px !important;
          }
        }

        .sheet-body { flex: 1.4; width: 100%; display: flex; flex-direction: column; justify-content: center; }
        
        .sheet-footer { flex: 1; width: 100%; margin-top: 5px; }
        .sheet-footer.content-integrated { margin-top: 10px; }
        .sheet-confirm-btn {
          width: 100%; padding: 14px; border-radius: 16px;
          background: linear-gradient(135deg, #D4A373, #A26E40); color: #FFFDF5; border: 2px solid #EAB308;
          font-weight: 900; font-size: 1.1rem; cursor: pointer;
          box-shadow: 0 6px 0 #6A3E16, 0 8px 20px rgba(106,62,22,0.3); transition: all 0.1s;
          text-transform: uppercase; letter-spacing: 1px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .sheet-confirm-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #6A3E16; }

        @keyframes overlayFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sheetSlideUp { 
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
