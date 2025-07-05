import React, { useState } from 'react';

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

// Demo Component
const Demo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="text-center">
        <button 
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Open Modal
        </button>
        
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Modal Title</h2>
            <p className="text-gray-600 mb-6">
              This is the modal content. The image appears at the top of the modal, 
              positioned above the white container.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={closeModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Demo;