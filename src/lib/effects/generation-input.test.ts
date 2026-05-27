import assert from 'node:assert/strict';
import test from 'node:test';

import { buildProviderGenerationInput } from './generation-input';

test('uses the server callback url and ignores client callback input', () => {
  const input = buildProviderGenerationInput({
    rawInput: {
      prompt: '  couture editorial portrait  ',
      callBackUrl: 'https://attacker.example/callback',
      callbackUrl: 'https://attacker.example/lowercase',
      aspect_ratio: '1:1',
    },
    prompt: 'couture editorial portrait',
    callbackUrl: 'https://vogueai.net/api/effects/callback',
  });

  assert.deepEqual(input, {
    prompt: 'couture editorial portrait',
    aspect_ratio: '1:1',
    callBackUrl: 'https://vogueai.net/api/effects/callback',
  });
});

test('omits callback url when no server callback is configured', () => {
  const input = buildProviderGenerationInput({
    rawInput: {
      prompt: 'editorial look',
      image_url: 'https://cdn.example.com/reference.png',
    },
    prompt: 'editorial look',
    callbackUrl: '',
  });

  assert.deepEqual(input, {
    prompt: 'editorial look',
    image_url: 'https://cdn.example.com/reference.png',
  });
});
