export const sifatCahayaPath = [
  {
    id: 'cahaya-node-1',
    type: 'material',
    title: 'Apa itu Cahaya?',
    icon: '💡',
    isUnlockedByDefault: true,
    content: {
      title: 'Mengenal Cahaya',
      sections: [
        {
          type: 'component',
          name: 'LightIntroAnimation'
        },
        {
          type: 'text',
          text: 'Tahukah kamu apa itu cahaya? Cahaya adalah energi berbentuk gelombang elektromagnetik yang kasat mata (bisa dilihat oleh mata). Tanpa cahaya, kita tidak bisa melihat benda-benda di sekitar kita!'
        },
        {
          type: 'highlight',
          text: 'Sumber cahaya terbesar di Bumi adalah Matahari. ☀️'
        }
      ]
    }
  },
  {
    id: 'cahaya-node-2',
    type: 'quiz',
    title: 'Kuis 1',
    icon: '🎯',
    isUnlockedByDefault: false,
    quizData: {
      question: 'Apa sumber cahaya alami terbesar bagi Bumi?',
      options: [
        { text: 'Lampu Senter', isCorrect: false },
        { text: 'Bulan', isCorrect: false },
        { text: 'Matahari', isCorrect: true },
        { text: 'Api Unggun', isCorrect: false }
      ]
    }
  },
  {
    id: 'cahaya-node-3',
    type: 'material',
    title: 'Sifat: Merambat Lurus',
    icon: '💡',
    isUnlockedByDefault: false,
    content: {
      title: 'Cahaya Merambat Lurus',
      sections: [
        {
          type: 'component',
          name: 'StraightLightAnimation'
        },
        {
          type: 'text',
          text: 'Pernahkah kamu melihat cahaya senter di malam hari? Cahayanya terlihat lurus ke depan, bukan? Ini karena salah satu sifat cahaya adalah merambat lurus.'
        }
      ]
    }
  },
  {
    id: 'cahaya-node-4',
    type: 'quiz',
    title: 'Kuis 2',
    icon: '🎯',
    isUnlockedByDefault: false,
    quizData: {
      question: 'Bagaimana arah rambatan cahaya senter ketika dinyalakan?',
      options: [
        { text: 'Berkelok-kelok', isCorrect: false },
        { text: 'Berputar-putar', isCorrect: false },
        { text: 'Merambat lurus', isCorrect: true },
        { text: 'Berbelok ke atas', isCorrect: false }
      ]
    }
  },
  {
    id: 'cahaya-node-5',
    type: 'material',
    title: 'Menembus Benda Bening',
    icon: '💡',
    isUnlockedByDefault: false,
    content: {
      title: 'Menembus Benda Bening',
      sections: [
        {
          type: 'component',
          name: 'TransparentLightAnimation'
        },
        {
          type: 'text',
          text: 'Cahaya dapat menembus benda bening seperti kaca jendela dan air jernih. Tapi, jika dihalangi benda gelap seperti tembok atau kayu, cahaya akan terhalang dan membentuk bayangan.'
        }
      ]
    }
  },
  {
    id: 'cahaya-node-6',
    type: 'quiz',
    title: 'Kuis 3',
    icon: '🎯',
    isUnlockedByDefault: false,
    quizData: {
      question: 'Benda mana yang dapat ditembus oleh cahaya?',
      options: [
        { text: 'Kaca jendela', isCorrect: true },
        { text: 'Pintu kayu', isCorrect: false },
        { text: 'Buku tebal', isCorrect: false },
        { text: 'Dinding bata', isCorrect: false }
      ]
    }
  },
  {
    id: 'cahaya-node-7',
    type: 'material',
    title: 'Sifat: Dipantulkan',
    icon: '💡',
    isUnlockedByDefault: false,
    content: {
      title: 'Cahaya Dapat Dipantulkan',
      sections: [
        {
          type: 'component',
          name: 'ReflectLightAnimation'
        },
        {
          type: 'text',
          text: 'Pernahkah kamu bercermin? Kamu bisa melihat dirimu karena cermin memantulkan cahaya yang mengenai tubuhmu kembali ke matamu. Sifat cahaya yang memantul jika mengenai benda ini disebut Pemantulan Cahaya.'
        }
      ]
    }
  },
  {
    id: 'cahaya-node-8',
    type: 'quiz',
    title: 'Kuis Akhir',
    icon: '🏆',
    isUnlockedByDefault: false,
    quizData: {
      question: 'Apa yang terjadi pada cahaya saat mengenai cermin datar?',
      options: [
        { text: 'Tembus ke belakang', isCorrect: false },
        { text: 'Diserap oleh cermin', isCorrect: false },
        { text: 'Dibiaskan (dibelokkan ke dalam)', isCorrect: false },
        { text: 'Dipantulkan kembali', isCorrect: true }
      ]
    }
  },
  {
    id: 'cahaya-node-9',
    type: 'material',
    title: 'Sifat: Dibiaskan',
    icon: '💡',
    isUnlockedByDefault: false,
    content: {
      title: 'Cahaya Dapat Dibiaskan (Dibelokkan)',
      sections: [
        {
          type: 'component',
          name: 'RefractLightAnimation'
        },
        {
          type: 'text',
          text: 'Pembiasan atau pembelokan cahaya terjadi ketika cahaya merambat melalui dua medium (zat) yang berbeda kerapatannya, misalnya dari udara ke air. Inilah yang menyebabkan pensil di dalam gelas air terlihat seolah-olah patah!'
        }
      ]
    }
  },
  {
    id: 'cahaya-node-10',
    type: 'quiz',
    title: 'Kuis Terakhir',
    icon: '🏆',
    isUnlockedByDefault: false,
    quizData: {
      question: 'Peristiwa pensil tampak patah saat dimasukkan ke dalam air merupakan contoh sifat cahaya yang dapat...',
      options: [
        { text: 'Dipantulkan', isCorrect: false },
        { text: 'Dibiaskan', isCorrect: true },
        { text: 'Merambat lurus', isCorrect: false },
        { text: 'Menembus benda bening', isCorrect: false }
      ]
    }
  },
  {
    id: 'cahaya-node-11',
    type: 'reward',
    title: 'Harta Karun',
    icon: '🎁',
    isUnlockedByDefault: false,
    rewardAmount: 500
  }
];

export const getModulePathData = (moduleId) => {
  if (moduleId === 'cahaya') return sifatCahayaPath;
  return []; 
};
