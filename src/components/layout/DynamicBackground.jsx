import React from 'react';

const StoryScene = () => (
  <svg className="scene-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
    {/* Mountains */}
    <path d="M0 200 L100 50 L200 200 Z" fill="currentColor" opacity="0.1" />
    <path d="M120 200 L250 80 L380 200 Z" fill="currentColor" opacity="0.07" />
    {/* Rumah Joglo Silhouette */}
    <path d="M50 200 L50 170 L80 140 L110 170 L110 200 Z" fill="currentColor" opacity="0.12" />
    <rect x="65" y="180" width="10" height="20" fill="currentColor" opacity="0.15" />
    {/* Trees */}
    <circle cx="300" cy="180" r="15" fill="currentColor" opacity="0.08" />
    <circle cx="320" cy="185" r="12" fill="currentColor" opacity="0.08" />
  </svg>
);

const QuizScene = () => (
  <svg className="scene-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
    {/* Stacked Books */}
    <rect x="40" y="160" width="80" height="15" rx="2" fill="currentColor" opacity="0.12" />
    <rect x="45" y="145" width="70" height="15" rx="2" fill="currentColor" opacity="0.1" />
    <rect x="50" y="130" width="60" height="15" rx="2" fill="currentColor" opacity="0.08" />
    {/* Graduation Cap */}
    <path d="M280 100 L330 80 L380 100 L330 120 Z" fill="currentColor" opacity="0.15" />
    <rect x="310" y="110" width="40" height="20" fill="currentColor" opacity="0.12" />
    <path d="M380 100 L380 130" stroke="currentColor" strokeWidth="2" opacity="0.15" />
  </svg>
);

const GameScene = () => (
  <svg className="scene-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
    {/* Floating Island with Flag */}
    <ellipse cx="200" cy="140" rx="100" ry="30" fill="currentColor" opacity="0.1" />
    <path d="M180 140 L180 60 L220 75 L180 90" fill="currentColor" opacity="0.15" />
    <rect x="178" y="60" width="4" height="80" fill="currentColor" opacity="0.12" />
    {/* Small secondary islands */}
    <ellipse cx="60" cy="80" rx="30" ry="10" fill="currentColor" opacity="0.06" />
    <ellipse cx="340" cy="60" rx="25" ry="8" fill="currentColor" opacity="0.06" />
  </svg>
);

const ProfileScene = () => (
  <svg className="scene-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
    {/* Large Trophy */}
    <path d="M160 80 L240 80 L230 150 L170 150 Z" fill="currentColor" opacity="0.12" />
    <path d="M160 90 C 140 90, 140 120, 160 120" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.1" />
    <path d="M240 90 C 260 90, 260 120, 240 120" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.1" />
    <rect x="180" y="150" width="40" height="10" fill="currentColor" opacity="0.12" />
    <rect x="165" y="160" width="70" height="10" rx="2" fill="currentColor" opacity="0.15" />
    {/* Stars around */}
    <path d="M80 60 L85 75 L100 75 L88 85 L92 100 L80 90 L68 100 L72 85 L60 75 L75 75 Z" fill="currentColor" opacity="0.1" />
    <path d="M320 40 L323 50 L333 50 L325 57 L328 67 L320 60 L312 67 L315 57 L307 50 L317 50 Z" fill="currentColor" opacity="0.08" />
  </svg>
);

export default function DynamicBackground({ activeTab }) {
  const renderScene = () => {
    switch (activeTab) {
      case 'story': return <StoryScene />;
      case 'quiz': return <QuizScene />;
      case 'game': return <GameScene />;
      case 'profile': return <ProfileScene />;
      default: return null;
    }
  };

  const getThemeColor = () => {
    switch (activeTab) {
      case 'story': return '#f4c265';
      case 'quiz': return '#1cb0f6';
      case 'game': return '#ce82ff';
      case 'profile': return '#58cc02';
      default: return '#afbcc9';
    }
  };

  return (
    <div className="dynamic-bg-container" style={{ '--scene-color': getThemeColor() }}>
      <div className="scene-wrapper">
        {renderScene()}
      </div>
      
      <style jsx>{`
        .dynamic-bg-container {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: -1;
          background: var(--background-color);
          overflow: hidden;
          transition: background 0.5s ease;
        }
        .scene-wrapper {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          pointer-events: none;
          color: var(--scene-color);
        }
        :global(.scene-svg) {
          width: 100%;
          height: 50%;
          animation: fadeSlideUp 0.8s ease-out;
        }
        @keyframes fadeSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
