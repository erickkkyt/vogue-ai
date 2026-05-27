# Vogue Launch Risk Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the known launch risks around local route verification, anonymous generation abuse, cron/admin endpoints, callback redirects, analytics config, and multilingual SEO coverage.

**Architecture:** Keep the fixes small and local: add shared server/client guards where behavior is repeated, keep product routes intact, and make launch-critical configuration explicit. Verification should separate dev-server health from production build health so Turbopack cache issues do not hide real runtime regressions.

**Tech Stack:** Next.js 16 App Router, React 19, next-intl, Better Auth, Drizzle/Postgres, Node test runner via `tsx --test`.

---

### Task 1: Stabilize Dev Verification For `/app` And Auth Routes

**Files:**
- Modify: `package.json`
- Create: `scripts/verify-local-routes.ts`
- Optional docs: `Vogue-AI-Docs/Vogue AI上线前Checklist.md`

**Plan:**
1. Add a route-smoke script that requests `/`, `/zh`, `/app`, `/login`, `/auth/login`, `/pricing`, `/sitemap.xml`, and `/robots.txt`.
2. Treat 200 and expected redirects as pass; fail on 500.
3. Document the dev workflow: after `next build`, restart `npm run dev` before judging localhost routes.
4. Add `npm run verify:routes` to package scripts.

**Verification:**
```bash
npm run verify:routes
npm run build
npm run dev
npm run verify:routes
```

**Acceptance:** Local QA has a single command that catches `/app` or `/login` 500s and distinguishes stale dev server behavior from production build behavior.

### Task 2: Add Server-Side Anonymous Trial Protection

**Files:**
- Modify: `src/app/api/effects/anonymous-generate/route.ts`
- Create or modify: `src/db/schema.ts`
- Add migration: `src/db/migrations/*`
- Test: create `src/lib/effects/anonymous-trial-limit.test.ts`

**Plan:**
1. Add an `anonymous_trial` table keyed by a privacy-safe hash of IP + user agent + day or week.
2. Keep the existing cookie as UX hint, but enforce quota server-side.
3. Use the code default anonymous trial limit of 1 per day.
4. Return `429` before calling any provider when the server quota is consumed.
5. Avoid storing raw IPs or user agents.

**Verification:**
```bash
npm run db:generate
npx tsx --test src/lib/effects/anonymous-trial-limit.test.ts
npm run typecheck
```

**Acceptance:** Clearing browser cookies no longer resets free generation quota; repeated requests from the same fingerprint/day are rejected before KIE/Evolink/302.ai calls.

### Task 3: Protect Operational GET Endpoints

**Files:**
- Modify: `src/app/api/cleanup-stale-generations/route.ts`
- Modify: `src/app/api/distribute-credits/route.ts`
- Create: `src/lib/admin/cron-guard.ts`
- Test: create `src/lib/admin/cron-guard.test.ts`

**Plan:**
1. Add `requireCronSecret(request)` that checks `Authorization: Bearer <configured secret>` or `x-cron-secret`.
2. If no cron secret is configured, return 503 instead of running work.
3. Remove the temporary `VOGUE_ENABLE_GPTIMG_DB_INFRA` readiness gate after the required DB tables are migrated.
4. Prefer `POST` for mutating operations; keep `GET` only if the hosting cron provider requires it.

**Verification:**
```bash
npx tsx --test src/lib/admin/cron-guard.test.ts
curl -i http://localhost:3000/api/cleanup-stale-generations
curl -i -H "Authorization: Bearer <configured-secret>" http://localhost:3000/api/cleanup-stale-generations
```

**Acceptance:** Opening infra readiness no longer exposes credit distribution or cleanup jobs to unauthenticated public traffic.

### Task 4: Sanitize Login Callback URLs

**Files:**
- Modify: `src/components/auth/login-form.tsx`
- Create: `src/lib/auth/callback-url.ts`
- Test: create `src/lib/auth/callback-url.test.ts`

**Plan:**
1. Implement `normalizeSafeCallbackUrl(value, fallback)` that only allows same-origin relative paths beginning with `/`.
2. Reject protocol URLs, protocol-relative URLs, control characters, and malformed values.
3. Preserve locale-aware fallback to `/app`.
4. Use the helper for both `callbackUrl` and `next` query params.

**Verification:**
```bash
npx tsx --test src/lib/auth/callback-url.test.ts
npm run typecheck
```

**Acceptance:** Login cannot redirect to external domains or malformed targets, while normal `/app`, `/zh/app`, and pricing-return callbacks still work.

### Task 5: Move Analytics And Clarity IDs Into Config

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `README.md`
- Modify: `Vogue-AI-Docs/Vogue AI上线前Checklist.md`

**Plan:**
1. Replace hardcoded `G-MJ7Q9993FF` and `ryvv8c2qs8` with `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` and `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
2. Render scripts only when the relevant env var is set.
3. Add a production checklist item to confirm the IDs belong to Vogue AI.

**Verification:**
```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-TEST NEXT_PUBLIC_CLARITY_PROJECT_ID=test npm run build
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID= NEXT_PUBLIC_CLARITY_PROJECT_ID= npm run build
```

**Acceptance:** Analytics can be disabled in preview/dev and cannot silently send production traffic to a stale property.

### Task 6: Expand Sitemap To Multilingual Public Routes

**Files:**
- Modify: `src/app/sitemap.ts`
- Use: `src/i18n/routing.ts`
- Use: `src/lib/urls/urls.ts`
- Test: create or extend SEO metadata tests

**Plan:**
1. Define the canonical public route list once.
2. Generate sitemap entries for default locale plus `/zh`, `/fr`, `/ru`, `/pt`, `/ja`, `/ko` equivalents.
3. Exclude private/product-app routes: `/app`, `/assets`, `/profile`, `/billings`, `/auth/*`, `/payment/*`, `/api/*`.
4. Keep `/pricing` excluded because it is a dialog entrypoint.
5. Add alternates in sitemap entries if supported cleanly by Next metadata route.

**Verification:**
```bash
npm run build
curl -s http://localhost:3000/sitemap.xml | rg "https://vogueai.net/zh"
```

**Acceptance:** Public SEO pages are discoverable across supported locales without exposing private app routes.

### Task 7: Final Launch Verification Pass

**Files:**
- No direct code changes unless earlier tasks expose issues.

**Plan:**
1. Run focused tests for each touched area.
2. Run full typecheck and build.
3. Start production server on a non-3000 port and smoke test public and app routes.
4. Re-run full test suite or explicitly document any remaining stale UI tests.

**Verification:**
```bash
npm run typecheck
npm run lint
npm run build
PORT=3002 npm start
npm run verify:routes -- --base-url http://localhost:3002
npx tsx --test $(find src -name '*.test.ts' | sort)
```

**Acceptance:** Build passes with production-like env, protected endpoints reject unauthenticated requests, anonymous generation has server-side quota, login redirects are same-site only, analytics IDs are env-owned, and sitemap includes multilingual public routes.
