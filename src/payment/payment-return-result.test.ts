import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveStripePaymentResult } from './payment-return-result';

test('Stripe return success requires both Stripe paid status and local paid record', () => {
  assert.deepEqual(
    resolveStripePaymentResult({
      localPayment: { paid: true, email: 'buyer@example.com' },
      stripeSession: {
        status: 'complete',
        paymentStatus: 'paid',
        email: 'stripe@example.com',
      },
    }),
    { state: 'paid', email: 'buyer@example.com' }
  );

  assert.deepEqual(
    resolveStripePaymentResult({
      localPayment: { paid: false, email: 'buyer@example.com' },
      stripeSession: {
        status: 'complete',
        paymentStatus: 'paid',
        email: 'stripe@example.com',
      },
    }),
    { state: 'pending' }
  );

  assert.deepEqual(
    resolveStripePaymentResult({
      localPayment: { paid: true, email: 'buyer@example.com' },
      stripeSession: {
        status: 'complete',
        paymentStatus: 'unpaid',
        email: 'stripe@example.com',
      },
    }),
    { state: 'pending' }
  );
});

test('Stripe return success falls back to Stripe email only after local payment is settled', () => {
  assert.deepEqual(
    resolveStripePaymentResult({
      localPayment: { paid: true, email: null },
      stripeSession: {
        status: 'complete',
        paymentStatus: 'paid',
        email: 'stripe@example.com',
      },
    }),
    { state: 'paid', email: 'stripe@example.com' }
  );
});
