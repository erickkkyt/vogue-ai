import assert from 'node:assert/strict';
import test from 'node:test';

import type { EffectRecord } from '@/lib/effects/effects';
import { EvolinkImageAdapter } from './evolink-image-adapter';

const createEffect = (provider = 'evolink.gpt-image-2'): EffectRecord =>
  ({
    id: 16,
    name: 'GPT Image 2',
    type: 2,
    model: 'gpt-image-2',
    version: '2',
    credit: 10,
    linkName: 'gpt-image-2',
    prePrompt: null,
    description: 'GPT Image 2 image generation.',
    platform: 'evolink',
    api: 'https://api.evolink.ai/v1/images/generations',
    isOpen: 1,
    createdAt: null,
    provider,
    inputSchema: null,
    pricingSchema: null,
  }) as EffectRecord;

test('maps Nano Banana fallback providers to Evolink model names', async () => {
  process.env.EVOLINK_API_KEY = 'test-key';
  const originalFetch = global.fetch;
  const requests: Array<Record<string, unknown>> = [];

  global.fetch = (async (_input, init) => {
    const body =
      typeof init?.body === 'string'
        ? (JSON.parse(init.body) as Record<string, unknown>)
        : {};
    requests.push(body);

    return {
      ok: true,
      json: async () => ({ id: `task-${requests.length}`, status: 'pending' }),
    } as Response;
  }) as typeof fetch;

  try {
    await new EvolinkImageAdapter(
      createEffect('evolink.nano-banana-2')
    ).createGeneration({
      prompt: 'Create a crisp commerce hero image.',
      aspect_ratio: '1:1',
      wmOutputQuality: '1k',
      image_urls: ['https://example.com/reference.webp'],
      n: 4,
    });

    await new EvolinkImageAdapter(
      createEffect('evolink.nano-banana')
    ).createGeneration({
      prompt: 'Create a quick social visual.',
      aspect_ratio: '16:9',
      wmOutputQuality: '1k',
    });

    await new EvolinkImageAdapter(
      createEffect('evolink.nano-banana-pro')
    ).createGeneration({
      prompt: 'Create a polished product poster.',
      aspect_ratio: '3:2',
      wmOutputQuality: '4k',
      callBackUrl: 'https://vogueai.net/api/effects/callback',
    });

    assert.deepEqual(requests, [
      {
        model: 'gemini-3.1-flash-image-preview',
        prompt: 'Create a crisp commerce hero image.',
        size: '1:1',
        quality: '1K',
        image_urls: ['https://example.com/reference.webp'],
      },
      {
        model: 'nano-banana-beta',
        prompt: 'Create a quick social visual.',
        size: '16:9',
      },
      {
        model: 'gemini-3-pro-image-preview',
        prompt: 'Create a polished product poster.',
        size: '3:2',
        quality: '4K',
        callback_url: 'https://vogueai.net/api/effects/callback',
      },
    ]);
  } finally {
    global.fetch = originalFetch;
  }
});

test('maps Evolink completed and failed polling responses clearly', async () => {
  process.env.EVOLINK_API_KEY = 'test-key';
  const originalFetch = global.fetch;

  global.fetch = (async (input) => {
    const taskId = new URL(String(input)).pathname.split('/').pop();
    return {
      ok: true,
      json: async () =>
        taskId === 'failed-task'
          ? { status: 'failed', message: 'Evolink generation failed' }
          : {
              status: 'completed',
              results: ['https://cdn.example.com/generated/image.png'],
            },
    } as Response;
  }) as typeof fetch;

  try {
    const adapter = new EvolinkImageAdapter(createEffect('evolink.nano-banana-2'));
    const success = await adapter.checkStatus('success-task');
    const failure = await adapter.checkStatus('failed-task');

    assert.deepEqual(success, {
      status: 'succeeded',
      output: {
        image_urls: ['https://cdn.example.com/generated/image.png'],
        result_url: 'https://cdn.example.com/generated/image.png',
        taskId: 'success-task',
      },
    });
    assert.equal(failure.status, 'failed');
    assert.equal(failure.error, 'Evolink generation failed');
  } finally {
    global.fetch = originalFetch;
  }
});
