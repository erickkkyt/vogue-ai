'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// 这是一个标准的 Next.js 错误边界组件
// 它会捕获当前路由段及其所有子路由段中的错误
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可以在这里记录错误到错误报告服务
    console.error('应用错误:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-md w-full bg-gray-800/90 border border-gray-700 p-8 rounded-2xl shadow-2xl text-center backdrop-blur-md">
        <svg
          className="w-16 h-16 text-red-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>

        <h1 className="text-2xl font-bold mb-4 text-white">An Unexpected Error Occurred</h1>

        <p className="mb-6 text-gray-300">
          We&apos;re sorry, an error occurred in the application. Our technical team has been notified.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 shadow-lg"
          >
            Retry
          </button>

          <Link
            href="/"
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 backdrop-blur-sm"
          >
            Back to Home
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-6 text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
} 