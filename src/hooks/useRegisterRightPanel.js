import { useEffect } from 'react';
import { useRightPanelStore } from '../store/useRightPanelStore';

/**
 * Register a React component as the right panel content for the current screen.
 * The panel is shown when the screen mounts and automatically cleared when it unmounts.
 *
 * @param {React.ComponentType} PanelComponent - The component to render in the right panel
 * @param {string} key - A unique string key identifying this panel (for debugging)
 *
 * @example
 * // In any screen component:
 * import { useRegisterRightPanel } from '../../../../hooks/useRegisterRightPanel';
 * import MyPanel from './MyPanel';
 *
 * export default function MyScreen() {
 *   useRegisterRightPanel(MyPanel, 'my-screen-panel');
 *   // ...
 * }
 */
export function useRegisterRightPanel(PanelComponent, key) {
  const { setPanel, clearPanel } = useRightPanelStore();

  useEffect(() => {
    setPanel(PanelComponent, key);
    // Auto-cleanup: clear the panel when this screen unmounts
    return () => clearPanel();
  }, [PanelComponent, key]);
}
