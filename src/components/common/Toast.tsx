'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show animation
    setIsVisible(true);

    // Auto-hide timer
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-600/90 to-emerald-600/90',
          border: 'border-green-500/50',
          icon: CheckCircle,
          iconColor: 'text-green-200'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-600/90 to-rose-600/90',
          border: 'border-red-500/50',
          icon: AlertCircle,
          iconColor: 'text-red-200'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-orange-600/90 to-amber-600/90',
          border: 'border-orange-500/50',
          icon: AlertTriangle,
          iconColor: 'text-orange-200'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90',
          border: 'border-blue-500/50',
          icon: Info,
          iconColor: 'text-blue-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-600/90 to-gray-700/90',
          border: 'border-gray-500/50',
          icon: Info,
          iconColor: 'text-gray-200'
        };
    }
  };

  const styles = getToastStyles();
  const IconComponent = styles.icon;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-out ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div
        className={`${styles.bg} ${styles.border} border backdrop-blur-xl rounded-xl shadow-2xl p-4 text-white`}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${styles.iconColor}`}>
            <IconComponent size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white leading-relaxed">
              {message}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/60 rounded-full transition-all ease-linear"
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (message: string, type: ToastProps['type'], duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      message,
      type,
      duration,
      onClose: () => removeToast(id)
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer
  };
}
