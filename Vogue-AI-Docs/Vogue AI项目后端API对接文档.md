# Vogue AI 项目后端 API 对接文档

> **当前项目状态**: 本文记录 Vogue AI 当前后端接口、认证、支付、生成 API 和 provider adapter 的实际代码状态。接口变更后必须同步本文档。

## 当前项目状态

### 1. API 路由清单

当前 API 路由：

```text
src/app/api/auth/[...all]/route.ts
src/app/api/assets/recent/route.ts
src/app/api/assets/download/route.ts
src/app/api/effects/precheck/route.ts
src/app/api/effects/generate/route.ts
src/app/api/effects/status/route.ts
src/app/api/payment/create-checkout/route.ts
src/app/api/user/credits/route.ts
src/app/api/webhook/stripe/route.ts
```

当前原则：

- 认证统一走 BetterAuth。
- 生成统一走 `/api/effects/*`。
- 支付统一走 Stripe Checkout + webhook。
- 旧 Supabase Auth、旧 per-tool API、N8N API、Google One Tap 已从活动代码中移除。

### 2. Auth API

入口：

- `src/app/api/auth/[...all]/route.ts`
- `src/lib/auth.ts`
- `src/lib/auth-client.ts`
- `src/lib/server.ts`

当前能力：

- BetterAuth Drizzle adapter
- email/password
- Google OAuth
- admin plugin
- session cache helper `getSession`
- 用户创建后自动赠送注册积分

关键环境变量：

```bash
POSTGRES_URL=
BETTER_AUTH_SECRET=
NEXT_PUBLIC_SITE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

注意：

- 注册赠送固定为代码默认 10 credits。
- BetterAuth secret 生产环境必须使用强随机值。
- 登录页和内部页不应该进入 sitemap。

### 3. Effects API

#### `POST /api/effects/precheck`

职责：

- 校验登录
- 校验 effect
- 校验 prompt
- 估算 required credits
- 返回当前余额和所需积分

常见返回字段：

```json
{
  "ok": true,
  "currentCredits": 20,
  "requiredCredits": 8
}
```

#### `POST /api/effects/generate`

职责：

- 校验登录
- 校验 effect 和 prompt
- 估算积分并检查余额
- 创建 `generation_history`
- 预扣积分
- 调用 provider adapter
- 写入 provider task id、status、output/error
- 确认或释放积分

请求示例：

```json
{
  "effectId": 16,
  "input": {
    "prompt": "A cinematic editorial product photo...",
    "aspect_ratio": "1:1",
    "quality": "medium",
    "wmOutputQuality": "2k",
    "n": 1
  }
}
```

#### `GET /api/effects/status?id={generationId}`

职责：

- 校验登录
- 只允许查询当前用户自己的 generation
- 对 processing 任务调用 adapter 同步 provider 状态
- provider 失败时释放已扣积分

当前没有保留通用 callback 占位路由。任务同步由 `/api/effects/status` 轮询触发；后续如果 provider 提供稳定 callback，再按 provider 验签和任务映射新增专用 webhook。

### 4. Provider adapter

adapter 文件：

- `src/lib/adapters/base-adapter.ts`
- `src/lib/adapters/adapter-factory.ts`
- `src/lib/adapters/evolink-image-adapter.ts`
- `src/lib/adapters/kie-market-adapter.ts`
- `src/lib/adapters/ai302-image-adapter.ts`

#### Evolink

适用 provider：

- `evolink.gpt-image-2`

接口：

- create: `https://api.evolink.ai/v1/images/generations`
- status: `https://api.evolink.ai/v1/tasks/{taskId}`

环境变量：

```bash
EVOLINK_API_KEY=
```

#### KIE

适用 provider：

- `kie.gpt-image-1.5`
- `kie.nano-banana-2`
- `kie.nano-banana`
- `kie.nano-banana-pro`

接口：

- create: `https://api.kie.ai/api/v1/jobs/createTask`
- status: `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=...`

环境变量：

```bash
KIE_API_KEY=
```

### 5. Payment API

#### `POST /api/payment/create-checkout`

职责：

- 校验登录
- 根据 Stripe price id 找到 `VOGUE_PRICES`
- 创建或复用 Stripe customer
- 创建 Stripe hosted checkout session
- credit pack checkout metadata 写入 `type=credit_purchase` 和 `packageId`
- 返回 checkout URL

#### `POST /api/payment/create-zpay-checkout`

职责：

- 校验登录
- 根据 credit package id 找到一次性积分包
- 读取 ZPAY 商户配置与 CNY 价格环境变量
- 预创建 `payment` 记录，`session_id` 为 ZPAY `out_trade_no`
- 生成 ZPAY `submit.php` 跳转 URL，支持 `alipay` 和 `wxpay`

#### `POST /api/webhook/stripe`

职责：

- 校验 `STRIPE_WEBHOOK_SECRET`
- 处理 `checkout.session.completed`
- 处理 `invoice.paid`
- 写入 `payment`
- 给 credit pack 或订阅发放积分
- 月付订阅发当月积分，年付订阅一次性发放全年积分

#### `GET /api/webhooks/zpay`

职责：

- 按 ZPAY 文档校验 MD5 签名
- 校验 `pid`、支付方式、订单金额
- 查询 ZPAY `api.php?act=order` 确认订单已支付
- 更新 `payment` 并按 `zpay_order` reference 幂等发放积分
- 成功返回纯字符串 `success`，失败返回 `fail`

#### `GET /api/payment/zpay/return`

职责：

- 处理 ZPAY 浏览器同步跳转
- 如果同步跳转携带成功签名，尝试处理一次回调
- 跳转到 `/payment/return?provider=zpay&order_id=...` 展示支付状态

生产 Stripe webhook 固定配置到 `/api/webhook/stripe`；项目不再保留 `/api/webhooks/stripe` 路由，避免 Dashboard 端点和代码路径漂移。

### 6. API 后续补齐项

- effects status 前端轮询完整接入
- provider 任务超时处理
- R2/对象存储上传 API
- asset 管理 API
- billing portal API
- admin/manual credit adjustment API
