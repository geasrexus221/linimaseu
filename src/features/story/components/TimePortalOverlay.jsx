import React, { useEffect, useState } from 'react';
import { soundManager } from '../../../utils/SoundManager';

export default function TimePortalOverlay({ color = '#1CB0F6', onComplete }) {
  const [phase, setPhase] = useState('entering');

  useEffect(() => {
    soundManager.play('whoosh', 0.6);
    const enterTimer = setTimeout(() => setPhase('active'), 50);
    const completeTimer = setTimeout(() => {
      setPhase('leaving');
      if (onComplete) onComplete();
    }, 2200); // Slower, more atmospheric duration

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`smooth-portal-wrapper ${phase}`}>
      <div className="portal-container" style={{ '--p-color': color }}>
        {/* Layered Round Rings */}
        <div className="portal-ring r1" />
        <div className="portal-ring r2" />
        <div className="portal-ring r3" />
        <div className="portal-ring r4" />
        
        {/* Soft Particles */}
        <div className="soft-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="s-particle" style={{ '--d': `${i * 0.2}s`, '--a': `${i * 30}deg` }} />
          ))}
        </div>

        {/* Pure Glowing Core */}
        <div className="portal-sphere">
          <div className="sphere-glow" />
        </div>
      </div>

      <style jsx>{`
        .smooth-portal-wrapper {
          position: fixed; inset: 0;
          display: flex; justify-content: center; align-items: center;
          z-index: 9999; pointer-events: none;
          transition: opacity 0.8s ease;
        }
        .smooth-portal-wrapper.entering { opacity: 0; }
        .smooth-portal-wrapper.active { opacity: 1; pointer-events: all; }
        .smooth-portal-wrapper.leaving { opacity: 0; }

        .portal-container {
          position: relative; width: 100vw; height: 100vh;
          background: #000; display: flex; justify-content: center; align-items: center;
          overflow: hidden;
        }

        .portal-ring {
          position: absolute; border: 2px solid var(--p-color);
          border-radius: 50%; opacity: 0;
          will-change: transform, opacity;
        }

        .r1 { width: 100px; height: 100px; animation: smoothExpand 2.2s ease-out infinite; }
        .r2 { width: 100px; height: 100px; animation: smoothExpand 2.2s ease-out infinite 0.5s; }
        .r3 { width: 100px; height: 100px; animation: smoothExpand 2.2s ease-out infinite 1s; }
        .r4 { width: 100px; height: 100px; animation: smoothExpand 2.2s ease-out infinite 1.5s; }

        @keyframes smoothExpand {
          0% { transform: scale(0.5); opacity: 0; }
          20% { opacity: 0.4; }
          100% { transform: scale(12); opacity: 0; }
        }

        .portal-sphere {
          position: relative; width: 120px; height: 120px;
          background: white; border-radius: 50%;
          box-shadow: 0 0 60px 20px var(--p-color);
          z-index: 10; animation: sphereBreath 2s ease-in-out infinite;
        }
        .sphere-glow {
          position: absolute; inset: -20px;
          background: radial-gradient(circle, var(--p-color) 0%, transparent 70%);
          border-radius: 50%; opacity: 0.5;
        }

        @keyframes sphereBreath {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px 20px var(--p-color); }
          50% { transform: scale(1.1); box-shadow: 0 0 80px 30px var(--p-color); }
        }

        .soft-particles { position: absolute; inset: 0; }
        .s-particle {
          position: absolute; width: 6px; height: 6px;
          background: white; border-radius: 50%;
          left: 50%; top: 50%; opacity: 0;
          animation: particleDrift 2.2s linear infinite var(--d);
        }

        @keyframes particleDrift {
          0% { transform: rotate(var(--a)) translateX(0) scale(1); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: rotate(var(--a)) translateX(300px) scale(0); opacity: 0; }
        }

        .smooth-portal-wrapper.active::after {
          content: ''; position: absolute; inset: 0;
          background: white; opacity: 0;
          animation: gentleFlash 0.6s forwards 1.6s;
          z-index: 100;
        }
        @keyframes gentleFlash { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
      `}</style>
    </div>
  );
}
