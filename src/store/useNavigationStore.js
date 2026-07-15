import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
  // Core State
  hasStarted: false,
  currentView: 'grid', // grid, chapter, vn, quiz
  activeChapter: null,
  selectedHero: null,
  
  // Quiz Navigation State
  quizSubView: 'hub', // hub, missions, themes, play, classroom
  selectedPillar: null,
  activeQuizTheme: null,
  quizQuestionCount: 10,
  selectedKelas: 'Semua', // 'Semua', 4, 5, 6

  // Game Navigation State
  gameSubView: 'arcade', // arcade, jelajah
  tarikTambangPlay: false,
  selectedGameId: null,
  jelajahSubView: 'intro', // intro, setup, playing
  profileSubView: 'main', // main, collection, avatar
  shopSubView: 'main', // main, opening
  shopCategory: 'cosmetic', // cosmetic, gacha, refill
  shopGachaCount: 1,
  
  // Actions
  setSelectedKelas: (kelas) => set({ selectedKelas: kelas }),
  setHasStarted: (val) => set({ hasStarted: val }),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  setSelectedHero: (hero) => set({ 
    selectedHero: hero,
    currentView: 'chapter' 
  }),
  
  setActiveChapter: (chapter) => set({ 
    activeChapter: chapter,
    currentView: 'vn'
  }),
  
  setQuizSubView: (view) => set({ quizSubView: view }),
  setShopSubView: (view) => set({ shopSubView: view }),
  setShopCategory: (cat) => set({ shopCategory: cat }),
  setShopGachaCount: (count) => set({ shopGachaCount: count }),
  
  setSelectedPillar: (pillar) => set({ 
    selectedPillar: pillar,
    quizSubView: 'themes'
  }),
  
  setActiveQuizTheme: (theme, count = 10) => set({ 
    activeQuizTheme: theme,
    quizQuestionCount: count,
    quizSubView: 'play'
  }),

  // Game Actions
  setGameSubView: (view) => set({ gameSubView: view }),
  setTarikTambangPlay: (val) => set({ tarikTambangPlay: val }),
  setJelajahSubView: (view) => set({ jelajahSubView: view }),
  setProfileSubView: (view) => set({ profileSubView: view }),
  setSelectedGameId: (id) => set({ selectedGameId: id }),

  // Navigation Helpers
  goBackToHeroGrid: () => set({ 
    currentView: 'grid',
    selectedHero: null,
    activeChapter: null 
  }),

  resetQuizView: () => set({
    quizSubView: 'hub',
    activeQuizTheme: null,
    selectedPillar: null
  })
}));
