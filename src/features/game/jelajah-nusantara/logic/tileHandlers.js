import { GAME_CONFIG } from '../data/gameConfig';
import { quizBanks } from '../data/questions';
import { actionCards } from '../data/cards';
import { GUARDIANS } from '../data/guardians';
import { useGameStore } from '../../../../store/useGameStore';

/**
 * Handlers for each tile type
 * Returns a partial state to be applied to the store
 */
export const tileHandlers = {
  base: (player, tile) => {
    if (tile.owner !== player.playerNum) return null;
    
    const heal = GAME_CONFIG.BASE_HEAL_AMOUNT;
    return {
      activeEvent: {
        type: 'base',
        title: 'Markas Penjelajah',
        message: `Istirahat di Markas (+${heal} Tekad)`,
        icon: '🏠'
      },
      playerUpdate: { tekad: Math.min(100, player.tekad + heal) }
    };
  },

  peti: (player) => {
    const coinReward = (Math.floor(Math.random() * 4) + 2) * 10; // +20, 30, 40, or 50 Koin Emas
    const tekadHeal = 10;
    
    return {
      activeEvent: {
        type: 'peti',
        title: 'Peti Koin Emas',
        message: `Dapat +${coinReward} Koin Emas & +${tekadHeal} Tekad!`,
        icon: '🪙',
        reward: coinReward
      },
      playerUpdate: { 
        tekad: Math.min(100, player.tekad + tekadHeal),
        koin: player.koin + coinReward
      }
    };
  },

  jejak: () => {
    const themeId = useGameStore.getState().quizThemeId || 'ipas_4_5';
    const questions = quizBanks[themeId] || quizBanks.sejarah_umum;
    const question = questions[Math.floor(Math.random() * questions.length)];
    return {
      activeEvent: {
        type: 'jejak',
        title: 'Jejak Pengetahuan',
        message: `Kuis Sejarah: Jawab untuk +${GAME_CONFIG.QUIZ_KOIN_REWARD} Koin Emas!`,
        icon: '🪙',
        question,
        status: 'PENDING'
      }
    };
  },

  penjaga: () => {
    const guardian = GUARDIANS[Math.floor(Math.random() * GUARDIANS.length)];
    return {
      activeEvent: {
        type: 'penjaga',
        title: 'Tantangan Penjaga',
        message: `Dihadang ${guardian.name}! Kalahkan dia!`,
        icon: guardian.emoji,
        guardian,
        status: 'PENDING'
      }
    };
  },

  jebakan: (player) => {
    const penalty = (Math.floor(Math.random() * 3) + 2) * 10; // 20, 30, or 40 Tekad
    const newTekad = Math.max(0, player.tekad - penalty);
    const isFainted = newTekad <= 0;
    return {
      activeEvent: {
        type: 'jebakan',
        title: 'Jebakan Duri!',
        message: isFainted 
          ? 'Jebakan Duri! Kamu Tumbang!'
          : `Jebakan Duri! Tekad -${penalty}`,
        icon: '💔'
      },
      playerUpdate: {
        tekad: newTekad,
        isFainted,
        faintAttempts: isFainted ? 0 : (player.faintAttempts || 0),
        isSkippingTurn: false
      }
    };
  },

  jebakan_mundur: (player) => {
    const backSteps = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 steps back
    return {
      activeEvent: {
        type: 'jebakan_mundur',
        title: 'Jebakan Angin!',
        message: `Jebakan Angin! Mundur ${backSteps} langkah!`,
        icon: '🌬️',
        moveBack: backSteps
      },
      playerUpdate: {
        isSkippingTurn: false
      }
    };
  },

  jebakan_pijar: (player) => {
    const penalty = GAME_CONFIG.TRAP_KOIN_PENALTY;
    const newKoin = Math.max(0, player.koin - penalty);
    return {
      activeEvent: {
        type: 'jebakan_pijar',
        title: 'Lubang Koin Bocor!',
        message: `Kena Jebakan: Koin Emas berkurang ${penalty}!`,
        icon: '🪙'
      },
      playerUpdate: {
        koin: newKoin,
        isSkippingTurn: false
      }
    };
  },

  kartu: () => {
    const card = actionCards[Math.floor(Math.random() * actionCards.length)];
    return {
      activeEvent: {
        type: 'kartu',
        title: 'Kotak Kartu Aksi',
        message: `Dapat Kartu: ${card.name}!`,
        icon: '🃏',
        card
      }
    };
  }
};
