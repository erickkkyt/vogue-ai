import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// 一个映射，将Stripe的Price ID映射到你的产品信息（如积分数量）
// PRODUCTION MODE - 所有价格ID都是正式版本
const productToCredits: { [key: string]: number } = {
  // 订阅套餐 (PRODUCTION)
  'price_1RZn4rFNBa78cTTjEJyy5TwC': 200,   // Starter Plan - $19.9/month
  'price_1RZn4rFNBa78cTTjahUceCMh': 550,   // Pro Plan - $49.9/month
  'price_1RZn4rFNBa78cTTj1XGO6Dz4': 1200,  // Creator Plan - $99.9/month

  // 一次性积分包 (PRODUCTION)
  'price_1RZn69FNBa78cTTjYHoJ5uxB': 50,    // Small Pack - $5.9
  'price_1RZn69FNBa78cTTjHYbouqh5': 150,   // Medium Pack - $16.9
  'price_1RZn69FNBa78cTTjhMOa9UIR': 400,   // Large Pack - $39.9
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (!sig || !webhookSecret) {
      console.error('❌ Webhook secret or signature not provided.');
      return new Response('Webhook secret not configured', { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Webhook signature verification failed: ${errorMessage}`);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  console.log(`🔍 Webhook event type: ${event.type}`);
  console.log(`🔍 Event data object:`, JSON.stringify(event.data.object, null, 2));

  // 根据事件类型获取userId
  let userId: string | undefined;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    userId = session.metadata?.userId;
    console.log(`🔍 Checkout session metadata:`, session.metadata);
  } else if (event.type === 'invoice.paid') {
    // 对于invoice事件，我们暂时跳过userId验证，在具体处理中获取
    userId = 'invoice_event'; // 临时标记，实际处理中会重新获取
    console.log(`🔍 Invoice event detected, will get userId from subscription`);
  } else {
    const session = event.data.object as any;
    userId = session.metadata?.userId;
  }

  console.log(`🔍 Extracted userId: ${userId}`);

  // 对于某些事件类型，我们在具体处理中获取userId
  if (!userId && event.type !== 'invoice.paid') {
    console.error('❌ Webhook error: Missing userId in metadata');
    console.error('❌ Event data:', JSON.stringify(event.data.object, null, 2));
    return new Response('Webhook Error: Missing userId in metadata', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        console.log(`🔍 Processing checkout session: ${checkoutSession.id}`);
        console.log(`🔍 Session mode: ${checkoutSession.mode}`);
        console.log(`🔍 Session status: ${checkoutSession.status}`);

        const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id);
        const priceId = lineItems.data[0].price?.id;

        console.log(`🔍 Line items:`, lineItems.data);
        console.log(`🔍 Price ID: ${priceId}`);

        if (!priceId) {
            console.error('❌ Webhook error: Missing priceId in lineItems');
            console.error('❌ Line items data:', lineItems.data);
            break;
        }

        console.log(`🔍 Credits to add: ${productToCredits[priceId] || 0}`);

        // 1. 在 `payments` 表中创建一条支付记录
        console.log(`🔍 Creating payment record for user: ${userId}`);
        const { error: paymentError } = await supabaseAdmin.from('payments').insert({
          user_id: userId,
          stripe_checkout_id: checkoutSession.id,
          stripe_customer_id: checkoutSession.customer as string,
          amount: (checkoutSession.amount_total || 0) / 100, // 转换为美元
          currency: checkoutSession.currency || 'usd',
          credits_added: productToCredits[priceId] || 0,
          status: 'completed',
        });
        if (paymentError) {
          console.error('❌ Payment record creation failed:', paymentError);
          throw new Error(`Supabase payments insert error: ${paymentError.message}`);
        }
        console.log(`✅ Payment record created successfully`);

        // 2. 更新 `user_profiles` 表，增加积分
        const creditsToAdd = productToCredits[priceId] || 0;
        console.log(`🔍 Adding ${creditsToAdd} credits to user ${userId}`);

        if (creditsToAdd > 0) {
            const { error: rpcError } = await supabaseAdmin.rpc('add_credits', {
              p_user_id: userId,
              p_credits_to_add: creditsToAdd,
            });
            if (rpcError) {
              console.error('❌ Credits addition failed:', rpcError);
              throw new Error(`Supabase RPC add_credits error: ${rpcError.message}`);
            }
            console.log(`✅ Successfully added ${creditsToAdd} credits to user ${userId}`);
        } else {
            console.log(`⚠️ No credits to add for priceId: ${priceId}`);
        }

        // 3. 如果是订阅模式的首次支付，在 subscriptions 表创建记录
        if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            if (typeof subscriptionId === 'string') {
              const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
              const { error: subError } = await supabaseAdmin.from('subscriptions').insert({
                user_id: userId,
                stripe_subscription_id: subscription.id,
                stripe_customer_id: subscription.customer as string,
                stripe_price_id: subscription.items.data[0].price.id,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
              });
              if (subError) throw new Error(`Supabase subscriptions insert error: ${subError.message}`);
            }
        }
        console.log(`✅ checkout.session.completed handled for user: ${userId}`);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription;

        if (typeof subscriptionId === 'string') {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
            const subUserId = subscription.metadata?.userId;

            if (!subUserId) {
              console.error('❌ No userId found in subscription metadata');
              break;
            }

            const priceId = subscription.items.data[0].price.id;

            // 更新 subscriptions 表
            const { error: subError } = await supabaseAdmin
              .from('subscriptions')
              .update({
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
              })
              .eq('stripe_subscription_id', subscription.id);
            if (subError) throw new Error(`Supabase subscriptions update error: ${subError.message}`);

            // 为用户增加积分
            const creditsToAdd = productToCredits[priceId] || 0;
            if (creditsToAdd > 0) {
                const { error: rpcError } = await supabaseAdmin.rpc('add_credits', {
                  p_user_id: subUserId,
                  p_credits_to_add: creditsToAdd,
                });
                if (rpcError) throw new Error(`Supabase RPC add_credits error: ${rpcError.message}`);
            }
            console.log(`✅ invoice.paid handled for subscription: ${subscriptionId}`);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: subscription.status })
          .eq('stripe_subscription_id', subscription.id);
        if (error) throw new Error(`Supabase subscriptions status update error: ${error.message}`);
        console.log(`✅ customer.subscription updated/deleted handled for: ${subscription.id}`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook handler failed:', errorMessage);
    return new Response(`Webhook handler failed: ${errorMessage}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
} 