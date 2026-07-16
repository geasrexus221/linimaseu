import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useHeartRegen() {
  const { checkRegen, maxStreak, setMaxStreak } = useStore();

  useEffect(() => {
    
    if (maxStreak === 10) {
      setMaxStreak(5);
    }
  }, [maxStreak, setMaxStreak]);

  useEffect(() => {
    
    checkRegen();
    
    
    const interval = setInterval(() => {
      checkRegen();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [checkRegen]);
}
