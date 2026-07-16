import React, { useState } from 'react';
import { Check, Lock, Book, X, MapPin, Calendar, Gift, Sparkles } from 'lucide-react';
import { getStoryData } from '../../../data/story/storyRegistry';
import bgPath from '../../../assets/UI BG/path story raden dewi.png';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { soundManager } from '../../../utils/SoundManager';

const PathConnector = ({ fromX, toX, gap }) => {
  const dx = toX - fromX;
  const dy = gap;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div 
      className="path-connector-container"
      style={{
        width: `${distance}px`,
        transform: `rotate(${angle}deg)`,
        left: `calc(50% + ${fromX}px)`,
        top: '65px', 
      }}
    >
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default function ChapterScreen() {
  const { unlockedChapters, completedChapters } = useStore();
  const { 
    selectedHero: hero, 
    setCurrentView, 
    setActiveChapter, 
    goBackToHeroGrid: onBack 
  } = useNavigationStore();
  
  const [showBio, setShowBio] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  const storyData = getStoryData(hero?.id);
  
  if (!storyData) {
    return (
      <div className="chapter-container" style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
        <h2>Data Belum Tersedia</h2>
        <p>Konten untuk pahlawan ini sedang dalam pengembangan.</p>
        <button onClick={onBack} className="back-btn-fallback">KEMBALI</button>
        <style jsx>{`
          .back-btn-fallback {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 900;
            margin-top: 20px;
          }
        `}</style>
      </div>
    );
  }

  const currentStory = storyData.story; 
  const currentBio = storyData.bio;

  const getStatus = (chapterId) => {
    if (completedChapters.includes(chapterId)) return 'completed';
    if (unlockedChapters.includes(chapterId)) return 'active';
    return 'locked';
  };

  const getX = (id) => {
    const offsets = { 1: -80, 2: 100, 3: 0, 4: -130, 5: 110 };
    return offsets[id] || 0;
  };

  const gapValue = 80 + 130; 

  return (
    <div className="chapter-container" style={{ 
      backgroundImage: `url("${bgPath}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'local',
      minHeight: '100%'
    }}>
      
      <div className="chapter-banner">
        <button 
          onClick={onBack}
          style={{ 
            background: 'none', border: 'none', color: 'white', 
            fontWeight: '900', cursor: 'pointer', marginBottom: '10px',
            display: 'block'
          }}
        >
          ← KEMBALI
        </button>
        <h2 className="unit-title">{currentStory.name}</h2>
        <p className="unit-desc">{currentStory.description}</p>
        <div className="notebook-btn" onClick={() => setShowBio(true)}>
          <Book color="white" size={24} />
        </div>
      </div>

      
      <div className="chapter-path">
        {currentStory.chapters.map((chapter, index) => {
          const status = getStatus(chapter.id);
          const posClass = `chapter-node-pos-${chapter.id}`;
          const isLast = index === currentStory.chapters.length - 1;
          
          return (
            <div key={chapter.id} className={`char-node-container ${posClass}`} style={{ position: 'relative' }}>
              {!isLast && (
                <PathConnector 
                  fromX={0} 
                  toX={getX(chapter.id + 1) - getX(chapter.id)} 
                  gap={gapValue} 
                />
              )}

              <div className={`char-ring ${status === 'active' ? 'active' : ''}`}>
                <div 
                  className={`char-node ${status === 'locked' ? 'locked' : 'active'}`}
                  style={{ 
                    backgroundColor: status === 'completed' ? '#58cc02' : status === 'active' ? '#ffc800' : 'rgba(255, 255, 255, 0.7)',
                    boxShadow: status === 'completed' ? '0 6px 0 #46a302' : status === 'active' ? '0 6px 0 #d1a34b' : '0 6px 0 #e5e5e5',
                    backdropFilter: status === 'locked' ? 'blur(4px)' : 'none',
                    zIndex: 2
                  }}
                  onClick={() => {
                    if (status !== 'locked') {
                      soundManager.play('node_pop', 0.5);
                      setSelectedChapter(chapter);
                    } else {
                      soundManager.play('error', 0.4);
                    }
                  }}
                >
                  {status === 'active' && <div className="start-bubble">START</div>}
                  {status === 'completed' ? (
                    <Check color="white" strokeWidth={4} size={32} />
                  ) : status === 'locked' ? (
                    <Lock color="#afafaf" size={24} />
                  ) : (
                    <span style={{ fontSize: '2rem', color: 'white' }}>★</span>
                  )}
                </div>

                
                {isLast && (
                  <div className={`reward-chest-container ${status === 'completed' ? 'unlocked' : 'locked'}`}>
                    <div className="chest-bubble">HADIAH!</div>
                    <div className="chest-icon-wrapper">
                      {status === 'completed' ? (
                        <div className="opened-reward">
                          <Sparkles className="reward-sparkle" color="#FFD700" size={40} />
                          <span className="reward-emoji">💎</span>
                        </div>
                      ) : (
                        <Gift className="closed-chest" size={32} color="#FFD700" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      
      {selectedChapter && (
        <div className="synopsis-modal-overlay">
          <div className="synopsis-card">
            <button className="close-synopsis" onClick={() => setSelectedChapter(null)}>
              <X size={20} />
            </button>
            
            <div className="synopsis-header">
              <span className="chapter-number">BAB {selectedChapter.id}</span>
              <h3 className="chapter-title">{selectedChapter.title}</h3>
            </div>

            <div className="synopsis-body">
              <p>{selectedChapter.subtitle}</p>
            </div>

            <button 
              className="start-chapter-btn"
              onClick={() => {
                setActiveChapter(selectedChapter);
                setSelectedChapter(null);
              }}
            >
              MULAI BELAJAR
            </button>
          </div>
        </div>
      )}

      
      {showBio && (
        <div className="bio-modal-overlay">
          <div className="bio-modal-content">
            <button className="close-bio" onClick={() => setShowBio(false)}>
              <X size={24} />
            </button>
            
            <div className="bio-header">
              <div className="hero-img-placeholder">
                <span style={{ fontSize: '4rem' }}>{hero.icon}</span>
              </div>
              <h2 className="hero-name-big">{currentBio.name}</h2>
              <div className="bio-meta">
                <div className="meta-item"><Calendar size={16}/> {currentBio.birthDate}</div>
                <div className="meta-item"><MapPin size={16}/> {currentBio.origin}</div>
              </div>
            </div>

            <div className="bio-body">
              <h3 className="bio-subtitle">Biografi Singkat</h3>
              <p className="bio-text">{currentBio.description}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .chapter-container {
          position: relative;
          min-height: 100%;
          width: 100%;
          overflow-x: hidden;
          animation: chapterFadeIn 1s ease-out forwards;
        }
        @media (max-width: 600px) 
        .bio-modal-content {
          pointer-events: auto; /* Re-enable clicks for content */
          background: var(--card-bg); width: 100%; max-width: 450px;
          border-radius: 32px; position: relative; padding: 30px;
          max-height: 85vh; overflow-y: auto; color: var(--text-color);
          border: 4px solid var(--border-color);
        }

        /* Synopsis Modal Styles */
        .synopsis-modal-overlay {
          position: fixed; inset: 0;
          display: flex; justify-content: center; align-items: center;
          z-index: 4000; padding: 20px;
          pointer-events: none;
        }
        .synopsis-card {
          pointer-events: auto;
          background: var(--card-bg); width: 100%; max-width: 320px;
          border-radius: 28px; padding: 25px; position: relative;
          border: 4px solid var(--border-color);
          box-shadow: 0 20px 0 rgba(0,0,0,0.1);
          animation: popUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp { from { transform: scale(0.8) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .synopsis-header { text-align: center; margin-bottom: 15px; }
        .chapter-number {
          display: inline-block; background: #CE82FF; color: white;
          padding: 2px 10px; border-radius: 50px; font-weight: 900; font-size: 0.65rem;
          margin-bottom: 5px;
        }
        .chapter-title { font-weight: 900; font-size: 1.3rem; color: var(--text-color); margin: 0; }

        .synopsis-body { 
          background: rgba(0,0,0,0.03); padding: 15px; border-radius: 18px;
          margin-bottom: 20px; text-align: center;
        }
        .synopsis-body p { margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--text-color); line-height: 1.4; }

        .start-chapter-btn {
          width: 100%; background: #58CC02; color: white; border: none;
          padding: 15px; border-radius: 18px; font-weight: 900; font-size: 1rem;
          box-shadow: 0 6px 0 #46A302; cursor: pointer; transition: transform 0.1s;
        }
        .start-chapter-btn:active { transform: translateY(3px); box-shadow: 0 3px 0 #46A302; }

        /* Reward Chest Styles */
        .reward-chest-container {
          position: absolute; top: -40px; right: -60px;
          display: flex; flex-direction: column; align-items: center;
          z-index: 10; animation: chestFloat 3s ease-in-out infinite;
        }
        @keyframes chestFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .chest-bubble {
          background: #FFD700; color: #8B4513; font-weight: 900;
          font-size: 0.6rem; padding: 2px 8px; border-radius: 8px;
          margin-bottom: 5px; box-shadow: 0 2px 0 rgba(0,0,0,0.1);
          border: 2px solid white;
        }

        .chest-icon-wrapper {
          width: 50px; height: 50px; background: white;
          border-radius: 15px; border: 3px solid #FFD700;
          display: flex; justify-content: center; align-items: center;
          box-shadow: 0 4px 0 #DAA520; position: relative;
        }

        .reward-chest-container.unlocked .chest-icon-wrapper {
          background: radial-gradient(circle, #FFF9C4, #FFF);
          border-color: #58CC02; box-shadow: 0 4px 0 #46A302, 0 0 20px #FFD700;
          animation: pulseUnlocked 2s infinite;
        }
        @keyframes pulseUnlocked {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .opened-reward { position: relative; display: flex; justify-content: center; align-items: center; }
        .reward-emoji { font-size: 1.8rem; z-index: 2; }
        :global(.reward-sparkle) {
          position: absolute; z-index: 1;
          animation: rotateSparkle 4s linear infinite;
        }
        @keyframes rotateSparkle { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .reward-chest-container.locked { filter: grayscale(0.5); opacity: 0.8; }
      `}</style>
    </div>
  );
}
