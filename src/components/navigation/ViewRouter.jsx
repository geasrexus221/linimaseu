import React from 'react';
import StudentDashboardRouter from '../../features/student/StudentDashboardRouter';
import QuizRouter from '../../features/quiz/QuizRouter';
import GameRouter from '../../features/game/GameRouter';
import StoryRouter from '../../features/story/StoryRouter';
import ShopRouter from '../../features/shop/ShopRouter';
import ProfileRouter from '../../features/profile/ProfileRouter';
import SettingsRouter from '../../features/settings/SettingsRouter';
import DiceTestScreen from '../../features/dev/DiceTestScreen';
import DevAssetsScreen from '../../features/dev/DevAssetsScreen';
import { useStore } from '../../store/useStore';
import { useNavigationStore } from '../../store/useNavigationStore';

export default function ViewRouter() {
  const { activeTab } = useStore();
  const { currentView } = useNavigationStore();

  if (currentView === 'dev-dice') {
    return <DiceTestScreen />;
  }

  if (currentView === 'dev-assets') {
    return <DevAssetsScreen />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <StudentDashboardRouter />;
      case 'quiz': return <QuizRouter />;
      case 'story': return <StoryRouter />;
      case 'game': return <GameRouter />;
      case 'shop': return <ShopRouter />;
      case 'profile': return <ProfileRouter />;
      case 'settings': return <SettingsRouter />;
      default: return <StudentDashboardRouter />;
    }
  };

  return (
    <div key={activeTab} className="page-transition-wrapper">
      {renderView()}
      
      <style jsx>{`
        .page-transition-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          animation: slideUpFade 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
          overflow: hidden;
        }

        @keyframes slideUpFade {
          from { 
            opacity: 0; 
            transform: scale(0.96) translateY(15px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
