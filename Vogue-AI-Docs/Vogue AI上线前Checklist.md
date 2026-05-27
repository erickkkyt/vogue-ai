# Vogue AI 上线前 Checklist

> **当前项目状态**: 本文是 Vogue AI 第一版基础设施迁移后的上线检查清单。每次上线前按真实环境逐项核对。

## 1. 环境变量

- [ ] `POSTGRES_URL` 指向 Vogue AI 生产数据库。
- [ ] `BETTER_AUTH_SECRET` 使用生产强随机值。
- [ ] `NEXT_PUBLIC_SITE_URL=https://vogueai.net`。
- [ ] `GOOGLE_CLIENT_ID` 已配置生产 OAuth app。
- [ ] `GOOGLE_CLIENT_SECRET` 已配置。
- [ ] `STRIPE_SECRET_KEY` 使用生产或明确的测试 key。
- [ ] `STRIPE_WEBHOOK_SECRET` 与 Stripe webhook endpoint 一致。
- [ ] Stripe webhook endpoint 指向 `https://vogueai.net/api/webhook/stripe`。
- [ ] 月付与年付 `NEXT_PUBLIC_STRIPE_PRICE_*` price id 已配置。
- [ ] 积分包 `NEXT_PUBLIC_STRIPE_PRICE_CREDITS_*` price id 已配置。
- [ ] `EVOLINK_API_KEY` 可用。
- [ ] `KIE_API_KEY` 可用。
- [ ] `AI302_API_KEY` 可用，作为 GPT Image 2 第三 fallback。
- [ ] 注册赠送固定为代码默认 10 credits。

## 2. 数据库

- [ ] 已执行 `npm run db:migrate` 或等价迁移。
- [ ] `user/session/account/verification` 表存在。
- [ ] `payment` 表存在。
- [ ] `user_credit` 表存在。
- [ ] `credit_transaction` 表存在。
- [ ] `effect` 表存在。
- [ ] `generation_history` 表存在。
- [ ] `user_asset` 和 `generation_asset_link` 表存在。
- [ ] effect 静态配置已可 fallback。
- [ ] 如要运营后台管理模型，effect 静态配置已写入数据库。

## 3. 登录

- [ ] email/password 注册登录正常。
- [ ] Google OAuth 正常。
- [ ] 新用户注册后获得 welcome credits。
- [ ] 未登录访问 `/app` 生成会跳转 `/login?callbackUrl=...`。
- [ ] 登录后 callbackUrl 能回到 `/app`。
- [ ] `/login` 不进入 sitemap。

## 4. 支付

- [ ] Pricing 弹卡能从侧边栏/Footer 打开，`/pricing` 能重定向到首页弹卡。
- [ ] 每个 Stripe price id 与 `src/config/pricing.ts` 一致。
- [ ] subscription checkout 能创建。
- [ ] credit pack checkout 能创建。
- [ ] `/payment/return` 能处理成功返回。
- [ ] Stripe webhook 能收到 `checkout.session.completed`。
- [ ] Stripe webhook 能收到 `invoice.paid`。
- [ ] 月付订阅能在 `invoice.paid` 后发放当月积分。
- [ ] 年付订阅能在 `invoice.paid` 后一次性发放全年积分。
- [ ] ZPAY `ZPAY_PID`、`ZPAY_KEY`、`ZPAY_GATEWAY_URL` 已配置。
- [ ] ZPAY CNY 积分包价格环境变量已配置。
- [ ] ZPAY 支付宝积分包 checkout 能创建。
- [ ] ZPAY 微信支付积分包 checkout 能创建。
- [ ] ZPAY webhook 能收到通知并返回 `success`。
- [ ] credit pack 支付后只发放一次积分。
- [ ] subscription invoice paid 后只发放一次月度积分。
- [ ] `payment` 和 `credit_transaction` 幂等约束有效。

## 5. 生成

- [ ] `/app` 能从首页 gallery 接收 prompt。
- [ ] 未登录生成跳登录。
- [ ] 登录后余额不足返回明确错误。
- [ ] `GPT Image 2` 使用 `KIE -> Evolink -> 302.ai` fallback chain 创建任务。
- [ ] `GPT Image 1.5` 使用 `KIE_API_KEY` 创建任务。
- [ ] `Nano Banana` 系列使用 KIE 创建任务。
- [ ] provider 创建失败会释放积分。
- [ ] provider status 失败会退款。
- [ ] 结果 URL 能在 `/app` 展示。
- [ ] `/assets` 能看到用户自己的 generation history。

## 6. 首页与 Gallery

- [ ] 首页可见层保持 gallery-first，不展示大 H1。
- [ ] 首页 `sr-only` H1 是 `Free Nano Banana & GPT Image Prompts Gallery`。
- [ ] 首页 title/description 是 Nano Banana + GPT Image prompt gallery。
- [ ] 首页不输出 `keywords` meta。
- [ ] gallery 图片能正常加载。
- [ ] `Copy` 能复制 prompt。
- [ ] `Use Prompt` 能带 prompt 跳转 `/app`。
- [ ] 移动端 gallery 不发生文本或按钮重叠。
- [ ] Sidebar/Footer 没有旧站无效入口。

## 7. SEO

- [ ] `src/app/sitemap.ts` 只提交公开可索引页。
- [ ] `/app`、`/login`、`/assets`、`/pricing`、`/payment/return` 不进 sitemap。
- [ ] `/seedance`、`/effect/earth-zoom` 当前不进 sitemap。
- [ ] 非英语 locale shell routes 不进 sitemap，直到真实本地化完成。
- [ ] 旧 SEO 页仍可访问。
- [ ] 旧 SEO 页未被意外 noindex。
- [ ] 首页 canonical 是 `https://vogueai.net`。
- [ ] robots 允许 Google 抓取公开页面。
- [ ] `llms.txt` 与新定位一致。

## 8. 本地验证命令

- [ ] `npm run typecheck`
- [ ] `npm run test:credits`
- [ ] `npm run build`

## 9. 当前已知待补齐

- [ ] Provider callback 验签和真实状态更新。
- [ ] `/app` 前端轮询 `/api/effects/status`。
- [ ] provider 输出已写入 `user_asset` / `generation_asset_link`。
- [ ] R2/对象存储持久化生成结果。
- [ ] Billing Portal。
- [ ] 订阅取消/恢复/升级/降级 webhook。
- [ ] Prompt detail pages。
- [ ] 旧 SEO 工具页新模板化改造。
