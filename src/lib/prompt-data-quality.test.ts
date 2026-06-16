import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  VOGUE_FEATURED_PROMPT_IDS,
  getIndexablePromptPageEntries,
  getLocalizedPromptGalleryEntries,
  getPromptEntryById,
} from './prompts';
import { getPromptPagePath } from './prompt-page-routes';
import { isExternalPromptBracketPlaceholder } from './external-prompt-bracket-remix';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const readJson = <T>(path: string) => JSON.parse(read(path)) as T;

test('prompt i18n tooling expands image prompts for selected DB-backed batches', () => {
  const source = read('scripts/localize-vogue-prompts.ts');

  assert.match(source, /parentId\?: string/);
  assert.match(source, /shouldExpandImagePromptTranslations/);
  assert.match(source, /selectedIdSet\?\.has\(entry\.id\)/);
  assert.match(source, /entry\.parentId && selectedIdSet\.has\(entry\.parentId\)/);
  assert.match(source, /buildTranslationProviders/);
  assert.match(source, /PROMPT_I18N_PROVIDER/);
  assert.match(source, /ALIBABA_DASHSCOPE_API_KEY/);
  assert.match(source, /dashscope\.aliyuncs\.com\/compatible-mode\/v1/);
  assert.doesNotMatch(
    source,
    /if \(entry\.sourceType !== 'vogueai'\) continue;/
  );
});

const hardDeletedDuplicatePromptSourceIds = [
  'vogueai-20260611-beach-double-exposure-portrait-ai-prompt',
  'vogueai-20260611-ancient-style-peach-blossom-portrait-ai-prompt',
  'vogueai-20260611-bazi-personal-ip-character-ai-prompt',
  'vogueai-20260611-bazi-personal-tarot-card-ai-prompt',
  'vogueai-20260611-outdoor-camping-brand-poster-ai-prompt',
  'vogueai-20260611-fitness-commercial-brand-poster-ai-prompt',
  'vogueai-20260611-minimal-home-fragrance-poster-ai-prompt',
  'vogueai-20260611-vintage-bookstore-brand-poster-ai-prompt',
  'vogueai-20260611-retro-radio-repair-shop-cinematic-scene-ai-prompt',
  'vogueai-20260611-fairytale-garden-portrait-collage-ai-prompt',
  'vogueai-20260611-korean-photobook-nine-grid-consistency-ai-prompt',
  'user-london-graduation-silhouette-poster',
  'user-american-graduation-silhouette-poster',
  'user-singapore-graduation-silhouette-poster',
  'x-2053123747604033667',
  'x-2061434976755986561',
  'x-2046546991006802057-r0-youtube-thumbnail-explosive-japanese-x-monetization-thumbnail',
  'x-2046546991006802057-r1-youtube-thumbnail-japanese-x-monetization-thumbnail',
  'x-2046546991006802057-r2-youtube-thumbnail-flashy-x-monetization-youtube-thumbnail',
  'x-2047085107979419924-r1-minimal-sci-fi-anime-girl-portrait',
  'vogueai-20260615-renaissance-food-double-juice-burger-commercial-poster-ai-prompt',
  'vogueai-20260615-moon-water-guardian-woman-concept-2-ai-prompt',
  'vogueai-20260615-moon-water-guardian-woman-concept-3-ai-prompt',
  'vogueai-20260615-moon-water-guardian-woman-concept-4-ai-prompt',
  'vogueai-20260615-the-last-roar-editorial-poster-ai-prompt',
  'vogueai-20260615-the-last-roar-editorial-poster-2-ai-prompt',
  'x-2053494585830379785',
];

const meigenFeaturedPromptPages = [
  {
    id: 'meigen-featured-arri-alexa-dynamic-commercial-shot-79712a31',
    publicId: '020101200',
    title: 'ARRI Alexa Dynamic Commercial Shot',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-high-fashion-advertisement-photo-01e335ca',
    publicId: '020101201',
    title: 'High-Fashion Advertisement Photo',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-premium-youth-culture-advertising-poster-8ed2e239',
    publicId: '020101202',
    title: 'Premium Youth-Culture Advertising Poster',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-matte-black-trophy-premium-poster-c3506832',
    publicId: '020102200',
    title: 'Matte Black Trophy Premium Poster',
    categoryKey: 'poster',
  },
  {
    id: 'meigen-featured-minimalist-editorial-character-poster-b0e0676b',
    publicId: '020102201',
    title: 'Minimalist Editorial Character Poster',
    categoryKey: 'poster',
  },
  {
    id: 'meigen-featured-premium-youth-culture-editorial-poster-2f73b51b',
    publicId: '020102202',
    title: 'Premium Youth-Culture Editorial Poster',
    categoryKey: 'poster',
  },
  {
    id: 'meigen-featured-ultra-realistic-black-and-white-high-fashion-editorial-4ca1a6a2',
    publicId: '020107200',
    title: 'Ultra-Realistic Black-And-White High-Fashion Editorial',
    categoryKey: 'fashion',
  },
  {
    id: 'meigen-featured-editorial-photography-with-structured-deep-fashion-styling-b0ee010c',
    publicId: '010107200',
    title: 'Editorial Photography With Structured Deep Fashion Styling',
    categoryKey: 'fashion',
  },
  {
    id: 'meigen-featured-ultra-realistic-imax-grade-cinematic-action-shot-cafaeb20',
    publicId: '010107201',
    title: 'Ultra-Realistic IMAX-Grade Cinematic Action Shot',
    categoryKey: 'photo',
  },
  {
    id: 'meigen-featured-cinematic-movie-poster-with-powerful-female-lead-aefeb7c7',
    publicId: '010107202',
    title: 'Cinematic Movie Poster With Powerful Female Lead',
    categoryKey: 'portrait',
  },
  {
    id: 'meigen-featured-ultra-realistic-cinematic-portrait-photography-89f5e7ca',
    publicId: '010107203',
    title: 'Ultra-Realistic Cinematic Portrait Photography',
    categoryKey: 'fashion',
  },
  {
    id: 'meigen-featured-ultra-detailed-hyper-realistic-beauty-editorial-26cdd1e4',
    publicId: '010107204',
    title: 'Ultra-Detailed Hyper-Realistic Beauty Editorial',
    categoryKey: 'photo',
  },
  {
    id: 'meigen-featured-photorealistic-premium-product-render-409a5681',
    publicId: '010107205',
    title: 'Photorealistic Premium Product Render',
    categoryKey: 'photo',
  },
  {
    id: 'meigen-featured-vintage-filmstrip-collage-of-a-woman-ba719cbd',
    publicId: '010107206',
    title: 'Vintage Filmstrip Collage Of A Woman',
    categoryKey: 'photo',
  },
  {
    id: 'meigen-featured-ultra-realistic-cinematic-portrait-a26a1203',
    publicId: '010107207',
    title: 'Ultra-Realistic Cinematic Portrait',
    categoryKey: 'portrait',
  },
  {
    id: 'meigen-featured-low-angle-fashion-campaign-photograph-27aceded',
    publicId: '010101200',
    title: 'Low-Angle Fashion Campaign Photograph',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-cinematic-high-end-sneaker-advertisement-poster-5347c1db',
    publicId: '010101201',
    title: 'Cinematic High-End Sneaker Advertisement Poster',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-dynamic-luxury-commercial-poster-with-surreal-3d-render-aca78e01',
    publicId: '010101202',
    title: 'Dynamic Luxury Commercial Poster With Surreal 3D Render',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-premium-gen-z-commercial-advertising-poster-631b95d3',
    publicId: '010101203',
    title: 'Premium Gen-Z Commercial Advertising Poster',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-luxury-fashion-editorial-three-panel-composition-c3e40998',
    publicId: '010101204',
    title: 'Luxury Fashion Editorial Three-Panel Composition',
    categoryKey: 'fashion',
  },
  {
    id: 'meigen-featured-high-end-fashion-campaign-typography-poster-2c94140f',
    publicId: '010101205',
    title: 'High-End Fashion Campaign Typography Poster',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-perfume-key-visual-poster-3ef619c7',
    publicId: '010101206',
    title: 'Perfume Key Visual Poster',
    categoryKey: 'product',
  },
  {
    id: 'meigen-featured-vertical-high-end-fashion-campaign-poster-486c9afe',
    publicId: '010101207',
    title: 'Vertical High-End Fashion Campaign Poster',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-ultra-premium-luxury-fashion-advertisement-collage-85f4601f',
    publicId: '010101208',
    title: 'Ultra-Premium Luxury Fashion Advertisement Collage',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-creative-collectible-character-packaging-poster-f9d28dcd',
    publicId: '010101209',
    title: 'Creative Collectible Character Packaging Poster',
    categoryKey: 'product',
  },
  {
    id: 'meigen-featured-luxury-editorial-composition-from-reference-8303d551',
    publicId: '010101210',
    title: 'Luxury Editorial Composition From Reference',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-bold-y2k-japanese-street-editorial-collage-poster-703a5fc5',
    publicId: '010108200',
    title: 'Bold Y2K Japanese Street-Editorial Collage Poster',
    categoryKey: 'art',
  },
  {
    id: 'meigen-featured-cinematic-3d-promotional-travel-poster-9d9792bc',
    publicId: '010102200',
    title: 'Cinematic 3D Promotional Travel Poster',
    categoryKey: 'poster',
  },
  {
    id: 'meigen-featured-luxury-resort-editorial-campaign-visual-6aae4434',
    publicId: '010102201',
    title: 'Luxury Resort Editorial Campaign Visual',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-create-a-vertical-high-resolution-experimental-fashion-editorial-poste-75428929',
    publicId: '010102202',
    title: 'Experimental Fashion Editorial Poster',
    categoryKey: 'fashion',
  },
  {
    id: 'meigen-featured-sticker-surrounded-central-subject-editorial-card-aae0cd90',
    publicId: '010102203',
    title: 'Sticker-Surrounded Central Subject Editorial Card',
    categoryKey: 'fashion',
  },
  {
    id: 'meigen-featured-luxury-publishing-editorial-campaign-visual-f764aa1a',
    publicId: '010102204',
    title: 'Luxury Publishing Editorial Campaign Visual',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-high-end-outdoor-performance-fashion-campaign-ebbf720d',
    publicId: '010102205',
    title: 'High-End Outdoor Performance Fashion Campaign',
    categoryKey: 'brandAds',
  },
  {
    id: 'meigen-featured-dramatic-black-fifa-world-cup-poster-96c5a77c',
    publicId: '010102206',
    title: 'Dramatic Black FIFA World Cup Poster',
    categoryKey: 'photo',
  },
  {
    id: 'meigen-featured-high-impact-modern-comic-book-portrait-poster-36079b3f',
    publicId: '010102207',
    title: 'High-Impact Modern Comic-Book Portrait Poster',
    categoryKey: 'portrait',
  },
  {
    id: 'meigen-featured-premium-high-fashion-editorial-poster-bb62c888',
    publicId: '010102208',
    title: 'Premium High-Fashion Editorial Poster',
    categoryKey: 'fashion',
  },
  {
    id: 'meigen-featured-ultra-detailed-luxury-travel-scrapbook-collage-31e97b36',
    publicId: '010102209',
    title: 'Ultra-Detailed Luxury Travel Scrapbook Collage',
    categoryKey: 'poster',
  },
] as const;

test('generated prompt sources no longer retain hard-deleted duplicate templates', () => {
  const sourceFiles = [
    'src/lib/generated/awesome-gptimage2-prompts.json',
    'src/lib/generated/awesome-gptimage2-site-additions.json',
    'src/lib/generated/awesome-ai-prompts-nano-banana.json',
    'src/lib/generated/awesome-ai-prompts-midjourney.json',
  ];
  const sourceIds = new Set(
    sourceFiles.flatMap((sourceFile) =>
      readJson<Array<{ id: string }>>(sourceFile).map((entry) => entry.id)
    )
  );
  const publicIdMappings = readJson<Record<string, string>>(
    'src/lib/generated/prompt-public-ids.json'
  );
  const remixSchemas = {
    ...readJson<Record<string, unknown>>(
      'src/lib/generated/vogueai-db-prompt-remix-schemas.json'
    ),
    ...readJson<Record<string, unknown>>(
      'src/lib/generated/vogueai-external-prompt-remix-schemas.json'
    ),
  };
  const imageMetadataFiles = [
    'src/lib/generated/vogue-prompt-image-dimensions.json',
    'src/lib/generated/vogue-prompt-image-variants.json',
  ];
  const imageMetadataKeys = imageMetadataFiles.flatMap((metadataFile) =>
    Object.keys(readJson<Record<string, unknown>>(metadataFile))
  );
  const imageCsvFiles = [
    'src/lib/generated/awesome-gptimage2-prompts.image-urls.csv',
    'src/lib/generated/awesome-ai-prompts-nano-banana.image-urls.csv',
    'src/lib/generated/awesome-ai-prompts-midjourney.image-urls.csv',
  ];
  const imageCsvRows = imageCsvFiles.flatMap((csvFile) =>
    read(csvFile)
      .split('\n')
      .slice(1)
      .filter(Boolean)
  );
  const translationFiles = [
    'src/lib/generated/awesome-ai-prompts.i18n.fr.json',
    'src/lib/generated/awesome-ai-prompts.i18n.ja.json',
    'src/lib/generated/awesome-ai-prompts.i18n.ko.json',
    'src/lib/generated/awesome-ai-prompts.i18n.pt.json',
    'src/lib/generated/awesome-ai-prompts.i18n.ru.json',
    'src/lib/generated/awesome-ai-prompts.i18n.zh.json',
    'src/lib/generated/awesome-gptimage2-prompts.i18n.fr.json',
    'src/lib/generated/awesome-gptimage2-prompts.i18n.ja.json',
    'src/lib/generated/awesome-gptimage2-prompts.i18n.ko.json',
    'src/lib/generated/awesome-gptimage2-prompts.i18n.pt.json',
    'src/lib/generated/awesome-gptimage2-prompts.i18n.ru.json',
    'src/lib/generated/awesome-gptimage2-prompts.i18n.zh.json',
  ];
  const translationKeys = translationFiles.flatMap((translationFile) =>
    Object.keys(readJson<Record<string, unknown>>(translationFile))
  );

  for (const sourceId of hardDeletedDuplicatePromptSourceIds) {
    assert.equal(sourceIds.has(sourceId), false, `${sourceId} should be deleted from generated prompt sources`);
    assert.equal(sourceId in publicIdMappings, false, `${sourceId} should be deleted from stable public id mappings`);
    assert.equal(
      Object.keys(remixSchemas).some(
        (schemaId) => schemaId === sourceId || schemaId.startsWith(`${sourceId}-`)
      ),
      false,
      `${sourceId} should be deleted from remix schemas`
    );
    assert.equal(
      imageMetadataKeys.some((imageUrl) => imageUrl.includes(`/${sourceId}/`)),
      false,
      `${sourceId} should be deleted from generated image metadata`
    );
    assert.equal(
      imageCsvRows.some((row) => row.startsWith(`"${sourceId}",`)),
      false,
      `${sourceId} should be deleted from generated image CSVs`
    );
    assert.equal(
      translationKeys.some(
        (translationKey) =>
          translationKey === sourceId ||
          translationKey.startsWith(`${sourceId}-`)
      ),
      false,
      `${sourceId} should be deleted from generated translations`
    );
  }
});

test('external X prompt pages do not expose editable bracket placeholders', () => {
  const entries = readJson<
    Array<{
      id: string;
      sourceType?: string;
      prompt: string;
      imagePrompts?: Array<{ sourceId?: string; prompt: string }>;
    }>
  >('src/lib/generated/awesome-gptimage2-prompts.json').filter(
    (entry) => entry.sourceType === 'x'
  );
  const leakedPlaceholders: string[] = [];

  for (const entry of entries) {
    const promptItems = [
      { id: entry.id, prompt: entry.prompt },
      ...(entry.imagePrompts ?? []).map((imagePrompt) => ({
        id: imagePrompt.sourceId || entry.id,
        prompt: imagePrompt.prompt,
      })),
    ];

    for (const item of promptItems) {
      for (const match of item.prompt.matchAll(/\[([^\]\n]{1,120})\]/g)) {
        if (isExternalPromptBracketPlaceholder(match[1])) {
          leakedPlaceholders.push(`${item.id}:${match[0]}`);
        }
      }
    }
  }

  assert.deepEqual(leakedPlaceholders.slice(0, 20), []);
});

test('meigen featured prompt pages stay stable, featured, and indexable', () => {
  const featuredIds = new Set<string>(VOGUE_FEATURED_PROMPT_IDS);
  const indexableIds = new Set(
    getIndexablePromptPageEntries().map((entry) => entry.publicId)
  );

  assert.equal(meigenFeaturedPromptPages.length, 37);

  for (const expected of meigenFeaturedPromptPages) {
    const entry = getPromptEntryById(expected.id, 'en');

    assert.ok(entry, `${expected.id} should exist in runtime prompts`);
    assert.equal(entry.publicId, expected.publicId);
    assert.equal(entry.title, expected.title);
    assert.equal(entry.categoryKey, expected.categoryKey);
    assert.equal(entry.images.length > 0, true);
    assert.equal(entry.imagePrompts?.length, entry.images.length);
    assert.equal(
      featuredIds.has(entry.id) || featuredIds.has(entry.publicId),
      true,
      `${entry.id} should be featured`
    );
    assert.equal(
      indexableIds.has(entry.publicId),
      true,
      `${entry.publicId} should be indexable`
    );
    assert.match(getPromptPagePath(entry), new RegExp(`-${entry.publicId}$`));
    assert.doesNotMatch(
      getPromptPagePath(entry),
      /(?:brandads|portrait|fashion)-\d+-ai|collectible-epic-narrative-graduation|flashy-japanese-youtube-thumbnail|vintage-travel-stamp/
    );
  }
});

test('runtime prompt library hides highly duplicated editorial portrait templates', () => {
  assert.equal(getPromptEntryById('030103014', 'en'), null);

  const keptEntry = getPromptEntryById('030103020', 'en');
  assert.ok(keptEntry);
  assert.equal(keptEntry.title, 'Soft Waves Editorial Portrait Set AI');
});

test('runtime prompt library hides duplicate deep-focus fashion templates', () => {
  const keptEntry = getPromptEntryById('010207001', 'en');
  assert.ok(keptEntry);
  assert.equal(keptEntry.title, 'Deep-Focus Indoor Fashion Photo');

  assert.equal(getPromptEntryById('010207002', 'en'), null);

  const galleryEntries = getLocalizedPromptGalleryEntries('en', {
    limit: 2000,
  });
  assert.equal(
    galleryEntries.some((entry) => entry.publicId === '010207002'),
    false
  );
});

test('runtime prompt library hides duplicate ancient-style xianxia portrait templates', () => {
  const keptEntry = getPromptEntryById('030103015', 'en');
  assert.ok(keptEntry);
  assert.equal(keptEntry.title, 'Ancient Style Golden Glance Portrait AI');

  assert.equal(getPromptEntryById('030103016', 'en'), null);

  const galleryEntries = getLocalizedPromptGalleryEntries('en', {
    limit: 2000,
  });
  assert.equal(
    galleryEntries.some((entry) => entry.publicId === '030103016'),
    false
  );
});

test('runtime prompt library hides strict duplicate template clusters and keeps representative bazi prompts', () => {
  const keptPromptIds = [
    '030101024',
    '030101025',
    '030107011',
    '020102001',
    '020102002',
    '020102003',
    '010106012',
    '030108008',
    '030103012',
    '030105015',
  ];
  const hiddenPromptIds = [
    '030101026',
    '030101028',
    '030102035',
    '030101027',
    '030107012',
    '020102005',
    '020102004',
    '020102006',
    '010106015',
    '030108005',
    '030105022',
    '030105016',
    '030101021',
    '030101059',
    '030101060',
    '030101061',
    '030101062',
    '030102063',
    '030102064',
    '030102081',
    '030103033',
    '030103034',
    '030105028',
    '030105029',
    '030107033',
    '030108009',
    '030108010',
    '030108011',
    '030108013',
    '010105054',
  ];

  for (const publicId of keptPromptIds) {
    assert.ok(getPromptEntryById(publicId, 'en'), `${publicId} should stay active`);
  }

  for (const publicId of hiddenPromptIds) {
    assert.equal(getPromptEntryById(publicId, 'en'), null, `${publicId} should be hidden`);
  }

  const galleryEntries = getLocalizedPromptGalleryEntries('en', {
    limit: 2000,
  });
  const galleryIds = new Set(galleryEntries.map((entry) => entry.publicId));
  for (const publicId of hiddenPromptIds) {
    assert.equal(galleryIds.has(publicId), false, `${publicId} should not be in the gallery`);
  }

  const activeBaziEntries = galleryEntries.filter((entry) =>
    /\bbazi\b/i.test(`${entry.title} ${entry.sourceTitle}`)
  );
  assert.deepEqual(
    activeBaziEntries.map((entry) => entry.publicId).sort(),
    ['030103012', '030105015']
  );
});

test('soft waves editorial portrait presents the second source image first with its matching prompt', () => {
  const entry = getPromptEntryById('030103020', 'en');

  assert.ok(entry);
  assert.match(entry.images[0], /adult-white-woman-with-short-bob-black-turtlenec-02\.png$/);
  assert.match(entry.images[1], /adult-east-asian-woman-with-soft-waves-ivory-sat-01\.png$/);
  assert.match(
    entry.imagePrompts?.[0]?.image ?? '',
    /adult-white-woman-with-short-bob-black-turtlenec-02\.png$/
  );
  assert.match(
    entry.imagePrompts?.[0]?.title ?? '',
    /Adult White Woman With Short Bob/
  );
  assert.match(
    entry.imagePrompts?.[1]?.image ?? '',
    /adult-east-asian-woman-with-soft-waves-ivory-sat-01\.png$/
  );
  assert.match(
    entry.imagePrompts?.[1]?.title ?? '',
    /Adult East Asian Woman With Soft Waves/
  );
});

test('studio rose bouquet portrait uses the second image as the default display image', () => {
  const entry = getPromptEntryById('030103017', 'en');

  assert.ok(entry);
  assert.equal(entry.defaultImageIndex, 1);
  assert.match(entry.images[entry.defaultImageIndex], /rose-european-man-black-suit-02\.png$/);

  const galleryEntry = getLocalizedPromptGalleryEntries('en', {
    limit: 2000,
  }).find((candidate) => candidate.publicId === entry.publicId);

  assert.ok(galleryEntry);
  assert.deepEqual(galleryEntry.images, [entry.imageAssets?.[1]?.variants['640']]);

  const promptPage = read('src/app/prompt/[slug]/page.tsx');
  const promptPublicPage = read('src/components/prompts/PromptPublicPage.tsx');

  assert.match(promptPage, /readPromptInitialImageIndex/);
  assert.match(promptPage, /initialImageIndex=\{readPromptInitialImageIndex\(/);
  assert.match(promptPublicPage, /if \(!imageParam\) return null/);
  assert.match(promptPublicPage, /if \(nextImageIndex === null\) return/);
});
