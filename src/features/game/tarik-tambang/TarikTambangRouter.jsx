import React, { useState } from 'react';
import TarikTambangSetupScreen from './screens/TarikTambangSetupScreen';
import TarikTambangGameScreen from './screens/TarikTambangGameScreen';
import { useNavigationStore } from '../../../store/useNavigationStore';

export default function TarikTambangRouter() {
  const [subView, setSubView] = useState('setup'); // 'setup', 'play'
  const [gameConfig, setGameConfig] = useState(null);
  const { setGameSubView, setTarikTambangPlay } = useNavigationStore();
  
  if (subView === 'setup') {
    return <TarikTambangSetupScreen 
      onBack={() => {
        setTarikTambangPlay(false);
        setGameSubView('arcade');
      }} 
      onStart={(config) => {
        setGameConfig(config);
        setTarikTambangPlay(true);
        setSubView('play');
      }} 
    />;
  }
  
  if (subView === 'play' && gameConfig) {
    return <TarikTambangGameScreen 
      config={gameConfig} 
      onBack={() => {
        setTarikTambangPlay(false);
        setSubView('setup');
      }} 
    />;
  }
  
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Game Area</h1>
      <button onClick={() => setGameSubView('arcade')}>Back to Arcade</button>
    </div>
  );
}
