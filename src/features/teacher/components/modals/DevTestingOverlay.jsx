import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Trophy, CheckCircle2, AlertCircle, RefreshCcw,
  Map as MapIcon, Image as ImageIcon 
} from 'lucide-react';

// Helper function to map teacher's raw question schema into interactive playing formats
function mapQuestionToPlayFormat(q) {
  if (!q) return null;
  const type = q.questionType || 'CLASSIC';
  
  if (type === 'ANAGRAM') {
    return {
      id: q.id,
      type: 'anagram',
      question: q.text,
      wordAnswer: (q.options[0] || '').toUpperCase(),
      explanation: `Jawaban yang benar adalah "${q.options[0]}".`
    };
  } else if (type === 'MATCHING') {
    const pairs = q.options.filter(Boolean).map((opt, idx) => {
      const parts = opt.split(':');
      const leftText = parts[0] || '';
      const rightText = parts[1] || '';
      return {
        leftId: 'left-' + idx,
        leftText: leftText.trim(),
        rightId: 'right-' + idx,
        rightText: rightText.trim()
      };
    });
    const rightOptions = pairs.map(p => ({ id: p.rightId, text: p.rightText }));
    // Shuffle right options for authentic testing
    const shuffledRightOptions = [...rightOptions].sort(() => Math.random() - 0.5);
    return {
      id: q.id,
      type: 'matching',
      question: q.text,
      pairs,
      rightOptions: shuffledRightOptions,
      explanation: `Pasangan yang benar:\n` + pairs.map(p => `• ${p.leftText} ➔ ${p.rightText}`).join('\n')
    };
  } else if (type === 'CATEGORIZATION') {
    const partsA = (q.options[0] || '').split(':');
    const catAName = partsA[0] || 'Kategori A';
    const catAItemsStr = partsA[1] || '';
    
    const partsB = (q.options[1] || '').split(':');
    const catBName = partsB[0] || 'Kategori B';
    const catBItemsStr = partsB[1] || '';
    
    const categories = [
      { id: 'cat-a', name: catAName.trim() },
      { id: 'cat-b', name: catBName.trim() }
    ];
    const items = [];
    if (catAItemsStr) {
      catAItemsStr.split(',').forEach((item, idx) => {
        items.push({ id: 'item-a-' + idx, text: item.trim(), catId: 'cat-a' });
      });
    }
    if (catBItemsStr) {
      catBItemsStr.split(',').forEach((item, idx) => {
        items.push({ id: 'item-b-' + idx, text: item.trim(), catId: 'cat-b' });
      });
    }
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    return {
      id: q.id,
      type: 'categorization',
      question: q.text,
      categories,
      items: shuffledItems,
      explanation: `Kategori ${categories[0].name}: ${catAItemsStr || '-'}.\nKategori ${categories[1].name}: ${catBItemsStr || '-'}.`
    };
  } else if (type === 'BLANKS') {
    return {
      id: q.id,
      type: 'blanks',
      question: "Lengkapi kalimat berikut:",
      sentence: q.text,
      options: q.options.filter(Boolean),
      answer: q.options[q.correctAnswerIndex],
      explanation: `Kalimat lengkap yang benar: "${q.text.replace('____', q.options[q.correctAnswerIndex])}"`
    };
  } else {
    // CLASSIC MCQ
    return {
      id: q.id,
      type: 'choice',
      question: q.text,
      options: q.options.filter(Boolean),
      answer: q.correctAnswerIndex,
      explanation: `Jawaban yang benar adalah pilihan ${String.fromCharCode(65 + q.correctAnswerIndex)}: "${q.options[q.correctAnswerIndex]}".`
    };
  }
}

export default function DevTestingOverlay({
  testingQuestion,
  testingCollection,
  setTestingQuestion,
  setTestingCollection
}) {
  const [testingQuestionIndex, setTestingQuestionIndex] = useState(0);
  const [testingScore, setTestingScore] = useState(0);
  const [testingSelectedOption, setTestingSelectedOption] = useState(null);
  const [testingShowFeedback, setTestingShowFeedback] = useState(false);
  const [testingIsCorrect, setTestingIsCorrect] = useState(false);

  // States for interactive layouts
  const [matchingLeftSelected, setMatchingLeftSelected] = useState(null);
  const [matchingPairsDone, setMatchingPairsDone] = useState([]);
  const [hasMatchingError, setHasMatchingError] = useState(false);
  const [matchingWrongPair, setMatchingWrongPair] = useState(null); // { leftId, rightId }
  const [categorizationCurrentItemIdx, setCategorizationCurrentItemIdx] = useState(0);
  const [anagramLetters, setAnagramLetters] = useState([]);
  const [anagramSelected, setAnagramSelected] = useState([]);
  const [matchingLines, setMatchingLines] = useState([]);

  // Map raw question schema to play schema
  const currentMappedQuestion = useMemo(() => {
    return mapQuestionToPlayFormat(testingQuestion);
  }, [testingQuestion]);

  // Sync / Reset states when testingQuestion changes
  useEffect(() => {
    setTestingSelectedOption(null);
    setMatchingLeftSelected(null);
    setMatchingPairsDone([]);
    setHasMatchingError(false);
    setMatchingWrongPair(null);
    setCategorizationCurrentItemIdx(0);
    setTestingShowFeedback(false);
    setTestingIsCorrect(false);

    if (currentMappedQuestion && currentMappedQuestion.type === 'anagram') {
      const letters = currentMappedQuestion.wordAnswer.split('').map((char, idx) => ({
        id: idx,
        char
      }));
      const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);
      setAnagramLetters(shuffledLetters);
      setAnagramSelected([]);
    } else {
      setAnagramLetters([]);
      setAnagramSelected([]);
    }
  }, [testingQuestion, currentMappedQuestion]);

  // Hook to calculate matched pair coordinate lines
  useEffect(() => {
    if (currentMappedQuestion && currentMappedQuestion.type === 'matching') {
      const updateLines = () => {
        const container = document.getElementById('matching-container');
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        
        const newLines = matchingPairsDone.map(leftId => {
          const pair = currentMappedQuestion.pairs.find(p => p.leftId === leftId);
          if (!pair) return null;
          const leftEl = document.getElementById(`left-match-${leftId}`);
          const rightEl = document.getElementById(`right-match-${pair.rightId}`);
          
          if (leftEl && rightEl) {
            const leftRect = leftEl.getBoundingClientRect();
            const rightRect = rightEl.getBoundingClientRect();
            
            return {
              id: leftId,
              x1: leftRect.right - containerRect.left,
              y1: leftRect.top + leftRect.height / 2 - containerRect.top,
              x2: rightRect.left - containerRect.left,
              y2: rightRect.top + rightRect.height / 2 - containerRect.top
            };
          }
          return null;
        }).filter(Boolean);
        
        setMatchingLines(newLines);
      };

      updateLines();
      const t1 = setTimeout(updateLines, 50);
      const t2 = setTimeout(updateLines, 150);
      window.addEventListener('resize', updateLines);
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        window.removeEventListener('resize', updateLines);
      };
    } else {
      setMatchingLines([]);
    }
  }, [matchingPairsDone, testingQuestionIndex, currentMappedQuestion]);

  if (!testingQuestion || !currentMappedQuestion) return null;

  const submitAnswer = (correct) => {
    setTestingIsCorrect(correct);
    if (correct && testingCollection) {
      setTestingScore(prev => prev + 1);
    }
    setTestingShowFeedback(true);
  };

  // Click Handlers
  const handleChoiceAnswer = (index) => {
    if (testingShowFeedback) return;
    setTestingSelectedOption(index);
    const correct = index === currentMappedQuestion.answer;
    submitAnswer(correct);
  };

  const handleMatchingLeftClick = (itemId) => {
    if (testingShowFeedback || matchingPairsDone.includes(itemId) || matchingWrongPair) return;
    setMatchingLeftSelected(itemId);
  };

  const handleMatchingRightClick = (rightId) => {
    if (testingShowFeedback || !matchingLeftSelected || matchingWrongPair) return;
    const correctRightId = currentMappedQuestion.pairs.find(p => p.leftId === matchingLeftSelected)?.rightId;
    
    if (rightId === correctRightId) {
      const newDone = [...matchingPairsDone, matchingLeftSelected];
      setMatchingPairsDone(newDone);
      setMatchingLeftSelected(null);
      
      if (newDone.length === currentMappedQuestion.pairs.length) {
        submitAnswer(!hasMatchingError);
      }
    } else {
      setHasMatchingError(true);
      setMatchingWrongPair({ leftId: matchingLeftSelected, rightId });
      
      setTimeout(() => {
        setMatchingWrongPair(null);
        setMatchingLeftSelected(null);
      }, 1000);
    }
  };

  const handleCategorizationClick = (catId) => {
    if (testingShowFeedback) return;
    const currentItem = currentMappedQuestion.items[categorizationCurrentItemIdx];
    const correct = catId === currentItem.catId;
    
    if (correct) {
      if (categorizationCurrentItemIdx < currentMappedQuestion.items.length - 1) {
        setCategorizationCurrentItemIdx(prev => prev + 1);
      } else {
        submitAnswer(true);
      }
    } else {
      submitAnswer(false);
    }
  };

  const handleBlanksClick = (word) => {
    if (testingShowFeedback) return;
    setTestingSelectedOption(word);
    const correct = word === currentMappedQuestion.answer;
    submitAnswer(correct);
  };

  const handleSelectLetter = (letterObj) => {
    if (testingShowFeedback) return;
    const newSelected = [...anagramSelected, letterObj];
    setAnagramSelected(newSelected);
    
    if (newSelected.length === currentMappedQuestion.wordAnswer.length) {
      const spelled = newSelected.map(l => l.char).join('');
      const correct = spelled === currentMappedQuestion.wordAnswer;
      submitAnswer(correct);
    }
  };

  const handleRemoveSelectedLetter = (letterObj) => {
    if (testingShowFeedback) return;
    setAnagramSelected(prev => prev.filter(l => l.id !== letterObj.id));
  };

  const handleResetAnagram = () => {
    if (testingShowFeedback) return;
    setAnagramSelected([]);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => {
      setTestingQuestion(null);
      setTestingCollection(null);
    }}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="student-detail-modal"
        style={{ 
          width: '100%', 
          maxWidth: '560px', 
          background: 'var(--background-color)', 
          border: '2px solid var(--border-color)',
          padding: '24px', 
          borderRadius: '24px',
          position: 'relative', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '480px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Developer Testing Mode
            </div>
            <h3 style={{ margin: '4px 0 0 0', color: 'var(--text-color)', fontSize: '1.1rem', fontWeight: '800' }}>
              {testingCollection ? testingCollection.title : 'Pengujian Soal Tunggal'}
            </h3>
          </div>
          <button
            onClick={() => {
              setTestingQuestion(null);
              setTestingCollection(null);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar (if collection) */}
        {testingCollection && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '6px' }}>
              <span>Progress: Soal {testingQuestionIndex + 1} dari {testingCollection.questions.length}</span>
              <span>Skor: {testingScore * 10} ⭐</span>
            </div>
            <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                background: '#10B981', 
                width: `${((testingQuestionIndex + 1) / testingCollection.questions.length) * 100}%`,
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
        )}

        {/* Quiz Content Area */}
        {testingCollection && testingQuestionIndex >= testingCollection.questions.length ? (
          // Quiz Completed Screen
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', gap: '16px', padding: '20px 0' }}>
            <div style={{ background: '#10B98122', padding: '16px', borderRadius: '50%', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={64} />
            </div>
            <h2 style={{ color: 'var(--text-color)', fontWeight: '900', margin: 0 }}>Pengujian Selesai!</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
              Anda berhasil menjawab <strong>{testingScore}</strong> dari <strong>{testingCollection.questions.length}</strong> soal dengan benar.
            </p>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10B981', marginTop: '10px' }}>
              Skor Uji: {Math.round((testingScore / testingCollection.questions.length) * 100)}%
            </div>
            
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '20px' }}>
              <button
                onClick={() => {
                  setTestingQuestionIndex(0);
                  setTestingQuestion(testingCollection.questions[0]);
                  setTestingSelectedOption(null);
                  setTestingShowFeedback(false);
                  setTestingIsCorrect(false);
                  setTestingScore(0);
                }}
                style={{ flex: 1, padding: '12px', background: '#3B82F6', color: 'var(--text-color)', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
              >
                Uji Ulang
              </button>
              <button
                onClick={() => {
                  setTestingQuestion(null);
                  setTestingCollection(null);
                }}
                style={{ flex: 1, padding: '12px', background: '#EF4444', color: 'var(--text-color)', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          // Question Testing screen
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '16px' }}>
            
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tipe Soal: {testingQuestion.questionType || 'CLASSIC'}
            </div>

            <div style={{ color: 'var(--text-color)', fontSize: '1.1rem', fontWeight: '800', lineHeight: '1.4' }}>
              {currentMappedQuestion.type !== 'blanks' && currentMappedQuestion.question}
            </div>

            {/* Render Interactive Templates */}
            {currentMappedQuestion.type === 'choice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {currentMappedQuestion.options.map((opt, oIdx) => {
                  const isSelected = testingSelectedOption === oIdx;
                  const isCorrectOpt = currentMappedQuestion.answer === oIdx;
                  
                  let btnStyle = {
                    background: 'var(--card-bg)',
                    border: '2px solid var(--border-color)',
                    color: 'var(--text-color)'
                  };

                  if (testingShowFeedback) {
                    if (isCorrectOpt) {
                      btnStyle = {
                        background: '#064E3B33',
                        border: '2px solid #10B981',
                        color: '#34D399'
                      };
                    } else if (isSelected) {
                      btnStyle = {
                        background: '#7F1D1D33',
                        border: '2px solid #EF4444',
                        color: '#F87171'
                      };
                    }
                  } else if (isSelected) {
                    btnStyle = {
                      background: 'var(--border-color)',
                      border: '2px solid #f4c265',
                      color: 'var(--text-color)'
                    };
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={testingShowFeedback}
                      onClick={() => handleChoiceAnswer(oIdx)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '16px',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        cursor: testingShowFeedback ? 'default' : 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.15s',
                        ...btnStyle
                      }}
                    >
                      <span style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '8px', 
                        border: '2px solid', 
                        borderColor: 'inherit',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: '900',
                        color: 'var(--text-muted)'
                      }}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentMappedQuestion.type === 'matching' && (
              <div style={{ display: 'flex', gap: '20px', marginTop: '10px', position: 'relative' }} id="matching-container">
                {/* SVG lines overlay connecting pairs */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                  {matchingLines.map(line => (
                    <line 
                      key={line.id}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
                {/* Left Column */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentMappedQuestion.pairs.map(pair => {
                    const isSelected = matchingLeftSelected === pair.leftId;
                    const isDone = matchingPairsDone.includes(pair.leftId);
                    const isWrong = matchingWrongPair?.leftId === pair.leftId;
                    
                    let btnStyle = {
                      background: isDone ? '#064E3B33' : isWrong ? '#7F1D1D33' : isSelected ? '#1E2E4A' : '#111E36',
                      border: isDone ? '2px solid #10B981' : isWrong ? '2px solid #EF4444' : isSelected ? '2px solid #f4c265' : '2px solid #1E2E4A',
                      color: isDone ? '#34D399' : isWrong ? '#F87171' : '#FFF',
                      cursor: isDone || testingShowFeedback || !!matchingWrongPair ? 'default' : 'pointer',
                    };
                    
                    return (
                      <button
                        key={pair.leftId}
                        id={`left-match-${pair.leftId}`}
                        disabled={isDone || testingShowFeedback || !!matchingWrongPair}
                        onClick={() => handleMatchingLeftClick(pair.leftId)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          textAlign: 'center',
                          transition: 'all 0.15s',
                          ...btnStyle
                        }}
                      >
                        {pair.leftText}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentMappedQuestion.rightOptions.map(opt => {
                    const isDone = matchingPairsDone.some(leftId => currentMappedQuestion.pairs.find(p => p.leftId === leftId)?.rightId === opt.id);
                    const isWrong = matchingWrongPair?.rightId === opt.id;
                    
                    let btnStyle = {
                      background: isDone ? '#064E3B33' : isWrong ? '#7F1D1D33' : '#111E36',
                      border: isDone ? '2px solid #10B981' : isWrong ? '2px solid #EF4444' : '2px solid #1E2E4A',
                      color: isDone ? '#34D399' : isWrong ? '#F87171' : '#FFF',
                      cursor: isDone || testingShowFeedback || !!matchingWrongPair ? 'default' : 'pointer',
                    };
                    
                    return (
                      <button
                        key={opt.id}
                        id={`right-match-${opt.id}`}
                        disabled={testingShowFeedback || isDone || !!matchingWrongPair}
                        onClick={() => handleMatchingRightClick(opt.id)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          textAlign: 'center',
                          transition: 'all 0.15s',
                          ...btnStyle
                        }}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentMappedQuestion.type === 'categorization' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', width: '100%', background: '#1E2E4A33', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' }}>
                    KLASIFIKASIKAN BENDA INI:
                  </span>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#f4c265', marginTop: '8px' }}>
                    {currentMappedQuestion.items[categorizationCurrentItemIdx]?.text}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                  {currentMappedQuestion.categories.map(cat => (
                    <button
                      key={cat.id}
                      disabled={testingShowFeedback}
                      onClick={() => handleCategorizationClick(cat.id)}
                      style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'var(--card-bg)',
                        border: '2px solid var(--border-color)',
                        color: '#1CB0F6',
                        fontWeight: '800',
                        cursor: testingShowFeedback ? 'default' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>📥</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentMappedQuestion.type === 'blanks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                <div style={{ 
                  color: 'var(--text-color)', 
                  fontSize: '1.1rem', 
                  fontWeight: '700', 
                  lineHeight: '1.6',
                  background: '#1E2E4A22',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)'
                }}>
                  {currentMappedQuestion.sentence.split('____').map((part, idx, arr) => (
                    <React.Fragment key={idx}>
                      {part}
                      {idx < arr.length - 1 && (
                        <span style={{ 
                          borderBottom: '2px solid #f4c265', 
                          padding: '0 8px', 
                          color: '#f4c265', 
                          fontWeight: '900',
                          margin: '0 4px'
                        }}>
                          {testingSelectedOption || '.......'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {currentMappedQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={testingShowFeedback}
                      onClick={() => handleBlanksClick(opt)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '12px',
                        background: testingSelectedOption === opt ? '#f4c265' : '#111E36',
                        border: testingSelectedOption === opt ? '2px solid #d1a34b' : '2px solid #1E2E4A',
                        color: testingSelectedOption === opt ? 'white' : '#FFF',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: testingShowFeedback ? 'default' : 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentMappedQuestion.type === 'anagram' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                {/* Spelled letters slots */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  minHeight: '50px', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center', 
                  background: 'rgba(0,0,0,0.25)', 
                  padding: '12px', 
                  borderRadius: '16px', 
                  border: '2px dashed #1E2E4A', 
                  minWidth: '280px' 
                }}>
                  {Array.from({ length: currentMappedQuestion.wordAnswer.length }).map((_, idx) => {
                    const filledLetter = anagramSelected[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => filledLetter && handleRemoveSelectedLetter(filledLetter)}
                        disabled={testingShowFeedback}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: filledLetter ? '#f4c265' : '#111E36',
                          border: filledLetter ? '2px solid #d1a34b' : '2px solid #1E2E4A',
                          boxShadow: filledLetter ? '0 3px 0 #d1a34b' : 'none',
                          color: filledLetter ? 'white' : '#9CA3AF',
                          fontWeight: '900',
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: filledLetter ? 'pointer' : 'default',
                          transition: 'all 0.15s'
                        }}
                      >
                        {filledLetter ? filledLetter.char : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Letter pool to pick from */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '400px' }}>
                  {anagramLetters.map((letter) => {
                    const isPicked = anagramSelected.some(l => l.id === letter.id);
                    return (
                      <button
                        key={letter.id}
                        onClick={() => !isPicked && handleSelectLetter(letter)}
                        disabled={testingShowFeedback || isPicked}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: isPicked ? '#0F172A' : '#3B82F6',
                          border: isPicked ? '2px solid #1E2E4A' : '2px solid #1D4ED8',
                          boxShadow: isPicked ? 'none' : '0 3px 0 #1D4ED8',
                          color: isPicked ? '#4B5563' : 'white',
                          fontWeight: '900',
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isPicked ? 'default' : 'pointer',
                          transition: 'all 0.1s'
                        }}
                      >
                        {letter.char}
                      </button>
                    );
                  })}
                </div>

                {anagramSelected.length > 0 && !testingShowFeedback && (
                  <button 
                    onClick={handleResetAnagram}
                    style={{
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      fontWeight: '800',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 0 #DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '5px'
                    }}
                  >
                    <RefreshCcw size={12} /> RESET HURUF
                  </button>
                )}
              </div>
            )}

            {/* Feedback Panel */}
            {testingShowFeedback && (
              <div 
                style={{ 
                  marginTop: '20px', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  background: testingIsCorrect ? '#064E3B22' : '#7F1D1D22',
                  border: testingIsCorrect ? '1px solid #10B98144' : '1px solid #EF444444',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '1rem', color: testingIsCorrect ? '#34D399' : '#F87171' }}>
                  {testingIsCorrect ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span>{testingIsCorrect ? 'JAWABAN ANDA BENAR!' : 'JAWABAN ANDA SALAH'}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                  {currentMappedQuestion.explanation}
                </p>
                <button
                  onClick={() => {
                    if (testingCollection) {
                      // Go to next question or end
                      const nextIdx = testingQuestionIndex + 1;
                      setTestingQuestionIndex(nextIdx);
                      if (nextIdx < testingCollection.questions.length) {
                        setTestingQuestion(testingCollection.questions[nextIdx]);
                      }
                    } else {
                      // Close modal
                      setTestingQuestion(null);
                    }
                  }}
                  style={{ 
                    padding: '10px', 
                    background: testingIsCorrect ? '#10B981' : '#EF4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '10px', 
                    fontWeight: '800', 
                    cursor: 'pointer',
                    alignSelf: 'flex-end',
                    minWidth: '120px'
                  }}
                >
                  {testingCollection && testingQuestionIndex < testingCollection.questions.length - 1 ? 'SOAL BERIKUTNYA' : 'TUTUP PENGUJIAN'}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
