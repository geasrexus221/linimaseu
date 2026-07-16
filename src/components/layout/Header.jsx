import React, { useState, useEffect } from 'react';
import { Star, Flame, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { MOCK_CLASSROOMS } from '../../data/classrooms';
import StudentAvatar from '../common/StudentAvatar';

export default function Header() {
  const { userName, userTitle, crowns, streak, hearts, activeTab, maxStreak, lastRegenTime, maxHearts, lastHeartRegenTime } = useStore();
  const [timeLeft, setTimeLeft] = useState('');
  const [heartTimeLeft, setHeartTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;

      
      if (streak >= maxStreak) {
        setTimeLeft('');
      } else {
        const elapsed = now - lastRegenTime;
        const remaining = thirtyMinutes - (elapsed % thirtyMinutes);
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }

      
      if (hearts >= maxHearts) {
        setHeartTimeLeft('');
      } else {
        const elapsed = now - lastHeartRegenTime;
        const remaining = thirtyMinutes - (elapsed % thirtyMinutes);
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setHeartTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, [streak, maxStreak, lastRegenTime, hearts, maxHearts, lastHeartRegenTime]);

  
  const baseClassmates = MOCK_CLASSROOMS['KELAS1'].students;
  const allInClass = [
    ...baseClassmates,
    { name: userName, score: crowns, isMe: true }
  ].sort((a, b) => b.score - a.score);
  const myRank = allInClass.findIndex(u => u.isMe) + 1;

  const getHeaderStyle = () => {
    return { backgroundColor: 'var(--sidebar-bg)', borderBottomColor: 'var(--sidebar-border)' };
  };

  const headerStyle = getHeaderStyle();

  return (
    <header className="header" style={headerStyle}>
      <div className="user-badge-container">
        <StudentAvatar size={34} />
        <div className="user-badge">
          <span className="user-name-txt">{userName} | Peringkat {myRank}</span>
          <span className="user-title-txt">{userTitle}</span>
        </div>
      </div>
      
      <div className="stats-group">
        <div className="header-pill">
          <Star size={16} fill="#FFC800" color="#FFC800" />
          <span className="pill-val">{crowns}</span>
        </div>
        
        <div className="header-pill obor-pill">
          <Flame size={16} fill="none" color="#FF4B4B" strokeWidth={2.5} />
          <span className="pill-val">{streak}/{maxStreak}</span>
          {timeLeft && <span className="pill-sep"></span>}
          {timeLeft && <span className="regen-timer">{timeLeft}</span>}
        </div>
        
        <div className="header-pill hearts-pill">
          <Heart size={16} fill="#FF4B4B" color="#FF4B4B" />
          <span className="pill-val">{hearts}/{maxHearts}</span>
          {heartTimeLeft && <span className="pill-sep"></span>}
          {heartTimeLeft && <span className="regen-timer">{heartTimeLeft}</span>}
        </div>
      </div>

      <style jsx>{`
        .header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 10px; border-bottom: 4px solid rgba(0,0,0,0.2);
          transition: background 0.3s ease; height: 56px;
          box-sizing: border-box; width: 100%; overflow: hidden;
        }
        @media (max-width: 600px) {
          .header { padding: 0 6px; }
          .user-name-txt { font-size: 0.75rem !important; max-width: 80px !important; }
          .user-badge-container { gap: 4px !important; flex: 1; min-width: 0; }
          .stats-group { gap: 2px !important; flex-shrink: 0; }
          .header-pill { padding: 2px 4px !important; gap: 2px !important; border-radius: 8px !important; }
          .pill-val { font-size: 0.7rem !important; }
          .user-title-txt { font-size: 0.5rem !important; margin-top: 0 !important; }
          .regen-timer, .pill-sep { display: none !important; }
          :global(.header-pill svg) { width: 12px !important; height: 12px !important; }
        }
        .user-badge-container { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .user-badge { display: flex; flex-direction: column; min-width: 0; }
        .user-name-txt { 
          font-weight: 900; color: white; font-size: 1rem; line-height: 1.1; 
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .user-title-txt { font-weight: 800; color: rgba(255,255,255,0.7); font-size: 0.6rem; text-transform: uppercase; margin-top: 1px; }

        .stats-group { display: flex; gap: 4px; }
        .header-pill {
          background: rgba(0,0,0,0.1);
          padding: 3px 8px;
          border-radius: 12px;
          display: flex; align-items: center; gap: 5px;
          border: 1.5px solid rgba(255,255,255,0.3);
          box-shadow: 0 2px 0 rgba(0,0,0,0.1);
          transition: transform 0.1s;
          cursor: pointer;
        }
        .header-pill:active { transform: translateY(2px); box-shadow: none; }
        .pill-val { color: white; font-weight: 900; font-size: 0.85rem; letter-spacing: -0.5px; }
        
        .obor-pill, .hearts-pill { min-width: 55px; justify-content: center; }
        .pill-sep { width: 1px; height: 12px; background: rgba(255,255,255,0.3); margin: 0 3px; }
        .regen-timer { font-size: 0.7rem; font-weight: 900; color: white; }
        @media (min-width: 1024px) {
          .stats-group { display: none !important; }
        }
      `}</style>
    </header>
  );
}
