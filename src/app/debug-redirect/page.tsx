'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';

function DebugContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const allParams = Array.from(searchParams.entries());

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">重定向调试页面</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">当前页面信息</h2>
            <div className="space-y-2">
              <p><strong>Pathname:</strong> {pathname}</p>
              <p><strong>Full URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              <p><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">URL参数</h2>
            {allParams.length > 0 ? (
              <div className="space-y-2">
                {allParams.map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">没有URL参数</p>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">测试登录链接</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">AI Baby Generator:</h3>
                <a 
                  href="/login?next=%2Fai-baby-generator" 
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  /login?next=%2Fai-baby-generator
                </a>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">AI Baby Podcast:</h3>
                <a 
                  href="/login?next=%2Fai-baby-podcast" 
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  /login?next=%2Fai-baby-podcast
                </a>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Hailuo AI Video Generator:</h3>
                <a
                  href="/login?next=%2Fhailuo-ai-video-generator"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  /login?next=%2Fhailuo-ai-video-generator
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">环境信息</h2>
            <div className="space-y-2">
              <p><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
              <p><strong>Referrer:</strong> {typeof document !== 'undefined' ? document.referrer : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DebugRedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>}>
      <DebugContent />
    </Suspense>
  );
}
