import React from 'react';
import GameArcadeScreen from './screens/GameArcadeScreen';
import JelajahNusantaraRouter from './jelajah-nusantara/JelajahNusantaraRouter';
import TarikTambangRouter from './tarik-tambang/TarikTambangRouter';
import LayanganRouter from './layangan/LayanganRouter';
import { useNavigationStore } from '../../store/useNavigationStore';

export default function GameRouter() {
  const { gameSubView } = useNavigationStore();

  switch (gameSubView) {
    case 'jelajah':
      return <JelajahNusantaraRouter />;
    case 'tarik-tambang':
      return <TarikTambangRouter />;
    case 'layangan':
      return <LayanganRouter />;
    case 'arcade':
    default:
      return <GameArcadeScreen />;
  }
}
