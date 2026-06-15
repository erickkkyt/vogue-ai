import assert from 'node:assert/strict';
import test from 'node:test';

import {
  shouldWatermarkAnonymousOutput,
  shouldWatermarkGenerationOutput,
} from './watermark-access';

test('requires watermarks for anonymous output', () => {
  assert.equal(shouldWatermarkAnonymousOutput(), true);
});

test('requires watermarks for unpaid logged-in output', () => {
  assert.equal(
    shouldWatermarkGenerationOutput({ hasPaidEntitlement: false }),
    true
  );
});

test('does not watermark paid logged-in output', () => {
  assert.equal(
    shouldWatermarkGenerationOutput({ hasPaidEntitlement: true }),
    false
  );
});
