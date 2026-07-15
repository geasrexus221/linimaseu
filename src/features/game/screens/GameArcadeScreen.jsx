import React, { useState } from 'react';
import { Dices, Swords, Puzzle, Star, Sparkles, ChevronLeft, ChevronRight, Users, Share2, Info, PenTool } from 'lucide-react';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { useStore } from '../../../store/useStore';
import { useRegisterRightPanel } from '../../../hooks/useRegisterRightPanel';
import DesktopStatsPanel from '../../../components/layout/DesktopStatsPanel';
import JelajahIcon from '../../../assets/UI/Arena/Jelajah nusantara icon.svg';
import AduCendikiawanIcon from '../../../assets/UI/Arena/Adu Cendikiawan icon.svg';
import { motion, AnimatePresence } from 'framer-motion';
import OnlinePlayersModal from '../components/OnlinePlayersModal';
import InviteLoadingOverlay from '../components/InviteLoadingOverlay';
import JelajahHelpModal from '../jelajah-nusantara/components/hud/JelajahHelpModal';
import AduCendekiawanHelpModal from '../tarik-tambang/components/hud/AduCendekiawanHelpModal';

export default function GameArcadeScreen() {
  const { setGameSubView, setJelajahSubView } = useNavigationStore();
  const { streak: torches, useObor, isDevMode } = useStore();

  const [showOnlineModal, setShowOnlineModal] = useState(false);
  const [invitedPlayer, setInvitedPlayer] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [aduHelpOpen, setAduHelpOpen] = useState(false);

  const handleInvite = (player) => {
    setInvitedPlayer(player);
  };

  // Register Desktop Stats Panel for this screen
  useRegisterRightPanel(DesktopStatsPanel, 'game-arcade');

  const GAMES = [
    {
      id: 'jelajah',
      title: 'Jelajah Nusantara',
      desc: 'Kelilingi arena sejarah & kumpulkan kekayaan!',
      icon: <Dices size={48} color="white" />,
      illustration: JelajahIcon,
      color: 'linear-gradient(135deg, #f4c265, #FF4B4B)',
      shadow: '#C0392B',
      active: true,
      reward: '400 Bintang',
      floatingSymbols: ['🎲', '🧭', '🗺️', '🍃', '⭐']
    },
    {
      id: 'tarik-tambang',
      title: 'Adu Cendekiawan',
      desc: 'Adu pengetahuan dengan menjawab pertanyaan cepat dan tepat!',
      icon: <Swords size={48} color="white" />,
      illustration: AduCendikiawanIcon,
      color: 'linear-gradient(135deg, #1CB0F6, #0052D4)',
      shadow: '#00416A',
      active: true,
      reward: 'Sesuai Kesulitan',
      floatingSymbols: ['⚔️', '⚡', '📖', '🛡️', '🔥']
    },
    {
      id: 'layangan',
      title: 'Layangan Nusantara',
      desc: 'Terbang tinggi & jawab kuis sejarah!',
      icon: <Sparkles size={48} color="white" />,
      illustration: null,
      color: 'linear-gradient(135deg, #1CB0F6, #58CC02)',
      shadow: '#0d8ab5',
      active: true,
      reward: '20 Bintang',
      floatingSymbols: ['🪁', '☁️', '🎈', '🎐', '✨']
    }
  ];

  const [selectedGame, setSelectedGame] = useState(null);
  const [activeGameIdx, setActiveGameIdx] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    setDirection(-1);
    setActiveGameIdx((prev) => (prev === 0 ? GAMES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveGameIdx((prev) => (prev === GAMES.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95
    })
  };

  const handleSelectGame = (gameId) => {
    setSelectedGame(null);
    if (gameId === 'jelajah') {
      if (torches > 0) {
        useObor();
        setJelajahSubView('setup');
        setGameSubView('jelajah');
      } else {
        alert('Obor kamu habis! Tunggu sampai terisi kembali.');
      }
    } else if (gameId === 'tarik-tambang') {
      setGameSubView('tarik-tambang');
    } else if (gameId === 'layangan') {
      setGameSubView('layangan');
    }
  };

  return (
    <div className="game-arcade-wrapper">
      {/* Arcade Gaming Background */}
      <div className="arcade-bg">
        <div className="grid-overlay"></div>
        <div className="glow-orb purple"></div>
        <div className="glow-orb blue"></div>
      </div>

      <div className="arcade-header">
        <h1 className="arcade-title">Arena Bermain</h1>
      </div>

      <div className="game-slider-container">
        <button className="slide-arrow prev" onClick={handlePrev}>
          <ChevronLeft size={36} />
        </button>

        <div className="slider-card-wrapper">
          <div className="spotlight-glow" style={{
            background: GAMES[activeGameIdx].id === 'jelajah' 
              ? 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,255,255,0) 70%)'
              : GAMES[activeGameIdx].id === 'tarik-tambang'
                ? 'radial-gradient(circle, rgba(0,82,212,0.25) 0%, rgba(255,255,255,0) 70%)'
                : 'radial-gradient(circle, rgba(88,204,2,0.25) 0%, rgba(255,255,255,0) 70%)'
          }} />

          {GAMES[activeGameIdx].floatingSymbols?.map((sym, idx) => (
            <div key={idx} className={`floating-symbol fs-${idx}`}>
              {sym}
            </div>
          ))}

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeGameIdx}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 350, damping: 28 },
                opacity: { duration: 0.15 },
                scale: { duration: 0.15 }
              }}
              className={`arcade-card ${!GAMES[activeGameIdx].active ? 'is-locked' : ''} ${(GAMES[activeGameIdx].id === 'jelajah' || GAMES[activeGameIdx].id === 'tarik-tambang') ? 'borderless-card' : ''}`}
              onClick={() => GAMES[activeGameIdx].id !== 'jelajah' && GAMES[activeGameIdx].id !== 'tarik-tambang' && GAMES[activeGameIdx].active && setSelectedGame(GAMES[activeGameIdx])}
              style={{ '--bg-gradient': GAMES[activeGameIdx].color, '--shadow-color': GAMES[activeGameIdx].shadow }}
            >
              {(GAMES[activeGameIdx].id === 'jelajah' || GAMES[activeGameIdx].id === 'tarik-tambang') ? (
                <div className="illustration-only-container">
                  <img src={GAMES[activeGameIdx].illustration} alt={GAMES[activeGameIdx].title} className="game-illustration-large" />
                  <div className="play-bar" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGame(GAMES[activeGameIdx]);
                  }}>
                    <span>MAINKAN</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-illustration">
                    <div className="illustration-placeholder">
                      <div className="placeholder-icon">{GAMES[activeGameIdx].icon}</div>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="game-name">{GAMES[activeGameIdx].title}</h3>
                    <p className="game-tagline">{GAMES[activeGameIdx].desc}</p>

                    <div className="reward-tag">
                      <Star size={14} fill="#FFD700" color="#FFD700" />
                      <span>Hadiah: {GAMES[activeGameIdx].reward}</span>
                    </div>
                  </div>
                </>
              )}

              {(GAMES[activeGameIdx].id === 'jelajah' || GAMES[activeGameIdx].id === 'tarik-tambang') ? (
                <div className="play-badge">PREVIEW</div>
              ) : (
                <div className="huge-coming-soon-overlay">COMING SOON</div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button className="slide-arrow next" onClick={handleNext}>
          <ChevronRight size={36} />
        </button>
      </div>

      <div className="game-actions-row">
        <button className="action-circle-btn invite" onClick={() => setShowOnlineModal(true)}>
          <Users size={16} />
          <span>Ajak Teman</span>
        </button>
        <button className="action-circle-btn share" onClick={() => alert('Fitur Bagikan segera hadir!')}>
          <Share2 size={16} />
          <span>Bagikan</span>
        </button>
        <button className="action-circle-btn help" onClick={() => {
          if (GAMES[activeGameIdx].id === 'jelajah') {
            setHelpOpen(true);
          } else if (GAMES[activeGameIdx].id === 'tarik-tambang') {
            setAduHelpOpen(true);
          } else {
            alert(GAMES[activeGameIdx].desc);
          }
        }}>
          <Info size={16} />
          <span>Panduan</span>
        </button>
        {isDevMode && (
          <button className="action-circle-btn dev" onClick={() => {
            setJelajahSubView('maker');
            setGameSubView('jelajah');
          }}>
            <PenTool size={16} />
            <span>DEV Maker</span>
          </button>
        )}
      </div>

      {selectedGame && (
        <div className="preview-modal-overlay" onClick={() => setSelectedGame(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedGame(null)}>✕</button>

            <div className="preview-illustration-large">
              {selectedGame.illustration ? (
                <img src={selectedGame.illustration} alt={selectedGame.title} className="preview-illustration-img" />
              ) : (
                <div className="large-placeholder">
                  <div className="placeholder-icon-large">{selectedGame.icon}</div>
                </div>
              )}
            </div>

            <div className="preview-details">
              <div className="preview-header">
                <div className="preview-icon" style={{ background: selectedGame.color }}>
                  {selectedGame.icon}
                </div>
                <div>
                  <h2 className="preview-title">{selectedGame.title}</h2>
                  <div className="reward-tag">
                    <Star size={14} fill="#FFD700" color="#FFD700" />
                    <span>Hadiah: {selectedGame.reward}</span>
                  </div>
                </div>
              </div>

              <p className="preview-desc">{selectedGame.desc}</p>
              <p className="preview-instruction">Klik tombol di bawah ini untuk meluncurkan permainan dan memulai petualangan seru ini!</p>

              <button className="play-now-btn" onClick={() => handleSelectGame(selectedGame.id)}>
                MAINKAN SEKARANG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
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

      <AduCendekiawanHelpModal isOpen={aduHelpOpen} onClose={() => setAduHelpOpen(false)} />

      <style jsx>{`
        .game-arcade-wrapper {
          flex: 1; display: flex; flex-direction: column; padding: 25px 0 100px;
          overflow: hidden; position: relative; 
          background: var(--background-color);
        }
        
        /* Gaming Background Styles */
        .arcade-bg { display: none; }
        .grid-overlay {
          position: absolute; bottom: 0; left: -50%; width: 200%; height: 100%;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.4) 2px, transparent 2px);
          background-size: 60px 60px;
          background-position: center bottom;
          transform: perspective(600px) rotateX(60deg) translateY(50px);
          transform-origin: center bottom;
        }
        .glow-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; }
        .glow-orb.purple { top: -10%; left: -10%; width: 50%; height: 50%; background: #FF9A9E; }
        .glow-orb.blue { bottom: 20%; right: -10%; width: 50%; height: 50%; background: #8EC5FC; }

        .arcade-header { position: relative; margin-bottom: 25px; padding: 0 20px; z-index: 1; text-align: center; }
        .arcade-title { 
          font-weight: 900; font-size: 2.5rem; color: var(--text-color); margin: 0;
          letter-spacing: 2px; text-transform: uppercase;
        }
        
        @media (max-width: 600px) {
          .game-arcade-wrapper { padding: 20px 0 80px; }
          .arcade-header { margin-bottom: 20px; padding: 0 15px; }
          .arcade-title { font-size: 1.6rem; }
          .game-slider-container { gap: 10px !important; }
          .slider-card-wrapper { width: 280px !important; height: 420px !important; }
          .slide-arrow { width: 44px !important; height: 44px !important; }
          .slide-arrow :global(svg) { width: 24px !important; height: 24px !important; }
          
          .arcade-card { 
            border-radius: 30px !important; padding: 20px !important; 
            border-width: 5px !important;
            box-shadow: 0 12px 0 #2B2D42, inset 0 -6px 0 rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.2) !important;
          }
          
          .card-illustration { height: 130px !important; }
          .game-illustration-img {
            width: 170px !important;
            height: 170px !important;
          }
          .game-illustration-large {
            width: 410px !important;
            height: 410px !important;
            top: 48% !important;
          }
          .game-name { font-size: 1.4rem !important; }
          .game-tagline { font-size: 0.8rem !important; margin-bottom: 15px !important; }
          .reward-tag { font-size: 0.75rem !important; padding: 8px 12px !important; }
          .play-badge { 
            top: -12px !important; left: 50% !important; right: auto !important; 
            transform: translateX(-50%) !important; padding: 6px 15px !important; font-size: 0.75rem !important; 
          }
        }

        .game-slider-container {
          display: flex; align-items: center; justify-content: center; gap: 30px;
          padding: 0 25px 40px; position: relative; z-index: 1; width: 100%;
        }

        .slider-card-wrapper {
          width: 380px; height: 520px; position: relative; display: flex; align-items: center; justify-content: center;
        }
        .slide-arrow {
          background: white; border: 3px solid #2B2D42;
          color: #2B2D42; width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: all 0.1s ease;
          box-shadow: 0 6px 0 #2B2D42, 0 10px 20px rgba(0,0,0,0.15);
          flex-shrink: 0;
          position: relative;
          z-index: 10;
        }
        .slide-arrow:hover {
          background: #F3F4F6;
        }
        .slide-arrow:active {
          transform: translateY(4px);
          box-shadow: 0 2px 0 #2B2D42, 0 5px 10px rgba(0,0,0,0.1);
        }

        .arcade-card {
          width: 100%; height: 100%; background: var(--bg-gradient);
          border-radius: 40px; padding: 30px; display: flex; flex-direction: column;
          position: relative; 
          border: 6px solid #2B2D42;
          box-shadow: 0 15px 0 #2B2D42, inset 0 -8px 0 rgba(0,0,0,0.15), 0 20px 40px rgba(0,0,0,0.3);
          cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
        }
        .arcade-card.borderless-card {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          cursor: default;
        }
        .arcade-card.borderless-card .play-badge {
          display: none !important;
        }
        .arcade-card:active { 
          transform: translateY(10px); 
          box-shadow: 0 5px 0 #2B2D42, inset 0 -4px 0 rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.2); 
        }
        .arcade-card.borderless-card:active {
          transform: none;
        }

        /* Illustration Only Style (Jelajah) */
        .illustration-only-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          /* Reset padding since parent has it, or use absolute overlays */
        }
        @keyframes float-illustration {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-15px);
          }
        }
        .game-illustration-large {
          position: absolute;
          width: 460px;
          height: 460px;
          object-fit: contain;
          top: 48%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 15px 20px rgba(0,0,0,0.3));
          animation: float-illustration 3s ease-in-out infinite;
          z-index: 3;
        }
        .play-bar {
          background: #58CC02;
          color: white;
          padding: 15px 30px;
          border-radius: 18px;
          font-weight: 900;
          font-size: 1.1rem;
          text-align: center;
          box-shadow: 0 6px 0 #46A302;
          border: none;
          width: 75%;
          z-index: 4;
          cursor: pointer;
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          transition: all 0.1s;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.5px;
          animation: pulseButton 2s infinite;
        }
        .play-bar:active {
          transform: translateX(-50%) translateY(6px);
          box-shadow: 0 0 0 transparent;
        }
        @keyframes pulseButton {
          0% {
            box-shadow: 0 6px 0 #46A302, 0 0 0 0 rgba(88, 204, 2, 0.45);
          }
          70% {
            box-shadow: 0 6px 0 #46A302, 0 0 0 15px rgba(88, 204, 2, 0);
          }
          100% {
            box-shadow: 0 6px 0 #46A302, 0 0 0 0 rgba(88, 204, 2, 0);
          }
        }

        .spotlight-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          z-index: 0;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          mix-blend-mode: screen;
          filter: blur(20px);
          animation: spotlightPulse 4s ease-in-out infinite;
        }
        @keyframes spotlightPulse {
          0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }

        .floating-symbol {
          position: absolute;
          font-size: 2.2rem;
          z-index: 1;
          pointer-events: none;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));
          user-select: none;
        }
        .fs-0 { top: 8%; left: -35px; animation: floatSymbolY 4s ease-in-out infinite; }
        .fs-1 { top: 22%; right: -35px; animation: floatSymbolX 5s ease-in-out infinite 0.5s; }
        .fs-2 { bottom: 22%; left: -45px; animation: floatSymbolX 6s ease-in-out infinite 1s; }
        .fs-3 { bottom: 8%; right: -45px; animation: floatSymbolY 5s ease-in-out infinite 1.5s; }
        .fs-4 { top: 2%; right: 35%; animation: floatSymbolY 4.5s ease-in-out infinite 2s; }

        @keyframes floatSymbolY {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        @keyframes floatSymbolX {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(20px) rotate(-15deg); }
        }

        .game-actions-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          padding: 0 25px;
          z-index: 2;
          position: relative;
        }
        .action-circle-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          background: #1CB0F6;
          border: 2.5px solid #1CB0F6;
          border-bottom: 4.5px solid #1899D6;
          padding: 7px 12px;
          border-radius: 14px;
          cursor: pointer;
          color: white;
          font-weight: 800;
          font-size: 0.7rem;
          transition: all 0.1s ease;
          box-shadow: 0 6px 12px rgba(0,0,0,0.06);
          min-width: 75px;
        }
        .action-circle-btn:hover {
          background: #1899D6;
          border-color: #1899D6;
        }
        .action-circle-btn:active {
          transform: translateY(2px);
          border-bottom-width: 2.5px;
        }
        .action-circle-btn :global(svg) {
          color: white;
        }
        .action-circle-btn.dev :global(svg) {
          color: white;
        }
        .action-circle-btn.share :global(svg) {
          color: white;
        }
        .action-circle-btn.help :global(svg) {
          color: white;
        }

        .card-illustration {
          width: 100%; height: 220px; 
          border-radius: 20px; margin-bottom: 20px; overflow: hidden;
          position: relative; display: flex; align-items: center; justify-content: center;
          z-index: 2; flex-shrink: 0;
        }
        .card-illustration.has-illustration {
          overflow: visible;
        }
        .game-illustration-img {
          position: absolute;
          width: 260px;
          height: 260px;
          object-fit: contain;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateY(-10px);
          filter: drop-shadow(0 12px 20px rgba(0,0,0,0.3));
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 3;
        }
        .arcade-card:hover .game-illustration-img {
          transform: translate(-50%, -50%) translateY(-22px) scale(1.08);
        }
        .illustration-placeholder {
          width: 100%; height: 100%; background: rgba(0,0,0,0.2);
          display: flex; align-items: center; justify-content: center;
          border-radius: 20px; border: 4px dashed rgba(255,255,255,0.4);
        }
        .placeholder-icon {
          opacity: 0.8; transform: scale(1.5);
        }

        .card-content { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; z-index: 2;}
        .game-name { color: white; font-weight: 900; font-size: 1.8rem; margin-bottom: 5px; line-height: 1.1; text-align: left; text-shadow: 0 2px 0 rgba(0,0,0,0.2); }
        .game-tagline { color: rgba(255,255,255,0.9); font-weight: 800; font-size: 0.9rem; text-align: left; margin-bottom: 20px; }
        .reward-tag { background: #2B2D42; padding: 10px 18px; border-radius: 50px; display: flex; align-items: center; gap: 8px; color: white; font-weight: 900; font-size: 0.85rem; width: fit-content; border: 2px solid rgba(255,255,255,0.2); }
        
        .play-badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #FFD700; color: #333; padding: 8px 20px; border-radius: 50px; font-weight: 900; font-size: 0.8rem; border: 4px solid #2B2D42; box-shadow: 0 5px 0 #2B2D42; z-index: 5;}
        
        .huge-coming-soon-overlay {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-12deg);
          font-size: 2.8rem;
          font-weight: 900;
          color: white;
          text-shadow: 0 4px 0 #FF4B4B, 0 10px 20px rgba(0,0,0,0.5);
          white-space: nowrap;
          z-index: 10;
          pointer-events: none;
          letter-spacing: 2px;
          -webkit-text-stroke: 2px #FF4B4B;
          background: rgba(255, 75, 75, 0.9);
          padding: 10px 30px;
          border-radius: 15px;
          border: 4px solid white;
          box-shadow: 0 8px 0 #C0392B, 0 15px 30px rgba(0,0,0,0.3);
        }
        
        .is-locked { filter: grayscale(0.8) brightness(0.8); cursor: default; }
        .lock-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); z-index: 10; border-radius: 34px; }
        .lock-text { color: white; font-weight: 900; font-size: 1.5rem; transform: rotate(-10deg); text-shadow: 0 4px 0 #2B2D42; }

        /* MODAL STYLES */
        .preview-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
          z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .preview-modal {
          width: 100%; max-width: 700px; background: var(--background-color);
          border-radius: 30px; border: 4px solid var(--border-color);
          overflow: hidden; display: flex; flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

        .active-friends-section {
          padding: 0 25px; margin-top: 10px; position: relative; z-index: 1;
        }
        .section-title {
          font-weight: 900; font-size: 1.4rem; color: #fff; margin-bottom: 15px;
          text-shadow: 0 2px 5px rgba(0,0,0,0.5);
        }
        .friends-list {
          display: flex; gap: 15px; overflow-x: auto; scrollbar-width: none; padding-bottom: 10px;
        }
        .friends-list::-webkit-scrollbar { display: none; }
        
        .friend-card {
          background: white; border-radius: 20px; padding: 15px; display: flex; align-items: center; gap: 15px;
          border: 3px solid #E5E7EB; box-shadow: 0 4px 0 #E5E7EB; flex: 0 0 auto; min-width: 250px;
          position: relative; transition: transform 0.2s; cursor: pointer;
        }
        .friend-card:hover { transform: translateY(-3px); }
        .friend-avatar {
          width: 50px; height: 50px; background: #f0f0f0; border-radius: 50%; border: 3px solid #FFD700;
        }
        .friend-info { flex: 1; }
        .friend-info h4 { margin: 0; font-weight: 800; color: #333; font-size: 1rem; }
        .friend-info p { margin: 2px 0 0; font-weight: 700; color: #888; font-size: 0.8rem; }
        
        .status-dot {
          width: 12px; height: 12px; background: #58CC02; border-radius: 50%;
          position: absolute; top: 15px; right: 15px;
        }
        .status-dot.orange { background: #f4c265; }
        .pulsing { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(88, 204, 2, 0); } 100% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0); } }
        .orange.pulsing { animation: pulseOrange 2s infinite; }
        @keyframes pulseOrange { 0% { box-shadow: 0 0 0 0 rgba(255, 150, 0, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(255, 150, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 150, 0, 0); } }

        .close-modal-btn {
          position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.5);
          color: white; border: none; width: 40px; height: 40px; border-radius: 50%;
          font-size: 1.2rem; font-weight: 900; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center;
        }
        .close-modal-btn:hover { background: rgba(0,0,0,0.7); transform: scale(1.1); }

        .preview-illustration-large {
          width: 100%; height: 280px; position: relative;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.1); border-bottom: 2px solid var(--border-color);
        }
        .preview-illustration-img {
          width: 100%; height: 100%; object-fit: contain; padding: 20px;
        }
        .large-placeholder {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 20px, transparent 20px, transparent 40px);
        }
        .placeholder-icon-large {
          opacity: 0.5; transform: scale(2);
        }

        .preview-details { padding: 30px; display: flex; flex-direction: column; gap: 20px; }
        .preview-header { display: flex; align-items: center; gap: 20px; }
        .preview-icon {
          width: 80px; height: 80px; border-radius: 25px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .preview-title { font-weight: 900; font-size: 2rem; color: var(--text-color); margin: 0 0 10px 0; line-height: 1.1; }
        
        .preview-desc { font-size: 1.1rem; color: var(--text-muted); font-weight: 600; margin: 0; line-height: 1.5; }
        .preview-instruction { font-size: 0.9rem; color: var(--text-muted); opacity: 0.8; margin: 0; font-style: italic; }

        .play-now-btn {
          margin-top: 10px; width: 100%; padding: 20px; border-radius: 20px; border: none;
          background: var(--primary-color); color: white; font-weight: 900; font-size: 1.3rem;
          cursor: pointer; box-shadow: 0 8px 0 #1899D6; transition: all 0.1s;
        }
        .play-now-btn:active { transform: translateY(8px); box-shadow: 0 0 0 transparent; }

        @media (max-width: 600px) {
          .preview-illustration-large { height: 200px; }
          .preview-details { padding: 20px; gap: 15px; }
          .preview-title { font-size: 1.5rem; }
          .preview-icon { width: 60px; height: 60px; border-radius: 15px; }
          .preview-icon svg { width: 32px; height: 32px; }
          .play-now-btn { padding: 15px; font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
}
