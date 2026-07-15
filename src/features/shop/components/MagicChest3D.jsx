import React from 'react';

export default function MagicChest3D({ isVibrating, isOpen, rarity = 'common' }) {
  // Rarity colors for the glow and accents
  const colors = {
    common: '#AFAFAF',
    rare: '#1CB0F6',
    epic: '#FFD700',
  };
  const glowColor = colors[rarity];

  return (
    <div className={`magic-chest-3d-wrapper ${isVibrating ? 'vibrating' : ''} ${isOpen ? 'open' : ''}`}>
      
      {/* Light rays that appear when opening */}
      {isOpen && (
        <div className="chest-light-rays" style={{ '--glow': glowColor }}>
          <div className="ray r1" />
          <div className="ray r2" />
          <div className="ray r3" />
        </div>
      )}

      <div className="chest-scene">
        <div className="chest-pivot">
          
          {/* Base of the chest */}
          <div className="chest-base">
            <div className="c-face c-front">
              <div className="lock-base">
                <div className="keyhole" />
              </div>
            </div>
            <div className="c-face c-back"></div>
            <div className="c-face c-left"></div>
            <div className="c-face c-right"></div>
            <div className="c-face c-bottom"></div>
            {/* The glowing inside */}
            <div className="c-face c-top-inside" style={{ '--glow': glowColor }}></div>
          </div>

          {/* Lid of the chest */}
          <div className="chest-lid">
            <div className="l-face l-front">
              <div className="lock-top"></div>
            </div>
            <div className="l-face l-back"></div>
            <div className="l-face l-left"></div>
            <div className="l-face l-right"></div>
            <div className="l-face l-top">
              <div className="gold-band b1"></div>
              <div className="gold-band b2"></div>
            </div>
            <div className="l-face l-bottom-inside"></div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .magic-chest-3d-wrapper {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
          margin: 0 auto;
        }

        /* Idle Animation */
        .chest-scene {
          position: relative;
          width: 100px;
          height: 100px;
          transform-style: preserve-3d;
          animation: floatIdle 4s ease-in-out infinite;
        }

        @keyframes floatIdle {
          0%, 100% { transform: translateY(0) rotateX(-15deg) rotateY(20deg); }
          50% { transform: translateY(-15px) rotateX(-10deg) rotateY(25deg); }
        }

        /* Vibrating Animation */
        .vibrating .chest-scene {
          animation: shakeChest 0.1s infinite;
        }

        @keyframes shakeChest {
          0%, 100% { transform: translateX(0) rotateX(-15deg) rotateY(20deg); }
          25% { transform: translateX(-4px) rotateX(-18deg) rotateY(18deg) scale(1.05); }
          75% { transform: translateX(4px) rotateX(-12deg) rotateY(22deg) scale(1.05); }
        }

        /* Open State */
        .open .chest-scene {
          animation: settleOpen 0.5s forwards;
        }
        @keyframes settleOpen {
          to { transform: translateY(10px) rotateX(-5deg) rotateY(0deg); }
        }

        .chest-pivot {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        /* Shared Face Styles */
        .c-face, .l-face {
          position: absolute;
          background-color: #8B4513; /* Brown wood */
          border: 3px solid #FFD700; /* Gold trim */
          box-sizing: border-box;
          backface-visibility: visible;
        }

        /* --- BASE --- */
        /* W: 120, H: 60, D: 80 */
        .chest-base {
          position: absolute;
          bottom: 0;
          left: -10px; /* Center adjustment */
          width: 120px;
          height: 60px;
          transform-style: preserve-3d;
        }

        .c-face { left: 0; top: 0; }
        .c-front  { width: 120px; height: 60px; transform: rotateY(0deg) translateZ(40px); background: linear-gradient(#A0522D, #8B4513); }
        .c-back   { width: 120px; height: 60px; transform: rotateY(180deg) translateZ(40px); background: #5C2E0C; }
        .c-left   { width: 80px; height: 60px; left: 20px; transform: rotateY(-90deg) translateZ(60px); background: #6F370F; }
        .c-right  { width: 80px; height: 60px; left: 20px; transform: rotateY(90deg) translateZ(60px); background: #A0522D; }
        .c-bottom { width: 120px; height: 80px; top: -10px; transform: rotateX(-90deg) translateZ(30px); background: #3B1C06; border: none; }
        
        .c-top-inside { 
          width: 114px; height: 74px; 
          left: 3px; top: -7px;
          transform: rotateX(90deg) translateZ(30px); 
          background: #1A0D03; border: none;
          display: flex; align-items: center; justify-content: center;
        }
        
        .open .c-top-inside::after {
          content: '';
          position: absolute; inset: 0;
          background: var(--glow);
          filter: blur(20px);
          opacity: 0.8;
          animation: pulseGlow 2s infinite;
        }

        @keyframes pulseGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

        .lock-base {
          position: absolute; top: -5px; left: 50%; transform: translateX(-50%);
          width: 20px; height: 25px; background: #FFD700; border-radius: 4px;
          box-shadow: inset 0 -2px 0 rgba(0,0,0,0.2);
          display: flex; justify-content: center; align-items: center;
        }
        .keyhole { width: 4px; height: 8px; background: #333; border-radius: 2px; }

        /* --- LID --- */
        /* W: 120, H: 40, D: 80 */
        .chest-lid {
          position: absolute;
          bottom: 60px; /* Sits exactly on top of base */
          left: -10px;
          width: 120px;
          height: 40px;
          transform-style: preserve-3d;
          transform-origin: center bottom -40px; /* Hinge at the back bottom of the lid */
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .open .chest-lid {
          transform: rotateX(105deg);
        }

        .l-face { left: 0; top: 0; }
        .l-front  { width: 120px; height: 40px; transform: rotateY(0deg) translateZ(40px); background: linear-gradient(#C27A45, #A0522D); }
        .l-back   { width: 120px; height: 40px; transform: rotateY(180deg) translateZ(40px); background: #8B4513; }
        .l-left   { width: 80px; height: 40px; left: 20px; transform: rotateY(-90deg) translateZ(60px); background: #8B4513; }
        .l-right  { width: 80px; height: 40px; left: 20px; transform: rotateY(90deg) translateZ(60px); background: #C27A45; }
        .l-top    { 
          width: 120px; height: 80px; top: -20px; transform: rotateX(90deg) translateZ(20px); 
          background: #A0522D; overflow: hidden;
        }
        .l-bottom-inside { 
          width: 114px; height: 74px; left: 3px; top: -17px; 
          transform: rotateX(-90deg) translateZ(20px); 
          background: #3B1C06; border: none;
        }

        .gold-band { position: absolute; height: 100%; width: 15px; background: #FFD700; top: 0; box-shadow: inset 0 0 5px rgba(0,0,0,0.3); }
        .b1 { left: 15px; }
        .b2 { right: 15px; }

        .lock-top {
          position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
          width: 24px; height: 15px; background: #FFD700; border-radius: 4px 4px 0 0;
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.4);
        }

        /* Light Rays Effect */
        .chest-light-rays {
          position: absolute;
          top: -50px;
          width: 100%;
          height: 200px;
          display: flex;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }

        .ray {
          position: absolute;
          bottom: 0;
          width: 40px;
          height: 100%;
          background: linear-gradient(to top, var(--glow), transparent);
          filter: blur(8px);
          opacity: 0;
          transform-origin: bottom center;
          animation: shootRay 2s ease-out forwards;
        }

        .r1 { transform: rotate(-25deg); animation-delay: 0.1s; }
        .r2 { transform: rotate(0deg); width: 60px; height: 120%; animation-delay: 0s; }
        .r3 { transform: rotate(25deg); animation-delay: 0.2s; }

        @keyframes shootRay {
          0% { transform: scaleY(0) rotate(var(--rot, 0deg)); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: scaleY(1) rotate(var(--rot, 0deg)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
