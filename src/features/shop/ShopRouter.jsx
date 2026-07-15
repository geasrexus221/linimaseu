import React from 'react';
import ShopMainScreen from './screens/ShopMainScreen';
import TreasureOpeningScreen from './screens/TreasureOpeningScreen';
import { useNavigationStore } from '../../store/useNavigationStore';

export default function ShopRouter() {
  const { shopSubView } = useNavigationStore();

  switch (shopSubView) {
    case 'opening':
      return <TreasureOpeningScreen />;
    case 'main':
    default:
      return <ShopMainScreen />;
  }
}
