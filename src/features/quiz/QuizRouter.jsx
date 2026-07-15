import React from 'react';
import QuizHubScreen from './screens/QuizHubScreen';
import QuizMissionsScreen from './screens/QuizMissionsScreen';
import QuizThemeListScreen from './screens/QuizThemeListScreen';
import QuizPlayScreen from './screens/QuizPlayScreen';
import ClassroomLobbyScreen from './screens/ClassroomLobbyScreen';
import TeacherTaskListScreen from './screens/TeacherTaskListScreen';
import { useStore } from '../../store/useStore';
import { useNavigationStore } from '../../store/useNavigationStore';

export default function QuizRouter() {
  const { 
    addStars,
    activeClass,
    setActiveClass,
    userName
  } = useStore();

  const {
    quizSubView, setQuizSubView,
    selectedPillar, setSelectedPillar,
    activeQuizTheme, setActiveQuizTheme,
    quizQuestionCount
  } = useNavigationStore();

  if (quizSubView === 'play' && activeQuizTheme) {
    return <QuizPlayScreen />;
  }

  if (quizSubView === 'classroom' && activeClass) {
    return <ClassroomLobbyScreen />;
  }

  if (quizSubView === 'teacherTasks') {
    return <TeacherTaskListScreen />;
  }

  if (quizSubView === 'themes' && selectedPillar) {
    return <QuizThemeListScreen />;
  }

  if (quizSubView === 'missions') {
    return <QuizMissionsScreen />;
  }

  return <QuizHubScreen />;
}
