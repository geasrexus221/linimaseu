import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function CardBurningOverlay({ activeCard }) {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    console.log("[DEBUG] activeCard changed:", activeCard);
    if (activeCard) {
      
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 100 - 50,
        size: Math.random() * 6 + 2,
        delay: Math.random() * 0.5 + 0.5,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [activeCard]);

  const getCardColor = () => {
    if (!activeCard) return '#58CC02';
    if (activeCard.color) return activeCard.color;
    
    if (activeCard.rarity === 'epic') return '#CE82FF';
    if (activeCard.rarity === 'rare') return '#1CB0F6';
    return '#58CC02';
  };

  return (
    <AnimatePresence>
      {activeCard && (
        <motion.div 
          className="burning-overlay-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="burning-card-wrapper">
            
            <motion.div 
              className="burning-card-main"
              initial={{ scale: 0, rotate: -20, y: 100 }}
              animate={{ 
                scale: [0, 1.1, 1], 
                rotate: [20, -5, 0], 
                y: 0 
              }}
              transition={{ duration: 0.5, times: [0, 0.7, 1], ease: "easeOut" }}
            >
              <div className="burning-card-face">
                
                {activeCard.cost !== undefined && (
                  <div className="burning-card-cost">
                    <Heart size={14} fill="#FF4B4B" color="#FF4B4B" />
                    <span>{activeCard.cost}</span>
                  </div>
                )}

                
                <div 
                  className="burning-card-illustration" 
                  style={{ background: `linear-gradient(135deg, ${getCardColor()}, rgba(255,255,255,0.35))` }}
                >
                  <div className="burning-card-icon">{activeCard.icon}</div>
                </div>

                
                <div className="burning-card-name-banner">
                  {activeCard.name}
                </div>

                
                <div className="burning-card-desc-box">
                  <p className="burning-card-desc-text">
                    {activeCard.description || activeCard.desc}
                  </p>
                </div>

                
                <div className="burning-erosion-mask" />
              </div>

              
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  className="burning-spark"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
                  animate={{ 
                    x: p.x, 
                    y: p.y - 150, 
                    opacity: [0, 1, 0], 
                    scale: 0 
                  }}
                  transition={{ 
                    delay: p.delay, 
                    duration: 1, 
                    ease: "easeOut" 
                  }}
                  style={{ width: p.size, height: p.size }}
                />
              ))}
            </motion.div>

          </div>

          <style>{`
            .burning-overlay-container {
              position: fixed; inset: 0; z-index: 99999;
              background: transparent;
              display: flex; align-items: center; justify-content: center;
              pointer-events: none;
            }
            .burning-card-wrapper {
              display: flex; flex-direction: column; align-items: center; gap: 30px;
              width: 100%;
            }
            .burning-card-main {
              position: relative; width: 240px; height: 340px;
            }
            .burning-card-face {
              position: relative; width: 100%; height: 100%;
              border-radius: 24px; border: 6px solid #5E3A24;
              background: #FFF7E6;
              box-shadow: 0 0 50px rgba(255, 150, 0, 0.4), 0 4px 0 #3A2315;
              overflow: hidden; display: flex; flex-direction: column;
              animation: burningShake 0.1s infinite 0.5s;
            }
            .burning-card-cost {
              position: absolute; top: 12px; right: 12px; background: white;
              border: 2.5px solid #5E3A24; border-radius: 12px;
              height: 28px; padding: 0 8px; display: flex; align-items: center; justify-content: center; gap: 4px;
              font-size: 0.9rem; font-weight: 950; color: #5E3A24;
              box-shadow: 0 3px 0 rgba(0,0,0,0.15); z-index: 10;
            }
            .burning-card-illustration {
              margin: 12px 12px 6px 12px;
              height: 130px; border-radius: 12px;
              border: 3.5px solid #5E3A24;
              display: flex; align-items: center; justify-content: center;
              position: relative;
              box-shadow: inset 0 4px 10px rgba(0,0,0,0.15);
            }
            .burning-card-icon { font-size: 3.8rem; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.25)); }
            
            .burning-card-name-banner {
              background: white; border: 3.5px solid #5E3A24;
              margin: 4px 12px; padding: 6px; text-align: center;
              border-radius: 10px; font-weight: 950; font-size: 0.85rem;
              color: #3E2723; text-transform: uppercase;
              box-shadow: 0 3px 0 rgba(0,0,0,0.1);
            }
            .burning-card-desc-box {
              background: #FAF4D0; border: 3.5px solid #5E3A24;
              margin: 4px 12px 12px 12px; padding: 10px;
              border-radius: 12px; flex: 1; display: flex;
              align-items: center; justify-content: center;
              box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
            }
            .burning-card-desc-text {
              margin: 0; font-size: 0.75rem; color: #4E342E;
              line-height: 1.4; font-weight: 800; text-align: center;
            }

            .burning-erosion-mask {
              position: absolute; inset: 0; z-index: 15;
              background: #f4c265;
              mix-blend-mode: color-dodge;
              opacity: 0;
              animation: burningSequenceAnim 1.2s forwards 0.6s;
            }

            @keyframes burningSequenceAnim {
              0% { opacity: 0; transform: translateY(100%); }
              30% { opacity: 1; transform: translateY(0); background: #FF4B4B; }
              100% { opacity: 1; transform: translateY(-100%); background: #f4c265; }
            }

            @keyframes burningShake {
              0% { transform: translate(0,0); }
              25% { transform: translate(-4px, 2px); }
              50% { transform: translate(4px, -2px); }
              75% { transform: translate(-4px, -2px); }
              100% { transform: translate(0,0); }
            }

            .burning-spark {
              position: absolute; top: 50%; left: 50%;
              background: #FFD700; border-radius: 50%;
              box-shadow: 0 0 10px #f4c265; z-index: 20;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
