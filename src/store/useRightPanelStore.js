import { create } from 'zustand';

export const useRightPanelStore = create((set) => ({
  // The React component to render in the right panel (null = empty)
  panel: null,
  // A unique key identifying which panel is active (for debugging)
  panelKey: null,

  setPanel: (panel, key) => set({ panel, panelKey: key }),
  clearPanel: () => set({ panel: null, panelKey: null }),
}));
