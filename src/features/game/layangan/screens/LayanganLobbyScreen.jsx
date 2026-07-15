import React, { useState } from 'react';
import { ChevronLeft, Play, Info, Share2, Star, Wind, X, BookOpen, Layers } from 'lucide-react';
import { useNavigationStore } from '../../../../store/useNavigationStore';
import { availableSubjects, availableClasses, quizBanks } from '../../jelajah-nusantara/data/questions';

export default function LayanganLobbyScreen({ onStart }) {
  const { setGameSubView } = useNavigationStore();
  const [showHelp, setShowHelp] = useState(false);
  const [selectedMode, setSelectedMode] = useState('solo'); // 'solo', 'vs_bot'
  const [selectedSubject, setSelectedSubject] = useState('ipas'); 
  const [selectedClass, setSelectedClass] = useState('kelas_4_5'); 

  // Compute final theme ID (e.g. 'ipas_kelas_4_5' or 'sejarah_umum')
  // We match it against the existing quizBanks keys
  let computedThemeId = `${selectedSubject}_${selectedClass}`;
  if (!quizBanks[computedThemeId]) {
    // Fallback logic if the specific combination doesn't exist
    computedThemeId = selectedSubject === 'sejarah' ? 'sejarah_umum' : 'ipas_4_5';
  }

  return (
    <div className="layangan-intro-container">
      {/* Sky Background */}
      <div className="sky-gradient" />
      <div className="floating-clouds">
        <div className="cloud c1">☁️</div>
        <div className="cloud c2">☁️</div>
        <div className="cloud c3">☁️</div>
        <div className="cloud c4">☁️</div>
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
          <span className="count">0</span>
          <span className="label">SKOR TERTINGGI</span>
        </div>
      </header>

      <div className="intro-main-scrollable">
        {/* Title Section */}
        <div className="title-section-pop">
          <div className="game-category-tag">KETANGKASAN & FOKUS</div>
          <h1 className="game-main-title">
            Layangan <br />
            <span className="accent">Nusantara</span>
          </h1>
          <div className="title-underline" />
        </div>

        {/* Hero Visual Section */}
        <div className="adventure-hero-box">
          <div className="hero-sky-platform">
            <div className="kite-container">
              <span className="kite-emoji">🪁</span>
              <div className="kite-tail">〰️〰️</div>
            </div>
            <div className="sparkles-fx">
              <Wind className="s-fx f1" size={24} color="#FFF" />
              <Wind className="s-fx f2" size={20} color="#FFF" />
            </div>
          </div>
          
          {/* Game Description */}
          <div className="game-description-box">
            <p>
              "Terbang setinggi mungkin melewati rintangan! Jawab kuis di setiap pos untuk mendapatkan hembusan angin ekstra!"
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="primary-actions-stack">
          
          <div className="mode-selector-box">
            <div className="mode-title">PILIH MODE BERMAIN</div>
            <div className="mode-options">
              <button className={`mode-pill ${selectedMode === 'solo' ? 'active' : ''}`} onClick={() => setSelectedMode('solo')}>
                Sendiri
              </button>
              <button className={`mode-pill ${selectedMode === 'vs_bot' ? 'active' : ''}`} onClick={() => setSelectedMode('vs_bot')}>
                Lawan Bot
              </button>
            </div>
          </div>

          <div className="mode-selector-box" style={{ marginTop: '0', display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <div className="mode-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.65rem' }}>
                <BookOpen size={14} /> MATA PELAJARAN
              </div>
              <select 
                className="custom-select-3d" 
                value={selectedSubject} 
                onChange={e => setSelectedSubject(e.target.value)}
              >
                {availableSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div className="mode-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.65rem' }}>
                <Layers size={14} /> FILTER KELAS
              </div>
              <select 
                className="custom-select-3d" 
                value={selectedClass} 
                onChange={e => setSelectedClass(e.target.value)}
              >
                {availableClasses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="giant-play-btn" onClick={() => onStart({ mode: selectedMode, quizThemeId: computedThemeId })}>
            <div className="play-btn-face">
              <Play size={28} fill="currentColor" />
              <span>MULAI TERBANG</span>
            </div>
            <div className="play-btn-shadow" />
          </button>

          <div className="secondary-grid">
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
            <div className="modal-icon"><Info size={40} color="#1CB0F6" /></div>
            <h2>Cara Bermain Layangan</h2>
            <div className="rules-list">
              <div className="rule-item">
                <span className="rule-num">1</span>
                <p>Ketuk layar secara berirama untuk menerbangkan layang-layang ke atas dan melewati rintangan pipa bambu.</p>
              </div>
              <div className="rule-item">
                <span className="rule-num">2</span>
                <p>Kamu dibekali <b>3 Nyawa (Hati)</b>. Jika tertabrak, kamu akan berteleportasi ke tengah dan menjadi <b>Kebal</b> selama 2 detik!</p>
              </div>
              <div className="rule-item">
                <span className="rule-num">3</span>
                <p>Setiap melewati 4 pipa, soal kuis akan melayang turun, dan pipa ke-5 akan berupa <b>Pipa Cabang (Atas & Bawah)</b>.</p>
              </div>
              <div className="rule-item">
                <span className="rule-num">4</span>
                <p>Bermanuverlah masuk ke jalan dengan pilihan jawaban yang <b>Benar</b> untuk dapat terus terbang.</p>
              </div>
              <div className="rule-item">
                <span className="rule-num">5</span>
                <p>Hati-hati! Masuk ke jawaban yang <b>Salah</b> akan memunculkan <b>Tembok Kematian</b> yang akan merenggut nyawamu!</p>
              </div>
            </div>
            <button className="got-it-btn" onClick={() => setShowHelp(false)}>SAYA MENGERTI</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .layangan-intro-container {
          position: absolute; inset: 0;
          background: #87CEEB; /* Light Sky Blue */
          display: flex; flex-direction: column;
          font-family: 'Outfit', sans-serif;
          z-index: 10; overflow: hidden;
        }

        .sky-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, #1CB0F6 0%, #87CEEB 100%);
          z-index: 0;
        }

        .floating-clouds { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .cloud { position: absolute; font-size: 3rem; opacity: 0.8; }
        .c1 { top: 10%; left: -10%; animation: drift 15s linear infinite; }
        .c2 { top: 30%; right: -10%; animation: drift 20s linear infinite reverse; font-size: 2rem; }
        .c3 { top: 50%; left: -20%; animation: drift 25s linear infinite; }
        .c4 { bottom: 20%; right: -10%; animation: drift 18s linear infinite reverse; font-size: 4rem; opacity: 0.5; }

        @keyframes drift {
          0% { transform: translateX(0); }
          50% { transform: translateX(100vw); }
          100% { transform: translateX(0); }
        }

        .intro-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 20px; z-index: 10;
        }

        .back-btn-3d {
          background: #FFFFFF; border: 2px solid #E5E5E5;
          box-shadow: 0 3px 0 #D4D4D8; color: #1CB0F6;
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.1s;
        }
        .back-btn-3d:active { transform: translateY(2px); box-shadow: 0 1px 0 #D4D4D8; }

        .torch-stats-badge {
          background: #FFF; border-radius: 50px;
          display: flex; align-items: center; padding: 4px 12px; gap: 6px;
          box-shadow: 0 3px 0 #E5E5E5; border: 2px solid #E5E5E5;
        }
        .torch-glow-icon { filter: drop-shadow(0 0 5px rgba(255,150,0,0.5)); }
        .torch-stats-badge .count { color: #4B4B4B; font-weight: 900; font-size: 0.95rem; }
        .torch-stats-badge .label { color: #A1A1AA; font-weight: 800; font-size: 0.55rem; }

        .intro-main-scrollable {
          flex: 1; overflow-y: auto; display: flex; flex-direction: column;
          align-items: center; padding: 0 20px 100px; z-index: 5;
          scrollbar-width: none;
        }
        .intro-main-scrollable::-webkit-scrollbar { display: none; }

        .title-section-pop { text-align: center; margin-top: 10px; margin-bottom: 20px; }
        .game-category-tag {
          display: inline-block; background: #FFD700; color: #D97706;
          padding: 3px 10px; border-radius: 50px; font-weight: 900;
          font-size: 0.6rem; letter-spacing: 1px; margin-bottom: 6px;
        }
        .game-main-title {
          font-weight: 900; font-size: 2.2rem; color: white;
          line-height: 0.9; margin: 0; text-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .game-main-title .accent { color: #f4c265; text-shadow: 0 4px 0 #D97706; }
        .title-underline {
          width: 50px; height: 5px; background: #FFF;
          margin: 12px auto 0; border-radius: 10px;
        }

        .adventure-hero-box {
          width: 100%; display: flex; flex-direction: column; align-items: center;
          margin-bottom: 25px;
        }
        .hero-sky-platform {
          position: relative; height: 120px; width: 160px;
          display: flex; justify-content: center; align-items: center;
        }
        .kite-container {
          display: flex; flex-direction: column; align-items: center;
          z-index: 3; animation: bounceHero 2.5s infinite ease-in-out;
        }
        .kite-emoji { font-size: 4rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); transform: rotate(15deg); }
        .kite-tail { font-size: 1.5rem; transform: rotate(100deg); margin-top: -10px; margin-left: -30px; color: #FF4B4B; }
        
        @keyframes bounceHero { 
          0%, 100% { transform: translateY(0) rotate(0deg); } 
          50% { transform: translateY(-15px) rotate(5deg); } 
        }

        .sparkles-fx { position: absolute; inset: -10px; pointer-events: none; }
        .s-fx { position: absolute; animation: dash 2s infinite; opacity: 0.6; }
        .f1 { top: 10%; right: 10%; }
        .f2 { bottom: 20%; left: 0; animation-delay: 0.5s; }
        @keyframes dash { 0% { transform: translateX(20px); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateX(-20px); opacity: 0; } }

        .game-description-box {
          margin-top: 15px; background: rgba(255,255,255,0.9);
          padding: 15px; border-radius: 20px; border: 3px solid #FFF;
          max-width: 280px; text-align: center; position: relative;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .game-description-box::after {
          content: ''; position: absolute; top: -12px; right: 40px;
          border-left: 12px solid transparent; border-right: 12px solid transparent;
          border-bottom: 12px solid #FFF;
        }
        .game-description-box p {
          margin: 0; color: #4B4B4B; font-weight: 800;
          font-size: 0.9rem; line-height: 1.4;
        }

        .primary-actions-stack {
          width: 100%; max-width: 320px; display: flex; flex-direction: column;
          gap: 15px; margin-bottom: 25px;
        }

        .giant-play-btn {
          width: 100%; height: 75px; position: relative; background: none; border: none; cursor: pointer;
          margin-bottom: 10px;
        }

        .custom-select-3d {
          width: 100%;
          padding: 12px;
          background: #F7F9FC;
          border: 3px solid #E5E5E5;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          color: #4B4B4B;
          font-size: 0.9rem;
          appearance: none;
          outline: none;
          cursor: pointer;
          box-shadow: 0 4px 0 #E5E5E5;
          transition: all 0.2s;
        }
        .custom-select-3d:active {
          transform: translateY(4px);
          box-shadow: 0 0 0 #E5E5E5;
        }

        .play-btn-face {
          position: absolute; inset: 0; background: #58CC02; border-radius: 20px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          color: white; z-index: 2; font-weight: 900; font-size: 1.1rem;
          border: 2px solid rgba(255,255,255,0.3); transition: transform 0.1s;
        }
        .play-btn-shadow {
          position: absolute; inset: 0; bottom: -6px; background: #46A302;
          border-radius: 20px; z-index: 1;
        }
        .giant-play-btn:active .play-btn-face { transform: translateY(4px); }
        .giant-play-btn:active .play-btn-shadow { bottom: -2px; }

        .mode-selector-box {
          background: rgba(255,255,255,0.9); padding: 15px; border-radius: 20px;
          border: 3px solid #FFF; margin-bottom: 10px; display: flex; flex-direction: column; gap: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .mode-title { text-align: center; font-weight: 900; font-size: 0.7rem; color: #A1A1AA; }
        .mode-options { display: flex; gap: 10px; }
        .mode-pill {
          flex: 1; padding: 10px; border-radius: 12px; border: 2px solid #E5E5E5;
          background: #F4F4F5; color: #A1A1AA; font-weight: 800; cursor: pointer; transition: all 0.2s;
        }
        .mode-pill.active { background: #1CB0F6; color: white; border-color: #1CB0F6; box-shadow: 0 3px 0 #0284C7; transform: translateY(-2px); }

        .secondary-grid { display: flex; justify-content: space-between; gap: 12px; }
        .square-action-btn {
          position: relative; flex: 1; height: 55px; background: none; border: none;
          cursor: pointer; display: flex; flex-direction: column; align-items: center;
        }
        .btn-face {
          position: absolute; inset: 0; background: #FFF;
          border: 2px solid #E5E5E5; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: #1CB0F6; z-index: 2; transition: transform 0.1s;
        }
        .btn-shadow {
          position: absolute; inset: 0; bottom: -5px; background: #D4D4D8;
          border-radius: 16px; z-index: 1;
        }
        .square-action-btn:active .btn-face { transform: translateY(2px); }
        .square-action-btn:active .btn-shadow { bottom: -3px; }
        .btn-label {
          position: absolute; bottom: -20px; font-size: 0.65rem;
          font-weight: 900; color: #FFF; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .square-action-btn.share .btn-face { color: #f4c265; }
        .square-action-btn.info .btn-face { color: #1CB0F6; }

        /* Modal Styles */
        .modal-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
          display: flex; justify-content: center; align-items: center; z-index: 100;
        }
        .modal-card {
          background: #FFFFFF; width: 90%; max-width: 320px; border-radius: 24px;
          padding: 25px 20px; border: 4px solid #E5E5E5; position: relative;
          display: flex; flex-direction: column; align-items: center;
          animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .close-btn {
          position: absolute; top: 15px; right: 15px; background: #F4F4F5; color: #A1A1AA;
          border: none; width: 30px; height: 30px; border-radius: 50%; display: flex;
          justify-content: center; align-items: center; cursor: pointer; transition: background 0.2s;
        }
        .close-btn:hover { background: #E4E4E7; color: #4B4B4B; }
        .modal-icon { margin-bottom: 5px; }
        .modal-card h2 { color: #4B4B4B; font-weight: 900; font-size: 1.2rem; margin: 0 0 20px 0; text-align: center; }
        
        .rules-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; width: 100%; }
        .rule-item { display: flex; gap: 12px; align-items: flex-start; }
        .rule-num {
          background: #1CB0F6; color: white; font-weight: 900; font-size: 0.9rem;
          width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center;
          align-items: center; flex-shrink: 0; margin-top: 2px;
        }
        .rule-item p { margin: 0; color: #71717A; font-size: 0.85rem; line-height: 1.4; font-weight: 600; }
        .rule-item b { color: #4B4B4B; font-weight: 800; }
        
        .got-it-btn {
          background: #1CB0F6; color: white; border: none; padding: 14px; width: 100%;
          border-radius: 16px; font-weight: 900; font-size: 1rem; cursor: pointer;
          box-shadow: 0 5px 0 #0284C7; transition: transform 0.1s;
        }
        .got-it-btn:active { transform: translateY(5px); box-shadow: 0 0px 0 transparent; }

      `}</style>
    </div>
  );
}
