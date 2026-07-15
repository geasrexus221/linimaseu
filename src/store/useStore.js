import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SHOP_CATALOG } from '../data/shop/catalog';

export const useStore = create(
  persist(
    (set) => ({
      // Stats
      userName: 'Nama Siswa',
      userTitle: 'Pencari Jejak',
      theme: 'light',
      activeTab: 'dashboard',
      lastModuleId: null,
      selectedGrade: 5,
      selectedSubject: 'ipas',
      stars: 0,
      crowns: 0,
      streak: 5,
      maxStreak: 5,
      lastRegenTime: Date.now(),
      hearts: 5,
      maxHearts: 5,
      lastHeartRegenTime: Date.now(),
      ownedArtifacts: [],
      ownedCosmetics: [],
      equippedItems: { hat: null, clothes: null, accessory: null, border: null, quizTheme: null },
      avatarBaseImage: null,
      itemTransforms: { hat: { x: 0, y: 0, scale: 1 }, clothes: { x: 0, y: 0, scale: 1 }, accessory: { x: 0, y: 0, scale: 1 } },
      lastQuizResult: null,
      activeClass: null,
      soundEnabled: true,
      sfxVolume: 0.7,
      musicVolume: 0.5,
      isDevMode: false,
      
      // Progress
      unlockedNodes: ['cahaya-node-1'],
      claimedRewards: [],
      unlockedChapters: [1],
      completedChapters: [],
      
      // Teacher / Global
      globalAnnouncements: [
        {
          id: 'default-1',
          classId: 'ALL',
          className: 'Semua Kelas',
          message: 'Ujian Akhir Semester akan diadakan minggu depan. Harap mempersiapkan diri dan pelajari kembali seluruh materi pelajaran dengan sungguh-sungguh!',
          timestamp: '9 Jun 2026 08:00',
          type: 'warning'
        }
      ],
      
      // Actions
      setUserName: (name) => set({ userName: name }),
      setTheme: (theme) => set({ theme }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setSfxVolume: (val) => set({ sfxVolume: val }),
      setMusicVolume: (val) => set({ musicVolume: val }),
      setIsDevMode: (val) => set({ isDevMode: val }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setLastModuleId: (id) => set({ lastModuleId: id }),
      setSelectedGrade: (grade) => set({ selectedGrade: grade }),
      setSelectedSubject: (subject) => set({ selectedSubject: subject }),
      setLastQuizResult: (result) => set({ lastQuizResult: result }),
      setUnlockedNodes: (nodes) => set({ unlockedNodes: nodes }),
      claimReward: (nodeId) => set((state) => ({ claimedRewards: [...new Set([...state.claimedRewards, nodeId])] })),
      setActiveClass: (cls) => set({ activeClass: cls }),
      addStars: (amount) => set((state) => {
        const n = Math.max(0, state.stars + amount);
        return { stars: n, crowns: n };
      }),
      setStars: (val) => set({ stars: Math.max(0, val), crowns: Math.max(0, val) }),
      setStreak: (val) => set({ streak: Math.max(0, val) }),
      setMaxStreak: (val) => set({ maxStreak: val }),
      setGlobalAnnouncements: (announcements) => set({ globalAnnouncements: announcements }),
      addHearts: (amount) => set((state) => ({ hearts: Math.max(0, state.hearts + amount) })),
      useHeart: () => set((state) => ({ 
        hearts: Math.max(0, state.hearts - 1),
        lastHeartRegenTime: state.hearts >= state.maxHearts ? Date.now() : state.lastHeartRegenTime
      })),
      resetHearts: () => set({ hearts: 5 }),
      useObor: () => set((state) => ({ 
        streak: Math.max(0, state.streak - 1),
        lastRegenTime: state.streak >= state.maxStreak ? Date.now() : state.lastRegenTime
      })),
      checkRegen: () => set((state) => {
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;
        const updates = {};

        // Obor Regen
        if (state.streak < state.maxStreak) {
          const elapsed = now - state.lastRegenTime;
          if (elapsed >= thirtyMinutes) {
            const amountToAdd = Math.floor(elapsed / thirtyMinutes);
            updates.streak = Math.min(state.maxStreak, state.streak + amountToAdd);
            updates.lastRegenTime = state.lastRegenTime + (amountToAdd * thirtyMinutes);
          }
        } else {
          updates.lastRegenTime = now;
        }

        // Heart Regen
        if (state.hearts < state.maxHearts) {
          const elapsedHeart = now - state.lastHeartRegenTime;
          if (elapsedHeart >= thirtyMinutes) {
            const amountToAdd = Math.floor(elapsedHeart / thirtyMinutes);
            updates.hearts = Math.min(state.maxHearts, state.hearts + amountToAdd);
            updates.lastHeartRegenTime = state.lastHeartRegenTime + (amountToAdd * thirtyMinutes);
          }
        } else {
          updates.lastHeartRegenTime = now;
        }

        return Object.keys(updates).length > 0 ? updates : {};
      }),
      
      addArtifact: (artifact) => set((state) => {
        const existsIdx = state.ownedArtifacts.findIndex(a => a.id === artifact.id);
        if (existsIdx > -1) {
          const newArtifacts = [...state.ownedArtifacts];
          newArtifacts[existsIdx] = { 
            ...newArtifacts[existsIdx], 
            count: (newArtifacts[existsIdx].count || 0) + 1 
          };
          return { ownedArtifacts: newArtifacts };
        }
        return { ownedArtifacts: [...state.ownedArtifacts, { id: artifact.id, count: 1 }] };
      }),

      consumeArtifacts: (ids) => set((state) => {
        const newArtifacts = state.ownedArtifacts.map(a => {
          if (ids.includes(a.id)) {
            return { ...a, count: Math.max(0, (a.count || 0) - 1) };
          }
          return a;
        }).filter(a => a.count > 0);
        return { ownedArtifacts: newArtifacts };
      }),

      addCosmetic: (item) => set((state) => {
        const alreadyOwned = state.ownedCosmetics.some(c => c.id === item.id);
        if (alreadyOwned) return {};
        return { ownedCosmetics: [...state.ownedCosmetics, item] };
      }),

      equipItem: (category, itemId) => set((state) => ({
        equippedItems: { ...state.equippedItems, [category]: itemId }
      })),

      setAvatarBaseImage: (url) => set({ avatarBaseImage: url }),

      updateItemTransform: (category, transform) => set((state) => ({
        itemTransforms: {
          ...state.itemTransforms,
          [category]: { ...state.itemTransforms?.[category], ...transform }
        }
      })),

      completeChapter: (chapterId) => set((state) => {
        const nextChapterId = chapterId + 1;
        const newCompleted = [...new Set([...state.completedChapters, chapterId])];
        const newUnlocked = [...new Set([...state.unlockedChapters, nextChapterId])];
        
        return {
          completedChapters: newCompleted,
          unlockedChapters: nextChapterId <= 5 ? newUnlocked : state.unlockedChapters
        };
      }),

      unlockAllChapters: () => set((state) => {
        const n = state.stars + 5000;
        return { 
          unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          completedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          unlockedNodes: ['cahaya-node-1', 'cahaya-node-2', 'cahaya-node-3', 'cahaya-node-4', 'cahaya-node-5', 'cahaya-node-6', 'cahaya-node-7', 'cahaya-node-8', 'cahaya-node-9', 'cahaya-node-10', 'cahaya-node-11'],
          stars: n,
          crowns: n,
          streak: 5,
          ownedArtifacts: SHOP_CATALOG.gachaPool.map(item => ({ id: item.id, count: 5 })),
          ownedCosmetics: [...SHOP_CATALOG.cosmetics],
          lastRegenTime: Date.now(),
          lastHeartRegenTime: Date.now()
        };
      }),
      
      resetProgress: () => {
        set({ 
          unlockedChapters: [1], 
          completedChapters: [], 
          unlockedNodes: ['cahaya-node-1'],
          claimedRewards: [],
          stars: 0,
          crowns: 0,
          streak: 5,
          hearts: 5,
          ownedArtifacts: [],
          ownedCosmetics: [],
          equippedItems: { hat: null, clothes: null, accessory: null, border: null, quizTheme: null },
          avatarBaseImage: null,
          itemTransforms: { hat: { x: 0, y: 0, scale: 1 }, clothes: { x: 0, y: 0, scale: 1 }, accessory: { x: 0, y: 0, scale: 1 } },
          lastHeroId: null,
          lastQuizResult: null
        });
      }
    }),
    {
      name: 'lini-masa-storage',
    }
  )
);
