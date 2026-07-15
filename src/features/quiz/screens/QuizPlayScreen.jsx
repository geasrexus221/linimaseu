import React, { useState, useEffect } from 'react';
import { X, Heart, Trophy, ChevronRight, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { ALL_QUIZ_QUESTIONS } from '../../../data/quizQuestions';
import QuizResult from '../../../components/quiz/QuizResult';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { keyboardManager } from '../../../utils/KeyboardManager';

export default function QuizPlayScreen({ 
  customTheme = null,
  customQuestions = null,
  onComplete = null,
  onQuit = null,
  hideConfetti = false
}) {
  const { setLastQuizResult, addStars, activeClass, equippedItems } = useStore();
  const equippedTheme = equippedItems?.quizTheme;
  const navigationStore = useNavigationStore();
  const theme = customTheme || navigationStore.activeQuizTheme;
  const setQuizSubView = navigationStore.setQuizSubView;
  const questionCount = navigationStore.quizQuestionCount || 10;
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [lives, setLives] = useState(5);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userOrder, setUserOrder] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  
  // States for new interactive types
  const [matchingLeftSelected, setMatchingLeftSelected] = useState(null);
  const [matchingPairsDone, setMatchingPairsDone] = useState([]); // Array of IDs
  const [hasMatchingError, setHasMatchingError] = useState(false);
  const [matchingWrongPair, setMatchingWrongPair] = useState(null); // { leftId, rightId }
  const [categorizationCurrentItemIdx, setCategorizationCurrentItemIdx] = useState(0);
  const [categorizationResults, setCategorizationResults] = useState({}); // itemIdx -> catId
  const [anagramLetters, setAnagramLetters] = useState([]);
  const [anagramSelected, setAnagramSelected] = useState([]);
  const [matchingLines, setMatchingLines] = useState([]);

  // Initialize and Shuffle Questions
  useEffect(() => {
    let rawQuestions = customQuestions || (theme && ALL_QUIZ_QUESTIONS[theme.id]);

    if (!customQuestions && !rawQuestions && activeClass && activeClass.assignments && activeClass.assignments.length > 0) {
      const currentTask = activeClass.assignments.find(a => a.themeId === theme?.id) || activeClass.assignments[0];
      if (currentTask && currentTask.questions) {
        rawQuestions = currentTask.questions;
      }
    }

    if (!rawQuestions) rawQuestions = [];
    
    // Normalize questions schema
    rawQuestions = rawQuestions.map(q => {
      // If already normalized, return as is
      if (q.type && q.question) return q;
      
      const type = q.questionType || 'CLASSIC';
      if (type === 'ANAGRAM') {
        return {
          id: q.id,
          type: 'anagram',
          question: q.text,
          wordAnswer: q.options[0].toUpperCase(),
          explanation: `Jawaban yang benar adalah "${q.options[0]}".`
        };
      } else if (type === 'MATCHING') {
        const pairs = q.options.filter(Boolean).map((opt, idx) => {
          const [leftText, rightText] = opt.split(':');
          return {
            leftId: 'left-' + idx,
            leftText: leftText.trim(),
            rightId: 'right-' + idx,
            rightText: rightText.trim()
          };
        });
        const rightOptions = pairs.map(p => ({ id: p.rightId, text: p.rightText }));
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
        const [catAName, catAItemsStr] = q.options[0].split(':');
        const [catBName, catBItemsStr] = q.options[1].split(':');
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
          explanation: `Kategori ${categories[0].name}: ${catAItemsStr || '-'}. Kategori ${categories[1].name}: ${catBItemsStr || '-'}.`
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
        return {
          id: q.id,
          type: 'choice',
          question: q.text,
          options: q.options.filter(Boolean),
          answer: q.correctAnswerIndex,
          explanation: `Jawaban yang benar adalah pilihan ${String.fromCharCode(65 + q.correctAnswerIndex)}.`
        };
      }
    });

    if (!rawQuestions) rawQuestions = [];
    
    // Fisher-Yates Shuffle
    const shuffled = [...rawQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const count = (theme.id.startsWith('assignment-') || !ALL_QUIZ_QUESTIONS[theme.id]) ? shuffled.length : questionCount;
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    setQuestions(selected);
  }, [theme.id, questionCount, activeClass]);

  useEffect(() => {
    if (isFinished) {
      const accuracy = Math.round((correctAnswersCount / questions.length) * 100);
      setLastQuizResult({
        themeTitle: theme.title,
        accuracy: accuracy,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      });
    }
  }, [isFinished, correctAnswersCount, questions.length, theme.title, setLastQuizResult]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  useEffect(() => {
    setSelectedOption(null);
    setUserOrder([]);
    setMatchingLeftSelected(null);
    setMatchingPairsDone([]);
    setHasMatchingError(false);
    setMatchingWrongPair(null);
    setCategorizationCurrentItemIdx(0);
    setCategorizationResults({});
    setShowFeedback(false);
    
    if (currentQuestion && currentQuestion.type === 'anagram') {
      const letters = currentQuestion.wordAnswer.split('').map((char, idx) => ({
        id: idx,
        char
      }));
      const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);
      setAnagramLetters(shuffledLetters);
      
      const len = currentQuestion.wordAnswer.length;
      const initialSelected = Array(len).fill(null);
      const numToPrefill = len > 5 ? 3 : 1;
      
      const indices = [];
      while(indices.length < numToPrefill) {
        const randIdx = Math.floor(Math.random() * len);
        if(!indices.includes(randIdx)) indices.push(randIdx);
      }
      
      indices.forEach(idx => {
        initialSelected[idx] = { ...letters[idx], isPrefilled: true };
      });
      
      setAnagramSelected(initialSelected);
    } else {
      setAnagramLetters([]);
      setAnagramSelected([]);
    }
  }, [currentIndex, currentQuestion]);

  // Hook to calculate matched pair coordinate lines
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'matching') {
      const updateLines = () => {
        const container = document.getElementById('matching-container');
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        
        const newLines = matchingPairsDone.map(leftId => {
          const pair = currentQuestion.pairs.find(p => p.leftId === leftId);
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
  }, [matchingPairsDone, currentIndex, currentQuestion]);

  const handleChoiceAnswer = (index) => {
    if (showFeedback) return;
    setSelectedOption(index);
    const correct = index === currentQuestion.answer;
    submitAnswer(correct);
  };

  const handleBooleanAnswer = (val) => {
    if (showFeedback) return;
    setSelectedOption(val);
    const correct = val === currentQuestion.answer;
    submitAnswer(correct);
  };

  const handleTimelineClick = (itemId) => {
    if (showFeedback || userOrder.includes(itemId)) return;
    const newOrder = [...userOrder, itemId];
    setUserOrder(newOrder);
    if (newOrder.length === currentQuestion.items.length) {
      const correct = JSON.stringify(newOrder) === JSON.stringify(currentQuestion.correctOrder);
      submitAnswer(correct);
    }
  };

  const handleMatchingLeftClick = (itemId) => {
    if (showFeedback || matchingPairsDone.includes(itemId) || matchingWrongPair) return;
    setMatchingLeftSelected(itemId);
  };

  const handleMatchingRightClick = (rightId) => {
    if (showFeedback || !matchingLeftSelected || matchingWrongPair) return;
    const correctRightId = currentQuestion.pairs.find(p => p.leftId === matchingLeftSelected)?.rightId;
    
    if (rightId === correctRightId) {
      const newDone = [...matchingPairsDone, matchingLeftSelected];
      setMatchingPairsDone(newDone);
      setMatchingLeftSelected(null);
      
      if (newDone.length === currentQuestion.pairs.length) {
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
    if (showFeedback) return;
    const currentItem = currentQuestion.items[categorizationCurrentItemIdx];
    const correct = catId === currentItem.catId;
    
    if (correct) {
      if (categorizationCurrentItemIdx < currentQuestion.items.length - 1) {
        setCategorizationCurrentItemIdx(prev => prev + 1);
      } else {
        submitAnswer(true);
      }
    } else {
      submitAnswer(false);
    }
  };

  const handleBlanksClick = (word) => {
    if (showFeedback) return;
    setSelectedOption(word);
    const correct = word === currentQuestion.answer;
    submitAnswer(correct);
  };

  const handleSelectLetter = (letterObj) => {
    if (showFeedback) return;
    const newSelected = [...anagramSelected];
    const firstEmptyIdx = newSelected.findIndex(l => l === null);
    if (firstEmptyIdx !== -1) {
      newSelected[firstEmptyIdx] = letterObj;
      setAnagramSelected(newSelected);
      
      if (newSelected.every(l => l !== null)) {
        const spelled = newSelected.map(l => l.char).join('');
        const correct = spelled === currentQuestion.wordAnswer;
        submitAnswer(correct);
      }
    }
  };

  const handleRemoveSelectedLetter = (letterObj) => {
    if (showFeedback || letterObj.isPrefilled) return;
    setAnagramSelected(prev => {
      const newSelected = [...prev];
      const idx = newSelected.findIndex(l => l && l.id === letterObj.id);
      if (idx !== -1) newSelected[idx] = null;
      return newSelected;
    });
  };

  const handleResetAnagram = () => {
    if (showFeedback) return;
    setAnagramSelected(prev => prev.map(l => (l && l.isPrefilled ? l : null)));
  };

  const submitAnswer = (correct) => {
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 10);
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      setLives(prev => prev - 1);
    }
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (lives <= 0) {
      setIsFinished(true);
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswersCount(0);
    setLives(5);
    setIsFinished(false);
    setShowFeedback(false);
    // Re-shuffle would happen because of useEffect on theme.id, but let's force it if needed
    // For now, it will use the same shuffled set or we can trigger re-shuffle
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      if (showFeedback) {
        if (e.key === 'Enter') nextQuestion();
        return;
      }

      if (currentQuestion?.type === 'choice') {
        const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
        if (keyMap[e.key] !== undefined && currentQuestion.options[keyMap[e.key]]) {
          handleChoiceAnswer(keyMap[e.key]);
        }
      }
    };

    keyboardManager.on('1', onKeyDown);
    keyboardManager.on('2', onKeyDown);
    keyboardManager.on('3', onKeyDown);
    keyboardManager.on('4', onKeyDown);
    keyboardManager.on('Enter', onKeyDown);

    return () => {
      keyboardManager.off('1', onKeyDown);
      keyboardManager.off('2', onKeyDown);
      keyboardManager.off('3', onKeyDown);
      keyboardManager.off('4', onKeyDown);
      keyboardManager.off('Enter', onKeyDown);
    };
  }, [showFeedback, currentIndex, currentQuestion, nextQuestion]);

  if (questions.length === 0) return (
    <div className="quiz-play-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3>Menyiapkan Soal...</h3>
        <p>Tunggu sebentar ya!</p>
      </div>
    </div>
  );

  return (
    <div className={`quiz-play-container ${equippedTheme ? equippedTheme : ''}`}>
      {isFinished && (
        <QuizResult 
          score={score}
          correctAnswers={correctAnswersCount}
          totalQuestions={questions.length}
          hideConfetti={hideConfetti}
          onFinish={() => {
            addStars(score);
            if (onComplete) {
              onComplete(score, correctAnswersCount);
            } else {
              setQuizSubView(activeClass ? 'classroom' : 'hub');
            }
          }}
          onRetry={handleRetry}
        />
      )}
      {/* Header */}
      <div className="quiz-play-header">
        <button className="quit-btn" onClick={() => {
          if (onQuit) onQuit();
          else setQuizSubView(activeClass ? 'classroom' : 'themes');
        }}>
          <X size={24} />
        </button>
        <div className="quiz-progress-wrapper">
          <div className="quiz-progress-bg">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="quiz-lives">
          <Heart fill="#ff4b4b" color="#ff4b4b" size={20} />
          <span>{lives}</span>
        </div>
      </div>

      <div className="quiz-content-area content-container">
        <span className="question-counter">SOAL {currentIndex + 1} DARI {questions.length}</span>
        <h2 className="quiz-question-text">{currentQuestion.question}</h2>

        {currentQuestion.type === 'choice' && (
          <div className="options-grid">
            {currentQuestion.options.map((opt, idx) => (
              <button 
                key={idx}
                className={`option-btn ${selectedOption === idx ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleChoiceAnswer(idx)}
                disabled={showFeedback}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{opt}</span>
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'boolean' && (
          <div className="boolean-grid">
            <button 
              className={`bool-btn true ${selectedOption === true ? (isCorrect ? 'correct' : 'wrong') : ''}`}
              onClick={() => handleBooleanAnswer(true)}
              disabled={showFeedback}
            >
              BENAR
            </button>
            <button 
              className={`bool-btn false ${selectedOption === false ? (isCorrect ? 'correct' : 'wrong') : ''}`}
              onClick={() => handleBooleanAnswer(false)}
              disabled={showFeedback}
            >
              SALAH
            </button>
          </div>
        )}

        {currentQuestion.type === 'timeline' && (
          <div className="timeline-area">
            <div className="timeline-slots">
              {currentQuestion.items.map((_, idx) => (
                <div key={idx} className="timeline-slot">
                  {userOrder[idx] ? (
                    <div className="ordered-item">
                      {currentQuestion.items.find(i => i.id === userOrder[idx]).text}
                    </div>
                  ) : (
                    <span className="slot-num">{idx + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="timeline-options">
              {currentQuestion.items.map((item) => (
                <button 
                  key={item.id}
                  className={`timeline-item-btn ${userOrder.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => handleTimelineClick(item.id)}
                  disabled={showFeedback}
                >
                  {item.text}
                </button>
              ))}
            </div>
            {userOrder.length > 0 && !showFeedback && (
              <button className="reset-timeline" onClick={() => setUserOrder([])}>
                <RefreshCcw size={16} /> RESET URUTAN
              </button>
            )}
          </div>
        )}

        {currentQuestion.type === 'matching' && (
          <div className="matching-area" id="matching-container" style={{ position: 'relative' }}>
            {/* SVG lines overlay connecting pairs */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
              {matchingLines.map(line => (
                <line 
                  key={line.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#58cc02"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <div className="matching-column">
              {currentQuestion.pairs.map(pair => {
                const isSelected = matchingLeftSelected === pair.leftId;
                const isDone = matchingPairsDone.includes(pair.leftId);
                const isWrong = matchingWrongPair?.leftId === pair.leftId;
                return (
                  <button 
                    key={pair.leftId}
                    id={`left-match-${pair.leftId}`}
                    className={`match-btn left ${isSelected ? 'selected' : ''} ${isDone ? 'done' : ''} ${isWrong ? 'wrong' : ''}`}
                    onClick={() => handleMatchingLeftClick(pair.leftId)}
                    disabled={showFeedback || isDone || !!matchingWrongPair}
                  >
                    {pair.leftText}
                  </button>
                );
              })}
            </div>
            <div className="matching-column">
              {currentQuestion.rightOptions.map(opt => {
                const isDone = matchingPairsDone.some(leftId => currentQuestion.pairs.find(p => p.leftId === leftId)?.rightId === opt.id);
                const isWrong = matchingWrongPair?.rightId === opt.id;
                return (
                  <button 
                    key={opt.id}
                    id={`right-match-${opt.id}`}
                    className={`match-btn right ${isDone ? 'done' : ''} ${isWrong ? 'wrong' : ''}`}
                    onClick={() => handleMatchingRightClick(opt.id)}
                    disabled={showFeedback || isDone || !!matchingWrongPair}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentQuestion.type === 'categorization' && (
          <div className="categorization-area">
            <div className="cat-item-display">
              <span className="cat-label">MANA KATEGORI YANG TEPAT?</span>
              <div className="cat-item-card">
                {currentQuestion.items[categorizationCurrentItemIdx].text}
              </div>
            </div>
            <div className="cat-buckets">
              {currentQuestion.categories.map(cat => (
                <button 
                  key={cat.id} 
                  className="cat-bucket-btn"
                  onClick={() => handleCategorizationClick(cat.id)}
                  disabled={showFeedback}
                >
                  <div className="bucket-icon">📥</div>
                  <span className="bucket-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentQuestion.type === 'blanks' && (
          <div className="blanks-area">
            <div className="sentence-display">
              {currentQuestion.sentence.split('____').map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  {part}
                  {idx < arr.length - 1 && (
                    <span className={`blank-space ${selectedOption ? 'filled' : ''}`}>
                      {selectedOption || '.......'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="blanks-options">
              {currentQuestion.options.map((opt, idx) => (
                <button 
                  key={idx}
                  className={`blank-opt-btn ${selectedOption === opt ? 'selected' : ''}`}
                  onClick={() => handleBlanksClick(opt)}
                  disabled={showFeedback}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentQuestion.type === 'anagram' && (
          <div className="anagram-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            {/* Spelled letters slots */}
            <div style={{ display: 'flex', gap: '8px', minHeight: '50px', flexWrap: 'wrap', justifyContent: 'center', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '16px', border: '2px dashed var(--border-color)', minWidth: '280px' }}>
              {Array.from({ length: currentQuestion.wordAnswer.length }).map((_, idx) => {
                const filledLetter = anagramSelected[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => filledLetter && handleRemoveSelectedLetter(filledLetter)}
                    disabled={showFeedback || (filledLetter && filledLetter.isPrefilled)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: filledLetter ? (filledLetter.isPrefilled ? '#58cc02' : '#f4c265') : 'var(--card-bg)',
                      border: filledLetter ? (filledLetter.isPrefilled ? '2px solid #46a302' : '2px solid #d1a34b') : '2px solid var(--border-color)',
                      boxShadow: filledLetter ? (filledLetter.isPrefilled ? '0 4px 0 #46a302' : '0 4px 0 #d1a34b') : 'none',
                      color: filledLetter ? 'white' : 'var(--text-muted)',
                      fontWeight: '900',
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: (filledLetter && !filledLetter.isPrefilled) ? 'pointer' : 'default',
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
                const isPicked = anagramSelected.some(l => l && l.id === letter.id);
                return (
                  <button
                    key={letter.id}
                    onClick={() => !isPicked && handleSelectLetter(letter)}
                    disabled={showFeedback || isPicked}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: isPicked ? '#1E2E4A' : '#3B82F6',
                      border: isPicked ? '2px solid #1E2E4A' : '2px solid #1D4ED8',
                      boxShadow: isPicked ? 'none' : '0 4px 0 #1D4ED8',
                      color: isPicked ? '#4B5563' : 'white',
                      fontWeight: '900',
                      fontSize: '1.2rem',
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

            {anagramSelected.length > 0 && !showFeedback && (
              <button 
                onClick={handleResetAnagram}
                style={{
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 3px 0 #DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '10px'
                }}
              >
                <RefreshCcw size={14} /> RESET HURUF
              </button>
            )}
          </div>
        )}
      </div>

      {showFeedback && (
        <div className={`feedback-overlay ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
          <div className="feedback-content">
            <div className="feedback-status">
              {isCorrect ? (
                <><CheckCircle2 size={32} /> <span>JAWABAN TEPAT!</span></>
              ) : (
                <><AlertCircle size={32} /> <span>JAWABAN SALAH</span></>
              )}
            </div>
            <div className="explanation-box">
              <strong>Tahukah Kamu?</strong>
              <p>{currentQuestion.explanation}</p>
            </div>
            <button className="next-soal-btn" onClick={nextQuestion}>
              {currentIndex < questions.length - 1 ? 'LANJUTKAN' : 'LIHAT SKOR AKHIR'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Chalkboard Background Textures & Scribbles */}
      {equippedTheme === 'theme-kelas' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          {/* Erased chalk dust spots */}
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: '150px', height: '100px', background: 'white', opacity: 0.05, filter: 'blur(30px)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '50%', right: '20%', width: '200px', height: '120px', background: 'white', opacity: 0.04, filter: 'blur(40px)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '30%', left: '40%', width: '180px', height: '80px', background: 'white', opacity: 0.04, filter: 'blur(35px)', borderRadius: '50%' }} />
          
          {/* Chalk scribbles / text */}
          <div style={{ position: 'absolute', top: '15%', left: '8%', opacity: 0.15, transform: 'rotate(-15deg)', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', fontSize: '1.4rem', color: 'white', letterSpacing: '2px' }}>x + y = 10</div>
          <div style={{ position: 'absolute', top: '25%', right: '12%', opacity: 0.12, transform: 'rotate(10deg)', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>1945</div>
          <div style={{ position: 'absolute', bottom: '45%', left: '5%', opacity: 0.1, transform: 'rotate(-5deg)', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', fontSize: '1.2rem', color: 'white' }}>Sejarah Nusantara</div>
          <div style={{ position: 'absolute', bottom: '35%', right: '8%', opacity: 0.15, transform: 'rotate(15deg)', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', fontSize: '1.6rem', color: 'white' }}>A, B, C...</div>
          
          {/* Faint chalk lines */}
          <div style={{ position: 'absolute', top: '40%', left: '20%', width: '120px', height: '2px', background: 'white', opacity: 0.1, transform: 'rotate(-25deg)', borderRadius: '2px', borderBottom: '1px dashed rgba(255,255,255,0.5)' }} />
          <div style={{ position: 'absolute', top: '65%', right: '25%', width: '90px', height: '3px', background: 'white', opacity: 0.08, transform: 'rotate(45deg)', borderRadius: '2px' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '35%', width: '150px', height: '2px', background: 'white', opacity: 0.06, transform: 'rotate(-5deg)', borderRadius: '2px', borderBottom: '2px dotted rgba(255,255,255,0.4)' }} />
        </div>
      )}

      {/* Decorative Classroom Elements for Student View */}
      {equippedTheme === 'theme-kelas' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
          <div style={{ transform: 'scale(0.8) translateY(10px)', transformOrigin: 'bottom center', width: '100%', height: '100%', position: 'absolute', bottom: 0 }}>
             {/* Apel */}
             <div style={{ position: 'absolute', bottom: '25px', right: '5%', width: '60px', height: '60px', background: 'radial-gradient(circle at 30% 30%, #FF6B6B, #DC2626)', borderRadius: '50%', boxShadow: '10px 10px 15px rgba(0,0,0,0.4)' }}>
               <div style={{ position: 'absolute', top: '-10px', left: '26px', width: '6px', height: '16px', background: '#5C4033', borderRadius: '3px', transform: 'rotate(15deg)' }} />
               <div style={{ position: 'absolute', top: '-6px', left: '30px', width: '22px', height: '12px', background: '#22C55E', borderRadius: '12px 0 12px 0', transform: 'rotate(-15deg)', boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.3)' }} />
               <div style={{ position: 'absolute', top: '10px', left: '12px', width: '15px', height: '10px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', transform: 'rotate(-30deg)' }} />
             </div>

             {/* Pensil */}
             <div style={{ position: 'absolute', bottom: '30px', right: '25%', width: '140px', height: '16px', display: 'flex', transform: 'rotate(-10deg)', boxShadow: '5px 8px 12px rgba(0,0,0,0.3)' }}>
               <div style={{ width: '18px', height: '100%', background: '#FCA5A5', borderRadius: '4px 0 0 4px', border: '1px solid #F87171' }} />
               <div style={{ width: '12px', height: '100%', background: 'linear-gradient(to bottom, #9CA3AF, #D1D5DB, #9CA3AF)' }} />
               <div style={{ flex: 1, background: 'linear-gradient(to bottom, #FBBF24, #F59E0B, #D97706)', borderTop: '1px solid #FCD34D', borderBottom: '1px solid #B45309' }}>
                 <div style={{ width: '100%', height: '33%', background: 'rgba(0,0,0,0.05)', marginTop: '25%' }} />
               </div>
               <div style={{ width: '30px', height: '100%', background: '#FDE68A', clipPath: 'polygon(0 0, 100% 50%, 0 100%)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                 <div style={{ width: '8px', height: '4px', background: '#374151', marginRight: '0', clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
               </div>
             </div>

             {/* Penggaris */}
             <div style={{ position: 'absolute', bottom: '20px', left: '10%', width: '180px', height: '35px', background: 'linear-gradient(to bottom, #93C5FD, #60A5FA)', border: '1px solid #3B82F6', borderRadius: '2px', transform: 'rotate(4deg)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '0 8px', boxShadow: '5px 8px 12px rgba(0,0,0,0.3)' }}>
               <div style={{ width: '100%', height: '8px', backgroundImage: 'repeating-linear-gradient(to right, #1E3A8A, #1E3A8A 2px, transparent 2px, transparent 15px)', marginTop: '2px' }} />
               <div style={{ width: '100%', height: '4px', backgroundImage: 'repeating-linear-gradient(to right, #1E3A8A, #1E3A8A 1px, transparent 1px, transparent 5px)' }} />
             </div>
          </div>
        </div>
      )}

      {/* THEME: LAUTAN */}
      {equippedTheme === 'theme-lautan' && (
        <>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', background: 'linear-gradient(to bottom, #006994, #003366)' }}>
            {/* Bubbles */}
            <div style={{ position: 'absolute', bottom: '-20px', left: '10%', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '50%', animation: 'floatUp 8s infinite ease-in' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', animation: 'floatUp 12s infinite ease-in 2s' }} />
            <div style={{ position: 'absolute', bottom: '-30px', right: '20%', width: '30px', height: '30px', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '50%', animation: 'floatUp 10s infinite ease-in 1s' }} />
            <div style={{ position: 'absolute', bottom: '-50px', right: '40%', width: '50px', height: '50px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%', animation: 'floatUp 15s infinite ease-in 3s' }} />

            {/* Light rays from top */}
            <div style={{ position: 'absolute', top: 0, left: '20%', width: '100px', height: '100%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)', transform: 'skewX(-20deg)' }} />
            <div style={{ position: 'absolute', top: 0, right: '30%', width: '150px', height: '100%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)', transform: 'skewX(15deg)' }} />

            {/* Fish / underwater life silhouette */}
            <div style={{ position: 'absolute', top: '30%', right: '10%', opacity: 0.2, fontSize: '3rem', transform: 'scaleX(-1)' }}>🐟</div>
            <div style={{ position: 'absolute', top: '50%', left: '15%', opacity: 0.15, fontSize: '2.5rem' }}>🐠</div>
            <div style={{ position: 'absolute', bottom: '15%', right: '25%', opacity: 0.2, fontSize: '4rem', transform: 'scaleX(-1)' }}>🦑</div>
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
            {/* Seabed with sand and coral */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '40px', background: '#e1c699', borderTop: '4px solid #c2a878', borderRadius: '100% 100% 0 0 / 20px 20px 0 0' }}>
              {/* Seaweeds */}
              <div style={{ position: 'absolute', bottom: '20px', left: '10%', width: '10px', height: '60px', background: '#2e8b57', borderRadius: '10px', transform: 'rotate(-10deg)', transformOrigin: 'bottom' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '12%', width: '12px', height: '40px', background: '#3cb371', borderRadius: '10px', transform: 'rotate(5deg)', transformOrigin: 'bottom' }} />
              <div style={{ position: 'absolute', bottom: '20px', right: '15%', width: '15px', height: '50px', background: '#20b2aa', borderRadius: '10px', transform: 'rotate(15deg)', transformOrigin: 'bottom' }} />
              {/* Starfish */}
              <div style={{ position: 'absolute', bottom: '5px', left: '40%', fontSize: '1.5rem', transform: 'rotate(20deg)' }}>⭐</div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .quiz-play-container {
          position: relative; width: 100%; height: 100%;
          background: var(--background-color);
          display: flex; flex-direction: column;
        }
        
        /* THEME: KELAS */
        .quiz-play-container.theme-kelas {
          background: #1B4332; /* Papan Tulis Hijau */
        }
        .quiz-play-container.theme-kelas .quiz-question-text {
          color: white;
          font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
          letter-spacing: 1px;
        }
        .quiz-play-container.theme-kelas .option-btn {
          background: rgba(255, 255, 255, 0.95);
          border-color: #8B4513;
          box-shadow: 0 4px 0 #5C2E0B;
        }
        .quiz-play-container.theme-kelas .option-text { color: #333; }
        .quiz-play-container.theme-kelas .question-counter { color: rgba(255, 255, 255, 0.7); }
        .quiz-play-container.theme-kelas .quit-btn { color: white; }
        .quiz-play-container.theme-kelas .quiz-progress-bg { background: rgba(255, 255, 255, 0.2); }
        .quiz-play-container.theme-kelas::after {
          content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 40px;
          background: #8B4513; border-top: 4px solid #5C2E0B; z-index: 0; pointer-events: none;
        }
        .quiz-play-container.theme-kelas .quiz-content-area { z-index: 1; padding-bottom: 60px; }

        /* THEME: LAUTAN */
        .quiz-play-container.theme-lautan {
          background: #004d73;
        }
        .quiz-play-container.theme-lautan .quiz-question-text {
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .quiz-play-container.theme-lautan .option-btn {
          background: rgba(255, 255, 255, 0.95);
          border-color: #0077be;
          box-shadow: 0 4px 0 #005f9e;
        }
        .quiz-play-container.theme-lautan .option-text { color: #003366; }
        .quiz-play-container.theme-lautan .question-counter { color: rgba(255, 255, 255, 0.8); }
        .quiz-play-container.theme-lautan .quit-btn { color: white; }
        .quiz-play-container.theme-lautan .quiz-progress-bg { background: rgba(0, 0, 0, 0.2); }
        .quiz-play-container.theme-lautan .quiz-progress-fill { background: #00bfff; }
        .quiz-play-container.theme-lautan .quiz-content-area { z-index: 1; padding-bottom: 60px; }

        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }

        .quiz-play-header { 
          padding: 20px; display: flex; align-items: center; gap: 15px; position: relative; z-index: 2; 
          width: 100%; max-width: 800px; margin: 0 auto;
        }
        .quit-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .quiz-progress-wrapper { flex: 1; }
        .quiz-progress-bg { height: 12px; background: var(--border-color); border-radius: 10px; overflow: hidden; }
        .quiz-progress-fill { height: 100%; background: #58cc02; border-radius: 10px; transition: width 0.3s; }
        .quiz-lives { display: flex; align-items: center; gap: 5px; font-weight: 900; color: #ff4b4b; }

        .quiz-content-area { 
          flex: 1; padding: 20px; text-align: center; overflow-y: auto; position: relative; z-index: 2; 
          width: 100%; max-width: 800px; margin: 0 auto;
        }
        .question-counter { font-weight: 900; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
        .quiz-question-text { font-weight: 900; font-size: 1.4rem; margin-top: 15px; margin-bottom: 25px; line-height: 1.3; color: var(--text-color); }

        .options-grid { display: flex; flex-direction: column; gap: 10px; }
        .option-btn {
          background: var(--card-bg); border: 2px solid var(--border-color);
          border-radius: 16px; padding: 14px; display: flex; align-items: center;
          gap: 15px; cursor: pointer; box-shadow: 0 4px 0 var(--border-color);
          transition: all 0.2s; text-align: left;
        }
        .option-letter {
          width: 30px; height: 30px; border: 2px solid var(--border-color);
          border-radius: 8px; display: flex; justify-content: center; align-items: center;
          font-weight: 900; color: var(--text-muted); font-size: 0.8rem;
        }
        .option-text { font-weight: 800; font-size: 0.95rem; color: var(--text-color); }
        .option-btn.correct { background: #d7ffb8; border-color: #58cc02; box-shadow: 0 4px 0 #58cc02; }
        .option-btn.wrong { background: #ffdfe0; border-color: #ff4b4b; box-shadow: 0 4px 0 #ff4b4b; }

        .boolean-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
        .bool-btn {
          padding: 30px; border-radius: 24px; border: 2px solid var(--border-color);
          font-weight: 900; font-size: 1.2rem; cursor: pointer; box-shadow: 0 6px 0 var(--border-color);
        }
        .bool-btn.true { color: #58cc02; background: white; }
        .bool-btn.false { color: #ff4b4b; background: white; }
        .bool-btn.correct { background: #d7ffb8 !important; border-color: #58cc02; box-shadow: 0 6px 0 #58cc02; color: #46a302; }
        .bool-btn.wrong { background: #ffdfe0 !important; border-color: #ff4b4b; box-shadow: 0 6px 0 #ff4b4b; color: #ea2b2b; }

        .timeline-area { display: flex; flex-direction: column; gap: 20px; }
        .timeline-slots { display: flex; flex-direction: column; gap: 10px; }
        .timeline-slot {
          background: var(--background-color); border: 2px dashed var(--border-color);
          border-radius: 16px; height: 60px; display: flex; justify-content: center; align-items: center;
        }
        .ordered-item {
          width: 100%; height: 100%; background: #1cb0f6; color: white;
          border-radius: 14px; display: flex; justify-content: center; align-items: center;
          font-weight: 900; font-size: 0.9rem; animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .slot-num { font-weight: 900; color: var(--border-color); opacity: 0.5; }
        .timeline-options { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 10px; }
        .timeline-item-btn {
          background: white; border: 2px solid var(--border-color); padding: 12px 18px;
          border-radius: 12px; font-weight: 800; font-size: 0.85rem; cursor: pointer;
          box-shadow: 0 4px 0 var(--border-color);
        }
        .timeline-item-btn.selected { opacity: 0.4; pointer-events: none; transform: translateY(4px); box-shadow: none; }
        .reset-timeline { background: none; border: none; color: #1cb0f6; font-weight: 900; font-size: 0.8rem; display: flex; align-items: center; gap: 5px; justify-content: center; cursor: pointer; }

        .feedback-overlay {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 800px;
          padding: 30px 20px 90px 20px; /* INCREASED BOTTOM PADDING FOR TAB BAR */
          border-top-left-radius: 32px; border-top-right-radius: 32px;
          z-index: 10; animation: slideUp 0.3s ease-out;
        }
        .feedback-overlay.is-correct { background: #d7ffb8; color: #46a302; }
        .feedback-overlay.is-wrong { background: #ffdfe0; color: #ea2b2b; }
        @keyframes slideUp { from { transform: translate(-50%, 100%); } to { transform: translate(-50%, 0); } }

        .feedback-status { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 1.2rem; margin-bottom: 15px; }
        .explanation-box { background: rgba(255,255,255,0.5); padding: 15px; border-radius: 16px; margin-bottom: 20px; text-align: left; }
        .explanation-box strong { display: block; margin-bottom: 5px; font-size: 0.9rem; }
        .explanation-box p { font-size: 0.85rem; font-weight: 700; line-height: 1.4; color: #333; }

        .next-soal-btn {
          width: 100%; padding: 18px; border-radius: 16px; border: none;
          font-weight: 900; font-size: 1rem; color: white;
          display: flex; justify-content: center; align-items: center; gap: 10px; cursor: pointer;
        }
        .is-correct .next-soal-btn { background: #58cc02; box-shadow: 0 6px 0 #46a302; }
        .is-wrong .next-soal-btn { background: #ff4b4b; box-shadow: 0 6px 0 #ea2b2b; }

        /* New Types Styles */
        .matching-area { display: flex; gap: 20px; margin-top: 10px; }
        .matching-column { flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .match-btn {
          background: white; border: 2px solid var(--border-color);
          padding: 15px; border-radius: 16px; font-weight: 800; font-size: 0.9rem;
          box-shadow: 0 4px 0 var(--border-color); cursor: pointer;
        }
        .match-btn.selected { border-color: #1cb0f6; background: #e3f2fd; color: #1cb0f6; }
        .match-btn.done { border-color: #58cc02; background: #eef9e6; color: #58cc02; box-shadow: 0 4px 0 #46a302; pointer-events: none; }
        .match-btn.wrong { border-color: #ff4b4b; background: #ffebee; color: #ff4b4b; box-shadow: 0 4px 0 #ea2b2b; }

        .categorization-area { display: flex; flex-direction: column; gap: 30px; align-items: center; }
        .cat-item-display { width: 100%; }
        .cat-label { font-weight: 900; font-size: 0.7rem; color: var(--text-muted); letter-spacing: 1px; }
        .cat-item-card {
          background: white; border: 3px solid #1cb0f6; padding: 30px;
          border-radius: 24px; font-weight: 900; font-size: 1.5rem; color: #1cb0f6;
          margin-top: 10px; box-shadow: 0 8px 0 #1899d6;
        }
        .cat-buckets { display: flex; gap: 15px; width: 100%; }
        .cat-bucket-btn {
          flex: 1; background: white; border: 2px solid var(--border-color);
          padding: 20px 10px; border-radius: 20px; cursor: pointer;
          box-shadow: 0 5px 0 var(--border-color); display: flex; flex-direction: column; align-items: center; gap: 5px;
        }
        .bucket-icon { font-size: 1.5rem; }
        .bucket-name { font-weight: 900; font-size: 0.8rem; color: var(--text-color); }

        .blanks-area { display: flex; flex-direction: column; gap: 30px; }
        .sentence-display {
          font-weight: 800; font-size: 1.3rem; line-height: 1.8; color: var(--text-color);
          background: white; padding: 25px; border-radius: 24px; border: 2px solid var(--border-color);
        }
        .blank-space {
          display: inline-block; min-width: 80px; border-bottom: 3px solid #1cb0f6;
          padding: 0 10px; color: #1cb0f6; font-weight: 900; margin: 0 5px;
        }
        .blank-space.filled { border-bottom: none; background: #e3f2fd; border-radius: 8px; }
        .blanks-options { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .blank-opt-btn {
          background: white; border: 2px solid var(--border-color);
          padding: 12px 20px; border-radius: 14px; font-weight: 800;
          box-shadow: 0 4px 0 var(--border-color); cursor: pointer;
        }
        .blank-opt-btn.selected { background: #1cb0f6; color: white; border-color: #1cb0f6; box-shadow: 0 4px 0 #1899d6; }
      `}</style>
    </div>
  );
}
