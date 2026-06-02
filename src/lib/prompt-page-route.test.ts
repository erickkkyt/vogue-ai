import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { generateMetadata as generateLocalizedPromptMetadata } from '@/app/[locale]/prompt/[slug]/page';
import { generateMetadata as generatePromptMetadata } from '@/app/prompt/[slug]/page';
import { getIndexablePromptPageEntries } from '@/lib/prompts';
import { SOCIAL_PROMPT_PAGE_ENTRIES } from '@/lib/social-prompt-pages';
import { proxy } from '@/proxy';
import { NextRequest } from 'next/server';

test('localized prompt routes are non-indexable compatibility routes for numeric detail pages', async () => {
  const [entry] = getIndexablePromptPageEntries();

  assert.ok(entry, 'expected at least one indexable prompt page');

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
  assert.equal(englishMetadata.alternates?.canonical, `/prompt/${entry.publicId}`);
  assert.equal(englishMetadata.openGraph?.url, `/prompt/${entry.publicId}`);
  assert.deepEqual(zhMetadata.robots, { index: false, follow: true });
  assert.equal(zhMetadata.alternates?.canonical, `/prompt/${entry.publicId}`);
  assert.equal(zhMetadata.openGraph?.url, `/prompt/${entry.publicId}`);
  assert.equal('languages' in (englishMetadata.alternates ?? {}), false);
  assert.equal('languages' in (zhMetadata.alternates ?? {}), false);
});

test('gallery prompt detail links do not include the active locale prefix', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/components/prompts/VogueGalleryWorkspace.tsx'),
    'utf8'
  );

  assert.match(source, /getPromptDetailHref\(entry\.publicId\)/);
  assert.match(source, /getPromptDetailHref\(detailEntry\.publicId\)/);
  assert.doesNotMatch(source, /getUrlWithLocale\(`\/prompt\/\$\{entry\.publicId\}`/);
  assert.doesNotMatch(source, /getUrlWithLocale\(`\/prompt\/\$\{detailEntry\.publicId\}`/);
});

test('prompt detail routes bypass locale middleware and locale prefixes redirect to canonical URLs', () => {
  const canonicalResponse = proxy(
    new NextRequest('http://localhost:3000/prompt/010104001')
  );
  const localizedResponse = proxy(
    new NextRequest('http://localhost:3000/zh/prompt/010104001')
  );

  assert.equal(canonicalResponse.headers.get('x-middleware-rewrite'), null);
  assert.equal(canonicalResponse.headers.get('x-middleware-next'), '1');
  assert.equal(localizedResponse.status, 301);
  assert.equal(
    new URL(String(localizedResponse.headers.get('location'))).pathname,
    '/prompt/010104001'
  );
});

test('social prompt detail metadata also stays single-language', async () => {
  const [entry] = SOCIAL_PROMPT_PAGE_ENTRIES;

  assert.ok(entry, 'expected at least one social prompt page');

  const metadata = await generatePromptMetadata({
    params: Promise.resolve({ slug: entry.slug }),
  });

  assert.equal(metadata.alternates?.canonical, `/prompt/${entry.slug}`);
  assert.equal('languages' in (metadata.alternates ?? {}), false);
});
