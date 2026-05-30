import assert from 'node:assert/strict';
import test from 'node:test';

import {
  STANDARD_RESULT_REVEAL_DELAY_MS,
  applyResultRevealGate,
  isResultRevealVisible,
} from './result-reveal-gate';

const assertRecord = (value: unknown) => {
  assert.ok(value && typeof value === 'object');
  return value as Record<string, unknown>;
};

test('returns faster succeeded output immediately', () => {
  const gate = applyResultRevealGate({
    accessTier: 'faster',
    status: 'succeeded',
    output: { image_urls: ['https://example.com/a.png'] },
    now: new Date('2026-05-30T00:00:00Z'),
  });

  assert.equal(gate.responseStatus, 'succeeded');
  assert.deepEqual(assertRecord(gate.outputForResponse).image_urls, [
    'https://example.com/a.png',
  ]);
});

test('keeps non-succeeded null output unchanged', () => {
  const gate = applyResultRevealGate({
    accessTier: 'standard',
    status: 'failed',
    output: null,
    now: new Date('2026-05-30T00:00:00Z'),
  });

  assert.equal(gate.responseStatus, 'failed');
  assert.equal(gate.outputForResponse, null);
  assert.equal(gate.outputForStore, null);
});

test('holds standard succeeded output without exposing media urls', () => {
  const now = new Date('2026-05-30T00:00:00Z');
  const gate = applyResultRevealGate({
    accessTier: 'standard',
    status: 'succeeded',
    output: {
      image_urls: ['https://example.com/a.png'],
      result_url: 'https://example.com/a.png',
    },
    now,
  });

  assert.equal(gate.responseStatus, 'processing');
  const responseOutput = assertRecord(gate.outputForResponse);
  const storeOutput = assertRecord(gate.outputForStore);
  assert.equal('image_urls' in responseOutput, false);
  assert.equal('result_url' in responseOutput, false);
  assert.equal(
    storeOutput.resultRevealReadyAt,
    new Date(now.getTime() + STANDARD_RESULT_REVEAL_DELAY_MS).toISOString()
  );
});

test('reveals standard output after ready time', () => {
  const output = {
    image_urls: ['https://example.com/a.png'],
    resultRevealReadyAt: '2026-05-30T00:00:10.000Z',
  };
  const gate = applyResultRevealGate({
    accessTier: 'standard',
    status: 'succeeded',
    output,
    now: new Date('2026-05-30T00:00:11Z'),
  });

  assert.equal(gate.responseStatus, 'succeeded');
  assert.deepEqual(assertRecord(gate.outputForResponse).image_urls, [
    'https://example.com/a.png',
  ]);
  assert.equal(
    isResultRevealVisible({
      status: 'succeeded',
      output,
      now: new Date('2026-05-30T00:00:09Z'),
    }),
    false
  );
});
