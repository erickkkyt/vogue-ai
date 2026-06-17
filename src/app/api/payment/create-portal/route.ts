import { withDbRequestContext } from '@/db';
import { getSession } from '@/lib/server';
import { createStripeBillingPortal } from '@/payment/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return withDbRequestContext(() => postCreatePortal(request));
}

async function postCreatePortal(request: Request) {
  const session = await getSession();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    returnPath?: string;
  } | null;

  try {
    const portal = await createStripeBillingPortal({
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      returnPath: payload?.returnPath,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error('create billing portal failed:', error);
    return NextResponse.json(
      { error: 'Failed to open billing management' },
      { status: 500 }
    );
  }
}
