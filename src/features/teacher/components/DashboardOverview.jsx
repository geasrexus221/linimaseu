import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DesktopOverview from './dashboard/DesktopOverview';
import MobileOverview from './dashboard/MobileOverview';

export default function DashboardOverview({
  totalStudents,
  averageScore,
  setActiveMenu,
  setShowAnnouncementModal,
  announcements,
  setAnnouncements,
  selectedClassroom,
  setSelectedClassroom,
  classroomKeys,
  selectedDiagnosticClassId,
  setSelectedDiagnosticClassId,
  selectedDiagnosticTopicIndex,
  setSelectedDiagnosticTopicIndex,
  getDiagnosticData,
  classroomsState
}) {
  const [activeTaskFilter, setActiveTaskFilter] = useState('ALL');

  const sharedProps = {
    setActiveMenu,
    setShowAnnouncementModal,
    announcements,
    setAnnouncements,
    selectedClassroom,
    setSelectedClassroom,
    classroomKeys,
    classroomsState,
    activeTaskFilter,
    setActiveTaskFilter
  };

  const desktopProps = {
    ...sharedProps,
    selectedDiagnosticClassId,
    setSelectedDiagnosticClassId,
    selectedDiagnosticTopicIndex,
    setSelectedDiagnosticTopicIndex,
    getDiagnosticData
  };

  return (
    <motion.div 
      key="dashboard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="dashboard-view"
    >
      <DesktopOverview {...desktopProps} />
      <MobileOverview {...sharedProps} />
    </motion.div>
  );
}
