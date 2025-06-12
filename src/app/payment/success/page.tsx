import { Suspense } from 'react';
import PaymentSuccessClient from './PaymentSuccessClient'; // 假设客户端逻辑组件
import type { Metadata } from 'next'; // Added Metadata import

// Added metadata export for noindex
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false, // Usually no need to follow links from a success page
  },
  title: 'Payment Successful - Baby Podcast Pro', // Title for browser tab
};

// 定义一个简单的加载回退UI
function LoadingPaymentStatus() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 可以包含 Header 和 Footer 如果希望在加载时也显示它们 */}
      {/* <Header /> */}
      <main className="flex-grow pt-16 md:pt-20 flex items-center justify-center">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Loading Payment Status...
            </h1>
            <p className="text-gray-600">
              Please wait while we retrieve your payment details.
            </p>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingPaymentStatus />}>
      <PaymentSuccessClient />
    </Suspense>
  );
} 