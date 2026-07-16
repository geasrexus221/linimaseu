import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import StudentAvatar from '../common/StudentAvatar';
import { MOCK_CLASSROOMS } from '../../data/classrooms';
import { Trophy, Star, ChevronRight } from 'lucide-react';

export default function DesktopStatsPanel() {
  const { userName, userTitle, crowns, streak, hearts, maxStreak, lastRegenTime, maxHearts, lastHeartRegenTime } = useStore();
  const [timeLeft, setTimeLeft] = useState('');
  const [heartTimeLeft, setHeartTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;
      if (streak < maxStreak) {
        const remaining = thirtyMinutes - ((now - lastRegenTime) % thirtyMinutes);
        setTimeLeft(`${Math.floor(remaining / 60000)}m`);
      } else setTimeLeft('');

      if (hearts < maxHearts) {
        const remaining = thirtyMinutes - ((now - lastHeartRegenTime) % thirtyMinutes);
        setHeartTimeLeft(`${Math.floor(remaining / 60000)}m`);
      } else setHeartTimeLeft('');
    };
    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, [streak, maxStreak, lastRegenTime, hearts, maxHearts, lastHeartRegenTime]);

  const allInClass = [
    ...MOCK_CLASSROOMS['KELAS1'].students,
    { name: userName, score: crowns, isMe: true }
  ].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="stats-panel-content">
      
      <section className="mini-leaderboard">
        <div className="leaderboard-header">
          <h4 className="section-label">PERINGKAT KELAS</h4>
          <Trophy size={16} color="#FFD700" />
        </div>
        
        <div className="leader-list">
          {allInClass.map((u, i) => (
            <div key={i} className={`leader-row ${u.isMe ? 'is-me' : ''}`}>
              <span className="leader-rank">{i + 1}</span>
              <span className="leader-name">{u.name}</span>
              <div className="leader-score">
                <Star size={12} fill="#f4c265" color="#f4c265" />
                <span>{u.score}</span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="full-leaderboard-btn">
          <span>Lihat Semua Peringkat</span>
          <ChevronRight size={14} />
        </button>
      </section>

      <style jsx>{`
        .stats-panel-content { display: flex; flex-direction: column; gap: 30px; }
        
        .section-label { font-size: 0.8rem; font-weight: 900; color: rgba(255,255,255,0.9); margin-bottom: 15px; letter-spacing: 1px; }

        .leaderboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .leader-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
        .leader-row {
          display: flex; align-items: center; gap: 10px; padding: 10px 15px;
          border-radius: 12px; font-weight: 800; font-size: 0.85rem; color: white;
        }
        .leader-row.is-me { background: rgba(255,255,255,0.25); color: white; }
        .leader-rank { width: 20px; color: rgba(255,255,255,0.9); font-weight: 900; }
        .leader-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .leader-score { display: flex; align-items: center; gap: 4px; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }

        .full-leaderboard-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3);
          border-radius: 15px; color: white; font-weight: 900; font-size: 0.85rem;
          cursor: pointer; transition: all 0.2s; text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .full-leaderboard-btn:hover { background: rgba(255,255,255,0.2); color: white; border-color: white; }
      `}</style>
    </div>
  );
}
