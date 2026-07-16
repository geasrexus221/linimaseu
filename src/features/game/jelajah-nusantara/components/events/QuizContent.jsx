import React, { useState } from 'react';
import { soundEngine } from '../../logic/soundEngine';

export default function QuizContent({ question, onAnswer }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleOptionClick = (idx) => {
    if (isConfirmed) return;
    setSelectedIdx(idx);
    soundEngine.playSound('click');
  };

  const handleConfirmClick = () => {
    if (selectedIdx === null) return;
    setIsConfirmed(true);
    if (selectedIdx === question.correct) {
      soundEngine.playSound('correct');
    } else {
      soundEngine.playSound('blink');
    }
  };

  const handleContinueClick = () => {
    soundEngine.playSound('click');
    onAnswer(selectedIdx);
  };

  return (
    <div className="quiz-container">
      <div className="question-box">{question.question}</div>
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
              disabled={isConfirmed}
              onClick={() => handleOptionClick(idx)}
            >
              <span className="opt-idx">{String.fromCharCode(65 + idx)}</span>
              <span className="opt-text">{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="confirm-section" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
        {!isConfirmed ? (
          <button
            className="quiz-action-btn confirm-btn"
            disabled={selectedIdx === null}
            onClick={handleConfirmClick}
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
            onClick={handleContinueClick}
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

      <style jsx>{`
        .quiz-container { display: flex; flex-direction: column; gap: 8px; }
        .question-box {
          background: rgba(0,0,0,0.25); padding: 12px 16px; border-radius: 14px;
          color: #FFF; font-size: 0.95rem; font-weight: 850;
          line-height: 1.4; border: 3px solid rgba(255,255,255,0.12);
          text-align: left; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px; }
        .option-btn {
          display: flex; align-items: center; gap: 10px; padding: 8px 12px;
          border-radius: 14px; color: #FFF; cursor: pointer; transition: all 0.1s;
          text-align: left; min-height: 48px; font-family: 'Outfit', sans-serif;
        }
        
        .option-btn:nth-child(1) { background: #FF4B4B; border: 3px solid #FF4B4B; border-bottom: 5px solid #D32F2F; }
        .option-btn:nth-child(2) { background: #1CB0F6; border: 3px solid #1CB0F6; border-bottom: 5px solid #1899D6; }
        .option-btn:nth-child(3) { background: #f4c265; border: 3px solid #f4c265; border-bottom: 5px solid #D97706; }
        .option-btn:nth-child(4) { background: #58CC02; border: 3px solid #58CC02; border-bottom: 5px solid #46A302; }

        .option-btn:hover:not(:disabled) { filter: brightness(1.06); }
        .option-btn:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 2px; }
        
        .opt-idx {
          width: 24px; height: 24px; background: rgba(255,255,255,0.25); border-radius: 6px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          font-weight: 950; font-size: 0.85rem; color: white;
          border: 1.5px solid rgba(255,255,255,0.4);
        }
        .opt-text { font-size: 0.8rem; font-weight: 900; color: white; line-height: 1.25; }

        .quiz-action-btn:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: none !important;
        }

        @media (min-width: 1024px) {
          .quiz-container { gap: 14px; }
          .question-box {
            padding: 20px 24px;
            font-size: 1.25rem;
            border-radius: 20px;
            line-height: 1.6;
          }
          .options-grid {
            gap: 14px;
            margin-top: 12px;
          }
          .option-btn {
            padding: 14px 20px;
            border-radius: 20px;
            min-height: 64px;
          }
          .opt-idx {
            width: 32px;
            height: 32px;
            font-size: 1.05rem;
            border-radius: 8px;
          }
          .opt-text {
            font-size: 1.05rem;
          }
        }

        @media (max-height: 500px) {
          .quiz-container { gap: 6px !important; }
          .question-box { padding: 8px 12px !important; font-size: 0.8rem !important; border-radius: 10px !important; }
          .options-grid { gap: 6px !important; }
          .option-btn { padding: 6px 10px !important; min-height: 40px !important; border-radius: 10px !important; gap: 6px !important; border-bottom-width: 4px !important; }
          .option-btn:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 1.5px !important; }
          .opt-idx { width: 20px !important; height: 20px !important; font-size: 0.75rem !important; }
          .opt-text { font-size: 0.7rem !important; }
          .quiz-action-btn { padding: 8px !important; font-size: 0.85rem !important; border-radius: 10px !important; }
        }
      `}</style>
    </div>
  );
}
