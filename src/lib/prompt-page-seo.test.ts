import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildPromptPageJsonLd,
  buildPromptPageMetadata,
  getPromptPageCanonicalPath,
} from '@/lib/prompt-page-seo';
import {
  INDEXABLE_PROMPT_PAGE_LIMIT,
  getIndexablePromptPageEntries,
  getLocalizedPromptEntries,
  getPromptEntryById,
} from '@/lib/prompts';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import gscIndexedPromptPublicIds from '@/lib/generated/gsc-indexed-prompt-public-ids.json';

test('prompt page metadata follows the agreed SEO envelope', () => {
  const [entry] = getIndexablePromptPageEntries();

  assert.ok(entry, 'expected at least one indexable prompt page');

  const metadata = buildPromptPageMetadata(entry);
  const title = String(metadata.title ?? '');
  const description = String(metadata.description ?? '');

  assert.equal(title.length >= 40, true, title);
  assert.equal(title.length <= 60, true, title);
  assert.equal(description.length >= 140, true, description);
  assert.equal(description.length <= 166, true, description);
  assert.equal('keywords' in metadata, false);
  assert.deepEqual(metadata.robots, { index: true, follow: true });
  assert.equal(metadata.alternates?.canonical, getPromptPagePath(entry));
  assert.equal(metadata.openGraph?.url, getPromptPagePath(entry));
  assert.equal(
    (metadata.twitter as Record<string, unknown> | undefined)?.card,
    'summary_large_image'
  );
});

test('non-selected prompt page metadata is noindex follow but keeps canonical self', () => {
  const indexableIds = new Set(
    getIndexablePromptPageEntries().map((entry) => entry.publicId)
  );
  const nonIndexableEntry = getLocalizedPromptEntries('en').find(
    (entry) => !indexableIds.has(entry.publicId)
  );

  assert.ok(nonIndexableEntry, 'expected a non-indexable prompt entry');

  const metadata = buildPromptPageMetadata(nonIndexableEntry);

  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.equal(
    metadata.alternates?.canonical,
    getPromptPagePath(nonIndexableEntry)
  );
});

test('indexable prompt page descriptions are title and prompt specific', () => {
  const metadataItems = getIndexablePromptPageEntries().map((entry) =>
    buildPromptPageMetadata(entry)
  );
  const titles = metadataItems.map((metadata) => String(metadata.title ?? ''));
  const descriptions = metadataItems.map((metadata) =>
    String(metadata.description ?? '')
  );
  const uniqueTitles = new Set(titles);
  const uniqueDescriptions = new Set(descriptions);

  assert.equal(uniqueTitles.size, titles.length);
  assert.equal(uniqueDescriptions.size, descriptions.length);
  assert.equal(
    descriptions.every((description) => /Vogue AI/.test(description)),
    true
  );
});

test('prompt detail indexing stays limited to the GSC valid prompt allowlist', () => {
  const entries = getLocalizedPromptEntries('en');
  const gscIndexedPromptPublicIdSet = new Set(gscIndexedPromptPublicIds);
  const indexableMetadata = entries.filter((entry) => {
    const metadata = buildPromptPageMetadata(entry);

    return (
      typeof metadata.robots === 'object' &&
      metadata.robots !== null &&
      'index' in metadata.robots &&
      metadata.robots.index === true
    );
  });

  assert.equal(entries.length > INDEXABLE_PROMPT_PAGE_LIMIT, true);
  assert.equal(INDEXABLE_PROMPT_PAGE_LIMIT > 0, true);
  assert.equal(
    INDEXABLE_PROMPT_PAGE_LIMIT <= gscIndexedPromptPublicIdSet.size,
    true
  );
  assert.equal(indexableMetadata.length, INDEXABLE_PROMPT_PAGE_LIMIT);
  assert.deepEqual(
    indexableMetadata
      .filter((entry) => !gscIndexedPromptPublicIdSet.has(entry.publicId))
      .map((entry) => entry.publicId),
    []
  );
});

test('prompt page metadata avoids duplicate AI Prompt suffixes', () => {
  const entry = getPromptEntryById('030104001', 'en');

  assert.ok(entry, 'expected the Codex permission dialog prompt page');

  const metadata = buildPromptPageMetadata(entry);
  const title = String(metadata.title ?? '');

  assert.doesNotMatch(title, /AI Prompt AI Prompt|AI AI Prompt/);
  assert.equal(title, 'Codex macOS Permission Dialog UI AI Prompt | Vogue AI');
});

test('prompt page metadata avoids generic standalone AI before the prompt suffix', () => {
  const entries = ['010103069', '030106001'].map((publicId) =>
    getPromptEntryById(publicId, 'en')
  );

  assert.equal(entries.every(Boolean), true);

  const titles = entries.map((entry) =>
    String(buildPromptPageMetadata(entry!).title ?? '')
  );

  assert.deepEqual(titles, [
    'Beauty Editorial Closeup Portrait AI Prompt | Vogue AI',
    'Magical Realism Portrait AI Prompt | Vogue AI',
  ]);
  assert.equal(
    titles.every((title) => !/\bAI\s+(?:AI|Portrait\s+AI)\s+Prompt\b/.test(title)),
    true
  );
});

test('prompt page JSON-LD exposes CreativeWork, ImageObject, and WebPage nodes', () => {
  const [entry] = getIndexablePromptPageEntries();
  const jsonLd = buildPromptPageJsonLd(entry);

  assert.equal(jsonLd['@context'], 'https://schema.org');
  assert.equal(Array.isArray(jsonLd['@graph']), true);

  const graph = jsonLd['@graph'];
  assert.equal(graph.some((node) => node['@type'] === 'CreativeWork'), true);
  assert.equal(graph.some((node) => node['@type'] === 'ImageObject'), true);
  assert.equal(graph.some((node) => node['@type'] === 'WebPage'), true);
  assert.equal(
    graph.some((node) => node.url === `https://vogueai.net${getPromptPageCanonicalPath(entry)}`),
    true
  );
});
