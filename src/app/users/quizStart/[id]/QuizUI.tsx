// src/app/users/quizStart/[id]/QuizUI.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const QuizInstructions = ({ topic, onStartQuiz, onClose }: {
  topic: string;
  onStartQuiz: () => void;
  onClose: () => void;
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full mx-auto p-6 bg-white shadow-lg rounded-2xl border border-blue-100">
        {/* Close Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close instructions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quiz Rules Image */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-blue-100 rounded-lg blur opacity-30"></div>
            <div className="w-60 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 relative">
              Quiz Rules Image
            </div>
          </div>
        </div>
        
        {/* Topic Title */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          {topic} <span className="text-blue-600">Quiz</span>
        </h2>

        {/* Instructions */}
        <p className="text-gray-700 text-center text-base mb-4">
          Welcome to the <strong className="text-blue-600">{topic}</strong> quiz! Here's how it works:
        </p>
        
        <div className="bg-blue-50 rounded-xl p-4 mb-5">
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>You will have multiple-choice questions.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Choose the correct answer before the time runs out.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span>You can't go back to previous questions.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Good luck!</span>
            </li>
          </ul>
        </div>

        {/* Start Quiz Button */}
        <div className="mt-6 flex justify-center">
          <button
            className={`relative px-6 py-2 text-base font-medium text-white bg-[#2d87ff] rounded-xl transition-all duration-150 ease-out ${
              isActive ? 'translate-y-1 shadow-none' : 'shadow-[0_4px_0_0_#2563eb]'
            }`}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => {
              setIsActive(false);
              onStartQuiz();
            }}
            onMouseLeave={() => setIsActive(false)}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const QuizComplete = ({ 
  score, 
  totalQuestions, 
  quizTitle, 
  onRetakeQuiz, 
  onClose 
}: {
  score: number;
  totalQuestions: number;
  quizTitle: string;
  onRetakeQuiz: () => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="max-w-md w-full mx-auto p-6 bg-white shadow-lg rounded-2xl border border-blue-100">
      <div className="flex justify-end mb-2">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close results"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {score >= totalQuestions * 0.8 ? '🎉' : score >= totalQuestions * 0.6 ? '👍' : '📚'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600">{quizTitle}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-gray-700">
            {Math.round((score / totalQuestions) * 100)}% Score
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRetakeQuiz}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface QuizUIProps {
  quizId: string;
}

interface QuestionData {
  id: string;
  question: string;
  lesson: string;
  image?: string;
  options: string[];
}

interface AnswerFeedback {
  questionId: string;
  selectedAnswer: number;
  correctAnswer: number;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation?: string;
  question: string;
  options: string[];
}

export default function QuizUI({ quizId }: QuizUIProps) {
  const router = useRouter();
  const [showInstructions, setShowInstructions] = useState(false); // Changed to false initially
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Fetch quiz data from API
  const fetchQuizData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/quizzes/${quizId}`);
      if (!response.ok) throw new Error('Failed to fetch quiz');
      const data = await response.json();
      setQuizData(data);
      setTimeLeft(data.timer);
      setShowInstructions(true); // Show instructions after data is loaded
    } catch (error) {
      console.error('Error fetching quiz:', error);
      // Fallback to sample data for demo
      setQuizData({
        id: "sample-quiz",
        title: "Cyber Security Quiz",
        timer: 30,
        questions: [
          {
            id: "q1",
            question: "What should you use to create complex passwords?",
            lesson: "Cyber Security",
            image: "/LearnImage/CyberSecurity/21.png",
            options: [
              "Only lowercase letters",
              "A mix of letters, numbers, and symbols",
              "Your name and birthdate",
              "The same password for all accounts"
            ]
          },
          {
            id: "q2",
            question: "What is phishing?",
            lesson: "Cyber Security",
            image: null,
            options: [
              "A type of fishing",
              "A method to catch fish online",
              "A fraudulent attempt to obtain sensitive information",
              "A computer game"
            ]
          }
        ]
      });
      setShowInstructions(true); // Show instructions after fallback data is set
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch quiz data on component mount
  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  // Submit answer to API and get feedback
  const submitAnswer = async (questionId: string, selectedAnswerIndex: number) => {
    try {
      const response = await fetch(`/api/users/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          selectedAnswer: selectedAnswerIndex,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit answer');
      
      const feedback = await response.json();
      setAnswerFeedback(feedback);
      
      if (feedback.isCorrect) {
        setScore(score + 1);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      // Fallback feedback for demo
      const isCorrect = selectedAnswerIndex === 1; // Assuming index 1 is correct for demo
      setAnswerFeedback({
        questionId,
        selectedAnswer: selectedAnswerIndex,
        correctAnswer: 1,
        correctAnswerText: quizData.questions[currentQuestion].options[1],
        isCorrect,
        explanation: isCorrect ? "Great job!" : "The correct answer provides better security.",
        question: quizData.questions[currentQuestion].question,
        options: quizData.questions[currentQuestion].options
      });
      
      if (isCorrect) {
        setScore(score + 1);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (!showInstructions && timeLeft > 0 && !showFeedback && !isQuizComplete) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleTimeUp();
    }
  }, [timeLeft, showInstructions, showFeedback, isQuizComplete]);

  // Handle time up
  const handleTimeUp = async () => {
    setShowFeedback(true);
    const currentQuestionData = quizData.questions[currentQuestion];
    await submitAnswer(currentQuestionData.id, -1); // -1 indicates no answer selected
    setUserAnswers([...userAnswers, { questionId: currentQuestionData.id, answer: null, correct: false }]);
  };

  // Handle answer selection
  const handleAnswerSelect = async (answerIndex: number) => {
    if (showFeedback || timeLeft === 0) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    const currentQuestionData = quizData.questions[currentQuestion];
    await submitAnswer(currentQuestionData.id, answerIndex);
    
    setUserAnswers([...userAnswers, { 
      questionId: currentQuestionData.id, 
      answer: answerIndex, 
      correct: answerFeedback?.isCorrect || false
    }]);
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAnswerFeedback(null);
      setTimeLeft(quizData.timer);
    } else {
      setIsQuizComplete(true);
    }
  };

  // Handle quiz start
  const handleStartQuiz = () => {
    setShowInstructions(false);
    // Quiz data is already loaded, so we can start immediately
  };

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswerFeedback(null);
    setUserAnswers([]);
    setIsQuizComplete(false);
    setTimeLeft(quizData.timer);
    setShowInstructions(true);
  };

  // Handle close quiz
  const handleCloseQuiz = () => {
    router.push('/users/quiz');
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };

  // Calculate timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-600";
    if (timeLeft > 10) return "text-yellow-500";
    return "text-red-600";
  };

  // Get button style based on selection and feedback
  const getButtonStyle = (optionIndex: number) => {
    if (!showFeedback) {
      // Before feedback is shown
      if (selectedAnswer === optionIndex) {
        return "bg-blue-500 text-white";
      }
      return "bg-blue-100 text-blue-600 hover:bg-blue-200";
    }

    // After feedback is shown
    if (answerFeedback) {
      if (optionIndex === answerFeedback.correctAnswer) {
        // Correct answer - always green
        return "bg-green-500 text-white";
      } else if (optionIndex === selectedAnswer && !answerFeedback.isCorrect) {
        // User's incorrect selection - red
        return "bg-red-500 text-white";
      }
    }

    // Default style for other options
    return "bg-blue-100 text-blue-600";
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Quiz complete modal
  if (isQuizComplete && quizData) {
    return (
      <QuizComplete 
        score={score}
        totalQuestions={quizData.questions.length}
        quizTitle={quizData.title}
        onRetakeQuiz={handleRetakeQuiz}
        onClose={handleCloseQuiz}
      />
    );
  }

  // Instructions modal
  if (showInstructions && quizData) {
    return (
      <QuizInstructions 
        topic={quizData.title}
        onStartQuiz={handleStartQuiz}
        onClose={handleCloseQuiz}
      />
    );
  }

  // No quiz data
  if (!quizData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz not found</h2>
          <button 
            onClick={handleCloseQuiz}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = quizData.questions[currentQuestion];
  const progressWidth = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full p-4">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-3xl overflow-hidden">
        {/* Header with Score and Question Counter */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
              Score: {score}/{quizData.questions.length}
            </div>
            <span className="font-medium">{currentQuestionData.lesson}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-medium">Question {currentQuestion + 1}/{quizData.questions.length}</span>
            <button 
              onClick={handleCloseQuiz}
              className="text-white hover:text-blue-200 transition-colors" 
              aria-label="Close quiz"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-blue-100">
          <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progressWidth}%` }}></div>
        </div>

        {/* Timer Display */}
        <div className="flex justify-center mt-4">
          <div className={`font-bold text-2xl ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Container */}
        <div className="px-6 py-4">
          {/* Question Image */}
          {currentQuestionData.image && (
            <div className="w-full flex justify-center mb-4">
              <div className="w-48 h-48 flex items-center justify-center">
                <img 
                  src={currentQuestionData.image} 
                  alt="Question illustration"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const sibling = target.nextSibling as HTMLElement;
                    if (sibling) sibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500" style={{ display: 'none' }}>
                  Image Placeholder
                </div>
              </div>
            </div>
          )}

          {/* Question Text */}
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{currentQuestionData.question}</h2>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentQuestionData.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 ${getButtonStyle(index)} ${
                  showFeedback || timeLeft === 0 ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={showFeedback || timeLeft === 0}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback Message */}
          {showFeedback && answerFeedback && (
            <div className={`text-center mb-4 py-3 px-4 rounded-lg font-medium ${
              answerFeedback.isCorrect 
                ? "bg-green-100 text-green-800 border-l-4 border-green-500" 
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}>
              <div className="mb-2">
                {answerFeedback.isCorrect 
                  ? "✅ Correct! Great job!" 
                  : `❌ ${selectedAnswer !== null ? "Incorrect" : "Time's up!"}. The correct answer is: ${answerFeedback.correctAnswerText}`}
              </div>
              {answerFeedback.explanation && (
                <div className="text-sm opacity-90 mt-2">
                  {answerFeedback.explanation}
                </div>
              )}
            </div>
          )}

          {/* Next/Finish Button */}
          <div className="flex justify-center mt-4 mb-4">
            <button
              onClick={handleNextQuestion}
              className={`px-6 py-2 text-base font-medium text-white bg-blue-500 rounded-lg transition-all duration-150 ${
                !showFeedback ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              disabled={!showFeedback}
            >
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}