import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  VOGUE_PROMPT_ENTRY_COUNT,
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

test('homepage fresh gallery uses VogueAI gallery publish time without overwriting source publish date', () => {
  const entries = getLocalizedPromptGalleryEntries('en', {
    limit: 12,
    sort: 'homepageFresh',
  });
  assert.equal(entries.length, 12);

  for (const entry of entries) {
    assert.equal(entry.sourceType, 'vogueai');
    assert.ok(entry.galleryPublishedAt, `${entry.id} needs galleryPublishedAt`);
    assert.ok(
      (entry.galleryPublishedAtMs ?? 0) > (entry.publishedAtMs ?? 0),
      `${entry.id} should sort by galleryPublishedAt without changing publishedLabel`
    );
    assert.match(entry.publishedLabel, /^[A-Z][a-z]+ \d{1,2}, 2026$/);
    assert.notEqual(entry.publishedLabel, entry.galleryPublishedAt);
  }

  for (let index = 1; index < entries.length; index += 1) {
    const previousGalleryPublishedAt = entries[index - 1]?.galleryPublishedAtMs ?? 0;
    const currentGalleryPublishedAt = entries[index]?.galleryPublishedAtMs ?? 0;

    assert.ok(
      previousGalleryPublishedAt >= currentGalleryPublishedAt,
      `expected entry ${index - 1} (${previousGalleryPublishedAt}) to be at least as fresh as entry ${index} (${currentGalleryPublishedAt})`
    );
  }
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
  assert.match(gallery, /sizes=/);
  assert.doesNotMatch(gallery, /unoptimized/);
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

test('public prompt detail displays resized thumbnails while preserving original downloads', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const activeImageBlock = source.slice(
    source.indexOf('vogue-prompt-active-image'),
    source.indexOf('vogue-prompt-thumbnail-rail')
  );

  assert.match(source, /const getPromptThumbnailSrc = \(/);
  assert.match(source, /src=\{getPromptThumbnailSrc\(entry\.id, activeImageIndex, 1200\)\}/);
  assert.match(source, /href=\{activeImage\}/);
  assert.match(source, /src=\{getPromptThumbnailSrc\(entry\.id, imageIndex, 160\)\}/);
  assert.match(source, /src=\{getPromptThumbnailSrc\(relatedPrompt\.id, 0, 128\)\}/);
  assert.doesNotMatch(activeImageBlock, /unoptimized/);
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

test('mobile prompt detail becomes scrollable image-first while desktop split layout stays lg-scoped', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const globals = read('src/app/globals.css');
  const desktopCss = globals.slice(0, globals.indexOf('@media (max-width: 640px)'));
  const mobileCss = globals.slice(globals.indexOf('@media (max-width: 640px)'));

  assert.match(source, /vogue-prompt-detail-surface[^\n]+lg:grid-cols-\[minmax\(0,1fr\)_minmax\(420px,31vw\)\]/);
  assert.match(source, /vogue-prompt-detail-media[^\n]+lg:h-dvh lg:max-h-dvh/);
  assert.match(source, /vogue-prompt-detail-panel[^\n]+lg:h-dvh lg:max-h-dvh/);
  assert.match(source, /vogue-prompt-download-control/);
  assert.match(source, /vogue-prompt-close-control/);
  assert.match(source, /vogue-prompt-mobile-back-icon/);
  assert.match(source, /vogue-prompt-desktop-close-icon/);
  assert.match(source, /data-single-image=\{entry\.images\.length <= 1 \|\| undefined\}/);
  assert.match(source, /vogue-prompt-media-stage/);
  assert.match(source, /vogue-prompt-active-image/);
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
  assert.match(shell, /vogue-mobile-anonymous-account-row[^\n]+h-10 w-\[160px\]/);
  assert.match(shell, /vogue-mobile-anonymous-login-button[^\n]+w-\[104px\]/);
  assert.match(shell, /vogue-mobile-anonymous-credit-pill[^\n]+w-12/);
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
  assert.match(mobileCss, /\.vogue-mobile-primary-nav\s*{[\s\S]*bottom: max\(0\.75rem, env\(safe-area-inset-bottom\)\)/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-link\s*{[\s\S]*border: 0/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-link\s*{[\s\S]*background: transparent/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-link\[data-active="true"\]/);
  assert.match(mobileCss, /\.vogue-mobile-primary-nav-label\s*{[\s\S]*display: none/);
  assert.match(mobileCss, /\.vogue-shell-content\s*{[\s\S]*padding-bottom: 5\.5rem/);
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

  assert.equal(counts.total, VOGUE_PROMPT_ENTRY_COUNT);
  assert.equal(counts.models.gptimage2 > 599, true);
  assert.equal(counts.models.nanobanana, 547);
  assert.equal(counts.models.midjourney, 338);
  assert.equal(
    Object.values(counts.categories).reduce((total, count) => total + count, 0),
    counts.total
  );
});
