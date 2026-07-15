import React, { useEffect, useState, useRef } from 'react';
import { Home, Settings, MessageSquare, Maximize, Dices, MapPin, HelpCircle } from 'lucide-react';
import { useNavigationStore } from '../../../../store/useNavigationStore';
import { useGameStore } from '../../../../store/useGameStore';
import { useRegisterRightPanel } from '../../../../hooks/useRegisterRightPanel';
import JelajahGameplayPanel from '../../../../components/layout/JelajahGameplayPanel';
import { mapManager } from '../utils/mapManager';
import { GAME_CONFIG } from '../data/gameConfig';
import World3D from '../components/3d/World3D';
import LandscapeWrapper from '../components/LandscapeWrapper';
import Dice3D from '../../../../components/common/Dice3D';
import EventModal from '../components/EventModal';
import { keyboardManager } from '../../../../utils/KeyboardManager';
import { soundEngine } from '../logic/soundEngine';
import { useStore } from '../../../../store/useStore';

// Modular HUD Components
import OpponentList from '../components/hud/OpponentList';
import ActionTray from '../components/hud/ActionTray';
import GameLogPill from '../components/hud/GameLogPill';
import VictoryModal from '../components/VictoryModal';
import GameSettingsModal from '../components/hud/GameSettingsModal';
import RecoveryOverlay from '../components/hud/RecoveryOverlay';
import InventoryDetailList from '../components/hud/InventoryDetailList';
import CardBurningOverlay from '../components/hud/CardBurningOverlay';
import JelajahHelpModal from '../components/hud/JelajahHelpModal';

export default function PlayScreen({ isTestMode }) {
  const setJelajahSubView = useNavigationStore(state => state.setJelajahSubView);

  // Audio State & Sync
  const musicVolume = useStore(state => state.musicVolume);
  const sfxVolume = useStore(state => state.sfxVolume);
  const soundEnabled = useStore(state => state.soundEnabled);
  const isDevMode = useStore(state => state.isDevMode);

  useEffect(() => {
    soundEngine.init();
    soundEngine.playMusic();
    return () => soundEngine.stopMusic();
  }, []);

  useEffect(() => {
    soundEngine.syncSettings();
  }, [musicVolume, sfxVolume, soundEnabled]);

  // PERFORMANCE: Use selective picking to prevent unnecessary re-renders
  const mapData = useGameStore(state => state.mapData);
  const players = useGameStore(state => state.players);
  const turnIdx = useGameStore(state => state.turnIdx);
  const phase = useGameStore(state => state.phase);
  const diceValue = useGameStore(state => state.diceValue);
  const gameLogs = useGameStore(state => state.gameLogs);
  const isChoosingPath = useGameStore(state => state.isChoosingPath);
  const isTeleportMode = useGameStore(state => state.isTeleportMode);
  const setTeleportMode = useGameStore(state => state.setTeleportMode);
  const isInventoryOpen = useGameStore(state => state.isInventoryOpen);
  const setInventoryOpen = useGameStore(state => state.setInventoryOpen);
  const initGame = useGameStore(state => state.initGame);
  const rollDice = useGameStore(state => state.rollDice);
  const cheatDice = useGameStore(state => state.cheatDice);
  const startMoving = useGameStore(state => state.startMoving);
  const useCard = useGameStore(state => state.useCard);
  const resetGame = useGameStore(state => state.resetGame);
  const activeUsedCard = useGameStore(state => state.activeUsedCard);
  const winner = useGameStore(state => state.winner);
  const isLowGraphics = useGameStore(state => state.isLowGraphics);
  const pijarFlyTrigger = useGameStore(state => state.pijarFlyTrigger);
  const tekadFlyTrigger = useGameStore(state => state.tekadFlyTrigger);
  const pijarLoseTrigger = useGameStore(state => state.pijarLoseTrigger);
  const tekadLoseTrigger = useGameStore(state => state.tekadLoseTrigger);

  const currentPlayer = players[turnIdx];
  const isLocalHuman = currentPlayer?.type === 'human' || currentPlayer?.type === 'local';
  const isTester = currentPlayer?.name === 'Tester';

  useEffect(() => {
    if (activeUsedCard) {
      console.log("[DEBUG] PlayScreen: activeUsedCard detected!", activeUsedCard.name);
    }
  }, [activeUsedCard]);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const containerRef = useRef(null);
  const [viewSize, setViewSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [cameraZoom, setCameraZoom] = useState(0.6);
  const [cameraPan, setCameraPan] = useState({ x: 0, y: 0 });
  const [showVictory, setShowVictory] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  // Flying Particles Animation State & Logic
  const [flyingParticles, setFlyingParticles] = useState([]);
  const [pijarBounce, setPijarBounce] = useState(false);
  const [tekadBounce, setTekadBounce] = useState(false);

  const spawnParticles = (type) => {
    const isLose = type.endsWith('-lose');
    const baseType = isLose ? type.replace('-lose', '') : type;
    const emoji = baseType === 'pijar' ? '🪙' : '❤️';

    // Get active player pawn screen coordinates
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    const pawnEl = document.getElementById(`pawn-${currentPlayer?.id}`);
    const containerEl = containerRef.current;
    if (pawnEl && containerEl) {
      const pawnRect = pawnEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      startX = pawnRect.left - containerRect.left + pawnRect.width / 2;
      startY = pawnRect.top - containerRect.top + pawnRect.height / 2;
    }

    if (isLose) {
      const count = baseType === 'pijar' ? 6 : 8;
      const newParticles = Array.from({ length: count }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 25 + Math.random() * 35;

        const peakX = Math.cos(angle) * speed;
        const peakY = -50 - Math.random() * 40; // Fountain peak (upwards)

        const fallX = peakX * 1.4 + (Math.random() - 0.5) * 20;
        const fallY = 100 + Math.random() * 50; // Fall (downwards)

        return {
          id: `${type}-${Date.now()}-${i}-${Math.random()}`,
          emoji,
          type, // e.g. 'pijar-lose'
          startX,
          startY,
          peakX,
          peakY,
          fallX,
          fallY,
          rotMid: `${(Math.random() - 0.5) * 60}deg`,
          rotPeak: `${(Math.random() - 0.5) * 180}deg`,
          rotFall: `${(Math.random() - 0.5) * 360}deg`,
          delay: i * 0.05, // Rapid burst delay
        };
      });
      setFlyingParticles(prev => [...prev, ...newParticles]);

      setTimeout(() => {
        setFlyingParticles(prev => prev.filter(p => !newParticles.includes(p)));
      }, 2000);
    } else {
      const newParticles = Array.from({ length: 5 }).map((_, i) => ({
        id: `${type}-${Date.now()}-${i}-${Math.random()}`,
        emoji,
        type, // e.g. 'pijar'
        startX,
        startY,
        delay: i * 0.18, // Staggered stream delay
      }));
      setFlyingParticles(prev => [...prev, ...newParticles]);

      setTimeout(() => {
        setFlyingParticles(prev => prev.filter(p => !newParticles.includes(p)));
      }, 2500);
    }
  };

  // Watch triggers in store to run particle animation (works even at max/converted stats)
  const prevTriggersRef = useRef({ pijar: 0, tekad: 0, pijarLose: 0, tekadLose: 0 });

  useEffect(() => {
    // Initial mount check to avoid flying animation on loading
    if (prevTriggersRef.current.pijar === 0 && prevTriggersRef.current.tekad === 0 &&
      prevTriggersRef.current.pijarLose === 0 && prevTriggersRef.current.tekadLose === 0) {
      prevTriggersRef.current = {
        pijar: pijarFlyTrigger,
        tekad: tekadFlyTrigger,
        pijarLose: pijarLoseTrigger,
        tekadLose: tekadLoseTrigger,
      };
      return;
    }

    // 1. Pijar Gain (Fly to HUD)
    if (pijarFlyTrigger > prevTriggersRef.current.pijar) {
      spawnParticles('pijar');
      setPijarBounce(true);
      soundEngine.playSound('squash');
      setTimeout(() => soundEngine.playSound('squash'), 400);
      setTimeout(() => soundEngine.playSound('squash'), 800);
      setTimeout(() => setPijarBounce(false), 1300);
    }
    // 2. Tekad Gain (Fly to HUD)
    if (tekadFlyTrigger > prevTriggersRef.current.tekad) {
      spawnParticles('tekad');
      setTekadBounce(true);
      soundEngine.playSound('squash');
      setTimeout(() => soundEngine.playSound('squash'), 400);
      setTimeout(() => soundEngine.playSound('squash'), 800);
      setTimeout(() => setTekadBounce(false), 1300);
    }

    // 3. Pijar Loss (Scatter from Player)
    if (pijarLoseTrigger > prevTriggersRef.current.pijarLose) {
      spawnParticles('pijar-lose');
      soundEngine.playSound('glass');
    }
    // 4. Tekad Loss (Scatter from Player)
    if (tekadLoseTrigger > prevTriggersRef.current.tekadLose) {
      spawnParticles('tekad-lose');
      const currentPlayer = players[turnIdx];
      const currentTile = mapData?.tiles?.find(t => t.id === currentPlayer?.positionTileId);
      const isJebakanMundur = currentTile?.type === 'jebakan_mundur';
      if (!isJebakanMundur) {
        soundEngine.playSound('glass');
      }
    }

    prevTriggersRef.current = {
      pijar: pijarFlyTrigger,
      tekad: tekadFlyTrigger,
      pijarLose: pijarLoseTrigger,
      tekadLose: tekadLoseTrigger,
    };
  }, [pijarFlyTrigger, tekadFlyTrigger, pijarLoseTrigger, tekadLoseTrigger, players, turnIdx, mapData]);

  // Initial Intro Zoom: Start zoomed out to show the arena, then zoom in to the active player
  useEffect(() => {
    setCameraZoom(0.6);
    setCameraPan({ x: 0, y: 0 });

    const timer = setTimeout(() => {
      setCameraZoom(1.6);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Register the new modular gameplay panel for the right sidebar (Only on Desktop)
  useRegisterRightPanel(isDesktop ? JelajahGameplayPanel : null, 'jelajah-gameplay');

  // 1. Resize Handling & Device Detection
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (containerRef.current) {
        setViewSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Camera Controls
  const resetCamera = () => {
    setCameraZoom(1.6);
    setCameraPan({ x: 0, y: 0 });
  };

  const setAutoZoomEnabled = useGameStore(state => state.setAutoZoomEnabled);

  // 3. Recenter Camera Pan on Turn Change (Kembali ke player baru tanpa zoom out)
  useEffect(() => {
    setCameraPan({ x: 0, y: 0 });
    setAutoZoomEnabled(true);
  }, [turnIdx]);

  // 4. Game Initialization (Only for Test Mode)
  useEffect(() => {
    if (isTestMode && (!mapData || players.length === 0)) {
      const testMap = { tiles: mapManager.getTestMap() };
      const testPlayers = [{ id: 'p1', name: 'Tester', type: 'human' }];
      initGame(testMap, testPlayers);
    }
  }, [isTestMode, mapData, players.length, initGame]);

  const handleRollClick = (manualVal = null) => {
    if (phase !== 'WAITING_ROLL') return;
    const val = manualVal ? cheatDice(manualVal) : rollDice();
    setTimeout(() => {
      setAutoZoomEnabled(true); // Re-enable camera focus lock right when movement starts
      startMoving(val);
    }, 2000);
  };

  const showDiceDisplay = (phase === 'ROLLING');
  const showActionTray = (phase === 'WAITING_ROLL' || phase === 'ROLLING');

  useEffect(() => {
    if (winner) setShowVictory(true);
  }, [winner]);

  // 6. AI Bot Turn Trigger (Movement & Recovery)
  useEffect(() => {
    if (!currentPlayer || currentPlayer.type !== 'ai') return;

    if (phase === 'WAITING_ROLL') {
      const timer = setTimeout(() => {
        handleRollClick();
      }, GAME_CONFIG.AI_THINK_DELAY);
      return () => clearTimeout(timer);
    }

    if (phase === 'RECOVERY_WAITING') {
      const timer = setTimeout(() => {
        useGameStore.getState().handleRecoveryRoll();
      }, GAME_CONFIG.AI_THINK_DELAY);
      return () => clearTimeout(timer);
    }
  }, [phase, currentPlayer]);

  // 7. Keyboard Shortcuts
  useEffect(() => {
    const onSpacePress = () => {
      if (isLocalHuman && phase === 'WAITING_ROLL') {
        handleRollClick();
      }
    };

    keyboardManager.on(' ', onSpacePress);
    return () => keyboardManager.off(' ', onSpacePress);
  }, [phase, isLocalHuman]);

  if (!mapData || players.length === 0) return null;

  return (
    <LandscapeWrapper disableRotation={true}>
      <div className={`play-screen-main ${isLowGraphics ? 'low-graphics' : ''}`} ref={containerRef}>

        {/* Render flying particles */}
        {!isLowGraphics && flyingParticles.map(p => (
          <div
            key={p.id}
            className={`flying-particle ${p.type}`}
            style={{
              animationDelay: `${p.delay}s`,
              '--start-x': `${p.startX}px`,
              '--start-y': `${p.startY}px`,
              '--peak-x': `${p.peakX}px`,
              '--peak-y': `${p.peakY}px`,
              '--fall-x': `${p.fallX}px`,
              '--fall-y': `${p.fallY}px`,
              '--rot-mid': p.rotMid,
              '--rot-peak': p.rotPeak,
              '--rot-fall': p.rotFall,
            }}
          >
            {p.emoji}
          </div>
        ))}

        <div className="world-layer">
          <World3D
            mapData={mapData} 
            viewW={isLowGraphics ? viewSize.w * 0.5 : viewSize.w} 
            viewH={isLowGraphics ? viewSize.h * 0.5 : viewSize.h}
            players={players} offsetY={0}
            isChoosingPath={isChoosingPath} turnIdx={turnIdx}
            userZoom={cameraZoom} userPan={cameraPan}
            onUserPan={setCameraPan} onUserZoom={setCameraZoom}
            isManualZooming={isZooming}
          />
        </div>

        {/* Dynamic Dice Animation in Center */}
        <div className={`center-dice ${showDiceDisplay ? 'visible' : ''}`}>
          <Dice3D value={diceValue} isRolling={phase === 'ROLLING'} size={Math.min(viewSize.h * 0.25, 120)} />
        </div>

        {/* NEW UNIFIED TOP HUD (Visible on both Desktop and Mobile) */}
        <div className="game-hud-top-bar">
          {/* Top Left: Pijar Plate (+ Hanging tab) & Tekad Plate side-by-side */}
          <div className="hud-left-group">
            <div className="hud-plate-container top-left">
              <div className={`hud-plate-main pijar-plate ${pijarBounce ? 'bounce-active' : ''}`} onClick={() => setInventoryOpen(true)}>
                <div className="hud-plate-icon-circle coin-gold">
                  <span className="plate-emoji">🪙</span>
                </div>
                <div className="hud-plate-value-box">
                  <span className="plate-value">{currentPlayer?.koin || 0}</span>
                  {currentPlayer?.artifacts < 3 && (
                    <span className="plate-max">
                      /{currentPlayer?.artifacts === 0 ? 200 : currentPlayer?.artifacts === 1 ? 400 : 600}
                    </span>
                  )}
                </div>
              </div>

              {/* Hanging Tab for Artifacts */}
              <div className="hud-hanging-tab">
                <div className="hanging-icon-star">📦</div>
                <div className="artifact-slots-row">
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const isFilled = (currentPlayer?.artifacts || 0) > idx;
                    return (
                      <div
                        key={idx}
                        className={`artifact-slot-bubble ${isFilled ? 'filled' : 'empty'}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tekad Plate next to Pijar Plate */}
            <div className="hud-plate-container tekad-plate-container">
              <div className={`hud-plate-main tekad-plate ${tekadBounce ? 'bounce-active' : ''}`}>
                <div className="hud-plate-icon-circle gem-red">
                  <span className="plate-emoji">❤️</span>
                </div>
                <div className="hud-plate-value-box">
                  <span className="plate-value">{currentPlayer?.tekad || 0}</span>
                  <span className="plate-max">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right: Help and Settings Buttons */}
          <div className="hud-right-group" style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            <button className="hud-help-btn" onClick={() => { console.log("[DEBUG] Help button clicked!"); setHelpOpen(true); }} title="Panduan">
              <HelpCircle size={20} />
            </button>
            <button className="hud-settings-btn" onClick={() => setSettingsOpen(true)} title="Pengaturan">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Top Center Info Banner (Game Logs) - Unified for both PC & Mobile */}
        <div className="top-center-banner">
          {gameLogs[0] && phase !== 'IDLE' && <GameLogPill log={gameLogs[0]} />}
        </div>

        {/* DESKTOP HUD - Minimal Overlay */}
        {isDesktop && (
          <div className="hud-layer desktop-overlay">
            {/* Settings button removed from top-left-hud and integrated into unified top-right HUD */}

            {/* Floating Roll Button for PC - Centered & Premium */}
            <div className="bottom-center-hud" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              {isLocalHuman && phase === 'WAITING_ROLL' && (
                <button className="premium-roll-trigger" onClick={() => handleRollClick()}>
                  <div className="trigger-aura"></div>
                  <div className="trigger-inner">
                    <Dices size={32} />
                    <span>PUTAR DADU</span>
                  </div>
                </button>
              )}
            </div>
            <div className="top-right-hud">
              <div className="top-actions">
                <button className="mini-btn" onClick={resetCamera} title="Reset Camera"><Maximize size={18} /></button>
                {(isTestMode || isDevMode) && (
                  <>
                    <button
                      className="mini-btn"
                      onClick={() => spawnParticles('pijar')}
                      title="Cheat: Test Pijar Fly"
                      style={{ fontSize: '1rem' }}
                    >
                      🕯️
                    </button>
                    <button
                      className="mini-btn"
                      onClick={() => spawnParticles('pijar-lose')}
                      title="Cheat: Test Pijar Lose"
                      style={{ fontSize: '1rem' }}
                    >
                      🕯️💥
                    </button>
                    <button
                      className="mini-btn"
                      onClick={() => spawnParticles('tekad')}
                      title="Cheat: Test Tekad Fly"
                      style={{ fontSize: '1rem' }}
                    >
                      ❤️
                    </button>
                    <button
                      className="mini-btn"
                      onClick={() => spawnParticles('tekad-lose')}
                      title="Cheat: Test Tekad Lose"
                      style={{ fontSize: '1rem' }}
                    >
                      ❤️💥
                    </button>
                    <button
                      className={`mini-btn ${isTeleportMode ? 'teleport-active' : ''}`}
                      onClick={() => setTeleportMode(!isTeleportMode)}
                      title="Cheat: Teleport"
                      style={{
                        backgroundColor: isTeleportMode ? '#8B5CF6' : 'white',
                        color: isTeleportMode ? 'white' : '#4b4b4b',
                        borderColor: isTeleportMode ? '#7C3AED' : '#e5e5e5'
                      }}
                    >
                      <MapPin size={18} />
                    </button>
                  </>
                )}
              </div>
              <div className="zoom-slider-container">
                <span className="zoom-label">+</span>
                <input
                  type="range" min="0.5" max="3" step="0.01" value={cameraZoom}
                  onChange={(e) => setCameraZoom(parseFloat(e.target.value))}
                  onMouseDown={() => setIsZooming(true)} onMouseUp={() => setIsZooming(false)}
                  className="zoom-slider"
                />
                <span className="zoom-label">-</span>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE HUD - Vertical Portrait Redesign */}
        {!isDesktop && (
          <div className="hud-layer mobile-portrait-overlay">
            {/* Top resources bar removed and replaced with unified top HUD */}

            {/* 2. Left Side - Opponent List */}
            <div className="left-floating-column">
              <div className="opponents-stack">
                <OpponentList players={players} turnIdx={turnIdx} />
              </div>
            </div>

            {/* 3. Right Side - Util Buttons */}
            <div className="right-floating-column">
              <button className="floating-action-badge camera-reset" onClick={() => resetCamera()}>
                <div className="badge-icon">🔄</div>
                <span className="badge-label">Kamera</span>
              </button>

              {(isTestMode || isDevMode) && (
                <button
                  className={`floating-action-badge teleport ${isTeleportMode ? 'active' : ''}`}
                  onClick={() => setTeleportMode(!isTeleportMode)}
                >
                  <div className="badge-icon">📍</div>
                  <span className="badge-label">Cheat</span>
                </button>
              )}
            </div>


            {/* 5. Bottom Control Panel */}
            <div className="bottom-control-panel">
              {/* Left: Inventory Bag (Tas) */}
              <div className="bottom-panel-left">
                <button className="get-dice-btn" onClick={() => setInventoryOpen(true)}>
                  <div className="dice-stock-icon">💼</div>
                  <div className="dice-stock-label">Tas</div>
                  <div className="dice-stock-count">{currentPlayer?.inventory?.length || 0}/3</div>
                </button>
              </div>

              {/* Center: Dice Roll Plate */}
              <div className="bottom-panel-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                {isLocalHuman && phase === 'WAITING_ROLL' ? (
                  <button className="premium-roll-trigger" onClick={() => handleRollClick()} style={{ padding: '3px', borderRadius: '18px', boxShadow: '0 6px 0 #1899D6' }}>
                    <div className="trigger-aura"></div>
                    <div className="trigger-inner" style={{ padding: '10px 18px', borderRadius: '15px', fontSize: '0.85rem', gap: '8px' }}>
                      <Dices size={20} color="white" />
                      <span>PUTAR DADU</span>
                    </div>
                  </button>
                ) : (
                  <button className="premium-roll-trigger disabled" style={{ padding: '3px', borderRadius: '18px', boxShadow: 'none', background: '#AFAFAF', opacity: 0.7, cursor: 'not-allowed' }}>
                    <div className="trigger-inner" style={{ padding: '10px 18px', borderRadius: '15px', fontSize: '0.85rem', gap: '8px', background: '#AFAFAF', borderColor: 'rgba(255,255,255,0.2)' }}>
                      <Dices size={20} color="rgba(255,255,255,0.6)" />
                      <span>{phase === 'ROLLING' ? 'MEMUTAR...' : 'TUNGGU'}</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Right: Chat Button */}
              <div className="bottom-panel-right">
                <button className="chat-btn" onClick={() => alert("Fitur Chat Belum Tersedia")} style={{ zIndex: 10 }}>
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>

          </div>
        )}

        {isInventoryOpen && (
          <div className="inventory-window-overlay">
            <InventoryDetailList
              player={currentPlayer}
              isTestMode={isTestMode || isDevMode}
              onClose={() => setInventoryOpen(false)}
            />
          </div>
        )}

        <EventModal />
        <VictoryModal />
        <RecoveryOverlay />
        <CardBurningOverlay activeCard={activeUsedCard} />
        <JelajahHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

        <GameSettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSurrender={() => {
            setSettingsOpen(false);
            resetGame();
            setJelajahSubView('intro');
          }}
        />

        <style>{`
          .play-screen-main { position: relative; width: 100%; height: 100%; overflow: hidden; background: linear-gradient(160deg, #C8A261 0%, #A0784D 50%, #6A3E16 100%); }
          .world-layer { position: absolute; inset: 0; z-index: 1; }
          
          .center-dice {
            position: absolute; top: 50%; left: 50%; z-index: 100; pointer-events: none;
            display: flex; align-items: center; justify-content: center;
            transform: translate(-50%, -50%) scale(0); opacity: 0;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .center-dice.visible { transform: translate(-50%, -50%) scale(1); opacity: 1; }

          .hud-layer { position: absolute; inset: 0; z-index: 10; pointer-events: none; padding: 12px; box-sizing: border-box; }
          
          .top-left-hud { position: absolute; top: 12px; left: 12px; pointer-events: auto; }
          .top-right-hud { position: absolute; top: 12px; right: 12px; pointer-events: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
          .top-center-hud { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); pointer-events: auto; }
          .bottom-left-hud { position: absolute; bottom: 12px; left: 12px; pointer-events: auto; }
          .bottom-center-hud { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); pointer-events: auto; }
          .bottom-right-hud { position: absolute; bottom: 12px; right: 12px; pointer-events: auto; }

          .mobile-full-overlay {
            position: absolute; inset: 0; background: none;
            display: flex; align-items: center; justify-content: center;
            z-index: 50; backdrop-filter: none;
            padding: 20px;
          }
          @media (min-width: 1024px) {
            .mobile-full-overlay { 
              pointer-events: none;
            }
            .mobile-full-overlay > * { pointer-events: auto; }
          }

          /* MOBILE PORTRAIT HUD REDESIGN STYLES */
          .mobile-portrait-overlay {
            position: absolute; inset: 0; pointer-events: none;
            display: flex; flex-direction: column; justify-content: space-between;
            z-index: 50; padding: 0;
            font-family: 'Outfit', sans-serif;
          }
          .mobile-portrait-overlay > * { pointer-events: auto; }

          .top-resources-bar {
            width: 100%; display: flex; align-items: center; justify-content: space-between;
            padding: 12px 16px; box-sizing: border-box;
            background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%);
          }
          .resource-pill {
            background: #FFF0F0; border-radius: 50px;
            display: flex; align-items: center; gap: 8px; padding: 4px 12px;
            border: 2px solid #FFAAA6; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            min-width: 100px; justify-content: space-between; cursor: pointer;
          }
          .resource-pill.points {
            background: #FFF9E6; border-color: #FFD8A8;
          }
          .pill-icon { font-size: 1.1rem; }
          .pill-val { font-weight: 900; font-size: 0.95rem; color: #4B4B4B; }
          .pill-add {
            background: #FF8E8E; color: white; width: 18px; height: 18px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 0.8rem; font-weight: 900;
          }
          .resource-pill.points .pill-add { background: #FFA94D; }

          .mini-hud-btn {
            background: white; border: 2px solid #E5E5E5; border-radius: 50%;
            width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 3px 0 #E5E5E5; cursor: pointer;
          }
          .mini-hud-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 #E5E5E5; }

          /* Floating side badges */
          .left-floating-column {
            position: absolute; bottom: 105px; left: 16px;
            display: flex; flex-direction: column; gap: 8px;
            z-index: 10;
          }
          .right-floating-column {
            position: absolute; top: 80px; right: 12px;
            display: flex; flex-direction: column; gap: 10px;
            z-index: 10;
          }
          .floating-action-badge {
            background: white; border: 2.5px solid #2B2D42; border-radius: 16px;
            padding: 6px 8px; width: 64px; display: flex; flex-direction: column;
            align-items: center; gap: 2px; box-shadow: 0 4px 0 #2B2D42;
            cursor: pointer; transition: all 0.1s;
          }
          .floating-action-badge:active { transform: translateY(3px); box-shadow: 0 1px 0 #2B2D42; }
          .badge-icon { font-size: 1.4rem; }
          .badge-label { font-size: 0.55rem; font-weight: 900; color: #4B4B4B; text-transform: uppercase; }

          .opponents-stack { margin-top: 10px; }

          .top-center-banner {
            position: absolute; top: 100px; left: 50%; transform: translateX(-50%);
            z-index: 9;
          }

          /* Bottom Control Panel Styles matching Reference */
          .bottom-control-panel {
            margin-top: auto; width: 100%; display: grid;
            grid-template-columns: 1fr 1.2fr 1fr;
            align-items: end; padding: 15px 15px 25px; box-sizing: border-box;
            background: none;
            position: relative; gap: 10px;
          }
          
          .bottom-panel-left { display: flex; justify-content: flex-start; }
          .bottom-panel-right { display: flex; justify-content: flex-end; }
          .bottom-panel-center { display: flex; justify-content: center; }

          .get-dice-btn {
            background: linear-gradient(135deg, #FEF3C7, #E2C999); border: 2.5px dashed #8B4513; border-radius: 18px;
            box-shadow: 0 4px 0 #6A3E16; padding: 8px 12px; width: 85px;
            display: flex; flex-direction: column; align-items: center; cursor: pointer;
          }
          .get-dice-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #6A3E16; }
          .dice-stock-icon { font-size: 1.3rem; margin-bottom: 2px; }
          .dice-stock-label { font-size: 0.55rem; font-weight: 900; color: #4A2E1B; text-transform: uppercase; }
          .dice-stock-count { font-size: 0.8rem; font-weight: 900; color: #6A3E16; }

          .roll-dice-plate-btn {
            background: #FFF0F0; border: 4px solid #2B2D42; border-radius: 50%;
            width: 100px; height: 100px; display: flex; flex-direction: column;
            align-items: center; justify-content: center; cursor: pointer;
            box-shadow: 0 6px 0 #2B2D42; position: relative;
          }
          .roll-dice-plate-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #2B2D42; }
          .roll-dice-plate-btn.disabled { cursor: not-allowed; opacity: 0.9; }
          .roll-dice-plate-btn.disabled:active { transform: none; box-shadow: 0 6px 0 #2B2D42; }
          
          .plate-dice-graphic { margin-bottom: 2px; }
          .plate-label { font-size: 0.95rem; font-weight: 900; color: #2B2D42; letter-spacing: 0.5px; }

          .pulse-glow {
            animation: pulseGlow 1.5s infinite alternate;
          }
          @keyframes pulseGlow {
            from { box-shadow: 0 6px 0 #2B2D42, 0 0 5px rgba(88,204,2,0.5); }
            to { box-shadow: 0 6px 0 #2B2D42, 0 0 20px rgba(88,204,2,0.9); }
          }

          .turn-stats-badge {
            background: white; border: 3px solid #2B2D42; border-radius: 18px;
            box-shadow: 0 4px 0 #2B2D42; padding: 10px; width: 95px;
            display: flex; flex-direction: column; gap: 4px;
          }
          .lap-counter-row, .timer-countdown-row {
            display: flex; align-items: center; gap: 6px;
          }
          .lap-value { font-size: 0.75rem; font-weight: 900; color: #D97706; }
          .timer-val { font-size: 0.65rem; font-weight: 800; color: #4B4B4B; }



          .inventory-window-overlay { 
            position: absolute; inset: 0; background: rgba(0,0,0,0.7);
            display: flex; align-items: center; justify-content: center;
            z-index: 10000; background: rgba(0,0,0,0.8);
          }

          .zoom-slider-container {
            background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
            padding: 8px 4px; border-radius: 12px; border: 2px solid #333;
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            height: 150px; width: 30px;
          }
          .zoom-label { color: #777; font-weight: 900; font-size: 0.8rem; }
          .zoom-slider {
            -webkit-appearance: none; appearance: none;
            width: 100px; height: 3px; background: #222; border-radius: 2px;
            transform: rotate(270deg); margin: 50px 0;
            outline: none; cursor: pointer;
          }
          .zoom-slider::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 16px; height: 16px; background: #58CC02; border-radius: 50%;
          }

          .mini-btn {
            width: 32px; height: 32px; border-radius: 8px; 
            background: var(--card-bg, #FFFFFF);
            border: 2px solid var(--border-color, #E5E5E5); 
            color: var(--text-color, #4B4B4B);
            display: flex; align-items: center; justify-content: center; cursor: pointer;
            box-shadow: 0 2px 0 var(--border-color, #E5E5E5);
          }
          .mini-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 var(--border-color, #E5E5E5); }

          .chat-btn {
            width: 38px; height: 38px; border-radius: 12px;
            background: linear-gradient(135deg, #FEF3C7, #E2C999);
            border: 2px dashed #8B4513; color: #4A2E1B; display: flex; align-items: center; 
            justify-content: center; cursor: pointer; box-shadow: 0 3px 0 #6A3E16;
          }

          .back-btn-minimal {
            display: flex; align-items: center; gap: 8px; 
            background: var(--card-bg, white);
            border: 2px solid var(--border-color, #e5e5e5); 
            padding: 6px 12px; border-radius: 12px;
            font-weight: 900; font-size: 0.8rem; 
            color: var(--text-color, #4b4b4b); cursor: pointer;
            box-shadow: 0 3px 0 var(--border-color, #e5e5e5);
          }
          .back-btn-minimal:active { transform: translateY(2px); box-shadow: 0 1px 0 var(--border-color, #e5e5e5); }

          /* Premium Roll Trigger (PC Only) */
          .premium-roll-trigger {
            position: relative; background: linear-gradient(135deg, #D4A373, #A26E40); border: 2px solid #EAB308; padding: 5px; border-radius: 24px;
            cursor: pointer; box-shadow: 0 8px 0 #6A3E16; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: auto; animation: slideUpIn 0.5s backwards;
          }
          .trigger-inner {
            background: linear-gradient(135deg, #D4A373, #A26E40); border: 3px solid rgba(234,179,8,0.5); border-radius: 20px;
            padding: 16px 40px; display: flex; align-items: center; gap: 16px;
            color: #FFFDF5; font-weight: 900; font-size: 1.4rem; letter-spacing: 1px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .trigger-aura {
            position: absolute; inset: -10px; border-radius: 30px;
            background: radial-gradient(circle, rgba(234, 179, 8, 0.3) 0%, transparent 70%);
            animation: pulseAura 3s infinite; z-index: -1;
            will-change: transform, opacity;
          }
          .premium-roll-trigger:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 12px 0 #6A3E16; }
          .premium-roll-trigger:active { transform: translateY(6px) scale(0.98); box-shadow: 0 2px 0 #6A3E16; }

          @keyframes slideUpIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes pulseAura { 0% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 0.2; } 100% { transform: scale(1); opacity: 0.5; } }

          .top-actions { display: flex; gap: 12px; }
          .mini-btn {
            width: 42px; height: 42px; border-radius: 12px; 
            background: var(--card-bg, white);
            border: 2px solid var(--border-color, #e5e5e5); 
            color: var(--text-color, #4b4b4b);
            display: flex; align-items: center; justify-content: center; cursor: pointer;
            box-shadow: 0 4px 0 var(--border-color, #e5e5e5); transition: all 0.1s;
          }
          .mini-btn:hover { background: var(--background-color, #f7f7f7); }
          .mini-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 var(--border-color, #e5e5e5); }

          .turn-description-text {
            background: rgba(99, 58, 20, 0.9);
            border: 2px solid #EAB308;
            color: #FFFDF5 !important;
            padding: 6px 16px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 850;
            text-align: center;
            box-shadow: 0 4px 10px rgba(106,62,22,0.4);
            letter-spacing: 0.5px;
            white-space: nowrap;
            z-index: 10;
            font-family: 'Outfit', sans-serif;
          }
          .turn-description-text.mobile {
            font-size: 0.75rem;
            padding: 4px 10px;
            border-radius: 8px;
            border-width: 1.5px;
            margin-top: 4px;
          }

          /* ========================================== */
          /* NEW PREMIUM HUD TOP BAR STYLES             */
          /* ========================================== */
          .game-hud-top-bar {
            position: absolute; top: 16px; left: 16px; right: 16px;
            display: flex; justify-content: space-between; align-items: flex-start;
            pointer-events: none; z-index: 100;
            font-family: 'Outfit', 'Fredoka', sans-serif;
          }

          .hud-left-group {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            pointer-events: none;
          }
          .hud-right-group {
            display: flex;
            align-items: center;
            pointer-events: none;
          }

          .hud-plate-container {
            display: flex; flex-direction: column; align-items: flex-start;
            pointer-events: auto;
          }
          .hud-plate-container.tekad-plate-container {
            align-items: center;
          }

          .hud-plate-main {
            display: flex; align-items: center; gap: 10px;
            background: linear-gradient(to bottom, #FFFDF0 0%, #FFF5D6 100%);
            border: 3px solid #D5A460;
            border-radius: 30px;
            padding: 4px 16px 4px 6px;
            box-shadow: 0 4px 0 #A87C43, 0 8px 16px rgba(0,0,0,0.15);
            min-width: 110px; height: 42px; box-sizing: border-box;
            cursor: pointer; transition: all 0.1s;
          }
          .hud-plate-main:hover { filter: brightness(1.05); }
          .hud-plate-main:active { transform: translateY(2px); box-shadow: 0 2px 0 #A87C43, 0 4px 8px rgba(0,0,0,0.15); }

          .hud-plate-icon-circle {
            width: 32px; height: 32px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            flex-shrink: 0;
          }
          .coin-gold {
            background: linear-gradient(135deg, #FFDF00 0%, #FFA500 100%);
          }
          .gem-red {
            background: linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%);
          }

          .plate-emoji { font-size: 1.1rem; }
          
          .hud-plate-value-box {
            display: flex; align-items: baseline; gap: 2px;
          }
          .plate-value {
            font-size: 1.25rem; font-weight: 950; color: #7B521E;
            text-shadow: 0 1px 0 rgba(255,255,255,0.8);
          }
          .plate-max {
            font-size: 0.75rem; font-weight: 800; color: #A0784D;
          }

          /* Hanging Tab for Artifacts */
          .hud-hanging-tab {
            display: flex; align-items: center; gap: 8px;
            background: linear-gradient(to bottom, #FFFDF5 0%, #FFF8E7 100%);
            border: 3px solid #D5A460;
            border-top: none;
            border-radius: 0 0 16px 16px;
            padding: 4px 12px 6px;
            margin-left: 20px;
            box-shadow: 0 3px 0 #A87C43, 0 4px 8px rgba(0,0,0,0.1);
            pointer-events: auto;
          }
          .hanging-icon-star {
            font-size: 0.95rem; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
          }
          .artifact-slots-row {
            display: flex; gap: 6px;
          }
          .artifact-slot-bubble {
            width: 14px; height: 14px; border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .artifact-slot-bubble.empty {
            background: #E5E7EB;
            box-shadow: inset 0 2px 3px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.6);
            opacity: 0.7;
          }
          .artifact-slot-bubble.filled {
            background: radial-gradient(circle at 35% 35%, #FF7EB3 0%, #FF2E93 60%, #B8005D 100%);
            box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 -2px 3px rgba(0,0,0,0.3), 0 0 8px rgba(255, 46, 147, 0.75);
            border: 1px solid white;
          }

          /* Settings and Help Buttons */
          .hud-settings-btn, .hud-help-btn {
            background: linear-gradient(to bottom, #FFFDF0 0%, #FFF5D6 100%);
            border: 3px solid #D5A460;
            border-radius: 50%;
            width: 42px; height: 42px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 0 #A87C43, 0 6px 12px rgba(0,0,0,0.1);
            color: #7B521E; cursor: pointer; transition: all 0.1s;
            pointer-events: auto;
          }
          .hud-settings-btn:hover, .hud-help-btn:hover { filter: brightness(1.05); }
          .hud-settings-btn:active, .hud-help-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #A87C43, 0 4px 6px rgba(0,0,0,0.1); }

          /* Squash-and-stretch Pop animation for HUD plates */
          .hud-plate-main.bounce-active {
            animation: hudPlatePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 3;
          }

          @keyframes hudPlatePop {
            0%, 100% { transform: scale(1) rotate(0deg); }
            45% { transform: scale(1.22) rotate(2deg); }
            75% { transform: scale(0.92) rotate(-1deg); }
          }

          /* Flying Particles styling */
          .flying-particle {
            position: absolute;
            font-size: 2.2rem;
            pointer-events: none;
            z-index: 9999;
            will-change: transform, opacity;
            opacity: 0;
          }
          .flying-particle.pijar {
            animation: flyToPijarHUD 2.0s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
          .flying-particle.tekad {
            animation: flyToTekadHUD 2.0s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
          .flying-particle.pijar-lose, .flying-particle.tekad-lose {
            animation: scatterParticle 1.5s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
          }

          @keyframes flyToPijarHUD {
            0% {
              left: var(--start-x);
              top: var(--start-y);
              transform: translate(-50%, -50%) scale(0.3);
              opacity: 0;
            }
            15% {
              left: var(--start-x);
              top: var(--start-y);
              transform: translate(-50%, -50%) scale(1.6) rotate(15deg);
              opacity: 1;
              filter: drop-shadow(0 0 20px rgba(255, 223, 0, 1));
            }
            100% {
              left: 71px;
              top: 37px;
              transform: translate(-50%, -50%) scale(0.3);
              opacity: 0;
            }
          }

          @keyframes flyToTekadHUD {
            0% {
              left: var(--start-x);
              top: var(--start-y);
              transform: translate(-50%, -50%) scale(0.3);
              opacity: 0;
            }
            15% {
              left: var(--start-x);
              top: var(--start-y);
              transform: translate(-50%, -50%) scale(1.6) rotate(-15deg);
              opacity: 1;
              filter: drop-shadow(0 0 20px rgba(255, 107, 107, 1));
            }
            100% {
              left: 193px;
              top: 37px;
              transform: translate(-50%, -50%) scale(0.3);
              opacity: 0;
            }
          }

          @keyframes scatterParticle {
            0% {
              left: var(--start-x);
              top: var(--start-y);
              transform: translate(-50%, -50%) scale(0.2) rotate(0deg);
              opacity: 0;
            }
            12% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.3) rotate(var(--rot-mid));
            }
            38% {
              left: calc(var(--start-x) + var(--peak-x));
              top: calc(var(--start-y) + var(--peak-y));
              transform: translate(-50%, -50%) scale(1.0) rotate(var(--rot-peak));
              opacity: 1;
            }
            100% {
              left: calc(var(--start-x) + var(--fall-x));
              top: calc(var(--start-y) + var(--fall-y));
              transform: translate(-50%, -50%) scale(0.4) rotate(var(--rot-fall));
              opacity: 0;
            }
          }

          /* Android WebView rendering & depth sorting isolation for 2D overlays */
          .event-sheet-overlay,
          .burning-overlay-container,
          .victory-overlay,
          .settings-overlay,
          .inventory-window-overlay {
            -webkit-transform: translate3d(0, 0, 0) !important;
            transform: translate3d(0, 0, 0) !important;
            transform-style: preserve-3d !important;
            backface-visibility: hidden !important;
            -webkit-backface-visibility: hidden !important;
          }

          /* ========================================== */
          /* LOW GRAPHICS OPTIMIZATIONS                 */
          /* ========================================== */
          .play-screen-main.low-graphics * {
            box-shadow: none !important;
            text-shadow: none !important;
            filter: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            transition-duration: 0s !important;
            animation-duration: 0s !important;
          }
          /* Keep essential active states snappy without animations */
          .play-screen-main.low-graphics .premium-roll-trigger,
          .play-screen-main.low-graphics .mini-btn,
          .play-screen-main.low-graphics .get-dice-btn,
          .play-screen-main.low-graphics .active-player-card,
          .play-screen-main.low-graphics .hud-plate-main {
            transform: none !important;
            transition: none !important;
            box-shadow: none !important;
            border-width: 2.2px !important;
          }
          .play-screen-main.low-graphics .world-layer {
            width: 50% !important;
            height: 50% !important;
            transform: scale(2) !important;
            transform-origin: top left !important;
            image-rendering: pixelated !important;
          }
        `}</style>
      </div>
    </LandscapeWrapper>
  );
}
