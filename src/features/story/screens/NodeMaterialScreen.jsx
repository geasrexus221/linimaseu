import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, Lightbulb, BookOpen } from 'lucide-react';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { useStore } from '../../../store/useStore';
import LightIntroAnimation from '../components/LightIntroAnimation';
import StraightLightAnimation from '../components/StraightLightAnimation';
import ReflectLightAnimation from '../components/ReflectLightAnimation';
import TransparentLightAnimation from '../components/TransparentLightAnimation';
import RefractLightAnimation from '../components/RefractLightAnimation';

export default function NodeMaterialScreen() {
  const { activeChapter, setCurrentView } = useNavigationStore();
  const { setUnlockedNodes, unlockedNodes = ['cahaya-node-1'] } = useStore();
  const [isInteractionCompleted, setIsInteractionCompleted] = useState(true);

  useEffect(() => {
    const hasInteractive = activeChapter?.content?.sections.some(s => s.type === 'component');
    setIsInteractionCompleted(!hasInteractive);
  }, [activeChapter?.id]);

  const handleBack = () => {
    setCurrentView('path');
  };

  const handleComplete = () => {
    if (activeChapter?.id) {
      const parts = activeChapter.id.split('-');
      const nextId = `${parts[0]}-${parts[1]}-${parseInt(parts[2]) + 1}`;
      if (!unlockedNodes.includes(nextId)) {
        if (setUnlockedNodes) {
           setUnlockedNodes([...unlockedNodes, nextId]);
        }
      }
    }
    setCurrentView('path');
  };

  const content = activeChapter?.content;

  if (!content) return <div>Loading...</div>;

  return (
    <div className="material-screen content-container">
      <div className="material-content">
        <div className="material-header-area">
          <button className="close-btn-3d" onClick={handleBack}>
            <ChevronLeft size={28} strokeWidth={3} />
          </button>
          <motion.div 
            className="title-container"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <BookOpen className="title-icon" size={28} color="#FFD166" />
            <h1 className="material-title">{content.title}</h1>
          </motion.div>
        </div>

        {content.sections.map((section, idx) => (
          <motion.div 
            key={idx}
            className={`section-block ${section.type}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
          >
            {section.type === 'component' && section.name === 'LightIntroAnimation' && <LightIntroAnimation onComplete={() => setIsInteractionCompleted(true)} />}
            {section.type === 'component' && section.name === 'StraightLightAnimation' && <StraightLightAnimation onComplete={() => setIsInteractionCompleted(true)} />}
            {section.type === 'component' && section.name === 'ReflectLightAnimation' && <ReflectLightAnimation onComplete={() => setIsInteractionCompleted(true)} />}
            {section.type === 'component' && section.name === 'TransparentLightAnimation' && <TransparentLightAnimation onComplete={() => setIsInteractionCompleted(true)} />}
            {section.type === 'component' && section.name === 'RefractLightAnimation' && <RefractLightAnimation onComplete={() => setIsInteractionCompleted(true)} />}
            
            {section.type === 'text' && <p className="fun-text">{section.text}</p>}
            
            {section.type === 'highlight' && (
              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <Lightbulb size={24} color="#FFF" />
                </div>
                <div className="highlight-content">
                  <span className="highlight-title">Tahukah Kamu?</span>
                  <p>{section.text}</p>
                </div>
              </div>
            )}
            
            {section.type === 'image' && (
              <div className="image-card">
                <img src={section.url} alt="Ilustrasi materi" />
                {section.caption && (
                  <div className="caption-sticker">
                    <span>{section.caption}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
        
        <div style={{ height: '100px' }}></div>
      </div>

      <div className="floating-footer">
        <button 
          className={`continue-btn-3d ${!isInteractionCompleted ? 'locked' : ''}`} 
          onClick={handleComplete}
          disabled={!isInteractionCompleted}
        >
          {!isInteractionCompleted && <Lock size={22} strokeWidth={3} />}
          {isInteractionCompleted ? "SELESAI & LANJUTKAN!" : "SELESAIKAN MISI DULU"}
        </button>
      </div>

      <style jsx>{`
        .material-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--background-color);
          height: 100%;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .material-content {
          flex: 1;
          padding: 25px 30px;
          overflow-y: auto;
          min-height: 0; 
          scroll-behavior: smooth;
        }

        /* HEADER AREA */
        .material-header-area {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .close-btn-3d {
          background: #fff;
          border: 2px solid #e5e7eb;
          border-bottom: 4px solid #e5e7eb;
          color: #afb5be;
          cursor: pointer;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.1s, border-bottom-width 0.1s;
        }
        .close-btn-3d:active {
          transform: translateY(2px);
          border-bottom-width: 2px;
        }

        .title-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFD166;
          padding: 10px 20px;
          border-radius: 20px;
          border: 3px solid #F4A261;
          border-bottom: 6px solid #F4A261;
          flex: 1;
        }

        .title-icon {
          filter: drop-shadow(0 2px 0 rgba(0,0,0,0.2));
        }

        .material-title {
          font-size: 1.4rem;
          color: #fff;
          font-weight: 900;
          margin: 0;
          text-shadow: 0 2px 0 #E76F51;
          letter-spacing: 0.5px;
        }

        /* TEXT TYPOGRAPHY */
        .section-block {
          margin-bottom: 25px;
        }

        .fun-text {
          font-size: 1.25rem;
          line-height: 1.7;
          color: #374151;
          font-weight: 700;
        }

        /* HIGHLIGHT CARD */
        .highlight-card {
          background: #FEF3C7;
          border: 4px solid #FBBF24;
          border-radius: 24px;
          padding: 20px;
          display: flex;
          gap: 15px;
          align-items: flex-start;
          box-shadow: 0 6px 0 #F59E0B;
          margin-top: 30px;
          margin-bottom: 30px;
        }

        .highlight-icon-wrapper {
          background: #F59E0B;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          box-shadow: 0 3px 0 #D97706;
        }

        .highlight-content {
          flex: 1;
        }

        .highlight-title {
          display: block;
          font-weight: 900;
          color: #D97706;
          font-size: 1.1rem;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .highlight-content p {
          margin: 0;
          font-size: 1.15rem;
          color: #92400E;
          font-weight: 700;
          line-height: 1.6;
        }

        /* IMAGE CARD */
        .image-card {
          background: #fff;
          border: 4px solid #E5E7EB;
          border-radius: 24px;
          padding: 15px;
          box-shadow: 0 8px 0 #D1D5DB;
          position: relative;
          margin-top: 20px;
        }

        .image-card img {
          width: 100%;
          border-radius: 16px;
          display: block;
        }

        .caption-sticker {
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%) rotate(-2deg);
          background: #1CB0F6;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 900;
          font-size: 1rem;
          border: 3px solid #fff;
          box-shadow: 0 4px 0 #1899D6;
          white-space: nowrap;
        }

        /* FLOATING FOOTER */
        .floating-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 20px 30px 40px; /* EXTRA PADDING FOR MOBILE HOME BAR */
          background: linear-gradient(to top, var(--background-color) 70%, rgba(255,255,255,0));
          pointer-events: none; /* Allows clicking through gradient */
        }

        .continue-btn-3d {
          pointer-events: auto; /* Re-enable clicks for button */
          width: 100%;
          padding: 20px;
          background: #58CC02;
          color: white;
          border: 2px solid #58CC02;
          border-bottom: 6px solid #46A302;
          border-radius: 20px;
          font-weight: 900;
          font-size: 1.25rem;
          cursor: pointer;
          transition: transform 0.1s, border-bottom-width 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .continue-btn-3d:active:not(:disabled) {
          transform: translateY(4px);
          border-bottom-width: 2px;
        }

        .continue-btn-3d.locked {
          background: #E5E7EB;
          border-color: #E5E7EB;
          border-bottom-color: #D1D5DB;
          color: #9CA3AF;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
