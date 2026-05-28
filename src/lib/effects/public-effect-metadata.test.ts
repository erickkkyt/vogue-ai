import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPublicEffectsMetadata } from './public-effect-metadata';

test('does not expose legacy effect credit in public metadata', () => {
  const effectWithLegacyCredit = {
    id: 16,
    provider: 'kie.gpt-image-2',
    credit: 10,
    inputSchema: null,
    pricingSchema: {
      strategy: 'matrix',
      rules: [{ when: { quality: 'low' }, credits: 4 }],
    },
    isOpen: 1,
  };

  const metadata = buildPublicEffectsMetadata([
    effectWithLegacyCredit,
  ]);

  assert.deepEqual(Object.keys(metadata['16']).sort(), [
    'id',
    'inputSchema',
    'pricingSchema',
    'provider',
  ]);
  assert.equal('credit' in metadata['16'], false);
});
