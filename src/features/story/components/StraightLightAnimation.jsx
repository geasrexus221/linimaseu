import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StraightLightAnimation({ onComplete }) {
  
  const [sliderVal1, setSliderVal1] = useState(20);
  const [sliderVal2, setSliderVal2] = useState(80);
  const [sliderVal3, setSliderVal3] = useState(35);

  
  const offsetY1 = (sliderVal1 - 50) * 1.2;
  const offsetY2 = (sliderVal2 - 50) * 1.2;
  const offsetY3 = (sliderVal3 - 50) * 1.2;

  
  const isAligned1 = Math.abs(offsetY1) <= 12;
  const isAligned2 = Math.abs(offsetY2) <= 12;
  const isAligned3 = Math.abs(offsetY3) <= 12;

  const allAligned = isAligned1 && isAligned2 && isAligned3;

  useEffect(() => {
    if (allAligned && onComplete) {
      onComplete();
    }
  }, [allAligned, onComplete]);

  return (
    <div className="straight-light-container">
      <div className="title">Geser semua tuas agar lubang karton sejajar!</div>
      
      <div className="animation-area">
        
        <div className="flashlight">
          <svg width="52" height="52" viewBox="0 0 24 24" style={{ display: 'block' }}>
            <rect x="3" y="10" width="11" height="4" rx="1" fill="#4B5563" stroke="#374151" strokeWidth="0.8" />
            <line x1="6" y1="10" x2="6" y2="14" stroke="#9CA3AF" strokeWidth="0.8" />
            <line x1="9" y1="10" x2="9" y2="14" stroke="#9CA3AF" strokeWidth="0.8" />
            <rect x="7" y="8.5" width="2" height="1.5" rx="0.5" fill="#EF4444" />
            <path d="M14 9 L19 6 L21 6 L21 18 L19 18 L14 15 Z" fill="#9CA3AF" stroke="#374151" strokeWidth="0.8" />
            <ellipse cx="21" cy="12" rx="1" ry="6" fill="#FDE047" opacity="0.8" />
          </svg>
        </div>

        
        
        <div className="beam beam-1" />
        
        
        {isAligned1 && <div className="beam beam-2" />}
        
        
        {isAligned1 && isAligned2 && <div className="beam beam-3" />}
        
        
        {allAligned && <div className="beam beam-4" />}

        
        <motion.div 
          className="cardboard cb-1"
          animate={{ y: offsetY1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="hole" />
        </motion.div>
        
        
        <motion.div 
          className="cardboard cb-2"
          animate={{ y: offsetY2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="hole" />
        </motion.div>
        
        
        <motion.div 
          className="cardboard cb-3"
          animate={{ y: offsetY3 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="hole" />
        </motion.div>

        
        <div className={`target-object ${allAligned ? 'lit' : 'dark'}`}>
          🌻
        </div>
      </div>

      
      <div className="control-panel">
        <div className="slider-row">
          <div className="slider-label-row">
            <span className="label-text left-label">Karton 1 (Kiri):</span>
            <span className={`status-badge ${isAligned1 ? 'aligned' : 'misaligned'}`}>
              {isAligned1 ? "✨ SEJAJAR" : "❌ BELUM SEJAJAR"}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderVal1} 
            onChange={(e) => setSliderVal1(Number(e.target.value))} 
            className="slider"
            style={{ accentColor: isAligned1 ? '#10b981' : '#60a5fa' }}
          />
        </div>

        <div className="slider-row">
          <div className="slider-label-row">
            <span className="label-text mid-label">Karton 2 (Tengah):</span>
            <span className={`status-badge ${isAligned2 ? 'aligned' : 'misaligned'}`}>
              {isAligned2 ? "✨ SEJAJAR" : "❌ BELUM SEJAJAR"}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderVal2} 
            onChange={(e) => setSliderVal2(Number(e.target.value))} 
            className="slider"
            style={{ accentColor: isAligned2 ? '#10b981' : '#fbbf24' }}
          />
        </div>

        <div className="slider-row">
          <div className="slider-label-row">
            <span className="label-text right-label">Karton 3 (Kanan):</span>
            <span className={`status-badge ${isAligned3 ? 'aligned' : 'misaligned'}`}>
              {isAligned3 ? "✨ SEJAJAR" : "❌ BELUM SEJAJAR"}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderVal3} 
            onChange={(e) => setSliderVal3(Number(e.target.value))} 
            className="slider"
            style={{ accentColor: isAligned3 ? '#10b981' : '#f43f5e' }}
          />
        </div>
      </div>

      <style jsx>{`
        .straight-light-container {
          background: #111827;
          border-radius: 20px;
          padding: 25px 20px;
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .title {
          font-weight: 800;
          color: #fbbf24;
          margin-bottom: 25px;
          font-size: 1.1rem;
          text-align: center;
        }

        .animation-area {
          position: relative;
          width: 100%;
          height: 150px;
          display: flex;
          align-items: center;
          background: #0f172a;
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 15px;
          overflow: hidden;
        }

        .flashlight {
          position: absolute;
          left: -4px;
          z-index: 10;
        }

        /* Base Beam Styles */
        .beam {
          position: absolute;
          height: 10px;
          background: rgba(253, 224, 71, 0.85);
          box-shadow: 0 0 15px 5px rgba(253, 224, 71, 0.6);
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }

        .beam-1 { left: 40px; width: 40px; }
        .beam-2 { left: 90px; width: 60px; }
        .beam-3 { left: 160px; width: 60px; }
        .beam-4 { left: 230px; right: 40px; }

        /* Cardboards */
        .cardboard {
          position: absolute;
          width: 10px;
          height: 100px;
          background: #8B4513; /* Brown carton color */
          top: 50%;
          margin-top: -50px;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          box-shadow: 2px 0 5px rgba(0,0,0,0.5);
        }

        .hole {
          width: 10px;
          height: 15px;
          background: #0f172a; /* Matches container background */
          border-radius: 5px;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.8);
        }

        .cb-1 { left: 80px; background: #8B4513; }
        .cb-2 { left: 150px; background: #A0522D; } /* Middle is slightly lighter brown */
        .cb-3 { left: 220px; background: #8B4513; }

        .target-object {
          position: absolute;
          right: 15px;
          font-size: 3rem;
          transition: filter 0.4s ease, transform 0.4s ease;
          z-index: 10;
        }

        .target-object.dark { 
          filter: brightness(0.2) grayscale(0.5); 
        }
        
        .target-object.lit { 
          filter: brightness(1.2) drop-shadow(0 0 15px rgba(253, 224, 71, 0.8));
          transform: scale(1.1);
        }

        /* Slider Controls */
        .control-panel {
          margin-top: 25px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .slider-row {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .label-text {
          color: #9ca3af;
        }

        .left-label { color: #60a5fa; }
        .mid-label { color: #fbbf24; }
        .right-label { color: #f43f5e; }

        .status-badge {
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .status-badge.aligned {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .status-badge.misaligned {
          background: rgba(244, 63, 94, 0.1);
          color: #fb7185;
        }

        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #374151;
          outline: none;
          cursor: pointer;
          transition: background 0.3s;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
