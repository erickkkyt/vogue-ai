import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import sharp from 'sharp';

import {
  getLocalizedPromptGalleryEntries,
  getPromptEntryById,
  getStaticPromptPageEntries,
  type VoguePromptEntry,
} from '../src/lib/prompts';
import {
  PROMPT_IMAGE_VARIANT_WIDTHS,
  type PromptImageVariantManifest,
  type PromptImageVariantWidth,
} from '../src/lib/prompt-image-variants';
import {
  buildPromptImageVariantObjectKey,
  buildPromptImageVariantPublicUrl,
  mergePromptImageVariant,
} from './lib/prompt-image-variant-generator';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const MANIFEST_PATH = 'src/lib/generated/vogue-prompt-image-variants.json';
const CACHE_CONTROL_HEADER = 'public,max-age=31536000,immutable';
const DEFAULT_LIMIT = 12;
const FETCH_TIMEOUT_MS = 30_000;

type ScriptMode = 'homepage' | 'all';

type ScriptArgs = {
  dryRun: boolean;
  force: boolean;
  limit: number;
  mode: ScriptMode;
  widths: PromptImageVariantWidth[];
};

type TargetImage = {
  entryId: string;
  imageIndex: number;
  sourceUrl: string;
};

const getFlagValue = (flagName: string) => {
  const flag = process.argv.find((value) => value.startsWith(`${flagName}=`));
  return flag ? flag.slice(flag.indexOf('=') + 1) : undefined;
};

const hasFlag = (flagName: string) => process.argv.includes(flagName);

const parseLimit = (value: string | undefined) => {
  if (!value) return DEFAULT_LIMIT;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid --limit value: ${value}`);
  }

  return parsed;
};

const parseMode = (value: string | undefined): ScriptMode => {
  if (!value) return 'homepage';
  if (value === 'homepage' || value === 'all') return value;

  throw new Error(`Invalid --mode value: ${value}`);
};

const parseWidths = (value: string | undefined) => {
  if (!value) return [...PROMPT_IMAGE_VARIANT_WIDTHS];

  const allowedWidths = new Set<number>(PROMPT_IMAGE_VARIANT_WIDTHS);
  const widths = value
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((width): width is PromptImageVariantWidth =>
      allowedWidths.has(width)
    );

  if (widths.length === 0) {
    throw new Error(
      `Invalid --widths value: ${value}. Expected one or more of ${PROMPT_IMAGE_VARIANT_WIDTHS.join(
        ','
      )}`
    );
  }

  return [...new Set(widths)];
};

const parseArgs = (): ScriptArgs => ({
  dryRun: hasFlag('--dry-run'),
  force: hasFlag('--force'),
  limit: parseLimit(getFlagValue('--limit')),
  mode: parseMode(getFlagValue('--mode')),
  widths: parseWidths(getFlagValue('--widths')),
});

const requireEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
};

const readManifest = async () => {
  const manifestPath = resolve(process.cwd(), MANIFEST_PATH);

  try {
    return JSON.parse(
      await readFile(manifestPath, 'utf8')
    ) as PromptImageVariantManifest;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }
    throw error;
  }
};

const writeManifest = async (manifest: PromptImageVariantManifest) => {
  const manifestPath = resolve(process.cwd(), MANIFEST_PATH);
  const sortedManifest = Object.fromEntries(
    Object.entries(manifest).sort(([left], [right]) => left.localeCompare(right))
  );

  await writeFile(
    manifestPath,
    `${JSON.stringify(sortedManifest, null, 2)}\n`,
    'utf8'
  );
};

const collectHomepageEntries = (limit: number) =>
  getLocalizedPromptGalleryEntries('en', {
    limit,
    sort: 'homepageFresh',
  })
    .map((entry) => getPromptEntryById(entry.id, 'en'))
    .filter((entry): entry is VoguePromptEntry => Boolean(entry));

const collectTargetEntries = (args: ScriptArgs) =>
  args.mode === 'all'
    ? getStaticPromptPageEntries().slice(0, args.limit)
    : collectHomepageEntries(args.limit);

const collectTargetImages = (entries: VoguePromptEntry[]) => {
  const seen = new Set<string>();
  const targets: TargetImage[] = [];

  for (const entry of entries) {
    entry.images.forEach((sourceUrl, imageIndex) => {
      if (seen.has(sourceUrl)) return;
      seen.add(sourceUrl);
      targets.push({
        entryId: entry.id,
        imageIndex,
        sourceUrl,
      });
    });
  }

  return targets;
};

const fetchSourceImage = async (sourceUrl: string) => {
  const response = await fetch(sourceUrl, {
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${sourceUrl}: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
};

const renderVariant = async (
  source: Buffer,
  width: PromptImageVariantWidth
) =>
  sharp(source, {
    limitInputPixels: 48_000_000,
  })
    .rotate()
    .resize({
      width,
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
      effort: 4,
    })
    .toBuffer();

async function main() {
  const args = parseArgs();
  const manifest = await readManifest();
  const publicBase =
    process.env.R2_MEDIA_PUBLIC_URL?.trim() ||
    process.env.R2_IMAGE_PUBLIC_URL?.trim() ||
    '';
  const entries = collectTargetEntries(args);
  const targets = collectTargetImages(entries);
  const plannedVariantCount = targets.length * args.widths.length;
  let nextManifest = manifest;
  let skippedCount = 0;
  let uploadedCount = 0;
  const failures: string[] = [];

  console.log(
    `mode=${args.mode} entries=${entries.length} sourceImages=${targets.length} widths=${args.widths.join(
      ','
    )} plannedVariants=${plannedVariantCount} dryRun=${args.dryRun}`
  );

  if (args.dryRun) {
    for (const target of targets.slice(0, 10)) {
      console.log(
        `plan entry=${target.entryId} image=${target.imageIndex} source=${target.sourceUrl}`
      );
    }
    return;
  }

  if (!publicBase) {
    throw new Error('Missing required env var: R2_MEDIA_PUBLIC_URL or R2_IMAGE_PUBLIC_URL');
  }

  const bucket = requireEnv('R2_IMAGE_BUCKET_NAME');
  const endpoint = requireEnv('R2_ENDPOINT');
  const accessKeyId = requireEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = requireEnv('R2_SECRET_ACCESS_KEY');
  const region = process.env.R2_REGION || 'auto';

  const client = new S3Client({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    endpoint,
    forcePathStyle: true,
    region,
  });

  for (const target of targets) {
    let source: Buffer | null = null;

    for (const width of args.widths) {
      const existingVariant = nextManifest[target.sourceUrl]?.[`${width}`];
      if (existingVariant && !args.force) {
        skippedCount += 1;
        continue;
      }

      try {
        source ??= await fetchSourceImage(target.sourceUrl);
        const body = await renderVariant(source, width);
        const objectKey = buildPromptImageVariantObjectKey(
          target.sourceUrl,
          width
        );
        const publicUrl = buildPromptImageVariantPublicUrl(
          publicBase,
          objectKey
        );

        await client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            Body: body,
            ContentType: 'image/webp',
            CacheControl: CACHE_CONTROL_HEADER,
          })
        );

        nextManifest = mergePromptImageVariant(
          nextManifest,
          target.sourceUrl,
          width,
          publicUrl
        );
        uploadedCount += 1;
        console.log(
          `uploaded entry=${target.entryId} image=${target.imageIndex} width=${width} bytes=${body.length} url=${publicUrl}`
        );
      } catch (error) {
        failures.push(
          `${target.sourceUrl} width=${width}: ${(error as Error).message}`
        );
        console.error(
          `failed entry=${target.entryId} image=${target.imageIndex} width=${width}: ${(error as Error).message}`
        );
      }
    }
  }

  await writeManifest(nextManifest);

  console.log(
    `done uploaded=${uploadedCount} skipped=${skippedCount} failures=${failures.length}`
  );

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
