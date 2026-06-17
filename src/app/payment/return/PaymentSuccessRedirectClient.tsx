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
      router.push('/app');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleGoToGenerator = () => {
    router.push('/app');
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <svg className="mx-auto h-16 w-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mb-4 text-2xl font-bold text-slate-950">Payment Successful!</h1>
      <p className="mb-2 text-slate-600">
        Thank you for your purchase! Your payment has been processed successfully.
      </p>
      {email && (
        <p className="mb-4 text-sm text-slate-500">
          Payment account: {email}
        </p>
      )}
      
      {/* 手动进入按钮 */}
      <div className="mt-6 mb-4">
        <button
          onClick={handleGoToGenerator}
          className="rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-[0_18px_38px_rgba(15,23,42,0.18)] transition-all duration-300 hover:bg-slate-800"
        >
          Start Your Creative Journey Now!
        </button>
      </div>
      
      <p className="text-sm text-slate-500">
        Or wait 3 seconds for automatic redirect...
      </p>
    </div>
  );
}
