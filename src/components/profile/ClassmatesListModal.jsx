import React, { useState } from 'react';
import { X, Trophy, Star, ChevronRight, UserPlus, Search } from 'lucide-react';

export default function ClassmatesListModal({ classmates, onClose, onSelectFriend }) {
  const [activeTab, setActiveTab] = useState('biasa');
  const [friendCode, setFriendCode] = useState('');

  
  const regularFriends = [
    { id: 'f1', name: 'Andi', score: 120, avatar: '🦊', isMe: false },
    { id: 'f2', name: 'Siti', score: 95, avatar: '🐰', isMe: false },
  ];

  
  const sortedClassmates = [...classmates].sort((a, b) => b.score - a.score);
  const sortedRegularFriends = [...regularFriends].sort((a, b) => b.score - a.score);

  const displayList = activeTab === 'biasa' ? sortedRegularFriends : sortedClassmates;

  const handleAddFriend = () => {
    if (friendCode.trim() !== '') {
      alert(`Mencari teman dengan kode: ${friendCode}`);
      setFriendCode('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="classmates-modal">
        <div className="modal-header">
          <h3>Daftar Teman</h3>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        
        <div className="add-friend-section">
          <div className="input-wrapper">
            <Search size={16} color="#aaa" />
            <input 
              type="text" 
              placeholder="Masukkan kode teman..." 
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={handleAddFriend}>
            <UserPlus size={16} />
            <span>Tambah</span>
          </button>
        </div>

        
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'biasa' ? 'active' : ''}`}
            onClick={() => setActiveTab('biasa')}
          >
            Teman
          </button>
          <button 
            className={`tab-btn ${activeTab === 'kelas' ? 'active' : ''}`}
            onClick={() => setActiveTab('kelas')}
          >
            Teman Kelas
          </button>
        </div>

        
        <div className="classmates-list">
          {displayList.map((friend, index) => (
            <div 
              key={friend.id} 
              className={`friend-row ${friend.isMe ? 'is-me' : ''}`} 
              onClick={() => onSelectFriend(friend)}
            >
              <div className="rank-badge" data-rank={index + 1}>
                {index < 3 ? <Trophy size={14} /> : index + 1}
              </div>
              <div className="friend-avatar">{friend.avatar}</div>
              <div className="friend-info">
                <span className="friend-name">
                  {friend.name} {friend.isMe && <span className="me-tag">(Kamu)</span>}
                </span>
                <div className="friend-stats-mini">
                  <Star size={12} fill="#f4c265" color="#f4c265" />
                  <span>{friend.score} Prasasti</span>
                </div>
              </div>
              {friend.isMe ? (
                <div className="me-indicator"><Star size={18} fill="#f4c265" color="#f4c265" /></div>
              ) : (
                <ChevronRight size={18} color="#ccc" />
              )}
            </div>
          ))}
          {displayList.length === 0 && (
            <div className="empty-state">
              Belum ada teman di daftar ini.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.7); display: flex; justify-content: center;
          align-items: center; z-index: 6000; padding: 20px;
          backdrop-filter: blur(5px);
        }
        .classmates-modal {
          background: var(--card-bg); width: 100%; max-width: 400px;
          border-radius: 32px; border: 4px solid var(--border-color);
          display: flex; flex-direction: column; max-height: 85vh;
          animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .modal-header {
          padding: 20px 20px 15px; border-bottom: 2px solid var(--border-color);
          display: flex; justify-content: space-between; align-items: center;
        }
        .modal-header h3 { font-weight: 900; color: var(--text-color); margin: 0; font-size: 1.3rem; }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        
        .add-friend-section {
          padding: 15px 20px;
          display: flex; gap: 10px; align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .input-wrapper {
          flex: 1; display: flex; align-items: center; gap: 8px;
          background: var(--background-color); border: 2px solid var(--border-color);
          padding: 8px 12px; border-radius: 16px;
        }
        .input-wrapper input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.9rem;
          color: var(--text-color);
        }
        .add-btn {
          background: #58cc02; border: 2px solid #58cc02; border-bottom: 4px solid #46a302;
          color: white; font-weight: 800; padding: 8px 12px; border-radius: 14px;
          display: flex; align-items: center; gap: 6px; cursor: pointer;
          transition: transform 0.1s;
        }
        .add-btn:active { transform: translateY(2px); border-bottom-width: 2px; }

        .tabs-container {
          display: flex; padding: 10px 20px 0; gap: 10px;
          border-bottom: 2px solid var(--border-color);
        }
        .tab-btn {
          flex: 1; padding: 10px; font-weight: 800; font-size: 0.95rem;
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }
        .tab-btn.active {
          color: #1cb0f6; border-bottom: 3px solid #1cb0f6;
        }

        .classmates-list { flex: 1; overflow-y: auto; padding: 10px; min-height: 200px; }
        .empty-state {
          text-align: center; padding: 30px 20px; color: var(--text-muted);
          font-weight: 700; font-size: 0.9rem;
        }
        
        .friend-row {
          display: flex; align-items: center; gap: 12px; padding: 12px;
          border-radius: 16px; transition: background 0.2s; cursor: pointer;
          border-bottom: 1px solid var(--background-color);
        }
        .friend-row:hover { background: var(--background-color); }
        .friend-row.is-me {
          background: #e3f2fd; border: 2px solid #1cb0f6;
          margin: 4px 0; box-shadow: 0 4px 0 rgba(28, 176, 246, 0.2);
        }
        
        .rank-badge {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; justify-content: center; align-items: center;
          font-weight: 900; font-size: 0.75rem; background: #eee; color: #999;
        }
        .rank-badge[data-rank="1"] { background: #ffdf00; color: #856404; }
        .rank-badge[data-rank="2"] { background: #e0e0e0; color: #666; }
        .rank-badge[data-rank="3"] { background: #cd7f32; color: white; }

        .friend-avatar { font-size: 1.8rem; width: 45px; height: 45px; display: flex; justify-content: center; align-items: center; }
        .friend-info { flex: 1; }
        .friend-name { font-weight: 800; color: var(--text-color); font-size: 0.95rem; }
        .me-tag { color: #1cb0f6; font-size: 0.7rem; font-weight: 900; margin-left: 4px; }
        .friend-stats-mini { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--text-muted); font-weight: 700; margin-top: 2px; }
      `}</style>
    </div>
  );
}
