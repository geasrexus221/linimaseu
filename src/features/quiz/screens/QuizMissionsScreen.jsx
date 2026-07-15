import React from 'react';
import { User, Calendar, Palmtree, Map as MapIcon, ChevronLeft, Star, FlaskConical } from 'lucide-react';
import { QUIZ_THEMES } from '../../../data/quizData';
import { ALL_QUIZ_QUESTIONS } from '../../../data/quizQuestions';
import { useNavigationStore } from '../../../store/useNavigationStore';

export default function QuizMissionsScreen() {
  const { setQuizSubView, setSelectedPillar, selectedKelas, setSelectedKelas } = useNavigationStore();
  
  const pillars = [
    {
      id: 'ipas',
      title: 'Ilmu Pengetahuan Alam & Sosial',
      desc: 'Sains, fenomena alam, dan kehidupan sosial.',
      icon: <FlaskConical size={40} />,
      color: '#1cb0f6'
    },
    { 
      id: 'matematika', 
      title: 'Matematika', 
      desc: 'Berhitung, logika, dan pemecahan masalah.',
      icon: <MapIcon size={40} />, 
      color: '#f4c265'
    },
    { 
      id: 'bahasa', 
      title: 'Bahasa Indonesia', 
      desc: 'Membaca, menulis, dan memahami teks.',
      icon: <Palmtree size={40} />, 
      color: '#58cc02'
    },
    { 
      id: 'pkn', 
      title: 'Pend. Pancasila', 
      desc: 'Nilai kebangsaan, gotong royong, dan toleransi.',
      icon: <Star size={40} />, 
      color: '#ce82ff'
    }
  ].map(p => {
    // Only count themes that actually have questions in the registry AND match the selected class
    const themes = QUIZ_THEMES[p.id] || [];
    const activeThemes = themes.filter(t => {
      const hasQuestions = ALL_QUIZ_QUESTIONS[t.id];
      const matchesKelas = selectedKelas === 'Semua' || t.kelas === selectedKelas;
      return hasQuestions && matchesKelas;
    });
    return { ...p, count: activeThemes.length };
  });

  return (
    <div className="quiz-missions-container">
      <div className="missions-header">
        <button className="back-btn-simple" onClick={() => setQuizSubView('hub')}>
          <ChevronLeft size={24} />
          <span>KEMBALI</span>
        </button>
        <h2 className="missions-title">Misi Kuis IPAS</h2>
        <p className="missions-subtitle">Pilih pilar ilmu yang ingin kamu jelajahi hari ini.</p>
        
        {/* Class Filter Bar */}
        <div className="class-filter-bar">
          {['Semua', 4, 5, 6].map(kelas => (
            <button 
              key={kelas}
              className={`class-filter-btn ${selectedKelas === kelas ? 'active' : ''}`}
              onClick={() => setSelectedKelas(kelas)}
            >
              {kelas === 'Semua' ? 'Semua Kelas' : `Kelas ${kelas}`}
            </button>
          ))}
        </div>
      </div>

      <div className="pillars-grid">
        {pillars.map((pillar) => (
          <div 
            key={pillar.id} 
            className={`pillar-card ${pillar.count === 0 ? 'is-empty' : ''}`}
            style={{ '--pillar-color': pillar.color }}
            onClick={() => {
              if (pillar.count > 0) {
                setSelectedPillar(pillar);
                setQuizSubView('themes');
              }
            }}
          >
            <div className="pillar-icon-wrapper">
              {pillar.icon}
            </div>
            <div className="pillar-content">
              <h3 className="pillar-name">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.desc}</p>
              <div className="pillar-footer">
                <div className={`pillar-stat-pill ${pillar.count === 0 ? 'empty-pill' : 'active-pill'}`}>
                  <Star size={14} fill="currentColor" />
                  <span>{pillar.count} Kuis</span>
                </div>
                <div className="go-btn">{pillar.count > 0 ? 'MULAI' : 'SEGERA'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .quiz-missions-container {
          flex: 1;
          background: var(--background-color);
          overflow-y: auto;
          padding: 20px;
          padding-bottom: 100px;
        }
        .missions-header { margin-bottom: 25px; }
        .back-btn-simple {
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 15px;
          cursor: pointer;
          padding: 0;
        }
        .missions-title {
          font-weight: 900;
          font-size: 1.8rem;
          color: var(--text-color);
          margin-bottom: 6px;
        }
        .missions-subtitle {
          font-weight: 700;
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .class-filter-bar {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          overflow-x: auto;
          padding-bottom: 5px;
        }

        .class-filter-btn {
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid var(--border-color);
          background: var(--card-bg);
          color: var(--text-muted);
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .class-filter-btn.active {
          background: #1cb0f6;
          color: white;
          border-color: #1899d6;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        .pillar-card {
          background: var(--card-bg);
          border: 3px solid var(--border-color);
          border-radius: 28px;
          padding: 20px;
          display: flex;
          gap: 20px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 8px 0 var(--border-color);
          position: relative;
          overflow: hidden;
        }
        .pillar-card.is-empty {
          opacity: 0.7; filter: grayscale(0.5); cursor: default;
        }
        .pillar-card.is-empty:active { transform: none; box-shadow: 0 8px 0 var(--border-color); }
        
        .pillar-icon-wrapper {
          width: 80px; height: 80px; background: var(--pillar-color);
          border-radius: 20px; display: flex; justify-content: center; align-items: center;
          color: white; flex-shrink: 0; box-shadow: 0 6px 0 rgba(0,0,0,0.1);
        }

        .pillar-content { flex: 1; display: flex; flex-direction: column; }
        .pillar-name { font-weight: 900; font-size: 1.2rem; color: var(--text-color); margin-bottom: 5px; }
        .pillar-desc { font-weight: 700; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px; }
        
        .pillar-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .pillar-stat-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 50px;
          font-weight: 900; font-size: 0.75rem;
        }
        .active-pill { background: rgba(0,0,0,0.05); color: var(--pillar-color); }
        .empty-pill { background: #f0f0f0; color: #999; }

        .go-btn {
          background: var(--pillar-color); color: white;
          padding: 6px 16px; border-radius: 12px;
          font-weight: 900; font-size: 0.8rem;
          box-shadow: 0 4px 0 rgba(0,0,0,0.1);
        }
        .is-empty .go-btn { background: #ccc; box-shadow: 0 4px 0 #bbb; }

        .pillar-content { flex: 1; display: flex; flex-direction: column; }
        .pillar-name { font-weight: 900; font-size: 1.2rem; color: var(--text-color); margin-bottom: 5px; }
        .pillar-desc { font-weight: 700; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px; }
        
        .pillar-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .pillar-stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,0,0,0.05);
          padding: 4px 10px;
          border-radius: 50px;
          font-weight: 900;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .go-btn {
          background: var(--pillar-color);
          color: white;
          padding: 6px 16px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 0.8rem;
          box-shadow: 0 4px 0 rgba(0,0,0,0.1);
        }

        [data-theme='dark'] .pillar-card {
          border-color: var(--border-color);
        }
      `}</style>
    </div>
  );
}
