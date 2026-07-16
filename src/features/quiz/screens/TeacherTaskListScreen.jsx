import React, { useState } from 'react';
import { ChevronLeft, GraduationCap, Play, Trophy, Clock, X, List } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { MOCK_CLASSROOMS } from '../../../data/classrooms';
import { QUIZ_REGISTRY } from '../../../data/quiz/quizRegistry';

export default function TeacherTaskListScreen() {
  const { activeClass } = useStore();
  const { setQuizSubView, setActiveQuizTheme } = useNavigationStore();
  const [selectedTask, setSelectedTask] = useState(null);

  let assignments = [];
  if (activeClass) {
    const freshClass = Object.values(MOCK_CLASSROOMS).find(c => c.id === activeClass.id);
    assignments = freshClass?.assignments || activeClass.assignments || [];
  } else {
    
    Object.values(MOCK_CLASSROOMS).forEach(cls => {
      if (cls.assignments && cls.assignments.length > 0) {
        
        const taggedAssignments = cls.assignments.map(a => ({
          ...a,
          className: cls.name
        }));
        assignments = [...assignments, ...taggedAssignments];
      }
    });
  }

  return (
    <div className="teacher-task-container">
      <div className="task-header">
        <button className="back-btn-white" onClick={() => setQuizSubView('hub')}>
          <ChevronLeft size={24} />
          <span>KEMBALI</span>
        </button>
        <div className="header-content">
          <div className="icon-badge">
            <GraduationCap size={32} color="white" />
          </div>
          <h2 className="header-title">Tugas Guru</h2>
          <p className="header-subtitle">
            Kuis khusus dari <strong>{activeClass?.name || 'Semua Kelas'}</strong>
          </p>
        </div>
      </div>

      <div className="tasks-content">
        {assignments.length > 0 ? (
          <div className="tasks-grid">
            <p className="section-hint">Tugas yang belum kamu kerjakan:</p>
            {assignments.map(task => (
              <div 
                key={task.id} 
                className="task-card"
                onClick={() => setSelectedTask(task)}
              >
                <div className="task-card-left">
                  <div className="task-icon-circle">
                    <GraduationCap size={28} color="#ce82ff" />
                  </div>
                </div>
                <div className="task-card-body">
                  <h4 className="task-title">{task.title}</h4>
                  <div className="task-meta">
                    <div className="meta-badge xp-badge">
                      <Trophy size={14} color="#f4c265" />
                      <span>{task.xpReward || 500} ⭐</span>
                    </div>
                    {task.durationLimit && (
                      <div className="meta-badge time-badge">
                        <Clock size={14} color="#1cb0f6" />
                        <span>{task.durationLimit} Menit</span>
                      </div>
                    )}
                    {task.className && (
                      <div className="meta-badge class-badge">
                        <GraduationCap size={14} color="#9333ea" />
                        <span>{task.className}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="task-card-right">
                  <div className="play-mini-btn">
                    <Play size={18} fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-tasks-state">
            <div className="empty-icon">🎒</div>
            <h3>Hore! Belum Ada Tugas</h3>
            <p>Sepertinya guru belum memberikan tugas baru untuk kelasmu.</p>
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="task-modal-overlay">
          <div className="task-modal-content">
            <button className="close-modal" onClick={() => setSelectedTask(null)}>
              <X size={24} />
            </button>
            <div className="modal-header">
              <div className="modal-icon-bg">
                <GraduationCap size={40} color="white" />
              </div>
              <h3>{selectedTask.title}</h3>
              <p>Detail Tugas Guru</p>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <div className="detail-icon"><List size={18} color="#ce82ff" /></div>
                <div className="detail-text">
                  <span className="lbl">Jumlah Soal</span>
                  <span className="val">
                    {selectedTask.questions?.length || (QUIZ_REGISTRY[selectedTask.themeId] ? QUIZ_REGISTRY[selectedTask.themeId].length : 10)} Soal
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-icon"><Clock size={18} color="#1cb0f6" /></div>
                <div className="detail-text">
                  <span className="lbl">Waktu Pengerjaan</span>
                  <span className="val">{selectedTask.durationLimit ? `${selectedTask.durationLimit} Menit` : 'Tanpa Batas'}</span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-icon"><Trophy size={18} color="#f4c265" /></div>
                <div className="detail-text">
                  <span className="lbl">Hadiah Maksimal</span>
                  <span className="val">{selectedTask.xpReward || 500} ⭐</span>
                </div>
              </div>
            </div>
            <button 
              className="start-task-btn" 
              onClick={() => {
                const qCount = selectedTask.questions?.length || (QUIZ_REGISTRY[selectedTask.themeId] ? QUIZ_REGISTRY[selectedTask.themeId].length : 10);
                setActiveQuizTheme({ id: selectedTask.themeId, title: selectedTask.title }, qCount);
                setQuizSubView('play');
              }}
            >
              <Play size={20} fill="currentColor" />
              <span>MULAI KERJAKAN</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .teacher-task-container {
          flex: 1; 
          background: var(--background-color);
          overflow-y: auto; 
          padding-bottom: 100px;
        }
        .task-header {
          background: #ce82ff; 
          padding: 25px 20px 30px; 
          color: white;
          border-bottom-left-radius: 40px; 
          border-bottom-right-radius: 40px;
          box-shadow: 0 10px 0 rgba(0,0,0,0.05);
        }
        .back-btn-white {
          background: rgba(255,255,255,0.2); 
          border: 2px solid white;
          color: white; 
          border-radius: 50px; 
          padding: 6px 12px;
          font-weight: 900; 
          display: flex; 
          align-items: center;
          gap: 4px; 
          cursor: pointer; 
          margin-bottom: 20px; 
          font-size: 0.8rem;
        }
        .header-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .icon-badge {
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.2);
          border: 3px solid white;
          border-radius: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 15px;
        }
        .header-title { 
          font-weight: 900; 
          font-size: 1.8rem; 
          margin: 0 0 5px 0; 
        }
        .header-subtitle {
          margin: 0;
          font-size: 0.95rem;
          opacity: 0.9;
        }

        .tasks-content { 
          padding: 20px; 
          margin-top: 10px; 
        }
        .section-hint { 
          font-weight: 900; 
          font-size: 0.8rem; 
          color: var(--text-muted); 
          text-transform: uppercase; 
          margin-bottom: 10px; 
        }
        .tasks-grid { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
        }
        
        .task-card {
          background: var(--card-bg); 
          border: 2px solid var(--border-color);
          border-radius: 24px; 
          padding: 16px; 
          display: flex; 
          align-items: center;
          gap: 15px; 
          cursor: pointer; 
          box-shadow: 0 6px 0 var(--border-color);
          transition: all 0.2s;
        }
        .task-card:active { 
          transform: translateY(4px); 
          box-shadow: 0 2px 0 var(--border-color); 
        }

        .task-icon-circle {
          width: 60px; 
          height: 60px; 
          background: #fdf6e3;
          border-radius: 18px; 
          display: flex; 
          justify-content: center; 
          align-items: center;
          border: 3px solid #f2e3c6;
        }
        .task-card-body { 
          flex: 1; 
        }
        .task-title { 
          font-weight: 900; 
          font-size: 1.1rem; 
          color: var(--text-color); 
          margin: 0 0 8px 0; 
          line-height: 1.2; 
        }
        .task-meta { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          flex-wrap: wrap;
        }
        .meta-badge {
          display: flex; 
          align-items: center; 
          gap: 4px; 
          padding: 4px 8px; 
          border-radius: 8px; 
          font-weight: 900; 
          font-size: 0.75rem; 
        }
        .xp-badge {
          background: #fff9eb; 
          border: 1px solid #ffe8b3; 
          color: #f4c265;
        }
        .time-badge {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          color: #0284c7;
        }
        .class-badge {
          background: #f3e8ff;
          border: 1px solid #d8b4fe;
          color: #9333ea;
        }

        .play-mini-btn { 
          width: 40px; 
          height: 40px; 
          background: #ce82ff; 
          color: white; 
          border-radius: 12px; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0 4px 0 #af6ee1; 
        }

        .empty-tasks-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
          opacity: 0.6;
        }
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }
        .empty-tasks-state h3 {
          font-weight: 900;
          color: var(--text-color);
          margin: 0 0 10px 0;
          font-size: 1.3rem;
        }
        .empty-tasks-state p {
          color: var(--text-muted);
          font-weight: 700;
          margin: 0;
          font-size: 0.95rem;
          max-width: 250px;
        }

        /* Modal Styles */
        .task-modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center;
          z-index: 3000; padding: 20px;
        }
        .task-modal-content {
          background: var(--card-bg); width: 100%; max-width: 400px;
          border-radius: 32px; padding: 30px; position: relative;
          border: 4px solid var(--border-color); text-align: center;
        }
        .close-modal { 
          position: absolute; top: 20px; right: 20px; 
          background: none; border: none; color: var(--text-muted); cursor: pointer; 
        }
        .modal-icon-bg {
          width: 80px; height: 80px; background: #ce82ff; border-radius: 24px;
          margin: 0 auto 15px; display: flex; justify-content: center; align-items: center;
          box-shadow: 0 6px 0 #af6ee1;
        }
        .modal-header h3 { font-weight: 900; font-size: 1.4rem; color: var(--text-color); margin-bottom: 5px; }
        .modal-header p { font-weight: 800; color: var(--text-muted); font-size: 0.9rem; margin-top: 0; }
        .modal-body { 
          margin-top: 25px; 
          background: var(--background-color);
          border-radius: 20px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 2px solid var(--border-color);
        }
        .detail-row {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }
        .detail-icon {
          width: 40px; height: 40px; background: white; border-radius: 12px;
          display: flex; justify-content: center; align-items: center;
          border: 2px solid var(--border-color);
        }
        .detail-text {
          display: flex; flex-direction: column;
        }
        .detail-text .lbl { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); }
        .detail-text .val { font-size: 1rem; font-weight: 900; color: var(--text-color); }
        
        .start-task-btn {
          margin-top: 25px; width: 100%; background: #58cc02; color: white; border: none; padding: 18px;
          border-radius: 16px; font-weight: 900; font-size: 1.1rem;
          display: flex; justify-content: center; align-items: center; gap: 10px;
          box-shadow: 0 6px 0 #46a302; cursor: pointer; transition: transform 0.1s;
        }
        .start-task-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #46a302; }
      `}</style>
    </div>
  );
}
