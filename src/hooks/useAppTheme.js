import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useAppTheme() {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
}
