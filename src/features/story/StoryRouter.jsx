import React from 'react';
import StoryScreen from './screens/StoryScreen';
import ModulePathScreen from './screens/ModulePathScreen';
import NodeMaterialScreen from './screens/NodeMaterialScreen';
import NodeQuizScreen from './screens/NodeQuizScreen';
import { useNavigationStore } from '../../store/useNavigationStore';

export default function StoryRouter() {
  const { currentView } = useNavigationStore();

  if (currentView === 'path') return <ModulePathScreen />;
  if (currentView === 'material') return <NodeMaterialScreen />;
  if (currentView === 'quiz') return <NodeQuizScreen />;

  return <StoryScreen />;
}
