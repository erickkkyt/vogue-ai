'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function PaymentSuccessClient() {
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditsAdded, setCreditsAdded] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function processPayment() {
      try {
        const paramsToSend: Record<string, string> = {}; 
        
        searchParams.forEach((value, key) => {
          paramsToSend[key] = value; 
        });

        if (!paramsToSend.signature || !paramsToSend.checkout_id || !paramsToSend.order_id) { 
          throw new Error('Missing required payment parameters (signature, checkout_id, or order_id) from URL');
        }

        const response = await fetch('/api/payment/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paramsToSend)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Payment processing failed');
        }

        setCreditsAdded(result.credits_added);
        setProcessing(false);

        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);

      } catch (err) {
        console.error('Payment processing error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setProcessing(false);
      }
    }

    processPayment();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            {processing && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Processing Payment...
                </h1>
                <p className="text-gray-600">
                  Please wait while we confirm your payment and add credits to your account.
                </p>
              </>
            )}

            {!processing && !error && creditsAdded && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                  {creditsAdded} credits have been added to your account.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 font-medium">
                    You will be redirected to your dashboard in a few seconds...
                  </p>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard Now
                </button>
              </>
            )}

            {!processing && error && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Payment Error
                </h1>
                <p className="text-gray-600 mb-6">
                  {error}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Back to Pricing
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 