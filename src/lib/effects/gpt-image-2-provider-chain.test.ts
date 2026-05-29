import assert from 'node:assert/strict';
import test from 'node:test';

import type { GenerationResult } from '@/lib/adapters/base-adapter';
import type { EffectRecord } from './effects';
import {
  NANO_BANANA_2_PROVIDER_CHAIN,
  NANO_BANANA_PROVIDER_CHAIN,
  NANO_BANANA_PRO_PROVIDER_CHAIN,
  continueGptImage2GenerationAfterProviderFailure,
  continueImageGenerationAfterProviderFailure,
  createAdapterForStoredImageGeneration,
  createGptImage2GenerationWithFallback,
  createImageGenerationWithFallback,
  isImageProviderFallbackEffect,
  resolveStoredImageProvider,
} from './gpt-image-2-provider-chain';

const createEffect = (overrides: Partial<EffectRecord> = {}): EffectRecord =>
  ({
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
    ...overrides,
  }) satisfies EffectRecord;

const effect = createEffect();

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

test('identifies all four core image models for provider fallback', () => {
  assert.equal(isImageProviderFallbackEffect(createEffect()), true);
  assert.equal(
    isImageProviderFallbackEffect(
      createEffect({ model: 'nano-banana-2', provider: 'kie.nano-banana-2' })
    ),
    true
  );
  assert.equal(
    isImageProviderFallbackEffect(
      createEffect({ model: 'google/nano-banana', provider: 'kie.nano-banana' })
    ),
    true
  );
  assert.equal(
    isImageProviderFallbackEffect(
      createEffect({ model: 'nano-banana-pro', provider: 'kie.nano-banana-pro' })
    ),
    true
  );
  assert.equal(
    isImageProviderFallbackEffect(
      createEffect({ model: 'gpt-image-1.5', provider: 'kie.gpt-image-1.5' })
    ),
    false
  );
});

test('keeps Nano Banana fallback provider order explicit', () => {
  assert.deepEqual(Array.from(NANO_BANANA_2_PROVIDER_CHAIN), [
    'evolink.nano-banana-2',
    'kie.nano-banana-2',
    '302.nano-banana-2',
  ]);
  assert.deepEqual(Array.from(NANO_BANANA_PROVIDER_CHAIN), [
    'evolink.nano-banana',
    'kie.nano-banana',
    '302.nano-banana',
  ]);
  assert.deepEqual(Array.from(NANO_BANANA_PRO_PROVIDER_CHAIN), [
    'evolink.nano-banana-pro',
    'kie.nano-banana-pro',
    '302.nano-banana-pro',
  ]);
});

test('starts Nano Banana generations on Evolink before KIE and 302', async () => {
  const calls: string[] = [];

  const fallback = await createImageGenerationWithFallback({
    effect: createEffect({
      id: 4,
      name: 'Nano Banana 2',
      model: 'nano-banana-2',
      provider: 'kie.nano-banana-2',
      linkName: 'nano-banana-2',
    }),
    input: { prompt: 'A polished product hero image', wmOutputQuality: '1k' },
    createAdapterForEffect: (nextEffect) => ({
      createGeneration: async () => {
        calls.push(nextEffect.provider);
        return providerResult(
          nextEffect.provider,
          'processing',
          `${nextEffect.provider}-task`
        );
      },
    }),
  });

  assert.deepEqual(calls, ['evolink.nano-banana-2']);
  assert.equal(fallback.selectedProvider, 'evolink.nano-banana-2');
  assert.deepEqual(
    (fallback.result.output as Record<string, unknown>).providerChain,
    ['evolink.nano-banana-2', 'kie.nano-banana-2', '302.nano-banana-2']
  );
});

test('does not fallback across providers for content safety failures', async () => {
  const calls: string[] = [];

  const fallback = await createImageGenerationWithFallback({
    effect: createEffect({
      id: 6,
      name: 'Nano Banana Pro',
      model: 'nano-banana-pro',
      provider: 'kie.nano-banana-pro',
      linkName: 'nano-banana-pro',
    }),
    input: { prompt: 'A blocked edit request', wmOutputQuality: '2k' },
    createAdapterForEffect: (nextEffect) => ({
      createGeneration: async () => {
        calls.push(nextEffect.provider);
        return {
          status: 'failed',
          error:
            'The text content failed the review. Please check your input.',
        };
      },
    }),
  });

  assert.deepEqual(calls, ['evolink.nano-banana-pro']);
  assert.equal(fallback.selectedProvider, null);
  assert.equal(fallback.result.status, 'failed');
  assert.match(fallback.result.error ?? '', /failed the review/);
});

test('uses stored selected Nano provider for follow-up status checks', () => {
  const selectedProviders: string[] = [];

  createAdapterForStoredImageGeneration({
    effect: createEffect({
      id: 5,
      name: 'Nano Banana',
      model: 'google/nano-banana',
      provider: 'kie.nano-banana',
      linkName: 'nano-banana',
    }),
    output: { selectedProvider: '302.nano-banana' },
    createAdapterForEffect: (nextEffect) => {
      selectedProviders.push(nextEffect.provider);
      return {
        createGeneration: async () => ({ status: 'failed' }),
      };
    },
  });

  assert.deepEqual(selectedProviders, ['302.nano-banana']);
});

test('resolves stored selected Nano provider and falls back to effect provider when invalid', () => {
  const nanoEffect = createEffect({
    id: 4,
    name: 'Nano Banana 2',
    model: 'nano-banana-2',
    provider: 'kie.nano-banana-2',
    linkName: 'nano-banana-2',
  });

  assert.equal(
    resolveStoredImageProvider({
      effect: nanoEffect,
      output: { selectedProvider: 'evolink.nano-banana-2' },
    }),
    'evolink.nano-banana-2'
  );
  assert.equal(
    resolveStoredImageProvider({
      effect: nanoEffect,
      output: { selectedProvider: 'unexpected.provider' },
    }),
    'kie.nano-banana-2'
  );
  assert.equal(
    resolveStoredImageProvider({
      effect: nanoEffect,
      output: { selectedProvider: '302.nano-banana' },
    }),
    'kie.nano-banana-2'
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

test('continues Nano fallback from an accepted KIE task to 302 after later failure', async () => {
  const calls: string[] = [];

  const fallback = await continueImageGenerationAfterProviderFailure({
    effect: createEffect({
      id: 4,
      name: 'Nano Banana 2',
      model: 'nano-banana-2',
      provider: 'kie.nano-banana-2',
      linkName: 'nano-banana-2',
    }),
    input: { prompt: 'A polished product hero image', wmOutputQuality: '1k' },
    previousOutput: {
      selectedProvider: 'kie.nano-banana-2',
      providerTaskId: 'kie-nano-task',
      providerChain: [
        'evolink.nano-banana-2',
        'kie.nano-banana-2',
        '302.nano-banana-2',
      ],
      providerAttempts: [
        {
          attempt: 1,
          provider: 'evolink.nano-banana-2',
          status: 'failed',
          accepted: false,
          providerTaskId: null,
          error: 'Evolink unavailable',
        },
        {
          attempt: 2,
          provider: 'kie.nano-banana-2',
          status: 'processing',
          accepted: true,
          providerTaskId: 'kie-nano-task',
          error: null,
        },
      ],
    },
    failedProviderTaskId: 'kie-nano-task',
    providerError: 'KIE reported failure',
    createAdapterForEffect: (nextEffect) => ({
      createGeneration: async () => {
        calls.push(nextEffect.provider);
        return providerResult(nextEffect.provider, 'processing', '302-nano-task');
      },
    }),
  });

  assert.deepEqual(calls, ['302.nano-banana-2']);
  assert.equal(fallback?.selectedProvider, '302.nano-banana-2');
});

test('stops Nano fallback after later content safety failure', async () => {
  const calls: string[] = [];

  const fallback = await continueImageGenerationAfterProviderFailure({
    effect: createEffect({
      id: 4,
      name: 'Nano Banana 2',
      model: 'nano-banana-2',
      provider: 'kie.nano-banana-2',
      linkName: 'nano-banana-2',
    }),
    input: { prompt: 'A blocked edit request', wmOutputQuality: '1k' },
    previousOutput: {
      selectedProvider: 'kie.nano-banana-2',
      providerTaskId: 'kie-nano-task',
      providerChain: [
        'evolink.nano-banana-2',
        'kie.nano-banana-2',
        '302.nano-banana-2',
      ],
    },
    failedProviderTaskId: 'kie-nano-task',
    providerError:
      'No images found in AI response. The image was filtered out because it violated policy.',
    createAdapterForEffect: (nextEffect) => ({
      createGeneration: async () => {
        calls.push(nextEffect.provider);
        return providerResult(nextEffect.provider, 'processing', 'unexpected');
      },
    }),
  });

  assert.deepEqual(calls, []);
  assert.equal(fallback?.selectedProvider, null);
  assert.equal(fallback?.result.status, 'failed');
});
