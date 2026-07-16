import React, { useState } from 'react';
import { ChevronLeft, Star, Play, Clock, Trophy, Lock } from 'lucide-react';
import { QUIZ_THEMES } from '../../../data/quizData';
import { ALL_QUIZ_QUESTIONS } from '../../../data/quizQuestions';
import { useNavigationStore } from '../../../store/useNavigationStore';

export default function QuizThemeListScreen() {
  const { 
    selectedPillar, 
    setQuizSubView, 
    setActiveQuizTheme,
    selectedKelas
  } = useNavigationStore();
  
  const { 
    id: pillarId, 
    title: pillarName, 
    color: pillarColor 
  } = selectedPillar || {};

  const [selectedCount, setSelectedCount] = useState(10); 
  const themes = (QUIZ_THEMES[pillarId] || [])
    .filter(t => selectedKelas === 'Semua' || t.kelas === selectedKelas)
    .map((t) => {
      return {
        ...t,
        isActive: !!ALL_QUIZ_QUESTIONS[t.id]
      };
    });

  const difficulties = [
    { id: 10, name: 'Mudah', icon: '🌱' },
    { id: 20, name: 'Normal', icon: '🔥' },
    { id: 30, name: 'Giat Belajar', icon: '🎓' },
  ];

  return (
    <div className="theme-list-container">
      <div className="theme-header" style={{ '--header-color': pillarColor }}>
        <button className="back-btn-white" onClick={() => setQuizSubView('missions')}>
          <ChevronLeft size={24} />
          <span>KEMBALI</span>
        </button>
        <div className="header-content">
          <h2 className="pillar-title">{pillarName}</h2>
          
          
          <div className="difficulty-switcher">
            {difficulties.map((diff) => (
              <button 
                key={diff.id}
                className={`diff-tab ${selectedCount === diff.id ? 'active' : ''}`}
                onClick={() => setSelectedCount(diff.id)}
              >
                <span className="diff-emoji">{diff.icon}</span>
                <span className="diff-name">{diff.name}</span>
                {selectedCount === diff.id && <div className="active-dot" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="themes-grid">
        <p className="section-hint">Pilih tema kuis untuk mulai ({selectedCount} Soal):</p>
        {themes.map((theme) => (
          <div 
            key={theme.id} 
            className={`theme-card ${!theme.isActive ? 'is-locked' : ''}`} 
            onClick={() => {
              if (theme.isActive) {
                setActiveQuizTheme(theme, selectedCount);
                setQuizSubView('play');
              }
            }}
          >
            <div className="theme-card-left">
              <div className="theme-icon-circle">{theme.icon}</div>
            </div>
            <div className="theme-card-body">
              <h4 className="theme-title">{theme.title}</h4>
              <div className="theme-meta">
                <div className="meta-info">
                  {theme.isActive ? (
                    <>
                      <Star size={14} fill="#f4c265" color="#f4c265" />
                      <span>Misi Tersedia</span>
                    </>
                  ) : (
                    <span className="coming-soon-text">Segera Hadir</span>
                  )}
                </div>
              </div>
            </div>
            <div className="theme-card-right">
              {theme.isActive ? (
                <>
                  <div className="reward-badge">
                    <Trophy size={16} color="#f4c265" />
                    <span>+{theme.reward}</span>
                  </div>
                  <div className="play-mini-btn">
                    <Play size={18} fill="currentColor" />
                  </div>
                </>
              ) : (
                <div className="lock-icon-btn">
                  <Lock size={18} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .theme-list-container {
          flex: 1; background: var(--background-color);
          overflow-y: auto; padding-bottom: 100px;
        }
        .theme-header {
          background: var(--header-color); padding: 25px 20px 30px; color: white;
          border-bottom-left-radius: 40px; border-bottom-right-radius: 40px;
          box-shadow: 0 10px 0 rgba(0,0,0,0.05);
        }
        .back-btn-white {
          background: rgba(255,255,255,0.2); border: 2px solid white;
          color: white; border-radius: 50px; padding: 6px 12px;
          font-weight: 900; display: flex; align-items: center;
          gap: 4px; cursor: pointer; margin-bottom: 20px; font-size: 0.8rem;
        }
        .pillar-title { font-weight: 900; font-size: 1.8rem; margin-bottom: 20px; }

        /* Difficulty Switcher Styles */
        .difficulty-switcher {
          display: flex; background: rgba(0,0,0,0.15);
          padding: 6px; border-radius: 18px; gap: 6px;
        }
        .diff-tab {
          flex: 1; background: none; border: none; padding: 10px 5px;
          border-radius: 14px; color: rgba(255,255,255,0.7);
          font-weight: 900; font-size: 0.75rem; cursor: pointer;
          display: flex; flex-direction: column; align-items: center;
          position: relative; transition: all 0.2s;
        }
        .diff-tab.active { background: white; color: var(--header-color); transform: scale(1.05); }
        .diff-emoji { font-size: 1.2rem; margin-bottom: 2px; }
        .active-dot {
          width: 4px; height: 4px; background: var(--header-color);
          border-radius: 50%; margin-top: 2px;
        }

        .themes-grid { padding: 20px; display: flex; flex-direction: column; gap: 16px; margin-top: 10px; }
        .section-hint { font-weight: 900; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px; }
        
        .theme-card {
          background: var(--card-bg); border: 2px solid var(--border-color);
          border-radius: 24px; padding: 16px; display: flex; align-items: center;
          gap: 15px; cursor: pointer; box-shadow: 0 6px 0 var(--border-color);
          transition: all 0.2s;
        }
        .theme-card:active { transform: translateY(4px); box-shadow: 0 2px 0 var(--border-color); }
        .theme-card.is-locked { opacity: 0.6; filter: grayscale(0.8); cursor: default; }
        .theme-card.is-locked:active { transform: none; box-shadow: 0 6px 0 var(--border-color); }

        .theme-icon-circle {
          width: 60px; height: 60px; background: var(--background-color);
          border-radius: 50%; display: flex; justify-content: center; align-items: center;
          font-size: 2rem; border: 3px solid var(--border-color);
        }
        .theme-card-body { flex: 1; }
        .theme-title { font-weight: 900; font-size: 1.1rem; color: var(--text-color); margin-bottom: 5px; line-height: 1.2; }
        .theme-meta { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 0.75rem; color: var(--text-muted); }
        .coming-soon-text { color: #999; font-style: italic; }

        .reward-badge { display: flex; align-items: center; gap: 4px; background: #fff9eb; padding: 4px 8px; border-radius: 10px; border: 1px solid #ffe8b3; color: #f4c265; font-weight: 900; font-size: 0.8rem; }
        .play-mini-btn { width: 35px; height: 35px; background: var(--header-color); color: white; border-radius: 10px; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 0 rgba(0,0,0,0.1); }
        .lock-icon-btn { width: 35px; height: 35px; background: #eee; color: #aaa; border-radius: 10px; display: flex; justify-content: center; align-items: center; }
      `}</style>
    </div>
  );
}
