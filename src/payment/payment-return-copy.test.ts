import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

test('payment success copy does not claim a confirmation email is sent', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/app/payment/return/PaymentSuccessRedirectClient.tsx'),
    'utf8'
  );

  assert.doesNotMatch(source, /confirmation email has been sent/i);
  assert.doesNotMatch(source, /email has been sent/i);
});
