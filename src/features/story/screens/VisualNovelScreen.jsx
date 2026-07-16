import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function VisualNovelScreen({ chapterData, onComplete }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const currentScene = chapterData.scenes[currentSceneIndex];

  const handleNext = () => {
    if (currentSceneIndex < chapterData.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      onComplete();
    }
  };

  const CHARACTERS = {
    'Bimo': { icon: '👦', position: 'left' },
    'Santi': { icon: '👧', position: 'right' },
    'Narator': { icon: '', position: 'center' }
  };

  const isBimoSpeaking = currentScene.speaker === 'Bimo';
  const isSantiSpeaking = currentScene.speaker === 'Santi';
  const isNarration = currentScene.speaker === 'Narator';

  return (
    <div className="vn-container" onClick={handleNext}>
      
      <div 
        className="vn-background" 
        style={{ background: currentScene.background || '#fdf6e3' }}
      >
        <div className="bg-pattern" />
        
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentScene.illustration || 'none'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="illustration-box"
          >
            {currentScene.illustration ? (
              <div className="placeholder-content">
                <div className="placeholder-tag">ILUSTRASI</div>
                <p>{currentScene.illustration}</p>
              </div>
            ) : (
              <div className="placeholder-empty">Lini Masa Time Travel</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      
      <div className="vn-character-area">
        
        <motion.div
          animate={{ 
            scale: isBimoSpeaking ? 1.2 : 0.95,
            opacity: isBimoSpeaking ? 1 : 0.6,
            x: isBimoSpeaking ? 20 : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="character-sprite bimo"
        >
          <span className="emoji-sprite">👦</span>
          {isBimoSpeaking && <motion.div layoutId="speaker-glow" className="speaker-glow" />}
        </motion.div>

        
        <motion.div
          animate={{ 
            scale: isSantiSpeaking ? 1.2 : 0.95,
            opacity: isSantiSpeaking ? 1 : 0.6,
            x: isSantiSpeaking ? -20 : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="character-sprite santi"
        >
          <span className="emoji-sprite">👧</span>
          {isSantiSpeaking && <motion.div layoutId="speaker-glow" className="speaker-glow" />}
        </motion.div>
      </div>

      
      <div className="dialogue-box-container">
        <motion.div 
          key={currentSceneIndex}
          className={`dialogue-box ${isNarration ? 'is-narration' : ''} content-container`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {!isNarration && (
            <div className="speaker-tag">
              <span className="speaker-icon">{CHARACTERS[currentScene.speaker]?.icon}</span>
              <span className="speaker-name">{currentScene.speaker}</span>
            </div>
          )}
          
          <div className="dialogue-content">
            <p className="dialogue-text">
              {currentScene.text}
            </p>
          </div>
          
          <div className="tap-indicator">
            <span>Tap untuk lanjut</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <ChevronRight size={18} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .vn-container {
          position: relative; width: 100%; height: 100%;
          display: flex; flex-direction: column; overflow: hidden;
          font-family: 'Outfit', sans-serif; cursor: pointer;
          background: #fdf6e3;
        }
        .vn-background {
          position: absolute; inset: 0; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          padding-bottom: 250px;
        }
        .bg-pattern {
          position: absolute; inset: 0; opacity: 0.05;
          background-image: radial-gradient(#000 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .illustration-box {
          width: 85%; max-width: 500px; aspect-ratio: 16/9;
          background: rgba(255,255,255,0.8);
          border: 4px dashed #ccc; border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          padding: 30px; text-align: center; position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .placeholder-tag {
          position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
          background: #333; color: white; padding: 4px 15px;
          border-radius: 50px; font-weight: 900; font-size: 0.7rem; letter-spacing: 1px;
        }
        .placeholder-content p { font-weight: 700; color: #666; line-height: 1.4; font-size: 1.1rem; }
        .placeholder-empty { font-weight: 900; color: #ddd; font-size: 2rem; transform: rotate(-5deg); }

        .vn-character-area {
          flex: 1; display: flex; align-items: flex-end;
          justify-content: space-between; padding: 0 5%;
          margin-bottom: 20px; pointer-events: none;
        }
        .character-sprite { position: relative; display: flex; flex-direction: column; align-items: center; }
        .emoji-sprite { font-size: 10rem; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15)); z-index: 2; }
        .speaker-glow {
          position: absolute; bottom: 10px; width: 140px; height: 40px;
          background: radial-gradient(circle, rgba(255,200,0,0.4), transparent 70%);
          border-radius: 50%; z-index: 1;
        }

        .dialogue-box-container { 
          padding: 20px; padding-bottom: 40px; z-index: 10;
          width: 100%; display: flex; justify-content: center;
        }
        .dialogue-box {
          background: white; border-radius: 30px; padding: 30px;
          min-height: 160px; position: relative; width: 100%;
          max-width: var(--max-content-width);
          box-shadow: 0 15px 0 rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.1);
          border: 4px solid #eee; transition: all 0.3s;
        }
        .dialogue-box.is-narration { border-color: #CE82FF; background: #FAF5FF; }
        
        .speaker-tag {
          position: absolute; top: -25px; left: 40px;
          background: #333; color: white; padding: 8px 20px;
          border-radius: 15px; display: flex; align-items: center; gap: 10px;
          box-shadow: 0 5px 0 #000;
        }
        .speaker-icon { font-size: 1.4rem; }
        .speaker-name { font-weight: 900; font-size: 1.1rem; }
        
        .dialogue-text { font-size: 1.3rem; font-weight: 600; color: #444; line-height: 1.5; margin: 0; }
        .dialogue-box.is-narration .dialogue-text { font-style: italic; color: #6B46C1; text-align: center; }

        .tap-indicator {
          position: absolute; bottom: 15px; right: 25px;
          display: flex; align-items: center; gap: 5px;
          color: #bbb; font-weight: 800; font-size: 0.8rem;
        }
        
        @media (max-width: 600px) {
          .emoji-sprite { font-size: 7rem; }
          .dialogue-text { font-size: 1.1rem; }
          .speaker-tag { left: 20px; padding: 6px 15px; }
          .illustration-box { padding: 20px; }
          .placeholder-content p { font-size: 0.9rem; }
          .vn-background { padding-bottom: 200px; }
        }
      `}</style>
    </div>
  );
}
