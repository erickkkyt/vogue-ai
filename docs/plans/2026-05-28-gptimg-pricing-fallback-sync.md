# GPTIMG Pricing And Fallback Sync Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align Vogue AI image-model pricing and GPT Image 2 fallback behavior with the gptimg project while keeping provider waits long-running and recoverable.

**Architecture:** Pricing schemas live in shared local code, static effect fallbacks mirror gptimg, and a dedicated sync script upserts the same metadata into the database. GPT Image 2 provider fallback is parameter-routed and can continue after an accepted provider later reports failure.

**Tech Stack:** Next.js route handlers, Drizzle/Postgres, Node test runner, TypeScript.

---

### Task 1: Lock Pricing Behavior With Tests

**Files:**
- Modify: `src/lib/effects/pricing.test.ts`

**Steps:**
1. Add tests for GPT Image 2 matrix pricing, `n` multiplier, Nano Banana 2, Nano Banana Pro, Nano Banana fixed pricing, and GPT Image 1.5 `quality -> size` compatibility.
2. Run `npx tsx --test src/lib/effects/pricing.test.ts` and confirm the old behavior fails.

### Task 2: Align Local Pricing Truth

**Files:**
- Modify: `src/lib/effects/pricing.ts`
- Modify: `src/lib/effects/effects.ts`
- Modify: `src/lib/effects/workspace-models.ts`
- Modify: `src/lib/adapters/kie-market-adapter.ts`

**Steps:**
1. Export gptimg-compatible pricing schemas from `pricing.ts`.
2. Use provider fallback schemas when DB `pricingSchema` is missing.
3. Apply GPT Image 2 `n` multiplier only to GPT Image 2 providers.
4. Mirror gptimg image model credits/input schemas in `STATIC_IMAGE_EFFECTS`.
5. Let GPT Image 1.5 accept UI `quality` and map it to provider `size`.

### Task 3: Add GPT Image 2 Fallback Continuation

**Files:**
- Modify: `src/lib/effects/gpt-image-2-provider-chain.ts`
- Modify: `src/app/api/effects/status/route.ts`
- Modify: `src/app/api/effects/callback/route.ts`
- Modify: `src/lib/effects/server-poller.ts`
- Modify: `src/app/api/effects/generate/route.ts`

**Steps:**
1. Add low+1k Evolink-first provider routing.
2. Persist `providerChain`, `selectedProvider`, `providerAttempts`, and `selectedProviderStartedAt`.
3. Continue only to later providers after explicit provider failure.
4. Avoid short provider timeout; use long zombie cleanup only.
5. Start backend polling when queue transport is unavailable.

### Task 4: Add DB Sync Script

**Files:**
- Add: `scripts/sync-gptimg-image-effects.ts`
- Modify: `package.json`

**Steps:**
1. Upsert image effect rows `4,5,6,15,16` with gptimg-compatible metadata.
2. Print a concise verification table without secrets.
3. Run the script and confirm DB `pricing_schema` is populated.

### Task 5: Verify

**Commands:**
- `npx tsx --test src/lib/effects/pricing.test.ts`
- `npx tsx --test src/lib/effects/gpt-image-2-provider-chain.test.ts`
- `npm run typecheck`
- Read-only DB query for image effect pricing schemas.

**Acceptance:**
- Vogue image-model pricing matches gptimg.
- GPT Image 2 low+1k starts with Evolink; other GPT Image 2 paths start with KIE.
- Explicit provider failure continues fallback without immediate refund.
- 45/60 seconds remain UI ETA only, not provider fallback timeout.
