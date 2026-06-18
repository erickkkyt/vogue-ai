import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  GALLERY_CARD_IMAGE_SIZES,
  RESPONSIVE_GALLERY_MASONRY_COLUMN_COUNTS,
  buildResponsiveGalleryColumns,
  shouldEagerLoadGalleryCard,
} from './vogue-gallery-masonry';

type TestEntry = {
  id: string;
  projectedHeight: number;
};

const idsByColumn = (columns: ReturnType<typeof buildResponsiveGalleryColumns<TestEntry>>['desktop']) =>
  columns.map((column) => column.map((item) => item.entry.id));

const read = (path: string) => readFileSync(path, 'utf8');

test('builds stable mobile and desktop masonry columns before client measurement', () => {
  const entries: TestEntry[] = [
    { id: 'a', projectedHeight: 300 },
    { id: 'b', projectedHeight: 600 },
    { id: 'c', projectedHeight: 300 },
    { id: 'd', projectedHeight: 300 },
    { id: 'e', projectedHeight: 300 },
  ];

  const columns = buildResponsiveGalleryColumns(
    entries,
    (entry) => entry.projectedHeight
  );

  assert.equal(RESPONSIVE_GALLERY_MASONRY_COLUMN_COUNTS.mobile, 2);
  assert.equal(RESPONSIVE_GALLERY_MASONRY_COLUMN_COUNTS.desktop, 3);
  assert.deepEqual(idsByColumn(columns.mobile), [
    ['a', 'c', 'd'],
    ['b', 'e'],
  ]);
  assert.deepEqual(idsByColumn(columns.desktop), [
    ['a', 'd'],
    ['b'],
    ['c', 'e'],
  ]);
});

test('uses sizes that match the responsive gallery column widths', () => {
  assert.match(GALLERY_CARD_IMAGE_SIZES, /\(min-width: 1988px\) 540px/);
  assert.match(
    GALLERY_CARD_IMAGE_SIZES,
    /\(min-width: 1268px\) calc\(\(100vw - 367px\) \/ 3\)/
  );
  assert.match(
    GALLERY_CARD_IMAGE_SIZES,
    /\(min-width: 641px\) calc\(\(100vw - 348px\) \/ 2\)/
  );
  assert.match(GALLERY_CARD_IMAGE_SIZES, /calc\(\(100vw - 2\.2rem\) \/ 2\)/);
  assert.doesNotMatch(GALLERY_CARD_IMAGE_SIZES, /\b25vw\b/);
  assert.doesNotMatch(GALLERY_CARD_IMAGE_SIZES, /\b33vw\b/);
});

test('eager-loads the first visible image in every masonry column', () => {
  assert.equal(
    shouldEagerLoadGalleryCard({
      itemIndex: 0,
      columnItemIndex: 0,
      eagerItemCount: 1,
    }),
    true
  );
  assert.equal(
    shouldEagerLoadGalleryCard({
      itemIndex: 4,
      columnItemIndex: 0,
      eagerItemCount: 1,
    }),
    true
  );
  assert.equal(
    shouldEagerLoadGalleryCard({
      itemIndex: 9,
      columnItemIndex: 0,
      eagerItemCount: 1,
    }),
    true
  );
  assert.equal(
    shouldEagerLoadGalleryCard({
      itemIndex: 5,
      columnItemIndex: 1,
      eagerItemCount: 1,
    }),
    false
  );
});

test('gallery cards use a visible image loading placeholder', () => {
  const globals = read('src/app/globals.css');
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(gallery, /vogue-gallery-card-image-placeholder/);
  assert.match(globals, /\.vogue-gallery-card-image-placeholder/);
  assert.match(globals, /@keyframes vogue-gallery-card-image-placeholder/);
  assert.match(globals, /prefers-reduced-motion: reduce/);
});

test('uses media fallbacks so mobile and desktop masonry layouts never render together', () => {
  const globals = read('src/app/globals.css');
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(globals, /@container vogue-gallery-frame \(min-width: 980px\)/);
  assert.match(globals, /@media \(min-width: 980px\)/);
  assert.match(
    globals,
    /@media \(min-width: 980px\) \{[\s\S]*\.vogue-gallery-masonry--mobile \{[\s\S]*display: none !important;[\s\S]*\.vogue-gallery-masonry--desktop \{[\s\S]*display: grid !important;/
  );
  assert.match(globals, /@media \(max-width: 979\.98px\)/);
  assert.match(
    globals,
    /@media \(max-width: 979\.98px\) \{[\s\S]*\.vogue-gallery-masonry--mobile \{[\s\S]*display: grid !important;[\s\S]*\.vogue-gallery-masonry--desktop \{[\s\S]*display: none !important;/
  );
  assert.match(gallery, /useSyncExternalStore/);
  assert.match(gallery, /GALLERY_DESKTOP_MEDIA_QUERY = '\(min-width: 980px\)'/);
  assert.match(gallery, /const activeGalleryColumns =/);
  assert.match(gallery, /renderGalleryMasonry\(activeGalleryColumns, galleryMasonryVariant\)/);
  assert.doesNotMatch(
    gallery,
    /renderGalleryMasonry\(responsiveGalleryColumns\.mobile, 'mobile'\)[\s\S]*renderGalleryMasonry\(responsiveGalleryColumns\.desktop, 'desktop'\)/
  );
});
