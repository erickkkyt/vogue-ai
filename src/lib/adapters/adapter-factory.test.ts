import assert from 'node:assert/strict';
import test from 'node:test';

import type { EffectRecord } from '@/lib/effects/effects';
import { Ai302ImageAdapter } from './ai302-image-adapter';
import { createAdapter } from './adapter-factory';
import { EvolinkImageAdapter } from './evolink-image-adapter';
import { KieMarketAdapter } from './kie-market-adapter';

const createEffect = (provider: string): EffectRecord =>
  ({
    id: 999,
    name: 'Test Effect',
    type: 2,
    model: 'test-model',
    version: '1',
    credit: 1,
    linkName: 'test-model',
    prePrompt: null,
    description: 'Test effect',
    platform: 'test',
    api: 'https://example.com',
    isOpen: 1,
    createdAt: null,
    provider,
    inputSchema: null,
    pricingSchema: null,
  }) as EffectRecord;

test('routes Nano Banana Evolink fallback providers to the Evolink image adapter', () => {
  for (const provider of [
    'evolink.nano-banana-2',
    'evolink.nano-banana',
    'evolink.nano-banana-pro',
  ]) {
    const adapter = createAdapter(createEffect(provider));
    assert.ok(adapter instanceof EvolinkImageAdapter);
  }
});

test('routes Nano Banana 302 fallback providers to the 302 image adapter', () => {
  for (const provider of [
    '302.nano-banana-2',
    '302.nano-banana',
    '302.nano-banana-pro',
  ]) {
    const adapter = createAdapter(createEffect(provider));
    assert.ok(adapter instanceof Ai302ImageAdapter);
  }
});

test('keeps KIE image providers on the KIE market adapter', () => {
  for (const provider of [
    'kie.gpt-image-2',
    'kie.z-image',
    'kie.nano-banana-2',
    'kie.nano-banana',
    'kie.nano-banana-pro',
  ]) {
    const adapter = createAdapter(createEffect(provider));
    assert.ok(adapter instanceof KieMarketAdapter);
  }
});
