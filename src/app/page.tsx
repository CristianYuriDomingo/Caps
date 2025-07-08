"use client";

import React, { useState, useEffect, useRef } from 'react';

export type SlideProps = {
  id: string;
  image: string;
  title: string;
  content: string;
};

type SpeechBubbleProps = {
  imageSrc: string;
  messages: string[];
  typingSpeed?: number;
  delayBetween?: number;
};

type CombinedCarouselProps = {
  slides: SlideProps[];
  themeColor?: string;
  onModuleComplete?: (moduleId: string) => void;
  completedModules?: string[];
  finishButtonText?: string;
  completedButtonText?: string;
  continueButtonText?: string;
  backButtonText?: string;
  moduleId?: string;
  speechBubbleMessages?: string[];
  moduleTitle?: string;
  moduleDescription?: string;
  characterImage?: string;
  iconImage?: string;
};

// Speech Bubble Component
function SpeechBubble({ imageSrc, messages, typingSpeed = 50, delayBetween = 1500 }: SpeechBubbleProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageIndex < messages.length) {
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        setCurrentMessage(messages[messageIndex].slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === messages[messageIndex].length) {
          clearInterval(typingInterval);
          setTimeout(() => setMessageIndex(messageIndex + 1), delayBetween);
        }
      }, typingSpeed);
      return () => clearInterval(typingInterval);
    }
  }, [messageIndex, messages, typingSpeed, delayBetween]);

  return (
    <div className="flex items-center space-x-4 p-4">
      {/* Character Image */}
      <div ref={imageRef} className="flex-shrink-0">
        <img src={imageSrc} alt="Character" className="w-20 h-20 rounded-full object-cover" />
      </div>

      {/* Speech Bubble */}
      <div className="relative bg-white text-gray-800 px-6 py-4 rounded-lg shadow-md border border-gray-200 max-w-xl">
        <p className="text-lg font-medium">{currentMessage}</p>
        {/* Speech Bubble Tail */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45"></div>
      </div>
    </div>
  );
}

const CombinedCarousel: React.FC<CombinedCarouselProps> = ({
  slides,
  themeColor = "blue",
  onModuleComplete,
  completedModules = [],
  finishButtonText = "Finish Reading",
  completedButtonText = "✓ Completed",
  continueButtonText = "Continue Reading",
  backButtonText = "Back",
  moduleId = "sample-module",
  speechBubbleMessages = ["Say No to Smoking", "Protect Your Health and Others!"],//this is the speech bubble messages
  moduleTitle = "Anti Smoking",// this is the lesson title
  moduleDescription = "Learn about the dangers of smoking and how to promote a smoke-free environment for a healthier community.",// this is the lesson description
  characterImage = "https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=👨‍🏫",
  iconImage = "https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=🎯"
}) => {
  const [showContent, setShowContent] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Sample slides data
  const sampleSlides = slides && slides.length > 0 ? slides : [
    {
      id: "1",
      image: "https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=Slide+1",//this is tip image 1
      title: "Welcome to Our Carousel",//this is tip title 1
      content: "This is the first slide of our beautiful carousel component. It features a clean design with smooth transitions and responsive layout."//this is tip description 1
    },
    {
      id: "2", 
      image: "https://via.placeholder.com/600x400/10B981/FFFFFF?text=Slide+2",//this is tip image 2
      title: "Features Overview",//this is tip title 2
      content: "Our carousel includes desktop and mobile responsive designs, navigation controls, progress indicators, and customizable styling options."//this is tip description 2
    },
    {
      id: "3",
      image: "https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Slide+3",//this is tip image 3
      title: "Getting Started",//this is tip title 3
      content: "You can easily customize the theme colors, button text, and handle completion events. The component is fully responsive and works great on all devices."//this is tip description 3
    }
  ];

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleClose = () => {
    setShowContent(false);
    console.log("Navigating back to Learn page");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sampleSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    if (!isModuleCompleted() && onModuleComplete) {
      onModuleComplete(moduleId);
    }
  };

  const isModuleCompleted = () => {
    return completedModules.includes(moduleId);
  };

  if (!showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Returned to Learn page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Background decorative elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/4"></div>
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-green-100 rounded-full opacity-20"></div>
      </div>

      {/* Fixed X Button */}
      <button
        className="fixed top-2 left-4 bg-white rounded-full p-2.5 shadow-md text-gray-500 hover:text-gray-700 hover:shadow-lg transition-all z-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={handleClose}
        aria-label="Close and return to Learn page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-6 flex flex-col items-center">
        {/* Speech bubble section */}
        <div className="w-full p-4 mb-2">
          <div className="relative">
            <SpeechBubble
              imageSrc={characterImage}
              messages={speechBubbleMessages}
            />
          </div>
        </div>

        {/* Enhanced separator with icon */}
        <div className="relative w-full mb-2 flex items-center justify-center">
          <div className="absolute h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent w-full"></div>
          <div className="relative bg-white p-2 rounded-full shadow-sm z-10">
            <img
              src={iconImage}
              alt="Icon"
              className="h-8 w-8 object-cover"
            />
          </div>
        </div>

        {/* Learning module title */}
        <div className="w-full text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{moduleTitle}</h2>
          <p className="text-gray-600">{moduleDescription}</p>
        </div>
      </div>

      {/* Carousel Content */}
      <div className="flex-grow flex justify-center items-center w-full relative z-10 px-4 mb-6">
        <div className="w-full max-w-6xl"> 
          {/* Desktop view - Side-by-side layout */}
          {!isMobile && (
            <div className="relative flex items-center h-[500px]">
              <div className="w-full overflow-hidden rounded-2xl shadow-lg relative">
                {/* Previous button */}
                {currentSlide > 0 && (
                  <button
                    onClick={prevSlide}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center
                    focus:outline-none shadow-md hover:bg-gray-50 hover:bg-opacity-90 active:bg-gray-100
                    hover:shadow-lg active:shadow-md transform transition-all duration-200
                    active:scale-95 hover:scale-100 text-${themeColor}-500 hover:text-${themeColor}-600`}
                    aria-label="Previous slide"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                )}

                <div className="flex transition-transform duration-500 ease-in-out h-[500px]"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {sampleSlides.map((slide, index) => (
                    <div key={index} className="min-w-full flex bg-white h-full">
                      {/* Image container - left side */}
                      <div className="w-3/5 relative bg-white">
                        <div className="w-full h-full relative">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Content container - right side */}
                      <div className="w-2/5 p-12 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-5 text-gray-800">{slide.title}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">{slide.content}</p>
                        
                        {/* Show Finish Reading button on last slide */}
                        {index === sampleSlides.length - 1 && (
                          <button
                            onClick={handleFinish}
                            className={`${isModuleCompleted() 
                              ? 'bg-green-500 hover:bg-green-600 border-green-700' 
                              : `bg-${themeColor}-500 hover:bg-${themeColor}-600 border-${themeColor}-700`
                            } text-white font-medium py-3 px-6 rounded-lg 
                            transition-all w-full border-b-4
                            hover:border-b-2 hover:mb-0.5 hover:translate-y-0.5
                            active:border-b-0 active:mb-1 active:translate-y-1`}
                          >
                            {isModuleCompleted() ? completedButtonText : finishButtonText}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next button */}
                {currentSlide < sampleSlides.length - 1 && (
                  <button
                    onClick={nextSlide}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center
                    focus:outline-none shadow-md hover:bg-gray-50 hover:bg-opacity-90 active:bg-gray-100
                    hover:shadow-lg active:shadow-md transform transition-all duration-200
                    active:scale-95 hover:scale-100 text-${themeColor}-500 hover:text-${themeColor}-600`}
                    aria-label="Next slide"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Progress indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {sampleSlides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (index <= currentSlide || isModuleCompleted()) {
                        setCurrentSlide(index);
                      }
                    }}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index
                        ? `bg-${themeColor}-500 w-6`
                        : isModuleCompleted()
                          ? 'bg-green-500 w-2'
                          : index < currentSlide
                            ? `bg-${themeColor}-300 w-2`
                            : 'bg-gray-300 hover:bg-gray-400 w-2 cursor-not-allowed'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    disabled={index > currentSlide && !isModuleCompleted()}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mobile view - Reading module layout */}
          {isMobile && (
            <div className="w-full px-4">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Current slide content */}
                <div className="w-full aspect-square relative bg-white">
                  <img
                    src={sampleSlides[currentSlide].image}
                    alt={sampleSlides[currentSlide].title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content section */}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-gray-800">{sampleSlides[currentSlide].title}</h2>
                  <p className="text-gray-600 text-base mb-6">{sampleSlides[currentSlide].content}</p>
                  
                  {/* Show "Finish Reading" button on last slide */}
                  {currentSlide === sampleSlides.length - 1 ? (
                    <button
                      onClick={handleFinish}
                      className={`w-full ${isModuleCompleted() 
                        ? 'bg-green-500 hover:bg-green-600 border-green-700' 
                        : `bg-${themeColor}-500 hover:bg-${themeColor}-600 border-${themeColor}-700`
                      } text-white font-bold py-3 px-4 rounded-lg 
                      mb-4 transition-all border-b-4
                      hover:border-b-2 hover:mb-[18px] hover:translate-y-0.5
                      active:border-b-0 active:mb-5 active:translate-y-1`}
                    >
                      {isModuleCompleted() ? completedButtonText : finishButtonText}
                    </button>
                  ) : (
                    <button
                      onClick={nextSlide}
                      className={`w-full bg-${themeColor}-500 hover:bg-${themeColor}-600 border-${themeColor}-700 text-white font-bold py-3 px-4 rounded-lg 
                      mb-4 transition-all border-b-4
                      hover:border-b-2 hover:mb-[18px] hover:translate-y-0.5
                      active:border-b-0 active:mb-5 active:translate-y-1`}
                    >
                      {continueButtonText}
                    </button>
                  )}

                  {/* Back button */}
                  {currentSlide > 0 && (
                    <button
                      onClick={prevSlide}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg 
                      transition-all border-b-4 border-gray-300
                      hover:border-b-2 hover:mb-0.5 hover:translate-y-0.5
                      active:border-b-0 active:mb-1 active:translate-y-1"
                    >
                      {backButtonText}
                    </button>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="px-6 pb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1 flex-grow">
                      {sampleSlides.map((slide, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all flex-grow ${
                            index === currentSlide
                              ? `bg-${themeColor}-500`
                              : isModuleCompleted()
                                ? 'bg-green-500'
                                : index < currentSlide
                                  ? `bg-${themeColor}-300`
                                  : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {currentSlide + 1}/{sampleSlides.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinedCarousel;