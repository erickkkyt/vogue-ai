import assert from 'node:assert/strict';
import test from 'node:test';
import {
  validateCronRequestSecret,
  type CronSecretValidationInput,
} from './cron-guard';

const validate = (input: Partial<CronSecretValidationInput>) =>
  validateCronRequestSecret({
    configuredSecret: 'cron-secret',
    authorization: null,
    headerSecret: null,
    ...input,
  });

const statusOf = (result: ReturnType<typeof validateCronRequestSecret>) => {
  assert.equal(result.ok, false);
  return result.status;
};

test('accepts Vercel-style bearer cron secret', () => {
  assert.deepEqual(validate({ authorization: 'Bearer cron-secret' }), {
    ok: true,
  });
});

test('accepts explicit cron secret header for manual operations', () => {
  assert.deepEqual(validate({ headerSecret: 'cron-secret' }), { ok: true });
});

test('rejects missing or mismatched cron secrets', () => {
  assert.equal(statusOf(validate({ configuredSecret: null })), 503);
  assert.equal(statusOf(validate({ authorization: 'Bearer wrong-secret' })), 401);
  assert.equal(statusOf(validate({ authorization: null, headerSecret: null })), 401);
});

test('does not accept secrets in URLs', () => {
  assert.equal(
    statusOf(validate({
      authorization: null,
      headerSecret: null,
      querySecret: 'cron-secret',
    })),
    401
  );
});
