import assert from 'node:assert/strict';
import test from 'node:test';

import { getGenerationPromptMaxChars } from './validation';

test('limits Z-Image prompts to the provider documented 1000 characters', () => {
  assert.equal(getGenerationPromptMaxChars({ modelId: 'zimage' }), 1000);
  assert.equal(
    getGenerationPromptMaxChars({ provider: 'kie.z-image' }),
    1000
  );
});
