import { stripe } from '@/lib/stripe';
import { Suspense } from 'react';
import PaymentSuccessRedirectClient from './PaymentSuccessRedirectClient';

async function PaymentStatus({ sessionId }: { sessionId: string }) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status === 'complete') {
      return <PaymentSuccessRedirectClient email={session.customer_details?.email} />;
    } else {
      return (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yellow-400">Payment Pending or Incomplete</h1>
          <p className="mt-4 text-gray-300">If you have already paid, your payment is being processed. Please refresh your account later. If you have any questions, please contact support.</p>
        </div>
      );
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    return <div className="p-8 text-center text-red-400">Unable to retrieve payment status. Please contact support.</div>;
  }
}

export default async function ReturnPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <Suspense fallback={<div className="text-center">Retrieving payment result...</div>}>
          {sessionId ? <PaymentStatus sessionId={sessionId} /> : <div className="p-8 text-center text-red-400">Invalid Session ID</div>}
        </Suspense>
      </div>
    </div>
  );
} 