import React, { useState } from 'react';
import { ChevronLeft, LogOut, PlayCircle, BookOpen, CheckSquare } from 'lucide-react';
import FriendProfileModal from '../../../components/profile/FriendProfileModal';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';

export default function ClassroomLobbyScreen() {
  const { activeClass, userName, setActiveClass } = useStore();
  const { setQuizSubView, setActiveQuizTheme } = useNavigationStore();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPresent, setIsPresent] = useState(false);
  if (!activeClass) return null;

  // 1. We'll show you (ME) and a subset of friends (e.g. 8 friends)
  const classmatesToShow = (activeClass.students || []).slice(0, 8);
  
  // 2. Desk mapping: 
  // Desk 1: ME
  // Other desks: Classmates
  const desksWithPeople = [
    { id: 1, name: userName + ' (Kamu)', avatar: '⭐', isMe: true },
    ...classmatesToShow.map((s, idx) => ({ ...s, deskId: idx + 2 }))
  ];

  const maxDesks = 12;
  const deskIds = Array.from({ length: maxDesks }, (_, i) => i + 1);

  return (
    <div className="classroom-container">
      {/* 1. Header & Papan Tulis */}
      <div className="chalkboard-area">
        <button className="leave-class-btn" onClick={() => {
          setActiveClass(null);
          setQuizSubView('hub');
        }}>
          <LogOut size={18} />
          <span>KELUAR</span>
        </button>
        
        <div className="chalkboard">
          <div className="chalk-frame">
            <h2 className="class-name">{activeClass.name}</h2>
            <div className="chalk-divider" />
            <p className="teacher-note">"{activeClass.chalkboardMessage}"</p>
            <div className="teacher-info">
              <span className="teacher-label">GURU:</span>
              <span className="teacher-name">{activeClass.teacher}</span>
            </div>
            
            <button 
              className={`presence-btn ${isPresent ? 'present' : ''}`}
              onClick={() => setIsPresent(true)}
              disabled={isPresent}
            >
              <CheckSquare size={18} />
              <span>{isPresent ? 'HADIR' : 'ISI PRESENSI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Classroom Area */}
      <div className="classroom-visual">
        {/* Meja Guru */}
        <div className="teacher-desk-section">
          <div className="student-avatar-bubble teacher-pos">
            <span className="avatar-emoji">👩‍🏫</span>
            <div className="student-name-tag">Ibu Guru</div>
          </div>
          <div className="teacher-desk">
            <div className="desk-surface">
              <BookOpen size={20} color="#fff" />
            </div>
            <div className="desk-base" />
          </div>
        </div>

        {/* Meja Murid Grid */}
        <div className="students-grid">
          {deskIds.map(id => {
            const occupant = desksWithPeople.find(p => p.deskId === id || p.id === id); // Combined check
            // Fix: the mapping above assigned deskId for classmates. Let's use it properly.
            const person = desksWithPeople.find(p => p.isMe ? id === 1 : p.deskId === id);

            return (
              <div key={id} className="desk-slot">
                {person ? (
                  <div className="student-at-desk" onClick={() => !person.isMe && setSelectedStudent(person)}>
                    <div className={`student-avatar-bubble ${person.isMe ? 'is-me-bubble' : ''}`}>
                      <span className="avatar-emoji">{person.avatar}</span>
                      <div className="student-name-tag">{person.name}</div>
                    </div>
                    <div className={`desk-murid active ${person.isMe ? 'is-me-desk' : ''}`} />
                  </div>
                ) : (
                  <div className="desk-murid empty">
                    <div className="desk-loading-spinner" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Task Panel */}
      <div className="classroom-footer">
        {activeClass.assignments && activeClass.assignments.length > 0 && (
          <div className="task-banner">
            <div className="task-info">
              <PlayCircle size={24} color="#f4c265" />
              <div className="task-text">
                <span className="task-lbl">TUGAS HARI INI</span>
                <h4 className="task-h">{activeClass.assignments[0].title}</h4>
              </div>
            </div>
            <button className="start-task-btn" onClick={() => {
              const task = activeClass.assignments[0];
              setActiveQuizTheme({ id: task.themeId, title: task.title });
              setQuizSubView('play');
            }}>
              KERJAKAN
            </button>
          </div>
        )}
      </div>

      {selectedStudent && (
        <FriendProfileModal 
          friend={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}

      <style jsx>{`
        .classroom-container {
          flex: 1; background: #e6d5b8;
          display: flex; flex-direction: column; overflow: hidden;
        }
        .chalkboard-area { padding: 20px; background: #fdf6e3; border-bottom: 4px solid #d4c4a8; }
        .leave-class-btn {
          background: #ff4b4b; color: white; border: none; padding: 6px 12px;
          border-radius: 50px; font-weight: 900; font-size: 0.75rem;
          display: flex; align-items: center; gap: 6px; cursor: pointer; margin-bottom: 15px;
          box-shadow: 0 4px 0 #ea2b2b;
        }
        .chalkboard {
          background: #2d3e33; border: 10px solid #5d4037; border-radius: 12px;
          padding: 15px; position: relative; box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
        }
        .chalk-frame { color: white; text-align: center; }
        .class-name { font-weight: 900; font-size: 1.2rem; color: #fff; margin-bottom: 10px; }
        .chalk-divider { height: 2px; background: rgba(255,255,255,0.2); width: 60%; margin: 0 auto 10px; }
        .teacher-note { font-style: italic; font-size: 0.9rem; color: #d7ffb8; margin-bottom: 10px; }
        .teacher-info { font-size: 0.75rem; opacity: 0.8; }
        .presence-btn {
          margin-top: 15px; background: #FFD700; border: none; padding: 10px 20px;
          border-radius: 12px; font-weight: 900; color: #D97706; display: flex; align-items: center; gap: 8px;
          cursor: pointer; box-shadow: 0 4px 0 #D97706; transition: all 0.2s; align-self: center;
        }
        .presence-btn:active:not(:disabled) { transform: translateY(4px); box-shadow: 0 0 0 transparent; }
        .presence-btn.present { background: #58CC02; color: white; box-shadow: 0 4px 0 #46A302; cursor: default; }
        .presence-btn.present:active { transform: none; }

        .classroom-visual {
          flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center;
          background: #e6d5b8;
        }
        .teacher-desk-section { margin-bottom: 40px; position: relative; }
        .teacher-desk { width: 120px; height: 60px; position: relative; }
        .desk-surface { 
          width: 100%; height: 35px; background: #8d6e63; border-radius: 6px;
          display: flex; justify-content: center; align-items: center;
          position: relative; z-index: 2; border: 2px solid #5d4037;
        }
        .desk-base {
          width: 90%; height: 25px; background: #5d4037; margin: -5px auto 0;
          border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;
        }
        .students-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px 20px;
          width: 100%; max-width: 350px;
        }
        .desk-slot { display: flex; justify-content: center; align-items: flex-end; height: 60px; }
        .desk-murid { 
          width: 60px; height: 25px; background: #b0bec5; border-radius: 4px;
          border: 2px solid #78909c; position: relative;
          display: flex; justify-content: center; align-items: center;
        }
        .desk-murid.empty { opacity: 0.5; }
        .desk-murid.active { background: #8d6e63; border-color: #5d4037; }

        .desk-loading-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(28, 176, 246, 0.3);
          border-top: 2px solid #1cb0f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          position: absolute; top: -20px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .student-at-desk { 
          position: relative; display: flex; flex-direction: column; 
          align-items: center; cursor: pointer; z-index: 5;
        }
        .student-avatar-bubble {
          background: white; width: 45px; height: 45px; border-radius: 50%;
          display: flex; justify-content: center; align-items: center;
          border: 3px solid #1cb0f6; position: absolute; bottom: 15px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 10;
        }
        .is-me-bubble { border-color: #f4c265; background: #fff9eb; transform: scale(1.1); z-index: 10; }
        .teacher-pos { bottom: 65px; border-color: #ce82ff; }

        .student-name-tag {
          position: absolute; top: -20px; background: rgba(0,0,0,0.7);
          color: white; font-size: 0.6rem; padding: 2px 6px; border-radius: 4px;
          white-space: nowrap; font-weight: 800;
        }
        .is-me-bubble .student-name-tag { background: #f4c265; }
        .teacher-pos .student-name-tag { background: #ce82ff; }
        .classroom-footer { padding: 20px; background: white; border-top: 4px solid #eee; }
        .task-banner {
          background: #fff9eb; border: 2px solid #ffe8b3; border-radius: 20px;
          padding: 15px; display: flex; justify-content: space-between; align-items: center;
        }
        .task-info { display: flex; align-items: center; gap: 12px; }
        .task-lbl { font-weight: 900; font-size: 0.7rem; color: #f4c265; }
        .task-h { font-weight: 900; font-size: 1rem; color: #333; }
        .start-task-btn {
          background: #f4c265; color: white; border: none; padding: 10px 20px;
          border-radius: 14px; font-weight: 900; box-shadow: 0 5px 0 #e68700;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
