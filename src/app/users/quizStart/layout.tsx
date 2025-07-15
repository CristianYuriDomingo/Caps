// app/users/quizStart/layout.tsx
import { ReactNode } from 'react';

interface QuizStartLayoutProps {
  children: ReactNode;
}

export default function QuizStartLayout({ children }: QuizStartLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* This layout bypasses the parent layout styling */}
      {/* Full screen layout for quiz pages */}
      {children}
    </div>
  );
}