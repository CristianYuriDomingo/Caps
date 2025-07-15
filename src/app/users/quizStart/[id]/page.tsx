// src/app/users/quizStart/[id]/page.tsx
import React from 'react';
import QuizUI from './QuizUI'; // Import your QuizUI component

interface QuizStartPageProps {
  params: {
    id: string;
  };
}

export default function QuizStartPage({ params }: QuizStartPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <QuizUI quizId={params.id} />
    </div>
  );
}