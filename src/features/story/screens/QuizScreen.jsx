import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function QuizScreen({ quizData, onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleOptionClick = (option) => {
    if (selectedOption) return; // Prevent multiple clicks

    setSelectedOption(option);
    if (option.isCorrect) {
      setIsCorrect(true);
      setTimeout(() => onComplete(true), 1500);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  return (
    <div className="quiz-container">
      <motion.div 
        className="question-card"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="question-text">{quizData.question}</h2>
      </motion.div>

      <div className="options-container">
        {quizData.options.map((option, index) => {
          let statusClass = '';
          if (selectedOption === option) {
            statusClass = option.isCorrect ? 'correct' : 'wrong';
          }

          return (
            <motion.button
              key={index}
              className={`option-btn ${statusClass}`}
              onClick={() => handleOptionClick(option)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
