import React, { useState } from 'react'
import './styles/global.css'
import AuthRouter from './features/auth/AuthRouter'
import ViewRouter from './components/navigation/ViewRouter'
import DynamicBackground from './components/layout/DynamicBackground'
import ResponsiveLayout from './components/layout/ResponsiveLayout'
import TeacherDashboard from './features/teacher/screens/TeacherDashboard'
import { useNavigationStore } from './store/useNavigationStore'
import { useHeartRegen } from './hooks/useHeartRegen'
import { useAppTheme } from './hooks/useAppTheme'
import { useStore } from './store/useStore'
import { soundManager } from './utils/SoundManager'

function App() {
  const { hasStarted, setHasStarted, currentView, quizSubView, gameSubView, jelajahSubView, tarikTambangPlay } = useNavigationStore();
  const { activeTab, setActiveTab } = useStore();
  const [userRole, setUserRole] = useState(null); // 'student' or 'teacher'

  React.useEffect(() => {
    const unlockAudio = () => {
      soundManager.init();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  useHeartRegen();
  useAppTheme();

  const handleAuthSuccess = (role) => {
    setUserRole(role || 'student');
    setHasStarted(true);
  };

  const handleLogout = () => {
    setUserRole(null);
    setHasStarted(false);
  };

  if (!hasStarted) {
    return <AuthRouter onAuthSuccess={handleAuthSuccess} />
  }

  // Redirect to Teacher Dashboard if logged in as teacher
  if (userRole === 'teacher') {
    return <TeacherDashboard onLogout={handleLogout} />
  }

  const isFullscreen = 
    (currentView === 'vn') || 
    (activeTab === 'quiz' && quizSubView === 'play') ||
    (activeTab === 'game' && gameSubView === 'tarik-tambang' && tarikTambangPlay) ||
    (activeTab === 'game' && gameSubView === 'jelajah' && (jelajahSubView === 'playing' || jelajahSubView === 'playing_test' || jelajahSubView === 'maker'));

  return (
    <ResponsiveLayout activeTab={activeTab} onTabChange={setActiveTab} isFullscreen={isFullscreen}>
      {!isFullscreen && <DynamicBackground />}
      <ViewRouter />
    </ResponsiveLayout>
  );
}

export default App
