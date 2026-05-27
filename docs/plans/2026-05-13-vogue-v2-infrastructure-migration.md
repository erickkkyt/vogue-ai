# Vogue V2 Infrastructure Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild Vogue AI as a prompt-gallery and image-generator product while preserving the current domain, SEO URLs, and high-value SEO copy.

**Architecture:** Keep public SEO pages and existing canonical URLs, but replace the product backend with a gptimg-style stack: BetterAuth, Drizzle/Postgres, Stripe payment records, a credit ledger, and a unified effects generation API. The first product surface is an image prompt gallery on the homepage plus a focused `/app` image generator workspace using GPT Image/Nano Banana style providers.

**Tech Stack:** Next.js App Router, React, BetterAuth, Drizzle ORM, Postgres, Stripe, Cloudflare R2 prompt images, KIE/Evolink image adapters.

---

### Task 1: Freeze SEO Asset Boundaries

**Files:**
- Create: `docs/plans/2026-05-13-vogue-v2-seo-asset-freeze.md`
- Modify: `src/app/sitemap.ts`

**Steps:**
1. Record the public URLs that must stay live: `/`, `/veo-3-generator`, `/hailuo-ai-video-generator`, `/ai-baby-generator`, `/ai-baby-podcast`, `/seedance`, `/lipsync`, `/effect/earth-zoom`, `/pricing`, `/blog`, `/privacy-policy`, `/terms-of-service`.
2. Keep page metadata and visible SEO sections for old tool pages.
3. Add missing live tool routes to the sitemap.
4. Verify with `npm run build` after the full migration.

### Task 2: Add BetterAuth and Drizzle Backbone

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`
- Create: `src/lib/auth.ts`
- Create: `src/lib/auth-client.ts`
- Create: `src/lib/server.ts`
- Create: `src/app/api/auth/[...all]/route.ts`
- Modify: `src/middleware.ts`
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/layout.tsx`

**Steps:**
1. Install BetterAuth, Drizzle, Postgres, Zod, and TSX tooling.
2. Define auth, payment, credits, effects, generation, and asset tables.
3. Add `getSession()` as the server auth boundary.
4. Replace Supabase login with BetterAuth email/password and Google OAuth support.
5. Remove Supabase session middleware and Google One Tap runtime injection.
6. Self-check by importing auth/server modules through TypeScript build.

### Task 3: Add Stripe Payment and Credit Ledger

**Files:**
- Create: `src/config/pricing.ts`
- Create: `src/credits/types.ts`
- Create: `src/credits/ledger.ts`
- Create: `src/credits/credits.ts`
- Create: `src/payment/types.ts`
- Create: `src/payment/stripe.ts`
- Create: `src/app/api/payment/create-checkout/route.ts`
- Create: `src/app/api/webhooks/stripe/route.ts`
- Modify: `src/app/api/webhook/stripe/route.ts`
- Modify: `src/app/pricing/page.tsx`

**Steps:**
1. Preserve current Vogue Stripe price IDs.
2. Use idempotent session/invoice references before granting credits.
3. Grant one-time credits from checkout completion.
4. Grant subscription credits from invoice payment only.
5. Update pricing to use hosted Checkout redirects.
6. Add a focused self-check for credit bucket planning.

### Task 4: Add Unified Effects and Image Providers

**Files:**
- Create: `src/lib/adapters/base-adapter.ts`
- Create: `src/lib/adapters/adapter-factory.ts`
- Create: `src/lib/adapters/evolink-image-adapter.ts`
- Create: `src/lib/adapters/kie-market-adapter.ts`
- Create: `src/lib/adapters/mock-adapter.ts`
- Create: `src/lib/effects/effects.ts`
- Create: `src/lib/effects/pricing.ts`
- Create: `src/lib/effects/validation.ts`
- Create: `src/lib/effects/generation-output.ts`
- Create: `src/app/api/effects/precheck/route.ts`
- Create: `src/app/api/effects/generate/route.ts`
- Create: `src/app/api/effects/status/route.ts`
- Create: `src/app/api/effects/callback/route.ts`

**Steps:**
1. Seed static fallback image effects for GPT Image 2, GPT Image 1.5, Nano Banana, Nano Banana 2, and Nano Banana Pro.
2. Make generation validate prompt, check credits, create a generation record, reserve credits, call provider, and update status.
3. Make status polling read generation history and call the provider adapter when a task id exists.
4. Keep callbacks provider-neutral for first version.

### Task 5: Build Prompt Gallery Homepage and Image Workspace

**Files:**
- Create: `src/lib/generated/awesome-gptimage2-prompts.json`
- Create: `src/lib/prompts.ts`
- Create: `src/components/prompts/VoguePromptGallery.tsx`
- Create: `src/components/app/ImageWorkspace.tsx`
- Create: `src/app/app/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/shared/DashboardSection.tsx`
- Modify: `src/components/common/Header.tsx`

**Steps:**
1. Copy gptimg prompt-library JSON as the first static gallery corpus.
2. Keep homepage brand phrase `Vogue AI`, but make the first value action prompt browsing and generation.
3. Route `Use Prompt` into `/app?target=image&model=gptimage2&prompt=...`.
4. Replace old tool embedded dashboards with a light CTA into `/app` while keeping the surrounding SEO copy.

### Task 6: Remove Old Supabase Product Routes and Verify

**Files:**
- Delete or neutralize old Supabase auth/payment/generation API routes.
- Modify: `src/app/sitemap.ts`

**Steps:**
1. Remove old Supabase auth callback routes.
2. Replace legacy Stripe webhook URL with a new-handler compatibility wrapper.
3. Remove old tool API routes that used Supabase RPC and n8n.
4. Run `npm run build`.
5. Fix compile/runtime issues until the first version builds.
