import React, { useState } from 'react';
import { X, Search, UserCheck, UserPlus, Clock } from 'lucide-react';
import { MOCK_CLASSROOMS } from '../../data/classrooms';

export default function OnlineFriendsModal({ onClose, onInvite }) {
  const [filterAvailable, setFilterAvailable] = useState(false);
  const classmates = MOCK_CLASSROOMS['KELAS1'].students;

  
  const onlineFriends = classmates.map((s, idx) => ({
    ...s,
    
    isOnline: idx < 12,
    
    isAvailable: idx < 12 && idx % 3 !== 0 
  })).filter(s => s.isOnline);

  const displayedFriends = filterAvailable 
    ? onlineFriends.filter(f => f.isAvailable) 
    : onlineFriends;

  return (
    <div className="modal-overlay">
      <div className="friends-modal-content">
        <header className="modal-header">
          <div className="header-top">
            <h3>Teman Online</h3>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${!filterAvailable ? 'active' : ''}`}
              onClick={() => setFilterAvailable(false)}
            >
              Semua ({onlineFriends.length})
            </button>
            <button 
              className={`filter-tab ${filterAvailable ? 'active' : ''}`}
              onClick={() => setFilterAvailable(true)}
            >
              Tersedia
            </button>
          </div>
        </header>

        <div className="friends-list">
          {displayedFriends.map((friend) => (
            <div key={friend.name} className="friend-item">
              <div className="friend-avatar">
                {friend.name.charAt(0)}
              </div>
              <div className="friend-info">
                <span className="friend-name">{friend.name}</span>
                <div className="friend-status">
                  {friend.isAvailable ? (
                    <span className="status-tag available">Tersedia</span>
                  ) : (
                    <span className="status-tag busy">Sedang Bermain...</span>
                  )}
                </div>
              </div>
              
              {friend.isAvailable ? (
                <button className="invite-btn" onClick={() => onInvite(friend)}>
                  <UserPlus size={16} />
                  <span>Ajak</span>
                </button>
              ) : (
                <div className="status-icon">
                  <Clock size={16} color="#aaa" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          display: flex; align-items: flex-end; z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .friends-modal-content {
          width: 100%; max-height: 80vh; background: var(--background-color);
          border-top-left-radius: 32px; border-top-right-radius: 32px;
          display: flex; flex-direction: column; overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

        .modal-header { padding: 20px 20px 10px; border-bottom: 2px solid var(--border-color); }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .header-top h3 { font-weight: 900; font-size: 1.2rem; color: var(--text-color); }
        .close-btn { background: #eee; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .filter-tabs { display: flex; gap: 10px; }
        .filter-tab { 
          flex: 1; padding: 10px; border: none; border-radius: 12px;
          background: #eee; font-weight: 800; font-size: 0.8rem; color: #888;
          cursor: pointer; transition: all 0.2s;
        }
        .filter-tab.active { background: #CE82FF; color: white; }

        .friends-list { flex: 1; overflow-y: auto; padding: 10px 20px 40px; }
        .friend-item {
          display: flex; align-items: center; gap: 12px; padding: 15px 0;
          border-bottom: 1px solid var(--border-color);
        }
        .friend-avatar {
          width: 45px; height: 45px; background: #ddd; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; color: white; font-size: 1.2rem;
          background: linear-gradient(135deg, #afbcc9, #8fa0b0);
        }
        .friend-info { flex: 1; display: flex; flex-direction: column; }
        .friend-name { font-weight: 800; color: var(--text-color); font-size: 0.95rem; }
        
        .status-tag { font-size: 0.7rem; font-weight: 700; margin-top: 2px; }
        .status-tag.available { color: #58CC02; }
        .status-tag.busy { color: #aaa; font-style: italic; }

        .invite-btn {
          background: white; border: 2px solid #CE82FF; border-radius: 12px;
          padding: 6px 12px; display: flex; align-items: center; gap: 6px;
          color: #CE82FF; font-weight: 900; font-size: 0.8rem; cursor: pointer;
          box-shadow: 0 4px 0 #eee; transition: all 0.1s;
        }
        .invite-btn:active { transform: translateY(2px); box-shadow: none; }
      `}</style>
    </div>
  );
}
