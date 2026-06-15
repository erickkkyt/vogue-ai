import assert from 'node:assert/strict';
import test from 'node:test';

import { createPromptSeoSlug } from './prompt-slug-utils';

test('clean short VogueAI titles do not fall back to raw image filenames', () => {
  const slug = createPromptSeoSlug({
    title: '3D Character Concept AI',
    images: [
      'https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/example/ai-image-x2065058228585844954-v1-schema-01.png',
    ],
    imagePrompts: [
      {
        title: '3D Character Concept Variant 01',
        prompt: 'Reference Role: fantasy character concept.',
      },
    ],
    prompt: 'Reference Role: fantasy character concept.',
    categoryKey: 'art',
    modelId: 'gptimage2',
  });

  assert.equal(slug, '3d-character-concept-ai');
  assert.doesNotMatch(slug, /x\d{8,}|schema|ai-image/i);
});

test('queue-style generic titles still use a richer candidate slug', () => {
  const slug = createPromptSeoSlug({
    title: 'AI Image Prompt',
    images: ['https://media.vogueai.net/example/luxury-sneaker-poster-1.png'],
    prompt: 'Create a luxury sneaker launch poster with dramatic lighting.',
    categoryKey: 'product',
    modelId: 'gptimage2',
  });

  assert.notEqual(slug, 'ai-image-prompt');
  assert.match(slug, /luxury-sneaker-poster/);
});
