import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('Stripe client is initialized lazily instead of during module import', () => {
  const stripeSource = read('src/payment/stripe.ts');
  const webhookRoute = read('src/app/api/webhook/stripe/route.ts');
  const returnPage = read('src/app/payment/return/page.tsx');

  assert.match(stripeSource, /let stripeClient: Stripe \| null = null/);
  assert.match(stripeSource, /export function getStripe/);
  assert.doesNotMatch(stripeSource, /export const stripe = new Stripe/);
  assert.doesNotMatch(stripeSource, /new Stripe\(process\.env\.STRIPE_SECRET_KEY \|\| ''\)/);
  assert.match(webhookRoute, /getStripe\(\)\.webhooks\.constructEvent/);
  assert.match(returnPage, /getStripe\(\)\.checkout\.sessions\.retrieve/);
});
