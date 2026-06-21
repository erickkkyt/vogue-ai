import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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
  assert.match(stripeSource, /Stripe\.createFetchHttpClient\(\)/);
  assert.match(webhookRoute, /getStripe\(\)\.webhooks\.constructEvent/);
  assert.match(returnPage, /getStripe\(\)\.checkout\.sessions\.retrieve/);
});

test('Stripe checkout creation stays off the heavy Stripe SDK path for Workers', () => {
  const routeSource = read('src/app/api/payment/create-checkout/route.ts');
  const checkoutPath = 'src/payment/stripe-checkout.ts';
  const checkoutAbsolutePath = join(root, checkoutPath);

  assert.equal(
    existsSync(checkoutAbsolutePath),
    true,
    'checkout route should use a lightweight Stripe checkout module'
  );
  if (!existsSync(checkoutAbsolutePath)) return;

  const checkoutSource = read(checkoutPath);

  assert.match(routeSource, /@\/payment\/stripe-checkout/);
  assert.doesNotMatch(routeSource, /@\/payment\/stripe['"]/);
  assert.doesNotMatch(checkoutSource, /from ['"]stripe['"]/);
  assert.doesNotMatch(checkoutSource, /new Stripe/);
  assert.doesNotMatch(checkoutSource, /getStripe\(\)/);
  assert.match(checkoutSource, /fetch\(/);
});
