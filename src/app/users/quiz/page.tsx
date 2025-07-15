'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import QuizTitle from '../components/QuizTitle'; // Adjust path as needed

interface Quiz {
  id: string;
  title: string;
  timer: number;
  questionCount: number;
  lessons: string[];
  createdAt: string;
}

export default function Quiz() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/users/quizzes');
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = (quizId: string) => {
    // Navigate to specific quiz - in a real Next.js app, you'd use router.push
    console.log(`Navigating to quiz: ${quizId}`);
    // Example: router.push(`/quiz/${quizId}`);
    
    // For now, you can redirect using window.location or implement your navigation logic
    // window.location.href = `/quiz/${quizId}`;
  };

  const displayedQuizzes = showAll ? quizzes : quizzes.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-4">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="w-full flex justify-center mb-2">
            <Image
              src="/QuizImage/StartYourQuiz.png"
              alt="Start Your Quiz"
              width={400}
              height={140}
              className="w-full max-w-[400px] h-auto"
            />
          </div>
          <div className="flex justify-center items-center py-10">
            <div className="text-lg text-gray-600">Loading quizzes...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent p-4">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="w-full flex justify-center mb-2">
            <Image
              src="/QuizImage/StartYourQuiz.png"
              alt="Start Your Quiz"
              width={400}
              height={140}
              className="w-full max-w-[400px] h-auto"
            />
          </div>
          <div className="flex justify-center items-center py-10">
            <div className="text-lg text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="w-full flex justify-center mb-2">
          <Image
            src="/QuizImage/StartYourQuiz.png"
            alt="Start Your Quiz"
            width={400}
            height={140}
            className="w-full max-w-[400px] h-auto"
          />
        </div>
        
        {quizzes.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <div className="text-lg text-gray-600">No quizzes available</div>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedQuizzes.map((quiz) => (
              <QuizTitle
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                timer={quiz.timer}
                questionCount={quiz.questionCount}
                lessons={quiz.lessons}
                createdAt={quiz.createdAt}
                onQuizSelect={handleQuizSelect}
              />
            ))}
            
            {/* View More Categories Button */}
            {quizzes.length > 4 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {showAll ? 'Show Less' : 'View More Categories'}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}