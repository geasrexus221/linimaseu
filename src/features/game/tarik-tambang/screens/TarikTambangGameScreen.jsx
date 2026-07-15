import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Trophy, AlertCircle, Clock, X, Zap, Settings, Volume2, Music, LogOut, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../../../store/useStore';
import { tarikTambangDuelThemes, aduCendekiawanItems } from '../data/tarikTambangDuelData';
import { soundManager } from '../../../../utils/SoundManager';
import CardBurningOverlay from '../../jelajah-nusantara/components/hud/CardBurningOverlay';
import AduCendekiawanHelpModal from '../components/hud/AduCendekiawanHelpModal';
import PodiumSVG from '../../../../assets/UI/Arena/Podium.svg';
import character1podium1 from '../../../../assets/UI/Character/character1podium1.svg';
import character1podium2 from '../../../../assets/UI/Character/character1podium2.svg';
import character1podium3 from '../../../../assets/UI/Character/character1podium3.svg';
import character1podium4 from '../../../../assets/UI/Character/character1podium4.svg';
import character1podium5 from '../../../../assets/UI/Character/character1podium5.svg';
import character1podium6 from '../../../../assets/UI/Character/character1podium6.svg';
import character2podium1 from '../../../../assets/UI/Character/character2podium1.svg';
import character2podium2 from '../../../../assets/UI/Character/character2podium2.svg';
import character2podium3 from '../../../../assets/UI/Character/character2podium3.svg';
import character2podium4 from '../../../../assets/UI/Character/character2podium4.svg';
import character2podium5 from '../../../../assets/UI/Character/character2podium5.svg';
import character2podium6 from '../../../../assets/UI/Character/character2podium6.svg';

// Constants
const MAX_SCORE = 10;

export default function TarikTambangGameScreen({ config, onBack }) {
  const { musicVolume, sfxVolume, setMusicVolume, setSfxVolume } = useStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const MAX_TIME = config.timeLimit || 20;
  const totalQuestions = config.questionCount || (config.difficulty === 'mudah' ? 10 : config.difficulty === 'normal' ? 15 : 20);

  // --- Game State ---
  const [phase, setPhase] = useState('category_intro'); // 'category_intro', 'countdown', 'prep', 'playing', 'resolving', 'gameover'
  const [introCount, setIntroCount] = useState(3);
  const [playerHP, setPlayerHP] = useState(10);
  const [botHP, setBotHP] = useState(10);
  const [playerMaxHP, setPlayerMaxHP] = useState(10);
  const [botMaxHP, setBotMaxHP] = useState(10);
  const [playerActionMode, setPlayerActionMode] = useState('attack'); // 'attack' or 'heal'
  const [botActionMode, setBotActionMode] = useState('attack'); // 'attack' or 'heal'
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [questions, setQuestions] = useState([]);

  const [playerAction, setPlayerAction] = useState(null); // { timeTaken, answerIdx, isCorrect, points }
  const [botAction, setBotAction] = useState(null);

  const [winner, setWinner] = useState(null); // 'player', 'bot', 'tie'
  const [playerAnimState, setPlayerAnimState] = useState('idle'); // 'idle', 'correct', 'incorrect', 'attacked'
  const [answerCount, setAnswerCount] = useState(0);
  const [botCharacterId, setBotCharacterId] = useState(() => Math.random() < 0.5 ? 1 : 2);
  const [botAnimState, setBotAnimState] = useState('idle'); // 'idle', 'correct', 'incorrect', 'attacked'

  // Bot item tracking
  const botItemIdsRef = useRef(config?.botItemIds || []);
  const botUsedItemsRef = useRef({}); // tracks which bot items have been used

  // --- Score Plaque & Floating Notifications ---
  const [playerFloatingText, setPlayerFloatingText] = useState(null); // { text, type: 'gain' | 'lose' | 'info' }
  const [botFloatingText, setBotFloatingText] = useState(null);

  // --- Item States ---
  const [activeItem, setActiveItem] = useState(null); // null, '50_50', 'double', 'shield', 'hourglass', 'magnet', 'stun', 'heal_potion', 'book_bomb', 'telescope'
  const [usedItems, setUsedItems] = useState(() => {
    const initial = { 
      '50_50': true, 
      'double': true, 
      'shield': true, 
      'hourglass': true, 
      'magnet': true, 
      'stun': true,
      'heal_potion': true,
      'book_bomb': true,
      'telescope': true
    };
    if (config && config.equippedItems) {
      config.equippedItems.forEach(id => {
        if (id === 'tt_compas') initial['50_50'] = false;
        if (id === 'tt_weight') initial['double'] = false;
        if (id === 'tt_shield') initial['shield'] = false;
        if (id === 'tt_hourglass') initial['hourglass'] = false;
        if (id === 'tt_magnet') initial['magnet'] = false;
        if (id === 'tt_stun') initial['stun'] = false;
        if (id === 'tt_heal_potion') initial['heal_potion'] = false;
        if (id === 'tt_book_bomb') initial['book_bomb'] = false;
        if (id === 'tt_telescope') initial['telescope'] = false;
      });
    }
    return initial;
  });
  const [eliminatedIndices, setEliminatedIndices] = useState([]);

  // Animation states for next-turn card activation
  const [queuedItem, setQueuedItem] = useState(null);
  const [isShowingCardAnim, setIsShowingCardAnim] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const botTimerRef = useRef(null);

  // Refs for async callbacks
  const phaseRef = useRef(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const qIndexRef = useRef(qIndex);
  useEffect(() => { qIndexRef.current = qIndex; }, [qIndex]);

  const questionsRef = useRef(questions);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  const activeItemRef = useRef(activeItem);
  useEffect(() => { activeItemRef.current = activeItem; }, [activeItem]);

  const queuedItemRef = useRef(queuedItem);
  useEffect(() => { queuedItemRef.current = queuedItem; }, [queuedItem]);

  // Audio refs (mocked visually for now)
  const isCritical = playerHP <= 2 || botHP <= 2;

  // --- Initialization ---
  useEffect(() => {
    // Load questions based on config.theme
    const themeData = tarikTambangDuelThemes.find(t => t.id === config.theme) || tarikTambangDuelThemes[0];

    // Determine categories needed
    const categoriesNeeded = totalQuestions / 5;

    // Pick random categories
    const shuffledCats = [...(themeData.categories || [])].sort(() => 0.5 - Math.random());

    let pool = [];
    for (let i = 0; i < categoriesNeeded; i++) {
      const cat = shuffledCats[i] || themeData.categories[0];
      if (cat && cat.questions) {
        // Pick 5 random questions from this category and shuffle their options
        const catQuestions = [...cat.questions]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
          .map(q => {
            const originalOptions = [...q.options];
            const correctAnswerText = originalOptions[q.correct];
            const shuffledOptions = [...originalOptions].sort(() => 0.5 - Math.random());
            const newCorrectIdx = shuffledOptions.indexOf(correctAnswerText);

            return {
              ...q,
              options: shuffledOptions,
              correct: newCorrectIdx,
              categoryName: cat.name
            };
          });
        pool = [...pool, ...catQuestions];
      }
    }

    setQuestions(pool);
  }, [config, totalQuestions]);

  // Handle Category Intro announcement popup timer
  useEffect(() => {
    if (phase === 'category_intro') {
      const timer = setTimeout(() => {
        setPhase('countdown');
        setIntroCount(3);
      }, 2500); // Show popup for 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handle Countdown timer
  useEffect(() => {
    if (phase === 'countdown') {
      let count = 3;
      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          setIntroCount(count);
        } else if (count === 0) {
          setIntroCount('MULAI!');
        } else {
          clearInterval(interval);
          startQuestion();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // --- Timer & Bot Logic ---
  const startQuestion = () => {
    setPlayerAction(null);
    setBotAction(null);
    setTimeLeft(MAX_TIME);
    setEliminatedIndices([]);
    setActiveItem(null);
    setPlayerAnimState('idle');
    setBotAnimState('idle');

    if (timerRef.current) clearInterval(timerRef.current);
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    if (queuedItemRef.current) {
      // Find the detailed card for animation
      const itemDetails = aduCendekiawanItems.find(i => {
        if (queuedItemRef.current === '50_50') return i.id === 'tt_compas';
        if (queuedItemRef.current === 'double') return i.id === 'tt_weight';
        if (queuedItemRef.current === 'shield') return i.id === 'tt_shield';
        if (queuedItemRef.current === 'hourglass') return i.id === 'tt_hourglass';
        if (queuedItemRef.current === 'magnet') return i.id === 'tt_magnet';
        if (queuedItemRef.current === 'stun') return i.id === 'tt_stun';
        if (queuedItemRef.current === 'heal_potion') return i.id === 'tt_heal_potion';
        if (queuedItemRef.current === 'book_bomb') return i.id === 'tt_book_bomb';
        if (queuedItemRef.current === 'telescope') return i.id === 'tt_telescope';
        return false;
      });

      setIsShowingCardAnim(true);
      setActiveCard(itemDetails || { name: queuedItemRef.current, icon: '🎴', color: '#1CB0F6' });
      setPhase('playing');
      soundManager.play('chest_open', 0.6); // 🔊 Kartu aksi reveal!

      // Play reveal animation for 2 seconds before starting the timer & player interaction
      setTimeout(() => {
        setIsShowingCardAnim(false);
        setActiveCard(null);

        const activeId = queuedItemRef.current;
        setActiveItem(activeId);

        // Apply instant card effects (like 50:50)
        if (activeId === '50_50') {
          const currentQ = questionsRef.current[qIndexRef.current];
          const correctIdx = currentQ.correct;
          const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== correctIdx);
          const toEliminate = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
          setEliminatedIndices(toEliminate);
        } else if (activeId === 'heal_potion') {
          setPlayerHP(prev => Math.min(playerMaxHP, prev + 3));
          setPlayerFloatingText({ text: '🧪 +3 HP', type: 'gain' });
          setTimeout(() => setPlayerFloatingText(null), 1800);
        } else if (activeId === 'book_bomb') {
          setBotHP(prev => Math.max(0, prev - 3));
          setBotFloatingText({ text: '💣 -3 HP', type: 'lose' });
          setTimeout(() => setBotFloatingText(null), 1800);
        }

        startTimeRef.current = Date.now();

        // Start countdown timer
        let ticks = 0;
        timerRef.current = setInterval(() => {
          if (activeItemRef.current === 'hourglass') {
            ticks++;
            if (ticks % 2 === 0) {
              setTimeLeft(prev => prev - 1);
            }
          } else {
            setTimeLeft(prev => prev - 1);
          }
        }, 1000);

        scheduleBotAnswer(activeId);
        setQueuedItem(null);
      }, 2000);

    } else {
      setPhase('playing');
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      scheduleBotAnswer(null);
    }
  };

  // Watch for timeout independently
  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0 && !isShowingCardAnim) {
      if (timerRef.current) clearInterval(timerRef.current);
      handleTimeOut();
    }
  }, [timeLeft, phase, isShowingCardAnim]);

  const scheduleBotAnswer = (itemOverride) => {
    // Difficulty presets scaled for 15s timer
    let reactionTimeMin, reactionTimeMax, accuracy;
    if (config.difficulty === 'mudah') {
      reactionTimeMin = 7000; reactionTimeMax = 14000; accuracy = 0.5;
    } else if (config.difficulty === 'normal') {
      reactionTimeMin = 4000; reactionTimeMax = 10000; accuracy = 0.75;
    } else {
      reactionTimeMin = 1500; reactionTimeMax = 6000; accuracy = 0.9;
    }

    let reactTime = Math.floor(Math.random() * (reactionTimeMax - reactionTimeMin)) + reactionTimeMin;

    const currentItem = itemOverride || activeItemRef.current;
    if (currentItem === 'stun') {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
      setBotAction({ timeTaken: MAX_TIME, answerIdx: -1, isCorrect: false, points: 0 });
      return;
    }

    // Magnet Pengacau (Bot Delay): delay bot response by 4 seconds (4000ms)
    if (currentItem === 'magnet') {
      reactTime += 4000;
    }

    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    botTimerRef.current = setTimeout(() => {
      if (phaseRef.current === 'playing') {
        const isCorrect = Math.random() < accuracy;
        const currentQ = questionsRef.current[qIndexRef.current];
        const ansIdx = isCorrect ? currentQ.correct : (currentQ.correct + 1) % 4; // Mock wrong answer
        const timeTaken = reactTime / 1000;
        const ratio = Math.max(0, 1 - (timeTaken / MAX_TIME));

        let points = 0;
        if (isCorrect) {
          if (ratio >= 0.71) points = 3;
          else if (ratio >= 0.51) points = 2;
          else points = 1;
        } else {
          points = -1;
        }

        // --- Bot Item Usage Logic ---
        // Bot picks an unused item from its pool and applies it
        const availableBotItems = (botItemIdsRef.current || []).filter(id => !botUsedItemsRef.current[id]);
        let botActivatedItem = null;
        if (availableBotItems.length > 0) {
          const shouldUseItem =
            config.difficulty === 'sulit' ? true :   // Cendekiawan: always use if available
            config.difficulty === 'normal' ? Math.random() < 0.4 : // Normal: 40% chance
            false; // Santai: never use

          if (shouldUseItem) {
            // Cendekiawan picks strategically, Normal picks randomly
            let chosenItemId;
            if (config.difficulty === 'sulit') {
              // Prefer offensive items when winning, defensive when losing
              const offensiveItems = availableBotItems.filter(id => ['tt_book_bomb', 'tt_stun', 'tt_magnet', 'tt_weight'].includes(id));
              const defensiveItems = availableBotItems.filter(id => ['tt_heal_potion', 'tt_shield'].includes(id));
              const botIsLosing = botHP < playerHP;
              const pool = botIsLosing && defensiveItems.length > 0 ? defensiveItems : (offensiveItems.length > 0 ? offensiveItems : availableBotItems);
              chosenItemId = pool[Math.floor(Math.random() * pool.length)];
            } else {
              chosenItemId = availableBotItems[Math.floor(Math.random() * availableBotItems.length)];
            }
            if (chosenItemId) {
              botUsedItemsRef.current[chosenItemId] = true;
              botActivatedItem = chosenItemId;
            }
          }
        }

        // --- Bot mode strategy ---
        let botMode = 'attack';
        if (config.difficulty === 'sulit') {
          // Cendekiawan: heal when HP < 50%, attack when ahead
          botMode = (botHP <= botMaxHP * 0.5) ? 'heal' : 'attack';
        } else {
          // Normal/Santai: 30% heal if damaged
          if (botHP < botMaxHP && Math.random() < 0.3) botMode = 'heal';
        }

        setBotAction({ timeTaken, answerIdx: ansIdx, isCorrect, points, mode: botMode, activatedItem: botActivatedItem });
        setBotAnimState('answered');
      }
    }, reactTime);
  };

  // --- Handling Answers & Items ---
  const handleUseItem = (itemId) => {
    if (phase !== 'playing' || playerAction) return;

    // If clicking the currently queued item, cancel/unselect it (refund)
    if (queuedItem === itemId) {
      setQueuedItem(null);
      setUsedItems(prev => ({ ...prev, [itemId]: false }));
      soundManager.play('click', 0.4);
      return;
    }

    // If clicking a different item, refund previous item and queue the new one
    const prevQueued = queuedItem;
    setQueuedItem(itemId);
    setUsedItems(prev => {
      const updated = { ...prev };
      if (prevQueued) {
        updated[prevQueued] = false;
      }
      updated[itemId] = true;
      return updated;
    });
    soundManager.play('click', 0.5); // 🔊 Kartu dipilih
  };

  const changePlayerMode = (mode) => {
    setPlayerActionMode(mode);
    if (playerAction) {
      setPlayerAction(prev => ({
        ...prev,
        mode: mode
      }));
    }
  };

  const handlePlayerAnswer = (ansIdx) => {
    if (phase !== 'playing' || isShowingCardAnim) return;

    // Play squash SFX on answer select/change
    soundManager.play('squash');

    // Increment click count to trigger key change and replay animation
    setAnswerCount(prev => prev + 1);

    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    const ratio = Math.max(0, 1 - (timeTaken / MAX_TIME));
    const isCorrect = ansIdx === questions[qIndex].correct;

    let points = 0;
    if (isCorrect) {
      if (ratio >= 0.71) points = 3;
      else if (ratio >= 0.51) points = 2;
      else points = 1;

      // Apply Anchor (Double Weight) Item Card!
      if (activeItem === 'double') {
        points = points * 2;
      }
    } else {
      points = -1;
    }

    setPlayerAction({ timeTaken, answerIdx: ansIdx, isCorrect, points, mode: playerActionMode });
    setPlayerAnimState('answered');
  };

  const handleTimeOut = () => {
    // Force missing actions to timeout penalty
    setPlayerAction(prev => {
      if (!prev) return { timeTaken: 15, answerIdx: -1, isCorrect: false, points: -1, mode: playerActionMode };
      return prev;
    });
    setBotAction(prev => {
      if (!prev) return { timeTaken: 15, answerIdx: -1, isCorrect: false, points: -1, mode: 'attack' };
      return prev;
    });
  };

  // Resolve when both have acted — SEQUENTIAL REVEAL
  useEffect(() => {
    let resolveDelayId;
    if (phase === 'playing' && playerAction && botAction) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (botTimerRef.current) clearTimeout(botTimerRef.current);

      // Jeda 800ms sebelum setPhase('resolving') agar animasi menjawab pemain terakhir selesai dimainkan
      resolveDelayId = setTimeout(() => {
        setPhase('resolving');

        // Determine who answered first (smaller timeTaken)
        const playerFirst = playerAction.timeTaken <= botAction.timeTaken;

        // Pre-calculate all HP changes ONCE up front (before any setState delays) in correct order
        let nextPlayerHP = playerHP;
        let nextBotHP = botHP;

        // Apply passive character/bot bonuses
        let finalPlayerPoints = playerAction.points;
        if (playerAction.isCorrect) {
          if (config.characterId === 1 && playerAction.mode === 'attack') finalPlayerPoints += 1;
          else if (config.characterId === 2 && playerAction.mode === 'heal') finalPlayerPoints += 1;
        }

        let finalBotPoints = botAction.points;
        if (botAction.isCorrect) {
          if (botCharacterId === 1 && botAction.mode === 'attack') finalBotPoints += 1;
          else if (botCharacterId === 2 && botAction.mode === 'heal') finalBotPoints += 1;
        }

        let playerFloatPayload = null;
        let botFloatPayload = null;

        if (playerFirst) {
          // Pre-compute Player first
          if (playerAction.isCorrect) {
            if (playerAction.mode === 'attack') {
              nextBotHP = Math.max(0, nextBotHP - finalPlayerPoints);
              playerFloatPayload = { text: `⚔️ +${finalPlayerPoints}`, type: 'gain' };
            } else {
              nextPlayerHP = Math.min(playerMaxHP, nextPlayerHP + finalPlayerPoints);
              playerFloatPayload = { text: `💚 +${finalPlayerPoints}`, type: 'gain' };
            }
          } else {
            nextPlayerHP = Math.max(0, nextPlayerHP - 1);
            playerFloatPayload = { text: '-1', type: 'lose' };
          }

          // Pre-compute Bot second
          if (activeItem === 'stun') {
            botFloatPayload = { text: '⚡ Stun', type: 'info' };
          } else if (botAction.isCorrect) {
            if (activeItem === 'shield' && !playerAction.isCorrect) {
              playerFloatPayload = { text: '🛡️ Block', type: 'info' };
              botFloatPayload = { text: 'Blocked', type: 'lose' };
            } else {
              if (botAction.mode === 'attack') {
                nextPlayerHP = Math.max(0, nextPlayerHP - finalBotPoints);
                botFloatPayload = { text: `⚔️ +${finalBotPoints}`, type: 'gain' };
              } else {
                nextBotHP = Math.min(botMaxHP, nextBotHP + finalBotPoints);
                botFloatPayload = { text: `💚 +${finalBotPoints}`, type: 'gain' };
              }
            }
          } else {
            nextBotHP = Math.max(0, nextBotHP - 1);
            botFloatPayload = { text: '-1', type: 'lose' };
          }
        } else {
          // Pre-compute Bot first
          if (activeItem === 'stun') {
            botFloatPayload = { text: '⚡ Stun', type: 'info' };
          } else if (botAction.isCorrect) {
            if (activeItem === 'shield' && !playerAction.isCorrect) {
              playerFloatPayload = { text: '🛡️ Block', type: 'info' };
              botFloatPayload = { text: 'Blocked', type: 'lose' };
            } else {
              if (botAction.mode === 'attack') {
                nextPlayerHP = Math.max(0, nextPlayerHP - finalBotPoints);
                botFloatPayload = { text: `⚔️ +${finalBotPoints}`, type: 'gain' };
              } else {
                nextBotHP = Math.min(botMaxHP, nextBotHP + finalBotPoints);
                botFloatPayload = { text: `💚 +${finalBotPoints}`, type: 'gain' };
              }
            }
          } else {
            nextBotHP = Math.max(0, nextBotHP - 1);
            botFloatPayload = { text: '-1', type: 'lose' };
          }

          // Pre-compute Player second
          if (playerAction.isCorrect) {
            if (playerAction.mode === 'attack') {
              nextBotHP = Math.max(0, nextBotHP - finalPlayerPoints);
              playerFloatPayload = { text: `⚔️ +${finalPlayerPoints}`, type: 'gain' };
            } else {
              nextPlayerHP = Math.min(playerMaxHP, nextPlayerHP + finalPlayerPoints);
              playerFloatPayload = { text: `💚 +${finalPlayerPoints}`, type: 'gain' };
            }
          } else {
            nextPlayerHP = Math.max(0, nextPlayerHP - 1);
            playerFloatPayload = { text: '-1', type: 'lose' };
          }
        }

        // ─────────────────────────────────────────
        // STEP 1 (t=0): Brief dramatic pause — both idle
        // ─────────────────────────────────────────
        setPlayerAnimState('idle');
        setBotAnimState('idle');

        if (playerFirst) {
          // ─────────────────────────────────────────
          // PLAYER RESOLVES FIRST, THEN BOT
          // ─────────────────────────────────────────
          
          // STEP 2 (t=500ms): Player's OWN reaction
          setTimeout(() => {
            if (playerAction.isCorrect) {
              setPlayerAnimState('correct');
              soundManager.play('correct', 0.65);
            } else {
              setPlayerAnimState('incorrect');
              soundManager.play('wrong', 0.5);
            }
            if (playerFloatPayload) setPlayerFloatingText(playerFloatPayload);
          }, 500);

          // STEP 2b (t=1500ms): Bot reacts to Player's action + HP Update
          setTimeout(() => {
            const playerAttackedBot = playerAction.isCorrect && playerAction.mode === 'attack';
            const stunHit = activeItem === 'stun';
            if (playerAttackedBot || stunHit) {
              setBotAnimState('attacked');
              soundManager.play('hit');
            }
            if (playerAction.isCorrect && playerAction.mode === 'heal') {
              setPlayerAnimState('healing');
              soundManager.play('heal', 0.6);
            }

            // Apply Player's action HP change to state immediately
            if (playerAction.isCorrect) {
              if (playerAction.mode === 'attack') {
                setBotHP(prev => Math.max(0, prev - finalPlayerPoints));
              } else {
                setPlayerHP(prev => Math.min(playerMaxHP, prev + finalPlayerPoints));
              }
            } else {
              setPlayerHP(prev => Math.max(0, prev - 1));
            }
          }, 1500);

          // STEP 3 (t=2700ms): Bot's OWN reaction
          setTimeout(() => {
            if (activeItem === 'stun') {
              setBotAnimState('attacked');
            } else if (botAction.isCorrect) {
              setBotAnimState('correct');
              soundManager.play('correct', 0.4);
            } else {
              setBotAnimState('incorrect');
              soundManager.play('wrong', 0.35);
            }
            if (botFloatPayload) setBotFloatingText(botFloatPayload);
          }, 2700);

          // STEP 3b (t=3700ms): Player reacts to Bot's action + HP Update
          setTimeout(() => {
            const botAttackedPlayer = botAction.isCorrect && botAction.mode === 'attack' && activeItem !== 'shield';
            if (botAttackedPlayer) {
              setPlayerAnimState('attacked');
              soundManager.play('hit');
            }
            if (botAction.isCorrect && botAction.mode === 'heal' && activeItem !== 'stun') {
              setBotAnimState('healing');
              soundManager.play('heal', 0.4);
            }

            // Apply Bot's action HP change to state immediately
            if (activeItem !== 'stun') {
              if (botAction.isCorrect) {
                if (activeItem === 'shield' && !playerAction.isCorrect) {
                  // Blocked
                } else {
                  if (botAction.mode === 'attack') {
                    setPlayerHP(prev => Math.max(0, prev - finalBotPoints));
                  } else {
                    setBotHP(prev => Math.min(botMaxHP, prev + finalBotPoints));
                  }
                }
              } else {
                setBotHP(prev => Math.max(0, prev - 1));
              }
            }
          }, 3700);

        } else {
          // ─────────────────────────────────────────
          // BOT RESOLVES FIRST, THEN PLAYER
          // ─────────────────────────────────────────

          // STEP 2 (t=500ms): Bot's OWN reaction
          setTimeout(() => {
            if (activeItem === 'stun') {
              setBotAnimState('attacked');
            } else if (botAction.isCorrect) {
              setBotAnimState('correct');
              soundManager.play('correct', 0.4);
            } else {
              setBotAnimState('incorrect');
              soundManager.play('wrong', 0.35);
            }
            if (botFloatPayload) setBotFloatingText(botFloatPayload);
          }, 500);

          // STEP 2b (t=1500ms): Player reacts to Bot's action + HP Update
          setTimeout(() => {
            const botAttackedPlayer = botAction.isCorrect && botAction.mode === 'attack' && activeItem !== 'shield';
            if (botAttackedPlayer) {
              setPlayerAnimState('attacked');
              soundManager.play('hit');
            }
            if (botAction.isCorrect && botAction.mode === 'heal' && activeItem !== 'stun') {
              setBotAnimState('healing');
              soundManager.play('heal', 0.4);
            }

            // Apply Bot's action HP change to state immediately
            if (activeItem !== 'stun') {
              if (botAction.isCorrect) {
                if (activeItem === 'shield' && !playerAction.isCorrect) {
                  // Blocked
                } else {
                  if (botAction.mode === 'attack') {
                    setPlayerHP(prev => Math.max(0, prev - finalBotPoints));
                  } else {
                    setBotHP(prev => Math.min(botMaxHP, prev + finalBotPoints));
                  }
                }
              } else {
                setBotHP(prev => Math.max(0, prev - 1));
              }
            }
          }, 1500);

          // STEP 3 (t=2700ms): Player's OWN reaction
          setTimeout(() => {
            if (playerAction.isCorrect) {
              setPlayerAnimState('correct');
              soundManager.play('correct', 0.65);
            } else {
              setPlayerAnimState('incorrect');
              soundManager.play('wrong', 0.5);
            }
            if (playerFloatPayload) setPlayerFloatingText(playerFloatPayload);
          }, 2700);

          // STEP 3b (t=3700ms): Bot reacts to Player's action + HP Update
          setTimeout(() => {
            const playerAttackedBot = playerAction.isCorrect && playerAction.mode === 'attack';
            const stunHit = activeItem === 'stun';
            if (playerAttackedBot || stunHit) {
              setBotAnimState('attacked');
              soundManager.play('hit');
            }
            if (playerAction.isCorrect && playerAction.mode === 'heal') {
              setPlayerAnimState('healing');
              soundManager.play('heal', 0.6);
            }

            // Apply Player's action HP change to state immediately
            if (playerAction.isCorrect) {
              if (playerAction.mode === 'attack') {
                setBotHP(prev => Math.max(0, prev - finalPlayerPoints));
              } else {
                setPlayerHP(prev => Math.min(playerMaxHP, prev + finalPlayerPoints));
              }
            } else {
              setPlayerHP(prev => Math.max(0, prev - 1));
            }
          }, 3700);
        }

        // ─────────────────────────────────────────
        // STEP 4 (t=4800ms): HP bars update + clear floats
        // ─────────────────────────────────────────
        setTimeout(() => {
          setPlayerHP(nextPlayerHP);
          setBotHP(nextBotHP);
          setPlayerFloatingText(null);
          setBotFloatingText(null);
        }, 4800);

        // ─────────────────────────────────────────
        // STEP 5 (t=5200ms): Advance to next question
        // ─────────────────────────────────────────
        setTimeout(() => {
          // Check Win Condition
          if (nextPlayerHP === 0 && nextBotHP === 0) {
            setWinner('tie');
            setPhase('gameover');
          } else if (nextPlayerHP === 0) {
            setWinner('bot');
            setPhase('gameover');
          } else if (nextBotHP === 0) {
            setWinner('player');
            setPhase('gameover');
          } else {
            // Next Question or End of Questions
            if (qIndex + 1 >= totalQuestions) {
              if (nextPlayerHP > nextBotHP) {
                setWinner('player');
                setPhase('gameover');
              } else if (nextBotHP > nextPlayerHP) {
                setWinner('bot');
                setPhase('gameover');
              } else {
                setWinner('tie');
                setPhase('gameover');
              }
            } else {
              const nextIdx = qIndex + 1;
              setQIndex(nextIdx);
              if (nextIdx % 5 === 0) {
                setPhase('category_intro');
              } else {
                startQuestion();
              }
            }
          }
        }, 5200);
      }, 800);
    }
    return () => {
      if (resolveDelayId) clearTimeout(resolveDelayId);
    };
  }, [playerAction, botAction, phase]);

  // --- Rendering Helpers ---
  const currentQ = questions[qIndex];

  const getRopeOffset = () => {
    return 0;
  };

  return (
    <div className={`game-container ${isCritical ? 'critical-danger' : ''}`}>
      {isShowingCardAnim && <CardBurningOverlay activeCard={activeCard} />}
      {/* Classroom Background */}
      <div className="classroom-bg">
        <div className="chalkboard">
          {/* Gantungan Dinding */}
          <div className="chalkboard-hanger left" />
          <div className="chalkboard-hanger right" />

          {questions[qIndex] && (
            <>
              <div className="chalkboard-title">{questions[qIndex].categoryName}</div>
              <div className="chalkboard-chalk-info">
                <span className="chalk-soal">Soal {qIndex + 1} / {totalQuestions}</span>
              </div>
            </>
          )}

          {/* Tatakan Kapur & Penghapus */}
          <div className="chalk-tray">
            <span className="chalk-eraser" />
            <span className="chalk white-chalk" />
            <span className="chalk pink-chalk" />
          </div>
        </div>
        <div className="window-light" />
      </div>

      {/* Settings Button */}
      <button className="quit-btn" onClick={() => setSettingsOpen(true)}><Settings size={20} /></button>

      {/* Help Button */}
      <button className="game-help-btn" onClick={() => setHelpOpen(true)} title="Panduan"><HelpCircle size={20} /></button>

      {/* Help Modal */}
      <AduCendekiawanHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Settings Modal Popup */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="settings-overlay">
            <motion.div 
              className="settings-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="settings-header">
                <div className="title">
                  <Settings size={20} />
                  <h2>PENGATURAN</h2>
                </div>
                <button className="close-x" onClick={() => setSettingsOpen(false)}><X size={20} /></button>
              </div>

              <div className="settings-body">
                {/* Music Volume Slider */}
                <div className="setting-row">
                  <div className="label">
                    <Music size={18} />
                    <span>Musik ({Math.round(musicVolume * 100)}%)</span>
                  </div>
                  <input 
                    type="range" 
                    className="setting-slider" 
                    min="0" max="1" step="0.01"
                    value={musicVolume} 
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  />
                </div>

                {/* Sound Effect Slider */}
                <div className="setting-row">
                  <div className="label">
                    <Volume2 size={18} />
                    <span>Efek Suara ({Math.round(sfxVolume * 100)}%)</span>
                  </div>
                  <input 
                    type="range" 
                    className="setting-slider" 
                    min="0" max="1" step="0.01"
                    value={sfxVolume} 
                    onChange={(e) => {
                      setSfxVolume(parseFloat(e.target.value));
                      soundManager.play('click', 0.4);
                    }}
                  />
                </div>

                <div className="divider" />

                {/* Surrender Button */}
                <button className="surrender-btn" onClick={() => {
                  setSettingsOpen(false);
                  onBack();
                }}>
                  <LogOut size={18} />
                  <span>MENYERAH</span>
                </button>
                <p className="surrender-hint">Keluar ke menu utama dan batalkan permainan saat ini.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* === ARENA: Duel Stage === */}
      <div className="arena-section">
        {/* Left Podium (Player) */}
        <div className="podium player-podium">
          <div 
            key={playerAnimState === 'answered' ? `answered-${answerCount}` : playerAnimState}
            className={`character player-char ${
              playerAnimState === 'idle' ? 'char-stretch-idle' :
              (playerAnimState === 'correct' || playerAnimState === 'healing') ? 'char-correct-pop' :
              playerAnimState === 'answered' ? 'char-stretch-pop' :
              'char-hit-shake'
            }`}
          >
            <div className="char-name">Kamu</div>
            {config.characterId === 1 ? (
              <img
                src={
                  playerAnimState === 'correct' ? character1podium2 :
                    playerAnimState === 'incorrect' ? character1podium3 :
                      playerAnimState === 'attacked' ? character1podium4 :
                        playerAnimState === 'answered' ? character1podium5 :
                          playerAnimState === 'healing' ? character1podium6 :
                            character1podium1
                }
                alt="Karakter 1"
                className={`char-podium-img ${playerAnimState} ${
                  (playerAnimState === 'incorrect' || playerAnimState === 'attacked') ? 'char-hit-red-flash' : ''
                } ${
                  playerAnimState === 'healing' ? 'char-heal-green-flash' : ''
                }`}
              />
            ) : config.characterId === 2 ? (
              <img
                src={
                  playerAnimState === 'correct' ? character2podium2 :
                    playerAnimState === 'incorrect' ? character2podium3 :
                      playerAnimState === 'attacked' ? character2podium4 :
                        playerAnimState === 'answered' ? character2podium5 :
                          playerAnimState === 'healing' ? character2podium6 :
                            character2podium1
                }
                alt="Karakter 2"
                className={`char-podium-img ${playerAnimState} ${
                  (playerAnimState === 'incorrect' || playerAnimState === 'attacked') ? 'char-hit-red-flash' : ''
                } ${
                  playerAnimState === 'healing' ? 'char-heal-green-flash' : ''
                }`}
              />
            ) : (
              <div className={`char-bubble player-bubble ${
                (playerAnimState === 'incorrect' || playerAnimState === 'attacked') ? 'char-hit-red-flash' : ''
              } ${
                playerAnimState === 'healing' ? 'char-heal-green-flash' : ''
              }`}>👩‍🚀</div>
            )}
          </div>
          <div className="podium-platform-wrapper">
            <img src={PodiumSVG} alt="Podium" className="podium-svg" />
          </div>
        </div>

        {/* Right Podium (Bot) */}
        <div className="podium bot-podium">
          <div className={`character bot-char ${
            botAnimState === 'idle' ? 'char-stretch-idle' :
            (botAnimState === 'correct' || botAnimState === 'healing') ? 'char-correct-pop' :
            'char-hit-shake'
          }`}>
            <div className="char-name">Lawan</div>
            {botCharacterId === 1 ? (
              <img
                src={
                  botAnimState === 'correct' ? character1podium2 :
                    botAnimState === 'incorrect' ? character1podium3 :
                      botAnimState === 'attacked' ? character1podium4 :
                        botAnimState === 'answered' ? character1podium5 :
                          botAnimState === 'healing' ? character1podium6 :
                            character1podium1
                }
                alt="Lawan"
                className={`char-podium-img bot-char-flipped ${botAnimState} ${
                  (botAnimState === 'incorrect' || botAnimState === 'attacked') ? 'char-hit-red-flash' : ''
                } ${
                  botAnimState === 'healing' ? 'char-heal-green-flash' : ''
                }`}
              />
            ) : botCharacterId === 2 ? (
              <img
                src={
                  botAnimState === 'correct' ? character2podium2 :
                    botAnimState === 'incorrect' ? character2podium3 :
                      botAnimState === 'attacked' ? character2podium4 :
                        botAnimState === 'answered' ? character2podium5 :
                          botAnimState === 'healing' ? character2podium6 :
                            character2podium1
                }
                alt="Lawan"
                className={`char-podium-img bot-char-flipped ${botAnimState} ${
                  (botAnimState === 'incorrect' || botAnimState === 'attacked') ? 'char-hit-red-flash' : ''
                } ${
                  botAnimState === 'healing' ? 'char-heal-green-flash' : ''
                }`}
              />
            ) : (
              <div className={`char-bubble bot-bubble ${
                (botAnimState === 'incorrect' || botAnimState === 'attacked') ? 'char-hit-red-flash' : ''
              } ${
                botAnimState === 'healing' ? 'char-heal-green-flash' : ''
              }`}>👩‍🚀</div>
            )}
          </div>
          <div className="podium-platform-wrapper">
            <img src={PodiumSVG} alt="Podium" className="podium-svg" />
          </div>
        </div>
      </div>

      {/* Fighting Game Style HP Bar Container */}
      <div className="hp-fighting-container">
        {/* Player HP Bar */}
        <div className="hp-bar-side player-side">
          <div className="hp-label-row">
            <span className="hp-side-name">Kamu</span>
            <span className="hp-side-val">{playerHP}/{playerMaxHP} HP</span>
          </div>
          <div className="hp-bar-outer">
            <div
              className="hp-bar-inner player"
              style={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
            />
          </div>
          {playerFloatingText && (
            <div className={`hp-floating-score player ${playerFloatingText.type}`}>
              {playerFloatingText.text}
            </div>
          )}
        </div>

        {/* Center Badge / Stopwatch Timer */}
        <div className={`clash-vs-badge stopwatch-timer ${timeLeft <= 3 ? 'stopwatch-danger' : ''}`}>
          <span>{timeLeft}s</span>
          {phase === 'playing' && playerAction && !botAction && (
            <div className="hp-waiting-bubble">
              Menunggu lawan...
            </div>
          )}
          {phase === 'resolving' && playerAction && botAction && (
            <div className="hp-resolution-bubble">
              <span>Kamu: {playerAction.mode === 'attack' ? '⚔️' : '💚'} {playerAction.isCorrect ? "✅" : "❌"}</span>
              <span className="bubble-divider">|</span>
              <span>Lawan: {botAction.mode === 'attack' ? '⚔️' : '💚'} {botAction.isCorrect ? "✅" : "❌"}</span>
            </div>
          )}
        </div>

        {/* Bot HP Bar */}
        <div className="hp-bar-side bot-side">
          <div className="hp-label-row">
            <span className="hp-side-val">{botHP}/{botMaxHP} HP</span>
            <span className="hp-side-name">Lawan</span>
          </div>
          <div className="hp-bar-outer">
            <div
              className="hp-bar-inner bot"
              style={{ width: `${(botHP / botMaxHP) * 100}%` }}
            />
          </div>
          {botFloatingText && (
            <div className={`hp-floating-score bot ${botFloatingText.type}`}>
              {botFloatingText.text}
            </div>
          )}
        </div>
      </div>

      {/* === QUIZ PANEL === */}
      {(phase === 'playing' || phase === 'resolving') && currentQ && (
        <div className="quiz-panel animate-slide-up">
          {/* Timer Bar */}
          <div className="timer-wrapper">
            <div
              className={`timer-bar ${timeLeft / MAX_TIME > 0.7 ? 'pts-3-bar' :
                timeLeft / MAX_TIME > 0.5 ? 'pts-2-bar' : 'pts-1-bar'
                }`}
              style={{
                width: `${(timeLeft / MAX_TIME) * 100}%`,
                transition: 'width 1s linear'
              }}
            />
            {/* Zone Dividers */}
            <div className="timer-divider div-50" />
            <div className="timer-divider div-70" />
          </div>

          {/* Speed Points Indicator Legend */}
          <div className="timer-points-legend">
            <span className={`legend-segment pts-1 ${timeLeft / MAX_TIME <= 0.5 ? 'active' : ''}`}>
              1+
            </span>
            <span className={`legend-segment pts-2 ${(timeLeft / MAX_TIME > 0.5 && timeLeft / MAX_TIME <= 0.7) ? 'active' : ''}`}>
              2+
            </span>
            <span className={`legend-segment pts-3 ${timeLeft / MAX_TIME > 0.7 ? 'active' : ''}`}>
              3+
            </span>
          </div>

          {/* Question */}
          <div className="question-box">
            <h2>{currentQ.text}</h2>
            {activeItem && (
              <div className="active-item-badge animate-pulse">
                Kartu Aktif: {
                  activeItem === '50_50' ? '🧭 Kompas' :
                  activeItem === 'double' ? '⚓ Pemberat' :
                  activeItem === 'shield' ? '🛡️ Tameng' :
                  activeItem === 'hourglass' ? '⏳ Jam Pasir' :
                  activeItem === 'magnet' ? '🧲 Magnet Pengacau' :
                  activeItem === 'stun' ? '⚡ Palu Petir' :
                  activeItem === 'heal_potion' ? '🧪 Ramuan Ajaib' :
                  activeItem === 'book_bomb' ? '💣 Bom Buku' :
                  '🔭 Teropong Bintang'
                }
              </div>
            )}
          </div>

          {/* Action Mode Selector (Always visible, disabled once answered) */}
          <div className="action-mode-selector">
            <button
              className={`action-mode-btn attack ${playerActionMode === 'attack' ? 'active' : ''}`}
              onClick={() => changePlayerMode('attack')}
              disabled={phase !== 'playing'}
            >
              ⚔️ SERANG
            </button>
            <button
              className={`action-mode-btn heal ${playerActionMode === 'heal' ? 'active' : ''}`}
              onClick={() => changePlayerMode('heal')}
              disabled={phase !== 'playing'}
            >
              💚 PULIHKAN
            </button>
          </div>

          {/* Answer Options */}
          <div className="options-grid">
            {currentQ.options.map((opt, idx) => {
              const isEliminated = eliminatedIndices.includes(idx);
              let btnClass = 'opt-btn';
              if (phase === 'resolving') {
                if (idx === currentQ.correct) btnClass += ' correct';
                else if (playerAction?.answerIdx === idx) btnClass += ' wrong';
              } else {
                if (playerAction?.answerIdx === idx) {
                  btnClass += ' selected';
                }
                if (activeItem === 'telescope' && idx === currentQ.correct) {
                  btnClass += ' telescope-highlight';
                }
              }

              return (
                <button
                  key={idx}
                  className={btnClass}
                  style={{ visibility: isEliminated ? 'hidden' : 'visible' }}
                  onClick={() => handlePlayerAnswer(idx)}
                  disabled={phase !== 'playing' || isEliminated || isShowingCardAnim}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Continuous Bantuan Items Area below Answer Options */}
          {config.equippedItems && config.equippedItems.length > 0 && (
            <div className="items-bar-bottom">
              <div className="items-bar-title">Gunakan Bantuan Kartu (Sekali Pakai):</div>
              <div className="items-grid">
                {config.equippedItems.map((itemId, idx) => {
                  let key = '';
                  let label = '';
                  let icon = '';

                  if (itemId === 'tt_compas') { key = '50_50'; label = 'Kompas'; icon = '🧭'; }
                  else if (itemId === 'tt_weight') { key = 'double'; label = 'Pemberat'; icon = '⚓'; }
                  else if (itemId === 'tt_shield') { key = 'shield'; label = 'Tameng'; icon = '🛡️'; }
                  else if (itemId === 'tt_hourglass') { key = 'hourglass'; label = 'Jam Pasir'; icon = '⏳'; }
                  else if (itemId === 'tt_magnet') { key = 'magnet'; label = 'Magnet'; icon = '🧲'; }
                  else if (itemId === 'tt_stun') { key = 'stun'; label = 'Palu Petir'; icon = '⚡'; }
                  else if (itemId === 'tt_heal_potion') { key = 'heal_potion'; label = 'Ramuan Ajaib'; icon = '🧪'; }
                  else if (itemId === 'tt_book_bomb') { key = 'book_bomb'; label = 'Bom Buku'; icon = '💣'; }
                  else if (itemId === 'tt_telescope') { key = 'telescope'; label = 'Teropong'; icon = '🔭'; }

                  if (!key) return null;

                  const isActive = activeItem === key;
                  const isQueued = queuedItem === key;
                  const isUsed = usedItems[key] && activeItem !== key && queuedItem !== key;

                  return (
                    <button
                      key={idx}
                      className={`item-card ${isActive ? 'active' : ''} ${isQueued ? 'queued' : ''} ${isUsed ? 'used' : ''}`}
                      onClick={() => handleUseItem(key)}
                      disabled={isUsed || playerAction !== null || phase !== 'playing'}
                    >
                      <span className="item-icon">{icon}</span>
                      <span className="item-label">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Intro Announcement Overlay */}
      {phase === 'category_intro' && questions[qIndex] && (
        <div className="category-intro-overlay">
          <div className="category-card animate-pop">
            <div className="category-tag">BABAK BARU</div>
            <h2 className="category-title">{questions[qIndex].categoryName}</h2>
            <p className="category-desc">Bersiaplah, kuis kategori ini akan segera dimulai!</p>
          </div>
        </div>
      )}

      {/* Countdown overlay */}
      {phase === 'countdown' && (
        <div className="intro-overlay">
          <div className="intro-badge">SIAP?</div>
          <h1 className="countdown-text">{introCount}</h1>
        </div>
      )}

      {/* Game Over */}
      {phase === 'gameover' && (
        <div className="gameover-overlay">


          <div className="gameover-card animate-pop">
            {/* Header banner with badge */}
            <div className="go-header-accent" style={{ background: winner === 'player' ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : winner === 'bot' ? 'linear-gradient(135deg, #FF6B6B 0%, #E60000 100%)' : 'linear-gradient(135deg, #9CA3AF 0%, #4B5563 100%)' }}>
              <div className="go-trophy-circle">
                {winner === 'player' ? <Trophy size={32} color="#FFA500" fill="#FFD700" /> : <AlertCircle size={32} color="#E60000" />}
              </div>
            </div>

            <div className="go-body">
              <h2>{winner === 'player' ? 'KAMU MENANG!' : winner === 'bot' ? 'KAMU KALAH!' : 'PERTANDINGAN SERI'}</h2>
              
              {/* Winner showcase profile */}
              <div className="winner-showcase">
                <div className={`winner-avatar-ring ${winner === 'player' ? 'gold' : winner === 'bot' ? 'red' : 'gray'}`}>
                  <div className="avatar-crop">
                    {winner === 'player' ? (
                      <img src={config.characterId === 2 ? character2podium1 : character1podium1} alt="Winner" className="avatar-sprite" />
                    ) : winner === 'bot' ? (
                      <img src={botCharacterId === 2 ? character2podium1 : character1podium1} alt="Winner" className="avatar-sprite" />
                    ) : (
                      <div className="avatar-placeholder">🤝</div>
                    )}
                  </div>
                </div>
                <div className="winner-name-label">
                  {winner === 'player' ? 'Budi / Wati (Kamu)' : winner === 'bot' ? 'Lawan' : 'Seri'}
                </div>
              </div>

              <p className="go-message-text">
                {winner === 'player' ? 'Fokus pikiranmu sangat kuat! Energi mental lawan berhasil kamu habiskan!' : winner === 'bot' ? 'Lawan terlalu tangguh, fokus pikiranmu telah habis redup!' : 'Pertandingan berakhir seimbang.'}
              </p>

              <div className="reward-box">
                ⭐ + {winner === 'player' ? '150 Bintang' : winner === 'bot' ? '10 Bintang' : '50 Bintang'}
              </div>
              <button className="go-btn" onClick={onBack}>KEMBALI KE LOBI</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .game-container {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          font-family: 'Outfit', sans-serif;
          z-index: 30; overflow: hidden;
        }
        .critical-danger { animation: pulseRed 1s infinite alternate; }
        @keyframes pulseRed {
          0% { box-shadow: inset 0 0 0px #ff4b4b; }
          100% { box-shadow: inset 0 0 50px #ff4b4b; }
        }

        .char-hit-red-flash {
          animation: redFlash 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }
        .char-heal-green-flash {
          animation: greenFlash 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        @keyframes redFlash {
          0% { filter: none; }
          15% { filter: brightness(0.65) sepia(1) hue-rotate(-50deg) saturate(8); }
          100% { filter: none; }
        }

        @keyframes greenFlash {
          0% { filter: none; }
          15% { filter: sepia(1) hue-rotate(70deg) saturate(8) brightness(1.2); }
          100% { filter: none; }
        }

        /* SQUASH & STRETCH PRESET CLASSES */
        .char-stretch-idle {
          transform-origin: bottom center;
          animation: squashStretchIdle 1.8s ease-in-out infinite alternate;
        }
        .char-stretch-pop {
          transform-origin: bottom center;
          animation: squashStretchPop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /* KEYFRAMES */
        @keyframes squashStretchIdle {
          0% { transform: scale(1, 1); }
          50% { transform: scale(1.04, 0.96); }
          100% { transform: scale(0.97, 1.03); }
        }
        @keyframes squashStretchPop {
          0% { transform: scale(1, 1); }
          15% { transform: scale(1.25, 0.75); }
          40% { transform: scale(0.85, 1.2); }
          65% { transform: scale(1.08, 0.92); }
          85% { transform: scale(0.97, 1.03); }
          100% { transform: scale(1, 1); }
        }

        .exit-warning-overlay {
          position: fixed; inset: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          font-family: 'Outfit', sans-serif;
          padding: 20px;
        }
        .exit-warning-card {
          width: 100%; max-width: 360px;
          background: #1E1E2E; border: 3px solid #2b2b3d;
          border-radius: 24px; padding: 25px;
          text-align: center; color: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes modalPop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .warning-icon-badge {
          font-size: 2.5rem; margin-bottom: 10px;
          animation: warningPulse 1s infinite alternate;
        }
        @keyframes warningPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(245,158,11,0.4)); }
          100% { transform: scale(1.1); filter: drop-shadow(0 0 12px rgba(245,158,11,0.8)); }
        }
        .exit-warning-card h3 {
          font-size: 1.25rem; font-weight: 900; color: #F59E0B; margin: 0 0 8px 0;
        }
        .exit-warning-card p {
          font-size: 0.88rem; font-weight: 700; color: #9CA3AF; line-height: 1.5; margin: 0 0 20px 0;
        }
        .exit-warning-buttons {
          display: flex; flex-direction: column; gap: 10px;
        }
        .warn-btn-cancel {
          width: 100%; height: 46px; background: #58CC02; border: none;
          border-radius: 14px; color: white; font-weight: 900; font-size: 0.9rem;
          cursor: pointer; box-shadow: 0 4px 0 #46A302; transition: transform 0.1s;
          font-family: 'Outfit', sans-serif;
        }
        .warn-btn-cancel:active { transform: translateY(2px); box-shadow: 0 2px 0 #46A302; }
        
        .warn-btn-exit {
          width: 100%; height: 46px; background: #EF4444; border: none;
          border-radius: 14px; color: white; font-weight: 900; font-size: 0.9rem;
          cursor: pointer; box-shadow: 0 4px 0 #B91C1C; transition: transform 0.1s;
          font-family: 'Outfit', sans-serif;
        }
        .warn-btn-exit:active { transform: translateY(2px); box-shadow: 0 2px 0 #B91C1C; }

        /* CLASSROOM */
        .classroom-bg {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, #F3E8EE 0%, #EADCB9 50%, #8C6A4A 100%);
          z-index: 0;
        }
        .chalkboard {
          position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
          width: 92%; max-width: 450px; height: 125px;
          background: radial-gradient(circle, #255a43 0%, #153828 100%);
          border: 7px solid #7c4f24;
          border-radius: 10px;
          box-shadow: 
            0 10px 20px rgba(0,0,0,0.25), 
            inset 0 0 15px rgba(0,0,0,0.4),
            0 0 0 2px #533314;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif;
          position: relative;
        }

        /* Chalkboard Hangers */
        .chalkboard-hanger {
          position: absolute;
          top: -15px;
          width: 10px;
          height: 15px;
          background: linear-gradient(180deg, #9ca3af 0%, #4b5563 100%);
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .chalkboard-hanger::before {
          content: '';
          position: absolute;
          top: 3px; left: 3px;
          width: 4px; height: 4px;
          background: #374151;
          border-radius: 50%;
        }
        .chalkboard-hanger.left { left: 45px; }
        .chalkboard-hanger.right { right: 45px; }

        /* Chalk Tray (Ledge) */
        .chalk-tray {
          position: absolute;
          bottom: -11px;
          left: 5%;
          width: 90%;
          height: 8px;
          background: linear-gradient(180deg, #8B5A2B 0%, #5C3D24 100%);
          border-radius: 3px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.15) inset;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 6px;
          padding-right: 25px;
          z-index: 10;
        }

        /* Eraser & Chalk Tulis */
        .chalk-eraser {
          width: 18px;
          height: 7px;
          background: #e2e8f0;
          border-top: 3px solid #374151;
          border-radius: 1px;
          transform: rotate(2deg) translateY(-2px);
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .chalk {
          width: 10px;
          height: 4px;
          border-radius: 1px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .white-chalk {
          background: #ffffff;
          transform: rotate(-12deg) translateY(-2px);
          opacity: 0.95;
        }
        .pink-chalk {
          background: #ffb6c1;
          transform: rotate(8deg) translateY(-2px);
          opacity: 0.95;
        }
        .chalkboard-title {
          font-size: 0.95rem; font-weight: 900; color: rgba(255,255,255,0.6);
          letter-spacing: 2px;
          border-bottom: 2.5px dashed rgba(255,255,255,0.25); padding-bottom: 2px;
        }
        .chalkboard-chalk-info {
          margin-top: 8px; display: flex; align-items: center; gap: 8px; 
          font-size: 0.85rem; font-weight: 800;
        }
        .chalk-soal {
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 0 2px rgba(255, 255, 255, 0.4);
        }
        .chalk-divider {
          color: rgba(255, 255, 255, 0.45);
        }
        .chalk-kategori {
          color: #93C5FD;
          text-shadow: 0 0 2px rgba(147, 197, 253, 0.4);
          background: rgba(147, 197, 253, 0.1);
          border-radius: 4px; padding: 1px 6px;
          border: 1px dashed rgba(147, 197, 253, 0.25);
        }
        .window-light {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 65%);
          pointer-events: none; z-index: 2;
        }

        .quit-btn {
          position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.25);
          backdrop-filter: blur(5px); border: 2px solid rgba(255,255,255,0.4);
          color: white; border-radius: 10px;
          width: 38px; height: 38px; display: flex; justify-content: center; align-items: center;
          cursor: pointer; z-index: 50;
        }

        .game-help-btn {
          position: absolute; top: 15px; left: 60px; background: rgba(0,0,0,0.25);
          backdrop-filter: blur(5px); border: 2px solid rgba(255,255,255,0.4);
          color: white; border-radius: 10px;
          width: 38px; height: 38px; display: flex; justify-content: center; align-items: center;
          cursor: pointer; z-index: 50;
        }

        /* ARENA (Podiums & Clash Zone) */
        .arena-section {
          position: relative; z-index: 5;
          display: flex; align-items: flex-end; justify-content: space-between;
          padding: 20px 2px 0px 2px; flex: 0 0 auto;
          background: rgba(15, 23, 42, 0.08);
          border-bottom: 4px solid #CBD5E1;
          height: 225px;
        }

        .podium {
          display: flex; flex-direction: column; align-items: center;
          width: 170px; text-align: center;
        }
        .podium-platform-wrapper {
          position: relative;
          z-index: 15;
          transform: translateY(20px);
          width: 100%;
        }

        .podium-svg {
          width: 90px;
          height: auto;
          display: block;
          margin: 0 auto;
          filter: drop-shadow(0 6px 8px rgba(0,0,0,0.15));
        }
        .bot-podium .podium-svg {
          transform: scaleX(-1);
        }
        .podium-score-plaque {
          position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, #8C6A4F 0%, #5C3D24 100%);
          border: 2px solid #F59E0B; border-radius: 6px;
          padding: 2px 8px; color: white; font-size: 0.65rem; font-weight: 900;
          box-shadow: 0 3px 0 #3D2512;
          white-space: nowrap; z-index: 20;
          font-family: 'Outfit', sans-serif;
        }

        .character {
          display: flex; flex-direction: column; align-items: center;
          margin-bottom: -100px; z-index: 10;
          position: relative;
          transform-origin: bottom center;
        }
        .char-name {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 2px solid #f59e0b;
          border-bottom: 4px solid #d97706;
          border-radius: 8px;
          padding: 4px 14px;
          color: #ffffff;
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          margin-bottom: 8px;
          z-index: 20;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .char-podium-img {
          height: 140px;
          width: auto;
          object-fit: contain;
          display: block;
          transform-origin: bottom center;
          position: relative;
          left: -30px; /* Menggeser karakter sedikit ke kanan dari pusat podium */
        }
        .char-podium-img.bot-char-flipped {
          transform: scaleX(-1);
          left: 30px; /* Di-mirror dan digeser secara berlawanan untuk keseimbangan posisi */
        }
        .char-podium-img.answered {
          transform: scale(1.1); /* 10% lebih besar */
        }
        .char-podium-img.bot-char-flipped.answered {
          transform: scale(-1.1, 1.1); /* 10% lebih besar dan terbalik horizontal */
        }

        /* Character Animations */
        .char-stretch-idle {
          animation: charStretchIdle 3.2s ease-in-out infinite;
        }
        .char-correct-pop {
          animation: charCorrectPop 0.85s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }
        .char-hit-shake {
          animation: charHitShake 0.75s ease-in-out forwards;
        }

        @keyframes charStretchIdle {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(0.97, 1.03) translateY(-4px); }
        }
        @keyframes charCorrectPop {
          0% { transform: scale(1) translateY(0); }
          15% { transform: scale(1.15, 0.82) translateY(0); }
          45% { transform: scale(0.85, 1.15) translateY(-14px); }
          75% { transform: scale(1.05, 0.95) translateY(0); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes charHitShake {
          0% { transform: scale(1) translate(0, 0); }
          15% { transform: scale(0.88, 1.12) translate(-8px, -4px); }
          30% { transform: scale(1.12, 0.88) translate(6px, 2px); }
          45% { transform: scale(0.95, 1.05) translate(-4px, -1px); }
          60% { transform: scale(1.02, 0.98) translate(2px, 0); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .hp-floating-score {
          position: absolute; top: -14px;
          font-size: 1.05rem; font-weight: 900;
          z-index: 999; pointer-events: none;
          text-shadow: 0 0 4px #000, 1px 1px 0px #000;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
        }
        .hp-floating-score.player {
          left: 10px;
          animation: hpFloatRight 1.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }
        .hp-floating-score.bot {
          right: 10px;
          animation: hpFloatLeft 1.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }
        .hp-floating-score.gain { color: #39FF14; text-shadow: 0 0 5px rgba(57, 255, 20, 0.5), 1px 1px 0 #000; }
        .hp-floating-score.lose { color: #FF4B4B; text-shadow: 0 0 5px rgba(239, 68, 68, 0.5), 1px 1px 0 #000; }
        .hp-floating-score.info { color: #F59E0B; text-shadow: 0 0 5px rgba(245, 158, 11, 0.5), 1px 1px 0 #000; }

        @keyframes hpFloatRight {
          0% { opacity: 0; transform: translate(0, 8px) scale(0.7); }
          15% { opacity: 1; transform: translate(16px, -8px) scale(1.15); }
          85% { opacity: 1; transform: translate(32px, -12px) scale(1.0); }
          100% { opacity: 0; transform: translate(44px, -22px) scale(0.85); }
        }
        @keyframes hpFloatLeft {
          0% { opacity: 0; transform: translate(0, 8px) scale(0.7); }
          15% { opacity: 1; transform: translate(-16px, -8px) scale(1.15); }
          85% { opacity: 1; transform: translate(-32px, -12px) scale(1.0); }
          100% { opacity: 0; transform: translate(-44px, -22px) scale(0.85); }
        }

        .char-bubble {
          font-size: 3.5rem; width: 80px; height: 80px; border-radius: 50%;
          display: flex; justify-content: center; align-items: center;
          border: 4px solid; box-shadow: 0 6px 14px rgba(0,0,0,0.25);
          background: white;
        }
            .hp-fighting-container {
          width: 100%; height: 60px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; background: rgba(30, 41, 59, 0.95);
          border-top: 3px solid #475569; border-bottom: 3px solid #475569; z-index: 20;
          box-shadow: inset 0 0 15px rgba(0,0,0,0.5);
        }
        .hp-bar-side {
          flex: 1; display: flex; flex-direction: column;
          position: relative;
        }
        .hp-bar-side.player-side {
          margin-right: 15px;
        }
        .hp-bar-side.bot-side {
          margin-left: 15px;
        }
        .hp-label-row {
          display: flex; justify-content: space-between; margin-bottom: 4px;
          font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 800;
        }
        .hp-side-name {
          color: #F8FAFC;
        }
        .hp-side-val {
          color: #38BDF8;
        }
        .hp-bar-outer {
          width: 100%; height: 16px; background: #334155; border-radius: 4px;
          border: 2px solid #1E293B; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
          position: relative;
        }
        .hp-bar-inner {
          height: 100%; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hp-bar-inner.player {
          background: linear-gradient(90deg, #10B981 0%, #34D399 100%);
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }
        .hp-bar-inner.bot {
          background: linear-gradient(90deg, #EF4444 0%, #F87171 100%);
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
        }
        .clash-vs-badge {
          width: 46px; height: 46px; border-radius: 50%;
          background: radial-gradient(circle, #334155 0%, #0f172a 100%);
          border: 3.5px solid #f4c265; display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 0.95rem;
          color: #f4c265; box-shadow: 0 0 10px rgba(255, 150, 0, 0.4), 0 4px 8px rgba(0,0,0,0.5);
          flex-shrink: 0;
          position: relative;
          transition: all 0.3s ease;
        }
        .clash-vs-badge.stopwatch-timer.stopwatch-danger {
          border-color: #EF4444;
          color: #EF4444;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.6), 0 4px 8px rgba(0,0,0,0.5);
          animation: stopwatchPulse 0.8s infinite alternate;
        }
        @keyframes stopwatchPulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        .hp-waiting-bubble {
          position: absolute; bottom: 56px; left: 50%; transform: translateX(-50%);
          background: #FEF3C7; border: 2.5px solid #F59E0B; border-radius: 12px;
          padding: 6px 14px; font-size: 0.78rem; font-weight: 900; color: #D97706;
          white-space: nowrap; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 999;
          transform-origin: center bottom;
        }
        .hp-waiting-bubble::after {
          content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border-width: 6px; border-style: solid; border-color: #FEF3C7 transparent transparent transparent;
        }
        .hp-waiting-bubble::before {
          content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border-width: 9px; border-style: solid; border-color: #F59E0B transparent transparent transparent;
          z-index: -1;
        }

        .hp-resolution-bubble {
          position: absolute; bottom: 56px; left: 50%; transform: translateX(-50%);
          background: #1E293B; border: 2.5px solid #E2E8F0; border-radius: 12px;
          padding: 6px 14px; font-size: 0.8rem; font-weight: 900; color: #F1F5F9;
          white-space: nowrap; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 999;
          transform-origin: center bottom;
          display: flex; align-items: center; gap: 6px;
        }
        .hp-resolution-bubble::after {
          content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border-width: 6px; border-style: solid; border-color: #1E293B transparent transparent transparent;
        }
        .hp-resolution-bubble::before {
          content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border-width: 9px; border-style: solid; border-color: #E2E8F0 transparent transparent transparent;
          z-index: -1;
        }
        .bubble-divider {
          color: #475569;
          margin: 0 4px;
        }

        @keyframes bubblePulse {
          0% { transform: translate(-50%, 0) scale(0.95); }
          100% { transform: translate(-50%, -5px) scale(1.05); }
        }

        .timer-points-legend {
          display: flex; justify-content: space-between; margin-top: 5px; padding: 0 4px;
        }
        .legend-segment {
          font-size: 0.72rem; font-weight: 800; color: #9CA3AF; transition: all 0.2s ease;
          border-radius: 4px; padding: 2px 6px; background: rgba(0,0,0,0.05);
        }
        .legend-segment.pts-3.active {
          color: #39FF14; background: rgba(57, 255, 20, 0.15); box-shadow: 0 0 5px rgba(57, 255, 20, 0.3);
        }
        .legend-segment.pts-2.active {
          color: #38BDF8; background: rgba(56, 189, 248, 0.15); box-shadow: 0 0 5px rgba(56, 189, 248, 0.3);
        }
        .legend-segment.pts-1.active {
          color: #F59E0B; background: rgba(245, 158, 11, 0.15); box-shadow: 0 0 5px rgba(245, 158, 11, 0.3);
        }

        .action-mode-selector {
          display: flex; justify-content: center; gap: 15px; margin: 12px 0 6px 0;
        }
        .action-mode-btn {
          padding: 8px 20px; font-size: 0.85rem; font-weight: 900;
          border-radius: 8px; border: 2px solid; cursor: pointer;
          transition: all 0.2s ease; font-family: 'Outfit', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .action-mode-btn.attack {
          background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.4); color: #EF4444;
        }
        .action-mode-btn.attack:hover {
          background: rgba(239, 68, 68, 0.25);
        }
        .action-mode-btn.attack.active {
          background: #EF4444; border-color: #EF4444; color: white;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }
        .action-mode-btn.heal {
          background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.4); color: #10B981;
        }
        .action-mode-btn.heal:hover {
          background: rgba(16, 185, 129, 0.25);
        }
        .action-mode-btn.heal.active {
          background: #10B981; border-color: #10B981; color: white;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        .rock {
          position: absolute; border-radius: 50% 50% 40% 40%;
          background: #9E9E9E; border-bottom: 3px solid #757575;
        }
        .r1 { width: 20px; height: 12px; bottom: 0; left: 20%; }
        .r2 { width: 14px; height: 9px; bottom: 0; right: 30%; }
        .grass { position: absolute; top: -5px; font-size: 1rem; }
        .g1 { left: 8%; }
        .g2 { right: 12%; }
        .g3 { left: 55%; }

        /* QUIZ PANEL */
        .quiz-panel {
          flex: 1; display: flex; flex-direction: column;
          background: white; z-index: 10;
          border-top: 3px solid #E0E0E0;
          padding: 12px 15px; overflow-y: auto;
          max-width: 500px; margin: 0 auto; width: 100%;
        }
        .quiz-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
        }
        .question-counter { color: #888; font-weight: 900; font-size: 0.8rem; }
        .timer-pill {
          display: flex; align-items: center; gap: 5px;
          background: #EEF2FF; border-radius: 20px; padding: 4px 12px;
          font-weight: 900; font-size: 0.85rem; color: #5865F2;
          border: 2px solid #C7D2FE;
        }
        .timer-pill.danger { background: #FFF0F0; color: #FF4B4B; border-color: #FFB3B3; }
        .timer-pill.prep { background: #F0FDF4; color: #15803D; border-color: #BBF7D0; }
        
        .timer-wrapper { 
          width: 100%; height: 10px; background: #E5E7EB; border-radius: 5px; 
          position: relative; overflow: hidden; margin-bottom: 10px; 
          border: 1px solid #D1D5DB; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }
        .timer-bar { height: 100%; border-radius: 4px; transition: background 0.3s ease; }
        .timer-bar.pts-3-bar { background: linear-gradient(90deg, #34D399 0%, #10B981 100%); }
        .timer-bar.pts-2-bar { background: linear-gradient(90deg, #60A5FA 0%, #38BDF8 100%); }
        .timer-bar.pts-1-bar { background: linear-gradient(90deg, #F87171 0%, #EF4444 100%); }
        .timer-divider {
          position: absolute; top: 0; bottom: 0; width: 2px; 
          background: rgba(255, 255, 255, 0.65); z-index: 5; pointer-events: none;
        }
        .timer-divider.div-50 { left: 50%; }
        .timer-divider.div-70 { left: 70%; }

        .question-box {
          background: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 16px;
          padding: 10px 12px; text-align: center; margin-bottom: 6px;
          box-shadow: 0 3px 0 #E5E7EB;
        }
        .question-box h2 { color: #1F2937; font-size: 0.95rem; font-weight: 800; line-height: 1.35; margin: 0; }

        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }
        @media (max-width: 600px) { .options-grid { padding-bottom: 12px; } }
        .opt-btn {
          background: white; border: 3px solid #E5E7EB; border-radius: 14px;
          padding: 8px 6px; color: #374151; font-weight: 800; font-size: 0.82rem;
          cursor: pointer; transition: all 0.1s; box-shadow: 0 3px 0 #E5E7EB;
          font-family: 'Outfit', sans-serif;
        }
        .opt-btn:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 0px 0 #E5E7EB; }
        .opt-btn:disabled { cursor: not-allowed; opacity: 0.8; }
        .opt-btn.selected { background: #EFF6FF; border-color: #3B82F6; box-shadow: 0 3px 0 #93C5FD; color: #1D4ED8; }
        .opt-btn.correct { background: #DCFCE7; border-color: #58CC02; box-shadow: 0 3px 0 #46A302; color: #166534; }
        .opt-btn.wrong { background: #FEE2E2; border-color: #FF4B4B; box-shadow: 0 3px 0 #DC2626; color: #991B1B; }
        .opt-btn.telescope-highlight {
          border-color: #10B981 !important;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.6), 0 3px 0 #059669 !important;
          animation: pulseGreenGlow 1.5s infinite alternate ease-in-out;
        }
        @keyframes pulseGreenGlow {
          0% { box-shadow: 0 0 4px rgba(16, 185, 129, 0.4), 0 3px 0 #059669; }
          100% { box-shadow: 0 0 14px rgba(16, 185, 129, 0.85), 0 3px 0 #059669; }
        }
        .opt-btn.locked {
          background: #F3F4F6;
          border-color: #E5E7EB;
          color: #9CA3AF;
          box-shadow: 0 3px 0 #E5E7EB;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .status-area { min-height: 48px; display: flex; justify-content: center; align-items: center; margin-bottom: 4px; width: 100%; }
        
        /* ITEMS BAR BOTTOM */
        .items-bar-bottom {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          border-top: 2px dashed #E5E7EB;
          padding-top: 8px;
        }
        .items-bar-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #4B5563;
        }
        .items-grid {
          display: flex;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }
        .item-card {
          flex: 1;
          max-width: 85px;
          background: white;
          border: 2px solid #D1D5DB;
          border-radius: 12px;
          padding: 4px 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2.5px 0 #D1D5DB;
          font-family: 'Outfit', sans-serif;
        }
        .item-card:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 0 #9CA3AF;
          border-color: #9CA3AF;
        }
        .item-card:active:not(:disabled) {
          transform: translateY(3px);
          box-shadow: 0 0px 0 #9CA3AF;
        }
        .item-card.active {
          background: #ECFDF5;
          border-color: #10B981;
          box-shadow: 0 3px 0 #059669;
        }
        .item-card.queued {
          background: #FFF7ED;
          border-color: #F97316;
          box-shadow: 0 3px 0 #EA580C;
          animation: pulseGlow 1.5s infinite alternate;
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 3px 0 #EA580C, 0 0 4px rgba(249, 115, 22, 0.2); }
          100% { box-shadow: 0 3px 0 #EA580C, 0 0 10px rgba(249, 115, 22, 0.6); }
        }
        .item-card.used {
          opacity: 0.4;
          filter: grayscale(1);
          cursor: not-allowed;
          box-shadow: 0 1px 0 #E5E7EB;
        }
        .item-card:disabled {
          cursor: not-allowed;
        }
        .item-icon {
          font-size: 1.1rem;
          margin-bottom: 2px;
        }
        .item-label {
          font-size: 0.58rem;
          font-weight: 800;
          color: #374151;
          text-align: center;
          line-height: 1.2;
        }

        .active-item-badge {
          background: #ECFDF5;
          border: 1.5px solid #A7F3D0;
          border-radius: 20px;
          padding: 4px 14px;
          color: #047857;
          font-size: 0.75rem;
          font-weight: 800;
          text-align: center;
          margin-top: 6px;
          display: inline-block;
        }

        .waiting-status {
          background: #EFF6FF; padding: 8px 16px; border-radius: 20px;
          color: #3B82F6; font-weight: 800; font-size: 0.9rem;
          display: flex; align-items: center; gap: 8px; border: 2px solid #BFDBFE;
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .resolution-board {
          background: #FFF7ED; padding: 12px 15px; border-radius: 16px;
          border: 2px solid #FED7AA; width: 100%;
          display: flex; flex-direction: column; gap: 6px;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .res-desc { color: #D97706; font-size: 0.85rem; font-weight: 800; text-align: center; margin-bottom: 4px; }
        .res-row { display: flex; align-items: center; justify-content: space-between; color: #374151; font-size: 0.85rem; font-weight: 800; }
        .pts { font-weight: 900; padding: 3px 10px; border-radius: 10px; font-size: 0.78rem; }
        .pts.pull { background: #DCFCE7; color: #166534; border: 2px solid #86EFAC; }
        .pts.push { background: #FEE2E2; color: #991B1B; border: 2px solid #FCA5A5; }

        /* INTRO & GAMEOVER */
        .intro-overlay, .gameover-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px); z-index: 50;
          display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 10px;
        }
        
        /* CATEGORY INTRO OVERLAY */
        .category-intro-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px); z-index: 50;
          display: flex; justify-content: center; align-items: center;
        }
        .category-card {
          background: white; border: 4px solid #10B981; border-radius: 28px;
          padding: 30px 20px; text-align: center; max-width: 340px; width: 90%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .category-card.animate-pop {
          animation: categoryPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes categoryPop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .category-tag {
          background: #E0F2FE; color: #0284C7; padding: 6px 16px; border-radius: 20px;
          font-weight: 900; font-size: 0.75rem; letter-spacing: 1px; display: inline-block;
          margin-bottom: 12px; border: 1.5px solid #BAE6FD;
        }
        .category-title { color: #111827; font-size: 1.5rem; font-weight: 900; margin: 0 0 10px 0; }
        .category-desc { color: #6B7280; font-weight: 700; line-height: 1.4; margin: 0; font-size: 0.85rem; }

        .intro-badge {
          background: #f4c265; color: white; padding: 8px 24px; border-radius: 30px;
          font-weight: 900; font-size: 1rem; letter-spacing: 2px; border: 3px solid white;
        }
        .countdown-text { font-size: 6rem; color: white; font-weight: 900; text-shadow: 0 4px 10px rgba(0,0,0,0.5); animation: pop 1s infinite; }
        @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }

        .gameover-card {
          background: white; border-radius: 32px;
          border: 4px solid #E5E7EB; text-align: center; max-width: 340px; width: 90%;
          box-shadow: 0 24px 50px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .go-header-accent {
          padding: 24px 20px;
          display: flex; justify-content: center;
          position: relative;
        }
        .go-trophy-circle {
          width: 58px; height: 58px; border-radius: 50%;
          background: white; border: 3.5px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .go-body {
          padding: 24px 20px;
        }
        .gameover-card h2 { color: #1F2937; font-size: 1.5rem; font-weight: 950; margin: 0 0 16px 0; letter-spacing: 1px; }
        
        .winner-showcase {
          display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;
        }
        .winner-avatar-ring {
          width: 76px; height: 76px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 6px;
        }
        .winner-avatar-ring.gold { border: 3.5px solid #EAB308; box-shadow: 0 0 12px rgba(234,179,8,0.4); }
        .winner-avatar-ring.red { border: 3.5px solid #EF4444; box-shadow: 0 0 12px rgba(239,68,68,0.4); }
        .winner-avatar-ring.gray { border: 3.5px solid #9CA3AF; }
        
        .avatar-crop {
          width: 100%; height: 100%; border-radius: 50%;
          overflow: hidden; background: #F3F4F6;
          display: flex; align-items: flex-start; justify-content: center;
        }
        .avatar-sprite {
          width: 120%; height: 120%; object-fit: contain;
        }
        .avatar-placeholder {
          font-size: 2.2rem; margin-top: 10px;
        }
        .winner-name-label {
          font-size: 0.85rem; font-weight: 900; color: #4B5563; text-transform: uppercase; letter-spacing: 0.5px;
        }

        .go-message-text { color: #6B7280; font-weight: 700; line-height: 1.4; margin: 0 0 20px 0; font-size: 0.88rem; }
        .reward-box { background: #FFFBEB; border: 2.5px solid #FDE68A; border-radius: 18px; padding: 12px; color: #D97706; font-weight: 955; font-size: 1.4rem; margin-bottom: 22px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .go-btn { background: #1CB0F6; color: white; border: none; padding: 14px; width: 100%; border-radius: 18px; font-weight: 950; font-size: 1rem; box-shadow: 0 5px 0 #1899D6; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.1s; }
        .go-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #1899D6; }

        /* CONFETTI */
        .confetti-container { position: absolute; inset: 0; pointer-events: none; z-index: 100; overflow: hidden; }
        .confetti { position: absolute; width: 9px; height: 9px; top: -20px; border-radius: 2px; animation: confettiFall linear infinite; }
        .c0 { background: #FFD700; }
        .c1 { background: #FF69B4; }
        .c2 { background: #1CB0F6; }
        .c3 { background: #58CC02; }
        .c4 { background: #f4c265; }
        .c5 { background: #A855F7; }

        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0.4; }
        }

        /* Settings Modal Styles */
        .settings-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 10000; backdrop-filter: blur(4px);
          font-family: 'Outfit', sans-serif;
        }
        .settings-card {
          background: var(--card-bg, white); width: 90%; max-width: 400px;
          border-radius: 24px; border: 4px solid var(--border-color, #E5E5E5);
          overflow: hidden; box-shadow: 0 10px 0 rgba(0,0,0,0.2);
        }
        .settings-header {
          padding: 20px 24px; border-bottom: 2px solid var(--border-color, #F0F0F0);
          display: flex; align-items: center; justify-content: space-between;
          background: var(--background-color, #F7F7F7);
        }
        .settings-header .title { display: flex; align-items: center; gap: 10px; color: var(--text-color, #4B4B4B); }
        .settings-header h2 { font-weight: 900; font-size: 1.2rem; margin: 0; color: var(--text-color, #4B4B4B); }
        
        .close-x {
          background: none; border: none; color: var(--text-muted, #AFB4BD); cursor: pointer;
          padding: 4px; border-radius: 8px; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .close-x:hover { background: var(--border-color, #E5E5E5); color: var(--text-color, #4B4B4B); }

        .settings-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; text-align: left; }
        
        .setting-row { display: flex; flex-direction: column; gap: 12px; }
        .setting-row .label { display: flex; align-items: center; gap: 8px; font-weight: 900; color: var(--text-muted, #777); font-size: 0.9rem; text-transform: uppercase; }
        
        .setting-slider {
          -webkit-appearance: none; width: 100%; height: 12px;
          background: var(--border-color, #E5E5E5); border-radius: 6px; outline: none;
        }
        .setting-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 24px; height: 24px;
          background: #1CB0F6; border: 3px solid var(--card-bg, white); border-radius: 50%;
          cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .divider { height: 2px; background: var(--border-color, #F0F0F0); margin: 8px 0; }

        .surrender-btn {
          background: #FF4B4B; border: none; padding: 14px;
          border-radius: 16px; color: white; font-weight: 900;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          cursor: pointer; box-shadow: 0 4px 0 #D33131; transition: all 0.1s;
          font-family: 'Outfit', sans-serif;
        }
        .surrender-btn:hover { background: #FF5E5E; transform: translateY(-2px); box-shadow: 0 6px 0 #D33131; }
        .surrender-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #D33131; }
        
        .surrender-hint { 
          margin: 0; font-size: 0.8rem; color: var(--text-muted, #AFB4BD); text-align: center; font-weight: 600;
        }
      `}</style>
    </div>
  );
}

