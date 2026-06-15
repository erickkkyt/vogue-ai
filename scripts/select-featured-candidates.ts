import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

import {
  getFeaturedCurationBucket,
  rankFeaturedCandidates,
  scoreFeaturedCandidate,
} from '@/lib/featured-curation';
import {
  VOGUE_FEATURED_PROMPT_IDS,
  getLocalizedPromptEntries,
} from '@/lib/prompts';

type CandidateJsonRecord = {
  id?: string;
  publicId?: string;
};

type SheetRecord = {
  index: number;
  score: number;
  bucket: string;
  publicId: string;
  id: string;
  title: string;
  categoryKey?: string | null;
  image: string;
  href: string;
  reasons: string[];
  penalties: string[];
};

const readFlag = (name: string, fallback: string) => {
  const prefix = `--${name}=`;
  return process.argv
    .slice(2)
    .find((argument) => argument.startsWith(prefix))
    ?.slice(prefix.length) ?? fallback;
};

const readNumberFlag = (name: string, fallback: number) => {
  const value = Number(readFlag(name, String(fallback)));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const getCandidateImage = (
  entry: ReturnType<typeof getLocalizedPromptEntries>[number]
) =>
  entry.imageAssets?.[0]?.variants?.['640'] ??
  entry.imageAssets?.[0]?.originalUrl ??
  entry.images[0] ??
  null;

const getCandidateHref = (
  entry: ReturnType<typeof getLocalizedPromptEntries>[number]
) => `/prompt/${entry.seoSlug}-${entry.publicId}`;

const readSeenIdsFromJson = async (filePath: string) => {
  const records = JSON.parse(await readFile(filePath, 'utf8')) as CandidateJsonRecord[];
  return records
    .flatMap((record) => [record.id, record.publicId])
    .filter((id): id is string => Boolean(id));
};

const loadSeenIds = async (jsonList: string) => {
  const seenIds = new Set<string>(VOGUE_FEATURED_PROMPT_IDS);
  const explicitFiles = jsonList
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  for (const filePath of explicitFiles) {
    for (const id of await readSeenIdsFromJson(filePath)) {
      seenIds.add(id);
    }
  }

  return seenIds;
};

const makeCandidateSheet = async ({
  records,
  outputPath,
}: {
  records: SheetRecord[];
  outputPath: string;
}) => {
  const cols = 5;
  const tileWidth = 230;
  const imageHeight = 292;
  const labelHeight = 86;
  const tileHeight = imageHeight + labelHeight;
  const rows = Math.ceil(records.length / cols);
  const composites: sharp.OverlayOptions[] = [];

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    const x = (index % cols) * tileWidth;
    const y = Math.floor(index / cols) * tileHeight;
    const response = await fetch(record.image);
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const image = await sharp(imageBuffer)
      .resize(tileWidth, imageHeight, {
        fit: 'cover',
        position: 'attention',
      })
      .jpeg({ quality: 88 })
      .toBuffer();
    const title =
      record.title.length > 33 ? `${record.title.slice(0, 30)}...` : record.title;
    const label = `<svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffffff"/><text x="10" y="22" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#111827">${record.index}. ${record.publicId}</text><text x="10" y="46" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#334155">${escapeXml(title)}</text><text x="10" y="64" font-family="Arial, sans-serif" font-size="11" fill="#64748b">score ${record.score} · ${record.bucket}</text><text x="10" y="80" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">${escapeXml(record.reasons.slice(0, 2).join(', '))}</text></svg>`;

    composites.push({ input: image, left: x, top: y });
    composites.push({
      input: Buffer.from(label),
      left: x,
      top: y + imageHeight,
    });
  }

  await sharp({
    create: {
      width: cols * tileWidth,
      height: rows * tileHeight,
      channels: 3,
      background: '#f7f4ef',
    },
  })
    .composite(composites)
    .webp({ quality: 92 })
    .toFile(outputPath);
};

const main = async () => {
  const limit = readNumberFlag('limit', 50);
  const outputPrefix = readFlag('out', '.tmp/featured-candidates-next');
  const seenJson = readFlag('seen-json', '');
  const maxPerBucket = readNumberFlag('max-per-bucket', 7);
  const seenIds = await loadSeenIds(seenJson);
  const entries = getLocalizedPromptEntries('en');
  const rankedEntries = rankFeaturedCandidates(entries, {
    excludedIds: seenIds,
    limit,
    maxPerBucket,
  });
  const records: SheetRecord[] = rankedEntries.map((entry, index) => {
    const score = scoreFeaturedCandidate(entry);
    const image = getCandidateImage(entry);

    if (!image) {
      throw new Error(`Missing image for ${entry.id}`);
    }

    return {
      index: index + 1,
      score: score.score,
      bucket: getFeaturedCurationBucket(entry),
      publicId: entry.publicId,
      id: entry.id,
      title: entry.title,
      categoryKey: entry.categoryKey,
      image,
      href: getCandidateHref(entry),
      reasons: score.reasons,
      penalties: score.penalties,
    };
  });

  await mkdir(dirname(resolve(outputPrefix)), { recursive: true });
  const jsonPath = `${outputPrefix}.json`;
  const sheetPath = `${outputPrefix}.webp`;

  await writeFile(jsonPath, JSON.stringify(records, null, 2));
  await makeCandidateSheet({ records, outputPath: sheetPath });

  const buckets = records.reduce<Record<string, number>>((counts, record) => {
    counts[record.bucket] = (counts[record.bucket] ?? 0) + 1;
    return counts;
  }, {});

  console.log(
    JSON.stringify(
      {
        totalEntries: entries.length,
        generated: records.length,
        buckets,
        json: resolve(jsonPath),
        sheet: resolve(sheetPath),
      },
      null,
      2
    )
  );
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
