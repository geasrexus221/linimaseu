import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Users, BarChart3, Settings, LogOut, Sparkles, Plus, Bell
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { MOCK_CLASSROOMS } from '../../../data/classrooms';
import { IPAS_QUIZ_DATA } from '../../../data/ipasQuizData';

import DashboardOverview from '../components/DashboardOverview';
import StudentManagement from '../components/StudentManagement';
import QuizBankMain from '../components/quiz/QuizBankMain';
import TeacherSettings from '../components/TeacherSettings';
import LinimasaLogo from '../../../assets/UI/element/Linimasa.svg';
import AnnouncementModal from '../components/modals/AnnouncementModal';
import ClassroomModal from '../components/modals/ClassroomModal';
import QuizCollectionModal from '../components/modals/QuizCollectionModal';
import StudentDetailModal from '../components/modals/StudentDetailModal';
import AddStudentModal from '../components/modals/AddStudentModal';
import DevTestingOverlay from '../components/modals/DevTestingOverlay';
import ActivateQuizModal from '../components/modals/ActivateQuizModal';
import ProjectorOverlay from '../components/modals/ProjectorOverlay';
import ProjectorThemeModal from '../components/modals/ProjectorThemeModal';

export default function TeacherDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { theme, setTheme, isDevMode, setIsDevMode, globalAnnouncements, setGlobalAnnouncements } = useStore();
  const [showDevMode, setShowDevMode] = useState(isDevMode);

  useEffect(() => {
    setShowDevMode(isDevMode);
  }, [isDevMode]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState(null); 
  const [classroomsState, setClassroomsState] = useState(MOCK_CLASSROOMS);

  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null); 
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [editClassName, setEditClassName] = useState('');

  
  const [studentRecords, setStudentRecords] = useState({});

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementInput, setAnnouncementInput] = useState('');
  const [selectedTargetClassId, setSelectedTargetClassId] = useState('ALL');

  
  const [quizCollections, setQuizCollections] = useState([
    IPAS_QUIZ_DATA,
    {
      id: 'default-collection-2',
      title: 'Materi Cahaya (Kelas 5 SD)',
      targetClassId: 'KELAS2',
      targetClassName: 'Kelas 5-B',
      durationLimit: 30,
      description: 'Latihan soal interaktif bertema Cahaya dan Alat Optik untuk siswa kelas 5 SD.',
      xpReward: 350,
      questions: [
        {
          id: 'light-q1',
          text: 'Cahaya merambat paling cepat saat melalui medium apa?',
          questionType: 'CLASSIC',
          options: ['Hampa udara / udara', 'Air jernih', 'Kaca bening'],
          correctAnswerIndex: 0
        },
        {
          id: 'light-q2',
          text: 'Susunlah huruf berikut agar membentuk istilah penguraian cahaya matahari menjadi pelangi!',
          questionType: 'ANAGRAM',
          options: ['DISPERSI', '', ''],
          correctAnswerIndex: 0
        },
        {
          id: 'light-q3',
          text: 'Hubungkan alat optik berikut dengan jenis cermin atau lensa yang digunakannya!',
          questionType: 'MATCHING',
          options: [
            'Periskop kapal selam : Cermin datar',
            'Kaca spion motor : Cermin cembung',
            'Lup / Kaca pembesar : Lensa cembung'
          ],
          correctAnswerIndex: 0
        },
        {
          id: 'light-q4',
          text: 'Kelompokkan benda-benda berikut berdasarkan kemampuannya menembus berkas cahaya!',
          questionType: 'CATEGORIZATION',
          options: [
            'Benda Bening : Plastik mika, Kaca jendela, Air jernih',
            'Benda Gelap : Kayu triplek, Buku tulis, Batu bata'
          ],
          correctAnswerIndex: 0
        },
        {
          id: 'light-q5',
          text: 'Dasar kolam renang terlihat lebih dangkal dari kedalaman aslinya karena adanya peristiwa ____ cahaya.',
          questionType: 'BLANKS',
          options: ['Pembiasan', 'Pemantulan', 'Penguraian'],
          correctAnswerIndex: 0
        }
      ]
    },
    {
      id: 'default-collection-1',
      title: 'Latihan Zaman Purba',
      targetClassId: 'ALL',
      targetClassName: 'Semua Kelas',
      durationLimit: 30,
      description: 'Pertanyaan dasar tentang manusia purba dan peralatan batu.',
      xpReward: 250,
      questions: [
        {
          id: 'q1',
          text: 'Alat batu peninggalan zaman batu kuno yang kasar disebut...',
          questionType: 'CLASSIC',
          options: ['Kapak Genggam', 'Kapak Lonjong', 'Kapak Persegi'],
          correctAnswerIndex: 0
        },
        {
          id: 'q2',
          text: 'Fosil pithecanthropus erectus ditemukan pertama kali di daerah...',
          questionType: 'CLASSIC',
          options: ['Sangiran', 'Trinil', 'Mojokerto'],
          correctAnswerIndex: 1
        }
      ]
    }
  ]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [newCollectionTargetClassId, setNewCollectionTargetClassId] = useState('ALL');
  const [newCollectionDurationLimit, setNewCollectionDurationLimit] = useState(30);
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [newCollectionXpReward, setNewCollectionXpReward] = useState(200);

  
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionOptionA, setNewQuestionOptionA] = useState('');
  const [newQuestionOptionB, setNewQuestionOptionB] = useState('');
  const [newQuestionOptionC, setNewQuestionOptionC] = useState('');
  const [newQuestionCorrectIndex, setNewQuestionCorrectIndex] = useState(0);
  const [newQuestionType, setNewQuestionType] = useState('CLASSIC');

  
  const [testingQuestion, setTestingQuestion] = useState(null);
  const [testingCollection, setTestingCollection] = useState(null);

  const [selectedDiagnosticClassId, setSelectedDiagnosticClassId] = useState('ALL');
  const [selectedDiagnosticTopicIndex, setSelectedDiagnosticTopicIndex] = useState(0);

  
  const [activeQuizModalCol, setActiveQuizModalCol] = useState(null);

  
  const [projectorModalCol, setProjectorModalCol] = useState(null); 
  const [projectorCollection, setProjectorCollection] = useState(null); 
  const [projectorTheme, setProjectorTheme] = useState('MODERN'); 

  const handleActivateQuiz = (collectionId, durationMinutes) => {
    const activeUntil = Date.now() + durationMinutes * 60 * 1000;

    
    setQuizCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        return {
          ...col,
          isActive: true,
          activeUntil,
          activeDuration: durationMinutes
        };
      }
      return col;
    }));

    
    const col = quizCollections.find(c => c.id === collectionId);
    if (!col) return;

    
    const updatedClassrooms = { ...classroomsState };
    const targetClassId = col.targetClassId;

    const newAssignment = {
      id: 'assignment-' + col.id,
      title: col.title,
      type: 'quiz',
      themeId: col.id,
      questions: col.questions || [],
      durationLimit: col.durationLimit,
      xpReward: col.xpReward,
      activeUntil,
      activeDuration: durationMinutes
    };

    if (targetClassId === 'ALL') {
      Object.keys(updatedClassrooms).forEach(key => {
        const filtered = (updatedClassrooms[key].assignments || []).filter(a => a.themeId !== col.id);
        updatedClassrooms[key].assignments = [newAssignment, ...filtered];
      });
    } else if (updatedClassrooms[targetClassId]) {
      const filtered = (updatedClassrooms[targetClassId].assignments || []).filter(a => a.themeId !== col.id);
      updatedClassrooms[targetClassId].assignments = [newAssignment, ...filtered];
    }

    setClassroomsState(updatedClassrooms);
    Object.assign(MOCK_CLASSROOMS, updatedClassrooms);
  };

  const handleAddStudent = (studentData) => {
    if (!selectedClassroom) return;
    
    const updatedClassrooms = { ...classroomsState };
    const room = updatedClassrooms[selectedClassroom];
    
    
    const newId = `student-${Date.now()}`;
    const newStudent = {
      id: newId,
      name: studentData.name,
      mockNIS: studentData.nis,
      mockID: studentData.name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000),
      isOnline: false,
      hasFinishedTask: false,
      totalXP: 0,
      totalCrowns: 0,
      notes: ''
    };

    room.students = [...(room.students || []), newStudent];
    
    setClassroomsState(updatedClassrooms);
    Object.assign(MOCK_CLASSROOMS, updatedClassrooms);
    
    setShowAddStudentModal(false);
  };

  const handleDeactivateQuiz = (collectionId) => {
    
    setQuizCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        return {
          ...col,
          isActive: false,
          activeUntil: null,
          activeDuration: null
        };
      }
      return col;
    }));

    
    const updatedClassrooms = { ...classroomsState };
    Object.keys(updatedClassrooms).forEach(key => {
      if (updatedClassrooms[key].assignments) {
        updatedClassrooms[key].assignments = updatedClassrooms[key].assignments.filter(a => a.themeId !== collectionId);
      }
    });

    setClassroomsState(updatedClassrooms);
    Object.assign(MOCK_CLASSROOMS, updatedClassrooms);

    const activeClass = useStore.getState().activeClass;
    if (activeClass) {
      const classKey = Object.keys(updatedClassrooms).find(k => updatedClassrooms[k].id === activeClass.id);
      if (classKey) {
        useStore.getState().setActiveClass(updatedClassrooms[classKey]);
      }
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      quizCollections.forEach(col => {
        if (col.isActive && col.activeUntil && now > col.activeUntil) {
          handleDeactivateQuiz(col.id);
        }
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [quizCollections, classroomsState]);

  const getDiagnosticData = (classId) => {
    switch (classId) {
      case 'ALL':
        return [
          {
            topic: 'Zaman Purba & Fosil',
            accuracy: 45,
            color: 'var(--danger-text)',
            trend: -8,
            mastery: { paham: '35%', cukup: '25%', kurang: '40%' },
            underperformingStudents: ['Azzahra Putri', 'Aditya Pratama', 'Budi Wijaya']
          },
          {
            topic: 'Raja-Raja Nusantara',
            accuracy: 52,
            color: 'var(--warning-text)',
            trend: -3,
            mastery: { paham: '40%', cukup: '30%', kurang: '30%' },
            underperformingStudents: ['Citra Lestari', 'Dewi Lestari']
          },
          {
            topic: 'Kerajaan Hindu-Buddha',
            accuracy: 74,
            color: 'var(--primary-text)',
            trend: 5,
            mastery: { paham: '60%', cukup: '25%', kurang: '15%' },
            underperformingStudents: ['Eko Susilo']
          },
          {
            topic: 'Kemerdekaan Indonesia',
            accuracy: 88,
            color: 'var(--success-text)',
            trend: 12,
            mastery: { paham: '80%', cukup: '15%', kurang: '5%' },
            underperformingStudents: []
          }
        ];
      default:
        
        let hash = 0;
        for (let i = 0; i < classId.length; i++) {
          hash = (hash * 31 + classId.charCodeAt(i)) & 0xFFFFFFFF;
        }
        const acc1 = 30 + Math.abs(hash % 30); 
        const acc2 = 45 + Math.abs((hash >> 2) % 25); 
        const acc3 = 60 + Math.abs((hash >> 4) % 25); 
        const acc4 = 75 + Math.abs((hash >> 6) % 25); 

        const studentsInClass = classroomsState[classId]?.students?.map(s => s.name) || [];
        const underperforming1 = studentsInClass.slice(0, Math.ceil(studentsInClass.length * 0.4));
        const underperforming2 = studentsInClass.slice(1, Math.ceil(studentsInClass.length * 0.3));
        const underperforming3 = studentsInClass.slice(2, Math.ceil(studentsInClass.length * 0.15));

        return [
          {
            topic: 'Zaman Purba & Fosil',
            accuracy: acc1,
            color: acc1 < 60 ? 'var(--danger-text)' : 'var(--warning-text)',
            trend: -6,
            mastery: { paham: `${Math.round(acc1 * 0.6)}%`, cukup: '25%', kurang: `${100 - Math.round(acc1 * 0.6) - 25}%` },
            underperformingStudents: underperforming1.slice(0, 3)
          },
          {
            topic: 'Raja-Raja Nusantara',
            accuracy: acc2,
            color: acc2 < 60 ? 'var(--danger-text)' : (acc2 < 70 ? 'var(--warning-text)' : 'var(--primary-text)'),
            trend: -2,
            mastery: { paham: `${Math.round(acc2 * 0.7)}%`, cukup: '20%', kurang: `${100 - Math.round(acc2 * 0.7) - 20}%` },
            underperformingStudents: underperforming2.slice(0, 2)
          },
          {
            topic: 'Kerajaan Hindu-Buddha',
            accuracy: acc3,
            color: acc3 < 60 ? 'var(--danger-text)' : (acc3 < 75 ? 'var(--warning-text)' : 'var(--primary-text)'),
            trend: 4,
            mastery: { paham: `${Math.round(acc3 * 0.8)}%`, cukup: '15%', kurang: `${100 - Math.round(acc3 * 0.8) - 15}%` },
            underperformingStudents: underperforming3.slice(0, 1)
          },
          {
            topic: 'Kemerdekaan Indonesia',
            accuracy: acc4,
            color: acc4 < 60 ? 'var(--danger-text)' : (acc4 < 80 ? 'var(--primary-text)' : 'var(--success-text)'),
            trend: 9,
            mastery: { paham: `${Math.round(acc4 * 0.9)}%`, cukup: '8%', kurang: `${100 - Math.round(acc4 * 0.9) - 8}%` },
            underperformingStudents: []
          }
        ];
    }
  };

  const handleOpenStudentDetail = (student) => {
    setSelectedStudent(student);
  };

  const getStudentRecord = (studentId, studentScore = 1000) => {
    return studentRecords[studentId] || {
      attendance: {
        'Minggu 1': 'Hadir',
        'Minggu 2': 'Hadir',
        'Minggu 3': 'Hadir',
        'Minggu 4': 'Hadir',
        'Minggu 5': 'Hadir'
      },
      notes: '',
      academic: [
        { subject: 'PR IPAS 1', score: Math.min(100, Math.round(studentScore / 20) + 10), classAvg: 72, dateShared: '2026-06-01', dateCompleted: '2026-06-03' },
        { subject: 'TUGAS MATEMATIKA 1', score: Math.min(100, Math.round(studentScore / 18) + 12), classAvg: 88, dateShared: '2026-06-02', dateCompleted: '2026-06-04' }
      ]
    };
  };

  const updateStudentRecord = (studentId, field, value) => {
    const current = getStudentRecord(studentId);
    setStudentRecords(prev => ({
      ...prev,
      [studentId]: {
        ...current,
        [field]: value
      }
    }));
  };

  
  const classroomKeys = Object.keys(classroomsState);
  const activeClassroom = selectedClassroom ? classroomsState[selectedClassroom] : null;
  const students = activeClassroom?.students || [];

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return ' ⇅';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const sortedStudents = React.useMemo(() => {
    
    const mapped = students.map((student, idx) => {
      
      let hash = 0;
      for (let i = 0; i < student.id.length; i++) {
        hash = (hash * 31 + student.id.charCodeAt(i)) & 0xFFFFFFFF;
      }
      const mockID = (Math.abs(hash % 9000000) + 1000000).toString();

      
      const mockNIS = student.nis || `009248${(idx + 10).toString().padStart(3, '0')}`;

      const isOnline = student.streak > 2;
      const hasFinishedTask = student.score > 1000;

      return {
        ...student,
        mockNIS,
        mockID,
        isOnline,
        hasFinishedTask,
      };
    });

    
    if (sortConfig.key) {
      mapped.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'name') {
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
        } else if (sortConfig.key === 'nis') {
          aVal = a.mockNIS;
          bVal = b.mockNIS;
        } else if (sortConfig.key === 'id_akun') {
          aVal = a.mockID;
          bVal = b.mockID;
        } else if (sortConfig.key === 'keaktifan') {
          aVal = a.isOnline ? 1 : 0;
          bVal = b.isOnline ? 1 : 0;
        } else if (sortConfig.key === 'tugas') {
          aVal = a.hasFinishedTask ? 1 : 0;
          bVal = b.hasFinishedTask ? 1 : 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return mapped;
  }, [students, sortConfig]);

  
  const totalStudents = Object.values(classroomsState).reduce((acc, curr) => acc + (curr.students?.length || 0), 0);
  const totalScore = Object.values(classroomsState).reduce((acc, curr) => {
    return acc + (curr.students?.reduce((sAcc, sCurr) => sAcc + (sCurr.score || 0), 0) || 0);
  }, 0);
  const averageScore = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;

  return (
    <div className="teacher-container">
      
      <aside className="teacher-sidebar desktop-only">
        <div className="sidebar-brand">
          <div 
            className="nav-logo-icon" 
            style={{
              WebkitMaskImage: `url(${LinimasaLogo})`,
              maskImage: `url(${LinimasaLogo})`
            }}
          />
          <span className="teacher-subtitle">PENGELOLA KELAS</span>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveMenu('dashboard')}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </button>
          <button
            className={`menu-item ${activeMenu === 'students' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('students');
              setSelectedClassroom(null); 
            }}
          >
            <Users size={20} />
            <span>Daftar Kelas</span>
          </button>
          <button
            className={`menu-item ${activeMenu === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveMenu('quizzes')}
          >
            <BookOpen size={20} />
            <span>Bank Soal</span>
          </button>
          <button
            className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveMenu('settings')}
          >
            <Settings size={20} />
            <span>Pengaturan</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={20} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      
      <main className="teacher-main">
        
        <header className="teacher-mobile-header mobile-only">
          <div className="mobile-brand">
            <Sparkles size={18} color="#10B981" fill="#10B981" />
            <span>Lini Masa Guru</span>
          </div>
          <div className="mobile-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="action-badge" style={{ padding: '4px' }}>
              <Bell size={20} />
              <span className="badge-dot" style={{ top: '4px', right: '4px' }}></span>
            </div>
            <div className="avatar-circle" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>DEV</div>
          </div>
        </header>

        
        <header className="teacher-header desktop-only">
          <div className="header-welcome" />
        </header>

        
        <div className="content-viewport">
          <AnimatePresence mode="wait">
            {activeMenu === 'dashboard' && (
              <DashboardOverview
                totalStudents={totalStudents}
                averageScore={averageScore}
                setActiveMenu={setActiveMenu}
                setShowAnnouncementModal={setShowAnnouncementModal}
                announcements={globalAnnouncements}
                setAnnouncements={setGlobalAnnouncements}
                selectedClassroom={selectedClassroom}
                setSelectedClassroom={setSelectedClassroom}
                classroomKeys={classroomKeys}
                selectedDiagnosticClassId={selectedDiagnosticClassId}
                setSelectedDiagnosticClassId={setSelectedDiagnosticClassId}
                selectedDiagnosticTopicIndex={selectedDiagnosticTopicIndex}
                setSelectedDiagnosticTopicIndex={setSelectedDiagnosticTopicIndex}
                getDiagnosticData={getDiagnosticData}
                classroomsState={classroomsState}
              />
            )}

            {activeMenu === 'students' && (
              <StudentManagement
                selectedClassroom={selectedClassroom}
                setSelectedClassroom={setSelectedClassroom}
                classroomKeys={classroomKeys}
                classroomsState={classroomsState}
                setClassroomsState={setClassroomsState}
                setShowAddModal={setShowAddModal}
                setNewClassName={setNewClassName}
                setShowEditModal={setShowEditModal}
                setEditClassName={setEditClassName}
                activeClassroom={activeClassroom}
                sortedStudents={sortedStudents}
                handleSort={handleSort}
                renderSortIndicator={renderSortIndicator}
                handleOpenStudentDetail={handleOpenStudentDetail}
                setShowAddStudentModal={setShowAddStudentModal}
              />
            )}

            {activeMenu === 'quizzes' && (
              <QuizBankMain 
                selectedCollectionId={selectedCollectionId}
                setSelectedCollectionId={setSelectedCollectionId}
                quizCollections={quizCollections}
                setQuizCollections={setQuizCollections}
                setNewCollectionTitle={setNewCollectionTitle}
                setNewCollectionDescription={setNewCollectionDescription}
                setNewCollectionDurationLimit={setNewCollectionDurationLimit}
                setNewCollectionTargetClassId={setNewCollectionTargetClassId}
                setNewCollectionXpReward={setNewCollectionXpReward}
                setShowAddCollectionModal={setShowAddCollectionModal}
                showAddQuestionForm={showAddQuestionForm}
                setShowAddQuestionForm={setShowAddQuestionForm}
                newQuestionText={newQuestionText}
                setNewQuestionText={setNewQuestionText}
                newQuestionOptionA={newQuestionOptionA}
                setNewQuestionOptionA={setNewQuestionOptionA}
                newQuestionOptionB={newQuestionOptionB}
                setNewQuestionOptionB={setNewQuestionOptionB}
                newQuestionOptionC={newQuestionOptionC}
                setNewQuestionOptionC={setNewQuestionOptionC}
                newQuestionCorrectIndex={newQuestionCorrectIndex}
                setNewQuestionCorrectIndex={setNewQuestionCorrectIndex}
                newQuestionType={newQuestionType}
                setNewQuestionType={setNewQuestionType}
                editingQuestionId={editingQuestionId}
                setEditingQuestionId={setEditingQuestionId}
                showDevMode={showDevMode}
                setTestingQuestion={setTestingQuestion}
                setTestingCollection={setTestingCollection}
                setTestingQuestionIndex={() => { }}
                setTestingScore={() => { }}
                onOpenActivateQuiz={(col) => setActiveQuizModalCol(col)}
                onDeactivateQuiz={(id) => handleDeactivateQuiz(id)}
                onOpenProjector={(col) => setProjectorModalCol(col)}
              />
            )}

            {activeMenu === 'settings' && (
              <TeacherSettings
                theme={theme}
                setTheme={setTheme}
                showDevMode={showDevMode}
                setShowDevMode={(val) => {
                  setShowDevMode(val);
                  setIsDevMode(val);
                }}
                onLogout={onLogout}
              />
            )}
          </AnimatePresence>
        </div>

        
        <AnimatePresence>
          {showAnnouncementModal && (
            <AnnouncementModal
              showAnnouncementModal={showAnnouncementModal}
              setShowAnnouncementModal={setShowAnnouncementModal}
              announcementInput={announcementInput}
              setAnnouncementInput={setAnnouncementInput}
              selectedTargetClassId={selectedTargetClassId}
              setSelectedTargetClassId={setSelectedTargetClassId}
              classroomKeys={classroomKeys}
              classroomsState={classroomsState}
              setAnnouncements={setAnnouncements}
            />
          )}
        </AnimatePresence>

        
        <ClassroomModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newClassName={newClassName}
          setNewClassName={setNewClassName}
          classroomsState={classroomsState}
          setClassroomsState={setClassroomsState}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editClassName={editClassName}
          setEditClassName={setEditClassName}
        />

        
        <QuizCollectionModal
          showAddCollectionModal={showAddCollectionModal}
          setShowAddCollectionModal={setShowAddCollectionModal}
          newCollectionTitle={newCollectionTitle}
          setNewCollectionTitle={setNewCollectionTitle}
          newCollectionTargetClassId={newCollectionTargetClassId}
          setNewCollectionTargetClassId={setNewCollectionTargetClassId}
          newCollectionDurationLimit={newCollectionDurationLimit}
          setNewCollectionDurationLimit={setNewCollectionDurationLimit}
          newCollectionDescription={newCollectionDescription}
          setNewCollectionDescription={setNewCollectionDescription}
          newCollectionXpReward={newCollectionXpReward}
          setNewCollectionXpReward={setNewCollectionXpReward}
          classroomKeys={classroomKeys}
          classroomsState={classroomsState}
          setQuizCollections={setQuizCollections}
        />

        
        <AddStudentModal
          isOpen={showAddStudentModal}
          onClose={() => setShowAddStudentModal(false)}
          activeClassroom={activeClassroom}
          onAddStudent={handleAddStudent}
        />

        
        <AnimatePresence>
          {selectedStudent && (
            <StudentDetailModal
              selectedStudent={selectedStudent}
              onClose={() => setSelectedStudent(null)}
              activeClassroom={activeClassroom}
              getStudentRecord={getStudentRecord}
              updateStudentRecord={updateStudentRecord}
              averageScore={averageScore}
              onSave={(studentId, updatedName, updatedNIS) => {
                const updatedClassrooms = { ...classroomsState };
                if (selectedClassroom && updatedClassrooms[selectedClassroom]) {
                  updatedClassrooms[selectedClassroom].students = updatedClassrooms[selectedClassroom].students.map(s => {
                    if (s.id === studentId) {
                      return {
                        ...s,
                        name: updatedName.trim(),
                        nis: updatedNIS.trim()
                      };
                    }
                    return s;
                  });
                  setClassroomsState(updatedClassrooms);
                }
                setSelectedStudent(null);
              }}
            />
          )}
        </AnimatePresence>

        
        <AnimatePresence>
          {activeQuizModalCol && (
            <ActivateQuizModal
              isOpen={!!activeQuizModalCol}
              onClose={() => setActiveQuizModalCol(null)}
              onConfirm={(duration) => handleActivateQuiz(activeQuizModalCol.id, duration)}
              quizTitle={activeQuizModalCol.title}
            />
          )}
        </AnimatePresence>

        
        <AnimatePresence>
          {testingQuestion && (
            <DevTestingOverlay
              testingQuestion={testingQuestion}
              testingCollection={testingCollection}
              setTestingQuestion={setTestingQuestion}
              setTestingCollection={setTestingCollection}
            />
          )}
        </AnimatePresence>

        
        <AnimatePresence>
          {projectorModalCol && (
            <ProjectorThemeModal
              collection={projectorModalCol}
              onClose={() => setProjectorModalCol(null)}
              onStart={(theme) => {
                setProjectorTheme(theme);
                setProjectorCollection(projectorModalCol);
                setProjectorModalCol(null);
              }}
            />
          )}
        </AnimatePresence>

        
        <AnimatePresence>
          {projectorCollection && (
            <ProjectorOverlay
              collection={projectorCollection}
              initialThemeKey={projectorTheme}
              onClose={() => setProjectorCollection(null)}
            />
          )}
        </AnimatePresence>

        
        <nav className="teacher-mobile-tabbar mobile-only">
          <div className="mobile-tab-items">
            <div
              className={`mobile-tab-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              <div className="icon-wrapper">
                <div className="active-circle dashboard-bg" />
                <div className="icon-main"><BarChart3 size={20} /></div>
              </div>
              <span className="tab-label">Utama</span>
            </div>
            <div
              className={`mobile-tab-item ${activeMenu === 'students' ? 'active' : ''}`}
              onClick={() => {
                setActiveMenu('students');
                setSelectedClassroom(null); 
              }}
            >
              <div className="icon-wrapper">
                <div className="active-circle student-bg" />
                <div className="icon-main"><Users size={20} /></div>
              </div>
              <span className="tab-label">Kelas</span>
            </div>
            <div
              className={`mobile-tab-item ${activeMenu === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveMenu('quizzes')}
            >
              <div className="icon-wrapper">
                <div className="active-circle quiz-bg" />
                <div className="icon-main"><BookOpen size={20} /></div>
              </div>
              <span className="tab-label">Kuis</span>
            </div>
            <div
              className={`mobile-tab-item ${activeMenu === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveMenu('settings')}
            >
              <div className="icon-wrapper">
                <div className="active-circle settings-bg" />
                <div className="icon-main"><Settings size={20} /></div>
              </div>
              <span className="tab-label">Setelan</span>
            </div>
          </div>
        </nav>
      </main>

      
      <aside className="teacher-sidebar-right desktop-only">
        <div className="right-sidebar-header">
          <div className="action-badge">
            <Bell size={20} />
            <span className="badge-dot"></span>
          </div>
          <div className="teacher-profile-pill">
            <div className="avatar-circle">DEV</div>
            <span>Developer Account</span>
          </div>
        </div>
        
        <div className="right-sidebar-content">
          <h3 className="widget-title">Aktivitas Terkini</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot success"></div>
              <div className="activity-text">
                <strong>Budi</strong> menyelesaikan kuis IPAS
                <span className="activity-time">Baru saja</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot warning"></div>
              <div className="activity-text">
                <strong>Siti</strong> memulai PR Matematika
                <span className="activity-time">5 mnt lalu</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot primary"></div>
              <div className="activity-text">
                Tugas <strong>B. Indonesia</strong> telah dijadwalkan
                <span className="activity-time">1 jam lalu</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .teacher-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: var(--background-color);
          color: var(--text-color);
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
          position: fixed;
          inset: 0;
          z-index: 99999;
        }

        /* Sidebar Styling */
        .teacher-sidebar {
          width: 260px;
          background: var(--sidebar-bg);
          color: var(--text-color);
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--sidebar-border);
          padding: 24px 0;
          flex-shrink: 0;
        }
        .teacher-sidebar-right {
          width: 280px;
          background: var(--sidebar-bg);
          color: var(--text-color);
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--sidebar-border);
          padding: 24px 20px;
          flex-shrink: 0;
        }
        .right-sidebar-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .widget-title {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 16px 0;
          font-weight: 900;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .activity-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .activity-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
          box-shadow: 0 0 5px rgba(255,255,255,0.3);
        }
        .activity-dot.success { background: #10B981; }
        .activity-dot.warning { background: #F59E0B; }
        .activity-dot.primary { background: #3B82F6; }
        .activity-text {
          font-size: 0.85rem;
          color: white;
          line-height: 1.4;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .activity-text strong {
          color: white;
          font-weight: 800;
        }
        .activity-time {
          display: block;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 4px;
        }
        .sidebar-brand {
          padding: 0 24px 30px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .nav-logo-icon {
          width: 150px;
          height: 35px;
          background-color: white;
          -webkit-mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: left center;
          mask-size: contain;
          mask-repeat: no-repeat;
          mask-position: left center;
        }
        .teacher-subtitle {
          font-size: 0.7rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 1px;
          margin-left: 2px;
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 12px;
          flex-grow: 1;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .menu-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.2);
        }
        .menu-item.active {
          color: white;
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 0 rgba(0,0,0,0.05);
        }

        .sidebar-footer {
          padding: 0 16px;
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255, 75, 75, 0.15);
          border: 1px solid rgba(255, 75, 75, 0.3);
          color: white;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .logout-btn:hover {
          background: rgba(255, 75, 75, 0.8);
          color: white;
        }

        /* Main Content */
        .teacher-main {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .teacher-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
          background: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
        }
        .header-welcome h1 {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 4px;
          color: var(--text-color);
        }
        .header-welcome .highlight {
          color: #10B981;
        }
        .header-welcome p {
          color: var(--text-muted);
          margin: 0;
          font-size: 0.95rem;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .action-badge {
          position: relative;
          color: var(--text-color);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .action-badge:hover {
          background: var(--border-color);
        }
        .badge-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: #EF4444;
          border-radius: 50%;
          border: 2px solid var(--card-bg);
        }
        .teacher-profile-pill {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .teacher-profile-pill h3 {
          margin: 0 0 2px 0;
          font-size: 1rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .teacher-profile-pill p {
          margin: 0;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          color: var(--text-color);
        }
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #10B981;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
        }

        /* Viewports */
        .content-viewport {
          flex-grow: 1;
          padding: 40px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
        }

        /* Stats Card */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: var(--card-bg);
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .primary .stat-icon { background: var(--primary-bg-light); color: var(--primary-text); }
        .success .stat-icon { background: var(--success-bg); color: var(--success-text); }
        .warning .stat-icon { background: var(--warning-bg); color: var(--warning-text); }
        .stat-info h3 { margin: 0 0 2px; font-size: 1.5rem; font-weight: 800; color: var(--text-color); }
        .stat-info p { margin: 0; color: var(--text-muted); font-size: 0.9rem; font-weight: 500; }

        /* Showcase Box */
        .showcase-box {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 10px 15px -3px rgba(16,185,129,0.3);
          margin-bottom: 30px;
        }
        .showcase-content h2 { margin: 0 0 15px; font-size: 1.8rem; font-weight: 800; }
        .showcase-content p { font-size: 1.05rem; line-height: 1.6; max-width: 700px; color: #D1FAE5; margin-bottom: 25px; }
        .showcase-badges { display: flex; gap: 10px; }
        .pill-badge { background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 30px; font-size: 0.8rem; font-weight: 700; }

        /* Card Box */
        .card-box {
          background: var(--card-bg);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          padding: 30px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .card-box-header { margin-bottom: 24px; }
        .card-box-header h2 { margin: 0 0 6px; font-weight: 800; font-size: 1.4rem; color: var(--text-color); }
        .card-box-header p { margin: 0; color: var(--text-muted); font-size: 0.95rem; }

        .flex-between { display: flex; justify-content: space-between; align-items: center; }

        /* Tables */
        .teacher-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .teacher-table th {
          padding: 14px 20px;
          border-bottom: 2px solid var(--border-color);
          color: var(--text-color);
          font-weight: 700;
          font-size: 0.9rem;
        }
        .teacher-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-color);
          font-weight: 500;
        }
        .student-name-cell { display: flex; align-items: center; gap: 12px; }
        .student-avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--border-color);
          color: #3B82F6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
        }
        .level-badge { background: var(--border-color); padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; color: var(--text-color); }
        .score-cell { font-weight: 800; color: #10B981; }
        .table-action-btn {
          background: var(--border-color);
          border: none;
          color: var(--text-color);
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .table-action-btn:hover { background: #3B82F6; color: white; }

         /* Quiz */
        .add-quiz-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #10B981;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(16,185,129,0.2);
        }
        .add-quiz-btn:hover { background: #059669; }

        /* Classroom Grid & Cards */
        .classroom-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 20px;
        }
        .classroom-card {
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          border-bottom: 6px solid var(--border-color);
          border-radius: 24px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.1s;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .classroom-card:hover {
          transform: translateY(-2px);
          border-bottom-width: 6px;
        }
        .classroom-card:active {
          transform: translateY(4px);
          border-bottom-width: 2px;
        }
        .classroom-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .room-icon-badge {
          font-size: 2rem;
        }
        .classroom-card-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--text-color);
        }
        .classroom-card-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: var(--background-color);
          padding: 12px;
          border-radius: 16px;
          border: 1px solid var(--border-color);
        }
        .class-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .stat-num {
          font-size: 1.15rem;
          font-weight: 900;
          color: #10B981;
        }
        .stat-txt {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .open-class-btn {
          flex: 2;
          padding: 10px;
          background: #10B981;
          color: white;
          border: none;
          font-weight: 800;
          font-size: 0.9rem;
          border-radius: 12px;
          box-shadow: 0 4px 0 #059669;
          cursor: pointer;
          transition: all 0.1s;
        }
        .open-class-btn:active {
          transform: translateY(3px);
          box-shadow: none;
        }
        .class-card-footer {
          display: flex;
          gap: 8px;
          width: 100%;
          margin-top: auto;
        }
        .edit-class-action-btn {
          flex: 1;
          padding: 10px;
          background: #3B82F6;
          color: white;
          border: none;
          font-weight: 800;
          font-size: 0.9rem;
          border-radius: 12px;
          box-shadow: 0 4px 0 #1D4ED8;
          cursor: pointer;
          transition: all 0.1s;
        }
        .edit-class-action-btn:active {
          transform: translateY(3px);
          box-shadow: none;
        }
        .delete-class-action-btn {
          flex: 1;
          padding: 10px;
          background: #EF4444;
          color: white;
          border: none;
          font-weight: 800;
          font-size: 0.9rem;
          border-radius: 12px;
          box-shadow: 0 4px 0 #DC2626;
          cursor: pointer;
          transition: all 0.1s;
        }
        .delete-class-action-btn:active {
          transform: translateY(3px);
          box-shadow: none;
        }
        .add-class-btn-header {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #10B981;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 0 #059669;
          transition: all 0.1s;
        }
        .add-class-btn-header:active {
          transform: translateY(3px);
          box-shadow: none;
        }
        .add-class-btn-header span {
          font-weight: 800;
        }

        /* Navigation Buttons */
        .back-to-classes-btn {
          background: var(--border-color);
          border: none;
          color: var(--text-color);
          font-weight: 800;
          font-size: 0.9rem;
          padding: 10px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .back-to-classes-btn:hover {
          background: #3B82F6;
          color: white;
        }

        .empty-placeholder {
          text-align: center;
          padding: 60px 20px;
        }
        .empty-placeholder :global(.empty-icon) {
          color: #D1D5DB;
          margin-bottom: 16px;
        }
        .empty-placeholder h3 { font-size: 1.2rem; font-weight: 800; margin: 0 0 6px; color: var(--text-color); }
        .empty-placeholder p { color: var(--text-muted); max-width: 400px; margin: 0 auto; font-size: 0.95rem; line-height: 1.5; }

        /* Settings */
        .settings-list { display: flex; flex-direction: column; gap: 20px; margin-top: 24px; }
        .settings-section-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 1px;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        .theme-toggle-container {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }
        .theme-card {
          flex: 1;
          background: var(--background-color);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 800;
          color: var(--text-color);
        }
        .theme-card.active {
          border-color: #10B981;
          background: #ECFDF5;
          color: #10B981;
          transform: translateY(-2px);
          box-shadow: 0 4px 0 #10B981;
        }
        .settings-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .setting-desc h4 { margin: 0 0 4px; font-weight: 700; font-size: 1rem; color: var(--text-color); }
        .setting-desc p { margin: 0; color: var(--text-muted); font-size: 0.9rem; }
        .settings-input {
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--background-color);
          color: var(--text-color);
          font-weight: 600;
          width: 160px;
          text-align: center;
        }
        .settings-input:focus { outline: none; border-color: #10B981; }

        .dev-entry {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(255, 150, 0, 0.05);
          cursor: pointer;
          border: 1px solid rgba(244, 194, 101, 0.2);
          border-radius: 12px;
        }
        .dev-entry-left {
          display: flex;
          align-items: center;
          gap: 15px;
          font-weight: 700;
          color: #f4c265;
        }
        .toggle-switch {
          width: 44px;
          height: 24px;
          background: #DDD;
          border-radius: 20px;
          position: relative;
          transition: background 0.3s;
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .toggle-switch.on { background: #f4c265; }
        .toggle-switch.on::after { transform: translateX(20px); }

        /* Dashboard Redesign Columns */
        .dashboard-columns-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 24px;
        }
        @media (min-width: 1024px) {
          .dashboard-columns-grid {
            display: grid;
            grid-template-columns: 7fr 3fr;
            align-items: start;
          }
        }
        .dashboard-column-left-main,
        .dashboard-column-right-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Navy Cards */
        .dashboard-card-navy {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 24px;
          color: var(--text-color);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          text-align: left;
        }
        .card-navy-header h3 {
          margin: 0 0 16px;
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-color);
        }
        .card-navy-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Progress items */
        .task-progress-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .task-progress-info {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .progress-bar-container {
          height: 10px;
          background: var(--border-color);
          border-radius: 6px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 6px;
        }
        .green-fill {
          background: #10B981;
        }

        /* Diagnostic and alerts */
        .diagnostic-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--background-color);
          padding: 16px;
          border-radius: 12px;
          border-left: 4px solid var(--warning-text);
        }
        .diagnostic-badge {
          align-self: flex-start;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
          text-transform: uppercase;
        }
        .warning-accent-bg {
          background: var(--warning-bg);
          color: var(--warning-text);
        }
        .warning-accent {
          color: var(--warning-text);
          font-weight: 800;
        }
        .success-accent {
          color: var(--success-text);
        }
        .danger-accent {
          color: var(--danger-text);
          font-weight: 600;
        }

        /* Todo list */
        .todo-list-navy {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .todo-item-navy {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .todo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .danger-dot {
          background: var(--danger-text);
        }

        /* Student alert */
        .student-alert-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--danger-bg);
          border: 1px solid var(--danger-text);
          padding: 14px;
          border-radius: 12px;
          text-align: left;
        }
        .student-alert-item p {
          margin: 4px 0 0;
          font-size: 0.85rem;
        }
        .alert-symbol {
          font-size: 1.25rem;
        }

        /* Quick actions */
        .quick-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 16px;
          border-radius: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quick-action-btn:hover {
          background: var(--border-color);
          border-color: #3B82F6;
          transform: translateY(-2px);
        }

        /* Modal Overlay & General Popups */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100000;
          padding: 20px;
        }

        /* Student Detail Modal */
        .student-detail-modal {
          background: var(--card-bg);
          width: 100%;
          border-radius: 28px;
          padding: 30px;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 2px solid var(--border-color);
          color: var(--text-color);
          text-align: center;
        }
        .modal-body-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }
        @media (min-width: 1024px) {
          .modal-body-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
        }
        .student-modal-avatar {
          font-size: 3.5rem;
          margin-bottom: 12px;
        }
        .student-detail-modal h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 6px;
        }
        .student-status-badge {
          display: inline-block;
          background: #ECFDF5;
          color: #10B981;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 4px 14px;
          border-radius: 30px;
          margin: 0 0 24px;
        }
        .detail-stat-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .detail-stat-item {
          background: var(--background-color);
          border: 1px solid var(--border-color);
          padding: 12px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .stat-val {
          font-size: 1.15rem;
          font-weight: 900;
        }
        .primary-text { color: #3B82F6; }
        .warning-text { color: #D97706; }
        .danger-text { color: #EF4444; }

        .divider-line {
          height: 1px;
          background: var(--border-color);
          width: 100%;
          margin-bottom: 24px;
        }

        .academic-evaluation-section {
          text-align: left;
          margin-bottom: 24px;
        }
        .academic-evaluation-section h3 {
          font-size: 1rem;
          font-weight: 800;
          margin: 0 0 12px;
        }
        .eval-card {
          background: var(--background-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .eval-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .badge-pass {
          background: #ECFDF5;
          color: #10B981;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 2px 10px;
          border-radius: 6px;
        }
        .badge-pass.font-green {
          color: #10B981;
        }

        .close-detail-btn {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          background: #10B981;
          color: white;
          border: none;
          font-weight: 900;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 0 #059669;
          transition: all 0.1s;
        }
        .close-detail-btn:active {
          transform: translateY(4px);
          box-shadow: none;
        }

        /* --- MOBILE RESPONSIVE ADAPTATION (ANDROID) --- */
        .mobile-only {
          display: none !important;
        }

        @media (max-width: 1023px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: block !important;
          }
          
          .teacher-container {
            flex-direction: column;
          }
          
          .teacher-main {
            height: 100vh;
            padding-bottom: 0;
          }

          /* Mobile Header */
          .teacher-mobile-header {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: var(--card-bg);
            border-bottom: 2px solid var(--border-color);
            height: 55px;
          }
          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 900;
            font-size: 1.1rem;
            color: #10B981;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .mobile-logout-btn {
            background: #EF444415;
            border: 1px solid #EF444433;
            color: #EF4444;
            padding: 8px 12px;
            border-radius: 10px;
            cursor: pointer;
          }

          /* Content Viewport Mobile */
          .content-viewport {
            padding: 16px 12px 85px 12px; /* Bottom padding 85px so content clears the fixed 65px tabbar */
          }

          /* Modal & Cards Optimizations for Mobile */
          .student-detail-modal {
            padding: 20px !important;
            border-radius: 20px !important;
            max-width: 95vw;
            overflow-y: auto;
            max-height: 90vh;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
          }
          .modal-overlay {
            padding: 10px !important;
          }
          .card-box {
            padding: 20px !important;
          }
          .dashboard-card-navy {
            padding: 20px !important;
          }
          .mobile-recent-activity {
            display: block !important;
            margin-top: 24px;
          }

          /* Stats Grid Mobile */
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .header-welcome h1 { font-size: 1.3rem !important; }
          .stat-icon { width: 44px !important; height: 44px !important; }
          .stat-info h3 { font-size: 1.25rem !important; }

          /* Table Mobile - Add Horizontal Scroll */
          .table-responsive {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Pop Tabbar Mobile styling for teacher */
          .teacher-mobile-tabbar {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 65px;
            background: var(--card-bg);
            border-top: 3px solid var(--border-color);
            box-shadow: 0 -10px 40px rgba(0,0,0,0.05);
            z-index: 9999;
            justify-content: center;
          }
          .mobile-tab-items {
            width: 100%;
            max-width: 600px;
            display: flex;
            justify-content: space-around;
            align-items: center;
          }
          .mobile-tab-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
            height: 100%;
            cursor: pointer;
            user-select: none;
          }
          .icon-wrapper {
            position: relative;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            transition: transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
          }
          .icon-main {
            z-index: 3;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
          }
          .active-circle {
            position: absolute;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            transform: scale(0);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.5);
            border: 3px solid var(--card-bg);
          }
          .dashboard-bg { background: linear-gradient(135deg, #3B82F6, #1D4ED8); }
          .student-bg { background: linear-gradient(135deg, #10B981, #047857); }
          .quiz-bg { background: linear-gradient(135deg, #f4c265, #fbda8a); }
          .settings-bg { background: linear-gradient(135deg, #9CA3AF, #4B5563); }

          .mobile-tab-item.active .icon-wrapper {
            transform: translateY(-20px);
          }
          .mobile-tab-item.active .active-circle {
            transform: scale(1);
          }
          .mobile-tab-item.active .icon-main {
            transform: scale(1.3);
            color: white !important;
          }
          .tab-label {
            position: absolute;
            bottom: 8px;
            font-size: 0.65rem;
            font-weight: 900;
            color: var(--text-color);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0;
            opacity: 0;
            transform: translateY(8px);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .mobile-tab-item.active .tab-label {
            opacity: 1;
            transform: translateY(0);
          }

          /* Mobile Student Cards Layout */
          .student-cards-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 15px;
          }
          .mobile-student-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            background: var(--card-bg);
            border: 2px solid var(--border-color);
            border-bottom: 5px solid var(--border-color);
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.1s;
          }
          .mobile-student-card:active {
            transform: translateY(3px);
            border-bottom-width: 2px;
          }
          .card-left {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .mobile-student-avatar {
            font-size: 2.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .mobile-student-info h4 {
            margin: 0 0 6px;
            font-size: 1rem;
            font-weight: 800;
            color: var(--text-color);
          }
          .mobile-badges-row {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }
          .mobile-pill-badge {
            font-size: 0.65rem;
            font-weight: 900;
            padding: 3px 8px;
            border-radius: 8px;
            text-transform: uppercase;
          }
          .green-badge { background: #ECFDF5; color: #10B981; }
          .yellow-badge { background: #FFF4E5; color: #f4c265; }
          .orange-badge { background: #E8F5E9; color: #10B981; }
          .red-badge { background: #FFEBEE; color: #EF4444; }
        }
      `}</style>
    </div>
  );
}
