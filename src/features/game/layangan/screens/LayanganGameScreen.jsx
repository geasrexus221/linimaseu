import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, X, Star, AlertCircle, Heart } from 'lucide-react';
import { useStore } from '../../../../store/useStore';

import { quizBanks } from '../../jelajah-nusantara/data/questions';


const GRAVITY = 0.4;
const JUMP = -7;
const PIPE_SPEED = 3.5;
const PIPE_WIDTH = 80; 
const GAP_SIZE = 220; 
const PIPE_SPAWN_RATE = 140; 
const INVINCIBILITY_FRAMES = 120; 
const BOT_NAMES = ['Budi', 'Siti', 'Andi'];
const BOT_COLORS = ['#FF4B4B', '#58CC02', '#FFD700'];

export default function LayanganGameScreen({ config, onBack }) {
  const [phase, setPhase] = useState('intro'); 
  const [introCount, setIntroCount] = useState(3);
  const [score, setScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [pipesState, setPipesState] = useState([]);
  const [health, setHealth] = useState(3);
  const [earnedStars, setEarnedStars] = useState(0);
  const { addStars } = useStore();

  useEffect(() => {
    if (phase === 'gameover') {
      
      const reward = (score * 10) + (quizScore * 20);
      setEarnedStars(reward);
      if (reward > 0) {
        addStars(reward);
      }
    }
  }, [phase]);
  
  
  const gameQuestions = React.useMemo(() => {
    const themeId = config?.quizThemeId || 'ipas_4_5';
    const bank = quizBanks[themeId] || quizBanks.sejarah_umum;
    
    return bank.map(q => {
      const correctText = q.options[q.correct];
      const wrongOptions = q.options.filter((_, idx) => idx !== q.correct);
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      
      const isTopCorrect = Math.random() > 0.5;
      return {
        id: q.id,
        text: q.question,
        options: isTopCorrect ? [correctText, randomWrong] : [randomWrong, correctText],
        correct: isTopCorrect ? 0 : 1
      };
    });
  }, [config]);
  
  const containerRef = useRef(null);
  const reqRef = useRef(null);
  const frameRef = useRef(0);
  
  const getInitialPlayers = (mode) => {
    const p1 = { id: 'p1', isBot: false, name: 'Kamu', color: '#1CB0F6', y: 300, v: 0, alive: true, emoji: '🪁', invinc: 0 };
    if (mode === 'vs_bot') {
      return [
        p1,
        { id: 'b1', isBot: true, name: BOT_NAMES[0], color: BOT_COLORS[0], y: 300, v: 0, alive: true, emoji: '🪁', invinc: 0, targetY: 300 },
        { id: 'b2', isBot: true, name: BOT_NAMES[1], color: BOT_COLORS[1], y: 300, v: 0, alive: true, emoji: '🪁', invinc: 0, targetY: 300 },
        { id: 'b3', isBot: true, name: BOT_NAMES[2], color: BOT_COLORS[2], y: 300, v: 0, alive: true, emoji: '🪁', invinc: 0, targetY: 300 },
      ];
    }
    return [p1];
  };

  const stateRef = useRef({
    phase: 'intro',
    score: 0,
    quizScore: 0,
    health: 3,
    activeQuestion: null,
    isQuestionRevealed: false,
    pipesSpawned: 0,
    spawnTimer: PIPE_SPAWN_RATE,
    pipes: [],
    players: getInitialPlayers(config?.mode || 'solo')
  });

  useEffect(() => {
    stateRef.current.phase = phase;
  }, [phase]);

  useEffect(() => {
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setIntroCount(count);
      } else if (count === 0) {
        setIntroCount('TERBANG!');
      } else {
        clearInterval(interval);
        setPhase('playing');
        startGameLoop();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startGameLoop = () => {
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    const loop = () => {
      if (stateRef.current.phase === 'playing') {
        updatePhysics();
        renderDOM();
      }
      reqRef.current = requestAnimationFrame(loop);
    };
    reqRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  const spawnPipe = (h, w, isFork) => {
    stateRef.current.pipesSpawned += 1;
    const id = Date.now();

    if (isFork) {
      
      const gap1Top = Math.random() * 50 + 50; 
      const gap1Bot = gap1Top + GAP_SIZE;
      
      const gap2Top = gap1Bot + 80 + Math.random() * 50; 
      const gap2Bot = gap2Top + GAP_SIZE;

      const q = stateRef.current.activeQuestion;
      const topIsCorrect = q.correct === 0;

      stateRef.current.pipes.push({
        id, x: w + 50, isFork: true,
        gap1Top, gap1Bot, gap2Top, gap2Bot,
        qText: q.text,
        optTop: q.options[0],
        optBot: q.options[1],
        topCorrect: topIsCorrect,
        passed: false,
        trapActivated: false
      });
    } else {
      
      const minHeight = 100;
      const maxHeight = Math.max(minHeight, h - GAP_SIZE - 100);
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      
      stateRef.current.pipes.push({
        id, x: w + 50, isFork: false,
        topHeight, bottomY: topHeight + GAP_SIZE,
        passed: false
      });
    }
    setPipesState([...stateRef.current.pipes]);
  };

  const jump = (id = 'p1') => {
    if (stateRef.current.phase !== 'playing') return;
    const p = stateRef.current.players.find(x => x.id === id);
    if (p && p.alive) {
      p.v = JUMP;
    }
  };

  const handleScreenClick = () => {
    if (phase === 'playing') jump('p1');
  };

  const updatePhysics = () => {
    const s = stateRef.current;
    if (!containerRef.current) return;
    const h = containerRef.current.clientHeight;
    const w = containerRef.current.clientWidth;
    
    frameRef.current++;

    s.spawnTimer -= 1;
    if (s.spawnTimer <= 0) {
      const willBeFork = (s.pipesSpawned + 1) % 5 === 0;
      
      if (willBeFork && !s.isQuestionRevealed) {
        
        const q = gameQuestions[Math.floor(Math.random() * gameQuestions.length)];
        s.activeQuestion = q;
        setActiveQuestion(q);
        s.isQuestionRevealed = true;
        
        s.spawnTimer = 240;
      } else {
        spawnPipe(h, w, willBeFork);
        s.isQuestionRevealed = false;
        
        s.spawnTimer = PIPE_SPAWN_RATE;
      }
    }

    
    for (let i = s.pipes.length - 1; i >= 0; i--) {
      const p = s.pipes[i];
      p.x -= PIPE_SPEED;
      
      
      if (p.isFork && p.x < w / 2 && s.activeQuestion) {
        s.activeQuestion = null;
        setActiveQuestion(null);
      }

      
      if (p.isFork && p.x + PIPE_WIDTH/2 < 120 + 15 && !p.trapActivated) {
        p.trapActivated = true;
        setPipesState([...s.pipes]); 
      }

      
      s.players.forEach(player => {
        if (!player.alive || player.invinc > 0) return;
        
        const px = 120; 
        const r = 15; 
        let isHit = false;

        if (p.x < px + r && p.x + PIPE_WIDTH > px - r) {
          if (p.isFork) {
            
            if (player.y - r < p.gap1Top) isHit = true;
            
            else if (player.y + r > p.gap1Bot && player.y - r < p.gap2Top) isHit = true;
            
            else if (player.y + r > p.gap2Bot) isHit = true;

            
            if (p.x + PIPE_WIDTH/2 < px + r) {
               if (!p.topCorrect && player.y > p.gap1Top && player.y < p.gap1Bot) isHit = true;
               if (p.topCorrect && player.y > p.gap2Top && player.y < p.gap2Bot) isHit = true;
            }

          } else {
            
            if (player.y - r < p.topHeight || player.y + r > p.bottomY) isHit = true;
          }
        }

        if (isHit) {
          if (player.isBot) {
            player.alive = false;
          } else {
            s.health -= 1;
            setHealth(s.health);
            if (s.health <= 0) {
              player.alive = false;
              setPhase('gameover');
            } else {
              player.invinc = INVINCIBILITY_FRAMES;
              player.y = h / 2;
              player.v = 0;
            }
          }
        }
      });

      
      if (!p.passed && p.x + PIPE_WIDTH < 120) {
        p.passed = true;
        s.score++;
        setScore(s.score);
        if (p.isFork) {
          s.quizScore++;
          setQuizScore(s.quizScore);
        }
      }

      if (p.x < -150) {
        s.pipes.splice(i, 1);
        setPipesState([...s.pipes]);
      }
    }

    
    let nextPipe = s.pipes.find(p => p.x + PIPE_WIDTH > 120 && !p.passed);
    
    s.players.forEach(player => {
      if (!player.alive) {
        if (player.y < h - 20) {
          player.v += GRAVITY;
          player.y += player.v;
        }
        return;
      }

      if (player.invinc > 0) {
        player.invinc -= 1;
      }
      
      player.v += GRAVITY;
      player.y += player.v;

      
      if (player.y > h - 20) {
        if (player.invinc > 0) {
          player.y = h - 20;
          player.v = 0;
        } else if (!player.isBot) {
          s.health -= 1;
          setHealth(s.health);
          if (s.health <= 0) {
            player.alive = false;
            setPhase('gameover');
          } else {
            player.invinc = INVINCIBILITY_FRAMES;
            player.y = h / 2;
            player.v = 0;
          }
        } else {
          player.alive = false;
        }
      }
      if (player.y < 0) { player.y = 0; player.v = 0; }

      
      if (player.isBot && player.invinc === 0 && nextPipe) {
        if (nextPipe.isFork) {
          
          if (nextPipe.topCorrect) {
            player.targetY = nextPipe.gap1Top + GAP_SIZE/2;
          } else {
            player.targetY = nextPipe.gap2Top + GAP_SIZE/2;
          }
        } else {
          player.targetY = nextPipe.topHeight + GAP_SIZE/2;
        }
        
        const noise = Math.sin(frameRef.current / 30 + player.id.charCodeAt(1)) * 40;
        if (player.y > player.targetY + noise && player.v >= 0) {
          if (Math.random() > 0.05) jump(player.id);
        }
      }
    });
  };

  const renderDOM = () => {
    const s = stateRef.current;
    if (!containerRef.current) return;

    s.players.forEach(player => {
      const el = document.getElementById(`player-${player.id}`);
      if (el) {
        const rot = player.invinc > 0 ? 0 : Math.min(Math.max(player.v * 6, -35), 90);
        el.style.transform = `translateY(${player.y}px) rotate(${rot}deg)`;
        
        if (!player.alive) {
          el.style.filter = 'grayscale(100%)';
          el.style.opacity = '0.5';
        } else if (player.invinc > 0) {
          el.style.opacity = frameRef.current % 10 < 5 ? '0.3' : '0.8';
        } else {
          el.style.opacity = '1';
          el.style.filter = 'none';
        }
      }
    });

    s.pipes.forEach(p => {
      const wrapper = document.getElementById(`pipe-wrapper-${p.id}`);
      if (wrapper) wrapper.style.transform = `translateX(${p.x}px)`;
    });
  };

  return (
    <div className="layangan-game-screen" onClick={handleScreenClick}>
      
      <div className="sky-bg">
        <div className="clouds-layer" />
        <div className="mountains-layer" />
        <div className="village-layer" />
        <div className="ground-layer" />
      </div>

      
      <div className="hud">
        <button className="quit-btn" onClick={onBack}><X size={20} /></button>
        
        <div className="health-bar">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={24} fill={i < health ? "#FF4B4B" : "rgba(0,0,0,0.2)"} color={i < health ? "#C0392B" : "rgba(0,0,0,0.3)"} />
          ))}
        </div>

        <div className="score-board">
          <div className="s-val">{score}</div>
          <div className="s-lbl">PIPA LEWAT</div>
        </div>
      </div>

      
      {activeQuestion && phase === 'playing' && (
        <div className="floating-question">
          <div className="q-tag">PERSIAPKAN JAWABANMU!</div>
          <h2>{activeQuestion.text}</h2>
          <div className="q-options-preview">
            <div className="opt-preview opt-top">
               <span className="opt-badge">JALUR ATAS</span>
               <span className="opt-text">{activeQuestion.options[0]}</span>
            </div>
            <div className="opt-preview opt-bot">
               <span className="opt-badge">JALUR BAWAH</span>
               <span className="opt-text">{activeQuestion.options[1]}</span>
            </div>
          </div>
        </div>
      )}

      
      <div className="physics-container" ref={containerRef}>
        <div className="pipes-container">
          {pipesState.map(p => (
            <div id={`pipe-wrapper-${p.id}`} key={p.id} className="pipe-wrapper" style={{ transform: `translateX(${p.x}px)` }}>
              {p.isFork ? (
                <>
                  <div className="pipe" style={{ top: 0, height: p.gap1Top }} />
                  <div className="pipe" style={{ top: p.gap1Bot, height: p.gap2Top - p.gap1Bot }} />
                  <div className="pipe" style={{ top: p.gap2Bot, bottom: 0 }} />
                  
                  
                  {!p.topCorrect && <div className={`dead-end-block ${p.trapActivated ? 'active' : ''}`} style={{ top: p.gap1Top, height: GAP_SIZE }} />}
                  {p.topCorrect && <div className={`dead-end-block ${p.trapActivated ? 'active' : ''}`} style={{ top: p.gap2Top, height: GAP_SIZE }} />}
                </>
              ) : (
                <>
                  <div className="pipe pipe-top" style={{ height: p.topHeight }} />
                  <div className="pipe pipe-bottom" style={{ top: p.bottomY, bottom: 0 }} />
                </>
              )}
            </div>
          ))}
        </div>

        {stateRef.current.players.map(p => (
          <div key={p.id} id={`player-${p.id}`} className="player-kite" style={{ '--k-color': p.color }}>
            <div className="k-emoji">{p.emoji}</div>
            <div className="k-tail">〰️</div>
            <div className="k-name">{p.name}</div>
          </div>
        ))}
      </div>

      {phase === 'intro' && (
        <div className="overlay dark-overlay">
          <div className="countdown-text">{introCount}</div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="overlay gameover-overlay">
          <div className="go-card">
            <AlertCircle size={50} color="#FF4B4B" />
            <h2>YAAAH NYANGKUT!</h2>
            <p>Nyawamu habis setelah melewati <b>{score} pipa</b>.</p>
            {earnedStars > 0 && (
              <div className="reward-box">
                <span>Hadiahmu:</span>
                <div className="reward-amt"><Star size={24} fill="#FFD700" color="#FFD700" /> +{earnedStars}</div>
              </div>
            )}
            <button className="go-btn" onClick={(e) => { e.stopPropagation(); onBack(); }}>KEMBALI KE LOBI</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .layangan-game-screen {
          position: absolute; inset: 0; background: #87CEEB;
          font-family: 'Outfit', sans-serif; overflow: hidden;
          user-select: none;
        }

        .sky-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; background: linear-gradient(180deg, #4fc3f7 0%, #b3e5fc 100%); }
        .clouds-layer {
          position: absolute; top: 5%; left: 0; width: 200%; height: 50%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><text x="10" y="30" font-size="20" opacity="0.6">☁️</text><text x="60" y="20" font-size="25" opacity="0.4">☁️</text></svg>') repeat-x;
          background-size: 250px 125px; animation: scrollBg 40s linear infinite;
        }
        .mountains-layer {
          position: absolute; bottom: 7%; left: 0; width: 200%; height: 40%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150"><text x="20" y="145" font-size="120" opacity="0.4">⛰️</text><text x="180" y="145" font-size="100" opacity="0.3">⛰️</text><text x="300" y="145" font-size="130" opacity="0.35">🗻</text></svg>') repeat-x bottom left;
          background-size: 600px 225px; animation: scrollBg 50s linear infinite;
        }
        .village-layer {
          position: absolute; bottom: 7%; left: 0; width: 200%; height: 25%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100"><text x="10" y="98" font-size="40">🌲</text><text x="70" y="98" font-size="30">🏠</text><text x="130" y="98" font-size="50">🌳</text><text x="200" y="98" font-size="35">🛖</text><text x="250" y="98" font-size="45">🌴</text></svg>') repeat-x bottom left;
          background-size: 400px 133px; animation: scrollBg 25s linear infinite;
        }
        .ground-layer {
          position: absolute; bottom: 0; left: 0; width: 200%; height: 8%;
          background: #4CAF50; border-top: 5px solid #388E3C;
          background-image: repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 40px);
          animation: scrollBg 8s linear infinite;
        }
        @keyframes scrollBg { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .hud {
          position: absolute; top: 0; left: 0; right: 0; padding: 20px;
          display: flex; justify-content: space-between; align-items: flex-start; z-index: 20;
        }
        .quit-btn {
          background: rgba(255,255,255,0.8); border: 2px solid #E5E5E5; border-radius: 12px;
          width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;
          color: #4B4B4B; cursor: pointer; box-shadow: 0 4px 0 rgba(0,0,0,0.1);
        }
        
        .health-bar {
          display: flex; gap: 8px; background: rgba(255,255,255,0.8); padding: 8px 15px;
          border-radius: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .score-board {
          background: rgba(255,255,255,0.9); padding: 5px 20px; border-radius: 20px;
          display: flex; flex-direction: column; align-items: center;
          border: 3px solid #1CB0F6; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .s-val { font-size: 2rem; font-weight: 900; color: #1CB0F6; line-height: 1; }
        .s-lbl { font-size: 0.6rem; font-weight: 900; color: #A1A1AA; }

        .floating-question { position: absolute; top: 100px; left: 50%; transform: translateX(-50%); background: #FFD700; border: 4px solid white; padding: 20px 30px; border-radius: 30px; text-align: center; box-shadow: 0 10px 20px rgba(0,0,0,0.2); z-index: 100; animation: floatQ 2s infinite ease-in-out; width: 80%; max-width: 500px; }
        .floating-question h2 { margin: 10px 0 0; color: #333; font-weight: 900; font-size: 1.4rem; line-height: 1.3; }
        .q-tag { background: #FF4B4B; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 900; font-size: 0.8rem; display: inline-block; box-shadow: 0 3px 0 #C0392B; }
        
        .q-options-preview { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; }
        .opt-preview { display: flex; align-items: center; background: rgba(255,255,255,0.95); border-radius: 12px; padding: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
        .opt-preview.opt-top { border: 2px solid #1CB0F6; }
        .opt-preview.opt-bot { border: 2px solid #FF4B4B; }
        .opt-badge { padding: 6px 12px; border-radius: 8px; font-weight: 900; font-size: 0.8rem; color: white; margin-right: 12px; white-space: nowrap; }
        .opt-top .opt-badge { background: #1CB0F6; }
        .opt-bot .opt-badge { background: #FF4B4B; }
        .opt-text { font-weight: 800; font-size: 1rem; color: #333; text-align: left; }
        
        @keyframes floatQ { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -10px); } }
        @keyframes slideDown { 0% { top: -50px; opacity: 0; } 100% { top: 100px; opacity: 1; } }

        .physics-container { position: absolute; inset: 0; z-index: 5; }

        .player-kite {
          position: absolute; left: 120px; top: 0; display: flex; flex-direction: column; align-items: center;
          margin-left: -25px; margin-top: -25px; transform-origin: 50% 50%;
        }
        .k-emoji { font-size: 3rem; transform: rotate(15deg); filter: drop-shadow(0 4px 4px rgba(0,0,0,0.3)); }
        .k-tail { font-size: 1.5rem; transform: rotate(100deg); margin-top: -15px; margin-left: -30px; color: var(--k-color); }
        .k-name {
          background: rgba(0,0,0,0.5); color: white; font-size: 0.6rem;
          padding: 2px 6px; border-radius: 10px; font-weight: 800;
          margin-top: -5px; white-space: nowrap; border: 1.5px solid var(--k-color);
        }

        .pipes-container { position: absolute; inset: 0; pointer-events: none; }
        .pipe-wrapper { position: absolute; top: 0; bottom: 0; width: 80px; }
        .pipe {
          position: absolute; width: 100%; background: linear-gradient(90deg, #7CB342, #558B2F);
          border: 3px solid #33691E; border-radius: 10px;
        }
        .pipe-top { border-top: none; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; }
        .pipe-bottom { border-bottom: none; border-top-left-radius: 10px; border-top-right-radius: 10px; }

        .opt-label {
          position: absolute; left: -120px; width: 110px; background: rgba(255,255,255,0.9);
          border: 3px solid #1CB0F6; border-radius: 16px; padding: 10px;
          text-align: center; font-weight: 900; font-size: 0.85rem; color: #1CB0F6;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .opt-label::after {
          content: ''; position: absolute; right: -12px; top: 50%; transform: translateY(-50%);
          border-top: 8px solid transparent; border-bottom: 8px solid transparent;
          border-left: 10px solid #1CB0F6;
        }

        .dead-end-block {
          position: absolute; right: 0; width: 40px; background: #FF4B4B;
          border-left: 5px solid #C0392B; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px);
          opacity: 0; transition: opacity 0.1s;
        }
        .dead-end-block.active { opacity: 1; }

        .overlay { position: absolute; inset: 0; z-index: 50; display: flex; justify-content: center; align-items: center; flex-direction: column; }
        .dark-overlay { background: rgba(0,0,0,0.5); }
        .countdown-text { font-size: 5rem; font-weight: 900; color: white; text-shadow: 0 4px 10px rgba(0,0,0,0.5); animation: popScale 1s infinite; }
        @keyframes popScale { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }

        .gameover-overlay { background: rgba(30,30,46,0.8); }
        .go-card { background: white; padding: 40px; border-radius: 30px; text-align: center; color: #333; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .go-card h2 { font-weight: 900; margin: 15px 0 5px; font-size: 1.8rem; }
        .go-card p { color: #666; margin-bottom: 25px; }
        .reward-box { background: #FFF9E6; border: 2px dashed #FFC800; padding: 15px; border-radius: 15px; margin-bottom: 25px; }
        .reward-box span { display: block; font-size: 0.8rem; color: #666; font-weight: 700; margin-bottom: 5px; }
        .reward-amt { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 1.5rem; font-weight: 900; color: #f4c265; }
        .go-btn { background: #FF4B4B; color: white; border: none; padding: 15px 30px; border-radius: 15px; font-weight: 900; font-size: 1.1rem; cursor: pointer; box-shadow: 0 5px 0 #D32F2F; transition: all 0.2s; }
        .go-btn:active { transform: translateY(5px); box-shadow: 0 0 0 #D32F2F; }

      `}</style>
    </div>
  );
}
