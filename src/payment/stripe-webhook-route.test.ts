import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('Stripe webhook is served only from the confirmed singular endpoint', () => {
  const singularRoute = join(root, 'src/app/api/webhook/stripe/route.ts');
  const pluralRoute = join(root, 'src/app/api/webhooks/stripe/route.ts');

  assert.equal(existsSync(singularRoute), true);
  assert.equal(existsSync(pluralRoute), false);

  const source = readFileSync(singularRoute, 'utf8');
  assert.match(source, /constructEvent/);
  assert.match(source, /handleStripeEvent/);
  assert.doesNotMatch(source, /webhooks\/stripe/);
});
