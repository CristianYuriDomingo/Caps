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

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  imageSrc?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg mx-4">
        {/* Image - Stays at the top */}
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <img
            src={imageSrc || "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=128&h=128&fit=crop&crop=face"}
            alt="Modal Image"
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
        <div className="mt-14">{children}</div>
      </div>
    </div>
  );
};

const LearnCard: React.FC<LearnCardProps> = ({
  imageSrc,
  title,
  lessons,
  buttonText,
  onCardClick,
  isAvailable = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleStartLearning = () => {
    closeModal();
    onCardClick?.(); // Call the original onCardClick function
  };

  return (
    <>
      <div
        className={`relative w-full max-w-[180px] sm:max-w-[220px] md:max-w-[250px] h-56 sm:h-68 md:h-80 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
          isAvailable ? 'hover:scale-105 cursor-pointer' : 'opacity-75'
        }`}
        onClick={onCardClick}
      >
        {/* Image Container - takes up 70% of card height */}
        <div className="relative w-full h-[70%] bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
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
                if (isAvailable) {
                  openModal(); // Open modal instead of calling onCardClick directly
                }
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

        {/* Content Section with Fading Gradient Overlay - takes up 30% of card height */}
        <div className="relative bg-white py-3 px-4 h-[30%] flex flex-col justify-center">
          {/* Fading gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-blue-300/10 to-transparent"></div>
                  
          {/* Title and Lessons Info */}
          <div className="relative text-left z-10">
            <h3 className="text-blue-600 font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-2 leading-tight">{title}</h3>
            <p className="text-blue-500 text-xs sm:text-sm font-medium">{lessons}</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} imageSrc={imageSrc}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 mb-2">
            Ready to start your learning journey?
          </p>
          <p className="text-blue-600 font-semibold mb-6">
            {lessons}
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleStartLearning}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors duration-200"
            >
              Start Learning
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LearnCard;