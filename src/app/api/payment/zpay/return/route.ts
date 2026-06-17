import { withDbRequestContext } from '@/db';
import { handleZpayReturn } from '@/payment/zpay';
import { type NextRequest, NextResponse } from 'next/server';

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  return withDbRequestContext(() => getZpayReturn(request));
}

async function getZpayReturn(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const { outTradeNo } = await handleZpayReturn(searchParams);
  const redirectUrl = new URL('/payment/return', getBaseUrl());

  redirectUrl.searchParams.set('provider', 'zpay');
  if (outTradeNo) {
    redirectUrl.searchParams.set('order_id', outTradeNo);
  }

  return NextResponse.redirect(redirectUrl);
}
