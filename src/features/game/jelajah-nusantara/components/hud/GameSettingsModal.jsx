import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Music, LogOut, Settings, Eye, Cpu } from 'lucide-react';
import { useStore } from '../../../../../store/useStore';
import { useGameStore } from '../../../../../store/useGameStore';
import { soundEngine } from '../../logic/soundEngine';

export default function GameSettingsModal({ isOpen, onClose, onSurrender }) {
  const { musicVolume, sfxVolume, setMusicVolume, setSfxVolume } = useStore();
  const { isAutoZoomEnabled, setAutoZoomEnabled, isLowGraphics, setLowGraphics } = useGameStore();

  const handleMusicChange = (e) => {
    const val = parseFloat(e.target.value);
    setMusicVolume(val);
    soundEngine.syncSettings();
  };

  const handleSfxChange = (e) => {
    const val = parseFloat(e.target.value);
    setSfxVolume(val);
    // Optional: play a small test sound when changing SFX volume
    soundEngine.playSound('button');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="settings-overlay">
          <motion.div 
            className="settings-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="settings-header">
              <div className="title">
                <Settings size={20} />
                <h2>PENGATURAN</h2>
              </div>
              <button className="close-x" onClick={onClose}><X size={20} /></button>
            </div>

            <div className="settings-body">
              {/* Music Slider */}
              <div className="setting-row">
                <div className="label">
                  <Music size={18} />
                  <span>Musik ({Math.round(musicVolume * 100)}%)</span>
                </div>
                <input 
                  type="range" 
                  className="setting-slider" 
                  min="0" max="1" step="0.01"
                  value={musicVolume} 
                  onChange={handleMusicChange}
                />
              </div>

              {/* Sound Effect Slider */}
              <div className="setting-row">
                <div className="label">
                  <Volume2 size={18} />
                  <span>Efek Suara ({Math.round(sfxVolume * 100)}%)</span>
                </div>
                <input 
                  type="range" 
                  className="setting-slider" 
                  min="0" max="1" step="0.01"
                  value={sfxVolume} 
                  onChange={handleSfxChange}
                />
              </div>

              <div className="divider" />
              
              {/* Auto Zoom Toggle */}
              <div className="setting-row-flex">
                <div className="label">
                  <Eye size={18} />
                  <span>Auto Zoom Kamera</span>
                </div>
                <button 
                  className={`toggle-switch ${isAutoZoomEnabled ? 'active' : ''}`}
                  onClick={() => {
                    setAutoZoomEnabled(!isAutoZoomEnabled);
                    soundEngine.playSound('button');
                  }}
                >
                  <div className="toggle-knob" />
                </button>
              </div>

              <div className="divider" />

              {/* Low Graphics Toggle */}
              <div className="setting-row-flex">
                <div className="label">
                  <Cpu size={18} />
                  <span>Kualitas Grafis Rendah (Hemat Baterai)</span>
                </div>
                <button 
                  className={`toggle-switch ${isLowGraphics ? 'active' : ''}`}
                  onClick={() => {
                    setLowGraphics(!isLowGraphics);
                    soundEngine.playSound('button');
                  }}
                >
                  <div className="toggle-knob" />
                </button>
              </div>

              <div className="divider" />

              {/* Surrender Button */}
              <button className="surrender-btn" onClick={onSurrender}>
                <LogOut size={18} />
                <span>MENYERAH</span>
              </button>
              <p className="surrender-hint">Keluar ke menu utama dan batalkan permainan saat ini.</p>
            </div>
          </motion.div>

          <style>{`
            .settings-overlay {
              position: fixed; inset: 0; background: rgba(0,0,0,0.8);
              display: flex; align-items: center; justify-content: center;
              z-index: 10000; backdrop-filter: blur(4px);
            }
            @media (min-width: 1024px) {
              .settings-overlay {
                background: none;
                backdrop-filter: none;
                pointer-events: none;
              }
              .settings-card { 
                pointer-events: auto;
                box-shadow: 0 20px 80px rgba(0,0,0,0.3) !important; 
              }
            }
            .settings-card {
              background: var(--card-bg, white); width: 90%; max-width: 400px;
              border-radius: 24px; border: 4px solid var(--border-color, #E5E5E5);
              overflow: hidden; box-shadow: 0 10px 0 rgba(0,0,0,0.2);
            }
            .settings-header {
              padding: 20px 24px; border-bottom: 2px solid var(--border-color, #F0F0F0);
              display: flex; align-items: center; justify-content: space-between;
              background: var(--background-color, #F7F7F7);
            }
            .settings-header .title { display: flex; align-items: center; gap: 10px; color: var(--text-color, #4B4B4B); }
            .settings-header h2 { font-weight: 900; font-size: 1.2rem; margin: 0; color: var(--text-color, #4B4B4B); }
            
            .close-x {
              background: none; border: none; color: var(--text-muted, #AFB4BD); cursor: pointer;
              padding: 4px; border-radius: 8px; transition: all 0.2s;
            }
            .close-x:hover { background: var(--border-color, #E5E5E5); color: var(--text-color, #4B4B4B); }

            .settings-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
            
            .setting-row { display: flex; flex-direction: column; gap: 12px; }
            .setting-row .label { display: flex; align-items: center; gap: 8px; font-weight: 900; color: var(--text-muted, #777); font-size: 0.9rem; text-transform: uppercase; }
            
            .setting-slider {
              -webkit-appearance: none; width: 100%; height: 12px;
              background: var(--border-color, #E5E5E5); border-radius: 6px; outline: none;
            }
            .setting-slider::-webkit-slider-thumb {
              -webkit-appearance: none; width: 24px; height: 24px;
              background: #1CB0F6; border: 3px solid var(--card-bg, white); border-radius: 50%;
              cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .divider { height: 2px; background: var(--border-color, #F0F0F0); margin: 8px 0; }

            .surrender-btn {
              background: #FF4B4B; border: none; padding: 14px;
              border-radius: 16px; color: white; font-weight: 900;
              display: flex; align-items: center; justify-content: center; gap: 10px;
              cursor: pointer; box-shadow: 0 4px 0 #D33131; transition: all 0.1s;
            }
            .surrender-btn:hover { background: #FF5E5E; transform: translateY(-2px); box-shadow: 0 6px 0 #D33131; }
            .surrender-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #D33131; }
            
            .surrender-hint { 
              margin: 0; font-size: 0.8rem; color: var(--text-muted, #AFB4BD); text-align: center; font-weight: 600;
            }

            /* Toggle Switch Styles */
            .setting-row-flex {
              display: flex; align-items: center; justify-content: space-between;
            }
            .toggle-switch {
              width: 54px; height: 30px; background: #E5E5E5; border-radius: 15px;
              position: relative; border: none; cursor: pointer; transition: all 0.2s;
            }
            .toggle-switch.active { background: #1CB0F6; }
            .toggle-knob {
              position: absolute; left: 3px; top: 3px; width: 24px; height: 24px;
              background: white; border-radius: 50%; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .toggle-switch.active .toggle-knob {
              left: calc(100% - 27px);
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
