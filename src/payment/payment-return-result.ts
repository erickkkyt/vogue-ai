export type PaymentResult =
  | { state: 'paid'; email?: string | null }
  | { state: 'pending' }
  | { state: 'error' };

export type LocalPaymentState = {
  paid?: boolean | null;
  email?: string | null;
} | null;

export type StripeCheckoutState = {
  status?: string | null;
  paymentStatus?: string | null;
  email?: string | null;
} | null;

export function resolveStripePaymentResult({
  localPayment,
  stripeSession,
}: {
  localPayment: LocalPaymentState;
  stripeSession: StripeCheckoutState;
}): PaymentResult {
  const stripePaid =
    stripeSession?.status === 'complete' && stripeSession.paymentStatus === 'paid';

  if (stripePaid && localPayment?.paid) {
    return {
      state: 'paid',
      email: localPayment.email ?? stripeSession?.email,
    };
  }

  return { state: 'pending' };
}
