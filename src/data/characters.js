export const GRADES = [
  { id: 4, name: 'Kelas 4' },
  { id: 5, name: 'Kelas 5' }
];

export const SUBJECTS = [
  { id: 'ipas', name: 'IPAS', icon: '🍃', color: '#58CC02' },
  { id: 'matematika', name: 'Matematika', icon: '📐', color: '#1CB0F6' },
  { id: 'bahasa', name: 'B. Indonesia', icon: '📚', color: '#f4c265' }
];

export const ALL_MODULES = [
  { 
    id: 'cahaya', 
    name: 'Sifat Cahaya', 
    subject: 'ipas', 
    grade: 5,
    icon: '💡', 
    active: true, 
    level: 5,
    desc: 'Mengenal sifat-sifat cahaya dan penglihatannya.'
  },
  { 
    id: 'gaya', 
    name: 'Gaya dan Gerak', 
    subject: 'ipas', 
    grade: 4,
    icon: '🧲', 
    active: false, 
    level: 0,
    desc: 'Pengaruh gaya terhadap gerak benda.'
  },
  { 
    id: 'ekosistem', 
    name: 'Ekosistem Harmonis', 
    subject: 'ipas', 
    grade: 5,
    icon: '🌴', 
    active: false, 
    level: 0,
    desc: 'Hubungan antarmakhluk hidup dalam ekosistem.'
  },
  { 
    id: 'pecahan', 
    name: 'Pecahan Senilai', 
    subject: 'matematika', 
    grade: 4,
    icon: '🍕', 
    active: false, 
    level: 0,
    desc: 'Memahami konsep dasar pecahan senilai.'
  },
  { 
    id: 'puisi', 
    name: 'Menulis Puisi', 
    subject: 'bahasa', 
    grade: 5,
    icon: '✍️', 
    active: false, 
    level: 0,
    desc: 'Ekspresikan perasaanmu lewat bait puisi.'
  }
];
