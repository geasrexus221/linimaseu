import React from 'react';
import { Zap, Target, Book, Star, Trophy, Award } from 'lucide-react';

export default function StatsGrid({ streak, accuracy, chapters, stars, rank }) {
  const stats = [
    { label: 'HARI STREAK', value: streak, icon: <Zap size={22} fill="#f4c265" color="#f4c265" />, color: '#f4c265', bg: 'rgba(244, 194, 101, 0.1)' },
    { label: 'AKURASI', value: accuracy + '%', icon: <Target size={22} color="#58cc02" />, color: '#58cc02', bg: 'rgba(88, 204, 2, 0.1)' },
    { label: 'PERINGKAT', value: rank, icon: <Award size={22} color="#ffc800" />, color: '#ffc800', bg: 'rgba(255, 200, 0, 0.1)' }
  ];

  return (
    <div className="stats-grid-wrapper">
      {stats.map((s, idx) => (
        <div key={idx} className="stat-card-3d" style={{ '--accent': s.color, '--bg': s.bg }}>
          <div className="stat-card-content">
            <div className="stat-card-header">
              <span className="stat-lbl">{s.label}</span>
            </div>
            <div className="stat-card-body">
              <div className="stat-icon-box">{s.icon}</div>
              <span className="stat-val">{s.value}</span>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .stats-grid-wrapper {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
          padding: 5px 5px 12px;
        }
        .stat-card-3d {
          position: relative; height: 115px; background: none; border: none;
        }
        .stat-card-content {
          position: absolute; inset: 0; background: var(--card-bg); border-radius: 20px;
          display: flex; flex-direction: column; overflow: hidden; z-index: 2;
          border: 3px solid var(--border-color);
          box-shadow: 0 6px 0 var(--border-color);
          transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .stat-card-3d:hover .stat-card-content {
          transform: translateY(-4px);
          box-shadow: 0 10px 0 var(--border-color);
        }
        .stat-card-3d:active .stat-card-content {
          transform: translateY(2px);
          box-shadow: 0 4px 0 var(--border-color);
        }
        .stat-card-header {
          background: var(--accent);
          padding: 6px;
          text-align: center;
          border-bottom: 3px solid var(--border-color);
        }
        .stat-lbl {
          font-weight: 900;
          font-size: 0.65rem;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.15);
          letter-spacing: 0.5px;
          display: block;
        }
        .stat-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          background: var(--card-bg);
        }
        .stat-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0.9);
        }
        .stat-val {
          font-weight: 950;
          font-size: 1.3rem;
          color: var(--text-color);
          line-height: 1;
        }
      `}</style>
    </div>
  );
}
