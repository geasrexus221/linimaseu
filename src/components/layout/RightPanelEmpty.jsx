import React from 'react';
import { PanelRight } from 'lucide-react';


export default function RightPanelEmpty() {
  return (
    <div className="right-panel-empty">
      <div className="empty-icon">
        <PanelRight size={32} strokeWidth={1.5} />
      </div>
      <p className="empty-title">Panel Konteks</p>

      <style jsx>{`
        .right-panel-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 12px;
          text-align: center;
          padding: 30px 20px;
          opacity: 0.4;
        }
        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .empty-title {
          margin: 0;
          font-weight: 900;
          font-size: 0.9rem;
          color: var(--text-color);
        }
        .empty-desc {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
