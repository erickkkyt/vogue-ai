import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  getLocalizedPromptGalleryEntries,
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

test('homepage uses lightweight gallery data instead of serializing the full prompt library', () => {
  const page = read('src/app/page.tsx');
  const apiRoute = read('src/app/api/gpt-image-2-prompts/entries/route.ts');
  const thumbnailRoute = read(
    'src/app/api/gpt-image-2-prompts/thumbnail/route.ts'
  );
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(page, /HOME_GALLERY_PAGE_SIZE/);
  assert.match(page, /HOME_GALLERY_PAGE_SIZE = 36/);
  assert.match(page, /getLocalizedPromptGalleryEntries\(locale/);
  assert.doesNotMatch(page, /getLocalizedPromptEntries\(locale\)/);
  assert.match(page, /getPromptGalleryCounts\(\)/);

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

  assert.equal(counts.total, 1346);
  assert.equal(counts.models.gptimage2, 546);
  assert.equal(counts.models.nanobanana, 500);
  assert.equal(counts.models.midjourney, 300);
  assert.equal(counts.categories.product, 129);
  assert.equal(counts.categories.diagram, 167);
  assert.equal(counts.categories.anime, 64);
  assert.equal(counts.categories.art, 152);
  assert.equal(counts.categories.photo, 546);
});
