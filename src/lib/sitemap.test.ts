import assert from 'node:assert/strict';
import test from 'node:test';

import sitemap from '@/app/sitemap';
import {
  NON_PROMPT_PAGE_SLUGS,
  getNonPromptPageConfig,
} from '@/lib/non-prompt-pages';

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
