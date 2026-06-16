import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  VOGUE_FEATURED_PROMPT_IDS,
  VOGUE_PROMPT_ENTRY_COUNT,
  getLocalizedPromptGalleryEntries,
  getPromptEntryById,
  getPromptGalleryCounts,
  getPromptGalleryEntryTotal,
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
  const entries = getLocalizedPromptGalleryEntries('zh', {
    limit: 12,
    sort: 'homepageFresh',
  });
  assert.equal(entries.length, 12);

  for (const entry of entries) {
    assert.equal('prompt' in entry, false);
    assert.equal('originalPrompt' in entry, false);
    assert.equal('categoryText' in entry, false);
    assert.equal('description' in entry, false);
    assert.equal(entry.images.length, 1);
    assert.match(
      entry.images[0],
      /^https:\/\/media\.vogueai\.net\/prompt-image-variants\/[a-f0-9]{40}\/640\.webp$/
    );
    assert.equal(entry.images[0].includes('prompt-libraries'), false);
    assert.ok(entry.imageCount >= 1);
    assert.ok(entry.imageDimensions?.width);
    assert.ok(entry.imageDimensions?.height);
  }
});

test('prompt image assets are resolved before data reaches client components', () => {
  const [galleryEntry] = getLocalizedPromptGalleryEntries('en', {
    limit: 1,
    sort: 'homepageFresh',
  });
  assert.ok(galleryEntry);
  assert.equal(galleryEntry.images.length, 1);
  assert.equal(galleryEntry.imageAssets?.length, 1);
  assert.equal(galleryEntry.imageAssets?.[0]?.originalUrl.includes('/prompt-libraries/'), true);
  assert.match(
    galleryEntry.imageAssets?.[0]?.variants['640'] ?? '',
    /^https:\/\/media\.vogueai\.net\/prompt-image-variants\/[a-f0-9]{40}\/640\.webp$/
  );
  assert.equal(galleryEntry.imageAssets?.[0]?.width, galleryEntry.imageDimensions?.width);
  assert.equal(galleryEntry.imageAssets?.[0]?.height, galleryEntry.imageDimensions?.height);

  const fullEntry = getPromptEntryById(galleryEntry.publicId, 'en');
  assert.ok(fullEntry);
  assert.equal(fullEntry.imageAssets?.length, fullEntry.images.length);
  assert.equal(fullEntry.imageAssets?.[0]?.originalUrl, fullEntry.images[0]);
  assert.match(
    fullEntry.imageAssets?.[0]?.variants['1200'] ?? '',
    /^https:\/\/media\.vogueai\.net\/prompt-image-variants\/[a-f0-9]{40}\/1200\.webp$/
  );
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

test('homepage fresh gallery blends recency with model and category diversity', () => {
  const entries = getLocalizedPromptGalleryEntries('en', {
    limit: 20,
    sort: 'homepageFresh',
  });
  assert.equal(entries.length, 20);

  const modelCounts = entries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.modelId ?? 'unknown'] = (counts[entry.modelId ?? 'unknown'] ?? 0) + 1;
    return counts;
  }, {});
  assert.deepEqual(modelCounts, {
    gptimage2: 15,
    nanobanana: 3,
    midjourney: 2,
  });

  const firstTwelveModels = new Set(entries.slice(0, 12).map((entry) => entry.modelId));
  assert.equal(firstTwelveModels.has('nanobanana'), true);
  assert.equal(firstTwelveModels.has('midjourney'), true);

  const categoryCounts = entries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.categoryKey ?? 'unknown'] =
      (counts[entry.categoryKey ?? 'unknown'] ?? 0) + 1;
    return counts;
  }, {});
  assert.ok(Object.keys(categoryCounts).length >= 5);
  assert.ok(
    Object.values(categoryCounts).every((count) => count <= 4),
    `expected no category to dominate the first 20 entries: ${JSON.stringify(categoryCounts)}`
  );
});

test('homepage fresh gallery prevents one category from filling the first screen', () => {
  const entries = getLocalizedPromptGalleryEntries('en', {
    limit: 20,
    sort: 'homepageFresh',
  });

  const firstThreeCategoryKeys = entries
    .slice(0, 3)
    .map((entry) => entry.categoryKey ?? 'unknown');
  assert.equal(
    new Set(firstThreeCategoryKeys).size,
    firstThreeCategoryKeys.length,
    `expected the first 3 cards to use different categories: ${firstThreeCategoryKeys.join(', ')}`
  );

  const firstSixCategoryCounts = entries
    .slice(0, 6)
    .reduce<Record<string, number>>((counts, entry) => {
      counts[entry.categoryKey ?? 'unknown'] =
        (counts[entry.categoryKey ?? 'unknown'] ?? 0) + 1;
      return counts;
    }, {});

  assert.ok(
    Object.values(firstSixCategoryCounts).every((count) => count <= 2),
    `expected no category to appear more than twice in the first 6 cards: ${JSON.stringify(firstSixCategoryCounts)}`
  );
});

test('homepage fresh gallery surfaces curated portrait-forward entries early', () => {
  const entries = getLocalizedPromptGalleryEntries('en', {
    limit: 12,
    sort: 'homepageFresh',
  });
  const portraitForwardEntries = entries.filter(
    (entry) =>
      ['portrait', 'fashion', 'art', 'photo'].includes(entry.categoryKey ?? '') &&
      /\b(?:portrait|profile|fashion|photo|editorial)\b/i.test(entry.title)
  );

  assert.ok(
    portraitForwardEntries.length >= 5,
    `expected at least 5 portrait-forward entries in the first 12 cards, got ${portraitForwardEntries.length}: ${entries.map((entry) => entry.title).join(', ')}`
  );
});

test('homepage fresh gallery defers UI and infographic prompts beyond the first 20 default cards', () => {
  const entries = getLocalizedPromptGalleryEntries('en', {
    limit: 20,
    sort: 'homepageFresh',
  });

  assert.equal(entries.length, 20);
  assert.equal(
    entries.some((entry) => entry.categoryKey === 'ui' || entry.categoryKey === 'diagram'),
    false,
    `expected default homepage first 20 to avoid UI and infographic prompts: ${entries
      .map((entry) => `${entry.title} (${entry.categoryKey})`)
      .join(', ')}`
  );
});

test('homepage fresh gallery still returns UI prompts when the UI category is selected', () => {
  const entries = getLocalizedPromptGalleryEntries('en', {
    categoryKey: 'ui',
    limit: 12,
    sort: 'homepageFresh',
  });

  assert.ok(entries.length > 0);
  assert.equal(entries.every((entry) => entry.categoryKey === 'ui'), true);
});

test('homepage fresh gallery still returns infographic prompts when the diagram category is selected', () => {
  const entries = getLocalizedPromptGalleryEntries('en', {
    categoryKey: 'diagram',
    limit: 12,
    sort: 'homepageFresh',
  });

  assert.ok(entries.length > 0);
  assert.equal(entries.every((entry) => entry.categoryKey === 'diagram'), true);
});

test('homepage fresh gallery supports multiple selected type filters', () => {
  const entries = getLocalizedPromptGalleryEntries('en', {
    categoryKeys: ['portrait', 'fashion'],
    limit: 20,
    sort: 'homepageFresh',
  });

  const categoryKeys = new Set(entries.map((entry) => entry.categoryKey));

  assert.equal(entries.length, 20);
  assert.equal(categoryKeys.has('portrait'), true);
  assert.equal(categoryKeys.has('fashion'), true);
  assert.equal(
    entries.every((entry) =>
      entry.categoryKey === 'portrait' || entry.categoryKey === 'fashion'
    ),
    true
  );
});

test('prompt gallery API accepts comma-separated type filters with legacy category fallback', () => {
  const route = read('src/app/api/gpt-image-2-prompts/entries/route.ts');

  assert.match(route, /searchParams\.get\('types'\)/);
  assert.match(route, /split\(','\)/);
  assert.match(route, /categoryKeys/);
  assert.match(route, /categoryKey/);
});

test('homepage fresh gallery keeps selected model filters exclusive', () => {
  const entries = getLocalizedPromptGalleryEntries('en', {
    limit: 20,
    modelId: 'nanobanana',
    sort: 'homepageFresh',
  });

  assert.equal(entries.length, 20);
  assert.equal(entries.every((entry) => entry.modelId === 'nanobanana'), true);
});

test('homepage uses lightweight gallery data instead of serializing the full prompt library', () => {
  const page = read('src/app/page.tsx');
  const localizedPage = read('src/app/[locale]/page.tsx');
  const apiRoute = read('src/app/api/gpt-image-2-prompts/entries/route.ts');
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const publicPromptPage = read('src/components/prompts/PromptPublicPage.tsx');

  assert.match(page, /HOME_GALLERY_PAGE_SIZE/);
  assert.match(page, /HOME_GALLERY_PAGE_SIZE = 12/);
  assert.match(page, /getLocalizedPromptGalleryEntriesAsync\(locale/);
  assert.doesNotMatch(page, /getLocalizedPromptEntries\(locale\)/);
  assert.match(page, /getPromptGalleryCountsAsync\(\)/);
  assert.doesNotMatch(page, /searchParams/);
  assert.doesNotMatch(localizedPage, /searchParams/);
  assert.match(gallery, /readInitialGalleryFiltersFromUrl/);

  assert.match(apiRoute, /mode.*gallery/);
  assert.match(apiRoute, /getLocalizedPromptGalleryEntries/);
  assert.match(apiRoute, /getPromptEntryById/);

  assert.match(gallery, /fetchFullPromptEntry/);
  assert.match(gallery, /\/api\/gpt-image-2-prompts\/entries/);
  assert.match(gallery, /imageAssets/);
  assert.match(publicPromptPage, /imageAssets/);
  assert.doesNotMatch(gallery, /prompt-image-variants/);
  assert.doesNotMatch(gallery, /prompt-image-dimensions/);
  assert.doesNotMatch(publicPromptPage, /prompt-image-variants/);
  assert.doesNotMatch(publicPromptPage, /prompt-image-dimensions/);
  assert.match(gallery, /<Image/);
  assert.match(gallery, /sizes=/);
  assert.match(gallery, /entryModelIcon/);
  assert.doesNotMatch(gallery, /getCardModelBadgeLabel/);
  assert.doesNotMatch(gallery, /entryModelShortTag/);
  assert.doesNotMatch(gallery, /entryModelTag/);
  assert.doesNotMatch(gallery, /promptText = entry\.prompt/);
});

test('gallery load-more keeps card ids unique when the same page is requested twice', () => {
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(gallery, /dedupeGalleryEntries\(entries\)/);
  assert.match(gallery, /mergeUniqueGalleryEntries\(current, nextEntries\)/);
  assert.match(gallery, /inFlightGalleryPageKeysRef/);
  assert.doesNotMatch(gallery, /\[\.\.\.current,\s*\.\.\.nextEntries\]/);
});

test('public prompt detail uses generated image variants while preserving original downloads', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const activeImageBlock = source.slice(
    source.indexOf('vogue-prompt-active-image'),
    source.indexOf('vogue-prompt-thumbnail-rail')
  );

  assert.match(source, /activeImageAsset/);
  assert.match(source, /PromptResolvedImage/);
  assert.match(source, /getPromptImageAssetSrc/);
  assert.match(
    source,
    /const activeImageSrc =\s*getPromptImageAssetSrc\(activeImageAsset, 1200\) \|\| activeImage/
  );
  assert.match(source, /href=\{activeImage\}/);
  assert.match(source, /preferredWidth=\{160\}/);
  assert.match(source, /preferredWidth=\{128\}/);
  assert.match(activeImageBlock, /preload/);
  assert.doesNotMatch(activeImageBlock, /unoptimized=\{false\}/);
});

test('tooling ignores Codex stale Next build directories', () => {
  const eslintConfig = read('eslint.config.mjs');

  assert.match(eslintConfig, /'\.next\.codex\*\/\*\*'/);
});

test('DB prompt sync advances generated sort order once per emitted pair', () => {
  const syncScript = read('scripts/sync-vogueai-db-prompt-pages.ts');

  assert.match(
    syncScript,
    /nextSortOrder = Math\.max\(nextSortOrder, stableSortOrder \+ 1\)/
  );
  assert.doesNotMatch(
    syncScript,
    /if \(!existingPair \|\| stableSortOrder === nextSortOrder\)[\s\S]{0,120}nextSortOrder \+= 1/
  );
});

test('homepage gallery prioritizes only the first visible cards for LCP', () => {
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(gallery, /HOMEPAGE_EAGER_CARD_COUNT = 1/);
  assert.match(gallery, /const eagerCardCount = HOMEPAGE_EAGER_CARD_COUNT/);
  assert.match(gallery, /eagerLoad=\{index < eagerCardCount\}/);
  assert.match(gallery, /loading=\{eagerLoad \? 'eager' : 'lazy'\}/);
  assert.match(gallery, /fetchPriority=\{eagerLoad \? 'high' : 'auto'\}/);
  assert.match(gallery, /rootMargin: '600px 0px'/);
  assert.doesNotMatch(gallery, /rootMargin: '900px 0px'/);
});

test('mobile homepage gallery switches to a two-column feed without changing desktop breakpoints', () => {
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const globals = read('src/app/globals.css');
  const columnLogic = gallery.slice(
    gallery.indexOf('const syncColumnCount = (width: number) => {'),
    gallery.indexOf('syncColumnCount(element.getBoundingClientRect().width);')
  );

  assert.match(columnLogic, /width >= 1440[\s\S]*setColumnCount\(4\)/);
  assert.match(columnLogic, /width >= 980[\s\S]*setColumnCount\(3\)/);
  assert.match(columnLogic, /width >= 640[\s\S]*setColumnCount\(2\)/);
  assert.match(columnLogic, /else\s*{\s*setColumnCount\(2\);\s*}/);
  assert.doesNotMatch(columnLogic, /else\s*{\s*setColumnCount\(1\);\s*}/);

  assert.match(gallery, /vogue-gallery-frame/);
  assert.match(gallery, /vogue-gallery-board/);
  assert.match(gallery, /vogue-gallery-card-shell/);
  assert.match(gallery, /vogue-gallery-card-image/);
  assert.match(gallery, /vogue-gallery-card-caption/);

  const mobileCss = globals.slice(globals.indexOf('@media (max-width: 640px)'));
  assert.match(mobileCss, /\.vogue-gallery-frame/);
  assert.match(mobileCss, /\.vogue-gallery-board/);
  assert.match(mobileCss, /\.vogue-filter-strip\s*{[\s\S]*flex-direction: row/);
  assert.match(mobileCss, /\.vogue-filter-strip\s*{[\s\S]*overflow-x: auto/);
  assert.match(mobileCss, /\.vogue-gallery-masonry\s*{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(mobileCss, /\.vogue-gallery-card-shell/);
  assert.match(mobileCss, /\.vogue-gallery-card-caption/);
});

test('mobile prompt detail scrolls image-first while tablet and desktop use a split layout', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const globals = read('src/app/globals.css');
  const desktopCss = globals.slice(0, globals.indexOf('@media (max-width: 640px)'));
  const mobileCss = globals.slice(globals.indexOf('@media (max-width: 640px)'));

  assert.match(source, /vogue-prompt-detail-surface[^\n]+md:grid-cols-\[minmax\(0,1fr\)_minmax\(340px,34vw\)\]/);
  assert.match(source, /vogue-prompt-detail-surface[^\n]+lg:grid-cols-\[minmax\(0,1fr\)_minmax\(420px,31vw\)\]/);
  assert.match(source, /vogue-prompt-detail-media[^\n]+md:h-dvh md:max-h-dvh/);
  assert.match(source, /vogue-prompt-detail-panel[^\n]+md:h-dvh md:max-h-dvh/);
  assert.match(source, /vogue-prompt-download-control/);
  assert.match(source, /vogue-prompt-close-control/);
  assert.match(source, /vogue-prompt-mobile-back-icon/);
  assert.match(source, /vogue-prompt-desktop-close-icon/);
  assert.match(source, /data-single-image=\{entry\.images\.length <= 1 \|\| undefined\}/);
  assert.match(source, /vogue-prompt-media-stage/);
  assert.match(source, /vogue-prompt-active-image/);
  assert.match(source, /const activeImageIsPortrait =/);
  assert.match(source, /const activeImageSizingClass = activeImageIsPortrait/);
  assert.match(source, /md:h-\[min\(calc\(100dvh-7rem\),88vh\)\] md:w-auto md:max-h-\[min\(calc\(100dvh-7rem\),88vh\)\] md:max-w-\[min\(92%,980px\)\]/);
  assert.match(source, /md:h-auto md:w-\[min\(90%,980px\)\] md:max-h-\[min\(calc\(100dvh-7rem\),88vh\)\] md:max-w-none/);
  assert.match(source, /lg:h-\[min\(calc\(100dvh-8rem\),86vh\)\] lg:w-auto lg:max-h-\[min\(calc\(100dvh-8rem\),86vh\)\] lg:max-w-\[min\(92%,1120px\)\]/);
  assert.match(source, /lg:h-auto lg:w-\[min\(90%,1120px\)\] lg:max-h-\[min\(calc\(100dvh-8rem\),86vh\)\] lg:max-w-none/);
  assert.doesNotMatch(source, /lg:max-w-\[min\(78%,980px\)\]/);
  assert.match(source, /vogue-prompt-thumbnail-rail/);
  assert.match(source, /vogue-prompt-thumbnail-item/);
  assert.match(source, /vogue-prompt-mobile-scroll-frame/);
  assert.match(source, /vogue-prompt-mobile-scroll-cue-top/);
  assert.match(source, /vogue-prompt-mobile-scroll-cue-bottom/);
  assert.match(source, /vogue-prompt-copy-card/);
  assert.match(source, /vogue-prompt-mobile-identity-card/);
  assert.match(source, /vogue-prompt-mobile-author-avatar/);
  assert.match(source, /vogue-prompt-mobile-prompt-section/);
  assert.match(source, /vogue-prompt-mobile-info-details/);
  assert.doesNotMatch(source, /vogue-prompt-mobile-identity-tags/);
  assert.doesNotMatch(source, /vogue-prompt-mobile-model-tag/);
  assert.doesNotMatch(source, /vogue-prompt-mobile-category-tag/);

  assert.match(desktopCss, /\.vogue-prompt-mobile-scroll-frame\s*{[\s\S]*display: contents/);
  assert.match(desktopCss, /\.vogue-prompt-mobile-scroll-cue\s*{[\s\S]*display: none/);

  assert.match(mobileCss, /\.vogue-prompt-detail-page\s*{[\s\S]*height: auto/);
  assert.match(mobileCss, /\.vogue-prompt-detail-surface\s*{[\s\S]*display: block/);
  assert.match(mobileCss, /\.vogue-prompt-detail-surface\s*{[\s\S]*height: auto/);
  assert.match(mobileCss, /\.vogue-prompt-detail-media\s*{[\s\S]*height: auto/);
  assert.match(mobileCss, /\.vogue-prompt-detail-panel\s*{[\s\S]*height: auto/);
  assert.match(mobileCss, /\.vogue-prompt-panel-footer\s*{[\s\S]*order: 4/);
  assert.match(mobileCss, /\.vogue-prompt-panel-body\s*{[\s\S]*order: 2/);
  assert.match(mobileCss, /\.vogue-prompt-media-toolbar\[data-single-image="true"\] \.vogue-prompt-media-counter/);
  assert.match(mobileCss, /\.vogue-prompt-mobile-back-icon/);
  assert.match(mobileCss, /\.vogue-prompt-desktop-close-icon/);
  assert.match(mobileCss, /\.vogue-prompt-info-card\s*{[\s\S]*display: none/);
  assert.match(mobileCss, /\.vogue-prompt-mobile-identity-card\s*{[\s\S]*display: grid/);
  assert.doesNotMatch(mobileCss, /\.vogue-prompt-mobile-identity-tags/);
  assert.doesNotMatch(mobileCss, /\.vogue-prompt-mobile-model-tag/);
  assert.doesNotMatch(mobileCss, /\.vogue-prompt-mobile-category-tag/);
  assert.match(mobileCss, /\.vogue-prompt-mobile-prompt-section\s*{[\s\S]*border-top: 1px solid rgba\(15, 23, 42, 0\.08\)/);
  assert.match(mobileCss, /\.vogue-prompt-panel-body\s*{[\s\S]*padding-inline: 1\.25rem/);
  assert.match(mobileCss, /\.vogue-prompt-mobile-info-details\s*{[\s\S]*display: block/);
  assert.match(mobileCss, /\.vogue-prompt-media-stage/);
  assert.match(mobileCss, /\.vogue-prompt-active-image/);
  assert.match(mobileCss, /\.vogue-prompt-active-image\s*{[\s\S]*max-width: calc\(100vw - 2rem\)/);
  assert.match(mobileCss, /\.vogue-prompt-thumbnail-rail\s*{[\s\S]*position: static !important/);
  assert.match(mobileCss, /\.vogue-prompt-thumbnail-rail\s*{[\s\S]*scroll-snap-type: x proximity/);
  assert.match(mobileCss, /\.vogue-prompt-thumbnail-item\s*{[\s\S]*height: 2\.75rem !important/);
  assert.match(mobileCss, /\.vogue-prompt-mobile-title\s*{[\s\S]*font-size: 0\.93rem/);
  assert.match(mobileCss, /\.vogue-prompt-mobile-title\s*{[\s\S]*white-space: nowrap/);
  assert.match(mobileCss, /\.vogue-prompt-copy-card \.vogue-prompt-text-scroll\s*{[\s\S]*max-height: clamp\(9\.5rem, 28vh, 11\.75rem\)/);
  assert.match(mobileCss, /\.vogue-prompt-mobile-scroll-frame\s*{[\s\S]*display: block/);
  assert.match(mobileCss, /\.vogue-prompt-mobile-scroll-frame\s*{[\s\S]*overflow: hidden/);
  assert.match(mobileCss, /\.vogue-prompt-mobile-scroll-cue-bottom\s*{/);
});

test('prompt SEO hubs are static cached pages while preserving the live gallery shell', () => {
  const promptSeoPage = read('src/components/prompts/PromptSeoLandingPage.tsx');

  for (const route of [
    'ai-image-prompt',
    'gpt-image-prompt',
    'nano-banana-prompt',
    'midjourney-prompt',
  ]) {
    const source = read(`src/app/(prompt-seo)/${route}/page.tsx`);

    assert.match(source, /export const dynamic = 'force-static'/, route);
    assert.match(source, /export const revalidate = 86400/, route);
  }

  assert.match(promptSeoPage, /VogueGalleryWorkspace/);
  assert.doesNotMatch(promptSeoPage, /PromptSeoLightGallery/);
  assert.match(promptSeoPage, /getPromptSeoPinnedHeroEntry/);
  assert.match(promptSeoPage, /getPromptEntryById/);
  assert.match(promptSeoPage, /PROMPT_SEO_GALLERY_PAGE_SIZE = 24/);
  assert.match(promptSeoPage, /PROMPT_SEO_GALLERY_MAX_ENTRIES = 96/);
  assert.match(promptSeoPage, /pageSize=\{PROMPT_SEO_GALLERY_PAGE_SIZE\}/);
  assert.match(promptSeoPage, /maxEntries=\{entries\.length\}/);
  assert.match(promptSeoPage, /lockedModelId=\{config\.modelId\}/);
});

test('prompt SEO hubs compact only the mobile hero before the gallery', () => {
  const promptSeoPage = read('src/components/prompts/PromptSeoLandingPage.tsx');
  const globals = read('src/app/globals.css');
  const mobileCss = globals.slice(globals.indexOf('@media (max-width: 640px)'));

  assert.match(promptSeoPage, /prompt-seo-hero-section/);
  assert.match(promptSeoPage, /prompt-seo-hero-grid/);
  assert.match(promptSeoPage, /prompt-seo-hero-title/);
  assert.match(promptSeoPage, /prompt-seo-hero-description/);
  assert.match(promptSeoPage, /prompt-seo-hero-stats/);
  assert.match(promptSeoPage, /prompt-seo-taxonomy-strip/);

  assert.match(mobileCss, /\.prompt-seo-hero-section\s*{[\s\S]*padding-top: 0\.55rem/);
  assert.match(mobileCss, /\.prompt-seo-hero-title(?:\.prompt-seo-hero-title)?\s*{[\s\S]*font-size: 34px/);
  assert.match(mobileCss, /\.prompt-seo-hero-description\s*{[\s\S]*-webkit-line-clamp: 3/);
  assert.match(mobileCss, /\.prompt-seo-hero-stats span:not\(:first-child\)/);
  assert.match(mobileCss, /\.prompt-seo-taxonomy-strip/);
});

test('prompt SEO preview images only prioritize the single LCP image', () => {
  const promptSeoPage = read('src/components/prompts/PromptSeoLandingPage.tsx');

  assert.match(promptSeoPage, /priority=\{false\}/);
  assert.match(promptSeoPage, /isPromptImageVariantSrc/);
  assert.match(promptSeoPage, /loading=\{priority \? undefined : 'lazy'\}/);
  assert.doesNotMatch(promptSeoPage, /loading=\{priority \? undefined : 'eager'\}/);
  assert.doesNotMatch(promptSeoPage, /priority=\{index < 3\}/);
  assert.doesNotMatch(promptSeoPage, /priority=\{index === 0 && previewIndex < 3\}/);
});

test('mobile shell keeps discovery chrome compact and moves primary routes to a bottom dock', () => {
  const shell = read('src/components/app/VogueSidebarShell.tsx');
  const globals = read('src/app/globals.css');
  const mobileCss = globals.slice(globals.indexOf('@media (max-width: 640px)'));

  assert.match(shell, /vogue-mobile-rail[^\n]+min-h-\[62px\]/);
  assert.match(shell, /vogue-mobile-primary-nav/);
  assert.match(shell, /aria-label=\{label\}/);
  assert.match(shell, /aria-current=\{active \? 'page' : undefined\}/);
  assert.match(shell, /data-active=\{active \|\| undefined\}/);
  assert.match(shell, /vogue-mobile-primary-nav-label hidden/);
  assert.match(shell, /vogue-mobile-rail-row/);
  assert.match(shell, /vogue-mobile-brand-link/);
  assert.match(shell, /vogue-mobile-brand-lockup/);
  assert.match(shell, /vogue-mobile-brand-word/);
  assert.doesNotMatch(shell, /bg-\[#15110f\]/);
  assert.match(shell, /function MobileAccountButton/);
  assert.match(shell, /vogue-mobile-anonymous-login-button[^\n]+h-9[^\n]+w-9/);
  assert.doesNotMatch(shell, /vogue-mobile-anonymous-credit-pill/);
  assert.match(mobileCss, /\.vogue-mobile-rail\s*{[\s\S]*min-height: 62px/);
  assert.match(mobileCss, /\.vogue-mobile-rail\s*{[\s\S]*display: flex/);
  assert.match(mobileCss, /\.vogue-mobile-rail\s*{[\s\S]*align-items: center/);
  assert.match(mobileCss, /\.vogue-mobile-rail\s*{[\s\S]*overflow: visible/);
  assert.match(mobileCss, /\.vogue-mobile-rail-row\s*{[\s\S]*min-height: 2\.75rem/);
  assert.match(mobileCss, /\.vogue-mobile-rail-row\s*{[\s\S]*width: 100%/);
  assert.match(mobileCss, /\.vogue-mobile-brand-link\s*{[\s\S]*height: 2\.75rem/);
  assert.match(mobileCss, /\.vogue-mobile-brand-link\s*{[\s\S]*overflow: visible/);
  assert.match(mobileCss, /\.vogue-mobile-brand-lockup\s*{[\s\S]*overflow: visible/);
  assert.match(mobileCss, /\.vogue-mobile-brand-word\s*{[\s\S]*line-height: 1\.18/);
  assert.match(mobileCss, /\.vogue-mobile-brand-word\s*{[\s\S]*overflow: visible/);
  assert.match(mobileCss, /\.vogue-mobile-brand-word\s*{[\s\S]*transform: translateY\(1px\)/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav\s*{[\s\S]*position: fixed/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav\s*{[\s\S]*bottom: max\(0\.45rem, env\(safe-area-inset-bottom\)\)/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav\s*{[\s\S]*width: min\(calc\(100vw - 8\.25rem\), 228px\)/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav\s*{[\s\S]*padding: 0\.34rem 0\.58rem/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-link\s*{[\s\S]*border: 0/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-link\s*{[\s\S]*height: 2\.25rem/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-link svg\s*{[\s\S]*height: 1\.18rem/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-link\s*{[\s\S]*background: transparent/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-link\[data-active="true"\]/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-label\s*{[\s\S]*display: none/);
  assert.match(mobileCss, /\.vogue-shell-content\s*{[\s\S]*padding-bottom: 5\.5rem/);
});

test('prompt image variant uploads use a long immutable cache lifetime', () => {
  const variantScript = read('scripts/generate-prompt-image-variants.ts');

  assert.match(
    variantScript,
    /CACHE_CONTROL_HEADER = 'public,max-age=31536000,immutable'/
  );
  assert.match(variantScript, /CacheControl: CACHE_CONTROL_HEADER/);
});

test('canonical prompt detail pages keep static slugs while server-resolving image queries', () => {
  const promptPage = read('src/app/prompt/[slug]/page.tsx');
  const promptPublicPage = read('src/components/prompts/PromptPublicPage.tsx');

  assert.doesNotMatch(promptPage, /export const dynamic = 'force-static'/);
  assert.match(promptPage, /export const dynamicParams = false/);
  assert.match(promptPage, /getStaticPromptPageEntriesAsync\(\)/);
  assert.match(promptPage, /searchParams\?: PromptPageSearchParams/);
  assert.match(promptPage, /readPromptInitialImageIndex/);
  assert.match(promptPage, /buildPromptPageMetadataForImage/);
  assert.match(promptPage, /imagePromptTitle/);
  assert.match(promptPage, /buildPromptPageMetadataForImage\(promptEntry, resolvedSearchParams\)/);
  assert.match(promptPage, /initialImageIndex=\{readPromptInitialImageIndex\(/);
  assert.match(promptPublicPage, /readInitialImageIndexFromUrl/);
});

test('related prompts are precomputed instead of building the coverage graph during page render', () => {
  const prompts = read('src/lib/prompts.ts');
  const runtimeDataBuilder = read('scripts/build-prompt-runtime-data.ts');

  assert.match(prompts, /relatedByPublicId/);
  assert.match(prompts, /indexableRelatedByPublicId/);
  assert.match(prompts, /getRelatedPromptEntriesFromData/);
  assert.doesNotMatch(prompts, /buildRelatedPromptEntryMap/);
  assert.match(runtimeDataBuilder, /toRelatedMap\(sourceEntries, getRelatedPromptEntries\)/);
  assert.match(runtimeDataBuilder, /toRelatedMap\(\s*indexableEntries,\s*getIndexableRelatedPromptEntries/);
});

test('homepage analytics do not compete with initial rendering', () => {
  const rootLayout = read('src/app/layout.tsx');

  assert.match(
    rootLayout,
    /id="clarity-init"[\s\S]*?strategy="lazyOnload"/
  );
  assert.match(rootLayout, /rel="preconnect" href="https:\/\/media\.vogueai\.net"/);
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

  assert.equal(counts.total, VOGUE_PROMPT_ENTRY_COUNT);
  assert.equal(counts.models.gptimage2 > 599, true);
  assert.equal(counts.models.nanobanana, 546);
  assert.equal(counts.models.midjourney, 338);
  assert.equal(
    Object.values(counts.categories).reduce((total, count) => total + count, 0),
    counts.total
  );
});

test('featured prompt gallery filter uses the manual Vogue curation list', () => {
  const userConfirmedFeaturedPromptIds = [
    'vogueai-20260611-minimal-fashion-magazine-cover-ai-prompt',
    'vogueai-20260611-fashion-editorial-watercolor-portrait-ai-prompt',
    'vogueai-20260611-studio-rose-bouquet-editorial-portrait-ai-prompt',
    'vogueai-20260611-editorial-portrait-ai-prompt',
    'vogueai-20260611-soft-waves-editorial-portrait-set-ai-prompt',
    'vogueai-20260611-ai-image-prompt-ai-prompt-14',
    'vogueai-20260611-commercial-city-double-exposure-poster-ai-prompt',
    'vogueai-20260615-empty-coastal-road-editorial-illustration-ai-prompt',
    'x-2065399979959583021',
    'vogueai-20260611-luxury-dessert-brand-poster-ai-prompt',
    'vogueai-20260610-sci-fi-cinematic-campaign-keyframe-ai-prompt',
    'vogueai-20260611-streetwear-character-fashion-drop-ai-prompt',
    'vogueai-20260615-aurora-run-lab-trail-sneaker-cozy-bed-ad-poster-ai-prompt',
    'vogueai-20260610-new-chinese-tea-beverage-packaging-hero-poster-ai-prompt',
    'vogueai-20260610-3d-souvenir-badge-travel-poster-ai-prompt',
    'vogueai-20260611-boarding-pass-3d-cultural-travel-poster-ai-prompt',
    'claude-fable-5-vs-mythos-5-epic-tech-poster-ai-prompt',
    'vogueai-20260610-fictional-brand-miniature-architecture-poster-ai-prompt',
    'vogueai-20260611-floating-city-postage-stamp-diorama-ai-prompt',
    'vogueai-20260611-nba-finals-four-heroes-illustration-poster-ai-prompt',
    'vogueai-20260611-papercraft-layered-hero-poster-ai-prompt',
    'vogueai-20260610-retro-aviation-travel-poster-ai-prompt',
    'vogueai-20260615-identity-lock-across-scenes-football-supporter-poster-ai-prompt',
    'vogueai-20260611-kawaii-scrapbook-station-paper-diorama-ai-prompt',
    'vogueai-20260611-surreal-advertising-concept-board-ai-prompt',
    'vogueai-20260611-food-photo-xiaohongshu-cover-edit-ai-prompt',
    'vogueai-20260615-last-dance-football-supporter-poster-ai-prompt',
    'vogueai-20260611-silhouette-universe-collectible-poster-ai-prompt',
    'vogueai-20260611-startup-founder-editorial-portrait-ai-prompt',
    'vogueai-20260615-urban-nomad-visual-poster-ai-prompt',
    'vogueai-20260615-vela-atelier-photo-poster-ai-prompt',
    'vogueai-20260611-visual-poster-ai-prompt-3',
    'vogueai-20260611-cinematic-cosmic-spacecraft-vista-ai-prompt',
    'vogueai-20260611-ancient-poetry-social-card-ai-prompt',
    'vogueai-20260611-food-action-six-panel-collage-ai-prompt',
    'vogueai-20260615-skinny-teenage-scavenger-poster-ai-prompt',
    'vogueai-20260611-sports-supporter-poster-ai-prompt',
    'vogueai-20260611-sword-hero-dual-composition-poster-ai-prompt',
    'vogueai-20260611-traditional-sumi-e-warrior-poster-ai-prompt',
    'vogueai-20260611-vehicle-collector-spec-poster-ai-prompt',
    'vogueai-20260611-world-cup-national-supporter-poster-ai-prompt',
    'vogueai-20260615-architecture-window-view-photo-ai-prompt',
    'vogueai-20260611-travel-photo-handwritten-annotation-ai-prompt',
    'vogueai-20260611-ai-image-prompt-ai-prompt-5',
    'vogueai-20260611-ai-image-prompt-ai-prompt-6',
    'vogueai-20260611-ai-image-prompt-ai-prompt-11',
    'vogueai-20260610-anime-fantasy-character-poster-ai-prompt',
    'vogueai-20260615-high-impact-commercial-food-double-juice-burger-commercial-poster-ai-prompt',
    'vogueai-20260615-aira-stormglass-theme-card-ai-prompt',
    'vogueai-20260615-3d-character-concept-ai-prompt',
    'vogueai-20260615-an-instantly-readable-pareidolia-logo-ai-prompt',
    'vogueai-20260615-ceramicist-concept-ai-prompt',
    'vogueai-20260610-creator-personal-brand-identity-mockup-ai-prompt',
    'vogueai-20260615-algeria-tilt-shift-map-collage-poster-ai-prompt',
    'vogueai-20260611-photo-object-english-label-stickers-ai-prompt',
    'x-2055491388310237685',
    'x-2057291128463085646',
    'x-2058509184581107776',
    'x-2054116876591272081',
    'vogueai-20260610-fictional-brand-action-campaign-poster-ai-prompt',
    'x-2053310109678535000',
    'x-2057802746171179048',
    'london-graduation-silhouette-poster',
    'x-2058397766163054705',
    'x-2054203134411739609',
    'x-2053512135993385454',
    'nanobanana-org-1445',
    'x-2061384949266309409',
    'x-2053338653230068166',
    'x-2061335069730726389',
    'x-2054054476429009086',
    'x-2053719156210774269',
    'x-2053822435062141367',
    'x-2056988183104233783',
    'vogueai-20260615-player-legacy-football-supporter-poster-ai-prompt',
    'x-2061346154642805147',
    'x-2055085798555558380',
    'x-2053730426259472870',
    'x-2053681053769105632',
    'x-2053879429265572226',
    'x-2061103821305356445',
    'vogueai-20260610-eastern-luxury-jewelry-campaign-poster-ai-prompt',
    'x-2061450776925585435',
    'x-2054942313781313621',
    'x-2054202646618407231',
    'x-2054139543423492547',
    'x-2054025608074760282',
    'x-2053819797214019996',
    'x-2053327310435266632',
    'x-2053115572112785659',
    'x-2047036229028635042-r1-dark-fantasy-stage-poster',
    'x-2057652843277165024',
    'x-2047218442030166086-r1-product-marketing-openai-merch-poster-grid',
    'vogueai-20260610-fictional-football-illustration-poster-ai-prompt',
    'x-2054015202098839660',
    'vogueai-20260610-neo-editorial-design-showcase-poster-ai-prompt',
    'x-2053811659484139961',
    'x-2054955002830217407',
    'x-1986879577189224803',
    'x-2053803928773640201',
    'x-2047098533275209826-social-media-post-cinematic-ai-mood-board',
    'x-2053791622702432453',
    'x-2061305471492096301',
    'x-2053495454764282108',
    'x-2057096166123212895',
    'x-2055516978383852002',
    'x-2055473321035399313',
    'x-2054103534854168964',
    'x-2046837522475712741',
    'x-2046144801071079612',
    'x-2045873940883808523-guangzhou-city-impression-swallow-poster',
    'vogueai-20260610-cinematic-winter-fantasy-portrait-ai-prompt',
    'x-2057787675298476353',
    'x-2061421399043092885',
    'x-2053511449881026614',
    'x-2053359720459821168',
    'x-2048431408318705733',
    'vogueai-20260610-fictional-dessert-product-macro-ad-ai-prompt',
    'x-2047048555622244582-r1-social-media-post-transform-train-scene-into-vintage-diner',
    'x-2053916651729662183',
    'x-2053691962251981084',
    'x-2058656784743850071',
    'x-2058612784645238890',
    'x-2056940651913285886',
    'x-2045368305079447853',
    'x-2057834496842723430',
    'x-2056661445950214603',
    'x-2056399689457500387',
    'x-2054111354202779672',
    'x-2054118230726447333',
    'x-2053851273342967963',
    'x-2046564674112831920-barbecue-three-sword-style-portrait',
    'x-2046268941941850575-soft-black-mist-korean-idol-3x3-collage',
  ];
  const featuredIds = new Set<string>(VOGUE_FEATURED_PROMPT_IDS);
  const counts = getPromptGalleryCounts();
  const featuredEntries = getLocalizedPromptGalleryEntries('en', {
    featured: true,
    limit: VOGUE_FEATURED_PROMPT_IDS.length,
  });

  assert.ok(VOGUE_FEATURED_PROMPT_IDS.length >= 8);
  assert.equal(counts.featured, VOGUE_FEATURED_PROMPT_IDS.length);
  assert.equal(
    getPromptGalleryEntryTotal({ featured: true }),
    VOGUE_FEATURED_PROMPT_IDS.length
  );
  assert.equal(featuredEntries.length, VOGUE_FEATURED_PROMPT_IDS.length);
  assert.equal(
    userConfirmedFeaturedPromptIds.every((id) => featuredIds.has(id)),
    true
  );
  assert.equal(
    featuredEntries.every(
      (entry) => featuredIds.has(entry.id) || featuredIds.has(entry.publicId)
    ),
    true
  );
  assert.equal(
    featuredEntries.every((entry) => entry.modelId !== 'featured'),
    true
  );
});
