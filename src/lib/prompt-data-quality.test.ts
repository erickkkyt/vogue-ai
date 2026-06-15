import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  getLocalizedPromptGalleryEntries,
  getPromptEntryById,
} from './prompts';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const readJson = <T>(path: string) => JSON.parse(read(path)) as T;

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
  const remixSchemas = readJson<Record<string, unknown>>(
    'src/lib/generated/vogueai-db-prompt-remix-schemas.json'
  );
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
