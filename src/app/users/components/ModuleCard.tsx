import React, { useState } from 'react';

interface LearnCardProps {
  imageSrc: string;
  title: string;
  lessons: string;
  buttonText: string;
  onCardClick?: () => void;
}

const LearnCard: React.FC<LearnCardProps> = ({ 
  imageSrc, 
  title, 
  lessons, 
  buttonText,
  onCardClick
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-48 h-72 rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
      {/* Character Image Container */}
      <div className="relative w-full h-48 flex items-center justify-center p-4">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
            <span className="text-gray-500 text-sm">Image not available</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm p-4 rounded-t-2xl">
        <div className="mb-3">
          <h3 className="text-blue-600 font-bold text-lg mb-1">{title}</h3>
          <p className="text-blue-500 text-sm">{lessons}</p>
        </div>
        
        {/* Review Button */}
        <button 
          onClick={onCardClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Demo Component
const Demo = () => {
  const handleCardClick = () => {
    alert('Card clicked!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <LearnCard
        imageSrc="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop"
        title="Crime Prevention"
        lessons="5 Lessons 1/5"
        buttonText="Review"
        onCardClick={handleCardClick}
      />
    </div>
  );
};

export default Demo;