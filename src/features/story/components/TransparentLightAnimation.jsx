import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransparentLightAnimation({ onComplete }) {
  const [material, setMaterial] = useState('none'); // 'none', 'glass', 'paper', 'wood'

  useEffect(() => {
    if (material !== 'none' && onComplete) {
      onComplete();
    }
  }, [material, onComplete]);

  const getBeamOpacity = () => {
    switch (material) {
      case 'glass': return 0.9;
      case 'paper': return 0.3;
      case 'wood': return 0;
      default: return 0.9;
    }
  };

  const getWallBrightness = () => {
    switch (material) {
      case 'glass': return 'brightness(1.5)';
      case 'paper': return 'brightness(0.7)';
      case 'wood': return 'brightness(0.2)';
      default: return 'brightness(1.5)';
    }
  };

  return (
    <div className="transparent-light-container">
      <div className="title">Pilih benda untuk menghalangi cahaya!</div>
      
      <div className="animation-area">
        {/* Wall */}
        <div className="wall" style={{ filter: getWallBrightness() }}>
          🧱 Tembok
        </div>

        {/* Flashlight */}
        <div className="flashlight">🔦</div>

        {/* Pre-material beam */}
        <div className="beam pre-beam" />

        {/* Active Material */}
        <AnimatePresence mode="wait">
          {material !== 'none' && (
            <motion.div
              key={material}
              className={`material-block ${material}`}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {material === 'glass' && 'Kaca'}
              {material === 'paper' && 'Kertas'}
              {material === 'wood' && 'Kayu'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post-material beam */}
        <motion.div 
          className="beam post-beam"
          animate={{ opacity: getBeamOpacity() }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Controls */}
      <div className="controls">
        <button 
          className={`mat-btn glass ${material === 'glass' ? 'active' : ''}`}
          onClick={() => setMaterial('glass')}
        >
          Kaca Bening
        </button>
        <button 
          className={`mat-btn paper ${material === 'paper' ? 'active' : ''}`}
          onClick={() => setMaterial('paper')}
        >
          Kertas Buram
        </button>
        <button 
          className={`mat-btn wood ${material === 'wood' ? 'active' : ''}`}
          onClick={() => setMaterial('wood')}
        >
          Balok Kayu
        </button>
      </div>

      <style jsx>{`
        .transparent-light-container {
          background: #1f2937;
          border-radius: 20px;
          padding: 20px;
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          overflow: hidden;
        }

        .title {
          font-weight: 800;
          color: #a7f3d0;
          margin-bottom: 20px;
          text-align: center;
        }

        .animation-area {
          position: relative;
          width: 100%;
          height: 180px;
          display: flex;
          align-items: center;
        }

        .wall {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 50px;
          background: #b91c1c;
          border-left: 5px solid #7f1d1d;
          display: flex;
          align-items: center;
          justify-content: center;
          writing-mode: vertical-rl;
          font-weight: 900;
          color: #fca5a5;
          transition: filter 0.3s ease;
          z-index: 5;
        }

        .flashlight {
          font-size: 3.5rem;
          transform: rotate(135deg);
          position: absolute;
          left: 10px;
          z-index: 10;
        }

        .beam {
          position: absolute;
          height: 80px;
          background: linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1));
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }

        .pre-beam {
          left: 60px;
          width: 80px;
          clip-path: polygon(0 40%, 100% 20%, 100% 80%, 0 60%);
        }

        .post-beam {
          left: 140px;
          right: 50px;
          clip-path: polygon(0 20%, 100% 0%, 100% 100%, 0 80%);
          transform-origin: left center;
        }

        .material-block {
          position: absolute;
          left: 140px;
          width: 15px;
          height: 120px;
          top: 50%;
          margin-top: -60px;
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
          writing-mode: vertical-rl;
          font-size: 0.7rem;
          font-weight: 900;
          color: #000;
          border-radius: 4px;
        }

        .material-block.glass {
          background: rgba(186, 230, 253, 0.4);
          border: 2px solid rgba(186, 230, 253, 0.8);
          color: #0284c7;
        }

        .material-block.paper {
          background: rgba(254, 243, 199, 0.8);
          border: 1px dashed #d97706;
          color: #92400e;
        }

        .material-block.wood {
          background: #78350f;
          border: 2px solid #451a03;
          color: #fef3c7;
        }

        .controls {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          width: 100%;
          justify-content: center;
        }

        .mat-btn {
          padding: 8px 12px;
          border-radius: 10px;
          border: none;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.8rem;
        }

        .mat-btn:active { transform: scale(0.95); }
        .mat-btn.active { outline: 3px solid white; }

        .mat-btn.glass { background: #bae6fd; color: #0284c7; }
        .mat-btn.paper { background: #fef3c7; color: #92400e; }
        .mat-btn.wood { background: #78350f; color: #fef3c7; }
      `}</style>
    </div>
  );
}
