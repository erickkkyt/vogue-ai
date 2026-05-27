# Vogue AI 积分与支付实现

> **当前项目状态**: 本文记录 Vogue AI 当前 Stripe 套餐、ZPAY 积分包、注册赠送、生成扣费和退款逻辑。真实价格配置以 `src/config/pricing.ts` 和支付环境变量为准。

## 当前项目状态

### 1. 当前支付架构

当前支付链路：

```text
/pricing
-> subscription: /api/payment/create-checkout -> Stripe Checkout
-> credit pack:
   -> Stripe: /api/payment/create-checkout -> Stripe Checkout
   -> Alipay/WeChat Pay: /api/payment/create-zpay-checkout -> ZPAY submit.php
-> return:
   -> Stripe: /payment/return
   -> ZPAY: /api/payment/zpay/return -> /payment/return?provider=zpay
-> webhook:
   -> Stripe: /api/webhook/stripe
   -> ZPAY: /api/webhooks/zpay
-> payment
-> user_credit / credit_transaction
```

核心文件：

- `src/config/pricing.ts`
- `src/payment/stripe.ts`
- `src/payment/zpay.ts`
- `src/app/api/payment/create-checkout/route.ts`
- `src/app/api/payment/create-zpay-checkout/route.ts`
- `src/app/api/webhook/stripe/route.ts`
- `src/app/api/webhooks/zpay/route.ts`
- `src/app/api/payment/zpay/return/route.ts`
- `src/credits/credits.ts`
- `src/credits/types.ts`

### 2. 当前 Stripe 价格配置

#### 订阅

| plan | Monthly env | Yearly env | credits |
| --- | --- | --- | ---: |
| Basic Plan | `NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY` | `NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY` | 300/month |
| Pro Plan | `NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY` | `NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY` | 1200/month |
| Creator Plan | `NEXT_PUBLIC_STRIPE_PRICE_CREATOR_MONTHLY` | `NEXT_PUBLIC_STRIPE_PRICE_CREATOR_YEARLY` | 4000/month |
| Elite Plan | `NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY` | `NEXT_PUBLIC_STRIPE_PRICE_ELITE_YEARLY` | 12000/month |

月付在每次 Stripe 月度 `invoice.paid` 后发放当月积分；年付在年度 `invoice.paid` 后一次性发放全年积分。

#### 积分包

| pack | Stripe price id | ZPAY CNY env | credits |
| --- | --- | --- | ---: |
| Starter Credits | `NEXT_PUBLIC_STRIPE_PRICE_CREDITS_STARTER` | `ZPAY_PRICE_CNY_CREDITS_STARTER` | 100 |
| Growth Credits | `NEXT_PUBLIC_STRIPE_PRICE_CREDITS_GROWTH` | `ZPAY_PRICE_CNY_CREDITS_GROWTH` | 450 |
| Professional Credits | `NEXT_PUBLIC_STRIPE_PRICE_CREDITS_PROFESSIONAL` | `ZPAY_PRICE_CNY_CREDITS_PROFESSIONAL` | 1200 |

ZPAY 当前只接一次性积分包，不接订阅。人民币价格后续补齐时直接写入对应 CNY 环境变量；Stripe price id 走 `NEXT_PUBLIC_STRIPE_PRICE_CREDITS_*`。

### 3. Checkout 创建

接口：

- `POST /api/payment/create-checkout`
- `POST /api/payment/create-zpay-checkout`

当前逻辑：

- 必须登录。
- 根据传入 price id 查 `VOGUE_PRICES`。
- 如果 user 没有 `customer_id`，创建 Stripe customer 并写回 `user.customer_id`。
- 根据 price kind 创建 subscription 或 one-time payment checkout。
- success URL: `/payment/return?session_id={CHECKOUT_SESSION_ID}`。
- cancel URL: 回到传入 callback path。

ZPAY 逻辑：

- 必须登录。
- 根据传入 package id 查 credit pack。
- 读取 `ZPAY_PID`、`ZPAY_KEY`、`ZPAY_GATEWAY_URL` 和对应 CNY 价格环境变量。
- 在 `payment` 表先创建 `processing` 记录，`session_id` 使用 ZPAY `out_trade_no`。
- 生成兼容易支付的 `submit.php` 跳转 URL，支付方式为 `alipay` 或 `wxpay`。
- `notify_url` 固定为 `/api/webhooks/zpay`，`return_url` 固定为 `/api/payment/zpay/return`，因为 ZPAY 文档要求回调地址不带 query 参数。

### 4. Webhook 入账

接口：

- `POST /api/webhook/stripe`
- `GET /api/webhooks/zpay`

当前处理事件：

- `checkout.session.completed`
- `invoice.paid`

`checkout.session.completed`：

- 写入 payment。
- 如果是 credit pack 且 paid，调用 `addCredits` 发放 purchase 积分。

`invoice.paid`：

- 写入 payment。
- 根据 Stripe price id 找到 subscription plan。
- 调用 `addCredits` 发放 subscription 积分：月付发当月积分，年付发 12 倍全年积分。
- 更新 `user.subscription_state` 为对应 price id。
- 订阅记录 `period_start / period_end / cancel_at_period_end`，用于账期与状态追踪。

幂等策略：

- payment 表 `session_id`、`invoice_id` 唯一。
- credit transaction 用 `type + reference_type + reference_id` 防重复。
- ZPAY 使用 `reference_type=zpay_order` 和 ZPAY `out_trade_no` 防重复；回调会校验签名、PID、支付方式、金额，并再次查询 ZPAY 订单状态后才发放积分。

### 5. 注册赠送积分

入口：

- `src/lib/auth.ts`
- `src/credits/credits.ts`

当前逻辑：

- BetterAuth database hook 在 user create 后调用 `addRegisterGiftCredits`。
- 固定赠送 10 credits。
- reference 使用 `register + userId`，防止重复发放。

### 6. 生成扣费

入口：

- `src/app/api/effects/generate/route.ts`
- `src/lib/effects/pricing.ts`
- `src/credits/credits.ts`

当前流程：

1. 读取 `effect.credit`。
2. 根据 `n`、`quality`、`wmOutputQuality` 估算 required credits。
3. 检查 `user_credit.current_credits`。
4. 插入 `generation_history`。
5. `reserveCredits` 立刻扣余额并写 `reserve`。
6. provider 任务创建成功后 `confirmReservedCredits` 把 `reserve` 改成 `consume`。
7. provider 创建失败时 `releaseReservedCredits` 恢复余额。
8. status 同步发现失败时也会释放已扣积分。

### 7. 退款/释放逻辑

`releaseReservedCredits` 当前会：

- 查找同一 generation reference 下的 `reserve` 或 `consume`。
- 把该交易改为 `released`。
- 给用户余额加回绝对值。
- 插入一条 `refund` 正数交易。

这让 provider 提交成功后再失败的任务也能回退积分。

### 8. 当前待补齐

- Stripe Billing Portal。
- 订阅取消、恢复、降级、升级 UI。
- `customer.subscription.updated/deleted` webhook。
- 失败订单和退款 webhook。
- 后台手工加减积分入口。
- 支付成功页展示本次获得积分。
- `/pricing` 与登录态、当前 plan、余额的完整展示。
