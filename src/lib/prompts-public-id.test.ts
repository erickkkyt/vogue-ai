import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getIndexableRelatedPromptEntries,
  getRelatedPromptEntries,
  getIndexablePromptPageEntries,
  getLocalizedIndexablePromptGalleryEntries,
  getLocalizedPromptEntries,
  getPromptEntryById,
  type VoguePromptEntry,
} from '@/lib/prompts';
import {
  PROMPT_SEO_LANDING_PAGE_SLUGS,
  getPromptSeoLandingPageConfig,
} from '@/lib/prompt-seo-landing-pages';
import gscIndexedPromptPublicIds from '@/lib/generated/gsc-indexed-prompt-public-ids.json';
import stablePromptPublicIds from '@/lib/generated/prompt-public-ids.json';

const sourcePrefixForEntry = (entry: VoguePromptEntry) => {
  if (entry.sourceType === 'vogueai') {
    return '03';
  }

  const sourceUrl = entry.sourceUrl ?? '';

  if (/https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\//.test(sourceUrl)) {
    return '01';
  }

  return '02';
};

test('prompt entries expose stable 9 digit public ids from source, model, category, and sequence', () => {
  const entries = getLocalizedPromptEntries('en');
  const publicIds = entries.map((entry) => entry.publicId);

  assert.equal(publicIds.length > 1000, true);
  assert.equal(new Set(publicIds).size, publicIds.length);

  for (const entry of entries) {
    assert.match(entry.publicId, /^\d{9}$/);
    if ((stablePromptPublicIds as Record<string, string>)[entry.id] !== entry.publicId) {
      assert.equal(entry.publicId.slice(0, 2), sourcePrefixForEntry(entry));
    }
  }
});

test('prompt source links only expose X and Twitter URLs', () => {
  const entries = getLocalizedPromptEntries('en');
  const linkedEntries = entries.filter((entry) => entry.sourceUrl);
  const suppressedSourceNamePattern =
    /\b(?:meigen|nanobanana(?:\.org)?|nanobanana org|nano banana inspiration)\b/i;

  assert.equal(linkedEntries.length > 1000, true);

  for (const entry of linkedEntries) {
    assert.match(
      entry.sourceUrl ?? '',
      /^https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\//
    );
  }

  const meigenEntry = getPromptEntryById('020101200', 'en');
  const nanoBananaEntry = getPromptEntryById('020207001', 'en');
  const xEntry = getPromptEntryById('010104001', 'en');

  assert.ok(meigenEntry);
  assert.ok(nanoBananaEntry);
  assert.ok(xEntry);
  assert.equal(meigenEntry.sourceUrl, null);
  assert.doesNotMatch(
    meigenEntry.imagePrompts?.map((imagePrompt) => imagePrompt.title).join(' ') ??
      '',
    suppressedSourceNamePattern
  );
  assert.equal(nanoBananaEntry.sourceUrl, null);
  assert.equal(nanoBananaEntry.authorName, 'Vogue AI');
  assert.equal(nanoBananaEntry.authorHandle, '');
  assert.doesNotMatch(
    [
      nanoBananaEntry.sourceTitle,
      nanoBananaEntry.authorName,
      nanoBananaEntry.authorHandle,
    ].join(' '),
    suppressedSourceNamePattern
  );
  assert.match(xEntry.sourceUrl ?? '', /^https:\/\/x\.com\//);

  for (const entry of entries) {
    const visibleSourceFields = [
      entry.title,
      entry.sourceTitle,
      entry.authorName,
      entry.authorHandle,
      ...(entry.imagePrompts?.map((imagePrompt) => imagePrompt.title) ?? []),
    ].join(' ');

    assert.doesNotMatch(
      visibleSourceFields,
      suppressedSourceNamePattern,
      `${entry.publicId} should not expose suppressed source names`
    );
  }
});

test('prompt lookup accepts both legacy ids and numeric public ids without localizing the source prompt', () => {
  const localizedEntry = getLocalizedPromptEntries('en')
    .map((entry) => getPromptEntryById(entry.id, 'zh'))
    .find((entry) => entry?.promptTranslations?.zh);

  assert.ok(localizedEntry, 'expected a localized prompt entry');

  const byLegacyId = getPromptEntryById(localizedEntry.id, 'zh');
  const byPublicId = getPromptEntryById(localizedEntry.publicId, 'zh');
  const englishEntry = getPromptEntryById(localizedEntry.id, 'en');

  assert.ok(byLegacyId);
  assert.ok(byPublicId);
  assert.ok(englishEntry);
  assert.equal(byPublicId.id, localizedEntry.id);
  assert.equal(byPublicId.publicId, localizedEntry.publicId);
  assert.equal(byPublicId.prompt, englishEntry.prompt);
  assert.equal(byPublicId.promptTranslations?.zh, localizedEntry.promptTranslations?.zh);
  assert.notEqual(byPublicId.promptTranslations?.zh, byPublicId.prompt);
});

test('legacy prompt public id remains pinned after prompt cleanup drops records', () => {
  const entry = getPromptEntryById('010307008', 'zh');

  assert.ok(entry);
  assert.equal(entry.id, 'x-2059998163532952054');
  assert.match(entry.prompt, /^35mm duotone photo of Cillian Murphy/);
  assert.doesNotMatch(entry.prompt, /Midjourney \+|See attached/);
  assert.doesNotMatch(entry.promptTranslations?.zh ?? '', /Midjourney \+|See attached/);
});

test('VogueAI original prompt pages group same-type images with image-level prompts', () => {
  const permissionEntry = getPromptEntryById('030104001', 'zh');
  const travelEntry = getPromptEntryById('030108001', 'zh');
  const posterEntry = getPromptEntryById('030102001', 'zh');

  assert.ok(permissionEntry);
  assert.equal(
    permissionEntry.id,
    'vogueai-20260603-codex-macos-permission-dialog-ai-prompt'
  );
  assert.equal(permissionEntry.categoryKey, 'ui');
  assert.equal(permissionEntry.images.length, 2);
  assert.equal(permissionEntry.imagePrompts?.length, 2);
  assert.match(permissionEntry.imagePrompts?.[0]?.prompt ?? '', /OnlyFans/);
  assert.match(permissionEntry.imagePrompts?.[1]?.prompt ?? '', /Steam/);

  assert.ok(travelEntry);
  assert.equal(travelEntry.id, 'vogueai-20260603-watercolor-travel-poster-ai-prompt');
  assert.equal(travelEntry.categoryKey, 'art');
  assert.equal(travelEntry.images.length, 4);
  assert.equal(travelEntry.imagePrompts?.length, 4);
  assert.match(travelEntry.imagePrompts?.[1]?.prompt ?? '', /Paris travel journal/);
  assert.match(
    travelEntry.imagePrompts?.[1]?.promptTranslations?.zh ?? '',
    /巴黎|Paris/
  );

  assert.ok(posterEntry);
  assert.equal(
    posterEntry.id,
    'vogueai-20260603-double-exposure-city-poster-ai-prompt'
  );
  assert.equal(posterEntry.categoryKey, 'poster');
  assert.equal(posterEntry.images.length, 3);
  assert.equal(posterEntry.imagePrompts?.length, 3);
  assert.match(posterEntry.imagePrompts?.[2]?.prompt ?? '', /Jalen Brunson/);
  assert.match(
    posterEntry.imagePrompts?.[2]?.promptTranslations?.zh ?? '',
    /布伦森|Brunson/
  );
});

test('non-English source prompts keep the original text and expose English as a language variant', () => {
  const entry = getPromptEntryById('x-2048529821706195442', 'en');

  assert.ok(entry);
  assert.match(entry.prompt, /精致立体刺绣风插画/);
  assert.equal(entry.originalPrompt, entry.prompt);
  assert.match(
    entry.promptTranslations?.en ?? '',
    /Delicate three-dimensional embroidered-style illustration/
  );
  assert.notEqual(entry.promptTranslations?.en, entry.prompt);
});

test('indexable prompt pages are a selected English subset with numeric public ids', () => {
  const allEntries = getLocalizedPromptEntries('en');
  const indexableEntries = getIndexablePromptPageEntries();
  const gscIndexedPromptPublicIdSet = new Set(gscIndexedPromptPublicIds);

  assert.equal(indexableEntries.length > 0, true);
  assert.equal(indexableEntries.length < allEntries.length, true);
  assert.equal(indexableEntries.length <= gscIndexedPromptPublicIdSet.size, true);

  for (const entry of indexableEntries) {
    assert.match(entry.publicId, /^\d{9}$/);
    assert.equal(gscIndexedPromptPublicIdSet.has(entry.publicId), true);
    assert.equal(entry.prompt, getPromptEntryById(entry.publicId, 'en')?.prompt);
  }
});

test('prompt SEO landing galleries only expose indexable detail links', () => {
  const indexableIds = new Set(
    getIndexablePromptPageEntries().map((entry) => entry.publicId)
  );
  const modelLandingConfigs = PROMPT_SEO_LANDING_PAGE_SLUGS.map((slug) =>
    getPromptSeoLandingPageConfig(slug)
  ).filter((config) => Boolean(config.modelId));

  for (const config of modelLandingConfigs) {
    const landingEntries = getLocalizedIndexablePromptGalleryEntries('en', {
      limit: 96,
      modelId: config.modelId,
    });

    assert.deepEqual(
      landingEntries
        .filter((entry) => !indexableIds.has(entry.publicId))
        .map((entry) => entry.publicId),
      [],
      `${config.path} should not expose non-indexable prompt detail links`
    );
  }
});

test('related prompt entries can use highly relevant routable pages beyond the initial sitemap pool', () => {
  const indexableEntries = getIndexablePromptPageEntries();
  const indexableIds = new Set(indexableEntries.map((entry) => entry.publicId));
  const uiEntry = getPromptEntryById('010104001', 'en');

  assert.ok(uiEntry, 'expected the Oda Nobunaga X post prompt');

  const relatedEntries = getRelatedPromptEntries(uiEntry, 3);

  assert.equal(relatedEntries.length, 3);
  assert.equal(
    relatedEntries.some((entry) => !indexableIds.has(entry.publicId)),
    true
  );
  assert.equal(
    relatedEntries.some((entry) => entry.publicId === uiEntry.publicId),
    false
  );
  assert.equal(
    relatedEntries.every((entry) => entry.categoryKey === uiEntry.categoryKey),
    true
  );
  for (const entry of relatedEntries) {
    assert.match(entry.publicId, /^\d{9}$/);
    assert.equal(Boolean(entry.seoSlug), true);
    assert.equal(entry.images.length > 0, true);
    assert.match(
      entry.title,
      /Page|Post|Profile|Social|Mockup|Feed|LP|Banner|Hero|Homepage|SaaS|UI/i
    );
  }
});

test('public prompt detail related links stay inside the indexable prompt pool', () => {
  const indexableEntries = getIndexablePromptPageEntries();
  const indexableIds = new Set(indexableEntries.map((entry) => entry.publicId));
  const relatedById = new Map<
    string,
    ReturnType<typeof getIndexableRelatedPromptEntries>
  >();

  for (const sourceEntry of indexableEntries) {
    const relatedEntries = getIndexableRelatedPromptEntries(sourceEntry, 3);

    assert.equal(relatedEntries.length, 3, sourceEntry.publicId);
    relatedById.set(sourceEntry.publicId, relatedEntries);
    assert.deepEqual(
      relatedEntries
        .filter((entry) => !indexableIds.has(entry.publicId))
        .map((entry) => entry.publicId),
      [],
      `${sourceEntry.publicId} should only link indexable related prompts`
    );
    assert.equal(
      relatedEntries.some((entry) => entry.publicId === sourceEntry.publicId),
      false,
      `${sourceEntry.publicId} should not link itself`
    );
  }

  for (const [sourcePublicId, relatedEntries] of relatedById) {
    for (const relatedEntry of relatedEntries) {
      const targetRelatedEntries = relatedById.get(relatedEntry.publicId) ?? [];
      assert.equal(
        targetRelatedEntries.some(
          (targetRelatedEntry) => targetRelatedEntry.publicId === sourcePublicId
        ),
        false,
        `${sourcePublicId} and ${relatedEntry.publicId} should not link each other`
      );
    }
  }
});

test('related prompt coverage keeps useful incoming links without weakening same-category quality', () => {
  const uiEntries = getLocalizedPromptEntries('en').filter(
    (entry) => entry.categoryKey === 'ui'
  );
  const incomingCounts = new Map<string, number>(
    uiEntries.map((entry) => [entry.publicId, 0] as const)
  );

  for (const sourceEntry of uiEntries) {
    const relatedEntries = getRelatedPromptEntries(sourceEntry, 3);

    assert.equal(relatedEntries.length, 3);
    assert.equal(
      relatedEntries.every(
        (relatedEntry) => relatedEntry.categoryKey === sourceEntry.categoryKey
      ),
      true
    );

    for (const relatedEntry of relatedEntries) {
      if (incomingCounts.has(relatedEntry.publicId)) {
        incomingCounts.set(
          relatedEntry.publicId,
          (incomingCounts.get(relatedEntry.publicId) ?? 0) + 1
        );
      }
    }
  }

  const coveredUiPages = [...incomingCounts.values()].filter(
    (count) => count > 0
  ).length;

  assert.equal(uiEntries.length >= 35, true);
  assert.equal(coveredUiPages >= 30, true);
});

test('related prompt graph avoids immediate reciprocal loops while preserving coverage', () => {
  const entries = getLocalizedPromptEntries('en');
  const relatedById = new Map<string, ReturnType<typeof getRelatedPromptEntries>>();
  const incomingCounts = new Map<string, number>(
    entries.map((entry) => [entry.publicId, 0] as const)
  );
  let totalLinks = 0;

  for (const sourceEntry of entries) {
    const relatedEntries = getRelatedPromptEntries(sourceEntry, 3);

    assert.equal(relatedEntries.length, 3);
    relatedById.set(sourceEntry.publicId, relatedEntries);
    totalLinks += relatedEntries.length;

    for (const relatedEntry of relatedEntries) {
      incomingCounts.set(
        relatedEntry.publicId,
        (incomingCounts.get(relatedEntry.publicId) ?? 0) + 1
      );
    }
  }

  let reciprocalLinks = 0;

  for (const [sourcePublicId, relatedEntries] of relatedById) {
    for (const relatedEntry of relatedEntries) {
      const targetRelatedEntries = relatedById.get(relatedEntry.publicId) ?? [];
      if (
        targetRelatedEntries.some(
          (targetRelatedEntry) =>
            targetRelatedEntry.publicId === sourcePublicId
        )
      ) {
        reciprocalLinks += 1;
      }
    }
  }

  const coveredEntries = [...incomingCounts.values()].filter(
    (count) => count > 0
  ).length;

  assert.equal(totalLinks, entries.length * 3);
  assert.equal(reciprocalLinks, 0);
  assert.equal(coveredEntries >= 1050, true);
});

test('related prompt scoring keeps visual workflow similarity while avoiding obvious bounce-backs', () => {
  const entry = getPromptEntryById('010104001', 'en');
  const ryomaEntry = getPromptEntryById('010104038', 'en');

  assert.ok(entry, 'expected the Oda Nobunaga X post prompt');
  assert.ok(ryomaEntry, 'expected the Ryoma X post prompt');

  const relatedEntries = getRelatedPromptEntries(entry, 3);
  const ryomaRelatedEntries = getRelatedPromptEntries(ryomaEntry, 3);

  assert.equal(relatedEntries.length, 3);
  assert.equal(
    relatedEntries.every(
      (relatedEntry) => relatedEntry.categoryKey === entry.categoryKey
    ),
    true
  );
  assert.equal(
    relatedEntries.some((relatedEntry) =>
      /Page|Post|Profile|Social|Feed|LP|Banner|Homepage|SaaS|Mockup|UI/i.test(
        relatedEntry.title
      )
    ),
    true
  );
  assert.equal(
    relatedEntries.some(
      (relatedEntry) => relatedEntry.publicId === ryomaEntry.publicId
    ) &&
      ryomaRelatedEntries.some(
        (relatedEntry) => relatedEntry.publicId === entry.publicId
      ),
    false
  );
});
