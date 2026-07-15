import React, { useState } from 'react';
import { Shirt, Book, ChevronRight, Share2, Edit3, Users } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { useRegisterRightPanel } from '../../../hooks/useRegisterRightPanel';
import DesktopStatsPanel from '../../../components/layout/DesktopStatsPanel';
import StudentAvatar from '../../../components/common/StudentAvatar';
import ClassmatesListModal from '../../../components/profile/ClassmatesListModal';
import FriendProfileModal from '../../../components/profile/FriendProfileModal';
import StatsGrid from '../components/StatsGrid';
import WeeklyChart from '../components/WeeklyChart';
import AchievementBadge from '../components/AchievementBadge';
import { MOCK_CLASSROOMS } from '../../../data/classrooms';

export default function ProfileMainScreen() {
  const { streak, stars, completedChapters, userName, ownedArtifacts } = useStore();
  const { setProfileSubView } = useNavigationStore();
  
  // Register Desktop Stats Panel for this screen
  useRegisterRightPanel(DesktopStatsPanel, 'profile-main');
  
  const [showClassmates, setShowClassmates] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Combine ME with classmates for ranking
  const baseClassmates = MOCK_CLASSROOMS['KELAS1'].students;
  const allInClass = [
    ...baseClassmates,
    { id: 'ME', name: userName + ' (Kamu)', avatar: '⭐', score: stars, isMe: true }
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="profile-main-container">
      {/* Playful Header Background */}
      <div className="profile-bg-header">
        <div className="wave w1" />
        <div className="wave w2" />
        <div className="wave w3" />
      </div>

      {/* Profile Header Card */}
      <div className="profile-top-card">
        <div className="avatar-section">
          <div className="avatar-glow-ring">
            <StudentAvatar size={100} showGlow />
          </div>
        </div>

        <div className="user-info">
          <h1 className="user-name">{userName || 'Sang Penjelajah'}</h1>
          <div className="user-rank-badge">
            <span className="rank-emoji">🏆</span>
            <span className="rank-text">PENJELAJAH MUDA</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="action-btn-3d share">
            <Share2 size={18} />
            <span>BAGIKAN</span>
          </button>
          <div className="divider-v" />
          <button className="action-btn-3d friends" onClick={() => setShowClassmates(true)}>
            <Users size={18} />
            <span>TEMAN</span>
          </button>
          <div className="divider-v" />
          <button className="action-btn-3d wardrobe" onClick={() => setProfileSubView('avatar')}>
            <Shirt size={18} />
            <span>RUANG GANTI</span>
          </button>
        </div>
      </div>

      <div className="profile-scroll-content content-container">
        {/* Artifact Book Bar - Premium Design */}
        <div className="artifact-bar-premium" onClick={() => setProfileSubView('collection')}>
          <div className="bar-icon-box">
            <Book size={24} color="white" fill="white" />
          </div>
          <div className="bar-mid">
            <span className="bar-label">Tas Bekal Kartu</span>
            <span className="bar-sub">{ownedArtifacts.reduce((sum, a) => sum + (a.count || 0), 0)} Kartu Dimiliki</span>
          </div>
          <div className="bar-right">
            <ChevronRight size={24} color="#AFAFAF" />
          </div>
        </div>

        {/* Modular Components */}
        <StatsGrid 
          streak={streak} 
          accuracy={85} 
          chapters={completedChapters.length} 
          stars={stars}
          rank="#3"
        />
        
        <WeeklyChart />
        
        <AchievementBadge />
      </div>

      {/* Modals */}
      {showClassmates && (
        <ClassmatesListModal 
          classmates={allInClass} 
          onClose={() => setShowClassmates(false)} 
          onSelectFriend={(friend) => {
            if (friend.isMe) return;
            setSelectedFriend(friend);
            setShowClassmates(false);
          }}
        />
      )}

      {selectedFriend && (
        <FriendProfileModal 
          friend={selectedFriend}
          rank={allInClass.findIndex(f => f.id === selectedFriend.id) + 1}
          onClose={() => {
            setSelectedFriend(null);
            setShowClassmates(true);
          }} 
        />
      )}

      <style jsx>{`
        .profile-main-container {
          flex: 1; background: var(--background-color); overflow-y: auto;
          padding-bottom: 120px; font-family: 'Outfit', sans-serif;
          position: relative;
        }
        .profile-bg-header {
          position: absolute; top: 0; left: 0; right: 0; height: 260px;
          background: linear-gradient(135deg, #1C80F6 0%, #1CB0F6 100%);
          overflow: hidden; z-index: 0;
          border-bottom-left-radius: 48px; border-bottom-right-radius: 48px;
          box-shadow: 0 10px 25px rgba(28, 176, 246, 0.15);
        }
        :global([data-theme='dark']) .profile-bg-header {
          background: linear-gradient(135deg, #111e38 0%, #1f3764 100%);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        .wave {
          position: absolute; border-radius: 43%; opacity: 0.12;
          width: 380px; height: 380px; background: white;
        }
        .w1 { top: -200px; left: -100px; animation: rotateWave 22s infinite linear; }
        .w2 { top: -160px; right: -80px; animation: rotateWave 28s infinite linear reverse; }
        .w3 { bottom: -280px; left: 25%; animation: rotateWave 32s infinite linear; }

        @keyframes rotateWave {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .profile-top-card {
          margin: 60px 20px 20px; background: var(--card-bg); border-radius: 32px;
          padding: 30px 20px 24px; display: flex; flex-direction: column;
          align-items: center; position: relative; z-index: 1;
          border: 3px solid var(--border-color); border-bottom: 8px solid var(--border-color);
          box-shadow: 0 15px 30px rgba(0,0,0,0.03);
        }
        .settings-btn-box { position: absolute; top: 20px; right: 20px; }
        .icon-btn-3d {
          background: var(--card-bg); border: 2.5px solid var(--border-color); border-bottom: 5px solid var(--border-color);
          width: 48px; height: 48px; border-radius: 16px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; color: var(--secondary-color);
          transition: all 0.1s;
        }
        .icon-btn-3d:active {
          transform: translateY(3px);
          border-bottom-width: 2.5px;
        }
        .rg-btn {
          background: var(--card-bg); border: 2.5px solid var(--border-color); border-bottom: 5px solid var(--border-color);
          padding: 8px 16px; border-radius: 16px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          color: var(--secondary-color); font-weight: 800; font-size: 0.9rem;
          transition: all 0.1s;
        }
        .rg-btn:active {
          transform: translateY(3px);
          border-bottom-width: 2.5px;
        }

        .avatar-section { position: relative; margin-top: -80px; margin-bottom: 15px; }
        .avatar-glow-ring {
          padding: 8px; background: var(--card-bg); border-radius: 28px;
          border: 4px solid var(--secondary-color);
          box-shadow: 0 12px 28px rgba(28, 176, 246, 0.25);
          display: inline-block;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .avatar-glow-ring:hover {
          transform: scale(1.05) rotate(-3deg);
        }

        .user-info { text-align: center; margin-bottom: 25px; width: 100%; padding: 0 10px; }
        .user-name {
          font-weight: 950;
          font-size: clamp(1.4rem, 6vw, 1.85rem);
          color: #1e293b !important;
          margin: 0;
          letter-spacing: -0.5px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        :global([data-theme='dark']) .user-name {
          color: #ffffff !important;
        }
        .user-rank-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, rgba(28, 176, 246, 0.15) 0%, rgba(88, 204, 2, 0.15) 100%);
          border: 2px solid rgba(28, 176, 246, 0.2);
          padding: 6px 16px; border-radius: 50px; margin-top: 10px;
        }
        .rank-emoji { font-size: 1rem; }
        .rank-text { font-weight: 900; font-size: 0.8rem; color: var(--secondary-color); letter-spacing: 1px; }

        .header-actions {
          display: flex; align-items: center; gap: 8px; width: 100%;
          padding-top: 15px; border-top: 2px dashed var(--border-color);
        }
        .action-btn-3d {
          flex: 1; background: var(--card-bg); border: 2px solid var(--border-color); border-bottom: 4.5px solid var(--border-color);
          padding: 8px 6px; border-radius: 12px; display: flex; align-items: center;
          justify-content: center; gap: 6px; font-weight: 900; font-size: 0.74rem;
          color: var(--secondary-color); cursor: pointer; transition: all 0.1s;
        }
        .action-btn-3d:active {
          transform: translateY(2.5px);
          border-bottom-width: 2px;
        }
        .action-btn-3d.share { color: #1cb0f6; }
        .action-btn-3d.friends { color: #58cc02; }
        .action-btn-3d.wardrobe { color: #f4c265; }
        
        .divider-v { width: 1.5px; height: 24px; background: var(--border-color); }

        .profile-scroll-content { padding: 0 20px; display: flex; flex-direction: column; gap: 24px; }

        .artifact-bar-premium {
          background: linear-gradient(135deg, #1C80F6 0%, #00C6FF 100%);
          border-radius: 26px; padding: 18px 22px;
          display: flex; align-items: center; gap: 16px; cursor: pointer;
          border: 3px solid rgba(255,255,255,0.25);
          box-shadow: 0 8px 0 #1063C3, 0 10px 25px rgba(28, 176, 246, 0.2);
          transition: all 0.1s;
          position: relative;
          overflow: hidden;
        }
        .artifact-bar-premium:active { transform: translateY(4px); box-shadow: 0 4px 0 #1063C3; }
        .artifact-bar-premium::before {
          content: ''; position: absolute; top: 0; left: -50%; width: 200%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-25deg); transition: 0.75s;
        }
        .artifact-bar-premium:hover::before { left: 120%; }

        .bar-icon-box {
          width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid rgba(255,255,255,0.4);
          box-shadow: 0 4px 0 rgba(0,0,0,0.15);
        }
        .bar-mid { flex: 1; display: flex; flex-direction: column; }
        .bar-label { color: white; font-weight: 950; font-size: 1.15rem; text-shadow: 0 2px 4px rgba(0,0,0,0.15); }
        .bar-sub { color: rgba(255,255,255,0.85); font-weight: 800; font-size: 0.8rem; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}
