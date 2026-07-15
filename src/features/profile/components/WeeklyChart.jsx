import React from 'react';

export default function WeeklyChart() {
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  const values = [30, 65, 45, 90, 75, 20, 55];
  const maxVal = Math.max(...values);

  return (
    <div className="weekly-chart-card">
      <div className="chart-header">
        <h3>Laporan Mingguan</h3>
        <div className="trend-badge">SI PALING RAJIN! 🚀</div>
      </div>

      <div className="chart-area">
        {values.map((v, i) => (
          <div key={i} className="chart-column">
            <div className="bar-container">
              <div 
                className={`bar-fill ${v === maxVal ? 'is-max' : ''}`} 
                style={{ height: `${v}%` }}
              >
              </div>
            </div>
            <span className="day-label">{days[i]}</span>
          </div>
        ))}
      </div>

      <p className="chart-summary">
        Wah! Kamu belajar paling banyak di hari <strong>Kamis</strong>. Pertahankan ya!
      </p>

      <style jsx>{`
        .weekly-chart-card {
          background: var(--card-bg); border-radius: 28px; padding: 22px;
          border: 3px solid var(--border-color); border-bottom-width: 8px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.01);
        }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .chart-header h3 { font-weight: 950; font-size: 1.2rem; color: var(--text-color); margin: 0; }
        .trend-badge { 
          background: linear-gradient(135deg, #1C80F6 0%, #58cc02 100%);
          color: white; padding: 6px 14px; 
          border-radius: 50px; font-weight: 900; font-size: 0.7rem;
          box-shadow: 0 4px 0 #1063C3;
        }

        .chart-area {
          height: 150px; display: flex; align-items: flex-end; justify-content: space-between;
          padding: 0 10px; margin-bottom: 18px; border-bottom: 3px solid var(--border-color);
        }
        .chart-column { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .bar-container { width: 100%; height: 105px; display: flex; align-items: flex-end; justify-content: center; }
        .bar-fill {
          width: 16px; background: var(--border-color); border-radius: 50px 50px 0 0;
          transition: height 1s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative;
        }
        .bar-fill::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, #A2D2FF 0%, var(--border-color) 100%);
          border-radius: 50px 50px 0 0;
          opacity: 0.45;
        }
        .bar-fill.is-max {
          background: linear-gradient(180deg, #00C6FF 0%, #1C80F6 100%);
          box-shadow: 0 0 15px rgba(28, 176, 246, 0.35);
        }
        .bar-fill.is-max::after {
          display: none;
        }
        .day-label { font-weight: 950; font-size: 0.85rem; color: var(--text-muted); }
        
        .chart-summary { font-size: 0.9rem; color: var(--text-muted); font-weight: 800; text-align: center; line-height: 1.5; margin: 0; }
        .chart-summary strong { color: var(--secondary-color); font-weight: 950; }
      `}</style>
    </div>
  );
}
