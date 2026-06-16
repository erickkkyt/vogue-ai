import assert from 'node:assert/strict';
import test from 'node:test';
import { getTrustedAuthOrigins } from './trusted-origins';

test('trusts Cloudflare local preview origins when the configured auth origin is local', () => {
  const origins = getTrustedAuthOrigins({
    configuredBaseUrl: 'http://localhost:3000',
    env: {},
  });

  assert.ok(origins.includes('http://localhost:3000'));
  assert.ok(origins.includes('http://localhost:8787'));
  assert.ok(origins.includes('http://127.0.0.1:8787'));
});

test('does not add localhost trusted origins for production base urls', () => {
  const origins = getTrustedAuthOrigins({
    configuredBaseUrl: 'https://vogueai.net',
    env: {
      BETTER_AUTH_TRUSTED_ORIGINS:
        'https://vogueai-staging.workers.dev, https://preview.vogueai.net/',
    },
  });

  assert.deepEqual(origins, [
    'https://vogueai.net',
    'https://vogueai-staging.workers.dev',
    'https://preview.vogueai.net',
  ]);
});
