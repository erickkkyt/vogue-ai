import assert from 'node:assert/strict';
import test from 'node:test';

import type { EffectRecord } from '@/lib/effects/effects';
import { Ai302ImageAdapter } from './ai302-image-adapter';

const createEffect = (provider = '302.gpt-image-2'): EffectRecord =>
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
    platform: '302',
    api: 'https://api.302.ai/v1/images/generations',
    isOpen: 1,
    createdAt: null,
    provider,
    inputSchema: null,
    pricingSchema: null,
  }) as EffectRecord;

test('maps Nano Banana 2 text requests to 302 Wavespeed payloads', async () => {
  process.env.AI302_API_KEY = 'test-302-key';
  const originalFetch = global.fetch;
  const requests: Array<{ url: string; body: Record<string, unknown> }> = [];

  global.fetch = (async (input, init) => {
    requests.push({
      url: String(input),
      body:
        typeof init?.body === 'string'
          ? (JSON.parse(init.body) as Record<string, unknown>)
          : {},
    });
    return {
      ok: true,
      json: async () => ({
        code: 200,
        message: 'success',
        data: { id: '302-nano-banana-2-task', status: 'created' },
      }),
    } as Response;
  }) as typeof fetch;

  try {
    const adapter = new Ai302ImageAdapter(createEffect('302.nano-banana-2'));
    const result = await adapter.createGeneration({
      prompt: 'Create a polished ecommerce launch image.',
      aspect_ratio: '16:9',
      wmOutputQuality: '4k',
    });

    assert.deepEqual(requests, [
      {
        url: 'https://api.302.ai/ws/api/v3/google/nano-banana-2/text-to-image',
        body: {
          prompt: 'Create a polished ecommerce launch image.',
          aspect_ratio: '16:9',
          enable_base64_output: false,
          enable_sync_mode: false,
          resolution: '4k',
        },
      },
    ]);
    assert.deepEqual(result.output, {
      provider: '302',
      providerKey: '302.nano-banana-2',
      taskId: '302-nano-banana-2-task',
      providerRequest: {
        mode: 'generation',
        size: '16:9',
        requestedResolution: '4k',
        requestedOutputQuality: '4k',
        referenceImageCount: 0,
      },
    });
  } finally {
    global.fetch = originalFetch;
  }
});

test('maps Nano Banana Pro edits to 302 Wavespeed image arrays', async () => {
  process.env.AI302_API_KEY = 'test-302-key';
  const originalFetch = global.fetch;
  const requests: Array<{ url: string; body: Record<string, unknown> }> = [];

  global.fetch = (async (input, init) => {
    requests.push({
      url: String(input),
      body:
        typeof init?.body === 'string'
          ? (JSON.parse(init.body) as Record<string, unknown>)
          : {},
    });
    return {
      ok: true,
      json: async () => ({
        code: 200,
        message: 'success',
        data: { id: '302-nano-banana-pro-task', status: 'created' },
      }),
    } as Response;
  }) as typeof fetch;

  try {
    const adapter = new Ai302ImageAdapter(createEffect('302.nano-banana-pro'));
    const imageUrls = Array.from(
      { length: 15 },
      (_, index) => `https://example.com/reference-${index}.png`
    );
    const result = await adapter.createGeneration({
      prompt: 'Restyle the references into a cinematic poster.',
      aspect_ratio: '9:16',
      wmOutputQuality: '2k',
      image_urls: imageUrls,
    });

    assert.deepEqual(requests, [
      {
        url: 'https://api.302.ai/ws/api/v3/google/nano-banana-pro/edit',
        body: {
          prompt: 'Restyle the references into a cinematic poster.',
          aspect_ratio: '9:16',
          enable_base64_output: false,
          enable_sync_mode: false,
          resolution: '2k',
          images: imageUrls.slice(0, 14),
        },
      },
    ]);
    assert.deepEqual(result.output, {
      provider: '302',
      providerKey: '302.nano-banana-pro',
      taskId: '302-nano-banana-pro-task',
      providerRequest: {
        mode: 'edit',
        size: '9:16',
        requestedResolution: '2k',
        requestedOutputQuality: '2k',
        referenceImageCount: 14,
      },
    });
  } finally {
    global.fetch = originalFetch;
  }
});

test('maps legacy Nano Banana submit and status endpoints', async () => {
  process.env.AI302_API_KEY = 'test-302-key';
  const originalFetch = global.fetch;
  const requests: Array<{ url: string; body?: Record<string, unknown> }> = [];

  global.fetch = (async (input, init) => {
    const url = String(input);
    if (init?.method === 'POST') {
      requests.push({
        url,
        body:
          typeof init.body === 'string'
            ? (JSON.parse(init.body) as Record<string, unknown>)
            : {},
      });
      return {
        ok: true,
        json: async () => ({ request_id: `legacy-${requests.length}` }),
      } as Response;
    }

    return {
      ok: true,
      json: async () => ({
        id: 'legacy-1',
        status: 'succeeded',
        output: 'https://cdn.example.com/generated/legacy-nano.png',
      }),
    } as Response;
  }) as typeof fetch;

  try {
    const adapter = new Ai302ImageAdapter(createEffect('302.nano-banana'));
    const textResult = await adapter.createGeneration({
      prompt: 'Create a clean product hero image.',
      aspect_ratio: '4:3',
    });
    const status = await adapter.checkStatus('legacy-1');

    assert.deepEqual(requests, [
      {
        url: 'https://api.302.ai/302/submit/gemini-2.5-flash-image-async',
        body: {
          prompt: 'Create a clean product hero image.',
          aspect_ratio: '4:3',
        },
      },
    ]);
    assert.equal(textResult.status, 'pending');
    assert.deepEqual(status.output, {
      provider: '302',
      providerKey: '302.nano-banana',
      image_urls: ['https://cdn.example.com/generated/legacy-nano.png'],
      result_url: 'https://cdn.example.com/generated/legacy-nano.png',
      taskId: 'legacy-1',
    });
  } finally {
    global.fetch = originalFetch;
  }
});
