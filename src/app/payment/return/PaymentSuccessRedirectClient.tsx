'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentSuccessRedirectClientProps {
  email?: string | null;
}

export default function PaymentSuccessRedirectClient({ email }: PaymentSuccessRedirectClientProps) {
  const router = useRouter();

  useEffect(() => {
    // 延迟重定向，让用户看到成功消息
    const timer = setTimeout(() => {
      router.push('/ai-baby-generator');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleGoToGenerator = () => {
    router.push('/ai-baby-generator');
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <svg className="mx-auto h-16 w-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-green-400 mb-4">Payment Successful!</h1>
      <p className="text-gray-300 mb-2">
        Thank you for your purchase! Your payment has been processed successfully.
      </p>
      {email && (
        <p className="text-gray-400 text-sm mb-4">
          A confirmation email has been sent to: {email}
        </p>
      )}
      
      {/* 手动进入按钮 */}
      <div className="mt-6 mb-4">
        <button
          onClick={handleGoToGenerator}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Start Your Creative Journey Now!
        </button>
      </div>
      
      <p className="text-gray-400 text-sm">
        Or wait 3 seconds for automatic redirect...
      </p>
    </div>
  );
} 