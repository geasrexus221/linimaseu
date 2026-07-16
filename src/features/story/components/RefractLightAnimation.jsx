import React, { useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { soundManager } from '../../../utils/SoundManager';

export default function RefractLightAnimation({ onComplete }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isSnapped, setIsSnapped] = useState(false);

  
  const handleDragStart = () => {
    setIsSnapped(false);
  };

  
  const handleDragEnd = () => {
    const currentX = x.get();
    const currentY = y.get();

    
    const inWaterGlass = currentX >= 45 && currentX <= 115 && currentY >= 50 && currentY <= 140;
    
    const inEmptyGlass = currentX >= -115 && currentX <= -45 && currentY >= 50 && currentY <= 140;

    if (inWaterGlass) {
      
      animate(x, 82, { type: "spring", stiffness: 200, damping: 20 });
      animate(y, 42, { type: "spring", stiffness: 200, damping: 20 });
      setIsSnapped(true);
      
      soundManager.play('click', 0.6);
      
      if (onComplete) {
        onComplete();
      }
    } else if (inEmptyGlass) {
      
      animate(x, -68, { type: "spring", stiffness: 200, damping: 20 });
      animate(y, 42, { type: "spring", stiffness: 200, damping: 20 });
      setIsSnapped(false);
      soundManager.play('click', 0.4);
    } else {
      
      animate(x, 0, { type: "spring", stiffness: 150, damping: 15 });
      animate(y, 0, { type: "spring", stiffness: 150, damping: 15 });
      setIsSnapped(false);
      soundManager.play('click', 0.2);
    }
  };

  const PencilGraphic = ({ isShifted }) => (
    <div className={`pencil-graphic ${isShifted ? 'shifted' : ''}`}>
      <div className="pencil-eraser" />
      <div className="pencil-body" />
      <div className="pencil-tip-wood">
        <div className="pencil-graphite" />
      </div>
    </div>
  );

  return (
    <div className="refract-light-container">
      <div className="title">Masukkan pensil ke dalam Gelas Air untuk melihat pembiasan!</div>
      <div className="subtitle">
        {isSnapped 
          ? "✨ Hebat! Pensil terlihat bengkok/patah di dalam air karena pembiasan cahaya." 
          : "(Seret dan lepaskan pensil ke salah satu gelas)"}
      </div>
      
      <div className="animation-area">
        
        
        <div className="glass empty-glass">
          <div className="glass-label">Tanpa Air</div>
          <div className="glass-body">
            <div className="glass-shine" />
          </div>
        </div>

        
        <div className="glass water-glass">
          <div className="glass-label">Ada Air</div>
          <div className="glass-body">
            <div className="glass-shine" />
          </div>
        </div>

        
        <div className="water-mask">
          
          <motion.div 
            className="clone-motion"
            style={{ x, y }}
          >
            <PencilGraphic isShifted={true} />
          </motion.div>
          
          <div className="glass-shine" />
        </div>

        
        <motion.div 
          className="draggable-pencil"
          style={{ x, y }}
          drag
          dragConstraints={{ left: -150, right: 150, top: -25, bottom: 150 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
        >
          <PencilGraphic isShifted={false} />
        </motion.div>

      </div>

      <style jsx>{`
        .refract-light-container {
          background: #111827;
          border-radius: 20px;
          padding: 25px 20px;
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          width: 100%;
          user-select: none;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .title {
          font-weight: 800;
          color: #38bdf8;
          margin-bottom: 5px;
          text-align: center;
          font-size: 1.1rem;
        }

        .subtitle {
          color: #9ca3af;
          font-size: 0.85rem;
          margin-bottom: 25px;
          text-align: center;
          font-weight: 500;
        }

        .animation-area {
          position: relative;
          width: 350px;
          height: 300px;
          background: #0f172a;
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 20px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          overflow: hidden;
        }

        .glass {
          position: absolute;
          bottom: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .empty-glass { left: 50px; }
        .water-glass { left: 200px; }

        .glass-label {
          font-weight: bold;
          color: #cbd5e1;
          font-size: 0.9rem;
          position: absolute;
          top: -30px;
          width: 100px;
          text-align: center;
        }

        .glass-body {
          width: 100px;
          height: 140px;
          border: 3px solid #94a3b8;
          border-top: none;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          background: rgba(255,255,255,0.05);
          position: relative;
        }

        .glass-shine {
          position: absolute;
          left: 10px;
          top: 10px;
          bottom: 10px;
          width: 12px;
          background: linear-gradient(to right, rgba(255,255,255,0.15), transparent);
          border-radius: 10px;
          pointer-events: none;
        }

        /* WATER MASK: Perfectly overlays the bottom of Glass 2 */
        .water-mask {
          position: absolute;
          left: 200px; /* matches glass 2 left */
          bottom: 30px; /* matches glass 2 bottom */
          width: 100px;
          height: 80px; /* Water level */
          background: rgba(26, 52, 77, 0.95); /* Opaque mix of background + blue to hide main pencil */
          border-top: 3px solid rgba(56, 189, 248, 0.8);
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          overflow: hidden; /* Clips the clone pencil */
          z-index: 5;
        }

        /* THE PENCIL GRAPHICS */
        .draggable-pencil {
          position: absolute;
          left: 168px; /* middle of animation area (350/2 = 175 - 7 = 168) */
          top: 30px;
          cursor: grab;
          z-index: 4; /* Behind the water mask */
          padding: 10px; /* larger hit area for drag */
          margin: -10px;
        }

        .draggable-pencil.snapped {
          cursor: default;
        }

        /* The clone moves in sync but must be offset because its parent is the water-mask */
        .clone-motion {
          position: absolute;
          left: -32px;
          top: -160px;
          pointer-events: none;
        }

        .pencil-graphic {
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: rotate(15deg);
          transform-origin: center;
          filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.4));
        }

        .pencil-graphic.shifted {
          transform: rotate(15deg) translateX(12px); /* The Refraction Shift! */
          filter: brightness(0.85) drop-shadow(0 0 0 transparent); /* underwater look */
        }

        .pencil-eraser {
          width: 14px;
          height: 12px;
          background: #f472b6;
          border-bottom: 4px solid #9ca3af; /* Metal ferrule */
          border-radius: 3px 3px 0 0;
        }

        .pencil-body {
          width: 14px;
          height: 160px;
          background: #f59e0b;
          border-left: 3px solid #d97706;
          border-right: 2px solid #fbbf24;
        }

        .pencil-tip-wood {
          width: 14px;
          height: 20px;
          background: #fde68a;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          position: relative;
        }

        .pencil-graphite {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 8px;
          background: #374151;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
      `}</style>
    </div>
  );
}
