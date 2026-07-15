import React, { useState } from 'react';
import { ChevronLeft, Play, Info, Share2, Star, Swords, X } from 'lucide-react';
import { useStore } from '../../../../store/useStore';
import { useNavigationStore } from '../../../../store/useNavigationStore';

export default function TarikTambangLobbyScreen({ onStart }) {
  const { theme, isDevMode } = useStore();
  const isDark = theme === 'dark';
  const { setGameSubView } = useNavigationStore();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="game-intro-container">
      {/* Dynamic Background */}
      <div className="bg-map-pattern" />
      <div className="floating-clouds">
        <div className="cloud c1">☁️</div>
        <div className="cloud c2">☁️</div>
        <div className="cloud c3">☁️</div>
      </div>

      {/* Header Area */}
      <header className="intro-header">
        <button className="back-btn-3d" onClick={() => setGameSubView('arcade')}>
          <ChevronLeft size={24} />
        </button>
        
        <div className="torch-stats-badge">
          <div className="torch-glow-icon">
            <Star size={16} fill="#FFD700" color="#f4c265" />
          </div>
          <span className="count">?</span>
          <span className="label">HADIAH</span>
        </div>
      </header>

      <div className="intro-main-scrollable">
        {/* Title & Badge Section */}
        <div className="title-section-pop">
          <div className="game-category-tag">DUEL PENGETAHUAN</div>
          <h1 className="game-main-title">
            Adu <br />
            <span className="accent">Cendekiawan</span>
          </h1>
          <div className="title-underline" />
        </div>

        {/* Hero Visual Section */}
        <div className="adventure-hero-box">
          <div className="hero-island-platform">
            <div className="rope-container">
              <span className="avatar p1">🤠</span>
              <span className="rope">════════</span>
              <span className="avatar p2">🤖</span>
            </div>
            <div className="island-shadow" />
            <div className="sparkles-fx">
              <Star className="s-fx f1" size={16} fill="#FFD700" color="#FFD700" />
              <Star className="s-fx f2" size={20} fill="#FFD700" color="#FFD700" />
            </div>
          </div>
          
          {/* Game Description */}
          <div className="game-description-box">
            <p>
              "Jawab pertanyaan dengan cepat dan tepat! Kumpulkan skor tarikan ke arahmu untuk menjatuhkan lawan dan menjadi juara!"
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="primary-actions-stack">
          <button className="giant-play-btn" onClick={() => onStart('normal')}>
            <div className="play-btn-face">
              <Play size={28} fill="currentColor" />
              <span>MULAI PERTANDINGAN</span>
            </div>
            <div className="play-btn-shadow" />
          </button>

          <div className="secondary-grid">
            <button className="square-action-btn invite">
              <div className="btn-face"><Swords size={24} /></div>
              <div className="btn-shadow" />
              <span className="btn-label">Kesulitan</span>
            </button>

            <button className="square-action-btn share">
              <div className="btn-face"><Share2 size={24} /></div>
              <div className="btn-shadow" />
              <span className="btn-label">Bagikan</span>
            </button>

            <button className="square-action-btn info" onClick={() => setShowHelp(true)}>
              <div className="btn-face"><Info size={24} /></div>
              <div className="btn-shadow" />
              <span className="btn-label">Bantuan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setShowHelp(false)}><X size={18} /></button>
            <div className="modal-icon"><Info size={40} color="#f4c265" /></div>
            <h2>Aturan Adu Cendekiawan</h2>
            <div className="rules-list">
              <div className="rule-item">
                <span className="rule-num">1</span>
                <p>Adu kecepatan dan ketepatan menjawab soal melawan musuhmu.</p>
              </div>
              <div className="rule-item">
                <span className="rule-num">2</span>
                <p>Jawaban <b>Benar & Cepat</b> (&lt; 3 detik) menarik lawan kuat sejauh 3 Poin (HP).</p>
              </div>
              <div className="rule-item">
                <span className="rule-num">3</span>
                <p>Jawaban <b>Salah & Cepat</b> membuatmu terseret oleh lawan sejauh 3 Poin.</p>
              </div>
              <div className="rule-item">
                <span className="rule-num">4</span>
                <p>Kuras HP (Daya Tarik) lawan hingga 0 untuk menang seketika!</p>
              </div>
            </div>
            <button className="got-it-btn" onClick={() => setShowHelp(false)}>SAYA MENGERTI</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .game-intro-container {
          position: absolute; inset: 0;
          background: #1e1e2e;
          display: flex; flex-direction: column;
          font-family: 'Outfit', sans-serif;
          z-index: 10; overflow: hidden;
        }

        .bg-map-pattern {
          position: absolute; inset: 0;
          opacity: 0.1;
          background-image: radial-gradient(#1CB0F6 1.5px, transparent 1.5px);
          background-size: 30px 30px;
          z-index: 0;
        }

        .floating-clouds { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .cloud { position: absolute; font-size: 2.5rem; opacity: 0.2; }
        .c1 { top: 15%; left: 5%; animation: float 10s infinite ease-in-out; }
        .c2 { top: 25%; right: 10%; animation: float 12s infinite ease-in-out reverse; }
        .c3 { bottom: 30%; left: 15%; animation: float 8s infinite ease-in-out 1s; }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -15px); }
        }

        .intro-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 20px; z-index: 10;
        }

        .back-btn-3d {
          background: #2b2b3d; border: 2px solid #3c3c54;
          box-shadow: 0 3px 0 #181826;
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: white; cursor: pointer;
        }
        .back-btn-3d:active { transform: translateY(2px); box-shadow: 0 1px 0 #181826; }

        .torch-stats-badge {
          background: #f4c265; border-radius: 50px;
          display: flex; align-items: center; padding: 4px 12px; gap: 6px;
          box-shadow: 0 3px 0 #d1a34b; border: 2px solid rgba(255,255,255,0.2);
        }
        .torch-glow-icon { filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
        .torch-stats-badge .count { color: white; font-weight: 900; font-size: 0.95rem; }
        .torch-stats-badge .label { color: rgba(255,255,255,0.8); font-weight: 800; font-size: 0.55rem; }

        .intro-main-scrollable {
          flex: 1; overflow-y: auto; display: flex; flex-direction: column;
          align-items: center; padding: 0 20px 100px; z-index: 5;
          scrollbar-width: none;
        }
        .intro-main-scrollable::-webkit-scrollbar { display: none; }

        .title-section-pop { text-align: center; margin-top: 5px; margin-bottom: 20px; }
        .game-category-tag {
          display: inline-block; background: #CE82FF; color: white;
          padding: 3px 10px; border-radius: 50px; font-weight: 900;
          font-size: 0.6rem; letter-spacing: 1px; margin-bottom: 6px;
        }
        .game-main-title {
          font-weight: 900; font-size: 2rem; color: white;
          line-height: 0.9; margin: 0;
        }
        .game-main-title .accent { color: #1CB0F6; }
        .title-underline {
          width: 50px; height: 5px; background: #58CC02;
          margin: 8px auto 0; border-radius: 10px;
        }

        .adventure-hero-box {
          width: 100%; display: flex; flex-direction: column; align-items: center;
          margin-bottom: 25px;
        }
        .hero-island-platform {
          position: relative; height: 80px; width: 160px;
          display: flex; justify-content: center; align-items: center;
        }
        .rope-container {
          display: flex; align-items: center; font-size: 2.5rem;
          z-index: 3; animation: bounceHero 3s infinite ease-in-out;
        }
        .rope { color: #d4a373; font-size: 1rem; letter-spacing: -2px; transform: scaleY(0.5); margin: 0 5px; }
        .avatar { filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); }
        
        .island-shadow {
          position: absolute; bottom: 10px; width: 120px; height: 15px;
          background: rgba(0,0,0,0.3); filter: blur(5px); border-radius: 50%;
        }
        @keyframes bounceHero { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .sparkles-fx { position: absolute; inset: -20px; pointer-events: none; }
        .s-fx { position: absolute; animation: twinkle 2s infinite; }
        .f1 { top: 0; left: 10%; }
        .f2 { bottom: 20%; right: 10%; animation-delay: 0.5s; }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }

        .game-description-box {
          margin-top: 15px; background: #2B2B2B;
          padding: 12px 15px; border-radius: 16px; border: 2.5px solid #1CB0F6;
          max-width: 280px; text-align: center; position: relative;
          box-shadow: 0 4px 0 #1A1A1A;
        }
        .game-description-box::after {
          content: ''; position: absolute; top: -12px; right: 30px;
          border-left: 12px solid transparent; border-right: 12px solid transparent;
          border-bottom: 12px solid #1CB0F6;
        }
        .game-description-box p {
          margin: 0; color: #FFFFFF; font-weight: 800;
          font-size: 0.85rem; line-height: 1.3;
        }

        .primary-actions-stack {
          width: 100%; max-width: 320px; display: flex; flex-direction: column;
          gap: 15px; margin-bottom: 25px;
        }

        .giant-play-btn {
          position: relative; width: 100%; height: 65px; background: none; border: none; cursor: pointer;
        }
        .play-btn-face {
          position: absolute; inset: 0; background: #58CC02; border-radius: 20px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          color: white; z-index: 2; font-weight: 900; font-size: 1rem;
          border: 2px solid rgba(255,255,255,0.2); transition: transform 0.1s;
        }
        .play-btn-shadow {
          position: absolute; inset: 0; bottom: -6px; background: #46A302;
          border-radius: 20px; z-index: 1;
        }
        .giant-play-btn:active .play-btn-face { transform: translateY(3px); }
        .giant-play-btn:active .play-btn-shadow { bottom: -3px; }

        .secondary-grid { display: flex; justify-content: space-between; gap: 12px; }
        .square-action-btn {
          position: relative; flex: 1; height: 55px; background: none; border: none;
          cursor: pointer; display: flex; flex-direction: column; align-items: center;
        }
        .btn-face {
          position: absolute; inset: 0; background: #2b2b3d;
          border: 2px solid #3c3c54; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: #1CB0F6; z-index: 2; transition: transform 0.1s;
        }
        .btn-shadow {
          position: absolute; inset: 0; bottom: -5px; background: #181826;
          border-radius: 16px; z-index: 1;
        }
        .square-action-btn:active .btn-face { transform: translateY(2px); }
        .square-action-btn:active .btn-shadow { bottom: -2px; }
        .btn-label {
          position: absolute; bottom: -20px; font-size: 0.6rem;
          font-weight: 900; color: #8c8c9e; white-space: nowrap;
        }

        .square-action-btn.share .btn-face { color: #58CC02; }
        .square-action-btn.info .btn-face { color: #f4c265; }
        .square-action-btn.invite .btn-face { color: #ce82ff; }

        /* Modal Styles */
        .modal-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(3px);
          display: flex; justify-content: center; align-items: center; z-index: 100;
        }
        .modal-card {
          background: #2b2b3d; width: 90%; max-width: 320px; border-radius: 24px;
          padding: 25px 20px; border: 4px solid #3c3c54; position: relative;
          display: flex; flex-direction: column; align-items: center;
          animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .close-btn {
          position: absolute; top: 15px; right: 15px; background: #3c3c54; color: white;
          border: none; width: 30px; height: 30px; border-radius: 50%; display: flex;
          justify-content: center; align-items: center; cursor: pointer;
        }
        .modal-icon { margin-bottom: 5px; }
        .modal-card h2 { color: white; font-weight: 900; font-size: 1.2rem; margin: 0 0 20px 0; text-align: center; }
        
        .rules-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; width: 100%; }
        .rule-item { display: flex; gap: 12px; align-items: flex-start; }
        .rule-num {
          background: #1CB0F6; color: white; font-weight: 900; font-size: 0.9rem;
          width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center;
          align-items: center; flex-shrink: 0; margin-top: 2px;
        }
        .rule-item p { margin: 0; color: #d4d4d8; font-size: 0.85rem; line-height: 1.4; font-weight: 600; }
        .rule-item b { color: white; font-weight: 800; }
        
        .got-it-btn {
          background: #58CC02; color: white; border: none; padding: 14px; width: 100%;
          border-radius: 16px; font-weight: 900; font-size: 1rem; cursor: pointer;
          box-shadow: 0 5px 0 #46A302; transition: transform 0.1s;
        }
        .got-it-btn:active { transform: translateY(5px); box-shadow: 0 0px 0 transparent; }

      `}</style>
    </div>
  );
}
