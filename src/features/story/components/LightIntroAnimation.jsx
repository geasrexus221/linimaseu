import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../../utils/SoundManager';

export default function LightIntroAnimation({ onComplete }) {
  const [isOn, setIsOn] = useState(false);

  const toggleLight = () => {
    soundManager.play('click', 0.5);
    if (!isOn) {
      if (onComplete) onComplete();
    }
    setIsOn(!isOn);
  };

  // Generate some photons
  const photons = Array.from({ length: 8 });

  return (
    <div className={`light-animation-container ${isOn ? 'on' : 'off'}`}>
      
      {/* Click Indicator */}
      {!isOn && (
        <motion.div 
          className="click-indicator"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Klik Senter! ⬇️
        </motion.div>
      )}

      {/* 1. Flashlight */}
      <motion.div 
        className="flashlight-wrapper" 
        onClick={toggleLight}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="flashlight">🔦</div>
      </motion.div>

      {/* 2. Light Beam & Photons */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            className="light-beam-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="light-beam" />
            
            {/* Photons */}
            <div className="photons-container">
              {photons.map((_, i) => (
                <motion.div
                  key={i}
                  className="photon"
                  style={{ top: `${20 + Math.random() * 60}%` }}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ 
                    x: [0, 300], 
                    opacity: [0, 1, 1, 0] 
                  }}
                  transition={{ 
                    duration: 1 + Math.random() * 1, 
                    repeat: Infinity, 
                    delay: Math.random() * 2,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. The Object */}
      <motion.div 
        className="receiver-object"
        animate={{ filter: isOn ? 'brightness(1)' : 'brightness(0.1)' }}
        transition={{ duration: 0.5 }}
      >
        🧸
      </motion.div>

      <style jsx>{`
        .light-animation-container {
          position: relative;
          width: 100%;
          height: 220px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          overflow: hidden;
          margin: 20px 0;
          transition: background 0.5s ease;
        }

        .light-animation-container.off {
          background: #111827; /* Dark room */
        }
        
        .light-animation-container.on {
          background: #1f2937; /* Slightly lit room */
        }

        .click-indicator {
          position: absolute;
          left: 40px;
          top: 30px;
          color: #fbbf24;
          font-weight: 800;
          font-size: 0.9rem;
          background: rgba(0,0,0,0.5);
          padding: 5px 10px;
          border-radius: 10px;
          z-index: 4;
          pointer-events: none;
        }

        .flashlight-wrapper {
          position: relative;
          z-index: 3;
          cursor: pointer;
        }

        .flashlight {
          font-size: 4.5rem;
          /* Rotate to face right. The emoji usually points top-left, so 135deg turns it right */
          transform: rotate(135deg); 
          user-select: none;
        }

        .light-beam-wrapper {
          position: absolute;
          left: 120px;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 1;
        }

        .light-beam {
          position: absolute;
          left: 0;
          right: 0;
          height: 180px;
          background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(253,224,71,0.2) 100%);
          top: 50%;
          transform: translateY(-50%);
          transform-origin: left center;
          clip-path: polygon(0 40%, 100% 0, 100% 100%, 0 60%);
        }

        .photons-container {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 2;
          clip-path: polygon(0 40%, 100% 0, 100% 100%, 0 60%);
        }

        .photon {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 8px 4px rgba(255, 255, 255, 0.8);
          left: 10px;
        }

        .receiver-object {
          font-size: 5rem;
          position: relative;
          z-index: 2;
          margin-right: 40px;
          filter: brightness(0.1);
          user-select: none;
        }
      `}</style>
    </div>
  );
}
