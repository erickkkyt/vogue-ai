import { findVoguePriceByStripePriceId } from '@/config/pricing';
import { withDbRequestContext } from '@/db';
import { createStripeCheckout } from '@/payment/stripe';
import { getSession } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return withDbRequestContext(() => postCreateCheckout(request));
}

async function postCreateCheckout(request: Request) {
  const session = await getSession();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    priceId?: string;
    callbackPath?: string;
  } | null;
  const priceId = payload?.priceId;
  if (!priceId) {
    return NextResponse.json({ error: 'priceId is required' }, { status: 400 });
  }

  const price = findVoguePriceByStripePriceId(priceId);
  if (!price) {
    return NextResponse.json({ error: 'Unknown priceId' }, { status: 400 });
  }

  try {
    const checkout = await createStripeCheckout({
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      price,
      callbackPath: payload?.callbackPath,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error('create checkout failed:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
