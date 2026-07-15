import { create } from 'zustand';

export const useMakerStore = create((set, get) => ({
  // Map Data
  mapName: 'Peta Baru Saya',
  tiles: [],
  connections: [], // Redundant with tiles.next but kept for legacy sync if needed
  
  // UI State
  selectedId: null,
  activeTileType: 'jejak',
  tool: 'place', // place, connect, erase
  zoom: 1,
  botCount: 0,
  history: [],
  
  // Actions
  pushHistory: () => {
    const { tiles, history } = get();
    // Save a deep clone of the tiles to history
    set({ history: [...history.slice(-30), JSON.parse(JSON.stringify(tiles))] });
  },

  undo: () => {
    const { history } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({ 
      tiles: prev,
      history: history.slice(0, -1)
    });
  },

  resetMaker: () => set({
    tiles: [],
    history: [],
    selectedId: null,
    mapName: 'Peta Baru Saya'
  }),

  setMapData: (data) => set({ 
    mapName: data.name || 'Peta Baru', 
    tiles: data.tiles || [], 
    connections: data.connections || [] 
  }),
  
  setMapName: (name) => set({ mapName: name }),
  setActiveTileType: (type) => set({ activeTileType: type }),
  setBotCount: (count) => set({ botCount: count }),
  setZoom: (zoom) => set({ zoom }),
  setTool: (tool) => set({ tool }),
  
  addTile: (tile) => {
    get().pushHistory();
    set((state) => ({ tiles: [...state.tiles, tile] }));
  },
  
  updateTile: (id, updates) => {
    get().pushHistory();
    set((state) => ({
      tiles: state.tiles.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  },
  
  deleteTile: (id) => {
    get().pushHistory();
    set((state) => ({
      tiles: state.tiles.filter(t => t.id !== id).map(t => ({
        ...t,
        next: (t.next || []).filter(nid => nid !== id)
      })),
      selectedId: state.selectedId === id ? null : state.selectedId
    }));
  },
  
  toggleConnection: (fromId, toId) => {
    get().pushHistory();
    set(state => ({
      tiles: state.tiles.map(t => {
        if (t.id === fromId) {
          const next = t.next || [];
          const exists = next.includes(toId);
          return {
            ...t,
            next: exists ? next.filter(id => id !== toId) : [...next, toId]
          };
        }
        return t;
      })
    }));
  },

  setSelectedId: (id) => set({ selectedId: id })
}));
