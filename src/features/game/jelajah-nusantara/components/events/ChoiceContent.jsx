import React from 'react';
import { soundEngine } from '../../logic/soundEngine';

export default function ChoiceContent({ message, remainingSteps, onChoice }) {
  return (
    <div className="choice-container">
      <div className="choice-grid">
        <button className="choice-btn stop" onClick={() => { soundEngine.playSound('click'); onChoice('stop'); }}>
          <div className="choice-icon">🏠</div>
          <div className="choice-text">
            <strong>Istirahat</strong>
            <span>+50 Tekad</span>
          </div>
        </button>
        <button className="choice-btn continue" onClick={() => { soundEngine.playSound('click'); onChoice('continue'); }}>
          <div className="choice-icon">🏃</div>
          <div className="choice-text">
            <strong>Lanjut</strong>
            <span>{remainingSteps} langkah</span>
          </div>
        </button>
      </div>

      <style jsx>{`
        .choice-container { margin-top: 10px; }
        .choice-grid { display: flex; gap: 12px; }
        .choice-btn {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px;
          border-radius: 16px; border: 2px solid #E5E5E5;
          background: #FFFFFF; color: #4B4B4B; cursor: pointer;
          transition: all 0.1s; text-align: center;
          box-shadow: 0 4px 0 #E5E5E5;
        }
        .choice-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 #E5E5E5; }
        
        .choice-btn.stop { border-color: #58CC02; }
        .choice-btn.stop .choice-icon { background: #58CC02; color: white; }
        
        .choice-btn.continue { border-color: #1CB0F6; }
        .choice-btn.continue .choice-icon { background: #1CB0F6; color: white; }
        
        .choice-icon { 
          font-size: 1.5rem; width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .choice-text { display: flex; flex-direction: column; }
        .choice-text strong { font-size: 0.9rem; font-weight: 900; color: #4B4B4B; }
        .choice-text span { font-size: 0.7rem; font-weight: 700; color: #AFAFAF; }
      `}</style>
    </div>
  );
}
