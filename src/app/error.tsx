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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--vogue-page)] p-4 text-slate-950">
      <div className="w-full max-w-md rounded-[20px] border border-slate-200 bg-white/86 p-8 text-center shadow-[0_24px_70px_rgba(72,92,130,0.16)] backdrop-blur-md">
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

        <h1 className="mb-4 text-2xl font-bold text-slate-950">An Unexpected Error Occurred</h1>

        <p className="mb-6 text-slate-600">
          We&apos;re sorry, an error occurred in the application. Our technical team has been notified.
        </p>
        
        <div className="flex flex-col justify-center space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
          <button
            onClick={reset}
            className="rounded-xl bg-slate-950 px-4 py-2 text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)] transition-all duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            Retry
          </button>

          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            Back to Home
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-6 text-xs text-slate-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
