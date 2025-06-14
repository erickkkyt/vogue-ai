import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, userEmail } = await req.json();

    if (!priceId || !userId || !userEmail) {
      return NextResponse.json({ error: 'Missing required parameters: priceId, userId, and userEmail are required.' }, { status: 400 });
    }

    // 订阅套餐的 Stripe 价格ID列表 (PRODUCTION)
    const subscriptionPriceIds = [
      'price_1RZn4rFNBa78cTTjEJyy5TwC', // PRODUCTION - Starter Plan
      'price_1RZn4rFNBa78cTTjahUceCMh', // PRODUCTION - Pro Plan
      'price_1RZn4rFNBa78cTTj1XGO6Dz4', // PRODUCTION - Creator Plan
    ];

    // 一次性积分包的 Stripe 价格ID列表 (PRODUCTION)
    const creditPackPriceIds = [
      'price_1RZn69FNBa78cTTjYHoJ5uxB', // PRODUCTION - Small Pack ($5.9)
      'price_1RZn69FNBa78cTTjHYbouqh5', // PRODUCTION - Medium Pack ($16.9)
      'price_1RZn69FNBa78cTTjhMOa9UIR', // PRODUCTION - Large Pack ($39.9)
    ];

    const isSubscription = subscriptionPriceIds.includes(priceId);
    const isCreditPack = creditPackPriceIds.includes(priceId);

    if (!isSubscription && !isCreditPack) {
      return NextResponse.json({ error: 'Invalid price ID provided.' }, { status: 400 });
    }

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded', // 关键：指定为嵌入模式
      payment_method_types: ['card'],
      mode: isSubscription ? 'subscription' : 'payment', // 订阅套餐用 subscription，其他用 payment
      customer_email: userEmail, // 预填用户邮箱
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId, // 将 Supabase 用户 ID 存入元数据
      },
      // 支付流程完成后，Stripe 会将用户重定向到这个 URL
      // session_id 将被附加到 URL 查询参数中
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}