import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const IMAGE_URL_PATTERN =
  /https?:\/\/[^\s"'`)\]}]+?\.(?:png|jpe?g|webp|gif)(?:\?[^\s"'`)\]}]*)?/gi;

type ScriptArgs = {
  slug: string;
  draftPath: string;
  jobPath?: string;
  dryRun: boolean;
};

type MirrorResult = {
  mirroredCount: number;
  replacedUrlCount: number;
  filesUpdated: string[];
  validatedOwnedUrlCount: number;
  brokenOwnedUrls: string[];
  uploaded: Array<{
    sourceUrl: string;
    targetUrl: string;
    objectKey: string;
    originalFilename: string;
  }>;
};

function parseArgs(argv: string[]): ScriptArgs {
  const values: Partial<ScriptArgs> = { dryRun: false };

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === '--dry-run') {
      values.dryRun = true;
      continue;
    }
    if (!item.startsWith('--')) continue;
    const key = item.slice(2);
    const nextValue = argv[index + 1];
    if (nextValue === undefined) continue;
    if (key === 'slug') values.slug = nextValue;
    if (key === 'draft-path') values.draftPath = nextValue;
    if (key === 'job-path') values.jobPath = nextValue;
    index += 1;
  }

  if (!values.slug) {
    throw new Error('Missing required --slug');
  }
  if (!values.draftPath) {
    throw new Error('Missing required --draft-path');
  }

  return values as ScriptArgs;
}

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
}

function getContentTypeFromUrl(url: string) {
  const pathname = new URL(url).pathname.toLowerCase();
  if (pathname.endsWith('.png')) return 'image/png';
  if (pathname.endsWith('.webp')) return 'image/webp';
  if (pathname.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-');
}

function buildObjectKey(slug: string, sourceUrl: string) {
  const parsed = new URL(sourceUrl);
  const originalName = parsed.pathname.split('/').filter(Boolean).pop() || 'image.jpg';
  const hash = createHash('sha1').update(sourceUrl).digest('hex').slice(0, 12);
  return `blog/auto/${slug}/${hash}-${sanitizeFilename(originalName)}`;
}

async function listFilesRecursively(rootPath: string): Promise<string[]> {
  const entries = await fs.readdir(rootPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursively(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

async function collectTargetFiles(args: ScriptArgs) {
  const draftPath = path.resolve(args.draftPath);
  const draftDir = path.dirname(draftPath);
  const matchingDraftFiles = new Set<string>([draftPath]);

  for (const entry of await fs.readdir(draftDir)) {
    if (!entry.endsWith('.ts')) continue;
    const fullPath = path.join(draftDir, entry);
    const source = await fs.readFile(fullPath, 'utf8');
    if (source.includes(args.slug)) {
      matchingDraftFiles.add(fullPath);
    }
  }

  const files = new Set<string>(matchingDraftFiles);

  if (args.jobPath) {
    const jobPath = path.resolve(args.jobPath);
    for (const fullPath of await listFilesRecursively(jobPath)) {
      if (!/\.(json|md|mdx|ts)$/.test(fullPath)) continue;
      files.add(fullPath);
    }
  }

  return [...files];
}

function shouldMirrorUrl(url: string, publicBase: string) {
  return !url.startsWith(`${publicBase}/`);
}

function isOwnedUrl(url: string, publicBase: string) {
  return url.startsWith(`${publicBase}/`);
}

async function isUrlReachable(url: string) {
  try {
    const headResponse = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });
    if (headResponse.ok) {
      return true;
    }
    if (![403, 405, 501].includes(headResponse.status)) {
      return false;
    }
  } catch {
    // Fall through to a GET probe.
  }

  try {
    const getResponse = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });
    return getResponse.ok;
  } catch {
    return false;
  }
}

async function uploadMirroredImage({
  client,
  bucket,
  publicBase,
  slug,
  sourceUrl,
  dryRun,
}: {
  client: S3Client;
  bucket: string;
  publicBase: string;
  slug: string;
  sourceUrl: string;
  dryRun: boolean;
}) {
  const objectKey = buildObjectKey(slug, sourceUrl);
  const targetUrl = `${publicBase}/${objectKey}`;
  const originalFilename = new URL(sourceUrl).pathname.split('/').filter(Boolean).pop() || '';

  if (dryRun) {
    return { sourceUrl, targetUrl, objectKey, originalFilename };
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sourceUrl}: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || getContentTypeFromUrl(sourceUrl);
  const body = Buffer.from(await response.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public,max-age=31536000,immutable',
    })
  );

  return { sourceUrl, targetUrl, objectKey, originalFilename };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const endpoint = requireEnv('R2_ENDPOINT');
  const accessKeyId = requireEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = requireEnv('R2_SECRET_ACCESS_KEY');
  const bucket = requireEnv('R2_IMAGE_BUCKET_NAME');
  const publicBase = stripTrailingSlash(
    process.env.R2_MEDIA_PUBLIC_URL ||
      process.env.R2_IMAGE_PUBLIC_URL ||
      requireEnv('R2_MEDIA_PUBLIC_URL')
  );
  const region = process.env.R2_REGION || 'auto';

  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const files = await collectTargetFiles(args);
  const replacements = new Map<string, { targetUrl: string; objectKey: string }>();
  const basenameReplacements = new Map<string, string>();
  const uploaded: MirrorResult['uploaded'] = [];
  const filesUpdated: string[] = [];
  const finalSources = new Map<string, string>();
  let replacedUrlCount = 0;

  for (const filePath of files) {
    const source = await fs.readFile(filePath, 'utf8');
    const matches = [...source.matchAll(IMAGE_URL_PATTERN)].map((match) => match[0]);
    const uniqueUrls = [...new Set(matches)].filter((url) => shouldMirrorUrl(url, publicBase));

    for (const url of uniqueUrls) {
      if (replacements.has(url)) continue;
      const result = await uploadMirroredImage({
        client,
        bucket,
        publicBase,
        slug: args.slug,
        sourceUrl: url,
        dryRun: args.dryRun,
      });
      replacements.set(url, {
        targetUrl: result.targetUrl,
        objectKey: result.objectKey,
      });
      if (result.originalFilename && !basenameReplacements.has(result.originalFilename)) {
        basenameReplacements.set(result.originalFilename, result.targetUrl);
      }
      uploaded.push(result);
    }

    let nextSource = source;
    for (const [fromUrl, replacement] of replacements.entries()) {
      if (!nextSource.includes(fromUrl)) continue;
      nextSource = nextSource.split(fromUrl).join(replacement.targetUrl);
      replacedUrlCount += 1;
    }

    for (const [originalFilename, targetUrl] of basenameReplacements.entries()) {
      const filenamePattern = new RegExp(
        `https?:\\/\\/[^\\s"'\\` + String.raw`)\]}]+\/` + originalFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'g'
      );
      if (!filenamePattern.test(nextSource)) continue;
      nextSource = nextSource.replace(filenamePattern, targetUrl);
      replacedUrlCount += 1;
    }

    if (nextSource !== source) {
      filesUpdated.push(filePath);
      if (!args.dryRun) {
        await fs.writeFile(filePath, nextSource);
      }
    }

    finalSources.set(filePath, nextSource);
  }

  const ownedUrls = new Set<string>();
  for (const source of finalSources.values()) {
    const matches = [...source.matchAll(IMAGE_URL_PATTERN)].map((match) => match[0]);
    for (const url of new Set(matches)) {
      if (isOwnedUrl(url, publicBase)) {
        ownedUrls.add(url);
      }
    }
  }

  const brokenOwnedUrls: string[] = [];
  for (const url of ownedUrls) {
    if (!(await isUrlReachable(url))) {
      brokenOwnedUrls.push(url);
    }
  }

  if (brokenOwnedUrls.length > 0) {
    throw new Error(
      `Broken owned VogueAI media URLs found after mirroring: ${brokenOwnedUrls.join(', ')}`
    );
  }

  const result: MirrorResult = {
    mirroredCount: uploaded.length,
    replacedUrlCount,
    filesUpdated,
    validatedOwnedUrlCount: ownedUrls.size,
    brokenOwnedUrls,
    uploaded,
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
