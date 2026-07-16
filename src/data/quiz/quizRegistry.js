import { wanitaPejuangQuestions } from './tokoh/wanita-pejuang';
import { IPAS_QUIZ_DATA } from '../ipasQuizData';


export const QUIZ_REGISTRY = {
  ipas_cahaya: IPAS_QUIZ_DATA.questions, 
};

export const getQuizQuestions = (themeId) => {
  return QUIZ_REGISTRY[themeId] || [];
};
