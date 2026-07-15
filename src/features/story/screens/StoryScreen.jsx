import React, { useMemo, useState } from 'react';
import { Lock, Play, ChevronRight, Star, Trophy, Sparkles } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { useRegisterRightPanel } from '../../../hooks/useRegisterRightPanel';
import DesktopStatsPanel from '../../../components/layout/DesktopStatsPanel';
import { ALL_MODULES, GRADES, SUBJECTS } from '../../../data/characters';
import TimePortalOverlay from '../components/TimePortalOverlay';
import { soundManager } from '../../../utils/SoundManager';

export default function StoryScreen() {
  const { lastModuleId, selectedGrade, setSelectedGrade, selectedSubject, setSelectedSubject, setLastModuleId } = useStore();
  const { setSelectedHero, setCurrentView } = useNavigationStore();
  
  // Register Desktop Stats Panel for this screen
  useRegisterRightPanel(DesktopStatsPanel, 'story-main');
  
  const [portalConfig, setPortalConfig] = useState(null); // { color, hero }

  const lastModule = useMemo(() => ALL_MODULES.find(m => m.id === lastModuleId), [lastModuleId]);
  const filteredModules = useMemo(() => ALL_MODULES.filter(m => m.grade === selectedGrade && m.subject === selectedSubject), [selectedGrade, selectedSubject]);
  const activeSubjectData = useMemo(() => SUBJECTS.find(s => s.id === selectedSubject), [selectedSubject]);

  const triggerPortalTransition = (module) => {
    soundManager.play('click', 0.5);
    setLastModuleId(module.id);
    setSelectedHero(module); // we use selectedHero to store active module
    setCurrentView('path');
  };

  const handlePortalComplete = () => {
    if (portalConfig?.hero) {
      setLastHeroId(portalConfig.hero.id);
      setSelectedHero(portalConfig.hero);
    }
    setPortalConfig(null);
  };

  return (
    <div className="story-screen-gallery content-container" style={{ '--era-theme': activeSubjectData?.color || '#1CB0F6' }}>
      {/* 0. Portal Overlay */}
      {portalConfig && (
        <TimePortalOverlay 
          color={portalConfig.color} 
          onComplete={handlePortalComplete} 
        />
      )}

      {/* Background Glow */}
      <div className="era-glow-backdrop" />

      {/* 1. Featured Hero - The Spotlight */}
      {lastModule && (
        <section className="featured-hero-section">
          <div className="featured-card" onClick={() => triggerPortalTransition(lastModule)}>
            <div className="featured-content">
              <span className="featured-tag">
                <Sparkles size={12} /> MODUL TERAKHIR
              </span>
              <h2 className="featured-name">{lastModule.name}</h2>
              <div className="featured-stats">
                <div className="progress-pill">
                  <div className="pill-fill" style={{ width: '45%' }} />
                  <span>45% Selesai</span>
                </div>
              </div>
            </div>
            <div className="featured-portrait">
              <div className="portrait-circle-bg" />
              <span className="hero-emoji-large">{lastModule.icon}</span>
              <div className="play-float-btn">
                <Play fill="currentColor" size={24} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Dual Filters: Grade and Subject */}
      <nav className="era-nav-gallery">
        <h3 className="gallery-section-title">Eksplorasi Modul</h3>
        
        {/* Filter Kelas */}
        <div className="era-scroll-box" style={{ marginBottom: '10px' }}>
          {GRADES.map((grade) => (
            <button 
              key={grade.id} 
              className={`era-nav-item ${selectedGrade === grade.id ? 'active' : ''}`}
              onClick={() => setSelectedGrade(grade.id)}
              style={{ '--this-era-color': '#AFAFAF', padding: '8px 16px', borderRadius: '15px' }}
            >
              <span className="era-nav-name">{grade.name}</span>
            </button>
          ))}
        </div>

        {/* Filter Pelajaran */}
        <div className="era-scroll-box">
          {SUBJECTS.map((subject) => (
            <button 
              key={subject.id} 
              className={`era-nav-item ${selectedSubject === subject.id ? 'active' : ''}`}
              onClick={() => setSelectedSubject(subject.id)}
              style={{ '--this-era-color': subject.color }}
            >
              <span className="era-nav-icon">{subject.icon}</span>
              <span className="era-nav-name">{subject.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 4. The Module Grid - Pop Out Style */}
      <div className="hero-grid-pop">
        {filteredModules.map((module, index) => (
          <div 
            key={module.id} 
            className={`hero-card-pop ${module.active ? 'active' : 'locked'}`}
            style={{ '--stagger': index }}
            onClick={() => triggerPortalTransition(module)}
          >
            <div className="hero-card-inner">
              <div className="hero-pop-visual">
                <div className="hero-pop-bg" />
                <span className="hero-pop-emoji">{module.icon}</span>
                {!module.active && <div className="hero-lock-badge"><Lock size={16} /></div>}
              </div>
              
              <div className="hero-card-details">
                <h4 className="hero-name">{module.name}</h4>
                {module.active ? (
                  <div className="hero-progress-lite">
                    <div className="lite-bar"><div className="lite-fill" style={{ width: '40%' }} /></div>
                    <span className="lite-pct">40%</span>
                  </div>
                ) : (
                  <div className="hero-locked-label">BELUM TERBUKA</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .story-screen-gallery {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-bottom: 120px;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
        }
        .story-screen-gallery::-webkit-scrollbar { display: none; }

        .era-glow-backdrop {
          position: fixed; top: 0; left: 0; right: 0; height: 300px;
          background: radial-gradient(circle at 50% -20%, var(--era-theme), transparent 70%);
          opacity: 0.15; z-index: 0; pointer-events: none;
          transition: all 0.5s ease;
        }

        /* 1. Featured Card */
        .featured-hero-section { padding: 20px; z-index: 5; }
        .featured-card {
          position: relative;
          background: linear-gradient(135deg, var(--era-theme), #1CB0F6);
          border-radius: 28px;
          padding: 20px 25px; /* Reduced padding */
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          box-shadow: 0 15px 30px -10px var(--era-theme), 0 0 20px rgba(255, 255, 255, 0.2) inset;
          border: 4px solid rgba(255,255,255,0.3);
          border-bottom: 6px solid rgba(0,0,0,0.15); /* Reduced 3D bottom edge slightly */
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: visible;
        }
        .featured-card:hover { transform: translateY(-3px) scale(1.01); }
        .featured-card:active { transform: scale(0.98) translateY(3px); border-bottom-width: 3px; margin-bottom: 3px; }

        .featured-content { flex: 1; z-index: 2; }
        .featured-tag {
          display: flex; align-items: center; gap: 6px;
          font-weight: 900; font-size: 0.7rem; letter-spacing: 1.5px;
          background: rgba(255,255,255,0.25); width: fit-content;
          padding: 5px 12px; border-radius: 50px; margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .featured-name { font-size: 1.8rem; font-weight: 900; margin: 0; line-height: 1.2; text-shadow: 0 3px 6px rgba(0,0,0,0.2); }
        .featured-stats { margin-top: 12px; }
        .progress-pill {
          background: rgba(0,0,0,0.2); border-radius: 50px;
          height: 24px; padding: 0 10px; display: flex; align-items: center; gap: 8px;
          font-size: 0.75rem; font-weight: 900; width: fit-content;
        }
        .pill-fill { height: 8px; background: #58CC02; border-radius: 10px; width: 50px; box-shadow: 0 2px 0 rgba(0,0,0,0.2); }

        .featured-portrait { position: relative; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center; margin-right: 10px; }
        .hero-emoji-large { font-size: 5.5rem; z-index: 2; transform: translateY(-10px) rotate(-5deg); filter: drop-shadow(0 10px 10px rgba(0,0,0,0.3)); animation: float-hero 3s ease-in-out infinite; }
        @keyframes float-hero { 0%, 100% { transform: translateY(-10px) rotate(-5deg); } 50% { transform: translateY(-18px) rotate(-2deg); } }
        .portrait-circle-bg { position: absolute; width: 100px; height: 100px; background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; }
        
        .play-float-btn {
          position: absolute; bottom: -5px; right: -5px;
          background: white; color: #58CC02;
          width: 45px; height: 45px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border-bottom: 4px solid #e5e7eb;
          box-shadow: 0 6px 12px rgba(0,0,0,0.2); z-index: 3;
          animation: pulse-play 2s infinite;
        }
        @keyframes pulse-play { 
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7), 0 8px 15px rgba(0,0,0,0.2); } 
          70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0), 0 8px 15px rgba(0,0,0,0.2); } 
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0), 0 8px 15px rgba(0,0,0,0.2); } 
        }

        /* 2. Era Nav (Filters) */
        .era-nav-gallery { margin-bottom: 25px; z-index: 5; }
        .gallery-section-title { padding: 0 25px; font-weight: 900; font-size: 0.9rem; color: #777; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1.5px; }
        
        .era-scroll-box { display: flex; gap: 15px; overflow-x: auto; padding: 0 25px 15px; scrollbar-width: none; }
        .era-scroll-box::-webkit-scrollbar { display: none; }
        
        .era-nav-item {
          display: flex; align-items: center; gap: 10px; padding: 12px 22px;
          background: var(--card-bg); border: 2px solid var(--border-color);
          border-bottom: 6px solid var(--border-color); /* Candy button 3D */
          border-radius: 20px; font-weight: 900; color: var(--text-color); font-size: 1rem;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
        }
        .era-nav-item:active {
          transform: translateY(4px);
          border-bottom-width: 2px;
          margin-bottom: 4px;
        }
        .era-nav-item.active {
          background: #58CC02; /* Duolingo Green for active */
          border-color: #46A302;
          border-bottom-color: #46A302;
          color: white; 
        }

        /* 4. Hero Grid Pop Out (Module Cards) */
        .hero-grid-pop {
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
          gap: 25px 20px;
          padding: 0 20px 40px; z-index: 5; /* Added side padding */
        }
        
        @media (max-width: 600px) {
          .hero-grid-pop { grid-template-columns: 1fr 1fr; }
        }

        .hero-card-pop {
          position: relative; height: 190px; cursor: pointer;
          animation: cardSlideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0; transform: translateY(30px);
          animation-delay: calc(var(--stagger) * 0.1s);
        }
        @keyframes cardSlideUp { to { opacity: 1; transform: translateY(0); } }

        .hero-card-inner {
          position: absolute; bottom: 0; left: 0; right: 0; height: 160px;
          background: var(--card-bg); border: 3px solid var(--border-color);
          border-bottom: 8px solid var(--border-color); /* 3D Island base */
          border-radius: 32px; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-end; padding: 20px 15px;
          transition: transform 0.1s, border-bottom-width 0.1s, margin-bottom 0.1s; 
        }
        
        .hero-card-pop.active .hero-card-inner { 
          border-color: #1CB0F6; /* Active border color */
          border-bottom-color: #1899D6;
          box-shadow: 0 10px 20px rgba(28, 176, 246, 0.2); 
        }
        
        .hero-card-pop:active .hero-card-inner { 
          transform: translateY(6px); 
          border-bottom-width: 2px;
        }

        .hero-pop-visual {
          position: absolute; top: -55px; width: 110px; height: 110px;
          display: flex; align-items: center; justify-content: center;
        }
        .hero-pop-bg { 
          position: absolute; inset: 5px; 
          background: var(--background-color); 
          border-radius: 50%; 
          border: 6px solid var(--border-color); /* Thicker ring */
          transition: all 0.3s; 
        }
        .hero-card-pop.active .hero-pop-bg { 
          border-color: #1CB0F6; 
          background: #fff; 
          box-shadow: 0 8px 15px rgba(28,176,246,0.2); 
        }
        .hero-pop-emoji { 
          font-size: 5rem; z-index: 2; 
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          filter: drop-shadow(0 8px 8px rgba(0,0,0,0.15)); 
        }
        .hero-card-pop.active:hover .hero-pop-emoji { 
          transform: translateY(-8px) scale(1.1) rotate(5deg); 
        }
        
        .hero-lock-badge {
          position: absolute; bottom: 15px; right: 5px;
          background: #FF4B4B; color: white; width: 32px; height: 32px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          border: 4px solid var(--card-bg); z-index: 3;
          box-shadow: 0 4px 0 rgba(0,0,0,0.1);
        }

        .hero-card-details { width: 100%; text-align: center; }
        .hero-name { font-weight: 900; font-size: 1.1rem; color: var(--text-color); margin: 0 0 10px; letter-spacing: 0.5px; }
        
        .hero-progress-lite { display: flex; align-items: center; gap: 8px; }
        .lite-bar { flex: 1; height: 12px; background: var(--border-color); border-radius: 10px; overflow: hidden; }
        .lite-fill { height: 100%; background: #58CC02; border-radius: 10px; }
        .lite-pct { font-size: 0.75rem; font-weight: 900; color: var(--text-muted); }
        
        .hero-locked-label { font-size: 0.75rem; font-weight: 900; color: #9CA3AF; letter-spacing: 1px; }

        /* Locked State Overrides (Stone Grey Look) */
        .hero-card-pop.locked .hero-card-inner {
          background: #f3f4f6;
          border-color: #d1d5db;
          border-bottom-color: #9ca3af;
        }
        .hero-card-pop.locked .hero-pop-bg {
          background: #e5e7eb;
          border-color: #d1d5db;
        }
        .hero-card-pop.locked .hero-pop-emoji { 
          filter: grayscale(1) brightness(0.8) drop-shadow(0 5px 5px rgba(0,0,0,0.1)); 
          opacity: 0.7;
        }
        .hero-card-pop.locked .hero-name { color: #6b7280; }
      `}</style>
    </div>
  );
}
