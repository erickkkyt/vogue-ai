import { randomUUID } from 'crypto';
import { addCredits } from '@/credits/credits';
import { CREDIT_TRANSACTION_TYPE } from '@/credits/types';
import { getDb } from '@/db';
import { payment, user } from '@/db/schema';
import {
  type VoguePrice,
  findVoguePriceByStripePriceId,
  getVogueCreditGrantAmount,
} from '@/config/pricing';
import { resolveSafeCallbackPath } from '@/lib/auth/callback-url';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { fulfillStripePayment } from './stripe-fulfillment';
import { PaymentScenes, PaymentTypes } from './types';

let stripeClient: Stripe | null = null;

type StripeSubscriptionLike = {
  id?: string | null;
  status?: string | null;
  customer?: unknown;
  metadata?: Record<string, string | undefined> | null;
  cancel_at_period_end?: boolean | null;
  current_period_end?: number | null;
  items?: {
    data?: Array<{
      price?: {
        id?: string | null;
      } | null;
    }>;
  } | null;
};

type SubscriptionPaymentState = {
  subscriptionId: string;
  userId: string;
  status: string;
  paid: boolean;
  cancelAtPeriodEnd: boolean;
  periodEnd: Date | null;
};

type UserSubscriptionState = {
  userId: string;
  subscriptionState: string;
};

type StripeEventDependencies = {
  retrieveSubscription?: (
    subscriptionId: string
  ) => Promise<StripeSubscriptionLike>;
  updateSubscriptionPaymentState?: (
    params: SubscriptionPaymentState
  ) => Promise<void>;
  updateUserSubscriptionState?: (
    params: UserSubscriptionState
  ) => Promise<void>;
};

type StripeBillingPortalDependencies = {
  getCustomerIdForUser?: (userId: string) => Promise<string | null>;
  createCustomerForUser?: (params: {
    userId: string;
    email: string;
    name?: string | null;
  }) => Promise<string>;
  saveCustomerIdForUser?: (params: {
    userId: string;
    customerId: string;
  }) => Promise<void>;
  createPortalSession?: (params: {
    customer: string;
    return_url: string;
  }) => Promise<{ url?: string | null }>;
};

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required');
  }

  stripeClient ??= new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  return stripeClient;
}

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing']);

const getSubscriptionPeriodEnd = (subscription: StripeSubscriptionLike) =>
  typeof subscription.current_period_end === 'number'
    ? new Date(subscription.current_period_end * 1000)
    : null;

const getSubscriptionPriceId = (subscription: StripeSubscriptionLike) =>
  subscription.items?.data?.[0]?.price?.id ?? null;

const getSubscriptionUserId = (subscription: StripeSubscriptionLike) =>
  subscription.metadata?.userId?.trim() || null;

const isPaidSubscriptionStatus = (status: string) =>
  ACTIVE_SUBSCRIPTION_STATUSES.has(status.trim().toLowerCase());

async function getOrCreateCustomer({
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

  const customer = await getStripe().customers.create({
    email,
    name: name || undefined,
    metadata: { userId },
  });

  await db
    .update(user)
    .set({ customerId: customer.id, updatedAt: new Date() })
    .where(eq(user.id, userId));

  return customer.id;
}

async function getStoredStripeCustomerId(userId: string) {
  const db = await getDb();
  const rows = await db
    .select({ customerId: user.customerId })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return rows[0]?.customerId ?? null;
}

async function defaultUpdateSubscriptionPaymentState({
  subscriptionId,
  status,
  paid,
  cancelAtPeriodEnd,
  periodEnd,
}: SubscriptionPaymentState) {
  const db = await getDb();

  await db
    .update(payment)
    .set({
      status,
      paid,
      cancelAtPeriodEnd,
      periodEnd,
      updatedAt: new Date(),
    })
    .where(eq(payment.subscriptionId, subscriptionId));
}

async function defaultUpdateUserSubscriptionState({
  userId,
  subscriptionState,
}: UserSubscriptionState) {
  const db = await getDb();

  await db
    .update(user)
    .set({ subscriptionState, updatedAt: new Date() })
    .where(eq(user.id, userId));
}

async function syncStripeSubscriptionLifecycle(
  subscription: StripeSubscriptionLike,
  deps: StripeEventDependencies = {}
) {
  const subscriptionId = subscription.id?.trim();
  const status = subscription.status?.trim() || 'unknown';
  const userId = getSubscriptionUserId(subscription);
  if (!subscriptionId || !userId) return;

  const paid = isPaidSubscriptionStatus(status);
  const priceId = getSubscriptionPriceId(subscription);
  const price = priceId ? findVoguePriceByStripePriceId(priceId) : null;
  const subscriptionState =
    paid && price?.kind === 'subscription' ? price.id : 'free';

  await (
    deps.updateSubscriptionPaymentState ??
    defaultUpdateSubscriptionPaymentState
  )({
    subscriptionId,
    userId,
    status,
    paid,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    periodEnd: getSubscriptionPeriodEnd(subscription),
  });
  await (
    deps.updateUserSubscriptionState ?? defaultUpdateUserSubscriptionState
  )({
    userId,
    subscriptionState,
  });
}

export async function createStripeBillingPortal(
  {
    userId,
    email,
    name,
    returnPath = '/billings',
  }: {
    userId: string;
    email: string;
    name?: string | null;
    returnPath?: string;
  },
  deps: StripeBillingPortalDependencies = {}
) {
  let customerId =
    (await deps.getCustomerIdForUser?.(userId)) ??
    (deps.getCustomerIdForUser ? null : await getStoredStripeCustomerId(userId));

  if (!customerId) {
    customerId = deps.createCustomerForUser
      ? await deps.createCustomerForUser({ userId, email, name })
      : await getOrCreateCustomer({ userId, email, name });

    await deps.saveCustomerIdForUser?.({ userId, customerId });
  }

  const returnUrl = `${getBaseUrl()}${resolveSafeCallbackPath(
    returnPath,
    '/billings'
  )}`;
  const portalSession = deps.createPortalSession
    ? await deps.createPortalSession({
        customer: customerId,
        return_url: returnUrl,
      })
    : await getStripe().billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

  if (!portalSession.url) {
    throw new Error('Stripe billing portal did not return a URL');
  }

  return { url: portalSession.url };
}

async function ensurePaymentRecord({
  userId,
  customerId,
  price,
  status,
  paid,
  sessionId,
  invoiceId,
  subscriptionId,
  periodStart,
  periodEnd,
  cancelAtPeriodEnd,
}: {
  userId: string;
  customerId: string;
  price: VoguePrice;
  status: string;
  paid: boolean;
  sessionId?: string | null;
  invoiceId?: string | null;
  subscriptionId?: string | null;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean | null;
}): Promise<{ inserted: boolean }> {
  const db = await getDb();
  const rows = await db
    .insert(payment)
    .values({
      id: randomUUID(),
      priceId: price.priceId,
      type: PaymentTypes.STRIPE,
      scene:
        price.kind === 'subscription'
          ? PaymentScenes.SUBSCRIPTION
          : PaymentScenes.CREDIT,
      interval: price.interval,
      userId,
      customerId,
      subscriptionId,
      sessionId,
      invoiceId,
      status,
      paid,
      periodStart,
      periodEnd,
      cancelAtPeriodEnd,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoNothing()
    .returning({ id: payment.id });

  if (rows.length > 0) {
    return { inserted: true };
  }

  const updateValues = {
    status,
    paid,
    subscriptionId,
    periodStart,
    periodEnd,
    cancelAtPeriodEnd,
    updatedAt: new Date(),
  };

  if (sessionId) {
    await db
      .update(payment)
      .set(updateValues)
      .where(eq(payment.sessionId, sessionId));
  } else if (invoiceId) {
    await db
      .update(payment)
      .set(updateValues)
      .where(eq(payment.invoiceId, invoiceId));
  }

  return { inserted: false };
}

async function getCheckoutPrice(sessionId: string) {
  const lineItems = await getStripe().checkout.sessions.listLineItems(sessionId, {
    limit: 1,
  });
  const priceId = lineItems.data[0]?.price?.id;
  return priceId ? findVoguePriceByStripePriceId(priceId) : null;
}

function getInvoiceBillingPeriod(invoice: Stripe.Invoice) {
  const period = invoice.lines.data[0]?.period;
  return {
    periodStart: period?.start ? new Date(period.start * 1000) : null,
    periodEnd: period?.end ? new Date(period.end * 1000) : null,
  };
}

export async function handleStripeEvent(
  event: Stripe.Event,
  deps: StripeEventDependencies = {}
) {
  if (event.type === 'checkout.session.completed') {
    const checkout = event.data.object as Stripe.Checkout.Session;
    if (!checkout.id) return;

    const price = await getCheckoutPrice(checkout.id);
    const userId = checkout.metadata?.userId;
    const customerId =
      typeof checkout.customer === 'string' ? checkout.customer : null;

    if (!price || !userId || !customerId) return;

    await fulfillStripePayment({
      paid: checkout.payment_status === 'paid',
      creditAmount: price.kind === 'credit' ? price.credits : 0,
      ensurePaymentRecord: () =>
        ensurePaymentRecord({
          userId,
          customerId,
          price,
          status: checkout.status || 'completed',
          paid: checkout.payment_status === 'paid',
          sessionId: checkout.id,
          subscriptionId:
            typeof checkout.subscription === 'string'
              ? checkout.subscription
              : null,
        }),
      grantCredits: () =>
        addCredits({
          userId,
          amount: price.credits,
          type: CREDIT_TRANSACTION_TYPE.PURCHASE,
          description: `${price.name} credits`,
          priceId: price.priceId,
          referenceType: 'session',
          referenceId: checkout.id,
        }),
    });
    return;
  }

  if (
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    await syncStripeSubscriptionLifecycle(
      event.data.object as StripeSubscriptionLike,
      deps
    );
    return;
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId =
      typeof (invoice as Stripe.Invoice & { subscription?: unknown })
        .subscription === 'string'
        ? ((invoice as Stripe.Invoice & { subscription: string })
            .subscription as string)
        : null;
    if (!subscriptionId) return;

    const subscription = await (deps.retrieveSubscription ??
      ((id: string) => getStripe().subscriptions.retrieve(id)))(subscriptionId);
    await syncStripeSubscriptionLifecycle(subscription, deps);
    return;
  }

  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    const invoiceId = invoice.id;
    if (!invoiceId) return;

    const subscriptionId =
      typeof (invoice as Stripe.Invoice & { subscription?: unknown })
        .subscription === 'string'
        ? ((invoice as Stripe.Invoice & { subscription: string })
            .subscription as string)
        : null;
    if (!subscriptionId) return;

    const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata.userId;
    const priceId = subscription.items.data[0]?.price.id;
    const price = priceId ? findVoguePriceByStripePriceId(priceId) : null;
    const customerId =
      typeof subscription.customer === 'string' ? subscription.customer : null;

    if (!userId || !price || !customerId) return;
    const { periodStart, periodEnd } = getInvoiceBillingPeriod(invoice);

    await fulfillStripePayment({
      paid: true,
      creditAmount: getVogueCreditGrantAmount(price),
      ensurePaymentRecord: () =>
        ensurePaymentRecord({
          userId,
          customerId,
          price,
          status: subscription.status,
          paid: true,
          invoiceId,
          subscriptionId,
          periodStart,
          periodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        }),
      grantCredits: () =>
        addCredits({
          userId,
          amount: getVogueCreditGrantAmount(price),
          type: CREDIT_TRANSACTION_TYPE.SUBSCRIPTION,
          description:
            price.interval === 'year'
              ? `${price.name} annual credits`
              : `${price.name} monthly credits`,
          priceId: price.priceId,
          subscriptionId,
          referenceType: 'invoice',
          referenceId: invoiceId,
        }),
    });

    const db = await getDb();
    await db
      .update(user)
      .set({ subscriptionState: price.id, updatedAt: new Date() })
      .where(eq(user.id, userId));
  }
}
