import { type VoguePrice } from '@/config/pricing';
import { getDb } from '@/db';
import { user } from '@/db/schema';
import { resolveSafeCallbackPath } from '@/lib/auth/callback-url';
import { eq } from 'drizzle-orm';
import { PaymentScenes } from './types';

const STRIPE_API_BASE_URL = 'https://api.stripe.com/v1';

type StripeCustomerResponse = {
  id?: string;
  error?: {
    message?: string;
  };
};

type StripeCheckoutSessionResponse = {
  id?: string;
  url?: string | null;
  error?: {
    message?: string;
  };
};

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

function getStripeSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required');
  }

  return secretKey;
}

function appendStripeParam(
  params: URLSearchParams,
  key: string,
  value: string | number | boolean | null | undefined
) {
  if (value === null || value === undefined || value === '') {
    return;
  }

  params.append(key, String(value));
}

function getCheckoutMetadata({
  userId,
  price,
}: {
  userId: string;
  price: VoguePrice;
}) {
  const metadata: Record<string, string> = {
    userId,
    priceId: price.priceId,
    planId: price.id,
    credits: String(price.credits),
    scene:
      price.kind === 'subscription'
        ? PaymentScenes.SUBSCRIPTION
        : PaymentScenes.CREDIT,
  };

  if (price.kind === 'credit') {
    metadata.type = 'credit_purchase';
    metadata.packageId = price.id;
  } else {
    metadata.type = 'subscription';
    metadata.interval = price.interval;
  }

  return metadata;
}

async function postStripeForm<T>(
  path: string,
  params: URLSearchParams
): Promise<T> {
  const response = await fetch(`${STRIPE_API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const data = (await response.json().catch(() => null)) as
    | (T & { error?: { message?: string } })
    | null;

  if (!response.ok) {
    throw new Error(data?.error?.message || `Stripe API failed: ${response.status}`);
  }

  if (!data) {
    throw new Error('Stripe API returned an empty response');
  }

  return data;
}

async function createStripeCustomer({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name?: string | null;
}) {
  const params = new URLSearchParams();
  appendStripeParam(params, 'email', email);
  appendStripeParam(params, 'name', name);
  appendStripeParam(params, 'metadata[userId]', userId);
  const customer = await postStripeForm<StripeCustomerResponse>(
    '/customers',
    params
  );

  if (!customer.id) {
    throw new Error('Stripe customer did not return an id');
  }

  return customer.id;
}

async function getOrCreateStripeCustomer({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name?: string | null;
}) {
  const db = await getDb();
  const rows = await db
    .select({ customerId: user.customerId })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (rows[0]?.customerId) {
    return rows[0].customerId;
  }

  const customerId = await createStripeCustomer({ userId, email, name });

  await db
    .update(user)
    .set({ customerId, updatedAt: new Date() })
    .where(eq(user.id, userId));

  return customerId;
}

export async function createStripeCheckout({
  userId,
  email,
  name,
  price,
  callbackPath = '/app',
}: {
  userId: string;
  email: string;
  name?: string | null;
  price: VoguePrice;
  callbackPath?: string;
}) {
  const customer = await getOrCreateStripeCustomer({ userId, email, name });
  const baseUrl = getBaseUrl();
  const successUrl = `${baseUrl}/payment/return?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}${resolveSafeCallbackPath(callbackPath)}`;
  const metadata = getCheckoutMetadata({ userId, price });
  const params = new URLSearchParams();

  appendStripeParam(params, 'customer', customer);
  appendStripeParam(
    params,
    'mode',
    price.kind === 'subscription' ? 'subscription' : 'payment'
  );
  appendStripeParam(params, 'line_items[0][price]', price.priceId);
  appendStripeParam(params, 'line_items[0][quantity]', 1);
  appendStripeParam(params, 'success_url', successUrl);
  appendStripeParam(params, 'cancel_url', cancelUrl);

  for (const [key, value] of Object.entries(metadata)) {
    appendStripeParam(params, `metadata[${key}]`, value);
    if (price.kind === 'subscription') {
      appendStripeParam(params, `subscription_data[metadata][${key}]`, value);
    }
  }

  const session = await postStripeForm<StripeCheckoutSessionResponse>(
    '/checkout/sessions',
    params
  );

  if (!session.url) {
    throw new Error('Stripe checkout session did not return a URL');
  }

  return { id: session.id, url: session.url };
}
