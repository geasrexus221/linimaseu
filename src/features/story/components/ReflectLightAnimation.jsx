import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../../utils/SoundManager';

export default function ReflectLightAnimation({ onComplete }) {
  // 'none' | 'straight' | 'down' | 'up'
  const [mirrorState, setMirrorState] = useState('none');
  const isHit = mirrorState === 'up';

  useEffect(() => {
    if (isHit && onComplete) {
      onComplete();
    }
  }, [isHit, onComplete]);

  const handleSelect = (state) => {
    soundManager.play('click', 0.5);
    setMirrorState(state);
  };

  return (
    <div className="reflect-light-container">
      <div className="title">Pilih posisi cermin yang tepat agar cahaya mengenai target!</div>
      
      <div className="animation-area">
        {/* Flashlight */}
        <div className="flashlight">🔦</div>

        {/* Target Star */}
        <div className={`target-star ${isHit ? 'lit' : 'dark'}`}>⭐</div>

        {/* The Incident Beam (always active) */}
        <div className="beam incident-beam" />

        {/* The Mirror */}
        <div className="mirror-wrapper">
          {mirrorState !== 'none' && (
            <motion.div 
              className="mirror"
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1, 
                rotate: mirrorState === 'straight' ? 0 : (mirrorState === 'up' ? -45 : 45) 
              }}
              transition={{ type: "spring" }}
            />
          )}

          {/* The Reflected Beam */}
          <AnimatePresence>
            {mirrorState !== 'none' && (
              <motion.div 
                className="beam reflected-beam"
                initial={{ opacity: 0, width: 0 }}
                animate={{ 
                  opacity: 1, 
                  width: '100px',
                  rotate: mirrorState === 'straight' ? 180 : (mirrorState === 'up' ? -90 : 90)
                }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="controls">
        <button 
          className={`control-btn ${mirrorState === 'straight' ? 'active' : ''}`}
          onClick={() => handleSelect('straight')}
        >
          Lurus 🪞
        </button>
        <button 
          className={`control-btn ${mirrorState === 'down' ? 'active' : ''}`}
          onClick={() => handleSelect('down')}
        >
          Ke Bawah ↘️
        </button>
        <button 
          className={`control-btn ${mirrorState === 'up' ? 'active' : ''}`}
          onClick={() => handleSelect('up')}
        >
          Ke Atas ↗️
        </button>
      </div>

      <style jsx>{`
        .reflect-light-container {
          background: #111827;
          border-radius: 20px;
          padding: 25px 20px;
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          width: 100%;
        }

        .title {
          font-weight: 800;
          color: #38bdf8;
          margin-bottom: 25px;
          text-align: center;
          font-size: 1.1rem;
        }

        .animation-area {
          position: relative;
          width: 250px;
          height: 200px;
          display: flex;
          align-items: center;
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 15px;
          margin-bottom: 20px;
        }

        .flashlight {
          font-size: 3rem;
          position: absolute;
          left: -15px;
          top: 50%;
          transform: translateY(-50%) rotate(90deg); /* point right */
          z-index: 10;
        }

        .target-star {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translate(-50%, -50%);
          font-size: 3.5rem;
          transition: all 0.5s;
          z-index: 10;
        }

        .target-star.dark { 
          filter: grayscale(1) brightness(0.4); 
        }
        
        .target-star.lit { 
          filter: drop-shadow(0 0 20px #fbbf24) brightness(1.2); 
          transform: translate(-50%, -50%) scale(1.2);
        }

        .beam {
          position: absolute;
          height: 12px;
          background: rgba(56, 189, 248, 0.8);
          box-shadow: 0 0 15px 5px rgba(56, 189, 248, 0.5);
          z-index: 1;
        }

        .incident-beam {
          left: 45px;
          top: 50%;
          transform: translateY(-50%);
          width: 80px;
        }

        .mirror-wrapper {
          position: absolute;
          left: 125px; /* End of incident beam */
          top: 50%;
          width: 0;
          height: 0;
          z-index: 5;
        }

        .mirror {
          position: absolute;
          width: 8px;
          height: 70px;
          background: #9ca3af;
          border-left: 3px solid #e5e7eb;
          top: 50%;
          left: 50%;
          margin-top: -35px;
          margin-left: -4px;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
        }

        .reflected-beam {
          left: 0;
          top: -6px; /* half of beam height */
          transform-origin: left center;
        }

        .controls {
          display: flex;
          gap: 10px;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }

        .control-btn {
          background: #1f2937;
          border: 2px solid #374151;
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-btn.active {
          background: #0ea5e9;
          border-color: #38bdf8;
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
        }
      `}</style>
    </div>
  );
}
