'use client';

import Link from 'next/link';
import { X } from 'lucide-react';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: 'podcast' | 'baby-generator';
}

export default function InsufficientCreditsModal({ isOpen, onClose, service = 'podcast' }: InsufficientCreditsModalProps) {
  if (!isOpen) {
    return null;
  }

  const getServiceMessage = () => {
    switch (service) {
      case 'baby-generator':
        return "Don't have enough credits to generate a new AI Baby. Please check your plan to add more credits.";
      case 'podcast':
      default:
        return "Don't have enough credits to generate a new AI Baby Podcast. Please check your plan to add more credits.";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Optional: close on backdrop click
    >
      <div
        className="bg-[#2a3647] p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-scale-in"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Insufficient Credits</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-300 mb-6 text-sm sm:text-base">
          {getServiceMessage()}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/pricing"
            className="w-full sm:w-auto flex-grow bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-lg text-center transition-colors duration-200 text-sm sm:text-base"
            onClick={onClose} // Close modal on navigation
          >
            Check Plan
          </Link>
          <button
            onClick={onClose}
            className="w-full sm:w-auto flex-grow bg-gray-600 hover:bg-gray-700 text-gray-200 font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
      {/* Basic CSS for modal animation - can be moved to global CSS */}
      <style jsx global>{`
        @keyframes modal-scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-scale-in {
          animation: modal-scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
