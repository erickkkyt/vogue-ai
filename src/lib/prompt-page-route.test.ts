import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { generateMetadata as generatePromptMetadata } from '@/app/prompt/[slug]/page';
import { getIndexablePromptPageEntries } from '@/lib/prompts';
import { getPromptPagePath, getPromptPageSlug } from '@/lib/prompt-page-routes';
import { SOCIAL_PROMPT_PAGE_ENTRIES } from '@/lib/social-prompt-pages';
import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';

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

test('localized prompt detail routes have no page shell and redirect to canonical English URLs', () => {
  const [entry] = getIndexablePromptPageEntries();

  assert.ok(entry, 'expected at least one indexable prompt page');
  const canonicalPath = getPromptPagePath(entry);
  const localizedPromptPagePath = join(
    process.cwd(),
    'src/app/[locale]/prompt/[slug]/page.tsx'
  );
  const localizedResponse = middleware(
    new NextRequest(`http://localhost:3000/zh/prompt/${entry.publicId}`)
  );

  assert.equal(existsSync(localizedPromptPagePath), false);
  assert.equal(localizedResponse.status, 301);
  assert.equal(
    new URL(String(localizedResponse.headers.get('location'))).pathname,
    canonicalPath
  );
});

test('gallery prompt detail links do not include the active locale prefix', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/components/prompts/VogueGalleryWorkspace.tsx'),
    'utf8'
  );

  assert.match(source, /getPromptDetailHref\(entry\)/);
  assert.match(source, /getPromptDetailHrefWithImage\(detailEntry, imageIndex\)/);
  assert.doesNotMatch(source, /getUrlWithLocale\(`\/prompt\/\$\{entry\.publicId\}`/);
  assert.doesNotMatch(source, /getUrlWithLocale\(`\/prompt\/\$\{detailEntry\.publicId\}`/);
});

test('prompt detail routes bypass locale middleware and old numeric URLs 301 to slug-publicId canonical URLs', () => {
  const [entry] = getIndexablePromptPageEntries();
  const canonicalPath = getPromptPagePath(entry);
  const canonicalSlug = getPromptPageSlug(entry);
  const canonicalResponse = middleware(
    new NextRequest(`http://localhost:3000${canonicalPath}`)
  );
  const legacyNumericResponse = middleware(
    new NextRequest(`http://localhost:3000/prompt/${entry.publicId}`)
  );
  const localizedResponse = middleware(
    new NextRequest(`http://localhost:3000/zh/prompt/${entry.publicId}`)
  );
  const localizedCanonicalResponse = middleware(
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
  const defaultHomeResponse = middleware(
    new NextRequest('http://localhost:3000/')
  );
  const zhHomeResponse = middleware(
    new NextRequest('http://localhost:3000/zh')
  );
  const localizedDefaultHomeResponse = middleware(
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

test('payment return route bypasses locale middleware so checkout callbacks resolve', () => {
  const response = middleware(
    new NextRequest(
      'http://localhost:3000/payment/return?session_id=cs_test_dummy'
    )
  );

  assert.equal(response.headers.get('x-middleware-next'), '1');
  assert.equal(response.headers.get('x-middleware-rewrite'), null);
  assert.equal(response.headers.get('location'), null);
});

test('retired non-prompt routes return 410 without locale or legacy redirects', () => {
  for (const path of RETIRED_NON_PROMPT_PATHS) {
    const canonicalResponse = middleware(
      new NextRequest(`http://localhost:3000${path}`)
    );
    const localizedResponse = middleware(
      new NextRequest(`http://localhost:3000/zh${path}`)
    );
    const trailingSlashResponse = middleware(
      new NextRequest(`http://localhost:3000${path}/`)
    );

    assert.equal(canonicalResponse.status, 410, path);
    assert.equal(localizedResponse.status, 410, `/zh${path}`);
    assert.equal(trailingSlashResponse.status, 410, `${path}/`);
    assert.equal(canonicalResponse.headers.get('location'), null, path);
    assert.equal(localizedResponse.headers.get('location'), null, `/zh${path}`);
    assert.equal(trailingSlashResponse.headers.get('location'), null, `${path}/`);
  }
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
  assert.deepEqual(metadata.robots, { index: false, follow: true });
});
