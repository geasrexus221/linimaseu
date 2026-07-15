import React, { useEffect } from 'react';
import { LayoutDashboard, BookOpen, ClipboardCheck, Gamepad2, ShoppingBag, User, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { soundManager } from '../../utils/SoundManager';

export default function TabBar({ isVertical = false, activeTab: propActiveTab, onTabChange }) {
  const { activeTab: storeActiveTab, setActiveTab, soundEnabled } = useStore();
  
  // Support both controlled (props) and uncontrolled (store)
  const currentTab = propActiveTab || storeActiveTab;
  const handleTabClick = (tabId) => {
    if (currentTab !== tabId) {
      soundManager.play('click', 0.4);
      if (onTabChange) onTabChange(tabId);
      else setActiveTab(tabId);
    }
  };

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'linear-gradient(135deg, #58CC02, #3DA001)' },
    { id: 'story', label: 'Jelajah Materi', icon: BookOpen, color: 'linear-gradient(135deg, #1CB0F6, #1485BA)' },
    { id: 'quiz', label: 'Latihan', icon: ClipboardCheck, color: 'linear-gradient(135deg, #1CB0F6, #1485BA)' },
    { id: 'game', label: 'Arena', icon: Gamepad2, color: 'linear-gradient(135deg, #f4c265, #E67E00)' },
    { id: 'shop', label: 'Toko', icon: ShoppingBag, color: 'linear-gradient(135deg, #CE82FF, #8E44AD)' },
    { id: 'profile', label: 'Profil', icon: User, color: 'linear-gradient(135deg, #FF4B4B, #D33131)' },
    { id: 'settings', label: 'Setelan', icon: Settings, color: 'linear-gradient(135deg, #AFAFAF, #777777)' },
  ];

  if (isVertical) {
    return (
      <div className="sidebar-nav">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <div 
              key={tab.id} 
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <div className="sidebar-icon-box" style={{ '--color': tab.color }}>
                <IconComponent />
              </div>
              <span className="sidebar-label">{tab.label}</span>
              {isActive && <div className="active-indicator" />}
            </div>
          );
        })}
        <style jsx>{`
          .sidebar-nav { display: flex; flex-direction: column; gap: 10px; width: 100%; }
          .sidebar-item {
            display: flex; align-items: center; gap: 15px; padding: 12px 15px;
            border-radius: 16px; cursor: pointer; transition: all 0.2s;
            position: relative; border: 2px solid transparent;
            color: white;
          }
          @media (hover: hover) {
            .sidebar-item:hover { 
              background: rgba(255,255,255,0.2); 
              transform: translateY(-2px);
              box-shadow: 0 4px 0 rgba(0,0,0,0.05);
            }
            .sidebar-item.active:hover {
               transform: translateY(-2px);
               box-shadow: 0 4px 0 rgba(255, 255, 255, 0.2);
            }
          }
          .sidebar-item.active {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
          }
          .sidebar-icon-box {
            width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
            transform: scale(1.1);
          }
          .sidebar-item:not(.active) .sidebar-icon-box { filter: brightness(0) invert(1) opacity(0.7); }
          .sidebar-label {
            font-weight: 900; font-size: 1rem; color: white;
            text-transform: uppercase; letter-spacing: 0.5px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
          .active-indicator {
            position: absolute; right: -22px; width: 4px; height: 30px;
            background: white; border-radius: 4px 0 0 4px;
            box-shadow: -2px 0 5px rgba(255,255,255,0.5);
          }
        `}</style>
      </div>
    );
  }

  return (
    <nav className="pop-tabbar">
      <div className="tabbar-items">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <div
              key={tab.id}
              className={`pop-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              style={{ '--tab-color': tab.color }}
            >
              <div className="icon-wrapper">
                <div className="active-circle" />
                <div className="icon-main">
                  <IconComponent />
                </div>
              </div>
              <span className="pop-label">{tab.label}</span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .pop-tabbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 75px;
          background: var(--sidebar-bg);
          box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
          z-index: 2000;
          display: flex;
          justify-content: center;
          border-top: 3px solid var(--sidebar-border);
          transition: background 0.3s, border-color 0.3s;
        }
        @media (max-width: 600px) {
          .pop-tabbar { height: 60px; }
          .icon-wrapper { width: 42px !important; height: 42px !important; }
          .active-circle { width: 50px !important; height: 50px !important; border-width: 4px !important; }
          .pop-tab-item.active .icon-wrapper { transform: translateY(-22px) !important; }
          .icon-main { transform: scale(1.1) !important; }
          .pop-tab-item.active .icon-main { transform: scale(1.3) !important; }
          .pop-label { font-size: 0.55rem !important; bottom: 4px !important; }
        }

        .tabbar-items {
          width: 100%;
          max-width: 600px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
        }

        .pop-tab-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          cursor: pointer;
          user-select: none;
          color: white;
        }

        .icon-wrapper {
          position: relative;
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: transform 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6);
        }

        .icon-main {
          z-index: 3;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(1.3);
        }

        .active-circle {
          position: absolute;
          width: 65px;
          height: 65px;
          background: var(--tab-color);
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.5);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          border: 5px solid var(--sidebar-bg);
        }

        .pop-tab-item.active .icon-wrapper {
          transform: translateY(-32px);
        }

        .pop-tab-item.active .active-circle {
          transform: scale(1);
        }

        .pop-tab-item.active .icon-main {
          transform: scale(1.5);
        }

        .pop-tab-item:not(.active) .icon-main {
          filter: brightness(0) invert(1) opacity(0.6);
        }
        .pop-tab-item:not(.active):active .icon-main {
          opacity: 0.9;
        }

        .pop-label {
          position: absolute;
          bottom: 8px;
          font-size: 0.7rem;
          font-weight: 900;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.15);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .pop-tab-item.active .pop-label {
          opacity: 1;
          transform: translateY(0);
        }

        .pop-tab-item:active .icon-wrapper {
          transform: translateY(-10px) scale(0.85);
        }
        
        .pop-tab-item.active:active .icon-wrapper {
          transform: translateY(-38px) scale(0.85);
        }
      `}</style>
    </nav>
  );
}
