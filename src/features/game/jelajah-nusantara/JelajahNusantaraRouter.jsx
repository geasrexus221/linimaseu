import React from 'react';
import SetupScreen from './screens/SetupScreen';
import PlayScreen from './screens/PlayScreen';
import BoardMakerScreen from './screens/BoardMakerScreen';
import { useNavigationStore } from '../../../store/useNavigationStore';

export default function JelajahNusantaraRouter() {
  const { jelajahSubView } = useNavigationStore();

  switch (jelajahSubView) {
    case 'maker':
      return <BoardMakerScreen />;
    case 'setup':
    case 'intro':
    default:
      return <SetupScreen />;
    case 'playing_test':
      return <PlayScreen isTestMode={true} />;
    case 'playing':
      return <PlayScreen isTestMode={false} />;
  }
}
