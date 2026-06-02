import assert from 'node:assert/strict';
import test from 'node:test';

import sitemap from '@/app/sitemap';
import {
  NON_PROMPT_PAGE_SLUGS,
  getNonPromptPageConfig,
} from '@/lib/non-prompt-pages';
import {
  getIndexablePromptPageEntries,
  getLocalizedPromptEntries,
} from '@/lib/prompts';

test('sitemap excludes internal app workspace routes', () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);

  assert.equal(urls.includes('/app'), false);
  assert.equal(urls.some((pathname) => /^\/[a-z]{2}\/app$/.test(pathname)), false);
});

test('sitemap includes every JSON-backed non-prompt tool page once', () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);

  for (const slug of NON_PROMPT_PAGE_SLUGS) {
    const path = getNonPromptPageConfig(slug).path;

    assert.equal(
      urls.filter((url) => url === path).length,
      1,
      `${path} should be emitted once from the non-prompt registry`
    );
  }
});

test('sitemap includes only selected English numeric prompt detail pages', () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);
  const promptUrls = urls.filter((pathname) => /^\/prompt\/\d{9}$/.test(pathname));
  const localizedPromptUrls = urls.filter((pathname) =>
    /^\/[a-z]{2}\/prompt\/\d{9}$/.test(pathname)
  );
  const indexableEntries = getIndexablePromptPageEntries();
  const allEntries = getLocalizedPromptEntries('en');

  assert.deepEqual(
    promptUrls.toSorted(),
    indexableEntries
      .map((entry) => `/prompt/${entry.publicId}`)
      .toSorted()
  );
  assert.equal(localizedPromptUrls.length, 0);
  assert.equal(promptUrls.length < allEntries.length, true);
});
