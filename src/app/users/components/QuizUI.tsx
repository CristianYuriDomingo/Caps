import React, { useState } from 'react';

const QuizInstructions = ({ topic, onStartQuiz }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full mx-auto p-6 bg-white shadow-lg rounded-2xl border border-blue-100">
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

export default function QuizUI() {
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Static data for UI display
  const currentQuestion = 0;
  const totalQuestions = 20;
  const score = 0;
  const progressWidth = 5; // 1/20 = 5%
  const timeLeft = 30;
  const formattedTopic = "Cyber Security";
  const showFeedback = false;
  const selectedAnswer = null;
  const answerStatus = null;
  
  // Sample question data
  const question = {
    question: "What should you use to create complex passwords?",
    options: [
      "Only lowercase letters", 
      "A mix of letters, numbers, and symbols", 
      "Your name and birthdate", 
      "The same password for all accounts"
    ],
    correctAnswer: "A mix of letters, numbers, and symbols",
    image: "/LearnImage/CyberSecurity/21.png"
  };

  // Format time for display
  const formatTime = (seconds) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };

  // Calculate timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-600";
    if (timeLeft > 10) return "text-yellow-500";
    return "text-red-600";
  };

  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const handleStartQuiz = () => {
    setShowInstructions(false);
  };

  return (
    <>
      {/* Instructions Modal */}
      {showInstructions && (
        <QuizInstructions 
          topic={formattedTopic}
          onStartQuiz={handleStartQuiz}
        />
      )}

      {/* Quiz Interface */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full p-4">
        <div className="bg-white shadow-xl rounded-3xl w-full max-w-3xl overflow-hidden">
          {/* Header with Score and Question Counter */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
                Score: {score}/{totalQuestions}
              </div>
              <span className="font-medium">{formattedTopic}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium">Question {currentQuestion + 1}/{totalQuestions}</span>
              <button 
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
            {/* Question Image - Minimized with no shadow/border */}
            <div className="w-full flex justify-center mb-4">
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="w-180 h-180 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  Image Placeholder
                </div>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{question.question}</h2>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {question.options.map((option, index) => {
                let buttonStyle = "bg-blue-100 text-blue-600 hover:bg-blue-200";
                
                if (selectedAnswer === option) {
                  if (showFeedback) {
                    // Show green if correct, red if incorrect
                    buttonStyle = option === question.correctAnswer 
                      ? "bg-green-500 text-white" 
                      : "bg-red-500 text-white";
                  } else {
                    // Selected but feedback not yet shown
                    buttonStyle = "bg-blue-500 text-white";
                  }
                } else if (showFeedback && option === question.correctAnswer) {
                  // Always highlight the correct answer when showing feedback
                  buttonStyle = "bg-green-500 text-white";
                }
                
                return (
                  <button
                    key={index}
                    className={`w-full py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 ${buttonStyle} ${
                      showFeedback || timeLeft === 0 ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    disabled={showFeedback || timeLeft === 0}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Feedback Message */}
            {showFeedback && (
              <div className={`text-center mb-4 py-2 px-3 rounded-lg font-medium ${
                answerStatus === "correct" ? "bg-green-100 text-green-800 border-l-4 border-green-500" : "bg-red-100 text-red-800 border-l-4 border-red-500"
              }`}>
                {answerStatus === "correct" 
                  ? "✅ Correct! Great job!" 
                  : `❌ ${selectedAnswer ? "Incorrect" : "Time's up!"}. The correct answer is: ${question.correctAnswer}`}
              </div>
            )}

            {/* Next/Finish Button with more compact style */}
            <div className="flex justify-center mt-4 mb-4">
              <button
                className={`px-6 py-2 text-base font-medium text-white bg-blue-500 rounded-lg transition-all duration-150 ${
                  (!selectedAnswer && !showFeedback) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
                disabled={!selectedAnswer && !showFeedback}
              >
                {isLastQuestion ? "Finish Quiz" : "Next Question"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}