import React, { useState, useEffect } from 'react';

export default function LandscapeWrapper({ children, disableRotation = false }) {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isDesktop || disableRotation) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#07071a' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden',
      background: '#07071a',
      zIndex: 1000
    }}>
      {/* Main Content Area */}
      <div style={{
        width: isPortrait ? '100vh' : '100vw',
        height: isPortrait ? '100vw' : '100vh',
        position: 'absolute',
        top: isPortrait ? '50%' : '0',
        left: isPortrait ? '50%' : '0',
        transform: isPortrait ? 'translate(-50%, -50%) rotate(90deg)' : 'none',
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease-out',
      }}>
        {children}
      </div>
    </div>
  );
}
