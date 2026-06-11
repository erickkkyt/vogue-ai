import assert from 'node:assert/strict';
import test from 'node:test';

import { estimateCreditsForEffect } from './pricing';

test('estimates GPT Image 2 credits from the gptimg matrix and generation count', () => {
  const credits = estimateCreditsForEffect({
    effect: {
      credit: 8,
      provider: 'kie.gpt-image-2',
      pricingSchema: null,
    },
    input: {
      n: 4,
      quality: 'high',
      wmOutputQuality: '4k',
    },
  });

  assert.equal(credits, 320);
});

test('uses GPT Image 2 low 1k matrix pricing for trial-sized requests', () => {
  const credits = estimateCreditsForEffect({
    effect: {
      credit: 8,
      provider: 'evolink.gpt-image-2',
      pricingSchema: null,
    },
    input: {
      n: 1,
      quality: 'low',
      wmOutputQuality: '1k',
    },
  });

  assert.equal(credits, 4);
});

test('keeps Nano Banana 2 pricing aligned with gptimg output quality matrix', () => {
  const credits = estimateCreditsForEffect({
    effect: {
      credit: 6,
      provider: 'kie.nano-banana-2',
      pricingSchema: null,
    },
    input: {
      n: 4,
      wmOutputQuality: '2k',
    },
  });

  assert.equal(credits, 32);
});

test('multiplies Nano Banana Pro pricing by requested image count', () => {
  const credits = estimateCreditsForEffect({
    effect: {
      credit: 8,
      provider: 'kie.nano-banana-pro',
      pricingSchema: null,
    },
    input: {
      n: 4,
      wmOutputQuality: '4k',
    },
  });

  assert.equal(credits, 56);
});

test('multiplies Nano Banana base model pricing by requested image count', () => {
  const credits = estimateCreditsForEffect({
    effect: {
      credit: 4,
      provider: 'kie.nano-banana',
      pricingSchema: null,
    },
    input: {
      n: 4,
      wmOutputQuality: '4k',
    },
  });

  assert.equal(credits, 16);
});

test('keeps Z-Image fixed at one credit per generated image', () => {
  const credits = estimateCreditsForEffect({
    effect: {
      credit: 1,
      provider: 'kie.z-image',
      pricingSchema: null,
    },
    input: {
      n: 4,
      aspect_ratio: '9:16',
      quality: 'high',
      wmOutputQuality: '4k',
    },
  });

  assert.equal(credits, 4);
});

test('maps GPT Image 1.5 workspace quality to gptimg size pricing', () => {
  const credits = estimateCreditsForEffect({
    effect: {
      credit: 4,
      provider: 'kie.gpt-image-1.5',
      pricingSchema: null,
    },
    input: {
      quality: 'high',
    },
  });

  assert.equal(credits, 20);
});

test('honors effect matrix pricing metadata before multiplier fallback', () => {
  const credits = estimateCreditsForEffect({
    effect: {
      credit: 8,
      provider: 'kie.gpt-image-2',
      pricingSchema: {
        version: 1,
        strategy: 'matrix',
        fallbackCredits: 18,
        rules: [
          {
            when: { quality: 'medium', wmOutputQuality: '4k' },
            credits: 24,
          },
        ],
      },
    },
    input: {
      n: 1,
      quality: 'medium',
      wmOutputQuality: '4k',
    },
  });

  assert.equal(credits, 24);
});
