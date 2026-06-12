import assert from 'node:assert/strict';
import test from 'node:test';

import { fulfillStripePayment } from './stripe-fulfillment';

test('Stripe fulfillment grants credits even when the payment row already exists', async () => {
  const calls: string[] = [];

  const result = await fulfillStripePayment({
    paid: true,
    creditAmount: 50,
    ensurePaymentRecord: async () => {
      calls.push('ensure-payment-record');
      return { inserted: false };
    },
    grantCredits: async () => {
      calls.push('grant-credits');
    },
  });

  assert.deepEqual(calls, ['ensure-payment-record', 'grant-credits']);
  assert.deepEqual(result, {
    paymentInserted: false,
    creditGrantAttempted: true,
  });
});

test('Stripe fulfillment records unpaid payments without granting credits', async () => {
  const calls: string[] = [];

  const result = await fulfillStripePayment({
    paid: false,
    creditAmount: 50,
    ensurePaymentRecord: async () => {
      calls.push('ensure-payment-record');
      return { inserted: true };
    },
    grantCredits: async () => {
      calls.push('grant-credits');
    },
  });

  assert.deepEqual(calls, ['ensure-payment-record']);
  assert.deepEqual(result, {
    paymentInserted: true,
    creditGrantAttempted: false,
  });
});
