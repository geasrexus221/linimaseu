import { GAME_CONFIG } from '../data/gameConfig';

/**
 * Logic for AI Bot decisions
 */
export const aiEngine = {
  /** Decide whether to stop or continue at a base */
  decideBaseChoice: (player) => {
    // If health is below threshold, definitely stop
    if (player.tekad < GAME_CONFIG.AI_STOP_AT_BASE_THRESHOLD) {
      return 'stop';
    }
    // Otherwise 50/50 chance
    return Math.random() > 0.5 ? 'stop' : 'continue';
  },

  /** Decide which quiz answer to pick */
  decideQuizAnswer: (question) => {
    // For now, random choice
    return Math.floor(Math.random() * question.options.length);
  },

  /** Decide whether to use a card */
  shouldUseCard: (player) => {
    if (!player.inventory || player.inventory.length === 0) return null;
    
    // 30% chance to use a card if they have one
    if (Math.random() < 0.3) {
      return player.inventory[0].instanceId;
    }
    return null;
  }
};
