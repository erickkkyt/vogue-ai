import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import sitemap from '@/app/sitemap';
import {
  getIndexablePromptPageEntries,
  getLocalizedPromptEntries,
} from '@/lib/prompts';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import {
  PROMPT_SEO_LANDING_PAGE_SLUGS,
  getPromptSeoLandingPageConfig,
} from '@/lib/prompt-seo-landing-pages';

const RETIRED_NON_PROMPT_PATHS = [
  '/effect',
  '/model',
  '/earth-zoom',
  '/effect/earth-zoom',
  '/seedance',
  '/ai-baby-podcast',
  '/lipsync',
  '/hailuo-ai-video-generator',
  '/veo-3-generator',
  '/ai-baby-generator',
];

const ACTIVE_NON_SITEMAP_PAGE_FILES = [
  'src/app/app/page.tsx',
  'src/app/assets/page.tsx',
  'src/app/payment/return/page.tsx',
];

test('sitemap excludes internal app workspace routes', () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);

  assert.equal(urls.includes('/app'), false);
  assert.equal(urls.some((pathname) => /^\/[a-z]{2}\/app$/.test(pathname)), false);
});

test('active non-sitemap product routes declare noindex metadata', () => {
  for (const relativePath of ACTIVE_NON_SITEMAP_PAGE_FILES) {
    const source = readFileSync(join(process.cwd(), relativePath), 'utf8');

    assert.match(source, /robots:\s*{/);
    assert.match(source, /index:\s*false/);
  }
});

test('robots allows noindex HTML routes to be crawled for deindexing', () => {
  const robots = readFileSync(join(process.cwd(), 'public/robots.txt'), 'utf8');
  const genericRobotsBlock = robots.slice(
    robots.indexOf('User-agent: *'),
    robots.indexOf('# 网站地图')
  );

  for (const path of ['/login', '/auth/', '/assets/', '/payment/']) {
    assert.doesNotMatch(
      genericRobotsBlock,
      new RegExp(`^Disallow:\\s*${path.replaceAll('/', '\\/')}$`, 'm'),
      `${path} should rely on page robots metadata, not robots.txt blocking`
    );
  }
});

test('sitemap excludes retired non-prompt tool and collection routes', () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);

  for (const path of RETIRED_NON_PROMPT_PATHS) {
    assert.equal(urls.includes(path), false, `${path} should not be in sitemap`);
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
