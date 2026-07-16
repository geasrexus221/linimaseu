import React, { useState } from 'react';
import { ChevronLeft, Play, Users, Info, Flame, Share2, Star, PenTool } from 'lucide-react';
import { useStore } from '../../../../store/useStore';
import { useNavigationStore } from '../../../../store/useNavigationStore';
import JelajahHelpModal from '../components/hud/JelajahHelpModal';
import { useRegisterRightPanel } from '../../../../hooks/useRegisterRightPanel';
import GameOnlinePlayersPanel from '../../../../components/layout/GameOnlinePlayersPanel';
import OnlinePlayersModal from '../../components/OnlinePlayersModal';
import InviteLoadingOverlay from '../../components/InviteLoadingOverlay';

export default function IntroScreen() {
  const { streak: torches, useObor, theme, isDevMode } = useStore();
  const isDark = theme === 'dark';
  const { setGameSubView, setJelajahSubView } = useNavigationStore();
  
  
  useRegisterRightPanel(GameOnlinePlayersPanel, 'jelajah-intro');
  
  const [showOnlineModal, setShowOnlineModal] = useState(false);
  const [invitedPlayer, setInvitedPlayer] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleStart = () => {
    if (torches > 0) {
      useObor();
      setJelajahSubView('setup');
    } else {
      
      alert('Obor kamu habis! Tunggu sampai terisi kembali.');
    }
  };

  const handleInvite = (player) => {
    setInvitedPlayer(player);
    
  };

  return (
    <div className="game-intro-container">
      
      <div className="bg-map-pattern" />
      <div className="floating-clouds">
        <div className="cloud c1">☁️</div>
        <div className="cloud c2">☁️</div>
        <div className="cloud c3">☁️</div>
      </div>

      
      <header className="intro-header">
        <button className="back-btn-3d" onClick={() => setGameSubView('arcade')}>
          <ChevronLeft size={24} />
        </button>
        
        <div className="torch-stats-badge">
          <div className="torch-glow-icon">
            <Flame size={20} fill="#FFD700" color="#FF4B4B" />
          </div>
          <span className="count">{torches}</span>
          <span className="label">OBOR</span>
        </div>
      </header>

      <div className="intro-main-scrollable">
        
        <div className="title-section-pop">
          <div className="game-category-tag">PETUALANGAN SERU</div>
          <h1 className="game-main-title">
            Jelajah <br />
            <span className="accent">Nusantara</span>
          </h1>
          <div className="title-underline" />
        </div>

        
        <div className="adventure-hero-box">
          <div className="hero-island-platform">
            <div className="island-emoji">🏝️</div>
            <div className="island-shadow" />
            <div className="character-avatar-float">🤠</div>
            <div className="sparkles-fx">
              <Star className="s-fx f1" size={16} fill="#FFD700" color="#FFD700" />
              <Star className="s-fx f2" size={20} fill="#FFD700" color="#FFD700" />
            </div>
          </div>
          
          
          <div className="game-description-box">
            <p>
              "Jelajahi pulau-pulau legendaris Nusantara, pecahkan misteri sejarah, 
              dan kumpulkan artefak kuno yang hilang untuk menjadi Penjelajah Terhebat!"
            </p>
          </div>
        </div>

        
        <div className="primary-actions-stack">
          <button className="giant-play-btn" onClick={handleStart}>
            <div className="play-btn-face">
              <Play size={28} fill="currentColor" />
              <span>MULAI PETUALANGAN</span>
            </div>
            <div className="play-btn-shadow" />
            <div className="price-tag-float">
              <Flame size={12} fill="white" color="white" />
              <span>1</span>
            </div>
          </button>

          <div className="secondary-grid">
            <button className="square-action-btn invite" onClick={() => setShowOnlineModal(true)}>
              <div className="btn-face"><Users size={24} /></div>
              <div className="btn-shadow" />
              <span className="btn-label">Ajak Teman</span>
            </button>

            <button className="square-action-btn share">
              <div className="btn-face"><Share2 size={24} /></div>
              <div className="btn-shadow" />
              <span className="btn-label">Bagikan</span>
            </button>

            <button className="square-action-btn info" onClick={() => setHelpOpen(true)}>
              <div className="btn-face"><Info size={24} /></div>
              <div className="btn-shadow" />
              <span className="btn-label">Panduan</span>
            </button>

            {isDevMode && (
              <button className="square-action-btn dev" onClick={() => setJelajahSubView('maker')}>
                <div className="btn-face"><PenTool size={24} /></div>
                <div className="btn-shadow" />
                <span className="btn-label">DEV Maker</span>
              </button>
            )}
          </div>
        </div>
      </div>

      
      {showOnlineModal && (
        <OnlinePlayersModal 
          onClose={() => setShowOnlineModal(false)} 
          onInvite={handleInvite}
        />
      )}

      {invitedPlayer && (
        <InviteLoadingOverlay 
          invitedPlayer={invitedPlayer} 
          onCancel={() => setInvitedPlayer(null)} 
        />
      )}

      <JelajahHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      <style jsx>{`
        .game-intro-container {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, #F3E5AB 0%, #E2C999 50%, #C8A261 100%);
          display: flex; flex-direction: column;
          font-family: 'Outfit', sans-serif;
          z-index: 10; overflow: hidden;
          box-shadow: inset 0 0 80px rgba(106,62,22,0.25);
        }

        .bg-map-pattern {
          position: absolute; inset: 0;
          opacity: 0.18;
          background-image:
            linear-gradient(45deg, #8B4513 1px, transparent 1px),
            linear-gradient(-45deg, #8B4513 1px, transparent 1px);
          background-size: 28px 28px;
          z-index: 0;
        }

        .floating-clouds { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .cloud { position: absolute; font-size: 2.5rem; opacity: 0.4; }
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
          background: #FFFDF5; border: 2px dashed #8B4513;
          box-shadow: 0 3px 0 #6A3E16;
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #4A2E1B; cursor: pointer;
        }
        .back-btn-3d:active { transform: translateY(2px); box-shadow: 0 1px 0 #6A3E16; }

        .torch-stats-badge {
          background: linear-gradient(135deg, #D4A373, #A26E40); border-radius: 50px;
          display: flex; align-items: center; padding: 4px 12px; gap: 6px;
          box-shadow: 0 3px 0 #6A3E16; border: 2px solid rgba(234,179,8,0.5);
        }
        .torch-glow-icon { filter: drop-shadow(0 0 5px rgba(234,179,8,0.7)); }
        .torch-stats-badge .count { color: #FFFDF5; font-weight: 900; font-size: 0.95rem; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        .torch-stats-badge .label { color: rgba(255,253,245,0.85); font-weight: 800; font-size: 0.55rem; }

        .intro-main-scrollable {
          flex: 1; overflow-y: auto; display: flex; flex-direction: column;
          align-items: center; padding: 0 20px 100px; z-index: 5;
          scrollbar-width: none;
        }
        .intro-main-scrollable::-webkit-scrollbar { display: none; }

        .title-section-pop { text-align: center; margin-top: 5px; margin-bottom: 20px; }
        .game-category-tag {
          display: inline-block; background: linear-gradient(135deg, #D4A373, #A26E40); color: #FFFDF5;
          padding: 3px 10px; border-radius: 50px; font-weight: 900;
          font-size: 0.6rem; letter-spacing: 1px; margin-bottom: 6px;
          border: 1px solid #EAB308; box-shadow: 0 2px 0 #6A3E16;
          text-shadow: 0 1px 1px rgba(0,0,0,0.3);
        }
        .game-main-title {
          font-weight: 900; font-size: 2rem; color: #4A2E1B;
          line-height: 0.9; margin: 0;
          text-shadow: 1px 1px 0 rgba(255,255,255,0.4);
        }
        .game-main-title .accent { color: #8B4513; }
        .title-underline {
          width: 50px; height: 5px; background: #EAB308;
          margin: 8px auto 0; border-radius: 10px;
          box-shadow: 0 2px 0 #6A3E16;
        }

        .adventure-hero-box {
          width: 100%; display: flex; flex-direction: column; align-items: center;
          margin-bottom: 25px;
        }
        .hero-island-platform {
          position: relative; width: 110px; height: 60px;
          display: flex; justify-content: center; align-items: center;
        }
        .island-emoji { font-size: 4rem; z-index: 2; position: relative; }
        .island-shadow {
          position: absolute; bottom: 0; width: 80px; height: 15px;
          background: rgba(0,0,0,0.1); filter: blur(5px); border-radius: 50%;
        }
        .character-avatar-float {
          position: absolute; top: -15px; right: -15px; font-size: 2.5rem;
          z-index: 3; animation: bounceHero 3s infinite ease-in-out;
        }
        @keyframes bounceHero { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .sparkles-fx { position: absolute; inset: -20px; pointer-events: none; }
        .s-fx { position: absolute; animation: twinkle 2s infinite; }
        .f1 { top: 0; left: 10%; }
        .f2 { bottom: 20%; right: 10%; animation-delay: 0.5s; }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }

        .game-description-box {
          margin-top: 15px;
          background: linear-gradient(135deg, #FFFDF5, #FEF3C7);
          padding: 12px 15px; border-radius: 16px; border: 2.5px dashed #8B4513;
          max-width: 280px; text-align: center; position: relative;
          box-shadow: 0 4px 0 #6A3E16, inset 0 0 15px rgba(139,69,19,0.08);
        }
        .game-description-box::after {
          content: ''; position: absolute; top: -12px; right: 30px;
          border-left: 12px solid transparent; border-right: 12px solid transparent;
          border-bottom: 12px solid #8B4513;
        }
        .game-description-box p {
          margin: 0; color: #4A2E1B; font-weight: 800;
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
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #D4A373, #A26E40);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          color: #FFFDF5; z-index: 2; font-weight: 900; font-size: 1rem;
          border: 2px solid #EAB308; transition: transform 0.1s;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .play-btn-shadow {
          position: absolute; inset: 0; bottom: -6px; background: #6A3E16;
          border-radius: 20px; z-index: 1;
        }
        .giant-play-btn:active .play-btn-face { transform: translateY(3px); }
        .giant-play-btn:active .play-btn-shadow { bottom: -3px; }

        .price-tag-float {
          position: absolute; top: -10px; right: 10px; background: #FF4B4B;
          color: white; padding: 3px 8px; border-radius: 50px; z-index: 5;
          display: flex; align-items: center; gap: 3px; font-weight: 900;
          font-size: 0.7rem; box-shadow: 0 3px 0 #D33;
        }

        .secondary-grid { display: flex; justify-content: space-between; gap: 12px; }
        .square-action-btn {
          position: relative; flex: 1; height: 55px; background: none; border: none;
          cursor: pointer; display: flex; flex-direction: column; align-items: center;
        }
        @media (min-width: 1024px) {
          .square-action-btn.invite { display: none; }
        }
        .btn-face {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #FFFDF5, #FEF3C7);
          border: 2px dashed #8B4513; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: #6A3E16; z-index: 2; transition: transform 0.1s;
        }
        .btn-shadow {
          position: absolute; inset: 0; bottom: -5px; background: #6A3E16;
          border-radius: 16px; z-index: 1;
        }
        .square-action-btn:active .btn-face { transform: translateY(2px); }
        .square-action-btn:active .btn-shadow { bottom: -2px; }
        .btn-label {
          position: absolute; bottom: -20px; font-size: 0.6rem;
          font-weight: 900; color: #8B4513; white-space: nowrap;
        }

        .square-action-btn.share .btn-face { color: #8B4513; }
        .square-action-btn.info .btn-face { color: #8B4513; }
        .square-action-btn.dev .btn-face { color: #8B5CF6; background: rgba(139, 92, 246, 0.1); }
      `}</style>
    </div>
  );
}
