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
