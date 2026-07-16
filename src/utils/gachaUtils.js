
export const GACHA_CONFIG = {
  CHANCE_EPIC: 5,
  CHANCE_RARE: 25,
  CHANCE_COMMON: 70
};


export const drawFromGachaPool = (pool, count) => {
  const commonPool = pool.filter(i => i.rarity === 'common');
  const rarePool = pool.filter(i => i.rarity === 'rare');
  const epicPool = pool.filter(i => i.rarity === 'epic');

  const drawn = [];
  
  for(let i = 0; i < count; i++) {
    const rng = Math.random() * 100;
    let selected;

    if (rng < GACHA_CONFIG.CHANCE_EPIC) {
      
      selected = epicPool[Math.floor(Math.random() * epicPool.length)];
    } else if (rng < (GACHA_CONFIG.CHANCE_EPIC + GACHA_CONFIG.CHANCE_RARE)) {
      
      selected = rarePool[Math.floor(Math.random() * rarePool.length)];
    } else {
      
      selected = commonPool[Math.floor(Math.random() * commonPool.length)];
    }

    if (selected) {
      drawn.push(selected);
    }
  }

  return drawn;
};
