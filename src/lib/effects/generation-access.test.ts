import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveGenerationAccessTierFromSubscriptionState } from './generation-access';

test('resolves faster generation only for subscription plan states', () => {
  assert.equal(resolveGenerationAccessTierFromSubscriptionState(null), 'standard');
  assert.equal(resolveGenerationAccessTierFromSubscriptionState('free'), 'standard');
  assert.equal(resolveGenerationAccessTierFromSubscriptionState('starter'), 'standard');
  assert.equal(resolveGenerationAccessTierFromSubscriptionState('basic'), 'faster');
  assert.equal(resolveGenerationAccessTierFromSubscriptionState('pro'), 'faster');
  assert.equal(resolveGenerationAccessTierFromSubscriptionState('creator'), 'faster');
  assert.equal(resolveGenerationAccessTierFromSubscriptionState('elite'), 'faster');
});
