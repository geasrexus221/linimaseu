/**
 * Gacha Probability Configuration
 * Standard Tier: 
 * - Common: 70%
 * - Rare: 25%
 * - Epic: 5%
 */
export const GACHA_CONFIG = {
  CHANCE_EPIC: 5,
  CHANCE_RARE: 25,
  CHANCE_COMMON: 70
};

/**
 * Draws random items from a pool based on tiered probability
 * @param {Array} pool - The full array of available items
 * @param {number} count - How many items to draw
 * @returns {Array} - The drawn items
 */
export const drawFromGachaPool = (pool, count) => {
  const commonPool = pool.filter(i => i.rarity === 'common');
  const rarePool = pool.filter(i => i.rarity === 'rare');
  const epicPool = pool.filter(i => i.rarity === 'epic');

  const drawn = [];
  
  for(let i = 0; i < count; i++) {
    const rng = Math.random() * 100;
    let selected;

    if (rng < GACHA_CONFIG.CHANCE_EPIC) {
      // Pick random from Epic pool
      selected = epicPool[Math.floor(Math.random() * epicPool.length)];
    } else if (rng < (GACHA_CONFIG.CHANCE_EPIC + GACHA_CONFIG.CHANCE_RARE)) {
      // Pick random from Rare pool
      selected = rarePool[Math.floor(Math.random() * rarePool.length)];
    } else {
      // Pick random from Common pool
      selected = commonPool[Math.floor(Math.random() * commonPool.length)];
    }

    if (selected) {
      drawn.push(selected);
    }
  }

  return drawn;
};
