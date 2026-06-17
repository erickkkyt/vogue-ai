import { withDbRequestContext } from '@/db';
import { getStripe, handleStripeEvent } from '@/payment/stripe';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(request: Request) {
  return withDbRequestContext(() => postStripeWebhook(request));
}

async function postStripeWebhook(request: Request) {
  const body = Buffer.from(await request.arrayBuffer());
  const signature = (await headers()).get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response('Stripe webhook is not configured', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook';
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    await handleStripeEvent(event);
  } catch (error) {
    console.error('stripe webhook handling failed:', error);
    return new Response('Webhook handler failed', { status: 500 });
  }

  return Response.json({ received: true });
}
