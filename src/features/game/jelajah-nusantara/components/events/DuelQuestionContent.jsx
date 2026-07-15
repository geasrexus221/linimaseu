import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Clock } from 'lucide-react';
import { soundEngine } from '../../logic/soundEngine';

export default function DuelQuestionContent({ activeEvent, question, opponent, onAnswer, isChallengerLocal }) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const isAI = opponent.type === 'ai';
  const aiStarted = useRef(false);

  const isResolved = activeEvent?.status === 'RESOLVED';

  useEffect(() => {
    if (isResolved || isConfirmed || isAI) return;
    if (timeLeft <= 0) {
      onAnswer(-1); // Timer out: automatic loss
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isResolved, isConfirmed, isAI, onAnswer]);

  // AI Logic
  useEffect(() => {
    // Reset AI state when a new question starts
    if (!isResolved) {
      aiStarted.current = false;
    }
  }, [question?.text, opponent?.id, isResolved]);

  useEffect(() => {
    if (isAI && !aiStarted.current && !isResolved) {
      aiStarted.current = true;
      const thinkTime = 2000 + Math.random() * 2000;
      const timer = setTimeout(() => {
        // 50/50 success rate for bots
        const isCorrect = Math.random() < 0.5;
        const answer = isCorrect ? question.correct : (question.correct + 1) % 4;
        
        setSelectedIdx(answer);
        setIsConfirmed(true);

        if (answer === question.correct) {
          soundEngine.playSound('correct');
        } else {
          soundEngine.playSound('blink');
        }

        // Auto-continue for AI after showing the answer for 2.5 seconds
        setTimeout(() => {
          onAnswer(answer);
        }, 2500);
      }, thinkTime);
      return () => clearTimeout(timer);
    }
  }, [isAI, question, onAnswer, isResolved]);

  return (
    <div className="duel-question-container">
      {/* Turn Info Banner / Outcome Banner */}
      {isResolved ? (
        <div className={`duel-outcome-banner ${activeEvent.result === 'LOSE' ? 'correct-status' : 'incorrect-status'}`}>
          <div className="banner-content">
            <span className="banner-icon">{activeEvent.result === 'LOSE' ? '✅' : '❌'}</span>
            <div className="banner-text">
              <strong>{activeEvent.result === 'LOSE' ? `${opponent.name.toUpperCase()} JAWABAN BENAR!` : `${opponent.name.toUpperCase()} JAWABAN SALAH!`}</strong>
              <span>{activeEvent.result === 'LOSE' ? `${opponent.name} menjawab kuis dengan benar!` : `${opponent.name} salah menjawab kuis!`}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="duel-turn-banner">
          {isAI ? (
            <div className="banner-content ai">
              <span className="banner-icon">🤖</span>
              <div className="banner-text">
                <strong>Giliran {opponent.name} (Komputer)</strong>
                <span>Menunggu jawaban otomatis...</span>
              </div>
            </div>
          ) : (
            <div className="banner-content human">
              <span className="banner-icon">👉</span>
              <div className="banner-text">
                <strong>Serahkan perangkat ke {opponent.name}!</strong>
                <span>Giliran {opponent.name} menjawab kuis.</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="question-box">
        <div className="question-header">
          <HelpCircle size={20} color="#3B82F6" />
          <span>PERTANYAAN UNTUK {opponent.name.toUpperCase()}</span>
          {!isResolved && !isConfirmed && (
            <div className="timer">
               <Clock size={14} /> {timeLeft}s
            </div>
          )}
        </div>
        <p className="question-text">{question.text}</p>
      </div>

      <div className="options-container-relative">
        <div className="options-grid">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrectAnswer = idx === question.correct;
            
            let styleOverrides = {};

            if (isConfirmed) {
              if (isCorrectAnswer) {
                styleOverrides = {
                  background: '#58CC02',
                  border: '3px solid #58CC02',
                  borderBottom: '7px solid #46A302',
                  boxShadow: '0 0 15px rgba(88,204,2,0.8)',
                  transform: 'scale(1.02)'
                };
              } else if (isSelected) {
                styleOverrides = {
                  background: '#FF4B4B',
                  border: '3px solid #FF4B4B',
                  borderBottom: '7px solid #D32F2F',
                  boxShadow: '0 0 15px rgba(255,75,75,0.8)',
                  opacity: 1
                };
              } else {
                styleOverrides = {
                  opacity: 0.25,
                  filter: 'grayscale(0.8)',
                  cursor: 'default'
                };
              }
            } else if (selectedIdx !== null) {
              if (isSelected) {
                styleOverrides = {
                  border: '3px solid #FFF',
                  boxShadow: '0 0 15px rgba(255,255,255,0.8)',
                  transform: 'translateY(-2px)'
                };
              } else {
                styleOverrides = {
                  opacity: 0.6
                };
              }
            }

            return (
              <button 
                key={idx} 
                className="option-btn" 
                style={styleOverrides}
                disabled={isAI || isConfirmed || isResolved}
                onClick={() => {
                  if (isConfirmed) return;
                  setSelectedIdx(idx);
                  soundEngine.playSound('click');
                }}
              >
                <span className="option-idx">{String.fromCharCode(65 + idx)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {isAI && !isConfirmed && !isResolved && (
          <div className="ai-overlay-notice">
            <div className="ai-spinner-glow" />
            <span>Menunggu {opponent.name} Memilih Jawaban...</span>
          </div>
        )}
      </div>

      {!isAI && !isResolved && (
        <div className="confirm-section" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          {!isConfirmed ? (
            <button
              className="quiz-action-btn confirm-btn"
              disabled={selectedIdx === null}
              onClick={() => {
                setIsConfirmed(true);
                if (selectedIdx === question.correct) {
                  soundEngine.playSound('correct');
                } else {
                  soundEngine.playSound('blink');
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                background: selectedIdx === null ? '#9CA3AF' : '#58CC02',
                color: 'white',
                border: 'none',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: selectedIdx === null ? 'not-allowed' : 'pointer',
                boxShadow: selectedIdx === null ? 'none' : '0 4px 0 #46A302',
                transition: 'all 0.1s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Konfirmasi Jawaban
            </button>
          ) : (
            <button
              className="quiz-action-btn continue-btn"
              onClick={() => {
                soundEngine.playSound('click');
                onAnswer(selectedIdx);
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #1D4ED8',
                transition: 'all 0.1s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Lanjutkan
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .duel-question-container { width: 100%; font-family: 'Outfit', sans-serif; }
        
        .duel-turn-banner {
          background: #FFFBEB; border: 2.5px solid #FCD34D; border-radius: 14px;
          padding: 8px 12px; margin-bottom: 10px; text-align: left;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        
        .duel-outcome-banner {
          border-radius: 16px;
          padding: 12px 16px; margin-bottom: 12px; text-align: left;
          transition: all 0.3s ease;
        }
        .duel-outcome-banner.correct-status {
          background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
          border: 3px solid #10B981;
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.15);
        }
        .duel-outcome-banner.correct-status strong {
          color: #065F46; font-size: 0.95rem; font-weight: 950;
        }
        .duel-outcome-banner.correct-status span {
          color: #047857; font-size: 0.72rem; font-weight: 800;
        }
        .duel-outcome-banner.incorrect-status {
          background: linear-gradient(135deg, #FEF2F2, #FEE2E2);
          border: 3px solid #EF4444;
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.15);
        }
        .duel-outcome-banner.incorrect-status strong {
          color: #991B1B; font-size: 0.95rem; font-weight: 950;
        }
        .duel-outcome-banner.incorrect-status span {
          color: #B91C1C; font-size: 0.72rem; font-weight: 800;
        }
        .duel-outcome-banner .banner-icon {
          font-size: 1.8rem;
          animation: pulseIcon 1.5s infinite alternate;
        }
        @keyframes pulseIcon {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .banner-content { display: flex; align-items: center; gap: 10px; }
        .banner-icon { font-size: 1.4rem; }
        .banner-text { display: flex; flex-direction: column; gap: 2px; }
        .banner-text strong { font-size: 0.8rem; font-weight: 950; color: #D97706; }
        .banner-text span { font-size: 0.68rem; font-weight: 800; color: #B45309; line-height: 1.25; }

        .question-box {
          background: #111; border: 2px solid #333; border-radius: 14px;
          padding: 12px 16px; margin-bottom: 10px; position: relative;
        }
        .question-header { 
          display: flex; align-items: center; gap: 8px; font-size: 0.68rem; 
          font-weight: 900; color: #777; margin-bottom: 8px; letter-spacing: 1px;
        }
        .timer { margin-left: auto; display: flex; align-items: center; gap: 4px; color: #EF4444; }
        .question-text { margin: 0; font-size: 0.95rem; font-weight: 800; color: white; line-height: 1.4; }

        .options-container-relative { position: relative; border-radius: 14px; overflow: hidden; }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; transition: all 0.2s; }
        .options-grid.ai-disabled { opacity: 0.35; pointer-events: none; filter: grayscale(0.4); }

        .ai-overlay-notice {
          position: absolute; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; color: white; font-weight: 950; font-size: 0.85rem;
          border-radius: 14px; backdrop-filter: blur(1.5px);
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .ai-spinner-glow {
          width: 28px; height: 28px; border: 3px solid #f4c265; border-top-color: transparent;
          border-radius: 50%; animation: spin 1s linear infinite;
        }

        .option-btn {
          border-radius: 14px; color: white; cursor: pointer;
          font-weight: 900; font-size: 0.8rem; display: flex; align-items: center; gap: 10px;
          padding: 8px 12px; text-align: left; transition: all 0.1s;
          font-family: 'Outfit', sans-serif;
          min-height: 48px;
        }
        .option-btn:nth-child(1) { background: #FF4B4B; border: 3px solid #FF4B4B; border-bottom: 5px solid #D32F2F; }
        .option-btn:nth-child(2) { background: #1CB0F6; border: 3px solid #1CB0F6; border-bottom: 5px solid #1899D6; }
        .option-btn:nth-child(3) { background: #f4c265; border: 3px solid #f4c265; border-bottom: 5px solid #D97706; }
        .option-btn:nth-child(4) { background: #58CC02; border: 3px solid #58CC02; border-bottom: 5px solid #46A302; }

        .option-btn:hover:not(:disabled) { filter: brightness(1.06); }
        .option-btn:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 2px; }
        .option-btn:disabled { cursor: not-allowed; }

        .quiz-action-btn:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: none !important;
        }

        .option-idx {
          width: 24px; height: 24px; background: rgba(255,255,255,0.25); border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 950; color: white; flex-shrink: 0;
          border: 1.5px solid rgba(255,255,255,0.4);
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .question-box { padding: 15px; margin-bottom: 15px; }
          .question-text { font-size: 1rem; }
          .options-grid { grid-template-columns: 1fr; gap: 8px; }
          .option-btn { padding: 12px; font-size: 0.85rem; }
          .quiz-action-btn { padding: 12px !important; font-size: 0.95rem !important; border-radius: 12px !important; }
        }

        @media (max-height: 500px) {
          .duel-turn-banner { padding: 8px 12px; margin-bottom: 8px; }
          .banner-icon { font-size: 1.3rem; }
          .banner-text span { font-size: 0.65rem; }
          .question-box { padding: 12px; margin-bottom: 10px; }
          .question-text { font-size: 0.9rem; }
          .options-grid { grid-template-columns: 1fr 1fr; gap: 6px; }
          .option-btn { padding: 8px 12px; font-size: 0.75rem; }
          .option-idx { width: 22px; height: 22px; font-size: 0.7rem; }
          .quiz-action-btn { padding: 10px !important; font-size: 0.85rem !important; border-radius: 10px !important; }
        }
      `}</style>
    </div>
  );
}
