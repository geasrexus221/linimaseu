import React from 'react';

const HEROES = [
  { id: 'dewi', name: 'Dewi Sartika', icon: '🌸', collected: true, color: '#FFB7C5' },
  { id: 'patti', name: 'Pattimura', icon: '⚔️', collected: false, color: '#FF4B4B' },
  { id: 'hasan', name: 'Hasanuddin', icon: '🦅', collected: false, color: '#f4c265' },
  { id: 'kartini', name: 'Kartini', icon: '📖', collected: false, color: '#58CC02' },
];

export default function HeroCollection() {
  return (
    <div className="hero-collection-card">
      <h3 className="section-title">Koleksi Pahlawan</h3>
      <div className="hero-grid-fun">
        {HEROES.map(hero => (
          <div key={hero.id} className={`hero-item-fun ${hero.collected ? '' : 'is-locked'}`}>
            <div className="hero-icon-bubble" style={{ '--accent': hero.color }}>
              <span className="hero-emoji-large">{hero.icon}</span>
              {!hero.collected && <div className="lock-tag">🔒</div>}
            </div>
            <span className="hero-name-label">{hero.name}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .hero-collection-card {
          background: var(--card-bg); border-radius: 28px; padding: 22px;
          border: 3px solid var(--border-color); border-bottom-width: 8px;
        }
        .section-title { font-weight: 950; font-size: 1.2rem; color: var(--text-color); margin: 0 0 20px 0; }
        .hero-grid-fun { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .hero-item-fun { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        
        .hero-icon-bubble {
          width: 70px; height: 75px; background: var(--card-bg); border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          border: 3px solid var(--border-color); position: relative; transition: all 0.2s;
          box-shadow: 0 4px 0 var(--border-color);
          overflow: hidden;
        }
        .hero-icon-bubble::before {
          content: ''; position: absolute; inset: 4px;
          background: radial-gradient(circle, var(--accent) 0%, transparent 75%);
          opacity: 0.35; border-radius: 16px; pointer-events: none;
        }
        .hero-emoji-large { font-size: 2.3rem; z-index: 2; }
        
        .hero-item-fun.is-locked .hero-icon-bubble { 
          filter: grayscale(1); opacity: 0.6; background: var(--border-color);
          box-shadow: none;
        }
        .hero-item-fun.is-locked .hero-icon-bubble::before {
          display: none;
        }
        .lock-tag {
          position: absolute; bottom: 4px; right: 4px; background: var(--border-color);
          width: 22px; height: 22px; border-radius: 6px; font-size: 0.75rem;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--card-bg); z-index: 3;
        }

        .hero-item-fun:not(.is-locked):hover .hero-icon-bubble {
          transform: translateY(-5px) scale(1.05);
          border-color: var(--accent);
          box-shadow: 0 8px 15px rgba(0,0,0,0.08);
        }

        .hero-name-label { font-weight: 900; font-size: 0.7rem; color: var(--text-muted); text-align: center; line-height: 1.25; }
        .hero-item-fun:not(.is-locked):hover .hero-name-label { color: var(--text-color); }
      `}</style>
    </div>
  );
}
