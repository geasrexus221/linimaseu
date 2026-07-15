import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

export default function AuthRouter({ onAuthSuccess }) {
  const [view, setView] = useState('login'); // 'login' or 'register'

  const navigateToRegister = () => setView('register');
  const navigateToLogin = () => setView('login');

  return (
    <>
      {view === 'login' ? (
        <LoginScreen 
          onLogin={(role) => onAuthSuccess(role)} 
          onNavigateToRegister={navigateToRegister} 
        />
      ) : (
        <RegisterScreen 
          onRegisterSuccess={navigateToLogin} 
          onBackToLogin={navigateToLogin} 
        />
      )}
    </>
  );
}
