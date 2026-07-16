import { create } from 'zustand';
import { GAME_CONFIG } from '../features/game/jelajah-nusantara/data/gameConfig';
import { tileHandlers } from '../features/game/jelajah-nusantara/logic/tileHandlers';
import { getPlayerColor } from '../features/game/jelajah-nusantara/utils/gameUtils';
import { actionCards } from '../features/game/jelajah-nusantara/data/cards';
import { duelThemes, ipasDuelThemes } from '../features/game/jelajah-nusantara/data/duelData';
import { soundEngine } from '../features/game/jelajah-nusantara/logic/soundEngine';
import { useStore } from './useStore';

export const useGameStore = create((set, get) => ({
  
  mapData: null,
  players: [],
  turnIdx: 0,
  roundCount: 1,
  phase: 'IDLE',
  diceValue: 1,
  activeEvent: null,
  recoveryResult: null, 
  pendingOpponentIds: [], 
  isChoosingPath: false,
  isTeleportMode: false,
  activeJumpingTileId: null,
  remainingSteps: 0,
  winner: null, 
  gameLogs: ['Selamat datang di Jelajah Nusantara!'],
  activeUsedCard: null,
  isAutoZoomEnabled: true, 
  isLowGraphics: false,
  quizThemeId: 'ipas_4_5',
  toastKoinCukup: false,
  pijarFlyTrigger: 0, 
  tekadFlyTrigger: 0,
  pijarLoseTrigger: 0, 
  tekadLoseTrigger: 0,
  triggerPijarFly: () => set({ pijarFlyTrigger: get().pijarFlyTrigger + 1 }),
  triggerTekadFly: () => set({ tekadFlyTrigger: get().tekadFlyTrigger + 1 }),
  triggerPijarLose: () => set({ pijarLoseTrigger: get().pijarLoseTrigger + 1 }),
  triggerTekadLose: () => set({ tekadLoseTrigger: get().tekadLoseTrigger + 1 }),

  

  initGame: (mapData, selectedPlayers, quizThemeId = 'ipas_4_5') => {
    if (!mapData || !selectedPlayers) return;
    const tiles = Array.isArray(mapData) ? mapData : (mapData.tiles || []);

    const gamePlayers = selectedPlayers
      .map((p, idx) => {
        if (!p) return null;
        const ownerId = idx + 1;
        const startTile = tiles.find(t => t.type === 'base' && t.owner === ownerId) || tiles[0];

        return {
          ...p,
          id: p.id || `player-${ownerId}-${Date.now()}`,
          playerNum: ownerId,
          positionTileId: startTile?.id || (tiles[0]?.id),
          tekad: 100,
          koin: 0, 
          artifacts: 0, 
          inventory: (p.equippedArtifacts || [])
            .filter(art => art !== null)
            .map(art => ({
              ...art,
              instanceId: `initial-${art.id}-${Math.random()}`
            })),
          isMoving: false,
          isFainted: false,
          faintAttempts: 0,
          isSkippingTurn: false,
          facing: 'left',
          facingY: 'down',
          color: getPlayerColor(ownerId),
          avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name || 'player' + ownerId}`,
          characterId: p.characterId || 1,
          stats: {
            serangan: (p.characterId || 1) === 2 ? 0 : 2,
            pertahanan: (p.characterId || 1) === 2 ? 2 : 1,
            kelincahan: (p.characterId || 1) === 2 ? 1 : -1
          }
        };
      })
      .filter(p => p !== null);

    set({
      mapData,
      quizThemeId,
      players: gamePlayers,
      turnIdx: 0,
      roundCount: 1,
      phase: 'WAITING_ROLL',
      activeEvent: null,
      isChoosingPath: false,
      remainingSteps: 0,
      winner: null,
      recoveryResult: null,
      gameLogs: ['Putar dadu untuk bergerak!']
    });
  },

  resetGame: () => set({
    mapData: null, players: [], turnIdx: 0, roundCount: 1, phase: 'IDLE',
    diceValue: 1, activeEvent: null, recoveryResult: null, isChoosingPath: false, remainingSteps: 0,
    winner: null,
    gameLogs: ['Selamat datang!']
  }),

  rollDice: () => {
    const { phase, turnIdx, players } = get();
    if (phase !== 'WAITING_ROLL') return;

    const val = Math.floor(Math.random() * 6) + 1;
    set({ diceValue: val, phase: 'ROLLING', gameLogs: [`${players[turnIdx].name} memutar dadu...`] });
    return val;
  },

  cheatDice: (val) => {
    const { turnIdx, players } = get();
    set({ diceValue: val, phase: 'ROLLING', gameLogs: [`[TEST] ${players[turnIdx].name}: ${val}`] });
    return val;
  },

  startMoving: async (steps, shouldEndTurn = true) => {
    const { players, turnIdx, mapData } = get();
    let currentPlayers = [...players];
    let player = { ...currentPlayers[turnIdx] };
    const tiles = mapData.tiles;

    set({ phase: 'MOVING', isChoosingPath: false, remainingSteps: 0 });

    for (let i = 0; i < steps; i++) {
      const currentTile = tiles.find(t => t.id === player.positionTileId);
      if (!currentTile || !currentTile.next || currentTile.next.length === 0) break;

      
      if (currentTile.next.length > 1) {
        currentPlayers[turnIdx] = { ...player, isMoving: false };
        set({
          players: [...currentPlayers],
          isChoosingPath: true,
          remainingSteps: steps - i,
          pathChoiceEndTurn: shouldEndTurn 
        });

        
        if (player.type === 'ai') {
          setTimeout(() => {
            const randomNext = currentTile.next[Math.floor(Math.random() * currentTile.next.length)];
            get().choosePath(randomNext, shouldEndTurn);
          }, 1000);
        }
        return;
      }

      const nextId = currentTile.next[0];
      const nextTile = tiles.find(t => t.id === nextId);

      if (currentTile && nextTile) {
        const screenDeltaX = (nextTile.x - currentTile.x) - (nextTile.y - currentTile.y);
        if (screenDeltaX !== 0) {
          player.facing = screenDeltaX > 0 ? 'right' : 'left';
        }
        const screenDeltaY = (nextTile.x - currentTile.x) + (nextTile.y - currentTile.y);
        if (screenDeltaY !== 0) {
          player.facingY = screenDeltaY < 0 ? 'up' : 'down';
        }
      }

      player.positionTileId = nextId;
      if (nextTile?.type === 'base' && nextTile.owner === player.playerNum) {
        const oldKoin = player.koin || 0;
        const newKoin = oldKoin + 50;
        player.koin = newKoin;
        get().triggerPijarFly();

        const nextCost = player.artifacts === 0 ? GAME_CONFIG.CHEST_COST_1 : player.artifacts === 1 ? GAME_CONFIG.CHEST_COST_2 : GAME_CONFIG.CHEST_COST_3;
        if (oldKoin < nextCost && newKoin >= nextCost && player.artifacts < 3) {
          set({ toastKoinCukup: true });
          setTimeout(() => {
            set({ toastKoinCukup: false });
          }, 4000);
        }
      }
      currentPlayers[turnIdx] = { ...player, isMoving: true };
      soundEngine.playSound('move');
      set({ players: [...currentPlayers] });
      
      
      const thisNextId = nextId;
      setTimeout(() => {
        set({ activeJumpingTileId: thisNextId });
        setTimeout(() => {
          if (get().activeJumpingTileId === thisNextId) {
            set({ activeJumpingTileId: null });
          }
        }, 800);
      }, 400);

      
      const opponentsOnTile = currentPlayers.filter(p => p.id !== player.id && p.positionTileId === nextId && !p.isFainted);
      if (opponentsOnTile.length > 0) {
        currentPlayers[turnIdx] = { ...player, isMoving: false };
        set({
          players: [...currentPlayers],
          pendingOpponentIds: opponentsOnTile.map(o => o.id),
          remainingSteps: steps - (i + 1),
          duelEndTurn: shouldEndTurn 
        });
        get().startDuelInvitation();
        return;
      }

      
      const isLastStep = (i === steps - 1);
      if (nextTile?.type === 'base' && nextTile.owner === player.playerNum && !isLastStep) {
        currentPlayers[turnIdx] = { ...player, isMoving: false };
        set({
          phase: 'EVENT',
          players: [...currentPlayers],
          activeEvent: {
            type: 'base_choice',
            title: 'Melewati Markas',
            message: 'Berhenti istirahat atau lanjut?',
            icon: '🏠',
            remainingSteps: steps - (i + 1),
            shouldEndTurn
          }
        });
        return;
      }

      await new Promise(r => setTimeout(r, GAME_CONFIG.STEP_DELAY));
    }

    currentPlayers[turnIdx] = { ...player, isMoving: false };
    set({ players: [...currentPlayers], phase: 'ACTION' });
    get().resolveTile(shouldEndTurn);
  },

  choosePath: async (nextTileId, shouldEndTurn = true) => {
    const { players, turnIdx, remainingSteps, pathChoiceEndTurn } = get();
    const useEndTurn = shouldEndTurn !== undefined ? shouldEndTurn : pathChoiceEndTurn;
    const updatedPlayers = [...players];
    const player = { ...updatedPlayers[turnIdx] };
    const tiles = get().mapData?.tiles || [];

    const currentTile = tiles.find(t => t.id === player.positionTileId);
    const nextTile = tiles.find(t => t.id === nextTileId);
    if (currentTile && nextTile) {
      const screenDeltaX = (nextTile.x - currentTile.x) - (nextTile.y - currentTile.y);
      if (screenDeltaX !== 0) {
        player.facing = screenDeltaX > 0 ? 'right' : 'left';
      }
      const screenDeltaY = (nextTile.x - currentTile.x) + (nextTile.y - currentTile.y);
      if (screenDeltaY !== 0) {
        player.facingY = screenDeltaY < 0 ? 'up' : 'down';
      }
    }

    player.positionTileId = nextTileId;
    if (nextTile && nextTile.type === 'base' && nextTile.owner === player.playerNum) {
      const oldKoin = player.koin || 0;
      const newKoin = oldKoin + 50;
      player.koin = newKoin;
      get().triggerPijarFly();

      const nextCost = player.artifacts === 0 ? GAME_CONFIG.CHEST_COST_1 : player.artifacts === 1 ? GAME_CONFIG.CHEST_COST_2 : GAME_CONFIG.CHEST_COST_3;
      if (oldKoin < nextCost && newKoin >= nextCost && player.artifacts < 3) {
        set({ toastKoinCukup: true });
        setTimeout(() => {
          set({ toastKoinCukup: false });
        }, 4000);
      }
    }
    player.isMoving = true;
    updatedPlayers[turnIdx] = player;
    soundEngine.playSound('move');

    set({
      players: updatedPlayers,
      isChoosingPath: false,
    });

    
    const thisNextId = nextTileId;
    setTimeout(() => {
      set({ activeJumpingTileId: thisNextId });
      setTimeout(() => {
        if (get().activeJumpingTileId === thisNextId) {
          set({ activeJumpingTileId: null });
        }
      }, 800);
    }, 400);

    await new Promise(r => setTimeout(r, GAME_CONFIG.STEP_DELAY));

    await get().startMoving(remainingSteps - 1, useEndTurn);
  },

  handleBaseChoice: async (choice) => {
    const { activeEvent } = get();
    const remainingSteps = activeEvent.remainingSteps;
    set({ activeEvent: null });

    if (choice === 'stop') {
      set({ phase: 'ACTION' });
      get().resolveTile();
    } else {
      await get().startMoving(remainingSteps);
    }
  },

  handleBasePurchase: (choice) => {
    const { activeEvent, players, turnIdx } = get();
    if (!activeEvent || activeEvent.type !== 'base_purchase') return;

    const { cost, shouldEndTurn } = activeEvent;
    const updatedPlayers = [...players];
    const player = { ...updatedPlayers[turnIdx] };

    if (choice === 'yes') {
      const newKoin = Math.max(0, player.koin - cost);
      const newArtifacts = player.artifacts + 1;
      player.koin = newKoin;
      player.artifacts = newArtifacts;
      updatedPlayers[turnIdx] = player;

      soundEngine.playSound('success');

      set({
        players: updatedPlayers,
        gameLogs: [`${player.name} mengisi Peti Harta Karun (${newArtifacts}/3)`, ...get().gameLogs],
        activeEvent: null
      });

      
      if (newArtifacts >= GAME_CONFIG.WIN_ARTIFACTS_GOAL) {
        get().checkWinner();
        return;
      }

      
      set({
        phase: 'EVENT',
        activeEvent: {
          type: 'base_purchase_success',
          title: 'Peti Harta Terisi!',
          message: `Berhasil menukarkan ${cost} Koin Emas! Peti Harta Karunmu di Markas telah terisi (${newArtifacts}/3). Kumpulkan ${GAME_CONFIG.WIN_ARTIFACTS_GOAL - newArtifacts} lagi untuk menang!`,
          icon: '🎁',
          shouldEndTurn
        }
      });
    } else {
      
      const heal = GAME_CONFIG.BASE_HEAL_AMOUNT;
      player.tekad = Math.min(100, player.tekad + heal);
      updatedPlayers[turnIdx] = player;

      set({
        players: updatedPlayers,
        gameLogs: [`${player.name} memutuskan untuk melewati pengisian peti dan istirahat (+${heal} Tekad)`, ...get().gameLogs],
        phase: 'EVENT',
        activeEvent: {
          type: 'base',
          title: 'Markas Penjelajah',
          message: `Istirahat di Markas (+${heal} Tekad)`,
          icon: '🏠',
          shouldEndTurn
        }
      });
      soundEngine.playSound('event_open');
    }
  },

  moveBackward: async (steps, shouldEndTurn = true, triggerEvent = false) => {
    const { players, turnIdx, mapData } = get();
    let currentPlayers = [...players];
    let player = { ...currentPlayers[turnIdx] };
    const tiles = mapData.tiles;

    for (let i = 0; i < steps; i++) {
      const currentTile = tiles.find(t => t.id === player.positionTileId);
      const prevTile = tiles.find(t => (t.next || []).includes(player.positionTileId));
      if (!prevTile) break;

      if (currentTile && prevTile) {
        const screenDeltaX = (prevTile.x - currentTile.x) - (prevTile.y - currentTile.y);
        if (screenDeltaX !== 0) {
          player.facing = screenDeltaX > 0 ? 'right' : 'left';
        }
        const screenDeltaY = (prevTile.x - currentTile.x) + (prevTile.y - currentTile.y);
        if (screenDeltaY !== 0) {
          player.facingY = screenDeltaY < 0 ? 'up' : 'down';
        }
      }

      player.positionTileId = prevTile.id;
      currentPlayers[turnIdx] = { ...player, isMoving: true };
      soundEngine.playSound('move');
      set({ players: [...currentPlayers] });
      
      
      const thisPrevId = prevTile.id;
      setTimeout(() => {
        set({ activeJumpingTileId: thisPrevId });
        setTimeout(() => {
          if (get().activeJumpingTileId === thisPrevId) {
            set({ activeJumpingTileId: null });
          }
        }, 800);
      }, 400);
      await new Promise(r => setTimeout(r, GAME_CONFIG.STEP_DELAY));
    }
    currentPlayers[turnIdx] = { ...player, isMoving: false };
    set({ players: [...currentPlayers] });

    if (triggerEvent) {
      get().resolveTile(shouldEndTurn);
    } else {
      setTimeout(() => {
        if (shouldEndTurn) {
          get().nextTurn();
        } else {
          set({ phase: 'WAITING_ROLL' });
        }
      }, 800);
    }
  },

  resolveTile: (shouldEndTurn = true) => {
    const { players, turnIdx, mapData } = get();
    const player = players[turnIdx];
    const tile = mapData.tiles.find(t => t.id === player.positionTileId);

    if (!tile) return shouldEndTurn ? get().nextTurn() : set({ phase: 'WAITING_ROLL' });

    const handler = tileHandlers[tile.type];
    if (handler) {
      
      if (tile.type === 'base' && tile.owner === player.playerNum) {
        const cost = player.artifacts === 0 ? GAME_CONFIG.CHEST_COST_1 : player.artifacts === 1 ? GAME_CONFIG.CHEST_COST_2 : GAME_CONFIG.CHEST_COST_3;
        if (player.koin >= cost && player.artifacts < 3) {
          set({
            phase: 'EVENT',
            activeEvent: {
              type: 'base_purchase',
              title: 'Isi Peti Harta Karun',
              message: `Kamu memiliki ${player.koin} Koin Emas. Ingin menukarkan ${cost} Koin Emas untuk mengisi Peti Harta Karunmu?`,
              icon: '📦',
              cost,
              shouldEndTurn
            }
          });
          soundEngine.playSound('event_open');
          return;
        } else {
          const heal = GAME_CONFIG.BASE_HEAL_AMOUNT;
          const updatedPlayers = [...players];
          updatedPlayers[turnIdx] = { ...player, tekad: Math.min(100, player.tekad + heal) };
          set({
            players: updatedPlayers,
            gameLogs: [
              `Istirahat di Markas (+${heal} Tekad). Koin Emas kamu (${player.koin}/${cost}) tidak cukup untuk mengisi Peti Harta.`,
              ...get().gameLogs
            ],
            phase: 'EVENT',
            activeEvent: {
              type: 'base',
              title: 'Markas Penjelajah',
              message: `Istirahat di Markas (+${heal} Tekad). Koin Emas tidak cukup (butuh ${cost}) untuk mengisi Peti Harta.`,
              icon: '🏠',
              shouldEndTurn
            }
          });
          soundEngine.playSound('event_open');
          return;
        }
      }

      const result = handler(player, tile);
      if (result) {
        if (result.playerUpdate) {
          const updatedPlayers = [...players];
          let finalUpdate = { ...result.playerUpdate };

          
          const isKoinGain = (finalUpdate.koin !== undefined && finalUpdate.koin > player.koin) || 
                              (tile.type === 'peti' && result.activeEvent?.icon === '🪙');
          if (isKoinGain) {
            get().triggerPijarFly();
          }

          const isTekadGain = (finalUpdate.tekad !== undefined && finalUpdate.tekad > player.tekad) || 
                              (tile.type === 'peti') || (tile.type === 'base');
          if (isTekadGain) {
            get().triggerTekadFly();
          }

          const isTekadLoss = (finalUpdate.tekad !== undefined && finalUpdate.tekad < player.tekad) || 
                              (tile.type === 'jebakan') || (tile.type === 'jebakan_mundur');
          if (isTekadLoss) {
            get().triggerTekadLose();
          }

          const isKoinLoss = (finalUpdate.koin !== undefined && finalUpdate.koin < player.koin) ||
                              (tile.type === 'jebakan_pijar');
          if (isKoinLoss) {
            get().triggerPijarLose();
          }

          
          if (finalUpdate.koin !== undefined) {
            const nextCost = player.artifacts === 0 ? GAME_CONFIG.CHEST_COST_1 : player.artifacts === 1 ? GAME_CONFIG.CHEST_COST_2 : GAME_CONFIG.CHEST_COST_3;
            if (player.koin < nextCost && finalUpdate.koin >= nextCost && player.artifacts < 3) {
              set({ toastKoinCukup: true });
              setTimeout(() => {
                set({ toastKoinCukup: false });
              }, 4000);
            }
          }

          updatedPlayers[turnIdx] = { ...player, ...finalUpdate };
          set({ players: updatedPlayers });

          get().checkWinner();
        }

        
        if (tile.type === 'peti' || tile.type === 'jebakan' || tile.type === 'jebakan_mundur' || tile.type === 'jebakan_pijar') {
          set({ gameLogs: [`${result.activeEvent.message}`, ...get().gameLogs] });
          if (tile.type === 'jebakan_mundur') {
            soundEngine.playSound('hit');
          } else {
            soundEngine.playSound(tile.type === 'peti' ? 'win' : 'lose');
          }
          
          const moveBack = result.activeEvent.moveBack;
          
          setTimeout(async () => {
            if (moveBack) {
              await get().moveBackward(moveBack, shouldEndTurn, false);
            } else {
              if (shouldEndTurn) {
                get().nextTurn();
              } else {
                set({ phase: 'WAITING_ROLL' });
              }
            }
          }, 1500);
          return;
        }

        set({ 
          phase: 'EVENT', 
          activeEvent: { ...result.activeEvent, shouldEndTurn } 
        });
        soundEngine.playSound('event_open');
        return;
      }
    }

    
    setTimeout(() => {
      if (shouldEndTurn) {
        get().nextTurn();
      } else {
        set({ phase: 'WAITING_ROLL' });
      }
    }, 1000);
  },

  handleQuizAnswer: (index) => {
    const { activeEvent, players, turnIdx } = get();
    if (!activeEvent || activeEvent.status === 'RESOLVED') return;
    const isCorrect = index === activeEvent.question.correct;
    const updatedPlayers = [...players];
    const player = { ...updatedPlayers[turnIdx] };

    if (isCorrect) {
      get().triggerPijarFly();
      const oldKoin = player.koin || 0;
      const reward = GAME_CONFIG.QUIZ_KOIN_REWARD;
      const newKoin = oldKoin + reward;
      
      const nextCost = player.artifacts === 0 ? GAME_CONFIG.CHEST_COST_1 : player.artifacts === 1 ? GAME_CONFIG.CHEST_COST_2 : GAME_CONFIG.CHEST_COST_3;
      if (oldKoin < nextCost && newKoin >= nextCost && player.artifacts < 3) {
        set({ toastKoinCukup: true });
        setTimeout(() => {
          set({ toastKoinCukup: false });
        }, 4000);
      }
      
      player.koin = newKoin;
      const msg = `Jawabanmu tepat! (+${reward} Koin Emas)`;
      set({ activeEvent: { ...activeEvent, status: 'RESOLVED', result: 'CORRECT', message: msg, icon: '🪙' } });
    } else {
      get().triggerTekadLose();
      player.tekad = Math.max(0, player.tekad - GAME_CONFIG.QUIZ_TEKAD_PENALTY);
      set({ activeEvent: { ...activeEvent, status: 'RESOLVED', result: 'WRONG', message: 'Kurang tepat. (-20 Tekad)' } });
      if (player.tekad <= 0) {
        player.isFainted = true;
        player.faintAttempts = 0;
        set({ gameLogs: [`${player.name} Tumbang!`, ...get().gameLogs] });
      }
    }
    updatedPlayers[turnIdx] = player;
    set({ players: updatedPlayers });
    if (isCorrect) get().checkWinner();
  },

  handleBattleRoll: () => {
    const { activeEvent, players, turnIdx } = get();
    if (!activeEvent || activeEvent.isRolling) return;
    
    
    const playerRoll = Math.floor(Math.random() * 6) + 1;
    
    
    set({ activeEvent: { ...activeEvent, isRolling: true, playerRoll } });

    setTimeout(() => {
      const { activeEvent: latestEvent, players: latestPlayers } = get();
      if (!latestEvent) return;

      const guardianPower = parseInt(latestEvent.guardian?.power || 0, 10);
      const updatedPlayers = [...latestPlayers];
      const player = { ...updatedPlayers[turnIdx] };

      const isWin = playerRoll > guardianPower;

      if (isWin) {
        get().triggerPijarFly();
        soundEngine.playSound('win');
        
        const oldKoin = player.koin || 0;
        const newKoin = oldKoin + 50;
        
        const nextCost = player.artifacts === 0 ? GAME_CONFIG.CHEST_COST_1 : player.artifacts === 1 ? GAME_CONFIG.CHEST_COST_2 : GAME_CONFIG.CHEST_COST_3;
        if (oldKoin < nextCost && newKoin >= nextCost && player.artifacts < 3) {
          set({ toastKoinCukup: true });
          setTimeout(() => {
            set({ toastKoinCukup: false });
          }, 4000);
        }
        
        player.koin = newKoin;
        const msg = `Menang! Dadu kamu (${playerRoll}) vs (${guardianPower}). (+50 Koin Emas)`;

        set({ 
          activeEvent: { 
            ...latestEvent, 
            isRolling: false, 
            status: 'RESOLVED', 
            result: 'WIN', 
            loser: 'guardian', 
            playerRoll, 
            message: msg 
          } 
        });
      } else {
        get().triggerTekadLose();
        get().triggerPijarLose();
        soundEngine.playSound('lose');
        
        player.tekad = Math.max(0, player.tekad - 20);
        player.koin = Math.max(0, (player.koin || 0) - 30);
        
        if (player.tekad <= 0) {
          player.isFainted = true;
          player.faintAttempts = 0;
          set({ gameLogs: [`${player.name} Tumbang!`, ...get().gameLogs] });
        }
        
        set({ 
          activeEvent: { 
            ...latestEvent, 
            isRolling: false, 
            status: 'RESOLVED', 
            result: 'LOSE', 
            loser: 'player', 
            playerRoll, 
            message: `Kalah! Dadu kamu (${playerRoll}) vs (${guardianPower}). (-20 Tekad, -30 Koin Emas)` 
          } 
        });
      }
      
      updatedPlayers[turnIdx] = player;
      set({ players: updatedPlayers });
      get().checkWinner();
    }, 2000);
  },

  addCardToInventory: (card) => {
    const { players, turnIdx } = get();
    const player = players[turnIdx];

    if (player.inventory.length >= 3) {
      
      set({
        phase: 'EVENT',
        activeEvent: {
          type: 'discard_card_choice',
          title: 'Tas Penuh!',
          message: 'Pilih satu kartu untuk dibuang (kartu lama atau kartu baru)',
          icon: '🎒',
          newCard: { ...card, instanceId: Date.now() },
          currentInventory: player.inventory
        }
      });
      return;
    }

    const updatedPlayers = [...players];
    updatedPlayers[turnIdx] = {
      ...player,
      inventory: [...player.inventory, { ...card, instanceId: Date.now() }]
    };
    soundEngine.playSound('card_get');
    set({ players: updatedPlayers, activeEvent: null, gameLogs: [`${player.name} dapat ${card.name}!`] });
    get().nextTurn();
  },

  handleDiscardCard: (instanceIdToDiscard, newCardIfKept) => {
    const { players, turnIdx, activeEvent } = get();
    const updatedPlayers = [...players];
    const player = { ...updatedPlayers[turnIdx] };

    
    if (instanceIdToDiscard === activeEvent.newCard.instanceId) {
      set({ activeEvent: null });
      get().nextTurn();
      return;
    }

    
    const filteredInventory = player.inventory.filter(c => c.instanceId !== instanceIdToDiscard);
    player.inventory = [...filteredInventory, activeEvent.newCard];

    updatedPlayers[turnIdx] = player;
    set({ players: updatedPlayers, activeEvent: null });
    get().nextTurn();
  },

  useCard: async (instanceId) => {
    const { players, turnIdx, phase } = get();
    if (phase !== 'WAITING_ROLL') return;

    const player = players[turnIdx];
    const card = player.inventory.find(c => c.instanceId === instanceId);
    if (!card) return;

    
    const cost = card.cost || 0;
    if (player.tekad <= cost) {
      set({ gameLogs: [`Tekad kurang (butuh > ${cost})!`] });
      return;
    }

    
    console.log("[DEBUG] Triggering animation for card:", card.name);
    soundEngine.playSound('card_use');
    set({ activeUsedCard: card });
    get().setAutoZoomEnabled(true);

    
    await new Promise(resolve => setTimeout(resolve, 1800));

    const updatedPlayers = [...players];
    const updatedPlayer = { ...updatedPlayers[turnIdx] };

    
    updatedPlayer.tekad -= cost;
    if (updatedPlayer.tekad <= 0) {
      updatedPlayer.isFainted = true;
      updatedPlayer.faintAttempts = 0;
    }
    updatedPlayer.inventory = updatedPlayer.inventory.filter(c => c.instanceId !== instanceId);

    let finalPlayer = updatedPlayer;
    if (card.effect) finalPlayer = card.effect(updatedPlayer);

    const isHealCard = card.name?.includes('Bekal') || card.name?.includes('Pulih') || card.name?.includes('Air') || (finalPlayer.tekad > player.tekad);
    if (isHealCard) {
      get().triggerTekadFly();
    }

    updatedPlayers[turnIdx] = finalPlayer;
    set({ 
      players: updatedPlayers, 
      gameLogs: [`${updatedPlayer.name} pakai ${card.name} (-${cost} Tekad)`],
      activeUsedCard: null 
    });

    if (card.action === 'MOVE_FORWARD') {
      await get().startMoving(card.value, false);
    } else if (card.action === 'MOVE_BACKWARD') {
      
      await get().moveBackward(card.value, false, true);
    } else if (card.action === 'TELEPORT_MODE') {
      set({ isTeleportMode: true });
    } else {
      
      set({ phase: 'WAITING_ROLL' });
    }
  },

  closeEvent: async () => {
    const { activeEvent, addCardToInventory, pendingOpponentIds } = get();
    const moveBack = activeEvent?.moveBack;
    const isCardEvent = activeEvent?.type === 'kartu';
    const cardData = activeEvent?.card;
    const shouldEndTurn = activeEvent?.shouldEndTurn !== undefined ? activeEvent.shouldEndTurn : true;

    set({ activeEvent: null });

    
    if (pendingOpponentIds.length > 0) {
      get().startDuelInvitation();
      return;
    }

    if (isCardEvent && cardData) {
      addCardToInventory(cardData);
      return;
    }

    if (moveBack) {
      
      await get().moveBackward(moveBack, shouldEndTurn, false);
      return;
    }

    
    if (activeEvent?.type === 'duel_question') {
      get().resolveTile(shouldEndTurn);
      return;
    }

    if (shouldEndTurn) {
      get().nextTurn();
    } else {
      set({ phase: 'WAITING_ROLL' });
    }
  },

  
  startDuelInvitation: () => {
    const { players, pendingOpponentIds } = get();
    if (pendingOpponentIds.length === 0) return get().nextTurn();

    const opponentId = pendingOpponentIds[0];
    const opponent = players.find(p => p.id === opponentId);

    set({
      phase: 'EVENT',
      activeEvent: {
        type: 'duel_invitation',
        title: 'Duel Penjelajah',
        message: `Kamu berpapasan dengan ${opponent.name}. Ingin menantang duel karakter?`,
        icon: '⚔️',
        opponent
      }
    });
  },

  handleDuelChoice: async (choice) => {
    const { pendingOpponentIds, remainingSteps, activeEvent, players, turnIdx } = get();
    const opponent = activeEvent.opponent;

    if (choice === 'ignore') {
      const nextOpponents = pendingOpponentIds.filter(id => id !== opponent.id);
      set({ pendingOpponentIds: nextOpponents, activeEvent: null });

      if (nextOpponents.length > 0) {
        get().startDuelInvitation();
      } else {
        if (remainingSteps > 0) {
          await get().startMoving(remainingSteps);
        } else {
          get().resolveTile();
        }
      }
    } else {
      
      set({
        remainingSteps: 0, 
        activeEvent: {
          ...activeEvent,
          type: 'duel_target_selection',
          opponent: opponent
        }
      });
    }
  },

  selectDuelTarget: (targetType) => {
    const { activeEvent, players, turnIdx } = get();
    if (!activeEvent) return;

    set({
      activeEvent: {
        ...activeEvent,
        type: 'duel_defense_selection',
        stage: 'DEFENSE_SELECT',
        duelRewardType: targetType, 
        challenger: players[turnIdx],
        opponent: activeEvent.opponent,
        status: 'PENDING',
        isRolling: false,
        challengerRoll: null,
        defenderRoll: null,
        challengerScore: null,
        defenderScore: null,
        defenderStrategy: null,
        damageDealt: 0,
        stolenAmount: 0
      }
    });
  },

  selectDuelDefense: (strategy) => {
    const { activeEvent } = get();
    if (!activeEvent) return;

    set({
      activeEvent: {
        ...activeEvent,
        type: 'duel_battle',
        stage: 'CHALLENGER_ROLL',
        defenderStrategy: strategy
      }
    });
  },

  rollDuelChallenger: () => {
    const { activeEvent } = get();
    if (!activeEvent || activeEvent.isRolling) return;

    const rollVal = Math.floor(Math.random() * 6) + 1;
    const challengerScore = rollVal + (activeEvent.challenger.stats?.serangan || 0);

    set({
      activeEvent: {
        ...activeEvent,
        isRolling: true,
        challengerRoll: rollVal,
        challengerScore: challengerScore
      }
    });

    soundEngine.playSound('dice_roll');

    setTimeout(() => {
      const { activeEvent: latestEvent } = get();
      if (!latestEvent) return;

      soundEngine.playSound(`dice_${latestEvent.challengerRoll}`);

      set({
        activeEvent: {
          ...latestEvent,
          isRolling: false,
          stage: 'DEFENDER_ROLL'
        }
      });
    }, 1500);
  },

  rollDuelDefender: () => {
    const { activeEvent, players } = get();
    if (!activeEvent || activeEvent.isRolling) return;

    const rollVal = Math.floor(Math.random() * 6) + 1;
    const defender = activeEvent.opponent;
    const strategy = activeEvent.defenderStrategy;

    const defenderStat = strategy === 'defend' 
      ? (defender.stats?.pertahanan || 0) 
      : (defender.stats?.kelincahan || 0);

    const defenderScore = rollVal + defenderStat;
    const challengerScore = activeEvent.challengerScore;
    const rewardType = activeEvent.duelRewardType || 'tekad';
    let damage = 0;
    let stolenAmount = 0;
    let message = '';
    let isChallengerWin = false;

    const defenderGold = defender.koin || 0;

    if (challengerScore > defenderScore) {
      isChallengerWin = true;
      if (rewardType === 'koin') {
        stolenAmount = Math.min(50, defenderGold);
        message = `Berhasil merebut ${stolenAmount} Koin Emas dari lawan!`;
      } else {
        if (strategy === 'defend') {
          damage = Math.max(0, (challengerScore - defenderScore) * 10);
          message = `(${challengerScore} - ${defenderScore}) x 10 = ${damage} Damage`;
        } else {
          damage = Math.max(0, challengerScore * 10);
          message = `${challengerScore} x 10 = ${damage} Damage`;
        }
      }
    } else {
      if (strategy === 'defend') {
        if (rewardType === 'koin') {
          stolenAmount = 0;
          message = `Gagal merebut koin! Pertahanan kokoh.`;
        } else {
          damage = 10; 
          message = `10 Damage (Chip Damage)`;
        }
      } else {
        if (rewardType === 'koin') {
          stolenAmount = 0;
          message = `Gagal merebut koin! Lawan menghindar.`;
        } else {
          damage = 0; 
          message = `0 Damage`;
        }
      }
    }

    set({
      activeEvent: {
        ...activeEvent,
        isRolling: true,
        defenderRoll: rollVal,
        defenderScore: defenderScore,
        damageDealt: damage,
        stolenAmount: stolenAmount,
        message: message
      }
    });

    soundEngine.playSound('dice_roll');

    setTimeout(() => {
      const { activeEvent: latestEvent, players: latestPlayers } = get();
      if (!latestEvent) return;

      const updatedPlayers = latestPlayers.map(p => {
        if (p.id === defender.id) {
          const newTekad = Math.max(0, p.tekad - latestEvent.damageDealt);
          const isFainted = newTekad <= 0;
          return {
            ...p,
            tekad: newTekad,
            koin: Math.max(0, (p.koin || 0) - latestEvent.stolenAmount),
            isFainted: isFainted,
            faintAttempts: isFainted ? 0 : p.faintAttempts
          };
        }
        if (p.id === latestEvent.challenger.id) {
          const oldKoin = p.koin || 0;
          const newKoin = oldKoin + stolenAmount;
          
          const nextCost = p.artifacts === 0 ? GAME_CONFIG.CHEST_COST_1 : p.artifacts === 1 ? GAME_CONFIG.CHEST_COST_2 : GAME_CONFIG.CHEST_COST_3;
          if (oldKoin < nextCost && newKoin >= nextCost && p.artifacts < 3) {
            set({ toastKoinCukup: true });
            setTimeout(() => {
              set({ toastKoinCukup: false });
            }, 4000);
          }
          
          return {
            ...p,
            koin: newKoin
          };
        }
        return p;
      });

      const updatedDefender = updatedPlayers.find(p => p.id === defender.id);

      soundEngine.playSound(`dice_${latestEvent.defenderRoll}`);

      if (isChallengerWin && damage > 0) {
        setTimeout(() => {
          soundEngine.playSound('hit');
        }, 300);
      }

      setTimeout(() => {
        if (updatedDefender?.isFainted) {
          soundEngine.playSound('blink');
        } else if (isChallengerWin) {
          soundEngine.playSound('win');
        } else {
          soundEngine.playSound('lose');
        }
      }, 800);

      set({
        players: updatedPlayers,
        pendingOpponentIds: get().pendingOpponentIds.filter(id => id !== defender.id),
        activeEvent: {
          ...latestEvent,
          isRolling: false,
          status: 'RESOLVED',
          result: isChallengerWin ? 'WIN' : 'LOSE',
          message: message,
          stage: 'RESULT'
        }
      });
    }, 1500);
  },

  handleRecoveryRoll: () => {
    const { players, turnIdx, phase } = get();
    
    if (phase === 'RECOVERY_ROLLING' || phase === 'RECOVERY_RESULT') return;

    const player = players[turnIdx];
    const attemptIdx = player.faintAttempts || 0;
    const targets = [5, 3, 1];
    const target = targets[attemptIdx] || 1;

    
    const roll = Math.floor(Math.random() * 6) + 1;
    let result = 'LOSE';
    if (roll > target) result = 'WIN';
    else if (roll === target) result = 'TIE';

    set({ 
      diceValue: roll, 
      recoveryResult: result, 
      phase: 'RECOVERY_ROLLING',
      gameLogs: [
        `${player.name} memutar dadu pemulihan...`,
        ...get().gameLogs
      ]
    });

    setTimeout(() => {
      
      if (result === 'WIN') {
        soundEngine.playSound('success');
      } else if (result === 'LOSE') {
        soundEngine.playSound('blink');
      }

      
      set({
        phase: 'RECOVERY_RESULT',
        gameLogs: [
          result === 'WIN' ? `${player.name} dapat dadu ${roll} dan BERHASIL bangkit!` :
          result === 'TIE' ? `${player.name} dapat dadu ${roll} (Seri)! Putar lagi.` :
          `${player.name} dapat dadu ${roll} dan GAGAL bangkit!`,
          ...get().gameLogs
        ]
      });
    }, 1500); 
  },

  confirmRecoverySuccess: () => {
    const { players, turnIdx } = get();
    const player = players[turnIdx];
    const updatedPlayers = [...players];
    updatedPlayers[turnIdx] = { ...player, isFainted: false, tekad: 50, faintAttempts: 0 };
    
    set({
      players: updatedPlayers,
      diceValue: 0,
      recoveryResult: null,
      phase: 'WAITING_ROLL'
    });
    get().nextTurn();
  },

  confirmRecoveryFail: () => {
    const { players, turnIdx } = get();
    const player = players[turnIdx];
    const updatedPlayers = [...players];
    updatedPlayers[turnIdx] = { ...player, faintAttempts: (player.faintAttempts || 0) + 1 };
    
    set({
      players: updatedPlayers,
      diceValue: 0,
      recoveryResult: null,
      phase: 'WAITING_ROLL'
    });
    get().nextTurn();
  },

  confirmRecoveryTie: () => {
    set({
      diceValue: 0,
      recoveryResult: null,
      phase: 'RECOVERY_WAITING'
    });
  },

  nextTurn: () => {
    const { players, turnIdx } = get();
    let nextIdx = (turnIdx + 1) % players.length;

    const processNext = (idx) => {
      const player = get().players[idx];
      if (!player) return;

      if (idx === 0) {
        set({ roundCount: get().roundCount + 1 });
      }

      if (player.isSkippingTurn) {
        const updatedPlayers = [...get().players];
        updatedPlayers[idx] = { ...player, isSkippingTurn: false };
        set({ 
          players: updatedPlayers, 
          gameLogs: [`${player.name} Lewat Giliran`, ...get().gameLogs] 
        });
        
        setTimeout(() => {
          processNext((idx + 1) % get().players.length);
        }, 1500);
        return;
      }

      if (player.isFainted) {
        set({ turnIdx: idx, phase: 'RECOVERY_WAITING', isAutoZoomEnabled: false });
        if (player.name !== 'Tester') {
          set({ gameLogs: [`Giliran ${player.name} (Tumbang)`, ...get().gameLogs] });
        }
        return;
      }

      set({ turnIdx: idx, phase: 'WAITING_ROLL', isAutoZoomEnabled: false });
      soundEngine.playSound('turn_start');
      if (player.name !== 'Tester') {
        set({ gameLogs: [`Giliran ${player.name}!`, ...get().gameLogs] });
      }
    };

    processNext(nextIdx);
  },

  setAutoZoomEnabled: (val) => set({ isAutoZoomEnabled: val }),
  setInventoryOpen: (val) => set({ isInventoryOpen: val }),
  setTeleportMode: (val) => set({ isTeleportMode: val }),
  setLowGraphics: (val) => set({ isLowGraphics: val }),

  teleportToTile: (tileId) => {
    console.log("[TELEPORT] Teleporting to tile:", tileId);
    const { players, turnIdx } = get();
    const updatedPlayers = [...players];
    const player = { ...updatedPlayers[turnIdx] };

    player.positionTileId = tileId;
    player.isMoving = false;
    updatedPlayers[turnIdx] = player;
    soundEngine.playSound('move');

    set({
      players: updatedPlayers,
      phase: 'ACTION',
      isTeleportMode: false,
      gameLogs: [`[TEST] Teleport ke petak ${tileId}`, ...get().gameLogs]
    });

    
    const opponentsOnTile = updatedPlayers.filter(p => p.id !== player.id && p.positionTileId === tileId && !p.isFainted);
    if (opponentsOnTile.length > 0) {
      set({
        pendingOpponentIds: opponentsOnTile.map(o => o.id),
        remainingSteps: 0 
      });
      get().startDuelInvitation();
      return;
    }

    get().resolveTile();
  },

  checkWinner: () => {
    const { players } = get();
    const winner = players.find(p => p.artifacts >= GAME_CONFIG.WIN_ARTIFACTS_GOAL);
    if (winner) {
      set({ winner, phase: 'WIN' });
      
      if (winner.playerNum === 1) {
        useStore.getState().addStars(400);
      }
      return true;
    }
    return false;
  },

  cheatAddCard: (cardId) => {
    const { players, turnIdx } = get();
    const cardTemplate = actionCards.find(c => c.id === cardId);
    if (!cardTemplate) return;

    const updatedPlayers = [...players];
    const player = { ...updatedPlayers[turnIdx] };
    if (player.inventory.length >= 3) return;

    const newCard = { ...cardTemplate, instanceId: Math.random().toString(36).substr(2, 9) };
    player.inventory.push(newCard);
    updatedPlayers[turnIdx] = player;
    set({ players: updatedPlayers, gameLogs: [`[TEST] Menambah kartu ${cardTemplate.name}`, ...get().gameLogs] });
  },

  cheatRemoveCard: (instanceId) => {
    const { players, turnIdx } = get();
    const updatedPlayers = [...players];
    const player = { ...updatedPlayers[turnIdx] };
    player.inventory = player.inventory.filter(c => c.instanceId !== instanceId);
    updatedPlayers[turnIdx] = player;
    set({ players: updatedPlayers });
  },

  cheatSetStat: (stat, val) => {
    const { players, turnIdx } = get();
    const updatedPlayers = [...players];
    const player = { ...updatedPlayers[turnIdx] };

    
    const activeStat = stat === 'pijar' ? 'koin' : stat;
    const oldVal = player[activeStat] || 0;
    player[activeStat] = val;

    if (activeStat === 'koin') {
      if (val < oldVal) get().triggerPijarLose();
      else get().triggerPijarFly();
    }
    if (activeStat === 'tekad') {
      if (val < oldVal) get().triggerTekadLose();
      else get().triggerTekadFly();
    }

    updatedPlayers[turnIdx] = player;
    set({ players: updatedPlayers });
  }
}));
