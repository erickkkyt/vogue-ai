import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createAnonymousStatusToken,
  normalizeAnonymousStatusTokenTtlMs,
  verifyAnonymousStatusToken,
} from './anonymous-status-token';

const tokenParams = {
  effectId: 16,
  wmTaskId: 'wm-task-1',
  providerTaskId: 'provider-task-1',
  selectedProvider: 'kie.gpt-image-2',
  now: 1_000,
  ttlMs: 60_000,
  secret: 'status-secret',
};

test('creates a signed anonymous status token bound to the provider task', () => {
  const token = createAnonymousStatusToken(tokenParams);
  const payload = verifyAnonymousStatusToken({
    token,
    expectedEffectId: 16,
    now: 2_000,
    secret: tokenParams.secret,
  });

  assert.equal(payload.wmTaskId, tokenParams.wmTaskId);
  assert.equal(payload.providerTaskId, tokenParams.providerTaskId);
  assert.equal(payload.selectedProvider, tokenParams.selectedProvider);
  assert.equal(payload.expiresAt, 61_000);
});

test('rejects tampered anonymous status tokens', () => {
  const token = createAnonymousStatusToken(tokenParams);
  const [payload] = token.split('.');
  const tampered = `${payload}.invalid-signature`;

  assert.throws(
    () =>
      verifyAnonymousStatusToken({
        token: tampered,
        expectedEffectId: 16,
        now: 2_000,
        secret: tokenParams.secret,
      }),
    /signature/
  );
});

test('rejects expired anonymous status tokens', () => {
  const token = createAnonymousStatusToken(tokenParams);

  assert.throws(
    () =>
      verifyAnonymousStatusToken({
        token,
        expectedEffectId: 16,
        now: 62_000,
        secret: tokenParams.secret,
      }),
    /expired/
  );
});

test('rejects anonymous status tokens for another effect', () => {
  const token = createAnonymousStatusToken(tokenParams);

  assert.throws(
    () =>
      verifyAnonymousStatusToken({
        token,
        expectedEffectId: 17,
        now: 2_000,
        secret: tokenParams.secret,
      }),
    /effect mismatch/
  );
});

test('normalizes anonymous status token ttl to bounded milliseconds', () => {
  assert.equal(normalizeAnonymousStatusTokenTtlMs(undefined), 60 * 60 * 1000);
  assert.equal(normalizeAnonymousStatusTokenTtlMs('10'), 60 * 1000);
  assert.equal(normalizeAnonymousStatusTokenTtlMs('7200'), 2 * 60 * 60 * 1000);
});
