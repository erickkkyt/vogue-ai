# Faster Generation ETA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add model-aware estimated generation time, standard-vs-faster progress messaging, and a hidden 10-second standard reveal delay to the VogueAI image workspace.

**Architecture:** Reuse the gptimg timing model as a local VogueAI resolver, snapshot ETA fields into each workspace task at submit time, and resolve user access tier separately on client and server. Standard tier includes anonymous users, free users, and one-time credit-pack-only users; faster tier is only for active paid subscription users. Provider fallback and provider timeout behavior must not change.

**Tech Stack:** Next.js App Router, React 19, TypeScript, next-intl JSON messages, Drizzle/Postgres, node:test through `tsx --test`.

---

## Confirmed Product Rules

- Anonymous users use `standard`.
- Free signed-in users use `standard`.
- Users who only bought one-time credit packs use `standard`.
- Active subscription users use `faster`.
- `standard` results are held for 10 seconds after provider success, but the UI should present this as normal finalization, not as an artificial delay.
- `faster` users receive successful results normally and see explicit "Faster generation" progress messaging.
- The 45s/60s values are UI estimates. Do not use them as provider fallback timeouts.

## ETA Matrix

| Model | Params | Faster ETA | Standard ETA |
| --- | --- | ---: | ---: |
| GPT Image 2 | `quality=low` | 45s | 60s |
| GPT Image 2 | `quality=medium/high` | 60s | 80s |
| GPT Image 1.5 | any supported quality | 60s | 80s |
| Nano Banana | any supported quality | 30s | 45s |
| Nano Banana 2 | any supported quality | 45s | 60s |
| Nano Banana Pro | any supported quality | 45s | 60s |
| Other image model | fallback | 70s | 70s |
| Video model | fallback | 120s | 120s |

---

### Task 1: Add Shared Generation Access And ETA Resolvers

**Files:**
- Create: `src/lib/effects/generation-access.ts`
- Create: `src/lib/effects/generation-time-estimate.ts`
- Create: `src/lib/effects/generation-time-estimate.test.ts`
- Test: `src/lib/effects/generation-time-estimate.test.ts`

**Step 1: Write the failing ETA tests**

Add tests covering:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  resolveWorkspaceGenerationTimeEstimate,
  resolveWorkspaceGenerationTimeEstimateForTier,
  resolveWorkspaceStandardGenerationTimeEstimate,
} from './generation-time-estimate';

test('estimates faster image generation time by model and quality', () => {
  assert.equal(resolveWorkspaceGenerationTimeEstimate({
    assetType: 'image',
    modelId: 'gptimage2',
    quality: 'low',
    outputQuality: '1k',
  }), 45);
  assert.equal(resolveWorkspaceGenerationTimeEstimate({
    assetType: 'image',
    modelId: 'gptimage2',
    quality: 'high',
    outputQuality: '2k',
  }), 60);
  assert.equal(resolveWorkspaceGenerationTimeEstimate({
    assetType: 'image',
    modelId: 'nanobanana',
  }), 30);
  assert.equal(resolveWorkspaceGenerationTimeEstimate({
    assetType: 'image',
    modelId: 'nanobanana2',
  }), 45);
  assert.equal(resolveWorkspaceGenerationTimeEstimate({
    assetType: 'image',
    modelId: 'nanobananapro',
  }), 45);
});

test('adds standard queue display time for standard users', () => {
  assert.equal(resolveWorkspaceStandardGenerationTimeEstimate({
    assetType: 'image',
    modelId: 'gptimage2',
    quality: 'low',
  }), 60);
  assert.equal(resolveWorkspaceStandardGenerationTimeEstimate({
    assetType: 'image',
    modelId: 'gptimage2',
    quality: 'high',
  }), 80);
  assert.equal(resolveWorkspaceStandardGenerationTimeEstimate({
    assetType: 'image',
    modelId: 'gptimage15',
  }), 80);
  assert.equal(resolveWorkspaceStandardGenerationTimeEstimate({
    assetType: 'image',
    modelId: 'nanobanana',
  }), 45);
});

test('resolves visible ETA by access tier', () => {
  assert.equal(resolveWorkspaceGenerationTimeEstimateForTier({
    accessTier: 'faster',
    assetType: 'image',
    modelId: 'gptimage2',
    quality: 'high',
  }), 60);
  assert.equal(resolveWorkspaceGenerationTimeEstimateForTier({
    accessTier: 'standard',
    assetType: 'image',
    modelId: 'gptimage2',
    quality: 'high',
  }), 80);
});
```

**Step 2: Run the test to verify it fails**

Run:

```bash
pnpm exec tsx --test src/lib/effects/generation-time-estimate.test.ts
```

Expected: FAIL because the resolver files do not exist.

**Step 3: Implement the resolver**

Create `src/lib/effects/generation-access.ts`:

```ts
import { subscriptionPlanIds } from '@/config/pricing';

export type GenerationAccessTier = 'standard' | 'faster';

const SUBSCRIPTION_PLAN_ID_SET = new Set<string>(subscriptionPlanIds);

export const resolveGenerationAccessTierFromSubscriptionState = (
  subscriptionState?: string | null
): GenerationAccessTier =>
  SUBSCRIPTION_PLAN_ID_SET.has(subscriptionState?.trim().toLowerCase() ?? '')
    ? 'faster'
    : 'standard';
```

Create `src/lib/effects/generation-time-estimate.ts` by porting the gptimg resolver values exactly.

**Step 4: Run the test to verify it passes**

Run:

```bash
pnpm exec tsx --test src/lib/effects/generation-time-estimate.test.ts
```

Expected: PASS.

---

### Task 2: Add Server-Side Tier Resolution And Reveal Gate

**Files:**
- Create: `src/lib/effects/generation-access-server.ts`
- Create: `src/lib/effects/result-reveal-gate.ts`
- Create: `src/lib/effects/result-reveal-gate.test.ts`
- Modify: `src/app/api/effects/generate/route.ts`
- Modify: `src/app/api/effects/status/route.ts`
- Modify: `src/app/api/effects/callback/route.ts`
- Modify: `src/lib/effects/server-poller.ts`
- Modify: `src/lib/app/generated-workspace-feed.ts`
- Test: `src/lib/effects/result-reveal-gate.test.ts`

**Step 1: Write the failing reveal gate tests**

Cover these cases:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  STANDARD_RESULT_REVEAL_DELAY_MS,
  applyResultRevealGate,
  isResultRevealVisible,
} from './result-reveal-gate';

test('returns faster succeeded output immediately', () => {
  const gate = applyResultRevealGate({
    accessTier: 'faster',
    status: 'succeeded',
    output: { image_urls: ['https://example.com/a.png'] },
    now: new Date('2026-05-30T00:00:00Z'),
  });
  assert.equal(gate.responseStatus, 'succeeded');
  assert.deepEqual(gate.outputForResponse.image_urls, ['https://example.com/a.png']);
});

test('holds standard succeeded output without exposing media urls', () => {
  const now = new Date('2026-05-30T00:00:00Z');
  const gate = applyResultRevealGate({
    accessTier: 'standard',
    status: 'succeeded',
    output: { image_urls: ['https://example.com/a.png'], result_url: 'https://example.com/a.png' },
    now,
  });
  assert.equal(gate.responseStatus, 'processing');
  assert.equal('image_urls' in gate.outputForResponse, false);
  assert.equal('result_url' in gate.outputForResponse, false);
  assert.equal(
    gate.outputForStore.resultRevealReadyAt,
    new Date(now.getTime() + STANDARD_RESULT_REVEAL_DELAY_MS).toISOString()
  );
});

test('reveals standard output after ready time', () => {
  const output = {
    image_urls: ['https://example.com/a.png'],
    resultRevealReadyAt: '2026-05-30T00:00:10.000Z',
  };
  const gate = applyResultRevealGate({
    accessTier: 'standard',
    status: 'succeeded',
    output,
    now: new Date('2026-05-30T00:00:11Z'),
  });
  assert.equal(gate.responseStatus, 'succeeded');
  assert.deepEqual(gate.outputForResponse.image_urls, ['https://example.com/a.png']);
  assert.equal(isResultRevealVisible({ status: 'succeeded', output, now: new Date('2026-05-30T00:00:09Z') }), false);
});
```

**Step 2: Run the test to verify it fails**

Run:

```bash
pnpm exec tsx --test src/lib/effects/result-reveal-gate.test.ts
```

Expected: FAIL because the reveal gate does not exist.

**Step 3: Implement `result-reveal-gate.ts`**

Port the gptimg behavior with `STANDARD_RESULT_REVEAL_DELAY_MS = 10_000`.

Important behavior:
- Non-succeeded statuses return unchanged.
- Faster succeeded output returns immediately.
- Standard succeeded output stores `resultRevealReadyAt` and returns `processing` until ready.
- Redacted response removes media URL fields: `result_url`, `result_urls`, `image_url`, `image_urls`, `stored_result_url`, `publicUrl`, `url`, `urls`.

**Step 4: Implement `generation-access-server.ts`**

Use the payment table, not just credit balance:

```ts
import 'server-only';

import { getDb } from '@/db';
import { payment, user } from '@/db/schema';
import { PaymentScenes } from '@/payment/types';
import { and, desc, eq } from 'drizzle-orm';
import {
  type GenerationAccessTier,
  resolveGenerationAccessTierFromSubscriptionState,
} from './generation-access';

export const getUserGenerationAccessTier = async (
  userId: string
): Promise<GenerationAccessTier> => {
  const db = await getDb();
  const [subscription] = await db
    .select({
      status: payment.status,
      paid: payment.paid,
      periodEnd: payment.periodEnd,
    })
    .from(payment)
    .where(
      and(
        eq(payment.userId, userId),
        eq(payment.scene, PaymentScenes.SUBSCRIPTION),
        eq(payment.paid, true)
      )
    )
    .orderBy(desc(payment.createdAt))
    .limit(1);

  const now = Date.now();
  if (
    subscription &&
    subscription.paid &&
    subscription.status !== 'canceled' &&
    subscription.status !== 'unpaid' &&
    (!subscription.periodEnd || subscription.periodEnd.getTime() > now)
  ) {
    return 'faster';
  }

  const [userRow] = await db
    .select({ subscriptionState: user.subscriptionState })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return resolveGenerationAccessTierFromSubscriptionState(
    userRow?.subscriptionState
  );
};
```

If this fallback feels too permissive during implementation review, remove the `user.subscriptionState` fallback and rely only on paid subscription payment rows.

**Step 5: Apply reveal gate in authenticated routes**

In `src/app/api/effects/generate/route.ts`:
- Resolve `generationAccessTier` after session validation.
- When provider returns, persist output assets for real storage.
- Apply reveal gate to `outputForStore`.
- Store `revealGate.outputForStore`.
- Return `status: revealGate.responseStatus` and `output: revealGate.outputForResponse`.

In `src/app/api/effects/status/route.ts`:
- Resolve tier for the current user.
- Apply reveal gate before returning terminal/synced output.
- If `revealGate.shouldStoreOutput`, update stored output with `resultRevealReadyAt`.

In `src/app/api/effects/callback/route.ts` and `src/lib/effects/server-poller.ts`:
- Apply reveal gate before `updateGenerationById`.
- Use the generation owner user ID.

**Step 6: Hide unrevealed standard results from recent assets**

In `src/lib/app/generated-workspace-feed.ts`:
- Import `isResultRevealVisible`.
- When a generation maps to `succeeded`, return `null` while `resultRevealReadyAt` is still in the future.

**Step 7: Run reveal tests**

Run:

```bash
pnpm exec tsx --test src/lib/effects/result-reveal-gate.test.ts
```

Expected: PASS.

---

### Task 3: Snapshot ETA Metadata Into Workspace Tasks

**Files:**
- Modify: `src/components/app/image-workspace-utils.ts`
- Modify: `src/components/app/ImageWorkspace.tsx`
- Test: `src/lib/vogue-prompt-composer-ui.test.ts`

**Step 1: Write source assertions**

Add assertions that:
- `WorkspaceAssetItem` includes `expectedGenerationSeconds`, `standardGenerationSeconds`, `fasterGenerationSeconds`, and `generationAccessTier`.
- `ImageWorkspace.tsx` imports `resolveWorkspaceGenerationTimeEstimate`, `resolveWorkspaceStandardGenerationTimeEstimate`, and `resolveWorkspaceGenerationTimeEstimateForTier`.
- The optimistic task receives model ID, quality, output quality, generation count, and access tier before upload/generate.

**Step 2: Run the targeted UI/source test**

Run:

```bash
pnpm exec tsx --test src/lib/vogue-prompt-composer-ui.test.ts
```

Expected: FAIL until fields and imports are added.

**Step 3: Extend the workspace task type**

In `src/components/app/image-workspace-utils.ts`, add:

```ts
import type { GenerationAccessTier } from '@/lib/effects/generation-access';

export type WorkspaceAssetItem = {
  ...
  expectedGenerationSeconds?: number | null;
  standardGenerationSeconds?: number | null;
  fasterGenerationSeconds?: number | null;
  generationAccessTier?: GenerationAccessTier | null;
};
```

Update `createOptimisticWorkspaceTask` to accept and store those fields.

**Step 4: Compute the client tier**

In `ImageWorkspace.tsx`:
- Import `resolveGenerationAccessTierFromSubscriptionState`.
- Read `session.user.subscriptionState` defensively.
- Resolve `generationAccessTier` as:

```ts
const generationAccessTier = isAuthenticated
  ? resolveGenerationAccessTierFromSubscriptionState(
      typeof session?.user?.subscriptionState === 'string'
        ? session.user.subscriptionState
        : null
    )
  : 'standard';
```

**Step 5: Compute ETA from submitted params**

Add a small local helper in `ImageWorkspace.tsx`:

```ts
const getSubmittedGenerationTiming = ({
  accessTier,
  modelId,
  outputQuality,
  quality,
}: {
  accessTier: GenerationAccessTier;
  modelId: string;
  outputQuality?: WorkspaceOutputQuality;
  quality?: WorkspaceQualityOption;
}) => ({
  expectedGenerationSeconds: resolveWorkspaceGenerationTimeEstimateForTier({
    accessTier,
    assetType: 'image',
    modelId,
    outputQuality,
    quality,
  }),
  standardGenerationSeconds: resolveWorkspaceStandardGenerationTimeEstimate({
    assetType: 'image',
    modelId,
    outputQuality,
    quality,
  }),
  fasterGenerationSeconds: resolveWorkspaceGenerationTimeEstimate({
    assetType: 'image',
    modelId,
    outputQuality,
    quality,
  }),
  generationAccessTier: accessTier,
});
```

Use it when creating optimistic and fallback tasks, including anonymous tasks with `accessTier: 'standard'`.

**Step 6: Preserve task ETA when polling**

When `/api/effects/status` returns, update only `status` and `mediaUrl`; do not recompute ETA from the current selected controls.

**Step 7: Run targeted source tests**

Run:

```bash
pnpm exec tsx --test src/lib/vogue-prompt-composer-ui.test.ts
```

Expected: PASS for new assertions.

---

### Task 4: Add Progress Bar And Faster Generation Messaging

**Files:**
- Modify: `src/components/app/ImageWorkspace.tsx`
- Modify: `src/i18n/vogue.ts`
- Modify: `messages/en.json`
- Modify: `messages/zh.json`
- Modify: `messages/fr.json`
- Modify: `messages/ru.json`
- Modify: `messages/pt.json`
- Modify: `messages/ja.json`
- Modify: `messages/ko.json`
- Test: `src/lib/vogue-prompt-composer-ui.test.ts`

**Step 1: Add copy keys**

Add under `Vogue.app`:

```json
"progress": {
  "almostDone": "Almost done, finalizing result...",
  "timeLeft": "Estimated {seconds}s left",
  "estimated": "Estimated",
  "fasterActive": "Faster generation active",
  "upgradeCta": "Upgrade for faster generation",
  "standardVsFaster": "{standard}s -> {faster}s"
}
```

Chinese:

```json
"progress": {
  "almostDone": "即将完成，正在整理结果...",
  "timeLeft": "预计剩余 {seconds} 秒",
  "estimated": "预计",
  "fasterActive": "已启用更快生成",
  "upgradeCta": "升级更快生成",
  "standardVsFaster": "{standard}s -> {faster}s"
}
```

For other locales, use clear translations or temporary English if localization speed matters, but keep keys present.

**Step 2: Add progress state helper**

Port gptimg's progress helper into `ImageWorkspace.tsx`:

```ts
const GENERATION_PROGRESS_SOFT_CAP_PERCENT = 88;
const GENERATION_PROGRESS_TAIL_CAP_PERCENT = 98;

const getGenerationProgressState = ({ expectedSeconds, nowMs, startedAtMs }) => {
  const elapsedSeconds = Math.max(0, (nowMs - startedAtMs) / 1000);
  if (elapsedSeconds <= expectedSeconds) {
    return {
      isTail: false,
      percent: Math.max(5, Math.min(88, (elapsedSeconds / expectedSeconds) * 88)),
      remainingSeconds: Math.max(1, Math.ceil(expectedSeconds - elapsedSeconds)),
    };
  }
  const tailElapsedSeconds = elapsedSeconds - expectedSeconds;
  return {
    isTail: true,
    percent: Math.min(98, 88 + 10 * (1 - Math.exp(-tailElapsedSeconds / 70))),
    remainingSeconds: 0,
  };
};
```

Use explicit TypeScript parameter types during implementation.

**Step 3: Update the task card UI**

In `AssetTile`:
- When `isBusy`, show progress bar below the spinner/status area or below task metadata.
- Use current task ETA fields if present.
- Standard users see: `Estimated 60s` and a small pricing link/button with `upgradeCta`.
- Faster users see: sparkles icon + `fasterActive`, plus `80s -> 60s` when standard is greater than faster.
- During the 10-second hidden standard reveal period, show `almostDone`, not a delay-specific message.

**Step 4: Avoid layout shift**

Keep progress container height stable for busy tasks:
- Fixed progress bar height.
- Fixed text row height.
- Use `tabular-nums` for percentage and seconds.

**Step 5: Run targeted UI/source test**

Run:

```bash
pnpm exec tsx --test src/lib/vogue-prompt-composer-ui.test.ts
```

Expected: PASS.

---

### Task 5: Make The Generate Button Show ETA Without Breaking Credit Display

**Files:**
- Modify: `src/components/app/ImageWorkspace.tsx`
- Modify: `src/components/app/VoguePromptComposer.tsx`
- Test: `src/lib/vogue-prompt-composer-ui.test.ts`

**Step 1: Decide display priority**

Use this priority:
1. Anonymous trial state, because it explains free availability.
2. Active generation state, because user needs feedback.
3. Credit estimate, because it is transactional.
4. ETA in nearby microcopy if credit estimate is already occupying the button.

**Step 2: Add optional ETA prop**

Add a prop to `VoguePromptComposer`:

```ts
generationEtaLabel?: string;
```

Render it as a compact text chip near the button or beside `VogueCreditsDisplay`, not as a replacement for credits when credits are present.

**Step 3: Compute ETA label in workspace**

In `ImageWorkspace.tsx`, compute:

```ts
const visibleGenerationSeconds = resolveWorkspaceGenerationTimeEstimateForTier({
  accessTier: generationAccessTier,
  assetType: 'image',
  modelId: model.id,
  quality,
  outputQuality,
});
const generationEtaLabel = copy.app.progress.estimated + ` ${visibleGenerationSeconds}s`;
```

For anonymous mode, keep the existing free-trial button label and show ETA in the side chip only.

**Step 4: Test source contracts**

Add assertions that:
- `VoguePromptComposer` exposes `generationEtaLabel`.
- `ImageWorkspace` passes a label built from `resolveWorkspaceGenerationTimeEstimateForTier`.
- Existing `generateMetaLabel={anonymousGenerateMetaLabel}` remains for anonymous copy.

Run:

```bash
pnpm exec tsx --test src/lib/vogue-prompt-composer-ui.test.ts
```

Expected: PASS.

---

### Task 6: Add Local Anonymous Standard Hold Without Infinite Delay

**Files:**
- Modify: `src/components/app/ImageWorkspace.tsx`
- Test: `src/lib/vogue-prompt-composer-ui.test.ts`

**Step 1: Keep server anonymous route simple**

Do not add `resultRevealReadyAt` server logic to `src/app/api/effects/anonymous-status/route.ts`, because anonymous status is stateless and would reset the 10-second window on every poll.

**Step 2: Hold anonymous success locally**

In `pollAnonymousStatus`, when anonymous status first returns `succeeded`:
- Keep output in local function scope.
- Update current task status to `processing` and progress text to `almostDone`.
- Wait until 10 seconds after first success.
- Then set media URL and status to `succeeded`.

This keeps anonymous users in standard behavior without exposing an artificial wait.

**Step 3: Assert the rule in source tests**

Add a source assertion that anonymous success does not directly set succeeded output without the local standard hold helper.

Run:

```bash
pnpm exec tsx --test src/lib/vogue-prompt-composer-ui.test.ts
```

Expected: PASS.

---

### Task 7: Final Verification

**Files:**
- All touched files from Tasks 1-6.

**Step 1: Run targeted tests**

Run:

```bash
pnpm exec tsx --test src/lib/effects/generation-time-estimate.test.ts
pnpm exec tsx --test src/lib/effects/result-reveal-gate.test.ts
pnpm exec tsx --test src/lib/vogue-prompt-composer-ui.test.ts
```

Expected: all PASS.

**Step 2: Run typecheck**

Run:

```bash
pnpm run typecheck
```

Expected: PASS.

**Step 3: Run lint**

Run:

```bash
pnpm run lint
```

Expected: PASS or only pre-existing unrelated lint issues. If unrelated issues exist, record them clearly.

**Step 4: Manual QA**

Start the dev server:

```bash
pnpm run dev -- --port 3000
```

Open:

```text
http://localhost:3000/app
```

Check:
- Anonymous workspace shows standard ETA but keeps free-trial messaging.
- Free signed-in account shows standard ETA, progress bar, and upgrade CTA.
- Credit-pack-only account still shows standard ETA.
- Active subscription account shows `Faster generation active`.
- Standard successful generation does not expose the result for 10 seconds, but UI says finalizing.
- Faster successful generation returns normally.
- Switching model after submitting a task does not change that task's ETA.

**Step 5: Commit**

Only after the user confirms implementation:

```bash
git add src/lib/effects/generation-access.ts src/lib/effects/generation-time-estimate.ts src/lib/effects/generation-time-estimate.test.ts src/lib/effects/generation-access-server.ts src/lib/effects/result-reveal-gate.ts src/lib/effects/result-reveal-gate.test.ts src/app/api/effects/generate/route.ts src/app/api/effects/status/route.ts src/app/api/effects/callback/route.ts src/lib/effects/server-poller.ts src/lib/app/generated-workspace-feed.ts src/components/app/image-workspace-utils.ts src/components/app/ImageWorkspace.tsx src/components/app/VoguePromptComposer.tsx src/i18n/vogue.ts messages/en.json messages/zh.json messages/fr.json messages/ru.json messages/pt.json messages/ja.json messages/ko.json src/lib/vogue-prompt-composer-ui.test.ts
git commit -m "feat: add faster generation eta and standard reveal gate"
```

---

## Open Implementation Decisions

1. Server tier fallback: safest implementation is payment-row only. If we also trust `user.subscriptionState`, stale subscription states could incorrectly grant faster access. Recommended: payment-row only for server, `subscriptionState` only for optimistic client UI.
2. Basic subscription: this plan treats Basic as faster because the confirmed rule says paid subscription users get normal return, while one-time credit packs stay standard.
3. Anonymous standard delay: implement locally in the client because the anonymous status route is stateless.
