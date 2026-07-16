import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
  
  hasStarted: false,
  currentView: 'grid', 
  activeChapter: null,
  selectedHero: null,
  
  
  quizSubView: 'hub', 
  selectedPillar: null,
  activeQuizTheme: null,
  quizQuestionCount: 10,
  selectedKelas: 'Semua', 

  
  gameSubView: 'arcade', 
  tarikTambangPlay: false,
  selectedGameId: null,
  jelajahSubView: 'intro', 
  profileSubView: 'main', 
  shopSubView: 'main', 
  shopCategory: 'cosmetic', 
  shopGachaCount: 1,
  
  
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

  
  setGameSubView: (view) => set({ gameSubView: view }),
  setTarikTambangPlay: (val) => set({ tarikTambangPlay: val }),
  setJelajahSubView: (view) => set({ jelajahSubView: view }),
  setProfileSubView: (view) => set({ profileSubView: view }),
  setSelectedGameId: (id) => set({ selectedGameId: id }),

  
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
