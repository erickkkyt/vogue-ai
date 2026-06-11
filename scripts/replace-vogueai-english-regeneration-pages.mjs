#!/usr/bin/env node
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

dotenv.config({ path: '.env.local' });
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const kkkkRoot = '/Users/kkkk/Desktop/KKKK外链整理';
const dbPath = path.join(kkkkRoot, 'data/submit_agent.db');
const generatedPath = path.join(projectRoot, 'src/lib/generated/awesome-gptimage2-prompts.json');
const dimensionsPath = path.join(projectRoot, 'src/lib/generated/vogue-prompt-image-dimensions.json');
const imageCachePath = path.join(projectRoot, 'src/lib/generated/awesome-gptimage2-prompts.image-urls.csv');
const remixPath = path.join(projectRoot, 'src/lib/generated/vogueai-db-prompt-remix-schemas.json');
const manifestPath =
  process.env.MANIFEST_PATH ||
  path.join(kkkkRoot, 'data/vogueai-social-assets/2026-06-10/english-regeneration/20260610-english-regeneration-v1-retry-manifest.jsonl');
const auditDir = path.join(kkkkRoot, 'data/daily-social-runs/vogueai-x/2026-06-10');
const idsFilePath = path.join(auditDir, 'english-regeneration-page-ids.txt');

const endpoint = process.env.R2_ENDPOINT || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const region = process.env.R2_REGION || 'auto';
const bucket = process.env.R2_IMAGE_BUCKET_NAME || '';
const publicBase = (process.env.R2_IMAGE_PUBLIC_URL || '').replace(/\/$/, '');

for (const [name, value] of [
  ['R2_ENDPOINT', endpoint],
  ['R2_ACCESS_KEY_ID', accessKeyId],
  ['R2_SECRET_ACCESS_KEY', secretAccessKey],
  ['R2_IMAGE_BUCKET_NAME', bucket],
  ['R2_IMAGE_PUBLIC_URL', publicBase],
]) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
}

const client = new S3Client({
  credentials: { accessKeyId, secretAccessKey },
  endpoint,
  forcePathStyle: true,
  region,
});

const rowToEntry = {
  4: 'vogueai-20260603-personal-image-diagnosis-consulting-board-ai-prompt',
  6: 'vogueai-20260603-single-food-life-cycle-infographic-ai-prompt',
  10: 'vogueai-20260603-architectural-competition-presentation-board-ai-prompt',
  11: 'vogueai-20260603-outfit-breakdown-layout-transfer-ai-prompt',
  18: 'vogueai-20260603-traditional-face-reading-analysis-poster-ai-prompt',
  24: 'vogueai-20260603-palmistry-analysis-report-poster-ai-prompt',
  25: 'vogueai-20260603-physiognomy-analysis-report-poster-ai-prompt',
  26: 'vogueai-20260603-bazi-destined-partner-portrait-ai-prompt',
  27: 'vogueai-20260603-bazi-personal-tarot-card-ai-prompt',
  28: 'vogueai-20260603-bazi-personal-ip-character-ai-prompt',
  29: 'vogueai-20260603-bazi-life-dossier-infographic-ai-prompt',
  31: 'vogueai-20260603-xiaohongshu-3d-profile-card-ai-prompt',
  32: 'vogueai-20260603-ancient-poetry-social-card-ai-prompt',
  33: 'vogueai-20260603-xiaohongshu-nine-grid-life-guide-ai-prompt',
  34: 'vogueai-20260603-xiaohongshu-vertical-process-flow-card-ai-prompt',
  43: 'vogueai-20260603-food-photo-xiaohongshu-cover-edit-ai-prompt',
  47: 'vogueai-20260603-travel-photo-handwritten-annotation-ai-prompt',
  70: 'vogueai-20260603-traditional-sumi-e-warrior-poster-ai-prompt',
};

function readJson(filePath, fallback) {
  return fs.readFile(filePath, 'utf8')
    .then((text) => JSON.parse(text))
    .catch((error) => {
      if (fallback !== undefined && error.code === 'ENOENT') return fallback;
      throw error;
    });
}

function contentTypeForFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  throw new Error(`Unsupported image extension: ${filePath}`);
}

function parseManifestLines(text) {
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((item) => ['generated', 'reused'].includes(item.status));
}

function csvEscape(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"' && quoted && line[i + 1] === '"') {
      current += '"';
      i += 1;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (c === ',' && !quoted) {
      fields.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  fields.push(current);
  return fields;
}

async function readCache() {
  try {
    const text = await fs.readFile(imageCachePath, 'utf8');
    const map = new Map();
    for (const line of text.trim().split(/\r?\n/).slice(1)) {
      const [recordId, imagePath, objectKey, publicUrl] = parseCsvLine(line);
      if (recordId && imagePath && objectKey && publicUrl) {
        map.set(`${recordId}::${imagePath}`, { recordId, imagePath, objectKey, publicUrl });
      }
    }
    return map;
  } catch (error) {
    if (error.code === 'ENOENT') return new Map();
    throw error;
  }
}

async function writeCache(cache) {
  const rows = [...cache.values()].sort((a, b) =>
    a.recordId.localeCompare(b.recordId) || a.imagePath.localeCompare(b.imagePath)
  );
  const text = [
    'record_id,image_path,object_key,public_url',
    ...rows.map((row) =>
      [row.recordId, row.imagePath, row.objectKey, row.publicUrl].map(csvEscape).join(',')
    ),
  ].join('\n');
  await fs.writeFile(imageCachePath, `${text}\n`);
}

async function imageSize(filePath) {
  const buffer = await fs.readFile(filePath);
  if (buffer.subarray(1, 4).toString('ascii') === 'PNG') {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
      bytes: buffer.length,
      sha256: createHash('sha256').update(buffer).digest('hex'),
    };
  }
  throw new Error(`Only PNG dimensions are implemented for this batch: ${filePath}`);
}

async function upload(recordId, filePath, cache) {
  const objectKey = `prompt-libraries/awesome-gptimage2-prompts/${recordId}/${path.basename(filePath)}`;
  const publicUrl = `${publicBase}/${objectKey}`;
  const cacheKey = `${recordId}::${filePath}`;
  const cached = cache.get(cacheKey);
  if (cached?.objectKey === objectKey && cached.publicUrl === publicUrl) return publicUrl;
  const body = await fs.readFile(filePath);
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    Body: body,
    ContentLength: body.length,
    ContentType: contentTypeForFile(filePath),
    CacheControl: 'public,max-age=31536000,immutable',
  }));
  cache.set(cacheKey, { recordId, imagePath: filePath, objectKey, publicUrl });
  return publicUrl;
}

function titleFromFile(filePath) {
  return path.basename(filePath, path.extname(filePath))
    .replace(/^\d{3}-/, '')
    .replace(/-\d{2}$/, '')
    .split('-')
    .filter(Boolean)
    .map((word) => {
      const overrides = { ai: 'AI', bazi: 'Bazi', ip: 'IP', e: 'e', ui: 'UI', '3d': '3D' };
      return overrides[word] || `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(' ');
}

function firstSentencePrompt(prompts) {
  return prompts[0]?.prompt || '';
}

function buildRemix(promptId, prompt, prompts) {
  const suggestions = prompts.map((item) => item.title).filter(Boolean);
  return {
    promptId,
    variables: suggestions.length > 1
      ? [{
          key: 'variant_focus',
          label: 'Variant focus',
          defaultValue: suggestions[0],
          suggestions: suggestions.slice(1, 5),
        }]
      : [],
    keepTerms: ['English-only visible text', 'No Chinese characters anywhere'].filter((term) =>
      prompt.includes(term)
    ),
  };
}

const manifest = parseManifestLines(await fs.readFile(manifestPath, 'utf8'));
const grouped = new Map();
for (const item of manifest) {
  if (!rowToEntry[item.rowid]) continue;
  const list = grouped.get(item.rowid) || [];
  list.push(item);
  grouped.set(item.rowid, list);
}
for (const [rowid, list] of grouped) {
  list.sort((a, b) => a.variantIndex - b.variantIndex);
  if (list.length !== 2) throw new Error(`Expected 2 variants for row ${rowid}, got ${list.length}`);
}
if (grouped.size !== Object.keys(rowToEntry).length) {
  throw new Error(`Expected ${Object.keys(rowToEntry).length} row groups, got ${grouped.size}`);
}

const entries = await readJson(generatedPath);
const dimensions = await readJson(dimensionsPath, {});
const remixSchemas = await readJson(remixPath, {});
const cache = await readCache();
const updated = [];
const idsForI18n = [];
const dbUpdates = [];

for (const [rowidText, entryId] of Object.entries(rowToEntry)) {
  const rowid = Number(rowidText);
  const entry = entries.find((candidate) => candidate.id === entryId);
  if (!entry) throw new Error(`Missing product entry: ${entryId}`);
  const items = grouped.get(rowid);
  const nextImagePrompts = [];
  const nextImages = [];
  const publicMedia = [];
  const localMedia = [];
  const promptInstances = [];

  for (const item of items) {
    const localPath = item.targetAbs;
    const publicUrl = await upload(entryId, localPath, cache);
    const size = await imageSize(localPath);
    dimensions[publicUrl] = {
      width: size.width,
      height: size.height,
      aspectRatio: `${size.width} / ${size.height}`,
    };
    const sourceId = `${entryId}-english-regeneration-${String(item.variantIndex).padStart(2, '0')}`;
    const imageTitle = titleFromFile(localPath);
    nextImages.push(publicUrl);
    nextImagePrompts.push({
      image: publicUrl,
      prompt: item.prompt,
      sourceId,
      title: imageTitle,
    });
    idsForI18n.push(sourceId);
    publicMedia.push({
      kind: 'url',
      value: publicUrl,
      role: 'english_regeneration',
      label: `${imageTitle} English regeneration ${String(item.variantIndex).padStart(2, '0')}`,
    });
    localMedia.push({
      kind: 'local_path',
      value: localPath,
      role: 'english_regeneration',
      label: `${imageTitle} English regeneration ${String(item.variantIndex).padStart(2, '0')}`,
    });
    promptInstances.push({
      instanceId: sourceId,
      finalPrompt: item.prompt,
      targetFile: localPath,
      imagePathAbs: localPath,
      imageExists: true,
      imageBytes: size.bytes,
      imageSha256: size.sha256,
      status: 'generated',
      variables: {
        variant_focus: imageTitle,
        visible_text_language: 'English only',
      },
    });
    remixSchemas[sourceId] = buildRemix(sourceId, item.prompt, nextImagePrompts);
  }

  entry.images = nextImages;
  entry.imagePrompts = nextImagePrompts;
  entry.prompt = firstSentencePrompt(nextImagePrompts);
  entry.languages = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'];
  idsForI18n.push(entry.id);
  remixSchemas[entry.id] = buildRemix(entry.id, entry.prompt, nextImagePrompts);
  updated.push({ rowid, entryId, imageCount: nextImages.length, sourceIds: nextImagePrompts.map((p) => p.sourceId) });
  dbUpdates.push({ rowid, publicMedia, localMedia, promptInstances, selectedMediaPath: localMedia[0].value });
}

await fs.writeFile(generatedPath, `${JSON.stringify(entries, null, 2)}\n`);
await fs.writeFile(dimensionsPath, `${JSON.stringify(dimensions, null, 2)}\n`);
await fs.writeFile(remixPath, `${JSON.stringify(remixSchemas, null, 2)}\n`);
await writeCache(cache);

for (const update of dbUpdates) {
  const now = new Date().toISOString();
  const sql = `
    UPDATE vogue_prompt_assets
    SET public_media_json = json('${JSON.stringify(update.publicMedia).replace(/'/g, "''")}'),
        local_media_json = json('${JSON.stringify(update.localMedia).replace(/'/g, "''")}'),
        prompt_instances_json = json('${JSON.stringify(update.promptInstances).replace(/'/g, "''")}'),
        selected_media_path = '${update.selectedMediaPath.replace(/'/g, "''")}',
        generation_status = 'generated',
        verification_status = 'verified',
        updated_at = '${now}'
    WHERE rowid = ${update.rowid};
  `;
  execFileSync('sqlite3', [dbPath, sql], { encoding: 'utf8' });
}

await fs.mkdir(auditDir, { recursive: true });
await fs.writeFile(idsFilePath, `${[...new Set(idsForI18n)].join('\n')}\n`);
const auditPath = path.join(auditDir, 'english-regeneration-page-replacement-20260610.json');
await fs.writeFile(auditPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  manifestPath,
  generatedPath,
  dimensionsPath,
  remixPath,
  idsFilePath,
  updated,
}, null, 2)}\n`);

console.log(JSON.stringify({
  updatedEntries: updated.length,
  uploadedOrCachedImages: updated.reduce((sum, item) => sum + item.imageCount, 0),
  idsFilePath,
  auditPath,
}, null, 2));
