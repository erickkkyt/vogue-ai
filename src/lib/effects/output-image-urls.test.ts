import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getImageUrlsFromOutput,
  replaceGenerationImageUrls,
} from './output-image-urls';

test('collects image URLs from common provider output fields', () => {
  assert.deepEqual(
    getImageUrlsFromOutput({
      result_url: 'https://provider.test/a.png',
      image_urls: ['https://provider.test/a.png', 'https://provider.test/b.png'],
      result_urls: ['https://provider.test/c.png'],
    }),
    [
      'https://provider.test/a.png',
      'https://provider.test/b.png',
      'https://provider.test/c.png',
    ]
  );
});

test('replaces nested provider image URLs for watermarked output', () => {
  const output = replaceGenerationImageUrls({
    output: {
      result_url: 'https://provider.test/a.png',
      image_urls: ['https://provider.test/a.png'],
      result_urls: ['https://provider.test/a.png'],
      raw: {
        result_url: 'https://provider.test/a.png',
      },
      providerMetadata: {
        rawOutput: {
          image_urls: ['https://provider.test/a.png'],
        },
      },
    },
    sourceUrls: ['https://provider.test/a.png'],
    storedUrls: ['https://media.vogueai.net/effects/gen/a-watermarked.webp'],
    storedKeys: ['effects/gen/a-watermarked.webp'],
    exposeProviderResultUrl: false,
    watermarked: true,
  });

  assert.ok(output && typeof output === 'object');
  const payload = output as Record<string, unknown>;
  assert.equal(
    payload.result_url,
    'https://media.vogueai.net/effects/gen/a-watermarked.webp'
  );
  assert.deepEqual(payload.image_urls, [
    'https://media.vogueai.net/effects/gen/a-watermarked.webp',
  ]);
  assert.deepEqual(payload.result_urls, [
    'https://media.vogueai.net/effects/gen/a-watermarked.webp',
  ]);
  assert.equal('provider_result_url' in payload, false);
  assert.equal(payload.watermark_applied, true);
  assert.equal(
    ((payload.raw as Record<string, unknown>) ?? {}).result_url,
    'https://media.vogueai.net/effects/gen/a-watermarked.webp'
  );
  assert.deepEqual(
    (
      ((payload.providerMetadata as Record<string, unknown>)
        .rawOutput as Record<string, unknown>) ?? {}
    ).image_urls,
    ['https://media.vogueai.net/effects/gen/a-watermarked.webp']
  );
});
