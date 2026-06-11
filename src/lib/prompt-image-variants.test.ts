import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getPromptImageVariantSrc,
  isPromptImageVariantSrc,
  normalizePromptImageVariantWidth,
  type PromptImageVariantManifest,
} from './prompt-image-variants';

const sourceUrl =
  'https://pub-911e4fa03f0c4323a80d8f3dc99d1c7f.r2.dev/prompt-libraries/awesome-gptimage2-prompts/x-2055490135488336199/cinematic-night-time-selfie-young-woman-riding-1.jpg';

test('prompt image variant helper uses the closest generated CDN variant', () => {
  const manifest: PromptImageVariantManifest = {
    [sourceUrl]: {
      '640':
        'https://media.vogueai.net/prompt-image-variants/abc123/640.webp',
      '1200':
        'https://media.vogueai.net/prompt-image-variants/abc123/1200.webp',
    },
  };

  assert.equal(normalizePromptImageVariantWidth(600), 640);
  assert.equal(
    getPromptImageVariantSrc({
      entryId: 'x-2055490135488336199',
      imageIndex: 0,
      imageUrl: sourceUrl,
      manifest,
      width: 600,
    }),
    'https://media.vogueai.net/prompt-image-variants/abc123/640.webp'
  );
});

test('prompt image variant helper falls back to the original image URL when missing', () => {
  assert.equal(
    getPromptImageVariantSrc({
      entryId: 'x-2055490135488336199',
      imageIndex: 2,
      imageUrl: sourceUrl,
      manifest: {},
      width: 160,
    }),
    sourceUrl
  );
});

test('prompt image variant helper identifies generated variant URLs', () => {
  assert.equal(
    isPromptImageVariantSrc(
      'https://media.vogueai.net/prompt-image-variants/abc123/640.webp'
    ),
    true
  );
  assert.equal(isPromptImageVariantSrc(sourceUrl), false);
});
