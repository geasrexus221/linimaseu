import { create } from 'zustand';

export const useRightPanelStore = create((set) => ({
  
  panel: null,
  
  panelKey: null,

  setPanel: (panel, key) => set({ panel, panelKey: key }),
  clearPanel: () => set({ panel: null, panelKey: null }),
}));
