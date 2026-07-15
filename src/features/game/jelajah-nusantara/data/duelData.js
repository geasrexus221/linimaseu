import { tarikTambangDuelThemes } from '../../tarik-tambang/data/tarikTambangDuelData';

// Map ipasTheme categories to duelThemes and ipasDuelThemes dynamically
const ipasTheme = tarikTambangDuelThemes.find(t => t.id === 'ipas') || { categories: [] };
const ipasCategories = ipasTheme.categories || [];

// Category 'Sejarah, Geografi, dan Kekayaan Alam' -> mapped to duelThemes (history)
const sejarahCategory = ipasCategories.find(c => c.name.toLowerCase().includes('sejarah')) || { questions: [] };
export const duelThemes = [
  {
    id: 'sejarah_umum',
    name: 'Sejarah & Geografi',
    icon: '🏛️',
    color: '#F59E0B',
    questions: sejarahCategory.questions
  }
];

// Other categories -> mapped to ipasDuelThemes
const otherCategories = ipasCategories.filter(c => !c.name.toLowerCase().includes('sejarah'));
export const ipasDuelThemes = otherCategories.map((cat, idx) => ({
  id: `ipas_cat_${idx}`,
  name: cat.name,
  icon: '🌱',
  color: '#10B981',
  questions: cat.questions
}));
