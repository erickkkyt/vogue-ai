# Vogue V2 SEO Asset Freeze

The migration keeps Vogue AI's existing Google-facing surfaces stable while replacing the product backend.

## Canonical Domain

- `https://vogueai.net`

## Routes To Preserve

- `/`
- `/veo-3-generator`
- `/hailuo-ai-video-generator`
- `/ai-baby-generator`
- `/ai-baby-podcast`
- `/seedance`
- `/lipsync`
- `/effect/earth-zoom`
- `/pricing`
- `/blog`
- `/blog/[slug]`
- `/privacy-policy`
- `/terms-of-service`

## Homepage Direction

- Preserve the brand phrase `Vogue AI`.
- Reposition the page as `AI Prompt Gallery + Image Generator`.
- Make prompt browsing and image generation the first product action.

## Tool Page Direction

- Preserve existing metadata and SEO copy for the first migration.
- Replace old embedded Supabase dashboards with a new `/app` generator entry point.
- Keep old URLs returning 200 and present in sitemap.

## Infrastructure Direction

- Replace Supabase Auth with BetterAuth.
- Replace `user_profiles.credits` with a credit ledger.
- Replace scattered generation APIs with `/api/effects/*`.
- Keep a compatibility Stripe webhook path at `/api/webhook/stripe`, backed by the new handler.
