import React from 'react';
import { motion } from 'framer-motion';
import QuizList from './QuizList';
import QuizDetail from './QuizDetail';

export default function QuizBankMain({
  selectedCollectionId,
  setSelectedCollectionId,
  quizCollections,
  setQuizCollections,
  setNewCollectionTitle,
  setNewCollectionDescription,
  setNewCollectionDurationLimit,
  setNewCollectionTargetClassId,
  setNewCollectionXpReward,
  setShowAddCollectionModal,
  showAddQuestionForm,
  setShowAddQuestionForm,
  newQuestionText,
  setNewQuestionText,
  newQuestionOptionA,
  setNewQuestionOptionA,
  newQuestionOptionB,
  setNewQuestionOptionB,
  newQuestionOptionC,
  setNewQuestionOptionC,
  newQuestionCorrectIndex,
  setNewQuestionCorrectIndex,
  newQuestionType,
  setNewQuestionType,
  editingQuestionId,
  setEditingQuestionId,
  showDevMode,
  setTestingQuestion,
  setTestingCollection,
  setTestingQuestionIndex,
  setTestingScore,
  onOpenActivateQuiz,
  onDeactivateQuiz,
  onOpenProjector
}) {
  return (
    <motion.div 
      key="quizzes"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="quizzes-view"
    >
      {!selectedCollectionId ? (
        <QuizList
          quizCollections={quizCollections}
          setSelectedCollectionId={setSelectedCollectionId}
          setQuizCollections={setQuizCollections}
          setNewCollectionTitle={setNewCollectionTitle}
          setNewCollectionDescription={setNewCollectionDescription}
          setNewCollectionDurationLimit={setNewCollectionDurationLimit}
          setNewCollectionTargetClassId={setNewCollectionTargetClassId}
          setNewCollectionXpReward={setNewCollectionXpReward}
          setShowAddCollectionModal={setShowAddCollectionModal}
          onOpenActivateQuiz={onOpenActivateQuiz}
          onDeactivateQuiz={onDeactivateQuiz}
          onOpenProjector={onOpenProjector}
        />
      ) : (
        <QuizDetail
          activeCol={quizCollections.find(c => c.id === selectedCollectionId)}
          selectedCollectionId={selectedCollectionId}
          setSelectedCollectionId={setSelectedCollectionId}
          quizCollections={quizCollections}
          setQuizCollections={setQuizCollections}
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
          setTestingCollection={setTestingCollection}
          setTestingQuestion={setTestingQuestion}
        />
      )}
    </motion.div>
  );
}
