import React from 'react';
import { Heart, Flame, Star } from 'lucide-react';
import { useStore } from '../../store/useStore';
import StudentAvatar from '../common/StudentAvatar';

/**
 * UniversalRightHeader: A compact, premium header for the right sidebar.
 * Shows user profile and key stats (Hearts, Streak, Crowns) across all modes.
 */
export default function UniversalRightHeader() {
  const { userName, streak, crowns, hearts } = useStore();

  return (
    <div className="universal-right-header">
      {/* Profile Section */}
      <div className="profile-mini-box">
        <div className="mini-avatar">
          <StudentAvatar size={42} />
        </div>
        <div className="profile-text">
          <p className="user-name">{userName || 'Penjelajah'}</p>
          <p className="user-title">Penjelajah Muda</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-compact-row">
        <div className="stat-item heart">
          <Heart size={14} fill="#FF4B4B" color="#FF4B4B" />
          <span>{hearts}</span>
        </div>
        <div className="stat-item streak">
          <Flame size={14} fill="none" color="#FF4B4B" strokeWidth={2.5} />
          <span>{streak}</span>
        </div>
        <div className="stat-item crown">
          <Star size={14} fill="#FFD700" color="#FFD700" />
          <span>{crowns}</span>
        </div>
      </div>

      <style jsx>{`
        .universal-right-header {
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }

        .profile-mini-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .profile-text {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          margin: 0;
          font-weight: 900;
          font-size: 0.95rem;
          color: white;
          line-height: 1.2;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .user-title {
          margin: 0;
          font-size: 0.65rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stats-compact-row {
          display: flex;
          gap: 10px;
        }

        .stat-item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          font-weight: 900;
          font-size: 0.8rem;
          color: white;
        }

        .stat-item.heart { color: white; border-color: rgba(255, 75, 75, 0.6); background: rgba(255, 75, 75, 0.2); }
        .stat-item.streak { color: white; border-color: rgba(239, 68, 68, 0.6); background: rgba(239, 68, 68, 0.2); }
        .stat-item.crown { color: white; border-color: rgba(255, 215, 0, 0.6); background: rgba(255, 215, 0, 0.2); }
      `}</style>
    </div>
  );
}
