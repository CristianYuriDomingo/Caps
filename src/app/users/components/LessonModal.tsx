// app/users/components/LessonModal.tsx
/**
 * LessonModal Component
 * Modal that displays all lessons for a specific module
 * 
 * Features:
 * - Shows module image and title
 * - Lists all lessons in the module
 * - Handles lesson selection
 * - Loading and error states
 * - Based on the provided modal UI design
 */

import React from 'react';
import { UserModule, Lesson } from '../lib/api';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: UserModule | null;
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  onLessonClick: (lessonId: string, lessonTitle: string) => void;
}

const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  module,
  lessons,
  loading,
  error,
  onLessonClick
}) => {
  if (!isOpen || !module) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg mx-4 max-h-[80vh] overflow-y-auto">
        {/* Module Image - Stays at the top */}
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <img
            src={module.imageSrc || "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=128&h=128&fit=crop&crop=face"}
            alt={module.title}
            className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
          />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-blue-500 hover:text-gray-900 text-xl font-bold transition-colors duration-200"
        >
          ✖
        </button>

        {/* Push content down to accommodate the image */}
        <div className="mt-14">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{module.title}</h2>
            <p className="text-gray-600 mb-6">
              {module.totalLessons} lessons available
            </p>
            
            {/* Lessons List */}
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose a lesson:</h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading lessons...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              ) : lessons.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-600">No lessons available for this module yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => onLessonClick(lesson.id, lesson.title)}
                      className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full mr-3">
                              {index + 1}
                            </span>
                            <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {lesson.title}
                            </h4>
                          </div>
                          {lesson.description && (
                            <p className="text-gray-600 text-sm ml-9 line-clamp-2">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Modal Actions */}
            <div className="flex justify-center mt-6">
              <button 
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonModal;