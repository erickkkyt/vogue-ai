import assert from 'node:assert/strict';
import test from 'node:test';
import { getConfiguredBaseUrl } from './urls';

test('does not use BETTER_AUTH_URL as a base url fallback', () => {
  const previousBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const previousBetterAuthUrl = process.env.BETTER_AUTH_URL;
  const previousVercelUrl = process.env.VERCEL_URL;

  delete process.env.NEXT_PUBLIC_BASE_URL;
  process.env.BETTER_AUTH_URL = 'https://auth.vogueai.net';
  delete process.env.VERCEL_URL;

  try {
    assert.equal(getConfiguredBaseUrl(), 'http://localhost:3000');
  } finally {
    if (previousBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_BASE_URL = previousBaseUrl;
    }

    if (previousBetterAuthUrl === undefined) {
      delete process.env.BETTER_AUTH_URL;
    } else {
      process.env.BETTER_AUTH_URL = previousBetterAuthUrl;
    }

    if (previousVercelUrl === undefined) {
      delete process.env.VERCEL_URL;
    } else {
      process.env.VERCEL_URL = previousVercelUrl;
    }
  }
});
