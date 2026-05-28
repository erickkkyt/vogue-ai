import assert from 'node:assert/strict';
import test from 'node:test';

import type { GenerationResult } from '@/lib/adapters/base-adapter';
import type { EffectRecord } from './effects';
import {
  continueGptImage2GenerationAfterProviderFailure,
  createGptImage2GenerationWithFallback,
} from './gpt-image-2-provider-chain';

const effect = {
  id: 16,
  name: 'GPT Image 2',
  type: 2,
  model: 'gpt-image-2',
  version: '2',
  credit: 10,
  linkName: 'gpt-image-2',
  prePrompt: null,
  description: 'GPT Image 2',
  platform: 'kie',
  api: 'jobs/createTask',
  isOpen: 1,
  provider: 'kie.gpt-image-2',
  inputSchema: null,
  pricingSchema: null,
  createdAt: new Date('2026-05-28T00:00:00.000Z'),
} satisfies EffectRecord;

const providerResult = (
  provider: string,
  status: GenerationResult['status'],
  taskId?: string
): GenerationResult => ({
  status,
  output: taskId ? { providerTaskId: taskId, provider } : { provider },
  error: status === 'failed' ? `${provider} failed` : undefined,
});

test('starts GPT Image 2 low 1k generations on Evolink before KIE', async () => {
  const calls: string[] = [];

  const fallback = await createGptImage2GenerationWithFallback({
    effect,
    input: { quality: 'low', wmOutputQuality: '1k' },
    createAdapterForEffect: (nextEffect) => ({
      createGeneration: async () => {
        calls.push(nextEffect.provider);
        return nextEffect.provider === 'evolink.gpt-image-2'
          ? providerResult(nextEffect.provider, 'processing', 'evolink-task')
          : providerResult(nextEffect.provider, 'failed');
      },
    }),
  });

  assert.deepEqual(calls, ['evolink.gpt-image-2']);
  assert.equal(fallback.selectedProvider, 'evolink.gpt-image-2');
  assert.deepEqual(
    (fallback.result.output as Record<string, unknown>).providerChain,
    ['evolink.gpt-image-2', 'kie.gpt-image-2', '302.gpt-image-2']
  );
});

test('continues GPT Image 2 fallback from the provider after the failed selected provider', async () => {
  const calls: string[] = [];

  const fallback = await continueGptImage2GenerationAfterProviderFailure({
    effect,
    input: { quality: 'medium', wmOutputQuality: '2k' },
    previousOutput: {
      selectedProvider: 'kie.gpt-image-2',
      providerTaskId: 'kie-task',
      providerChain: [
        'kie.gpt-image-2',
        'evolink.gpt-image-2',
        '302.gpt-image-2',
      ],
      providerAttempts: [
        {
          attempt: 1,
          provider: 'kie.gpt-image-2',
          status: 'processing',
          accepted: true,
          providerTaskId: 'kie-task',
          error: null,
        },
      ],
    },
    failedProviderTaskId: 'kie-task',
    providerError: 'KIE reported failure',
    createAdapterForEffect: (nextEffect) => ({
      createGeneration: async () => {
        calls.push(nextEffect.provider);
        return nextEffect.provider === 'evolink.gpt-image-2'
          ? providerResult(nextEffect.provider, 'processing', 'evolink-task')
          : providerResult(nextEffect.provider, 'failed');
      },
    }),
  });

  assert.deepEqual(calls, ['evolink.gpt-image-2']);
  assert.equal(fallback?.selectedProvider, 'evolink.gpt-image-2');
  assert.deepEqual(
    (fallback?.result.output as Record<string, unknown>).providerChain,
    ['kie.gpt-image-2', 'evolink.gpt-image-2', '302.gpt-image-2']
  );
  assert.deepEqual(
    ((fallback?.result.output as Record<string, unknown>)
      .providerAttempts as Array<Record<string, unknown>>).map((attempt) => ({
      provider: attempt.provider,
      status: attempt.status,
      accepted: attempt.accepted,
      error: attempt.error,
    })),
    [
      {
        provider: 'kie.gpt-image-2',
        status: 'failed',
        accepted: false,
        error: 'KIE reported failure',
      },
      {
        provider: 'evolink.gpt-image-2',
        status: 'processing',
        accepted: true,
        error: null,
      },
    ]
  );
});
