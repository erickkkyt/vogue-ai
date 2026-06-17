export type GalleryMasonryItem<Entry> = {
  entry: Entry;
  index: number;
};

export const RESPONSIVE_GALLERY_MASONRY_COLUMN_COUNTS = {
  mobile: 2,
  desktop: 3,
} as const;

export const GALLERY_CARD_IMAGE_SIZES =
  '(min-width: 1988px) 540px, (min-width: 1268px) calc((100vw - 367px) / 3), (min-width: 641px) calc((100vw - 348px) / 2), calc((100vw - 2.2rem) / 2)';

export function distributeGalleryEntriesIntoColumns<Entry>(
  entries: Entry[],
  columnCount: number,
  getProjectedHeight: (entry: Entry) => number,
  gapPx: number
): GalleryMasonryItem<Entry>[][] {
  const normalizedColumnCount = Math.max(
    1,
    Math.min(columnCount, entries.length || 1)
  );
  const columns = Array.from({ length: normalizedColumnCount }, () => ({
    height: 0,
    items: [] as GalleryMasonryItem<Entry>[],
  }));

  entries.forEach((entry, index) => {
    let targetColumnIndex = 0;

    for (let columnIndex = 1; columnIndex < columns.length; columnIndex += 1) {
      if (columns[columnIndex].height < columns[targetColumnIndex].height) {
        targetColumnIndex = columnIndex;
      }
    }

    columns[targetColumnIndex].items.push({ entry, index });
    columns[targetColumnIndex].height += getProjectedHeight(entry) + gapPx;
  });

  return columns.map((column) => column.items);
}

export function buildResponsiveGalleryColumns<Entry>(
  entries: Entry[],
  getProjectedHeight: (entry: Entry) => number,
  gapPx = 0
) {
  return {
    mobile: distributeGalleryEntriesIntoColumns(
      entries,
      RESPONSIVE_GALLERY_MASONRY_COLUMN_COUNTS.mobile,
      getProjectedHeight,
      gapPx
    ),
    desktop: distributeGalleryEntriesIntoColumns(
      entries,
      RESPONSIVE_GALLERY_MASONRY_COLUMN_COUNTS.desktop,
      getProjectedHeight,
      gapPx
    ),
  };
}
