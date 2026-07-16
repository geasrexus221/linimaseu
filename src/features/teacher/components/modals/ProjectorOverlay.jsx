import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ChevronRight, MonitorPlay, Palette } from 'lucide-react';

const THEMES = {
  MODERN: {
    name: 'Modern Blue',
    overlayBg: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    questionBg: 'transparent',
    questionBorder: 'none',
    questionTextColor: 'white',
    questionPadding: '0',
    optionBg: 'white',
    optionTextColor: '#333',
    optionBorder: '4px solid transparent',
    optionShadow: '0 10px 0 rgba(0,0,0,0.1)',
    optionRadius: '24px'
  },
  KELAS: {
    name: 'Ruang Kelas',
    overlayBg: '#DEB887', 
    questionBg: '#2F4F4F', 
    questionBorder: '12px solid #8B4513', 
    questionTextColor: '#F8F9FA', 
    questionPadding: '40px',
    optionBg: '#FFFDF0', 
    optionTextColor: '#111', 
    optionBorder: '1px solid #CBD5E1',
    optionShadow: '4px 4px 15px rgba(0,0,0,0.15)',
    optionRadius: '4px' 
  },
  LAUT: {
    name: 'Bawah Air',
    overlayBg: 'linear-gradient(to bottom, #0EA5E9, #0369A1, #082F49)',
    questionBg: 'rgba(255, 255, 255, 0.15)',
    questionBorder: '2px solid rgba(255,255,255,0.4)',
    questionTextColor: '#F0F9FF',
    questionPadding: '40px',
    optionBg: 'rgba(255, 255, 255, 0.9)',
    optionTextColor: '#0C4A6E',
    optionBorder: '2px solid #38BDF8',
    optionShadow: '0 8px 32px rgba(2, 132, 199, 0.4)',
    optionRadius: '40px'
  },
  ANGKASA: {
    name: 'Luar Angkasa',
    overlayBg: 'linear-gradient(to bottom, #0F172A, #1E1B4B, #000000)',
    questionBg: 'rgba(255, 255, 255, 0.05)',
    questionBorder: '2px solid rgba(139, 92, 246, 0.5)',
    questionTextColor: '#E2E8F0',
    questionPadding: '40px',
    optionBg: 'rgba(30, 41, 59, 0.8)',
    optionTextColor: '#C4B5FD',
    optionBorder: '2px solid #8B5CF6',
    optionShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
    optionRadius: '12px'
  },
  HUTAN: {
    name: 'Hutan Alam',
    overlayBg: 'linear-gradient(to bottom, #14532D, #064E3B)',
    questionBg: '#022C22',
    questionBorder: '4px solid #166534',
    questionTextColor: '#D1FAE5',
    questionPadding: '40px',
    optionBg: '#065F46',
    optionTextColor: '#A7F3D0',
    optionBorder: '2px solid #10B981',
    optionShadow: '0 10px 15px rgba(0,0,0,0.4)',
    optionRadius: '20px 4px 20px 4px'
  },
  GURUN: {
    name: 'Gurun Pasir',
    overlayBg: 'linear-gradient(to bottom, #F97316, #D97706, #B45309)',
    questionBg: '#FFF7ED',
    questionBorder: 'none',
    questionTextColor: '#7C2D12',
    questionPadding: '40px',
    optionBg: '#FFEDD5',
    optionTextColor: '#9A3412',
    optionBorder: '2px solid #FDBA74',
    optionShadow: '4px 4px 0 #EA580C',
    optionRadius: '8px'
  }
};

export default function ProjectorOverlay({ collection, initialThemeKey = 'MODERN', onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const theme = THEMES[initialThemeKey] || THEMES.MODERN;
  const activeThemeKey = initialThemeKey;

  
  if (!collection || !collection.questions || collection.questions.length === 0) {
    return (
      <div style={{ ...overlayStyle, background: theme.overlayBg }}>
        <div style={contentStyle}>
          <h2 style={{ color: 'white' }}>Kuis ini belum memiliki soal!</h2>
          <button onClick={onClose} style={closeButtonStyle}>Kembali</button>
        </div>
      </div>
    );
  }

  const currentQuestion = collection.questions[currentIndex];
  const isLastQuestion = currentIndex === collection.questions.length - 1;

  const handleOptionClick = (index) => {
    if (showSuccess || eliminatedOptions.includes(index)) return;

    if (index === currentQuestion.correctAnswerIndex) {
      setShowSuccess(true);
    } else {
      setEliminatedOptions(prev => [...prev, index]);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onClose();
    } else {
      setCurrentIndex(prev => prev + 1);
      setEliminatedOptions([]);
      setShowSuccess(false);
    }
  };

  return (
    <div style={{ ...overlayStyle, background: theme.overlayBg, transition: 'background 0.5s ease' }}>


      <div style={contentStyle}>
        <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, position: 'relative' }}>
          
          <div style={{ 
            background: activeThemeKey === 'KELAS' ? '#8B4513' : (activeThemeKey === 'LAUT' ? 'rgba(2, 132, 199, 0.5)' : (activeThemeKey === 'ANGKASA' ? 'rgba(139, 92, 246, 0.3)' : (activeThemeKey === 'HUTAN' ? '#064E3B' : (activeThemeKey === 'GURUN' ? '#EA580C' : 'rgba(255,255,255,0.1)')))), 
            backdropFilter: 'blur(12px)',
            padding: '12px 24px', borderRadius: '30px', 
            color: activeThemeKey === 'GURUN' ? '#FFF7ED' : 'rgba(255,255,255,0.9)',
            fontWeight: '800', fontSize: '1.2rem', marginBottom: '30px',
            border: (activeThemeKey === 'KELAS' || activeThemeKey === 'GURUN' || activeThemeKey === 'HUTAN') ? 'none' : '2px solid rgba(255,255,255,0.2)',
            boxShadow: activeThemeKey === 'KELAS' ? 'inset 0 0 10px rgba(0,0,0,0.5)' : 'none'
          }}>
            Soal {currentIndex + 1} dari {collection.questions.length}
          </div>

          <div style={{
            background: theme.questionBg,
            border: theme.questionBorder,
            padding: theme.questionPadding,
            borderRadius: activeThemeKey === 'KELAS' ? '8px' : (activeThemeKey === 'LAUT' ? '24px' : (activeThemeKey === 'ANGKASA' ? '16px' : (activeThemeKey === 'HUTAN' ? '40px 10px 40px 10px' : (activeThemeKey === 'GURUN' ? '12px' : '0')))),
            marginBottom: '60px',
            width: '100%',
            transition: 'all 0.5s ease',
            boxShadow: activeThemeKey === 'KELAS' ? 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.2)' : (activeThemeKey === 'LAUT' ? '0 10px 30px rgba(0,0,0,0.2)' : (activeThemeKey === 'HUTAN' ? '8px 8px 0 #064E3B' : (activeThemeKey === 'GURUN' ? '8px 8px 0 #EA580C' : 'none'))),
            backdropFilter: (activeThemeKey === 'LAUT' || activeThemeKey === 'ANGKASA') ? 'blur(10px)' : 'none'
          }}>
            <h1 style={{ 
              fontSize: '3rem', fontWeight: '900', color: theme.questionTextColor, 
              textAlign: 'center', margin: 0, 
              textShadow: activeThemeKey === 'KELAS' ? 'none' : '0 4px 20px rgba(0,0,0,0.3)',
              lineHeight: '1.3', transition: 'color 0.5s ease'
            }}>
              {currentQuestion.text}
            </h1>
          </div>

          <div style={{ 
            display: 'grid', gridTemplateColumns: currentQuestion.options.length > 2 ? '1fr 1fr' : '1fr', 
            gap: '24px', width: '100%' 
          }}>
            {currentQuestion.options.map((option, idx) => {
              const isEliminated = eliminatedOptions.includes(idx);
              const isCorrect = showSuccess && idx === currentQuestion.correctAnswerIndex;
              
              let bgColor = theme.optionBg;
              let textColor = theme.optionTextColor;
              let transform = 'scale(1)';
              let opacity = 1;
              let border = theme.optionBorder;
              let boxShadow = theme.optionShadow;

              if (isEliminated) {
                if (activeThemeKey === 'KELAS') {
                  bgColor = '#E2E8F0'; textColor = '#94A3B8'; border = '1px dashed #CBD5E1'; boxShadow = 'none';
                } else if (activeThemeKey === 'LAUT') {
                  bgColor = 'rgba(255,255,255,0.1)'; textColor = 'rgba(255,255,255,0.3)'; border = '2px dashed rgba(255,255,255,0.2)'; boxShadow = 'none';
                } else if (activeThemeKey === 'ANGKASA') {
                  bgColor = 'rgba(30,41,59,0.3)'; textColor = 'rgba(139,92,246,0.3)'; border = '2px dashed rgba(139,92,246,0.2)'; boxShadow = 'none';
                } else if (activeThemeKey === 'HUTAN') {
                  bgColor = '#064E3B'; textColor = '#065F46'; border = '2px dashed #065F46'; boxShadow = 'none';
                } else if (activeThemeKey === 'GURUN') {
                  bgColor = '#FED7AA'; textColor = '#FDBA74'; border = '1px dashed #FDBA74'; boxShadow = 'none';
                } else {
                  bgColor = 'rgba(255,255,255,0.1)'; textColor = 'rgba(255,255,255,0.3)'; border = '4px dashed rgba(255,255,255,0.2)'; boxShadow = 'none';
                }
                opacity = 0.5;
              } else if (isCorrect) {
                if (activeThemeKey === 'KELAS') {
                  bgColor = '#10B981'; textColor = 'white'; border = '1px solid #059669'; boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
                } else if (activeThemeKey === 'GURUN' || activeThemeKey === 'HUTAN') {
                  bgColor = '#10B981'; textColor = 'white'; border = 'none'; boxShadow = '8px 8px 0 #059669';
                } else {
                  bgColor = '#10B981'; textColor = 'white'; border = '4px solid #34D399'; boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
                }
                transform = 'scale(1.05)';
              }

              
              const rotateStr = activeThemeKey === 'KELAS' && !isCorrect && !isEliminated 
                ? `rotate(${idx % 2 === 0 ? '-2deg' : '2deg'})` 
                : 'rotate(0deg)';

              
              const floatAnimation = activeThemeKey === 'LAUT' && !isCorrect && !isEliminated
                ? { y: [0, -5, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 } }
                : {};

              return (
                <motion.button
                  key={idx}
                  whileHover={!isEliminated && !showSuccess ? { scale: 1.02 } : {}}
                  whileTap={!isEliminated && !showSuccess ? { scale: 0.98 } : {}}
                  animate={floatAnimation}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isEliminated || showSuccess}
                  style={{
                    background: bgColor,
                    color: textColor,
                    border: border,
                    padding: '30px 40px',
                    borderRadius: theme.optionRadius,
                    fontSize: '1.6rem',
                    fontWeight: '800',
                    cursor: (isEliminated || showSuccess) ? 'default' : 'pointer',
                    opacity: opacity,
                    transform: `${transform} ${rotateStr}`,
                    transition: 'all 0.3s ease',
                    boxShadow: boxShadow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '120px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  
                  {activeThemeKey === 'KELAS' && !isCorrect && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', 
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #CBD5E1 29px, #CBD5E1 30px)',
                      opacity: 0.4
                    }} />
                  )}
                  {activeThemeKey === 'KELAS' && !isCorrect && (
                    <div style={{ position: 'absolute', top: 0, left: '30px', width: '2px', bottom: 0, pointerEvents: 'none', 
                      background: 'rgba(239, 68, 68, 0.3)',
                      opacity: 0.8
                    }} />
                  )}
                  
                  {activeThemeKey === 'LAUT' && !isEliminated && (
                    <div style={{ position: 'absolute', top: '10px', left: '15px', width: '15px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', transform: 'rotate(-20deg)', pointerEvents: 'none' }} />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{option}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  position: 'fixed', bottom: '60px', left: '50%', transform: 'translateX(-50%)',
                  background: 'white', padding: '24px 48px', borderRadius: '30px',
                  display: 'flex', alignItems: 'center', gap: '24px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.4)', zIndex: 20,
                  border: '4px solid #10B981'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#10B981', fontWeight: '900', fontSize: '2rem' }}>
                  <CheckCircle size={40} /> BENAR!
                </div>
                <div style={{ width: '2px', height: '50px', background: '#E5E7EB' }} />
                <button
                  onClick={handleNext}
                  style={{
                    background: '#1CB0F6', color: 'white', border: 'none',
                    padding: '16px 32px', borderRadius: '20px', fontSize: '1.5rem',
                    fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px',
                    cursor: 'pointer', boxShadow: '0 6px 0 #0284C7'
                  }}
                >
                  {isLastQuestion ? 'Selesai Kuis' : 'Lanjut Soal'} <ChevronRight size={28} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      
      <div style={{ position: 'absolute', top: '24px', left: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: activeThemeKey === 'KELAS' ? '#4A3000' : 'white', zIndex: 99999, transition: 'color 0.5s ease', pointerEvents: 'none' }}>
        <MonitorPlay size={28} />
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Mode Proyektor: {collection.title}</h2>
      </div>
      
      <div style={{ position: 'absolute', top: '24px', right: '32px', display: 'flex', gap: '12px', zIndex: 99999, pointerEvents: 'auto' }}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white',
            padding: '12px 20px', borderRadius: '16px', fontWeight: '800',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '1rem', backdropFilter: 'blur(10px)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}
        >
          <X size={20} /> Tutup
        </button>
      </div>

      
      <AnimatePresence>
        {activeThemeKey === 'KELAS' && (
          <motion.div 
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            exit={{ y: 150 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '120px', pointerEvents: 'none', zIndex: 2 }}
          >
            
            <div style={{ 
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', 
              background: 'linear-gradient(to bottom, #A0522D, #8B4513)', 
              borderTop: '8px solid #CD853F', 
              boxShadow: '0 -10px 20px rgba(0,0,0,0.3)' 
            }} />
            
            
            <div style={{ 
              position: 'absolute', bottom: '70px', right: '15%', width: '60px', height: '60px', 
              background: 'radial-gradient(circle at 30% 30%, #FF6B6B, #DC2626)', 
              borderRadius: '50%', boxShadow: '10px 10px 15px rgba(0,0,0,0.4)',
              transformOrigin: 'bottom center'
            }}>
              
              <div style={{ position: 'absolute', top: '-10px', left: '26px', width: '6px', height: '16px', background: '#5C4033', borderRadius: '3px', transform: 'rotate(15deg)' }} />
              
              <div style={{ position: 'absolute', top: '-6px', left: '30px', width: '22px', height: '12px', background: '#22C55E', borderRadius: '12px 0 12px 0', transform: 'rotate(-15deg)', boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.3)' }} />
              
              <div style={{ position: 'absolute', top: '10px', left: '12px', width: '15px', height: '10px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', transform: 'rotate(-30deg)' }} />
            </div>

            
            <div style={{ 
              position: 'absolute', bottom: '74px', right: '28%', width: '140px', height: '16px', 
              display: 'flex', transform: 'rotate(-10deg)', boxShadow: '5px 8px 12px rgba(0,0,0,0.3)' 
            }}>
              
              <div style={{ width: '18px', height: '100%', background: '#FCA5A5', borderRadius: '4px 0 0 4px', border: '1px solid #F87171' }} />
              
              <div style={{ width: '12px', height: '100%', background: 'linear-gradient(to bottom, #9CA3AF, #D1D5DB, #9CA3AF)' }} />
              
              <div style={{ flex: 1, background: 'linear-gradient(to bottom, #FBBF24, #F59E0B, #D97706)', borderTop: '1px solid #FCD34D', borderBottom: '1px solid #B45309' }}>
                 
                 <div style={{ width: '100%', height: '33%', background: 'rgba(0,0,0,0.05)', marginTop: '25%' }} />
              </div>
              
              <div style={{ width: '30px', height: '100%', background: '#FDE68A', clipPath: 'polygon(0 0, 100% 50%, 0 100%)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                 
                 <div style={{ width: '8px', height: '4px', background: '#374151', marginRight: '0', clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
              </div>
            </div>

            
            <div style={{ 
              position: 'absolute', bottom: '65px', left: '18%', width: '220px', height: '35px', 
              background: 'linear-gradient(to bottom, #93C5FD, #60A5FA)', border: '1px solid #3B82F6', 
              borderRadius: '2px', transform: 'rotate(4deg)', display: 'flex', flexDirection: 'column', 
              justifyContent: 'flex-start', padding: '0 8px', boxShadow: '5px 8px 12px rgba(0,0,0,0.3)'
            }}>
              
              <div style={{ width: '100%', height: '8px', backgroundImage: 'repeating-linear-gradient(to right, #1E3A8A, #1E3A8A 2px, transparent 2px, transparent 15px)', marginTop: '2px' }} />
              <div style={{ width: '100%', height: '4px', backgroundImage: 'repeating-linear-gradient(to right, #1E3A8A, #1E3A8A 1px, transparent 1px, transparent 5px)' }} />
            </div>
            
            
            <div style={{ 
              position: 'absolute', bottom: '60px', left: '35%', width: '150px', height: '40px', 
              background: '#F8FAFC', borderRadius: '4px 4px 0 0', transform: 'rotate(-2deg)', 
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)', borderLeft: '10px solid #EF4444',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px',
              borderTop: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0'
            }}>
              <div style={{ width: '100%', height: '1px', background: '#CBD5E1', marginBottom: '8px' }} />
              <div style={{ width: '100%', height: '1px', background: '#CBD5E1', marginBottom: '8px' }} />
              <div style={{ width: '80%', height: '1px', background: '#CBD5E1' }} />
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {activeThemeKey === 'LAUT' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '150px', pointerEvents: 'none', zIndex: 2 }}
          >
            
            <div style={{ 
              position: 'absolute', bottom: 0, left: '-5%', width: '110%', height: '80px', 
              background: '#FDE047', borderRadius: '50% 50% 0 0 / 20px 20px 0 0',
              boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.1)'
            }} />
            
            
            <motion.div 
              animate={{ skewX: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', bottom: '60px', left: '10%', width: '15px', height: '90px', background: '#16A34A', borderRadius: '20px 20px 0 0', transformOrigin: 'bottom center' }} 
            />
            <motion.div 
              animate={{ skewX: [3, -3, 3] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', bottom: '65px', left: '12%', width: '12px', height: '60px', background: '#22C55E', borderRadius: '20px 20px 0 0', transformOrigin: 'bottom center' }} 
            />

            
            <motion.div 
              animate={{ skewX: [2, -2, 2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', bottom: '70px', right: '15%', width: '18px', height: '110px', background: '#15803D', borderRadius: '20px 20px 0 0', transformOrigin: 'bottom center' }} 
            />

            
            <motion.div 
              animate={{ x: [-50, 100, -50], y: [0, -10, 0] }}
              transition={{ x: { duration: 15, repeat: Infinity, ease: 'linear' }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
              style={{ position: 'absolute', bottom: '100px', left: '25%', display: 'flex', alignItems: 'center' }}
            >
              
              <div style={{ width: '15px', height: '20px', background: '#F97316', clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />
              
              <div style={{ width: '30px', height: '20px', background: '#FB923C', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}>
                
                <div style={{ position: 'absolute', right: '5px', top: '5px', width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}>
                   <div style={{ width: '2px', height: '2px', background: 'black', borderRadius: '50%', margin: '1px' }} />
                </div>
              </div>
            </motion.div>

            
            <motion.div animate={{ y: [0, -200], opacity: [0, 0.5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeOut', delay: 0.5 }} style={{ position: 'absolute', bottom: '90px', right: '20%', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }} />
            <motion.div animate={{ y: [0, -300], opacity: [0, 0.6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeOut', delay: 2 }} style={{ position: 'absolute', bottom: '80px', left: '12%', width: '15px', height: '15px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }} />
            <motion.div animate={{ y: [0, -150], opacity: [0, 0.4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }} style={{ position: 'absolute', bottom: '70px', left: '40%', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }} />

          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {activeThemeKey === 'ANGKASA' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '150px', pointerEvents: 'none', zIndex: 2 }}
          >
            
            <div style={{ position: 'absolute', bottom: '-40px', left: '-5%', width: '110%', height: '100px', background: '#475569', borderRadius: '50% 50% 0 0 / 100% 100% 0 0', boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.5)' }}>
              
              <div style={{ position: 'absolute', top: '20px', left: '15%', width: '30px', height: '15px', background: '#334155', borderRadius: '50%', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)' }} />
              <div style={{ position: 'absolute', top: '35px', left: '45%', width: '45px', height: '20px', background: '#334155', borderRadius: '50%', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)' }} />
              <div style={{ position: 'absolute', top: '15px', right: '25%', width: '20px', height: '10px', background: '#334155', borderRadius: '50%', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)' }} />
            </div>

            
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: '80px', left: '20%' }}>
              <div style={{ width: '30px', height: '60px', background: '#E2E8F0', borderRadius: '50% 50% 10px 10px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '15px', left: '10px', width: '10px', height: '10px', background: '#1E293B', border: '2px solid #94A3B8', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-5px', left: '-10px', width: '15px', height: '20px', background: '#EF4444', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
                <div style={{ position: 'absolute', bottom: '-5px', right: '-10px', width: '15px', height: '20px', background: '#EF4444', clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
                
                <motion.div animate={{ scaleY: [1, 1.3, 1] }} transition={{ duration: 0.1, repeat: Infinity }} style={{ position: 'absolute', bottom: '-15px', left: '8px', width: '14px', height: '20px', background: '#F59E0B', borderRadius: '0 0 50% 50%', transformOrigin: 'top center' }}>
                   <div style={{ position: 'absolute', bottom: '2px', left: '3px', width: '8px', height: '10px', background: '#FDE047', borderRadius: '0 0 50% 50%' }} />
                </motion.div>
              </div>
            </motion.div>

            
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '100px', right: '15%', width: '40px', height: '40px', background: 'radial-gradient(circle at 30% 30%, #8B5CF6, #4C1D95)', borderRadius: '50%', boxShadow: '0 0 15px rgba(139,92,246,0.4)' }}>
              <div style={{ position: 'absolute', top: '15px', left: '-10px', width: '60px', height: '10px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', transform: 'rotate(20deg)' }} />
            </motion.div>
            
            
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5 + (i * 0.5), repeat: Infinity, delay: i * 0.2 }} style={{ position: 'absolute', top: `${(i * 15) % 80}px`, left: `${10 + (i * 12)}%`, width: '3px', height: '3px', background: 'white', borderRadius: '50%', boxShadow: '0 0 5px white' }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {activeThemeKey === 'HUTAN' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '150px', pointerEvents: 'none', zIndex: 2 }}
          >
            
            <div style={{ position: 'absolute', bottom: 0, left: '-5%', width: '110%', height: '50px', background: '#065F46', clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 95% 10px, 90% 0, 85% 10px, 80% 0, 75% 10px, 70% 0, 65% 10px, 60% 0, 55% 10px, 50% 0, 45% 10px, 40% 0, 35% 10px, 30% 0, 25% 10px, 20% 0, 15% 10px, 10% 0, 5% 10px, 0 0)' }} />
            
            
            <div style={{ position: 'absolute', bottom: '20px', left: '10%', width: '25px', height: '120px', background: '#451A03' }}>
              <motion.div animate={{ rotate: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '-40px', left: '-35px', width: '90px', height: '90px', background: '#15803D', borderRadius: '50%', boxShadow: 'inset -10px -10px 0 rgba(0,0,0,0.2)' }} />
            </div>

            
            <div style={{ position: 'absolute', bottom: '20px', right: '15%', width: '15px', height: '80px', background: '#451A03' }}>
              <motion.div animate={{ rotate: [0, -3, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '-30px', left: '-25px', width: '60px', height: '60px', background: '#16A34A', borderRadius: '50%', boxShadow: 'inset -5px -5px 0 rgba(0,0,0,0.2)' }} />
            </div>

            
            <div style={{ position: 'absolute', bottom: '30px', left: '30%' }}>
              <div style={{ width: '10px', height: '20px', background: '#FEF3C7', margin: '0 auto' }} />
              <div style={{ width: '30px', height: '15px', background: '#EF4444', borderRadius: '15px 15px 0 0', position: 'absolute', top: '-5px', left: '-10px' }}>
                <div style={{ position: 'absolute', top: '3px', left: '5px', width: '5px', height: '5px', background: 'white', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '6px', right: '5px', width: '4px', height: '4px', background: 'white', borderRadius: '50%' }} />
              </div>
            </div>
            
            
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0, 1, 0], x: [0, (i%2===0?20:-20), 0], y: [0, -10, 0] }} transition={{ duration: 2 + i, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: `${40 + (i*15)}px`, left: `${20 + (i*10)}%`, width: '4px', height: '4px', background: '#FDE047', borderRadius: '50%', boxShadow: '0 0 8px #FDE047' }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {activeThemeKey === 'GURUN' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '180px', pointerEvents: 'none', zIndex: 2 }}
          >
            
            <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '120px', height: '60px', background: '#FDE047', borderRadius: '60px 60px 0 0', boxShadow: '0 0 40px #FDE047' }} />

            
            <div style={{ position: 'absolute', bottom: '0', left: '-10%', width: '70%', height: '80px', background: '#D97706', borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
            <div style={{ position: 'absolute', bottom: '0', right: '-10%', width: '60%', height: '100px', background: '#B45309', borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />

            
            <div style={{ position: 'absolute', bottom: '0', left: '-5%', width: '110%', height: '50px', background: '#F59E0B', borderRadius: '50% 50% 0 0 / 30px 30px 0 0' }} />

            
            <div style={{ position: 'absolute', bottom: '30px', left: '20%' }}>
              
              <div style={{ width: '16px', height: '60px', background: '#16A34A', borderRadius: '8px 8px 0 0' }}>
                 
                 <div style={{ position: 'absolute', top: '0', left: '4px', width: '2px', height: '100%', background: '#15803D' }} />
                 <div style={{ position: 'absolute', top: '0', right: '4px', width: '2px', height: '100%', background: '#15803D' }} />
              </div>
              
              <div style={{ position: 'absolute', bottom: '25px', left: '-12px', width: '12px', height: '20px', borderBottom: '16px solid #16A34A', borderLeft: '16px solid #16A34A', borderRadius: '0 0 0 8px' }} />
              <div style={{ position: 'absolute', bottom: '45px', left: '-12px', width: '16px', height: '15px', background: '#16A34A', borderRadius: '8px 8px 0 0' }} />
              
              <div style={{ position: 'absolute', bottom: '15px', right: '-12px', width: '12px', height: '20px', borderBottom: '16px solid #16A34A', borderRight: '16px solid #16A34A', borderRadius: '0 0 8px 0' }} />
              <div style={{ position: 'absolute', bottom: '35px', right: '-12px', width: '16px', height: '15px', background: '#16A34A', borderRadius: '8px 8px 0 0' }} />
            </div>

            
            <motion.div animate={{ rotate: 360, x: [0, 500] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '30px', left: '-50px', width: '25px', height: '25px', border: '3px dashed #B45309', borderRadius: '50%' }} />

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column'
};

const contentStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '60px',
  overflowY: 'auto'
};

const closeButtonStyle = {
  marginTop: '20px',
  padding: '12px 24px',
  background: 'white',
  color: '#3B82F6',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 'bold',
  cursor: 'pointer'
};
