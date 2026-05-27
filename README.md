# Vogue AI

Vogue AI is being rebuilt as an AI prompt gallery and image generator while preserving the existing `vogueai.net` brand search demand and legacy SEO URLs.

## Current Shape

- Homepage: Vogue AI prompt gallery, using curated GPT Image prompt examples.
- Generator: `/app` image workspace with prompt, model, ratio, quality, and output controls.
- Auth: BetterAuth on Drizzle/Postgres.
- Billing: Stripe Checkout plus ZPAY for China-local credit-pack checkout, both backed by credit ledger records.
- Generation: unified `/api/effects/*` routes with KIE, Evolink, and 302.ai adapters.
- SEO: legacy tool URLs remain published while the homepage shifts toward `AI Prompt Gallery + Image Generator`.

## Docs

The current project docs live in `Vogue-AI-Docs/`.

| Document | Purpose |
| --- | --- |
| `Vogue AI文档索引.md` | Current documentation map and first-version boundary |
| `Vogue AI项目页面结构.md` | Routes, public pages, app workspace, sitemap boundary |
| `Vogue AI功能实现逻辑.md` | Gallery -> `/app` -> effects API -> provider flow |
| `Vogue AI项目后端API对接文档.md` | Auth, generation, payment, webhook, provider APIs |
| `Vogue AI数据库表结构.md` | Drizzle schema and migration notes |
| `Vogue AI积分与支付实现.md` | Stripe plans, credit packs, ledger, generation charging |
| `Vogue AI Prompt Gallery与内容资产.md` | Prompt data, gallery cards, image asset state |
| `Vogue AI SEO与旧页面保留策略.md` | Brand keyword retention, legacy page policy, sitemap rules |
| `Vogue AI上线前Checklist.md` | Launch checklist for env, DB, auth, Stripe, generation, SEO |
| `Vogue AI项目开发日志.md` | Date-ordered migration and product decisions |

## Active Stack

- Next.js App Router
- React 19
- Tailwind CSS v4
- BetterAuth
- Drizzle ORM
- Postgres
- Stripe
- ZPAY
- Evolink provider adapter
- KIE provider adapter
- 302.ai provider fallback adapter

## Useful Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run verify:routes -- --base-url http://localhost:3000
npm run test:credits
npm run db:generate
npm run db:migrate
npm run db:push
```

## Environment

Required production values are intentionally not committed.

```bash
DATABASE_URL=
DATABASE_SSL_REJECT_UNAUTHORIZED=
BETTER_AUTH_SECRET=
NEXT_PUBLIC_BASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED=false
AUTH_REQUIRE_EMAIL_VERIFICATION=true
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY=
NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY=
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=
NEXT_PUBLIC_STRIPE_PRICE_CREATOR_MONTHLY=
NEXT_PUBLIC_STRIPE_PRICE_CREATOR_YEARLY=
NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY=
NEXT_PUBLIC_STRIPE_PRICE_ELITE_YEARLY=
NEXT_PUBLIC_STRIPE_PRICE_CREDITS_STARTER=
NEXT_PUBLIC_STRIPE_PRICE_CREDITS_GROWTH=
NEXT_PUBLIC_STRIPE_PRICE_CREDITS_PROFESSIONAL=
ZPAY_PID=
ZPAY_KEY=
ZPAY_GATEWAY_URL=https://z-pay.cn
ZPAY_PRICE_CNY_CREDITS_STARTER=
ZPAY_PRICE_CNY_CREDITS_GROWTH=
ZPAY_PRICE_CNY_CREDITS_PROFESSIONAL=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_REGION=auto
R2_IMAGE_BUCKET_NAME=
R2_IMAGE_PUBLIC_URL=
RESEND_API_KEY=
EVOLINK_API_KEY=
KIE_API_KEY=
KIE_CALLBACK_URL=
KIE_WEBHOOK_SECRET=
CRON_SECRET=
AI302_API_KEY=
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

Stripe price IDs are read from the `NEXT_PUBLIC_STRIPE_PRICE_*` variables defined in `src/config/pricing.ts`. Generation models and effect IDs live in `src/lib/effects` and `src/lib/effects/workspace-models.ts`.

## Route Notes

- `/` is the primary brand and prompt gallery entry.
- `/app` is the image generator workspace and should not be submitted in the sitemap.
- `/assets` shows user generation assets and history.
- `/pricing` opens the pricing dialog with monthly, annual, and one-time credit-pack options. Stripe handles subscriptions and card credit-pack checkout; Alipay and WeChat Pay credit packs use ZPAY.
- Legacy SEO pages such as `/veo-3-generator`, `/hailuo-ai-video-generator`, `/ai-baby-generator`, `/seedance`, and `/lipsync` remain public.

## Migration Boundary

Old Supabase Auth, old embedded Stripe Elements, N8N routes, and per-tool generation API clients have been removed from the active codebase. Google One Tap is optional and controlled by `NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED`. Keep old public SEO pages unless a redirect plan is explicitly approved, because they still represent historical search assets.
