import { tarikTambangDuelThemes } from '../../tarik-tambang/data/tarikTambangDuelData';

export const availableQuizThemes = [
  { id: 'sejarah_umum', name: 'Sejarah Umum', icon: '🏛️' },
  { id: 'ipas_4_5', name: 'IPAS (Sains) - Kelas 4 & 5', icon: '🔬' }
];

export const availableSubjects = [
  { id: 'sejarah', name: 'Sejarah', icon: '🏛️' },
  { id: 'ipas', name: 'IPAS (Sains)', icon: '🔬' }
];

export const availableClasses = [
  { id: 'umum', name: 'Umum / Semua Kelas' },
  { id: 'kelas_4_5', name: 'Kelas 4 & 5' }
];


const ipasTheme = tarikTambangDuelThemes.find(t => t.id === 'ipas') || { categories: [] };
const ipasCategories = ipasTheme.categories || [];


const sejarahCategory = ipasCategories.find(c => c.name.toLowerCase().includes('sejarah')) || { questions: [] };
const sejarahQuestions = sejarahCategory.questions.map((q, idx) => ({
  id: idx + 1,
  question: q.text,
  options: q.options,
  correct: q.correct
}));


const otherCategories = ipasCategories.filter(c => !c.name.toLowerCase().includes('sejarah'));
const ipasQuestions = [];
let qId = 101;
otherCategories.forEach(cat => {
  cat.questions.forEach(q => {
    ipasQuestions.push({
      id: qId++,
      question: q.text,
      options: q.options,
      correct: q.correct
    });
  });
});

export const quizBanks = {
  sejarah_umum: sejarahQuestions,
  ipas_4_5: ipasQuestions
};


export const historyQuestions = quizBanks.sejarah_umum;
