import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildAnonymousTrialFingerprintHash,
  createInMemoryAnonymousTrialQuotaStore,
  getAnonymousTrialAvailability,
  getAnonymousTrialWindowKey,
  normalizeAnonymousTrialLimit,
  reserveAnonymousTrialQuota,
} from './anonymous-trial-quota';

const requestFor = (headers: Record<string, string>) =>
  new Request('https://vogueai.net/api/effects/anonymous-generate', {
    method: 'POST',
    headers,
  });

test('builds stable opaque fingerprint hashes without storing raw IP data', () => {
  const request = requestFor({
    'x-forwarded-for': '203.0.113.7, 10.0.0.1',
    'user-agent': 'UnitTest Browser',
    'accept-language': 'en-US,en;q=0.9',
  });
  const first = buildAnonymousTrialFingerprintHash(request, 'secret');
  const second = buildAnonymousTrialFingerprintHash(request, 'secret');

  assert.equal(first, second);
  assert.doesNotMatch(first, /203\.0\.113\.7/);
  assert.equal(first.length, 64);
});

test('normalizes anonymous trial limit to one by default', () => {
  assert.equal(normalizeAnonymousTrialLimit(undefined), 1);
  assert.equal(normalizeAnonymousTrialLimit('0'), 1);
  assert.equal(normalizeAnonymousTrialLimit('3'), 3);
});

test('uses the code default anonymous trial limit when env is set', async () => {
  const previousLimit = process.env.ANONYMOUS_TRIAL_LIMIT_PER_DAY;
  process.env.ANONYMOUS_TRIAL_LIMIT_PER_DAY = '7';

  try {
    const store = createInMemoryAnonymousTrialQuotaStore();
    const availability = await getAnonymousTrialAvailability(
      requestFor({
        'x-forwarded-for': '203.0.113.8',
        'user-agent': 'UnitTest Browser',
      }),
      {
        store,
        now: new Date('2026-05-24T08:00:00.000Z'),
        secret: 'secret',
      }
    );

    assert.equal(availability.limit, 1);
    assert.equal(availability.remaining, 1);
  } finally {
    if (previousLimit === undefined) {
      delete process.env.ANONYMOUS_TRIAL_LIMIT_PER_DAY;
    } else {
      process.env.ANONYMOUS_TRIAL_LIMIT_PER_DAY = previousLimit;
    }
  }
});

test('enforces per-fingerprint daily quota through the store', async () => {
  const store = createInMemoryAnonymousTrialQuotaStore();
  const now = new Date('2026-05-24T08:00:00.000Z');
  const request = requestFor({
    'x-forwarded-for': '203.0.113.9',
    'user-agent': 'UnitTest Browser',
  });

  const first = await reserveAnonymousTrialQuota(request, {
    store,
    now,
    limit: 1,
    secret: 'secret',
  });
  const second = await reserveAnonymousTrialQuota(request, {
    store,
    now,
    limit: 1,
    secret: 'secret',
  });

  assert.equal(first.allowed, true);
  assert.equal(first.remaining, 0);
  assert.equal(second.allowed, false);
  assert.equal(second.remaining, 0);
});

test('resets anonymous trial quota on a new UTC day', async () => {
  const store = createInMemoryAnonymousTrialQuotaStore();
  const request = requestFor({
    'x-forwarded-for': '203.0.113.10',
    'user-agent': 'UnitTest Browser',
  });

  await reserveAnonymousTrialQuota(request, {
    store,
    now: new Date('2026-05-24T23:59:00.000Z'),
    limit: 1,
    secret: 'secret',
  });
  const nextDay = await getAnonymousTrialAvailability(request, {
    store,
    now: new Date('2026-05-25T00:01:00.000Z'),
    limit: 1,
    secret: 'secret',
  });

  assert.equal(getAnonymousTrialWindowKey(new Date('2026-05-25T00:01:00.000Z')), '2026-05-25');
  assert.equal(nextDay.allowed, true);
  assert.equal(nextDay.remaining, 1);
});
