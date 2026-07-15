import React from 'react';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { useStore } from '../../../store/useStore';
import QuizPlayScreen from '../../quiz/screens/QuizPlayScreen';

export default function NodeQuizScreen() {
  const { activeChapter, setCurrentView } = useNavigationStore();
  const { setUnlockedNodes, unlockedNodes = ['cahaya-node-1'] } = useStore();

  const handleQuit = () => {
    setCurrentView('path');
  };

  const handleComplete = (score, correctCount) => {
    // Unlock next node
    if (activeChapter?.id) {
      const parts = activeChapter.id.split('-');
      const nextId = `${parts[0]}-${parts[1]}-${parseInt(parts[2]) + 1}`;
      if (!unlockedNodes.includes(nextId)) {
        if (setUnlockedNodes) {
           setUnlockedNodes([...unlockedNodes, nextId]);
        }
      }
    }
    setCurrentView('path');
  };

  if (!activeChapter?.quizData) return <div>Loading...</div>;

  // Format the quiz data so it can be ingested by QuizPlayScreen
  const customQuestions = [{
    id: activeChapter.id,
    questionType: 'CLASSIC',
    text: activeChapter.quizData.question,
    options: activeChapter.quizData.options.map(o => o.text),
    correctAnswerIndex: activeChapter.quizData.options.findIndex(o => o.isCorrect)
  }];

  const customTheme = {
    id: activeChapter.id,
    title: activeChapter.title || 'Kuis Modul'
  };

  return (
    <QuizPlayScreen 
      customTheme={customTheme}
      customQuestions={customQuestions}
      onComplete={handleComplete}
      onQuit={handleQuit}
      hideConfetti={true}
    />
  );
}
