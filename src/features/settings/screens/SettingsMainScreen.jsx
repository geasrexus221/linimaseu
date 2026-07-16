import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { useRegisterRightPanel } from '../../../hooks/useRegisterRightPanel';
import { useNavigationStore } from '../../../store/useNavigationStore';
import DesktopStatsPanel from '../../../components/layout/DesktopStatsPanel';
import { Sun, Moon, User, Shield, Info, Code, Bell, LogOut } from 'lucide-react';
import SettingItem from '../components/SettingItem';
import DevModeSection from '../components/DevModeSection';

export default function SettingsMainScreen() {
  const { theme, setTheme, isDevMode } = useStore();
  const { setHasStarted } = useNavigationStore();
  const [showDevMode, setShowDevMode] = useState(isDevMode);

  useEffect(() => {
    setShowDevMode(isDevMode);
  }, [isDevMode]);

  
  useRegisterRightPanel(DesktopStatsPanel, 'settings-main');

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Pengaturan</h1>
      </header>

      <div className="settings-content">
        
        <section className="settings-group">
          <h3 className="group-title">Tampilan</h3>
          <div className="theme-toggle-container">
            <div
              className={`theme-card ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={24} />
              <span>Terang</span>
            </div>
            <div
              className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={24} />
              <span>Gelap</span>
            </div>
          </div>
        </section>

        
        <section className="settings-group">
          <h3 className="group-title">Akun & Privasi</h3>
          <div className="items-container">
            <SettingItem icon={User} label="Profil Saya" color="#58CC02" value="Siswa" />
            <SettingItem icon={Bell} label="Notifikasi" color="#f4c265" />
            <SettingItem icon={Shield} label="Privasi & Keamanan" color="#FF4B4B" />
            <SettingItem
              icon={LogOut}
              label="Keluar Akun"
              color="#EF4444"
              onClick={() => setHasStarted(false)}
            />
          </div>
        </section>

        
        <section className="settings-group">
          <h3 className="group-title">Tentang</h3>
          <div className="items-container">
            <SettingItem icon={Info} label="Tentang Lini Masa" color="#1CB0F6" value="v1.0.4" />

            {isDevMode && (
              <div className="dev-entry" onClick={() => setShowDevMode(!showDevMode)}>
                <div className="dev-entry-left">
                  <Code size={20} color="#f4c265" />
                  <span>Developer Mode</span>
                </div>
                <div className={`toggle-switch ${showDevMode ? 'on' : ''}`} />
              </div>
            )}
          </div>
        </section>

        
        {isDevMode && showDevMode && <DevModeSection />}
        

        <div className="footer-credits">
          <p>© 2026 Project Lini Masa</p>
        </div>
      </div>

      <style jsx>{`
        .settings-page {
          flex: 1;
          background: var(--background-color);
          overflow-y: auto;
          padding-bottom: 40px;
        }

        .settings-header {
          padding: 30px 20px;
          background: var(--card-bg);
          border-bottom: 2px solid var(--border-color);
        }

        .settings-header h1 {
          font-weight: 900;
          font-size: 1.8rem;
          margin: 0;
          color: var(--text-color);
        }

        .settings-content {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .settings-group {
          margin-bottom: 30px;
        }

        .group-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 12px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .items-container {
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          overflow: hidden;
        }

        .theme-toggle-container {
          display: flex;
          gap: 15px;
        }

        .theme-card {
          flex: 1;
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 800;
          color: var(--text-muted);
        }

        .theme-card.active {
          border-color: var(--primary-color);
          background: var(--primary-color-light);
          color: var(--primary-color);
          transform: translateY(-4px);
          box-shadow: 0 4px 0 var(--primary-color);
        }

        .dev-entry {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(255, 150, 0, 0.05);
          cursor: pointer;
          border-top: 1px solid var(--border-color);
        }

        .dev-entry-left {
          display: flex;
          align-items: center;
          gap: 15px;
          font-weight: 700;
          color: #f4c265;
        }

        .toggle-switch {
          width: 44px;
          height: 24px;
          background: #DDD;
          border-radius: 20px;
          position: relative;
          transition: background 0.3s;
        }

        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .toggle-switch.on { background: #f4c265; }
        .toggle-switch.on::after { transform: translateX(20px); }

        .footer-credits {
          margin-top: 40px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
