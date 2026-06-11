import assert from 'node:assert/strict';
import test from 'node:test';

import { KieMarketAdapter } from './kie-market-adapter';

const effect = {
  id: 16,
  name: 'GPT Image 2',
  type: 2,
  model: 'gpt-image-2',
  version: '2',
  credit: 8,
  linkName: 'gpt-image-2',
  prePrompt: null,
  description: null,
  platform: 'kie',
  api: 'jobs/createTask',
  isOpen: 1,
  provider: 'kie.gpt-image-2',
  inputSchema: null,
  pricingSchema: null,
  createdAt: new Date(),
};

const zImageEffect = {
  ...effect,
  id: 17,
  name: 'Z-Image',
  model: 'z-image',
  version: '1',
  credit: 1,
  linkName: 'z-image',
  description: 'Z-Image text-to-image generation.',
  provider: 'kie.z-image',
};

test('KIE createTask request includes callback url when provided', async () => {
  const previousApiKey = process.env.KIE_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.KIE_API_KEY = 'test-kie-key';
  let requestBody: Record<string, unknown> | null = null;

  globalThis.fetch = async (_input, init) => {
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(
      JSON.stringify({ code: 200, msg: 'ok', data: { taskId: 'task_1' } }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }
    );
  };

  try {
    const adapter = new KieMarketAdapter(effect as never);
    const result = await adapter.createGeneration({
      prompt: 'a couture portrait',
      callBackUrl: 'https://vogueai.net/api/effects/callback',
    });

    assert.equal(result.status, 'processing');
    const capturedBody = (requestBody ?? {}) as Record<string, unknown>;
    assert.equal(
      capturedBody.callBackUrl,
      'https://vogueai.net/api/effects/callback'
    );
  } finally {
    process.env.KIE_API_KEY = previousApiKey;
    globalThis.fetch = previousFetch;
  }
});

test('KIE Z-Image createTask uses the documented payload shape', async () => {
  const previousApiKey = process.env.KIE_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.KIE_API_KEY = 'test-kie-key';
  let requestBody: Record<string, unknown> | null = null;

  globalThis.fetch = async (_input, init) => {
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(
      JSON.stringify({ code: 200, msg: 'ok', data: { taskId: 'task_z_1' } }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }
    );
  };

  try {
    const adapter = new KieMarketAdapter(zImageEffect as never);
    const result = await adapter.createGeneration({
      prompt: 'a fast fashion editorial portrait',
      aspect_ratio: '9:16',
      n: 4,
      wmOutputQuality: '4k',
      quality: 'high',
      callBackUrl: 'https://vogueai.net/api/effects/callback',
    });

    assert.equal(result.status, 'processing');
    const capturedBody = (requestBody ?? {}) as Record<string, unknown>;
    const input = capturedBody.input as Record<string, unknown>;
    assert.equal(capturedBody.model, 'z-image');
    assert.equal(
      capturedBody.callBackUrl,
      'https://vogueai.net/api/effects/callback'
    );
    assert.equal(input.prompt, 'a fast fashion editorial portrait');
    assert.equal(input.aspect_ratio, '9:16');
    assert.equal(input.nsfw_checker, true);
    assert.equal('n' in input, false);
    assert.equal('resolution' in input, false);
    assert.equal('output_format' in input, false);
    assert.equal('image_input' in input, false);
  } finally {
    process.env.KIE_API_KEY = previousApiKey;
    globalThis.fetch = previousFetch;
  }
});
