import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../features/game/jelajah-nusantara/logic/soundEngine';


const getBaseRotation = (value) => {
  switch (value) {
    case 1: return { x: 0, y: 0 };
    case 2: return { x: 180, y: 0 };
    case 3: return { x: 0, y: -90 };
    case 4: return { x: 0, y: 90 };
    case 5: return { x: -90, y: 0 };
    case 6: return { x: 90, y: 0 };
    default: return { x: 0, y: 0 };
  }
};

export default function Dice3D({ value = 1, isRolling = false, onRollComplete, size = 80 }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [bouncing, setBouncing] = useState(false);
  const currentRot = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isRolling) {
      setBouncing(true);
      soundEngine.playSound('dice_roll');
      
      const base = getBaseRotation(value);
      
      
      const extraSpinsX = (Math.floor(Math.random() * 3) + 2) * 360;
      const extraSpinsY = (Math.floor(Math.random() * 3) + 2) * 360;
      
      
      const nextX = Math.floor(currentRot.current.x / 360) * 360 + extraSpinsX + base.x;
      const nextY = Math.floor(currentRot.current.y / 360) * 360 + extraSpinsY + base.y;
      
      setRotation({ x: nextX, y: nextY });
      currentRot.current = { x: nextX, y: nextY };

      
      const timer = setTimeout(() => {
        setBouncing(false);
        soundEngine.playDiceResult(value);
        if (onRollComplete) onRollComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isRolling, value, onRollComplete]);

  
  const renderDots = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="dice-dot" />
    ));
  };

  return (
    <div className="dice-container" style={{ width: size, height: size }}>
      <div className={`dice-bouncer ${bouncing ? 'bouncing' : ''}`}>
        <div 
          className="dice-cube" 
          style={{ 
            transform: `translateZ(-${size/2}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: bouncing ? 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
          }}
        >
          <div className="dice-face front">{renderDots(1)}</div>
          <div className="dice-face back">{renderDots(2)}</div>
          <div className="dice-face right">{renderDots(3)}</div>
          <div className="dice-face left">{renderDots(4)}</div>
          <div className="dice-face top">{renderDots(5)}</div>
          <div className="dice-face bottom">{renderDots(6)}</div>
        </div>
        
        
        <div className={`dice-shadow ${bouncing ? 'bouncing-shadow' : ''}`} />
      </div>

      <style jsx>{`
        .dice-container {
          perspective: 600px;
          margin: 0 auto;
          position: relative;
        }

        .dice-bouncer {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .bouncing {
          animation: bounce 1.5s cubic-bezier(0.28, 0.84, 0.42, 1);
        }

        .dice-cube {
          width: 100%;
          height: 100%;
          position: absolute;
          transform-style: preserve-3d;
        }

        .dice-face {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #FFF;
          border: 4px solid #E5E5E5;
          border-radius: 15%;
          display: grid;
          padding: 15%;
          box-shadow: inset 0 0 15px rgba(0,0,0,0.1);
        }

        .dice-face::before {
          content: ''; position: absolute; inset: 0;
          border-radius: 15%; box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
          pointer-events: none;
        }

        /* Posisi Sisi 3D */
        .front  { transform: rotateY(  0deg) translateZ(${size/2}px); }
        .back   { transform: rotateX(180deg) translateZ(${size/2}px); }
        .right  { transform: rotateY( 90deg) translateZ(${size/2}px); }
        .left   { transform: rotateY(-90deg) translateZ(${size/2}px); }
        .top    { transform: rotateX( 90deg) translateZ(${size/2}px); }
        .bottom { transform: rotateX(-90deg) translateZ(${size/2}px); }

        /* Grid Titik Dadu */
        .dice-dot {
          background: #4B4B4B;
          border-radius: 50%;
          width: 25%;
          height: 25%;
          margin: auto;
          box-shadow: inset 0 3px 5px rgba(0,0,0,0.3);
        }

        /* Front (1) */
        .front { grid-template-areas: ". . ." ". a ." ". . ."; }
        .front .dice-dot { grid-area: a; width: 35%; height: 35%; background: #FF4B4B; } /* Dot merah khas dadu */
        
        /* Back (2) */
        .back { grid-template-areas: "a . ." ". . ." ". . b"; }
        .back .dice-dot:nth-child(1) { grid-area: a; }
        .back .dice-dot:nth-child(2) { grid-area: b; }

        /* Right (3) */
        .right { grid-template-areas: "a . ." ". b ." ". . c"; }
        .right .dice-dot:nth-child(1) { grid-area: a; }
        .right .dice-dot:nth-child(2) { grid-area: b; }
        .right .dice-dot:nth-child(3) { grid-area: c; }

        /* Left (4) */
        .left { grid-template-areas: "a . c" ". . ." "b . d"; }
        .left .dice-dot:nth-child(1) { grid-area: a; }
        .left .dice-dot:nth-child(2) { grid-area: b; }
        .left .dice-dot:nth-child(3) { grid-area: c; }
        .left .dice-dot:nth-child(4) { grid-area: d; }

        /* Top (5) */
        .top { grid-template-areas: "a . c" ". e ." "b . d"; }
        .top .dice-dot:nth-child(1) { grid-area: a; }
        .top .dice-dot:nth-child(2) { grid-area: b; }
        .top .dice-dot:nth-child(3) { grid-area: c; }
        .top .dice-dot:nth-child(4) { grid-area: d; }
        .top .dice-dot:nth-child(5) { grid-area: e; }

        /* Bottom (6) */
        .bottom { grid-template-areas: "a . d" "b . e" "c . f"; }
        .bottom .dice-dot:nth-child(1) { grid-area: a; }
        .bottom .dice-dot:nth-child(2) { grid-area: b; }
        .bottom .dice-dot:nth-child(3) { grid-area: c; }
        .bottom .dice-dot:nth-child(4) { grid-area: d; }
        .bottom .dice-dot:nth-child(5) { grid-area: e; }
        .bottom .dice-dot:nth-child(6) { grid-area: f; }

        /* Animasi Jatuh dan Memantul */
        @keyframes bounce {
          0% { transform: translateY(-200px) scale(0.8) rotateZ(0deg); }
          30% { transform: translateY(20px) scale(1.1, 0.9) rotateZ(15deg); }
          50% { transform: translateY(-50px) scale(0.95, 1.05) rotateZ(-10deg); }
          70% { transform: translateY(10px) scale(1.05, 0.95) rotateZ(5deg); }
          85% { transform: translateY(-10px) scale(0.98, 1.02); }
          100% { transform: translateY(0) scale(1) rotateZ(0deg); }
        }

        /* Bayangan */
        .dice-shadow {
          position: absolute;
          bottom: -15px; left: 10%;
          width: 80%; height: 20px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          filter: blur(5px);
          transform: translateZ(-100px); /* Letakkan di bawah lantai */
          transition: all 1.5s;
        }

        .bouncing-shadow {
          animation: shadow-bounce 1.5s cubic-bezier(0.28, 0.84, 0.42, 1);
        }

        @keyframes shadow-bounce {
          0% { transform: scale(0.3) translateZ(-100px); opacity: 0.1; }
          30% { transform: scale(1.2) translateZ(-100px); opacity: 0.3; }
          50% { transform: scale(0.6) translateZ(-100px); opacity: 0.15; }
          70% { transform: scale(1.05) translateZ(-100px); opacity: 0.25; }
          85% { transform: scale(0.8) translateZ(-100px); opacity: 0.18; }
          100% { transform: scale(1) translateZ(-100px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
