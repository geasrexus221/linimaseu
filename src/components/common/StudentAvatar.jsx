import React from 'react';
import { useStore } from '../../store/useStore';

export default function StudentAvatar({ size = 80, showGlow = false, overrideTransforms = null }) {
  const { equippedItems, avatarBaseImage, itemTransforms = {} } = useStore();

  const getTransformStyle = (category) => {
    const transformsToUse = overrideTransforms || itemTransforms;
    const t = transformsToUse[category] || { x: 0, y: 0, scale: 1 };
    const ratio = size / 160;
    return { transform: `translate(calc(-50% + ${t.x * ratio}px), ${t.y * ratio}px) scale(${t.scale})` };
  };

  const getHatEmoji = (id) => {
    const hats = {
      'topi-veteran': '🧢',
      'mahkota': '👑',
      'topi-wisuda': '🎓',
      'topi-pesulap': '🎩',
      'helm-penyelamat': '⛑️',
      'pita-rambut': '🎀'
    };
    return hats[id] || null;
  };

  const getAccessoryEmoji = (id) => {
    const acc = {
      'kacamata': '👓',
      'kacamata-hitam': '🕶️',
      'kacamata-renang': '🥽',
      'bunga-hiasan': '🌸'
    };
    return acc[id] || null;
  };

  const hatEmoji = getHatEmoji(equippedItems.hat);
  const accEmoji = getAccessoryEmoji(equippedItems.accessory);
  const borderClass = equippedItems.border || '';

  return (
    <div className={`avatar-container ${borderClass}`} style={{ '--avatar-size': `${size}px` }}>
      {/* SHINY SPARKLES FOR BORDERS */}
      {borderClass === 'border-gold' && (
        <div className="border-sparkles gold">
          <div className="s-icon s1">✨</div>
          <div className="s-icon s2">⭐</div>
          <div className="s-icon s3">✨</div>
          <div className="s-icon s4">⭐</div>
        </div>
      )}
      {borderClass === 'border-diamond' && (
        <div className="border-sparkles diamond">
          <div className="s-icon s1">💎</div>
          <div className="s-icon s2">✨</div>
          <div className="s-icon s3">💎</div>
          <div className="s-icon s4">✨</div>
        </div>
      )}

      <div className={`avatar-wrapper ${showGlow ? 'glow' : ''}`}>
        {avatarBaseImage ? (
          <img src={avatarBaseImage} alt="Avatar Base" className="avatar-base-img" />
        ) : (
          <div className="avatar-base">👦</div>
        )}

        {accEmoji && (
          <div className="layer acc-layer" style={getTransformStyle('accessory')}>
            {accEmoji}
          </div>
        )}

        {hatEmoji && (
          <div className="layer hat-layer" style={getTransformStyle('hat')}>
            {hatEmoji}
          </div>
        )}
      </div>

      <style jsx>{`
        .avatar-container {
          width: calc(var(--avatar-size) * 1.2);
          height: calc(var(--avatar-size) * 1.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s;
          overflow: visible;
        }

        /* BORDER ASSETS - Moved to a separate layer to avoid clipping children */
        .border-gold::before, .border-diamond::before {
          content: ''; position: absolute; inset: 0;
          border-radius: 50%; z-index: 1;
        }

        .border-gold::before {
          background: linear-gradient(45deg, #FFD700, #FFF9E6, #F39C12, #FFD700);
          background-size: 200% 200%;
          animation: borderRotate 2s linear infinite;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .border-sparkles {
          position: absolute; inset: -15px; z-index: 5; pointer-events: none;
          overflow: visible;
        }
        .s-icon {
          position: absolute; font-size: 1.2rem;
          animation: sparkleFloat 2s ease-in-out infinite;
          filter: drop-shadow(0 0 5px gold);
        }
        .s1 { top: 0; left: 0; animation-delay: 0s; }
        .s2 { top: 0; right: 0; animation-delay: 0.5s; }
        .s3 { bottom: 0; left: 0; animation-delay: 1s; }
        .s4 { bottom: 0; right: 0; animation-delay: 1.5s; }

        @keyframes sparkleFloat {
          0%, 100% { transform: scale(0.8) translateY(0); opacity: 0.5; }
          50% { transform: scale(1.2) translateY(-5px); opacity: 1; }
        }
        .border-diamond::before {
          background: linear-gradient(45deg, #B9F2FF, #FFFFFF, #1CB0F6, #B9F2FF);
          background-size: 200% 200%;
          animation: borderRotate 2s linear infinite;
          box-shadow: 0 0 25px rgba(28, 176, 246, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.8);
        }
        .border-sparkles.diamond .s-icon { filter: drop-shadow(0 0 8px #B9F2FF); }
        @keyframes borderRotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .avatar-wrapper {
          width: calc(var(--avatar-size) * 1.15);
          height: calc(var(--avatar-size) * 1.15);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 50%;
          border: calc(var(--avatar-size) * 0.05) solid #eee;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          z-index: 2;
          overflow: hidden;
        }
        .avatar-wrapper.glow {
          border-color: #f4c265;
          box-shadow: 0 0 20px rgba(255, 150, 0, 0.4);
        }

        .avatar-base {
          font-size: calc(var(--avatar-size) * 0.7);
          line-height: 1;
          z-index: 1;
        }

        .avatar-base-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          z-index: 1;
        }

        .layer {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .hat-layer {
          top: -15%;
          left: 50%;
          transform: translateX(-50%);
          font-size: calc(var(--avatar-size) * 0.5);
          z-index: 10;
        }

        .acc-layer {
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          font-size: calc(var(--avatar-size) * 0.4);
          z-index: 12;
        }

        .clothes-layer {
          bottom: 0%;
          left: 50%;
          transform: translateX(-50%);
          font-size: calc(var(--avatar-size) * 0.6);
          z-index: 5;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
