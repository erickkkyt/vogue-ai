# Vogue Messages And Workspace Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move Vogue UI copy toward the gptimg-style `next-intl` messages architecture and reduce workspace component coupling without changing visible behavior.

**Architecture:** Use `messages/{locale}.json` as the source of truth for runtime Vogue UI copy. Server components read the active catalog with `getMessages({ locale })`; client components read the provider catalog with `useMessages()`. Split high-risk workspace code only along pure helper and component boundaries so generation, upload, polling, and handoff behavior remain unchanged.

**Tech Stack:** Next.js App Router, next-intl, TypeScript, Node test runner, existing route/browser smoke checks.

---

### Task 1: Make messages JSON the Vogue UI copy source

**Files:**
- Modify: `messages/*.json`
- Modify: `src/i18n/messages.ts`
- Create: `src/i18n/vogue.ts`
- Test: `src/lib/vogue-localization-audit.test.ts`

**Steps:**
1. Add a failing test that requires every `messages/{locale}.json` file to expose a complete `Vogue` namespace.
2. Generate `Vogue` copy into each message catalog from the current typed copy.
3. Move the typed Vogue copy contract into `src/i18n/vogue.ts`, with extraction helpers for active next-intl messages.
4. Make `messages.ts` use a static catalog plus default-locale merge, matching the gptimg architecture without adding a new dependency.
5. Migrate server and client callers away from the deleted compatibility entry.
6. Run targeted localization tests.

### Task 2: Split ImageWorkspace low-risk utilities

**Files:**
- Modify: `src/components/app/ImageWorkspace.tsx`
- Create: `src/components/app/image-workspace-utils.ts`
- Test: `src/lib/vogue-prompt-composer-ui.test.ts`

**Steps:**
1. Add or reuse tests that confirm `ImageWorkspace` still contains the same public component and workspace flow hooks.
2. Move pure helper functions for status, filenames, output URL parsing, labels, and formatting into `image-workspace-utils.ts`.
3. Import the helpers back into `ImageWorkspace.tsx`.
4. Run targeted UI/source tests.

### Task 3: Verify behavior parity

**Files:**
- Existing tests and browser routes.

**Steps:**
1. Run `npm run lint`.
2. Run `npm run typecheck`.
3. Run `npm exec -- tsx --test src/**/*.test.ts`.
4. Run `npm run build`.
5. Start local production server and run route smoke.
6. Browser-check `/zh` and `/zh/app` for console warnings/errors.
