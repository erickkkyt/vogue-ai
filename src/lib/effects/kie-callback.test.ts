import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveKieCallbackUrl } from './kie-callback';

test('uses explicit KIE callback url when configured', () => {
  const previousCallbackUrl = process.env.KIE_CALLBACK_URL;
  process.env.KIE_CALLBACK_URL = 'https://vogueai.net/api/effects/callback';

  try {
    assert.equal(
      resolveKieCallbackUrl(),
      'https://vogueai.net/api/effects/callback'
    );
  } finally {
    process.env.KIE_CALLBACK_URL = previousCallbackUrl;
  }
});

test('falls back to NEXT_PUBLIC_BASE_URL callback path', () => {
  const previousCallbackUrl = process.env.KIE_CALLBACK_URL;
  const previousBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  process.env.KIE_CALLBACK_URL = '';
  process.env.NEXT_PUBLIC_BASE_URL = 'https://vogueai.net/';

  try {
    assert.equal(
      resolveKieCallbackUrl(),
      'https://vogueai.net/api/effects/callback'
    );
  } finally {
    process.env.KIE_CALLBACK_URL = previousCallbackUrl;
    process.env.NEXT_PUBLIC_BASE_URL = previousBaseUrl;
  }
});
