import {
  type ZpayPaymentMethod,
  createZpayCreditCheckout,
} from '@/payment/zpay';
import { getSession } from '@/lib/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    packageId?: string;
    paymentMethod?: ZpayPaymentMethod;
  } | null;

  if (!payload?.packageId) {
    return NextResponse.json(
      { error: 'packageId is required' },
      { status: 400 }
    );
  }
  if (
    payload.paymentMethod !== 'alipay' &&
    payload.paymentMethod !== 'wxpay'
  ) {
    return NextResponse.json(
      { error: 'paymentMethod must be alipay or wxpay' },
      { status: 400 }
    );
  }

  try {
    const checkout = await createZpayCreditCheckout({
      packageId: payload.packageId,
      paymentMethod: payload.paymentMethod,
      userId: session.user.id,
    });

    return NextResponse.json({ url: checkout.url, id: checkout.id });
  } catch (error) {
    console.error('create zpay checkout failed:', error);
    return NextResponse.json(
      { error: 'Failed to create ZPAY checkout session' },
      { status: 500 }
    );
  }
}
