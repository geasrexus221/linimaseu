import { OFFICIAL_MAPS } from '../data/maps';

const CUSTOM_MAPS_KEY = 'nusantara_custom_maps';
const TEST_MAP_KEY = 'nusantara_test_map';

export const mapManager = {
  /**
   * Mengambil semua peta yang tersedia (Resmi + Buatan User)
   */
  getAllMaps: () => {
    const customMaps = mapManager.getCustomMaps();
    return [...OFFICIAL_MAPS, ...customMaps];
  },

  /**
   * Mengambil peta buatan user dari LocalStorage
   */
  getCustomMaps: () => {
    try {
      const saved = localStorage.getItem(CUSTOM_MAPS_KEY);
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      return parsed.map(map => ({
        ...map,
        isCustom: true,
        thumbnail: map.thumbnail || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400'
      }));
    } catch (e) {
      console.error('Gagal memuat peta kustom:', e);
      return [];
    }
  },

  /**
   * Menyimpan peta baru ke LocalStorage
   */
  saveCustomMap: (name, boardData) => {
    try {
      const customMaps = mapManager.getCustomMaps();
      const newMap = {
        id: `custom-${Date.now()}`,
        name: name || `Peta Buatan Saya ${customMaps.length + 1}`,
        description: 'Peta hasil desain dari Board Maker.',
        data: boardData,
        createdAt: new Date().toISOString(),
        difficulty: 'Kustom'
      };
      
      const updatedMaps = [newMap, ...customMaps];
      localStorage.setItem(CUSTOM_MAPS_KEY, JSON.stringify(updatedMaps));
      return newMap;
    } catch (e) {
      console.error('Gagal menyimpan peta kustom:', e);
      return null;
    }
  },

  /**
   * Menyimpan peta sementara untuk mode Test 3D dari Board Maker
   */
  saveTestMap: (boardData) => {
    try {
      localStorage.setItem(TEST_MAP_KEY, JSON.stringify(boardData));
      return true;
    } catch (e) {
      console.error('Gagal menyimpan test map:', e);
      return false;
    }
  },

  /**
   * Mengambil peta sementara untuk mode Test 3D
   */
  getTestMap: () => {
    try {
      const saved = localStorage.getItem(TEST_MAP_KEY);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (e) {
      console.error('Gagal memuat test map:', e);
      return null;
    }
  },

  /**
   * Menghapus peta kustom
   */
  deleteCustomMap: (id) => {
    try {
      const customMaps = mapManager.getCustomMaps();
      const filtered = customMaps.filter(m => m.id !== id);
      localStorage.setItem(CUSTOM_MAPS_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      return false;
    }
  }
};
