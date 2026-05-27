import assert from 'node:assert/strict';
import test from 'node:test';
import {
  VOGUE_PRICES,
  creditPackPrices,
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
  assert.ok(
    creditPackPrices.every((pack) => pack.zpayAmountEnvKey?.startsWith('ZPAY_'))
  );
});

test('credit packages carry the metadata fields Stripe webhooks need', () => {
  const source = VOGUE_PRICES.filter((price) => price.kind === 'credit');

  assert.equal(source.length, 3);
  assert.ok(source.every((price) => price.credits > 0));
});
