import { GAME_CONFIG } from '../data/gameConfig';


export const aiEngine = {
  
  decideBaseChoice: (player) => {
    
    if (player.tekad < GAME_CONFIG.AI_STOP_AT_BASE_THRESHOLD) {
      return 'stop';
    }
    
    return Math.random() > 0.5 ? 'stop' : 'continue';
  },

  
  decideQuizAnswer: (question) => {
    
    return Math.floor(Math.random() * question.options.length);
  },

  
  shouldUseCard: (player) => {
    if (!player.inventory || player.inventory.length === 0) return null;
    
    
    if (Math.random() < 0.3) {
      return player.inventory[0].instanceId;
    }
    return null;
  }
};
