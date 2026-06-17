import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import * as stripeModule from './stripe';

test('Stripe subscription deletion marks the subscription unpaid and user free', async () => {
  const calls: Array<[string, Record<string, unknown>]> = [];

  await stripeModule.handleStripeEvent(
    {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          status: 'canceled',
          customer: 'cus_123',
          cancel_at_period_end: false,
          metadata: { userId: 'user_123' },
          items: {
            data: [{ price: { id: 'price_1TiYouFNBa78cTTjKQOi9gqG' } }],
          },
        },
      },
    } as never,
    {
      updateSubscriptionPaymentState: async (params) => {
        calls.push(['payment', params]);
      },
      updateUserSubscriptionState: async (params) => {
        calls.push(['user', params]);
      },
    }
  );

  assert.deepEqual(calls, [
    [
      'payment',
      {
        subscriptionId: 'sub_123',
        userId: 'user_123',
        status: 'canceled',
        paid: false,
        cancelAtPeriodEnd: false,
        periodEnd: null,
      },
    ],
    ['user', { userId: 'user_123', subscriptionState: 'free' }],
  ]);
});

test('Stripe invoice payment failure syncs the retrieved subscription status', async () => {
  const calls: Array<[string, Record<string, unknown>]> = [];

  await stripeModule.handleStripeEvent(
    {
      type: 'invoice.payment_failed',
      data: {
        object: {
          id: 'in_123',
          subscription: 'sub_456',
        },
      },
    } as never,
    {
      retrieveSubscription: async (subscriptionId) => {
        calls.push(['retrieve', { subscriptionId }]);
        return {
          id: 'sub_456',
          status: 'past_due',
          customer: 'cus_456',
          cancel_at_period_end: false,
          metadata: { userId: 'user_456' },
          items: {
            data: [{ price: { id: 'price_1TiYouFNBa78cTTjKQOi9gqG' } }],
          },
        };
      },
      updateSubscriptionPaymentState: async (params) => {
        calls.push(['payment', params]);
      },
      updateUserSubscriptionState: async (params) => {
        calls.push(['user', params]);
      },
    }
  );

  assert.deepEqual(calls, [
    ['retrieve', { subscriptionId: 'sub_456' }],
    [
      'payment',
      {
        subscriptionId: 'sub_456',
        userId: 'user_456',
        status: 'past_due',
        paid: false,
        cancelAtPeriodEnd: false,
        periodEnd: null,
      },
    ],
    ['user', { userId: 'user_456', subscriptionState: 'free' }],
  ]);
});

test('Stripe billing portal reuses the stored customer and returns a portal URL', async () => {
  const createPortal = stripeModule.createStripeBillingPortal;
  assert.equal(typeof createPortal, 'function');
  if (!createPortal) return;

  const calls: Array<[string, Record<string, unknown>]> = [];
  const result = await createPortal(
    {
      userId: 'user_789',
      email: 'user@example.com',
      name: 'Vogue User',
      returnPath: '/billings',
    },
    {
      getCustomerIdForUser: async (userId) => {
        calls.push(['get-customer', { userId }]);
        return 'cus_789';
      },
      createPortalSession: async (params) => {
        calls.push(['portal', params]);
        return { url: 'https://billing.stripe.com/session/test' };
      },
    }
  );

  assert.deepEqual(calls, [
    ['get-customer', { userId: 'user_789' }],
    [
      'portal',
      {
        customer: 'cus_789',
        return_url: 'http://localhost:3000/billings',
      },
    ],
  ]);
  assert.deepEqual(result, {
    url: 'https://billing.stripe.com/session/test',
  });
});

test('account billing management posts to the Stripe portal endpoint', () => {
  const accountSource = readFileSync(
    join(process.cwd(), 'src/components/account/VogueAccountCenter.tsx'),
    'utf8'
  );
  const routeSource = readFileSync(
    join(process.cwd(), 'src/app/api/payment/create-portal/route.ts'),
    'utf8'
  );

  assert.match(accountSource, /\/api\/payment\/create-portal/);
  assert.match(routeSource, /createStripeBillingPortal/);
});
