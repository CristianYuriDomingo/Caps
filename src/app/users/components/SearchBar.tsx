"use client";

import { useState, FormEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Modal from './SeachBarModal';

interface SearchBarProps {
  // You can add props if needed
}

interface Lesson {
  title: string;
  path: string;
}

interface LessonCategory {
  category: string;
  image: string;
  lessons: Lesson[];
}

interface ApiResponse {
  success: boolean;
  data: LessonCategory[];
  total: number;
  error?: string;
}

const SearchBar: React.FC<SearchBarProps> = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LessonCategory[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        performSearch(searchTerm);
      } else {
        // Keep results visible but clear them if search is empty
        setSearchResults([]);
        setError('');
        setHasSearched(false);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Search function that calls the API
  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setError('');
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();

      if (data.success) {
        setSearchResults(data.data);
        setShowResults(true);
      } else {
        setError(data.error || 'Search failed');
        setSearchResults([]);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Show results immediately if we have previous results or if searching
    if (value.trim().length > 0 && (searchResults.length > 0 || hasSearched)) {
      setShowResults(true);
    }
  };

  const handleInputFocus = () => {
    // Show results if we have search term and results
    if (searchTerm.trim().length > 0 && (searchResults.length > 0 || hasSearched)) {
      setShowResults(true);
    }
  };

  const handleLessonClick = (path: string) => {
    router.push(path);
    setShowResults(false);
    setSearchTerm('');
    setHasSearched(false);
    inputRef.current?.blur();
  };

  // Open modal for a specific category
  const handleCategoryClick = (category: LessonCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
    setShowResults(false);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // Handle image load errors
  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => ({ ...prev, [imageUrl]: true }));
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Highlight matching text in search results
  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="bg-yellow-200">{part}</span> : part
    );
  };

  // Get count of lessons for a category
  const countLessons = (lessons: Lesson[]) => 
    lessons.length === 1 ? "1 Lesson" : `${lessons.length} Lessons`;

  // Default image fallback
  const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiA4QzEyLjY4NjMgOCAxMCAxMC42ODYzIDEwIDE0VjE4QzEwIDIxLjMxMzcgMTIuNjg2MyAyNCAxNiAyNEMxOS4zMTM3IDI0IDIyIDIxLjMxMzcgMjIgMThWMTRDMjIgMTAuNjg2MyAxOS4zMTM3IDggMTYgOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";

  return (
    <div ref={searchRef} className="w-full mb-6 px-2">
      <div className="relative z-40">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex justify-center">
          <input
            ref={inputRef}
            type="search"
            className="w-3/4 px-4 py-3 rounded-l-full border-2 border-r-0 border-blue-400 text-gray-800 text-lg shadow-md focus:outline-none focus:border-blue-500"
            placeholder="Search for lessons..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold rounded-r-full px-6 py-3 border-2 border-blue-500 shadow-md flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 animate-fadeIn z-50">
            {error ? (
              <div className="p-6 text-center">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-red-500 text-lg font-medium">Error</p>
                <p className="text-gray-400 text-sm mt-2">{error}</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-[70vh] overflow-y-auto">
                {searchResults.map((category, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0">
                    {/* Category header */}
                    <button 
                      className="flex items-center p-3 bg-gray-50 w-full hover:bg-gray-100 transition-colors text-left"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div className="w-8 h-8 mr-3 relative overflow-hidden rounded-md">
                        {imageErrors[category.image] ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <Image 
                            src={category.image || defaultImage} 
                            alt={category.category}
                            width={32}
                            height={32}
                            className="object-cover"
                            onError={() => handleImageError(category.image)}
                          />
                        )}
                      </div>
                      <h3 className="font-medium text-blue-700">{highlightMatch(category.category)}</h3>
                      
                      {/* Lesson count indicator */}
                      <span className="ml-auto text-xs text-gray-500">{countLessons(category.lessons)}</span>
                      
                      {/* Arrow icon */}
                      <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                    
                    {/* Lessons list */}
                    <ul>
                      {category.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="border-b border-gray-50 last:border-b-0">
                          <button
                            onClick={() => handleLessonClick(lesson.path)}
                            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors flex items-center group"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 group-hover:scale-125 transition-transform"></span>
                            <span>{highlightMatch(lesson.title)}</span>
                            
                            {/* Arrow icon */}
                            <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="p-6 text-center">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z"></path>
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No lessons found for "<span className="font-medium">{searchTerm}</span>"</p>
                <p className="text-gray-400 text-sm mt-2">Try checking your spelling or use different keywords</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Modal for displaying selected category */}
      {selectedCategory && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div>
            <h3 className="text-xl font-semibold mb-2">{selectedCategory.category}</h3>
            <p className="text-gray-600 mb-4">Choose a Lesson</p>
            <ul className="space-y-3">
              {selectedCategory.lessons.map((lesson, index) => (
                <li key={index}>
                  <button
                    className="w-full text-left p-3 bg-[#2d87ff] text-white rounded-md hover:bg-[#1a5bbf] transition-colors duration-300"
                    onClick={() => {
                      router.push(lesson.path);
                      handleCloseModal();
                    }}
                  >
                    {lesson.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SearchBar;