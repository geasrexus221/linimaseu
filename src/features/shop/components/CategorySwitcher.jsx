import React from 'react';
import { Shirt, Zap, Box } from 'lucide-react';

export default function CategorySwitcher({ active, onChange }) {
  const categories = [
    { id: 'cosmetic', label: 'Pakaian', icon: <Shirt size={20} />, color: '#1CB0F6', shadow: '#1485BA' },
    { id: 'refill', label: 'Isi Ulang', icon: <Zap size={20} />, color: '#f4c265', shadow: '#D97706' },
    { id: 'gacha', label: 'Peti Ajaib', icon: <Box size={20} />, color: '#CE82FF', shadow: '#AF6EE1' },
  ];

  return (
    <div className="category-switcher-container">
      {categories.map(cat => (
        <button 
          key={cat.id}
          className={`switch-pill ${active === cat.id ? 'active' : ''}`}
          onClick={() => onChange(cat.id)}
          style={{ '--theme': cat.color, '--theme-shadow': cat.shadow }}
        >
          <div className="pill-inner">
            <div className="icon-circle">{cat.icon}</div>
            <span>{cat.label.toUpperCase()}</span>
          </div>
          <div className="pill-bottom"></div>
        </button>
      ))}

      <style jsx>{`
        .category-switcher-container {
          display: flex; 
          gap: 12px; 
          padding: 24px 20px;
          justify-content: center; 
          background: var(--card-bg);
          border-bottom: 2px dashed var(--border-color);
        }
        .switch-pill {
          flex: 1; 
          height: 52px; 
          position: relative; 
          background: none; 
          border: none; 
          cursor: pointer;
        }
        .pill-inner {
          position: absolute; 
          inset: 0; 
          background: var(--background-color); 
          border-radius: 18px;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 10px;
          z-index: 2; 
          border: 3px solid var(--border-color); 
          transition: transform 0.1s, background-color 0.2s, border-color 0.2s;
        }
        .pill-bottom { 
          position: absolute; 
          inset: 0; 
          bottom: -6px; 
          background: var(--border-color); 
          border-radius: 18px; 
          z-index: 1; 
          transition: bottom 0.1s;
        }
        
        .icon-circle { 
          color: var(--text-muted); 
          display: flex; 
          align-items: center; 
          transition: transform 0.2s;
        }
        .pill-inner span { 
          font-weight: 900; 
          font-size: 0.85rem; 
          color: var(--text-muted); 
          letter-spacing: 0.5px;
        }

        .switch-pill:hover:not(.active) .icon-circle {
          transform: scale(1.1) rotate(-5deg);
        }

        .switch-pill.active .pill-inner { 
          background: var(--theme); 
          border-color: var(--theme); 
          transform: translateY(-2px);
        }
        .switch-pill.active .pill-bottom { 
          background: var(--theme-shadow);
          bottom: -6px;
        }
        .switch-pill.active .icon-circle, .switch-pill.active span { 
          color: white; 
        }

        .switch-pill:active .pill-inner { 
          transform: translateY(4px); 
        }
        .switch-pill:active .pill-bottom { 
          bottom: -2px; 
        }
      `}</style>
    </div>
  );
}
