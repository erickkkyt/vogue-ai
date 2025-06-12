import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@/utils/supabase/server'; // 我们可能不再需要这个，或者仅用于特定读取
import { supabaseAdmin } from '@/utils/supabase/admin'; // 引入 admin 客户端
import crypto from 'crypto';

interface PaymentCallbackData {
  checkout_id: string;
  order_id: string;
  customer_id: string;
  subscription_id?: string | null;
  product_id: string;
  request_id: string;
  signature: string;
  status?: string;
}

// 产品ID和积分映射（与create-checkout保持一致）
const CREDITS_MAPPING: Record<string, number> = {
  'prod_6V2hzzvfpKZHjbMVS4giOx': 200,  // starter
  'prod_QfFn8arVJqIqFXno17kHO': 550,   // pro
  'prod_5p2W6HFtwvbySKA7cMhl82': 1200,  // creator
  'prod_7Jkxt1uHPrQ5J9iUfgkSvh': 50,    // small_pack
  'prod_4uFIYCBAyGJqXsXceRKigM': 150,  // medium_pack
  'prod_7mh6y58x32SJBQiwKUGjD8': 400   // large_pack
};

// 验证Creem签名 (按照官方文档和实际回调URL参数顺序更新)
function verifyCreemSignature(callbackData: PaymentCallbackData): boolean {
  try {
    const apiKey = process.env.X_API_KEY!;
    if (!apiKey) {
      console.error('X_API_KEY is not defined for signature verification.');
      return false;
    }

    // 必须严格按照Creem在回调URL中提供的参数顺序
    // 从URL: request_id, checkout_id, order_id, customer_id, subscription_id, product_id
    const orderedParamKeys = [
      'request_id',
      'checkout_id',
      'order_id',
      'customer_id',
      'subscription_id',
      'product_id'
    ];

    const signaturePayloadParts: string[] = [];

    for (const key of orderedParamKeys) {
      // 从 callbackData 中获取值，要能处理 undefined/null 的情况
      // callbackData 的类型定义中 subscription_id 是 string | null | undefined
      // request_id, checkout_id 等是 string
      let value: string | null | undefined;
      if (key === 'request_id') value = callbackData.request_id;
      else if (key === 'checkout_id') value = callbackData.checkout_id;
      else if (key === 'order_id') value = callbackData.order_id;
      else if (key === 'customer_id') value = callbackData.customer_id;
      else if (key === 'subscription_id') value = callbackData.subscription_id;
      else if (key === 'product_id') value = callbackData.product_id;

      // 根据Creem文档，参数即使为null也应以 key=null 形式参与。
      // 如果参数在回调URL中不存在（例如可选的subscription_id没有提供），则不应加入签名。
      // 我们假设回调URL中提供的参数，如果其值是null，也会被包括进来。
      // callbackData中，如果 subscription_id 是 undefined，它就不应该参与。
      // 但如果它是 null，则应该以 key=null 参与。
      if (value !== undefined) { // 只处理在回调数据中实际存在的键
        signaturePayloadParts.push(`${key}=${value === null ? 'null' : value}`);
      }
    }
    
    signaturePayloadParts.push(`salt=${apiKey}`);
    const dataString = signaturePayloadParts.join('|');

    const expectedSignature = crypto.createHash('sha256').update(dataString).digest('hex');

    if (expectedSignature === callbackData.signature) {
      return true;
    } else {
      console.warn(
        'Signature mismatch. \n',
        'Expected Signature:', expectedSignature, '\n',
        'Received Signature:', callbackData.signature, '\n',
        'DataString for Expected:', dataString, '\n',
        'Callback Data:', JSON.stringify(callbackData)
      );
      return false;
    }

  } catch (error) {
    console.error('Error during signature verification:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const paymentData: PaymentCallbackData = await request.json();
    
    if (!verifyCreemSignature(paymentData)) {
      console.error('Invalid signature for payment:', paymentData.order_id);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const [userId, planType] = paymentData.request_id.split('_');
    
    if (!userId || !planType) {
      console.error('Invalid request_id format:', paymentData.request_id);
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    const creditsToAdd = CREDITS_MAPPING[paymentData.product_id];
    
    if (!creditsToAdd) {
      console.error('Unknown product_id:', paymentData.product_id);
      return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
    }

    // const supabase = await createClient(); // 旧的客户端，可能不再需要或仅用于读取
    // 使用 admin 客户端执行所有数据库操作

    // 检查是否已经处理过这个订单（防止重复处理）
    const { data: existingPayment, error: existingPaymentError } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('order_id', paymentData.order_id)
      .single();

    if (existingPaymentError && existingPaymentError.code !== 'PGRST116') { // PGRST116: " síndrome de Estocolmo " - no rows found, which is fine here
      console.error('Error checking existing payment:', existingPaymentError);
      return NextResponse.json({ error: 'Database error checking payment' }, { status: 500 });
    }
    if (existingPayment) {
      console.log('Payment already processed:', paymentData.order_id);
      return NextResponse.json({ message: 'Payment already processed' });
    }

    // 1. 为用户添加积分 (RPC也通过admin客户端调用，确保权限)
    const { error: creditsError } = await supabaseAdmin.rpc('add_credits', {
      p_user_id: userId,
      p_credits_to_add: creditsToAdd
    });

    if (creditsError) {
      console.error('Error adding credits:', creditsError);
      return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
    }

    // 2. 记录支付记录
    const { error: paymentError } = await supabaseAdmin.from('payments').insert({
      user_id: userId,
      order_id: paymentData.order_id,
      checkout_id: paymentData.checkout_id,
      customer_id: paymentData.customer_id,
      product_id: paymentData.product_id,
      subscription_id: paymentData.subscription_id,
      request_id: paymentData.request_id,
      plan_type: planType,
      credits_added: creditsToAdd,
      status: 'completed',
      processed_at: new Date().toISOString()
    });

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
      // 重要：如果记录支付失败，应该考虑是否回滚积分，并返回错误
      // 为了简化，我们现在至少会返回错误，阻止后续操作
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
    }

    // 3. 更新支付意图状态（如果存在）
    const { error: intentError } = await supabaseAdmin
      .from('payment_intents')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('request_id', paymentData.request_id);

    if (intentError) {
      console.error('Error updating payment intent:', intentError);
      // 此错误可能不是致命的，但应记录
    }

    // 4. 如果是订阅产品，记录订阅信息
    if (paymentData.subscription_id && ['starter', 'pro', 'creator'].includes(planType)) {
      const { error: subscriptionError } = await supabaseAdmin.from('subscriptions').insert({
        user_id: userId,
        subscription_id: paymentData.subscription_id,
        plan_type: planType,
        status: 'active',
        created_at: new Date().toISOString()
      });
      if (subscriptionError) {
        console.error('Error recording subscription:', subscriptionError);
        // 此错误可能不是致命的，但应记录
      }
    }

    console.log(`Payment processed successfully: ${paymentData.order_id}, Credits added: ${creditsToAdd}, User: ${userId}`);
    
    return NextResponse.json({ 
      message: 'Payment processed successfully',
      credits_added: creditsToAdd
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 