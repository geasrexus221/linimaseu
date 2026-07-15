import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useHeartRegen() {
  const { checkRegen, maxStreak, setMaxStreak } = useStore();

  useEffect(() => {
    // Migration: Force maxStreak to 5 if it was 10 from previous sessions
    if (maxStreak === 10) {
      setMaxStreak(5);
    }
  }, [maxStreak, setMaxStreak]);

  useEffect(() => {
    // Initial check
    checkRegen();
    
    // Periodically check every 10 seconds for UI updates
    const interval = setInterval(() => {
      checkRegen();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [checkRegen]);
}
