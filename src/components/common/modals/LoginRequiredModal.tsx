'use client';

import { X, LogIn, Sparkles } from 'lucide-react';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  title?: string;
  message?: string;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  onLogin,
  title = "Login Required",
  message = "Please log in to continue with your purchase. You'll be redirected back to this page after logging in."
}: LoginRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-md space-y-4 transform transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <LogIn size={16} />
            Log In
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 