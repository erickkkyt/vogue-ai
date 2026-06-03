import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildPromptPageJsonLd,
  buildPromptPageMetadata,
  getPromptPageCanonicalPath,
} from '@/lib/prompt-page-seo';
import {
  getIndexablePromptPageEntries,
  getLocalizedPromptEntries,
  getPromptEntryById,
} from '@/lib/prompts';

test('prompt page metadata follows the agreed SEO envelope', () => {
  const [entry] = getIndexablePromptPageEntries();

  assert.ok(entry, 'expected at least one indexable prompt page');

  const metadata = buildPromptPageMetadata(entry);
  const title = String(metadata.title ?? '');
  const description = String(metadata.description ?? '');

  assert.equal(title.length >= 40, true, title);
  assert.equal(title.length <= 55, true, title);
  assert.equal(description.length >= 140, true, description);
  assert.equal(description.length <= 166, true, description);
  assert.equal('keywords' in metadata, false);
  assert.deepEqual(metadata.robots, { index: true, follow: true });
  assert.equal(metadata.alternates?.canonical, `/prompt/${entry.publicId}`);
  assert.equal(metadata.openGraph?.url, `/prompt/${entry.publicId}`);
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
  assert.equal(metadata.alternates?.canonical, `/prompt/${nonIndexableEntry.publicId}`);
});

test('prompt page metadata avoids duplicate AI Prompt suffixes', () => {
  const entry = getPromptEntryById('030104001', 'en');

  assert.ok(entry, 'expected the Codex permission dialog prompt page');

  const metadata = buildPromptPageMetadata(entry);
  const title = String(metadata.title ?? '');

  assert.doesNotMatch(title, /AI Prompt AI Prompt|AI AI Prompt/);
  assert.equal(title, 'Codex macOS Permission Dialog AI Prompt | Vogue AI');
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
