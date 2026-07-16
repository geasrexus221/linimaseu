import { useEffect } from 'react';
import { useRightPanelStore } from '../store/useRightPanelStore';


export function useRegisterRightPanel(PanelComponent, key) {
  const { setPanel, clearPanel } = useRightPanelStore();

  useEffect(() => {
    setPanel(PanelComponent, key);
    
    return () => clearPanel();
  }, [PanelComponent, key]);
}
