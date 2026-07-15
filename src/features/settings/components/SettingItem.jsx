import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function SettingItem({ icon: Icon, label, onClick, color = '#1CB0F6', value }) {
  return (
    <div className="setting-item" onClick={onClick}>
      <div className="setting-left">
        <div className="setting-icon-wrapper" style={{ backgroundColor: `${color}15`, color: color }}>
          <Icon size={20} />
        </div>
        <span className="setting-label">{label}</span>
      </div>
      
      <div className="setting-right">
        {value && <span className="setting-value">{value}</span>}
        <ChevronRight size={18} className="setting-arrow" />
      </div>

      <style jsx>{`
        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
        }

        .setting-item:active {
          background: rgba(0,0,0,0.05);
          transform: scale(0.98);
        }

        .setting-left, .setting-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .setting-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 0 rgba(0,0,0,0.05);
        }

        .setting-label {
          font-weight: 700;
          color: var(--text-color);
          font-size: 1rem;
        }

        .setting-value {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .setting-arrow {
          color: var(--text-muted);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
