/**
 * LearnCard Component for displaying learning modules
 * Used in user dashboard to show available courses/modules
 * 
 * Props:
 * - imageSrc: URL for module image (from admin uploaded images)
 * - title: Module title
 * - lessons: Formatted lesson count (e.g., "5 Lessons")
 * - buttonText: Text for action button
 * - onCardClick: Function to handle card/button clicks
 * - isAvailable: Whether module is available (optional)
 */

import React, { useState } from 'react';

interface LearnCardProps {
  imageSrc: string;
  title: string;
  lessons: string;
  buttonText: string;
  onCardClick?: () => void;
  isAvailable?: boolean;
}

const LearnCard: React.FC<LearnCardProps> = ({
  imageSrc,
  title,
  lessons,
  buttonText,
  onCardClick,
  isAvailable = true
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative w-full max-w-[160px] sm:max-w-[208px] md:max-w-[240px] h-56 sm:h-68 md:h-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isAvailable ? 'hover:scale-105 cursor-pointer' : 'opacity-75'
      }`}
      onClick={onCardClick}
    >
      {/* Image Container - takes up 70% of card height */}
      <div className="relative w-full h-[70%] bg-gradient-to-br from-blue-50 to-blue-100 rounded-t-2xl overflow-hidden">
        {!imageError && imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => {
              console.log('Image failed to load:', imageSrc);
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-xl font-bold">📚</span>
              </div>
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          </div>
        )}
        
        {/* Button positioned in bottom-right corner of image */}
        <div className="absolute bottom-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCardClick?.();
            }}
            disabled={!isAvailable}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
              isAvailable
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Content Section - now takes up 30% of card height */}
      <div className="bg-white rounded-b-2xl py-3 px-4 h-[30%] flex flex-col justify-center">
        {/* Title and Lessons Info */}
        <div className="text-left">
          <h3 className="text-blue-600 font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-2 leading-tight">{title}</h3>
          <p className="text-blue-500 text-xs sm:text-sm font-medium">{lessons}</p>
        </div>
      </div>
    </div>
  );
};

export default LearnCard;