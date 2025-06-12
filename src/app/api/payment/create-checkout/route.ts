import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

interface CheckoutRequest {
  planType: 'starter' | 'pro' | 'creator' | 'small_pack' | 'medium_pack' | 'large_pack';
  userId: string;
}

// 产品ID和积分映射
const PRODUCT_MAPPING = {  starter: {    productId: 'prod_6V2hzzvfpKZHjbMVS4giOx',    credits: 200,    amount: 19.9  },  pro: {    productId: 'prod_QfFn8arVJqIqFXno17kHO',    credits: 550,    amount: 49.9  },  creator: {    productId: 'prod_5p2W6HFtwvbySKA7cMhl82',    credits: 1200,    amount: 99.9  },  small_pack: {    productId: 'prod_7Jkxt1uHPrQ5J9iUfgkSvh',    credits: 50,    amount: 5.9  },  medium_pack: {    productId: 'prod_4uFIYCBAyGJqXsXceRKigM',    credits: 150,    amount: 16.9  },  large_pack: {    productId: 'prod_7mh6y58x32SJBQiwKUGjD8',    credits: 400,    amount: 39.9  }};

export async function POST(request: NextRequest) {
  try {
    const { planType, userId }: CheckoutRequest = await request.json();

    // 验证用户是否已登录
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取产品配置
    const productConfig = PRODUCT_MAPPING[planType];
    if (!productConfig || !productConfig.productId) {
      return NextResponse.json({ error: 'Invalid plan type or product not configured' }, { status: 400 });
    }

    // 生成唯一的request_id用于追踪
    const requestId = `${userId}_${planType}_${Date.now()}`;

    // 创建Creem checkout session
    const checkoutResponse = await fetch(`${process.env.CREEM_API_URL}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.X_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productConfig.productId,
        request_id: requestId,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`
      })
    });

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.text();
      console.error('Creem API error:', errorData);
      return NextResponse.json({ error: 'Payment service unavailable' }, { status: 500 });
    }

    const checkoutData = await checkoutResponse.json();

    // 记录支付意图到数据库
    const { error: intentError } = await supabaseAdmin.from('payment_intents').insert({
      user_id: userId,
      request_id: requestId,
      plan_type: planType,
      amount: productConfig.amount,
      credits: productConfig.credits,
      status: 'pending'
    });

    if (intentError) {
      console.error('Error recording payment intent:', intentError);
      // 根据业务逻辑，这里可以选择是否因为意图记录失败而返回错误
      // 目前保持原样，主要依赖checkout session的创建成功
    }

    return NextResponse.json({ 
      checkout_url: checkoutData.checkout_url,
      request_id: requestId
    });

  } catch (error) {
    console.error('Payment checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 