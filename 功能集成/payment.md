# Stripe 支付集成手册 - Vogue AI 项目

> **目标**: 本文档是 Vogue AI 项目的 Stripe 支付集成指南，包含嵌入式支付表单的完整实现和 Supabase 数据库集成。

---

## 1. 开始前你需要提供的信息

在进行代码集成前，请确保你已经准备好以下信息：

1.  **Stripe API 密钥**:
    *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: (来自 Stripe 控制台) 用于前端的公开密钥。
    *   `STRIPE_SECRET_KEY`: (来自 Stripe 控制台) 用于后端的私有密钥。
    *   `STRIPE_WEBHOOK_SECRET`: (来自 Stripe CLI 或控制台的 Webhook 配置页面) 用于验证 Webhook 签名。
2.  **Stripe 产品与价格 ID**:
    *   在 Stripe 控制台的“产品”部分创建你的商品（例如，“100积分包”或“月度订阅”）。
    *   为每个商品创建一个或多个价格，并记录下这些价格的 ID (`price_...`)。
3.  **Supabase 项目信息**:
    *   `NEXT_PUBLIC_SUPABASE_URL`: 你的 Supabase 项目 URL。
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 你的 Supabase 项目公开 (anon) key。
    *   `SUPABASE_SERVICE_ROLE_KEY`: 你的 Supabase 项目 `service_role` key (用于在后端安全地操作数据库，绕过 RLS)。

---

## 2. 嵌入式表单集成方案与文件改造计划

### 阶段一：环境与配置

#### **文件**: `.env.local`

**操作**:
配置所有需要的环境变量。

```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 阶段二：后端 API 改造

#### **文件 1**: `src/lib/stripe.ts` (新建) & `src/lib/supabaseAdmin.ts` (新建)

**操作**:
创建独立的客户端初始化文件，便于管理和复用。

*   `src/lib/stripe.ts`:
    ```typescript
    import Stripe from 'stripe';
    export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-04-10',
      typescript: true,
    });
    ```
*   `src/lib/supabaseAdmin.ts`:
    ```typescript
    import { createClient } from '@supabase/supabase-js';
    export const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    ```

#### **文件 2**: `src/app/api/payment/create-checkout/route.ts` (修改)

**操作**:
修改此接口以创建用于嵌入式表单的 Checkout Session。

```typescript
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const { priceId, userId, userEmail } = await req.json();

  if (!priceId || !userId || !userEmail) {
    return new Response(JSON.stringify({ error: '缺少必要参数' }), { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    payment_method_types: ['card'],
    mode: 'payment', // 一次性支付。若是订阅，则为 'subscription'
    customer_email: userEmail, // 预填用户邮箱
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      userId: userId,
    },
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return new Response(JSON.stringify({ clientSecret: session.client_secret }), { status: 200 });
}
```

#### **文件 3**: `src/app/api/webhook/stripe/route.ts` (新建)

**操作**:
创建 Webhook 接口，处理支付成功后的数据库操作。**这是整个流程最核心和最安全的部分。**

```typescript
// 详细代码见最后的 Supabase 集成章节
// 此处仅为结构示意
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  // 1. 验证 Webhook 签名
  // 2. 判断 event.type
  // 3. 如果是 checkout.session.completed (一次性购买)
  //    a. 解析 userId 和购买的 priceId
  //    b. 根据 priceId 判断应增加多少积分
  //    c. 写入一条记录到 payments 表
  //    d. 更新 user_profiles 表中的 credits 字段
  // 4. 如果是 invoice.paid (订阅续费)
  //    a. 解析 userId 和订阅信息
  //    b. 更新 subscriptions 表的状态和当前周期
  //    c. 为用户增加对应周期的积分
  // 5. 返回 200 状态码
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

### 阶段三：前端页面改造

#### **文件 1**: `src/app/pricing/page.tsx` (修改)

**操作**:
改造为点击按钮后，在模态框中加载嵌入式支付表单。

```typescript
'use client';
import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react'; // 假设使用此hook获取用户
import CheckoutForm from '@/components/CheckoutForm';

export default function PricingPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const user = useUser();

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // 提示用户登录
      return;
    }

    const res = await fetch('/api/payment/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId: user.id, userEmail: user.email }),
    });
    const data = await res.json();
    setClientSecret(data.clientSecret);
  };

  return (
    <div>
      {/* ... pricing cards with onClick={() => handleCheckout(plan.priceId)} ... */}
      {clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl relative w-full max-w-lg">
            <button onClick={() => setClientSecret(null)} className="absolute top-2 right-2 text-2xl">&times;</button>
            <CheckoutForm clientSecret={clientSecret} />
          </div>
        </div>
      )}
    </div>
  );
}
```

#### **文件 2**: `src/components/CheckoutForm.tsx` (新建)

**操作**:
承载 Stripe 嵌入式表单的核心组件。

```typescript
'use client';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps { clientSecret: string; }

export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout className="w-full" />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
```

#### **文件 3**: `src/app/payment/return/page.tsx` (新建)

**操作**:
创建支付完成后的返回页面，仅用于向用户展示状态。

```typescript
import { stripe } from '@/lib/stripe';

export default async function ReturnPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id;
  if (!sessionId) {
    return <div className="p-8 text-center text-red-500">无效的 Session ID</div>;
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return (
    <div className="p-8 text-center">
      {session.status === 'complete' ? (
        <h1 className="text-2xl font-bold text-green-500">支付成功！</h1>
        <p className="mt-4">感谢您的购买！相关权益已发放至您的账户，请查收。</p>
      ) : (
        <h1 className="text-2xl font-bold text-yellow-500">支付处理中或未完成</h1>
        <p className="mt-4">如果已支付，请稍后刷新您的账户查看。如有问题，请联系客服。</p>
      )}
    </div>
  );
}
```

---

## 3. 本地开发与测试指南

端到端的支付流程，尤其是 Webhook，必须在本地进行充分测试。

1.  **安装 Stripe CLI**:
    *   根据你的操作系统，从 [Stripe 官方文档](https://stripe.com/docs/stripe-cli) 下载并安装 CLI。

2.  **登录 Stripe 账户**:
    ```bash
    stripe login
    ```
    *   此命令会打开浏览器，要求你授权 CLI 访问你的 Stripe 账户。

3.  **启动本地开发服务器**:
    *   在项目根目录正常启动你的 Next.js 应用。
    ```bash
    npm run dev
    ```

4.  **监听并转发 Webhook 事件**:
    *   打开 **一个新的终端窗口**，运行以下命令：
    ```bash
    stripe listen --forward-to http://localhost:3000/api/webhook/stripe
    ```
    *   **重要**: `localhost:3000` 是你本地服务器的地址，`/api/webhook/stripe` 是你创建的 Webhook 接口路径。
    *   命令成功运行后，它会打印出一个 **Webhook 签名密钥** (`whsec_...`)。**将这个密钥复制到你的 `.env.local` 文件的 `STRIPE_WEBHOOK_SECRET` 变量中**，并**重启你的 Next.js 应用**使其生效。

5.  **触发支付**:
    *   现在，在你的网站上正常点击“购买”按钮，使用 Stripe 提供的测试卡号（如 `4242 4242 4242 4242`）完成支付。
    *   支付完成后，你将在运行 `stripe listen` 的终端窗口中看到 Stripe 发送的 `checkout.session.completed` 等事件，这些事件被转发到了你本地的 Webhook 接口。
    *   同时，你可以在运行 Next.js 应用的终端窗口中查看 Webhook 接口打印的日志，确认逻辑是否被正确执行。

---

## 4. Supabase 数据库集成方案

在 `src/app/api/webhook/stripe/route.ts` 中实现与 Supabase 的交互。

```typescript
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// 一个映射，将Stripe的Price ID映射到你的产品信息（如积分数量）
const productToCredits: { [key: string]: number } = {
  'price_..._100credits': 100,
  'price_..._500credits': 550, // 假设买500送50
  'price_..._monthly_sub': 1000, // 月度订阅每月给1000
};

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret!);
  } catch (err: any) {
    console.error(`❌ Webhook 签名验证失败: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as any;
  const userId = session.metadata?.userId;

  if (!userId) {
    return new Response('Webhook Error: Missing userId in metadata', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        // 扩展 line_items 来获取 price.id
        const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id);
        const priceId = lineItems.data[0].price?.id;

        if (!priceId) break;

        // 1. 在 `payments` 表中创建一条支付记录
        const { error: paymentError } = await supabaseAdmin.from('payments').insert({
          user_id: userId,
          stripe_checkout_id: checkoutSession.id,
          amount: checkoutSession.amount_total,
          currency: checkoutSession.currency,
          status: 'completed',
        });
        if (paymentError) throw new Error(`Supabase payments insert error: ${paymentError.message}`);

        // 2. 更新 `user_profiles` 表，增加积分
        const creditsToAdd = productToCredits[priceId] || 0;
        const { error: rpcError } = await supabaseAdmin.rpc('increment_credits', {
          user_id_param: userId,
          increment_amount: creditsToAdd,
        });
        if (rpcError) throw new Error(`Supabase RPC increment_credits error: ${rpcError.message}`);

        // 如果是订阅模式的首次支付，还需要在 subscriptions 表创建记录
        if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            if (typeof subscriptionId === 'string') {
              const subscription = await stripe.subscriptions.retrieve(subscriptionId);
              const { error: subError } = await supabaseAdmin.from('subscriptions').insert({
                user_id: userId,
                stripe_subscription_id: subscription.id,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
                price_id: subscription.items.data[0].price.id,
              });
              if (subError) throw new Error(`Supabase subscriptions insert error: ${subError.message}`);
            }
        }
        break;
      }
      case 'invoice.paid': {
        // 用于处理订阅续费
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription;
        if (typeof subscriptionId === 'string') {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
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
            const { error: rpcError } = await supabaseAdmin.rpc('increment_credits', {
              user_id_param: userId,
              increment_amount: creditsToAdd,
            });
            if (rpcError) throw new Error(`Supabase RPC increment_credits error: ${rpcError.message}`);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // 处理订阅状态变更（如取消）
        const subscription = event.data.object as Stripe.Subscription;
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: subscription.status })
          .eq('stripe_subscription_id', subscription.id);
        if (error) throw new Error(`Supabase subscriptions status update error: ${error.message}`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error('Webhook handler failed:', error.message);
    return new Response(`Webhook handler failed: ${error.message}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

**辅助数据库函数**:
建议在 Supabase 中创建一个名为 `increment_credits` 的 PostgreSQL 函数，以原子方式更新积分，避免竞态条件。

```sql
-- 在 Supabase SQL Editor 中运行
create or replace function increment_credits(user_id_param uuid, increment_amount integer)
returns void
language plpgsql
as $$
begin
  update public.user_profiles
  set credits = credits + increment_amount
  where user_id = user_id_param;
end;
$$;
```
