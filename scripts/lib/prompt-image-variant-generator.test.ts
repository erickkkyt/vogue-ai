import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildPromptImageVariantObjectKey,
  mergePromptImageVariant,
} from './prompt-image-variant-generator';

const sourceUrl =
  'https://pub-911e4fa03f0c4323a80d8f3dc99d1c7f.r2.dev/prompt-libraries/awesome-gptimage2-prompts/x-2055490135488336199/cinematic-night-time-selfie-young-woman-riding-1.jpg';

test('prompt image variant object keys are stable per source URL and width', () => {
  assert.equal(
    buildPromptImageVariantObjectKey(sourceUrl, 640),
    buildPromptImageVariantObjectKey(sourceUrl, 640)
  );
  assert.match(
    buildPromptImageVariantObjectKey(sourceUrl, 640),
    /^prompt-image-variants\/[a-f0-9]{40}\/640\.webp$/
  );
  assert.notEqual(
    buildPromptImageVariantObjectKey(sourceUrl, 640),
    buildPromptImageVariantObjectKey(sourceUrl, 1200)
  );
});

test('prompt image variant manifest merge preserves existing widths', () => {
  const manifest = mergePromptImageVariant({}, sourceUrl, 640, 'https://media.vogueai.net/a/640.webp');
  const nextManifest = mergePromptImageVariant(
    manifest,
    sourceUrl,
    1200,
    'https://media.vogueai.net/a/1200.webp'
  );

  assert.deepEqual(nextManifest[sourceUrl], {
    '640': 'https://media.vogueai.net/a/640.webp',
    '1200': 'https://media.vogueai.net/a/1200.webp',
  });
});
