import assert from 'node:assert/strict';
import test from 'node:test';

import sitemap from '@/app/sitemap';
import {
  NON_PROMPT_PAGE_SLUGS,
  getNonPromptPageConfig,
} from '@/lib/non-prompt-pages';
import {
  NON_PROMPT_COLLECTION_SLUGS,
  getNonPromptCollectionConfig,
} from '@/lib/non-prompt-collections';
import {
  getIndexablePromptPageEntries,
  getLocalizedPromptEntries,
} from '@/lib/prompts';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import {
  PROMPT_SEO_LANDING_PAGE_SLUGS,
  getPromptSeoLandingPageConfig,
} from '@/lib/prompt-seo-landing-pages';

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

  assert.equal(urls.includes('/effect/earth-zoom'), false);
  assert.equal(urls.includes('/earth-zoom'), true);
});

test('sitemap includes every non-prompt collection page once', () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);

  for (const slug of NON_PROMPT_COLLECTION_SLUGS) {
    const path = getNonPromptCollectionConfig(slug).path;

    assert.equal(
      urls.filter((url) => url === path).length,
      1,
      `${path} should be emitted once from the non-prompt collection registry`
    );
  }
});

test('sitemap includes every prompt SEO landing page once', () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);

  for (const slug of PROMPT_SEO_LANDING_PAGE_SLUGS) {
    const path = getPromptSeoLandingPageConfig(slug).path;

    assert.equal(
      urls.filter((url) => url === path).length,
      1,
      `${path} should be emitted once from the prompt SEO landing registry`
    );
    assert.equal(
      urls.some((url) => /^\/[a-z]{2}\//.test(url) && url.endsWith(path)),
      false,
      `${path} should not be emitted as a localized landing page`
    );
  }
});

test('sitemap includes only selected English slug-publicId prompt detail pages', () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);
  const promptUrls = urls.filter((pathname) =>
    /^\/prompt\/[a-z0-9-]+-\d{9}$/.test(pathname)
  );
  const legacyNumericPromptUrls = urls.filter((pathname) =>
    /^\/prompt\/\d{9}$/.test(pathname)
  );
  const localizedPromptUrls = urls.filter((pathname) =>
    /^\/[a-z]{2}\/prompt\//.test(pathname)
  );
  const indexableEntries = getIndexablePromptPageEntries();
  const allEntries = getLocalizedPromptEntries('en');

  assert.deepEqual(
    promptUrls.toSorted(),
    indexableEntries.map((entry) => getPromptPagePath(entry)).toSorted()
  );
  assert.equal(legacyNumericPromptUrls.length, 0);
  assert.equal(localizedPromptUrls.length, 0);
  assert.equal(promptUrls.length < allEntries.length, true);
});
