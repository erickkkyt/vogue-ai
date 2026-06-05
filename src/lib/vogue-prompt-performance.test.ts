import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  getLocalizedPromptGalleryEntries,
  getPromptEntryById,
  getPromptGalleryCounts,
} from './prompts';
import {
  getVogueCopyFromMessages,
  type VogueLocale,
  type VogueUICopy,
} from '@/i18n/vogue';
import type { Messages } from 'next-intl';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const readVogueCopy = (locale: VogueLocale): VogueUICopy =>
  getVogueCopyFromMessages(
    JSON.parse(read(`messages/${locale}.json`)) as Messages
  );

test('homepage prompt gallery entries keep the initial payload lightweight', () => {
  const entries = getLocalizedPromptGalleryEntries('zh', { limit: 12 });
  assert.equal(entries.length, 12);

  for (const entry of entries) {
    assert.equal('prompt' in entry, false);
    assert.equal('originalPrompt' in entry, false);
    assert.equal('categoryText' in entry, false);
    assert.equal('description' in entry, false);
    assert.equal(entry.images.length, 1);
    assert.match(entry.images[0], /^\/api\/gpt-image-2-prompts\/thumbnail/);
    assert.equal(entry.images[0].includes('prompt-libraries'), false);
    assert.ok(entry.imageCount >= 1);
    assert.ok(entry.imageDimensions?.width);
    assert.ok(entry.imageDimensions?.height);
  }
});

test('homepage prompt gallery shows newest entries first without changing public ids', () => {
  const entries = getLocalizedPromptGalleryEntries('en', { limit: 24 });
  assert.equal(entries.length, 24);

  for (let index = 1; index < entries.length; index += 1) {
    const previousPublishedAt = entries[index - 1]?.publishedAtMs ?? 0;
    const currentPublishedAt = entries[index]?.publishedAtMs ?? 0;

    assert.ok(
      previousPublishedAt >= currentPublishedAt,
      `expected entry ${index - 1} (${previousPublishedAt}) to be newer than entry ${index} (${currentPublishedAt})`
    );
  }

  assert.equal(
    getPromptEntryById('010102002', 'en')?.id,
    'x-2045368305079447853'
  );
});

test('homepage uses lightweight gallery data instead of serializing the full prompt library', () => {
  const page = read('src/app/page.tsx');
  const localizedPage = read('src/app/[locale]/page.tsx');
  const apiRoute = read('src/app/api/gpt-image-2-prompts/entries/route.ts');
  const thumbnailRoute = read(
    'src/app/api/gpt-image-2-prompts/thumbnail/route.ts'
  );
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(page, /HOME_GALLERY_PAGE_SIZE/);
  assert.match(page, /HOME_GALLERY_PAGE_SIZE = 12/);
  assert.match(page, /getLocalizedPromptGalleryEntries\(locale/);
  assert.doesNotMatch(page, /getLocalizedPromptEntries\(locale\)/);
  assert.match(page, /getPromptGalleryCounts\(\)/);
  assert.doesNotMatch(page, /searchParams/);
  assert.doesNotMatch(localizedPage, /searchParams/);
  assert.match(gallery, /readInitialGalleryFiltersFromUrl/);

  assert.match(apiRoute, /mode.*gallery/);
  assert.match(apiRoute, /getLocalizedPromptGalleryEntries/);
  assert.match(apiRoute, /getPromptEntryById/);

  assert.match(gallery, /fetchFullPromptEntry/);
  assert.match(gallery, /\/api\/gpt-image-2-prompts\/entries/);
  assert.match(gallery, /\/api\/gpt-image-2-prompts\/thumbnail/);
  assert.match(gallery, /<Image/);
  assert.match(gallery, /unoptimized/);
  assert.match(gallery, /entryModelIcon/);
  assert.doesNotMatch(gallery, /getCardModelBadgeLabel/);
  assert.doesNotMatch(gallery, /entryModelShortTag/);
  assert.doesNotMatch(gallery, /entryModelTag/);
  assert.doesNotMatch(gallery, /promptText = entry\.prompt/);

  assert.match(thumbnailRoute, /getPromptEntryById/);
  assert.match(thumbnailRoute, /fetch\(imageUrl/);
  assert.match(thumbnailRoute, /THUMBNAIL_FETCH_TIMEOUT_MS/);
  assert.match(thumbnailRoute, /AbortController/);
});

test('gallery load-more keeps card ids unique when the same page is requested twice', () => {
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(gallery, /dedupeGalleryEntries\(entries\)/);
  assert.match(gallery, /mergeUniqueGalleryEntries\(current, nextEntries\)/);
  assert.match(gallery, /inFlightGalleryPageKeysRef/);
  assert.doesNotMatch(gallery, /\[\.\.\.current,\s*\.\.\.nextEntries\]/);
});

test('homepage gallery prioritizes only the first visible cards for LCP', () => {
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(gallery, /HOMEPAGE_EAGER_CARD_COUNT = 2/);
  assert.match(gallery, /const eagerCardCount = Math\.max\(HOMEPAGE_EAGER_CARD_COUNT, columnCount \* 2\)/);
  assert.match(gallery, /eagerLoad=\{index < eagerCardCount\}/);
  assert.match(gallery, /loading=\{eagerLoad \? 'eager' : 'lazy'\}/);
  assert.match(gallery, /fetchPriority=\{eagerLoad \? 'high' : 'auto'\}/);
  assert.match(gallery, /rootMargin: '600px 0px'/);
  assert.doesNotMatch(gallery, /rootMargin: '900px 0px'/);
});

test('prompt thumbnails use a long immutable cache lifetime', () => {
  const thumbnailRoute = read(
    'src/app/api/gpt-image-2-prompts/thumbnail/route.ts'
  );

  assert.match(thumbnailRoute, /max-age=31536000/);
  assert.match(thumbnailRoute, /s-maxage=31536000/);
  assert.match(thumbnailRoute, /immutable/);
});

test('canonical prompt detail pages avoid per-request dynamic state', () => {
  const promptPage = read('src/app/prompt/[slug]/page.tsx');
  const promptPublicPage = read('src/components/prompts/PromptPublicPage.tsx');

  assert.match(promptPage, /export const dynamic = 'force-static'/);
  assert.match(promptPage, /export const dynamicParams = false/);
  assert.match(promptPage, /getStaticPromptPageEntries\(\)/);
  assert.doesNotMatch(promptPage, /searchParams/);
  assert.match(promptPublicPage, /readInitialImageIndexFromUrl/);
});

test('related prompts are precomputed instead of building the coverage graph during page render', () => {
  const prompts = read('src/lib/prompts.ts');

  assert.match(prompts, /precomputedRelatedPromptEntries/);
  assert.match(prompts, /buildRelatedPromptEntryMap/);
  assert.match(prompts, /return selectedCandidates\.map/);
});

test('homepage analytics do not compete with initial rendering', () => {
  const rootLayout = read('src/app/layout.tsx');

  assert.match(
    rootLayout,
    /id="clarity-init"[\s\S]*?strategy="lazyOnload"/
  );
});

test('client-visible homepage helpers avoid legacy JavaScript polyfill triggers', () => {
  const promptTaxonomy = read('src/lib/prompt-taxonomy.ts');
  const urls = read('src/lib/urls/urls.ts');
  const pricingConfig = read('src/config/pricing.ts');

  assert.doesNotMatch(promptTaxonomy, /\.at\(/);
  assert.doesNotMatch(urls, /Object\.fromEntries/);
  assert.doesNotMatch(pricingConfig, /\.flatMap\(/);
});

test('homepage SEO copy centers Free AI Image Prompts without model stuffing', () => {
  const enCopy = readVogueCopy('en');
  const zhCopy = readVogueCopy('zh');
  const localeLayout = read('src/app/[locale]/layout.tsx');
  const page = read('src/app/page.tsx');

  assert.equal(
    enCopy.home.metaTitle,
    'Free AI Image Prompts for GPT Image 2 & Nano Banana | Vogue AI'
  );
  assert.equal(
    enCopy.home.h1,
    'Free AI Image Prompts for GPT Image 2, Nano Banana & Midjourney'
  );
  assert.equal(
    enCopy.home.itemListName,
    'Free AI Image Prompts for GPT Image 2 and Nano Banana'
  );
  assert.match(enCopy.home.metaDescription, /^Browse free AI image prompts/);
  assert.match(
    enCopy.home.metaDescription,
    /GPT Image 2, Nano Banana and Midjourney prompts/
  );

  assert.match(zhCopy.home.metaTitle, /^免费 AI 图片提示词/);
  assert.equal(zhCopy.home.h1, '免费 AI 图片提示词');
  assert.match(zhCopy.home.metaDescription, /免费的 AI 图片提示词/);
  assert.match(zhCopy.home.metaDescription, /GPT Image 2、Nano Banana、Midjourney/);

  assert.match(localeLayout, /Free AI Image Prompts for GPT Image 2 & Nano Banana \| Vogue AI/);
  assert.match(page, /'@type': 'FAQPage'/);
  assert.doesNotMatch(
    `${localeLayout}\n${page}`,
    /Free Nano Banana, Midjourney & GPT Image Prompts Gallery/
  );
});

test('prompt gallery counts stay global while cards are paged', () => {
  const counts = getPromptGalleryCounts();

  assert.equal(counts.total, 1484);
  assert.equal(counts.models.gptimage2, 599);
  assert.equal(counts.models.nanobanana, 547);
  assert.equal(counts.models.midjourney, 338);
  assert.equal(counts.categories.product, 132);
  assert.equal(counts.categories.diagram, 163);
  assert.equal(counts.categories.anime, 64);
  assert.equal(counts.categories.art, 164);
  assert.equal(counts.categories.photo, 650);
});
