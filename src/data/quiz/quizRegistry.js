import { wanitaPejuangQuestions } from './tokoh/wanita-pejuang';
import { IPAS_QUIZ_DATA } from '../ipasQuizData';

/**
 * QUIZ_REGISTRY maps Theme IDs to their respective question sets.
 * This makes it easy to add new themes by just importing and adding them here.
 */
export const QUIZ_REGISTRY = {
  ipas_cahaya: IPAS_QUIZ_DATA.questions, // IPAS Kelas 5 Cahaya dan Sifatnya
};

export const getQuizQuestions = (themeId) => {
  return QUIZ_REGISTRY[themeId] || [];
};
