import { stripe } from '@/payment/stripe';
import { getDb } from '@/db';
import { payment, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentSuccessRedirectClient from './PaymentSuccessRedirectClient';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

type PaymentResult =
  | { state: 'paid'; email?: string | null }
  | { state: 'pending' }
  | { state: 'error' };

async function getStripePaymentResult(sessionId: string): Promise<PaymentResult> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status === 'complete') {
      return { state: 'paid', email: session.customer_details?.email };
    }

    return { state: 'pending' };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return { state: 'error' };
  }
}

async function getZpayPaymentResult(orderId: string): Promise<PaymentResult> {
  try {
    const db = await getDb();
    const rows = await db
      .select({
        email: user.email,
        paid: payment.paid,
        status: payment.status,
      })
      .from(payment)
      .leftJoin(user, eq(payment.userId, user.id))
      .where(eq(payment.sessionId, orderId))
      .limit(1);
    const record = rows[0];

    if (record?.paid) {
      return { state: 'paid', email: record.email };
    }

    return { state: 'pending' };
  } catch (error) {
    console.error('Error retrieving ZPAY order:', error);
    return { state: 'error' };
  }
}

function PaymentResultView({ result }: { result: PaymentResult }) {
  if (result.state === 'paid') {
    return <PaymentSuccessRedirectClient email={result.email} />;
  }

  if (result.state === 'pending') {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-amber-600">
          Payment Pending or Incomplete
        </h1>
        <p className="mt-4 text-slate-600">
          If you have already paid, your payment is being processed. Please
          refresh your account later. If you have any questions, please contact
          support.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-red-400">
      Unable to retrieve payment status. Please contact support.
    </div>
  );
}

async function PaymentStatus({ sessionId }: { sessionId: string }) {
  const result = await getStripePaymentResult(sessionId);
  return <PaymentResultView result={result} />;
}

async function ZpayPaymentStatus({ orderId }: { orderId: string }) {
  const result = await getZpayPaymentResult(orderId);
  return <PaymentResultView result={result} />;
}

export default async function ReturnPage({ searchParams }: { searchParams: Promise<{ session_id?: string; provider?: string; order_id?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;
  const provider = resolvedSearchParams.provider;
  const orderId = resolvedSearchParams.order_id;

  return (
    <div className="min-h-screen bg-[var(--vogue-page)] text-slate-950 flex items-center justify-center">
      <div className="bg-white/86 p-8 rounded-lg shadow-[0_18px_46px_rgba(72,92,130,0.12)] max-w-md w-full">
        <Suspense fallback={<div className="text-center">Retrieving payment result...</div>}>
          {provider === 'zpay' && orderId ? (
            <ZpayPaymentStatus orderId={orderId} />
          ) : sessionId ? (
            <PaymentStatus sessionId={sessionId} />
          ) : (
            <div className="p-8 text-center text-red-400">
              Invalid Session ID
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
