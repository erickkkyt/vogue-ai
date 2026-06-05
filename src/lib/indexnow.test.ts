import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildIndexNowPayload,
  getIndexNowKeyLocation,
  getIndexNowRuntimeConfig,
} from './indexnow';

test('buildIndexNowPayload keeps only canonical URLs for the configured host', () => {
  const payload = buildIndexNowPayload({
    key: 'test-key-123',
    keyLocation: 'https://vogueai.net/indexnow-key.txt',
    siteUrl: 'https://vogueai.net',
    urls: [
      'https://vogueai.net/ai-image-prompt',
      'https://vogueai.net/ai-image-prompt',
      'https://vogueai.net/prompt/oda-nobunaga-x-post-page-010104001',
      'https://vogueai.net/api/effects/generate',
      'https://example.com/ai-image-prompt',
    ],
  });

  assert.deepEqual(payload, {
    host: 'vogueai.net',
    key: 'test-key-123',
    keyLocation: 'https://vogueai.net/indexnow-key.txt',
    urlList: [
      'https://vogueai.net/ai-image-prompt',
      'https://vogueai.net/prompt/oda-nobunaga-x-post-page-010104001',
    ],
  });
});

test('buildIndexNowPayload omits keyLocation when the key file is in the root', () => {
  const payload = buildIndexNowPayload({
    key: 'test-key-123',
    keyLocation: 'https://vogueai.net/test-key-123.txt',
    siteUrl: 'https://vogueai.net',
    urls: ['https://vogueai.net/earth-zoom'],
  });

  assert.deepEqual(payload, {
    host: 'vogueai.net',
    key: 'test-key-123',
    urlList: ['https://vogueai.net/earth-zoom'],
  });
});

test('getIndexNowKeyLocation defaults to a stable root-level route', () => {
  assert.equal(
    getIndexNowKeyLocation('https://vogueai.net'),
    'https://vogueai.net/indexnow-key.txt'
  );
});

test('getIndexNowRuntimeConfig reads environment overrides', () => {
  const config = getIndexNowRuntimeConfig({
    INDEXNOW_KEY: 'test-key-123',
    INDEXNOW_ENDPOINT: 'https://example.com/indexnow',
    INDEXNOW_KEY_LOCATION: 'https://vogueai.net/custom-indexnow-key.txt',
    NEXT_PUBLIC_BASE_URL: 'https://vogueai.net',
  });

  assert.deepEqual(config, {
    endpoint: 'https://example.com/indexnow',
    key: 'test-key-123',
    keyLocation: 'https://vogueai.net/custom-indexnow-key.txt',
    siteUrl: 'https://vogueai.net',
  });
});

test('getIndexNowRuntimeConfig defaults to the canonical VogueAI host', () => {
  const config = getIndexNowRuntimeConfig({
    INDEXNOW_KEY: 'test-key-123',
    BETTER_AUTH_URL: 'https://auth.vogueai.net',
  });

  assert.equal(config.siteUrl, 'https://vogueai.net');
});
