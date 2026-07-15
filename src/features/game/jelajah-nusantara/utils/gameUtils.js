/** 
 * Utility functions for Jelajah Nusantara 
 */

export const getPlayerColor = (id) => {
  const colors = {
    1: '#22C55E', // Green (Hijau)
    2: '#A855F7', // Purple (Ungu)
    3: '#FACC15', // Yellow (Kuning)
    4: '#3B82F6', // Blue (Biru)
  };
  return colors[id] || '#FFFFFF';
};

export const getEventColor = (type) => {
  const colors = {
    base: '#58CC02',
    peti: '#FFD700',
    jejak: '#3B82F6',
    penjaga: '#F59E0B',
    jebakan: '#EF4444',
    jebakan_mundur: '#06B6D4',
    jebakan_pijar: '#8B5CF6',
    kartu: '#EC4899',
    base_choice: '#10B981',
    base_storage: '#FFD700'
  };
  return colors[type] || '#FFFFFF';
};
