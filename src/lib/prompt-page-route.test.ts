import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { generateMetadata as generateLocalizedPromptMetadata } from '@/app/[locale]/prompt/[slug]/page';
import { generateMetadata as generatePromptMetadata } from '@/app/prompt/[slug]/page';
import { getIndexablePromptPageEntries } from '@/lib/prompts';
import { getPromptPagePath, getPromptPageSlug } from '@/lib/prompt-page-routes';
import { SOCIAL_PROMPT_PAGE_ENTRIES } from '@/lib/social-prompt-pages';
import { proxy } from '@/proxy';
import { NextRequest } from 'next/server';

test('localized prompt routes are non-indexable compatibility routes for numeric detail pages', async () => {
  const [entry] = getIndexablePromptPageEntries();

  assert.ok(entry, 'expected at least one indexable prompt page');
  const canonicalPath = getPromptPagePath(entry);

  const englishMetadata = await generateLocalizedPromptMetadata({
    params: Promise.resolve({
      locale: 'en',
      slug: entry.publicId,
    }),
  });
  const zhMetadata = await generateLocalizedPromptMetadata({
    params: Promise.resolve({
      locale: 'zh',
      slug: entry.publicId,
    }),
  });

  assert.deepEqual(englishMetadata.robots, { index: false, follow: true });
  assert.equal(englishMetadata.alternates?.canonical, canonicalPath);
  assert.equal(englishMetadata.openGraph?.url, canonicalPath);
  assert.deepEqual(zhMetadata.robots, { index: false, follow: true });
  assert.equal(zhMetadata.alternates?.canonical, canonicalPath);
  assert.equal(zhMetadata.openGraph?.url, canonicalPath);
  assert.equal('languages' in (englishMetadata.alternates ?? {}), false);
  assert.equal('languages' in (zhMetadata.alternates ?? {}), false);
});

test('gallery prompt detail links do not include the active locale prefix', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/components/prompts/VogueGalleryWorkspace.tsx'),
    'utf8'
  );

  assert.match(source, /getPromptDetailHref\(entry\)/);
  assert.match(source, /getPromptDetailHref\(detailEntry\)/);
  assert.doesNotMatch(source, /getUrlWithLocale\(`\/prompt\/\$\{entry\.publicId\}`/);
  assert.doesNotMatch(source, /getUrlWithLocale\(`\/prompt\/\$\{detailEntry\.publicId\}`/);
});

test('prompt detail routes bypass locale middleware and old numeric URLs 301 to slug-publicId canonical URLs', () => {
  const [entry] = getIndexablePromptPageEntries();
  const canonicalPath = getPromptPagePath(entry);
  const canonicalSlug = getPromptPageSlug(entry);
  const canonicalResponse = proxy(
    new NextRequest(`http://localhost:3000${canonicalPath}`)
  );
  const legacyNumericResponse = proxy(
    new NextRequest(`http://localhost:3000/prompt/${entry.publicId}`)
  );
  const localizedResponse = proxy(
    new NextRequest(`http://localhost:3000/zh/prompt/${entry.publicId}`)
  );
  const localizedCanonicalResponse = proxy(
    new NextRequest(`http://localhost:3000/zh/prompt/${canonicalSlug}`)
  );

  assert.equal(canonicalResponse.headers.get('x-middleware-rewrite'), null);
  assert.equal(canonicalResponse.headers.get('x-middleware-next'), '1');
  assert.equal(legacyNumericResponse.status, 301);
  assert.equal(
    new URL(String(legacyNumericResponse.headers.get('location'))).pathname,
    canonicalPath
  );
  assert.equal(localizedResponse.status, 301);
  assert.equal(
    new URL(String(localizedResponse.headers.get('location'))).pathname,
    canonicalPath
  );
  assert.equal(localizedCanonicalResponse.status, 301);
  assert.equal(
    new URL(String(localizedCanonicalResponse.headers.get('location'))).pathname,
    canonicalPath
  );
});

test('public homepage routes bypass locale middleware cookies', () => {
  const defaultHomeResponse = proxy(
    new NextRequest('http://localhost:3000/')
  );
  const zhHomeResponse = proxy(
    new NextRequest('http://localhost:3000/zh')
  );
  const localizedDefaultHomeResponse = proxy(
    new NextRequest('http://localhost:3000/en')
  );

  assert.equal(defaultHomeResponse.headers.get('x-middleware-next'), '1');
  assert.equal(defaultHomeResponse.headers.get('x-middleware-rewrite'), null);
  assert.equal(defaultHomeResponse.headers.get('set-cookie'), null);
  assert.equal(zhHomeResponse.headers.get('x-middleware-next'), '1');
  assert.equal(zhHomeResponse.headers.get('set-cookie'), null);
  assert.equal(localizedDefaultHomeResponse.status, 301);
  assert.equal(
    new URL(String(localizedDefaultHomeResponse.headers.get('location'))).pathname,
    '/'
  );
  assert.equal(localizedDefaultHomeResponse.headers.get('set-cookie'), null);
});

test('non-prompt collection and legacy effect routes resolve to canonical URLs', () => {
  const canonicalEarthZoomResponse = proxy(
    new NextRequest('http://localhost:3000/earth-zoom')
  );
  const localizedModelResponse = proxy(
    new NextRequest('http://localhost:3000/zh/model')
  );
  const legacyEarthZoomResponse = proxy(
    new NextRequest('http://localhost:3000/effect/earth-zoom')
  );
  const localizedLegacyEarthZoomResponse = proxy(
    new NextRequest('http://localhost:3000/zh/effect/earth-zoom')
  );

  assert.equal(canonicalEarthZoomResponse.headers.get('x-middleware-next'), '1');
  assert.equal(localizedModelResponse.status, 301);
  assert.equal(
    new URL(String(localizedModelResponse.headers.get('location'))).pathname,
    '/model'
  );
  assert.equal(legacyEarthZoomResponse.status, 301);
  assert.equal(
    new URL(String(legacyEarthZoomResponse.headers.get('location'))).pathname,
    '/earth-zoom'
  );
  assert.equal(localizedLegacyEarthZoomResponse.status, 301);
  assert.equal(
    new URL(
      String(localizedLegacyEarthZoomResponse.headers.get('location'))
    ).pathname,
    '/earth-zoom'
  );
});

test('social prompt detail metadata also stays single-language', async () => {
  const entry = SOCIAL_PROMPT_PAGE_ENTRIES.find(
    (item) => item.slug === 'image-to-video-ai-prompt-workflow'
  );

  assert.ok(entry, 'expected at least one social prompt page');

  const metadata = await generatePromptMetadata({
    params: Promise.resolve({ slug: entry.slug }),
  });

  assert.equal(metadata.alternates?.canonical, `/prompt/${entry.slug}`);
  assert.equal('languages' in (metadata.alternates ?? {}), false);
});
