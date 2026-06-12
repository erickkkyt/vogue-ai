import assert from 'node:assert/strict';
import test from 'node:test';

import { settleGenerationStatus } from './generation-settlement';

test('failed generation settlement releases credits and stores zero credits used', async () => {
  const calls: Array<[string, Record<string, unknown>]> = [];

  await settleGenerationStatus({
    generationId: 'generation-1',
    userId: 'user-1',
    effectName: 'GPT Image 2',
    status: 'failed',
    output: { providerTaskId: 'task-1' },
    error: 'provider failed',
    creditsUsed: 12,
    releaseCredits: async (params) => {
      calls.push(['release', params]);
    },
    confirmCredits: async (params) => {
      calls.push(['confirm', params]);
    },
    updateGeneration: async (params) => {
      calls.push(['update', params]);
      return true;
    },
  });

  assert.deepEqual(calls, [
    [
      'release',
      {
        userId: 'user-1',
        referenceId: 'generation-1',
        description: 'Released credits for failed GPT Image 2 generation',
      },
    ],
    [
      'update',
      {
        id: 'generation-1',
        status: 'failed',
        output: { providerTaskId: 'task-1' },
        error: 'provider failed',
        creditsUsed: 0,
      },
    ],
  ]);
});

test('processing generation settlement leaves reserved credits open', async () => {
  const calls: string[] = [];

  await settleGenerationStatus({
    generationId: 'generation-2',
    userId: 'user-1',
    effectName: 'GPT Image 2',
    status: 'processing',
    output: { providerTaskId: 'task-2' },
    error: null,
    creditsUsed: 12,
    releaseCredits: async () => {
      calls.push('release');
    },
    confirmCredits: async () => {
      calls.push('confirm');
    },
    updateGeneration: async (params) => {
      calls.push(`update:${params.status}:${params.creditsUsed}`);
      return true;
    },
  });

  assert.deepEqual(calls, ['update:processing:12']);
});

test('succeeded generation settlement confirms reserved credits once', async () => {
  const calls: string[] = [];

  await settleGenerationStatus({
    generationId: 'generation-3',
    userId: 'user-1',
    effectName: 'GPT Image 2',
    status: 'succeeded',
    output: { image_urls: ['https://example.com/a.png'] },
    error: null,
    creditsUsed: 12,
    releaseCredits: async () => {
      calls.push('release');
    },
    confirmCredits: async (params) => {
      calls.push(`confirm:${params.referenceId}`);
    },
    updateGeneration: async (params) => {
      calls.push(`update:${params.status}:${params.creditsUsed}`);
      return true;
    },
  });

  assert.deepEqual(calls, ['confirm:generation-3', 'update:succeeded:12']);
});
