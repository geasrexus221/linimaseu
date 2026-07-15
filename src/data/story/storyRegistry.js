import { dewiSartikaStory } from './dewi-sartika';
import { dewiSartikaBio } from './dewi-sartika/bio';
import { dewiSartikaQuiz } from './dewi-sartika/quiz';

export const STORY_REGISTRY = {
  dewi: {
    story: dewiSartikaStory,
    bio: dewiSartikaBio,
    quiz: dewiSartikaQuiz
  },
  // Add more heroes here as they are developed
  patti: null,
  hasan: null,
  kartini: null,
  soekarno: null,
  hatta: null
};

export const getStoryData = (heroId) => {
  return STORY_REGISTRY[heroId] || null;
};
