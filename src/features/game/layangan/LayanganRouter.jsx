import React, { useState } from 'react';
import { useNavigationStore } from '../../../store/useNavigationStore';
import LayanganLobbyScreen from './screens/LayanganLobbyScreen';
import LayanganGameScreen from './screens/LayanganGameScreen';

export default function LayanganRouter() {
  const [phase, setPhase] = useState('lobby'); 
  const [gameConfig, setGameConfig] = useState(null);

  
  const handleStartGame = (config) => {
    setGameConfig(config);
    setPhase('playing');
  };

  const handleBackToLobby = () => {
    setPhase('lobby');
    setGameConfig(null);
  };

  if (phase === 'playing') {
    return (
      <LayanganGameScreen 
        config={gameConfig} 
        onBack={handleBackToLobby} 
      />
    );
  }

  
  return <LayanganLobbyScreen onStart={handleStartGame} />;
}
