import assert from 'node:assert/strict';
import test from 'node:test';
import {
  VOGUE_PRICES,
  creditPackPrices,
  getPricingSubscriptionPlanIdsForInterval,
  getVogueCreditGrantAmount,
  subscriptionPlanIds,
  subscriptionPrices,
} from '@/config/pricing';

test('pricing config mirrors the gptimg billing shape', () => {
  assert.deepEqual(subscriptionPlanIds, ['basic', 'pro', 'creator', 'elite']);

  for (const planId of subscriptionPlanIds) {
    const monthly = subscriptionPrices.find(
      (price) => price.id === planId && price.interval === 'month'
    );
    const yearly = subscriptionPrices.find(
      (price) => price.id === planId && price.interval === 'year'
    );

    assert.ok(monthly, `${planId} monthly price is missing`);
    assert.ok(yearly, `${planId} yearly price is missing`);
    assert.equal(monthly?.credits, yearly?.credits);
    assert.equal(
      getVogueCreditGrantAmount(yearly!),
      yearly!.credits * 12,
      `${planId} yearly plan should grant annual credits upfront`
    );
    assert.equal(
      getVogueCreditGrantAmount(monthly!),
      monthly!.credits,
      `${planId} monthly plan should grant one month of credits`
    );
    assert.match(monthly?.priceEnvKey ?? '', /_MONTHLY$/);
    assert.match(yearly?.priceEnvKey ?? '', /_YEARLY$/);
  }

  assert.deepEqual(
    creditPackPrices.map((pack) => pack.id),
    ['starter', 'growth', 'professional']
  );
  assert.deepEqual(
    creditPackPrices.map((pack) => ({
      id: pack.id,
      amountUsd: pack.amountUsd,
      credits: pack.credits,
    })),
    [
      { id: 'starter', amountUsd: 12.9, credits: 200 },
      { id: 'growth', amountUsd: 49.9, credits: 1200 },
      { id: 'professional', amountUsd: 99.9, credits: 2600 },
    ]
  );
  assert.ok(
    creditPackPrices.every((pack) => pack.zpayAmountEnvKey?.startsWith('ZPAY_'))
  );
});

test('pricing cards hide Basic monthly while keeping all annual subscriptions', () => {
  assert.deepEqual(getPricingSubscriptionPlanIdsForInterval('month'), [
    'pro',
    'creator',
    'elite',
  ]);
  assert.deepEqual(getPricingSubscriptionPlanIdsForInterval('year'), [
    'basic',
    'pro',
    'creator',
    'elite',
  ]);
});

test('credit packages carry the metadata fields Stripe webhooks need', () => {
  const source = VOGUE_PRICES.filter((price) => price.kind === 'credit');

  assert.equal(source.length, 3);
  assert.ok(source.every((price) => price.credits > 0));
});
