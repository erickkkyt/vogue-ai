import { handleZpayNotification } from '@/payment/zpay';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;

  try {
    await handleZpayNotification(searchParams);
    return new Response('success', { status: 200 });
  } catch (error) {
    console.error('zpay webhook handling failed:', error);
    return new Response('fail', { status: 400 });
  }
}
