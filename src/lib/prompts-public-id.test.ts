import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getIndexablePromptPageEntries,
  getLocalizedPromptEntries,
  getPromptEntryById,
  type VoguePromptEntry,
} from '@/lib/prompts';

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
    assert.equal(entry.publicId.slice(0, 2), sourcePrefixForEntry(entry));
  }
});

test('prompt lookup accepts both legacy ids and numeric public ids without localizing the source prompt', () => {
  const localizedEntry = getLocalizedPromptEntries('zh').find(
    (entry) => entry.promptTranslations?.zh
  );

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

  assert.equal(indexableEntries.length > 0, true);
  assert.equal(indexableEntries.length < allEntries.length, true);

  for (const entry of indexableEntries) {
    assert.match(entry.publicId, /^\d{9}$/);
    assert.equal(entry.prompt, getPromptEntryById(entry.publicId, 'en')?.prompt);
  }
});
