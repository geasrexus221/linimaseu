import React from 'react';
import Header from './Header';
import TabBar from './TabBar';
import RightPanelEmpty from './RightPanelEmpty';
import UniversalRightHeader from './UniversalRightHeader';
import { useRightPanelStore } from '../../store/useRightPanelStore';
import LinimasaLogo from '../../assets/UI/element/Linimasa.svg';

export default function ResponsiveLayout({ children, activeTab, onTabChange, isFullscreen = false }) {
  const { panel: RightPanel } = useRightPanelStore();

  return (
    <div className={`app-responsive-wrapper ${isFullscreen ? 'is-fullscreen' : ''}`}>
      
      {!isFullscreen && (
        <div className="mobile-only-header">
          <Header />
        </div>
      )}

      <div className="main-layout-grid">
        
        <aside className="desktop-sidebar-nav">
          <div className="nav-logo">
            <div
              className="nav-logo-icon"
              style={{
                WebkitMaskImage: `url(${LinimasaLogo})`,
                maskImage: `url(${LinimasaLogo})`
              }}
            />
          </div>
          <TabBar isVertical={true} activeTab={activeTab} onTabChange={onTabChange} />
        </aside>

        
        <main className="main-content-scrollable">
          {children}
        </main>

        
        <aside className="desktop-right-panel">
          <UniversalRightHeader />
          <div className="dynamic-panel-content">
            {RightPanel ? <RightPanel /> : <RightPanelEmpty />}
          </div>
        </aside>
      </div>

      
      {!isFullscreen && (
        <div className="mobile-only-tabbar">
          <TabBar isVertical={false} activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      )}

      <style jsx>{`
        .app-responsive-wrapper {
          display: flex;
          flex-direction: column;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          background: var(--background-color);
        }

        .main-layout-grid {
          display: grid;
          flex: 1;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .main-content-scrollable {
          overflow-y: auto;
          position: relative;
          background: var(--background-color);
          display: flex;
          flex-direction: column;
        }
        
        .app-responsive-wrapper.is-fullscreen .main-content-scrollable {
          overflow: hidden;
        }

        /* --- MOBILE LAYOUT (< 1024px) --- */
        @media (max-width: 1023px) {
          .main-layout-grid {
            grid-template-columns: 1fr;
          }
          .desktop-sidebar-nav, .desktop-right-panel {
            display: none;
          }
          .mobile-only-header, .mobile-only-tabbar {
            display: block;
          }
        }

        /* --- DESKTOP LAYOUT (> 1024px) --- */
        @media (min-width: 1024px) {
          .main-layout-grid {
            grid-template-columns: var(--sidebar-width) minmax(0, 1fr) var(--right-panel-width);
          }
          .mobile-only-header, .mobile-only-tabbar {
            display: none;
          }
          .desktop-sidebar-nav {
            display: flex;
            flex-direction: column;
            width: var(--sidebar-width);
            border-right: 2px solid var(--sidebar-border);
            background: var(--sidebar-bg);
            padding: 20px;
            overflow: hidden;
          }
          .main-content-scrollable {
            overflow-y: auto;
            position: relative;
            background: var(--background-color);
            display: flex;
            flex-direction: column;
            min-width: 0;
          }
          .desktop-right-panel {
            display: flex;
            flex-direction: column;
            width: var(--right-panel-width);
            border-left: 2px solid var(--sidebar-border);
            background: var(--sidebar-bg);
            padding: 24px 20px 20px;
            overflow: hidden;
            z-index: 10;
          }
          .dynamic-panel-content {
            flex: 1;
            overflow-y: auto;
            margin-right: -10px;
            padding-right: 10px;
          }
          .dynamic-panel-content::-webkit-scrollbar {
            width: 4px;
          }
          .dynamic-panel-content::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 10px;
          }
          .nav-logo {
            padding: 20px 10px 40px;
          }
          .nav-logo-icon {
            width: 300px;
            height: 90px;
            background-color: white; /* Matches the white text styling */
            -webkit-mask-size: contain;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: left center;
            mask-size: contain;
            mask-repeat: no-repeat;
            mask-position: left center;
            transition: background-color 0.3s;
          }
        }
      `}</style>
    </div>
  );
}
