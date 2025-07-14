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

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-8">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="w-full flex justify-center mb-8">
            <Image
              src="/QuizImage/StartYourQuiz.png"
              alt="Start Your Quiz"
              width={400}
              height={140}
              className="w-full max-w-[400px] h-auto"
            />
          </div>
          <h1 className="text-2xl font-bold mb-4">Quiz Page</h1>
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-gray-600">Loading quizzes...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent p-8">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="w-full flex justify-center mb-8">
            <Image
              src="/QuizImage/StartYourQuiz.png"
              alt="Start Your Quiz"
              width={400}
              height={140}
              className="w-full max-w-[400px] h-auto"
            />
          </div>
          <h1 className="text-2xl font-bold mb-4">Quiz Page</h1>
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="w-full flex justify-center mb-8">
          <Image
            src="/QuizImage/StartYourQuiz.png"
            alt="Start Your Quiz"
            width={400}
            height={140}
            className="w-full max-w-[400px] h-auto"
          />
        </div>
        
        {quizzes.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-gray-600">No quizzes available</div>
          </div>
        ) : (
          <div className="space-y-6">
            {quizzes.map((quiz) => (
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
          </div>
        )}
      </div>
    </div>
  );
}