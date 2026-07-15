import React, { useState } from 'react';
import Dice3D from '../../components/common/Dice3D';
import { useNavigationStore } from '../../store/useNavigationStore';
import { ChevronLeft } from 'lucide-react';

export default function DiceTestScreen() {
  const { setCurrentView } = useNavigationStore();
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState([]);

  const rollDice = () => {
    if (isRolling) return;
    
    // Angka acak 1-6
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newValue);
    setIsRolling(true);
  };

  const handleRollComplete = () => {
    setIsRolling(false);
    setHistory(prev => [diceValue, ...prev].slice(0, 5)); // Simpan 5 histori terakhir
  };

  return (
    <div className="dice-test-container">
      <header className="test-header">
        <button className="back-btn" onClick={() => setCurrentView('main')}>
          <ChevronLeft size={24} /> Kembali
        </button>
        <h2>Dadu 3D Lab</h2>
      </header>

      <div className="stage-area">
        <div className="stage-light"></div>
        <div className="dice-platform">
          <Dice3D 
            value={diceValue} 
            isRolling={isRolling} 
            onRollComplete={handleRollComplete}
            size={100}
          />
        </div>
      </div>

      <div className="control-panel">
        <button 
          className={`roll-btn ${isRolling ? 'disabled' : ''}`}
          onClick={rollDice}
          disabled={isRolling}
        >
          {isRolling ? 'MEMUTAR...' : 'PUTAR DADU'}
        </button>

        <div className="history-box">
          <h3>Riwayat Lemparan:</h3>
          <div className="history-list">
            {history.length === 0 ? (
              <span className="empty-text">Belum ada lemparan</span>
            ) : (
              history.map((val, idx) => (
                <div key={idx} className="history-pill">
                  {val}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dice-test-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #1a1a2e;
          color: white;
          font-family: 'Outfit', sans-serif;
        }

        .test-header {
          display: flex;
          align-items: center;
          padding: 20px;
          border-bottom: 2px solid rgba(255,255,255,0.1);
        }

        .back-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 15px;
          border-radius: 12px;
          cursor: pointer;
          margin-right: 20px;
        }

        .test-header h2 {
          margin: 0;
          font-weight: 900;
          color: #1CB0F6;
        }

        .stage-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .stage-light {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(28, 176, 246, 0.2) 0%, transparent 70%);
          border-radius: 50%;
        }

        .dice-platform {
          width: 250px;
          height: 250px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed rgba(255,255,255,0.2);
          box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
        }

        .control-panel {
          padding: 30px 20px;
          background: rgba(0,0,0,0.3);
          border-top: 2px solid rgba(255,255,255,0.1);
        }

        .roll-btn {
          width: 100%;
          background: #f4c265;
          color: white;
          border: none;
          padding: 20px;
          border-radius: 20px;
          font-size: 1.2rem;
          font-weight: 900;
          box-shadow: 0 6px 0 #d1a34b;
          cursor: pointer;
          transition: all 0.1s;
          margin-bottom: 30px;
        }

        .roll-btn:active:not(.disabled) {
          transform: translateY(4px);
          box-shadow: 0 2px 0 #d1a34b;
        }

        .roll-btn.disabled {
          background: #555;
          box-shadow: 0 6px 0 #333;
          cursor: not-allowed;
          color: #aaa;
        }

        .history-box h3 {
          font-size: 0.9rem;
          color: #aaa;
          margin: 0 0 10px 0;
          text-transform: uppercase;
        }

        .history-list {
          display: flex;
          gap: 10px;
          min-height: 40px;
        }

        .history-pill {
          background: #1CB0F6;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.2rem;
          box-shadow: 0 4px 0 #1899D6;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .empty-text {
          color: #666;
          font-style: italic;
          align-self: center;
        }

        @keyframes popIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
