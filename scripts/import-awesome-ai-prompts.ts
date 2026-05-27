import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const DEFAULT_SOURCE_REPO_PATH = '/Users/kkkk/Desktop/awesome-ai prompts';
const DIMENSIONS_JSON_PATH = 'src/lib/generated/vogue-prompt-image-dimensions.json';
const CACHE_CONTROL_HEADER = 'public,max-age=31536000,immutable';
const REQUEST_TIMEOUT_MS = 30_000;
const LOG_EVERY_IMAGES = 25;

type ModelImportConfig = {
  key: string;
  displayName: string;
  sourceJsonPath: string;
  outputJsonPath: string;
  imageUrlCacheCsvPath: string;
  objectPrefix: string;
  defaultModelId: string;
  sourceOrderOffset: number;
};

const MODEL_IMPORT_CONFIGS: ModelImportConfig[] = [
  {
    key: 'gpt-image-2',
    displayName: 'GPT Image 2',
    sourceJsonPath: 'prompts/prompts.json',
    outputJsonPath: 'src/lib/generated/awesome-gptimage2-prompts.json',
    imageUrlCacheCsvPath: 'src/lib/generated/awesome-gptimage2-prompts.image-urls.csv',
    objectPrefix: 'prompt-libraries/awesome-gptimage2-prompts',
    defaultModelId: 'gptimage2',
    sourceOrderOffset: 0,
  },
  {
    key: 'nano-banana',
    displayName: 'Nano Banana',
    sourceJsonPath: 'prompts/nano-banana-prompts.json',
    outputJsonPath: 'src/lib/generated/awesome-ai-prompts-nano-banana.json',
    imageUrlCacheCsvPath:
      'src/lib/generated/awesome-ai-prompts-nano-banana.image-urls.csv',
    objectPrefix: 'prompt-libraries/awesome-ai-prompts/nano-banana',
    defaultModelId: 'nanobanana',
    sourceOrderOffset: 10_000,
  },
  {
    key: 'midjourney',
    displayName: 'Midjourney',
    sourceJsonPath: 'prompts/midjourney-prompts.json',
    outputJsonPath: 'src/lib/generated/awesome-ai-prompts-midjourney.json',
    imageUrlCacheCsvPath:
      'src/lib/generated/awesome-ai-prompts-midjourney.image-urls.csv',
    objectPrefix: 'prompt-libraries/awesome-ai-prompts/midjourney',
    defaultModelId: 'midjourney',
    sourceOrderOffset: 20_000,
  },
];

type SourceImageDimensions = {
  image: string;
  width: number;
  height: number;
  aspect_ratio: string;
};

type AwesomeAiPromptSourceRecord = {
  index: number;
  id: string;
  prompt: string;
  author?: string;
  author_name?: string;
  image?: string;
  images?: string[];
  image_dimensions?: SourceImageDimensions[];
  model?: string;
  model_id?: string;
  published?: string;
  source_url?: string;
  languages?: string[];
};

type VogueGeneratedPromptEntry = {
  id: string;
  sourceOrder: number;
  title: string;
  images: string[];
  prompt: string;
  modelId: string;
  authorName?: string;
  authorHandle?: string;
  publishedLabel: string;
  sourceUrl?: string;
  languages?: string[];
};

type ImageUrlCacheEntry = {
  imagePath: string;
  objectKey: string;
  publicUrl: string;
  recordId: string;
};

type ModelImportSummary = {
  cachedImageCount: number;
  displayName: string;
  importedImageCount: number;
  importedPromptCount: number;
  imageUrlCacheCsvPath: string;
  key: string;
  outputJsonPath: string;
  skippedExistingImageCount: number;
  sourceJsonPath: string;
  uploadedImageCount: number;
};

const endpoint = process.env.R2_ENDPOINT || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const region = process.env.R2_REGION || 'auto';
const bucket = process.env.R2_IMAGE_BUCKET_NAME || '';
const publicBase = process.env.R2_IMAGE_PUBLIC_URL || '';

const getFlagValue = (flagName: string) => {
  const flag = process.argv.find((value) => value.startsWith(`${flagName}=`));
  return flag ? flag.slice(flag.indexOf('=') + 1) : undefined;
};

const hasFlag = (flagName: string) => process.argv.includes(flagName);

const sourceRepoFlag = getFlagValue('--source-repo');
const modelFlag = getFlagValue('--model');
const limitFlag = getFlagValue('--limit');
const dryRun = hasFlag('--dry-run');
const forceUpload = hasFlag('--force-upload');
const limit = limitFlag ? Number.parseInt(limitFlag, 10) : undefined;

if (limitFlag && (!Number.isFinite(limit) || (limit ?? 0) <= 0)) {
  throw new Error(`Invalid --limit value: ${limitFlag}`);
}

for (const [name, value] of [
  ['R2_ENDPOINT', endpoint],
  ['R2_ACCESS_KEY_ID', accessKeyId],
  ['R2_SECRET_ACCESS_KEY', secretAccessKey],
  ['R2_IMAGE_BUCKET_NAME', bucket],
  ['R2_IMAGE_PUBLIC_URL', publicBase],
]) {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
}

const sourceRepoPath = resolve(sourceRepoFlag || DEFAULT_SOURCE_REPO_PATH);
const dimensionsJsonPath = resolve(process.cwd(), DIMENSIONS_JSON_PATH);

const selectedModelConfigs = modelFlag
  ? MODEL_IMPORT_CONFIGS.filter((config) => config.key === modelFlag)
  : MODEL_IMPORT_CONFIGS;

if (selectedModelConfigs.length === 0) {
  throw new Error(
    `Unknown --model value: ${modelFlag}. Expected one of ${MODEL_IMPORT_CONFIGS.map(
      (config) => config.key
    ).join(', ')}`
  );
}

const client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint,
  forcePathStyle: true,
  region,
});

const contentTypeForFile = (filePath: string) => {
  const extension = filePath.toLowerCase().split('.').pop() || '';
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  throw new Error(`Unsupported image extension for ${filePath}`);
};

const buildObjectKey = (
  config: ModelImportConfig,
  record: AwesomeAiPromptSourceRecord,
  imagePath: string
) => `${config.objectPrefix}/${record.id}/${basename(imagePath)}`;

const buildPublicImageUrl = (objectKey: string) =>
  `${publicBase.replace(/\/$/, '')}/${objectKey}`;

const buildImageUrlCacheKey = (recordId: string, imagePath: string) =>
  `${recordId}::${imagePath}`;

const parseCsvLine = (line: string) => {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && inQuotes && nextCharacter === '"') {
      currentField += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (character === ',' && !inQuotes) {
      fields.push(currentField);
      currentField = '';
      continue;
    }

    currentField += character;
  }

  fields.push(currentField);
  return fields;
};

const escapeCsvField = (value: string) => `"${value.replace(/"/g, '""')}"`;

const readImageUrlCache = async (imageUrlCacheCsvPath: string) => {
  const cachedEntries = new Map<string, ImageUrlCacheEntry>();
  let csvText = '';

  try {
    csvText = await readFile(imageUrlCacheCsvPath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return cachedEntries;
    }
    throw error;
  }

  for (const line of csvText.trim().split(/\r?\n/).slice(1)) {
    if (!line.trim()) continue;
    const [recordId, imagePath, objectKey, publicUrl] = parseCsvLine(line);
    if (!recordId || !imagePath || !objectKey || !publicUrl) continue;
    cachedEntries.set(buildImageUrlCacheKey(recordId, imagePath), {
      imagePath,
      objectKey,
      publicUrl,
      recordId,
    });
  }

  return cachedEntries;
};

const writeImageUrlCache = async (
  imageUrlCacheCsvPath: string,
  cachedEntries: Map<string, ImageUrlCacheEntry>
) => {
  const rows = [...cachedEntries.values()].sort((left, right) => {
    const recordCompare = left.recordId.localeCompare(right.recordId);
    return recordCompare !== 0
      ? recordCompare
      : left.imagePath.localeCompare(right.imagePath);
  });
  const csvRows = [
    'record_id,image_path,object_key,public_url',
    ...rows.map((entry) =>
      [entry.recordId, entry.imagePath, entry.objectKey, entry.publicUrl]
        .map(escapeCsvField)
        .join(',')
    ),
  ];

  await mkdir(dirname(imageUrlCacheCsvPath), { recursive: true });
  await writeFile(imageUrlCacheCsvPath, `${csvRows.join('\n')}\n`);
};

const uploadImage = async (
  config: ModelImportConfig,
  record: AwesomeAiPromptSourceRecord,
  imagePath: string,
  imageUrlCache: Map<string, ImageUrlCacheEntry>
) => {
  const absoluteImagePath = resolve(sourceRepoPath, imagePath);
  const objectKey = buildObjectKey(config, record, imagePath);
  const publicImageUrl = buildPublicImageUrl(objectKey);
  const cacheKey = buildImageUrlCacheKey(record.id, imagePath);
  const cachedImageUrl = imageUrlCache.get(cacheKey);

  if (
    cachedImageUrl &&
    cachedImageUrl.objectKey === objectKey &&
    !forceUpload
  ) {
    return {
      cached: true,
      publicImageUrl: cachedImageUrl.publicUrl,
      skippedExisting: false,
      uploaded: false,
    };
  }

  if (dryRun) {
    return {
      cached: false,
      publicImageUrl,
      skippedExisting: false,
      uploaded: false,
    };
  }

  const body = await readFile(absoluteImagePath);
  await client.send(
    new PutObjectCommand({
      Body: body,
      Bucket: bucket,
      CacheControl: CACHE_CONTROL_HEADER,
      ContentLength: body.length,
      ContentType: contentTypeForFile(absoluteImagePath),
      Key: objectKey,
    }),
    {
      abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    }
  );

  imageUrlCache.set(cacheKey, {
    imagePath,
    objectKey,
    publicUrl: publicImageUrl,
    recordId: record.id,
  });

  return {
    cached: false,
    publicImageUrl,
    skippedExisting: false,
    uploaded: true,
  };
};

const titleFromImagePath = (imagePath: string) => {
  const stem = basename(imagePath).replace(/\.[^.]+$/, '').replace(/-\d+$/, '');
  return stem
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const getDimensionsByImagePath = (record: AwesomeAiPromptSourceRecord) => {
  const dimensionsByImagePath = new Map<string, SourceImageDimensions>();
  for (const dimensions of record.image_dimensions ?? []) {
    dimensionsByImagePath.set(dimensions.image, dimensions);
  }
  return dimensionsByImagePath;
};

const getImagePaths = (record: AwesomeAiPromptSourceRecord) =>
  Array.isArray(record.images) && record.images.length > 0
    ? record.images
    : record.image
      ? [record.image]
      : [];

const importModel = async (
  config: ModelImportConfig,
  dimensions: Record<string, { width: number; height: number; aspectRatio: string }>
): Promise<ModelImportSummary> => {
  const sourceJsonPath = resolve(sourceRepoPath, config.sourceJsonPath);
  const outputJsonPath = resolve(process.cwd(), config.outputJsonPath);
  const imageUrlCacheCsvPath = resolve(process.cwd(), config.imageUrlCacheCsvPath);
  const sourceRecords = JSON.parse(
    await readFile(sourceJsonPath, 'utf8')
  ) as AwesomeAiPromptSourceRecord[];
  const orderedRecords = sourceRecords.sort((left, right) => left.index - right.index);
  const recordsToImport =
    typeof limit === 'number' ? orderedRecords.slice(0, limit) : orderedRecords;
  const imageUrlCache = await readImageUrlCache(imageUrlCacheCsvPath);
  const uploadedImageUrlMap = new Map<string, string>();
  let cachedImageCount = 0;
  let uploadedImageCount = 0;
  let skippedExistingImageCount = 0;
  let processedImageCount = 0;
  const totalImageCount = recordsToImport.reduce(
    (total, record) => total + getImagePaths(record).length,
    0
  );

  console.error(
    `[awesome-ai:${config.key}] importing ${recordsToImport.length} prompts and ${totalImageCount} images from ${sourceJsonPath}`
  );

  for (const record of recordsToImport) {
    for (const imagePath of getImagePaths(record)) {
      const uploadResult = await uploadImage(config, record, imagePath, imageUrlCache);
      processedImageCount += 1;
      uploadedImageUrlMap.set(
        `${record.id}::${imagePath}`,
        uploadResult.publicImageUrl
      );

      if (uploadResult.cached) cachedImageCount += 1;
      if (uploadResult.uploaded) uploadedImageCount += 1;
      if (uploadResult.skippedExisting) skippedExistingImageCount += 1;

      if (
        processedImageCount === 1 ||
        processedImageCount === totalImageCount ||
        processedImageCount % LOG_EVERY_IMAGES === 0
      ) {
        console.error(
          `[awesome-ai:${config.key}] images ${processedImageCount}/${totalImageCount} cached=${cachedImageCount} uploaded=${uploadedImageCount}`
        );
      }
    }
  }

  const normalizedEntries: VogueGeneratedPromptEntry[] = recordsToImport.map(
    (record) => {
      const imagePaths = getImagePaths(record);
      const images = imagePaths.map((imagePath) => {
        const uploadedImageUrl = uploadedImageUrlMap.get(
          `${record.id}::${imagePath}`
        );
        if (!uploadedImageUrl) {
          throw new Error(`Missing uploaded URL for ${record.id} -> ${imagePath}`);
        }
        return uploadedImageUrl;
      });

      return {
        id: record.id,
        sourceOrder: config.sourceOrderOffset + record.index,
        title: titleFromImagePath(imagePaths[0] ?? record.id),
        images,
        prompt: record.prompt,
        modelId: record.model_id || config.defaultModelId,
        authorName: record.author_name,
        authorHandle: record.author,
        publishedLabel: record.published || '',
        sourceUrl: record.source_url,
        languages: record.languages,
      };
    }
  );

  for (const record of recordsToImport) {
    const dimensionsByImagePath = getDimensionsByImagePath(record);

    for (const imagePath of getImagePaths(record)) {
      const publicImageUrl = uploadedImageUrlMap.get(`${record.id}::${imagePath}`);
      const sourceDimensions = dimensionsByImagePath.get(imagePath);
      if (!publicImageUrl || !sourceDimensions) continue;
      dimensions[publicImageUrl] = {
        width: sourceDimensions.width,
        height: sourceDimensions.height,
        aspectRatio: sourceDimensions.aspect_ratio,
      };
    }
  }

  await mkdir(dirname(outputJsonPath), { recursive: true });
  await writeFile(
    outputJsonPath,
    `${JSON.stringify(normalizedEntries, null, 2)}\n`
  );

  if (!dryRun) {
    await writeImageUrlCache(imageUrlCacheCsvPath, imageUrlCache);
  }

  return {
    cachedImageCount,
    displayName: config.displayName,
    importedPromptCount: normalizedEntries.length,
    importedImageCount: normalizedEntries.reduce(
      (total, entry) => total + entry.images.length,
      0
    ),
    skippedExistingImageCount,
    uploadedImageCount,
    imageUrlCacheCsvPath,
    key: config.key,
    outputJsonPath,
    sourceJsonPath,
  };
};

const main = async () => {
  const existingDimensions = JSON.parse(
    await readFile(dimensionsJsonPath, 'utf8')
  ) as Record<string, { width: number; height: number; aspectRatio: string }>;
  const nextDimensions = { ...existingDimensions };
  const modelSummaries: ModelImportSummary[] = [];

  for (const config of selectedModelConfigs) {
    modelSummaries.push(await importModel(config, nextDimensions));
  }

  await writeFile(
    dimensionsJsonPath,
    `${JSON.stringify(nextDimensions, null, 2)}\n`
  );

  console.log(
    JSON.stringify(
      {
        dryRun,
        forceUpload,
        importedImageCount: modelSummaries.reduce(
          (total, summary) => total + summary.importedImageCount,
          0
        ),
        importedPromptCount: modelSummaries.reduce(
          (total, summary) => total + summary.importedPromptCount,
          0
        ),
        models: modelSummaries,
        sourceRepoPath,
      },
      null,
      2
    )
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
