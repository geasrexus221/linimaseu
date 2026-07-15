import React, { useEffect } from 'react';
import { Home, RotateCcw, Star, CheckCircle, Target } from 'lucide-react';
import character1podium2 from '../../assets/UI/Character/character1podium2.svg';
import character1fail from '../../assets/UI/Character/character1fail.svg';
import { soundManager } from '../../utils/SoundManager';

export default function QuizResult({ score, correctAnswers, totalQuestions, onFinish, onRetry, hideConfetti = false }) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isSuccess = percentage >= 60;
  
  let title = "TERUS BELAJAR!";
  let subtitle = "Jangan menyerah, proses belajar itu sangat seru!";
  let color = "#ff4b4b";

  if (percentage >= 100) {
    title = "LUAR BIASA!";
    subtitle = "Sempurna! Kamu menguasai materi ini sepenuhnya.";
    color = "#f4c265";
  } else if (percentage >= 80) {
    title = "SANGAT HEBAT!";
    subtitle = "Sedikit lagi menuju sempurna, kamu hebat!";
    color = "#58cc02";
  } else if (percentage >= 60) {
    title = "BAGUS SEKALI!";
    subtitle = "Kamu sudah memahami dasar-dasarnya dengan baik.";
    color = "#1cb0f6";
  }

  useEffect(() => {
    if (isSuccess) {
      soundManager.play('success', 0.8);
    } else {
      soundManager.play('wrong', 0.8);
    }
  }, [isSuccess]);

  return (
    <div className="result-container">


      <div className="result-card">
        <div className="trophy-section" style={{ 
          '--accent-color': color,
          '--accent-glow': isSuccess ? 'rgba(251, 191, 36, 0.3)' : 'rgba(239, 68, 68, 0.25)'
        }}>
          <div className="char-showcase-container">
            <div className="char-aura-glow" />
            <img 
              src={isSuccess ? character1podium2 : character1fail} 
              alt="Status Karakter" 
              className="char-sprite-img"
            />
          </div>
          <h1 className="result-title">{title}</h1>
          <p className="result-subtitle">{subtitle}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <Target size={20} color="#1cb0f6" />
            <span className="stat-val">{percentage}%</span>
            <span className="stat-label">Akurasi</span>
          </div>
          <div className="stat-box">
            <CheckCircle size={20} color="#58cc02" />
            <span className="stat-val">{correctAnswers}/{totalQuestions}</span>
            <span className="stat-label">Benar</span>
          </div>
          <div className="stat-box">
            <Star size={20} color="#f4c265" />
            <span className="stat-val">+{score}</span>
            <span className="stat-label">Bintang</span>
          </div>
        </div>

        <div className="result-actions">
          <button className="btn-finish" onClick={onFinish}>
            <Home size={20} />
            <span>SELESAI</span>
          </button>
          <button className="btn-retry" onClick={onRetry}>
            <RotateCcw size={20} />
            <span>MAIN LAGI</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .result-container {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.8); display: flex; justify-content: center;
          align-items: center; z-index: 5000; padding: 20px;
          backdrop-filter: blur(8px);
        }
        .result-card {
          background: var(--card-bg); width: 100%; max-width: 400px;
          border-radius: 40px; border: 4px solid var(--border-color);
          overflow: hidden; animation: popUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          position: relative;
          z-index: 10;
        }
        @keyframes popUp { from { transform: scale(0.8) translateY(50px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .trophy-section {
          padding: 30px 20px 25px; background: linear-gradient(to bottom, #fff, var(--background-color));
          text-align: center; border-bottom: 2px solid var(--border-color);
        }
        .char-showcase-container {
          position: relative;
          height: 180px;
          margin-bottom: 15px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          overflow: visible;
        }
        .char-aura-glow {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }
        .char-sprite-img {
          height: 175px;
          object-fit: contain;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.12));
          animation: characterRise 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes characterRise {
          from { transform: translateY(25px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .result-title { font-weight: 900; font-size: 1.8rem; color: var(--accent-color); margin-bottom: 8px; }
        .result-subtitle { font-weight: 700; color: var(--text-muted); font-size: 0.9rem; line-height: 1.4; padding: 0 20px; }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding: 25px; }
        .stat-box {
          background: var(--background-color); padding: 15px 5px; border-radius: 20px;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          border: 2px solid var(--border-color);
        }
        .stat-val { font-weight: 900; font-size: 1.2rem; color: var(--text-color); }
        .stat-label { font-weight: 800; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }

        .result-actions { padding: 0 25px 25px; display: flex; flex-direction: column; gap: 12px; }
        .btn-finish {
          background: #58cc02; color: white; border: none; padding: 18px;
          border-radius: 20px; font-weight: 900; font-size: 1.1rem;
          display: flex; justify-content: center; align-items: center; gap: 10px;
          cursor: pointer; box-shadow: 0 6px 0 #46a302;
        }
        .btn-finish:active { transform: translateY(4px); box-shadow: 0 2px 0 #46a302; }
        
        .btn-retry {
          background: white; color: var(--text-muted); border: 2px solid var(--border-color);
          padding: 15px; border-radius: 20px; font-weight: 900; font-size: 1rem;
          display: flex; justify-content: center; align-items: center; gap: 10px;
          cursor: pointer; box-shadow: 0 4px 0 var(--border-color);
        }
        .btn-retry:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--border-color); }

        /* CONFETTI */
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
      `}</style>
    </div>
  );
}
