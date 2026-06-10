import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { renderInlineVariablePrompt } from './lib/vogueai-prompt-renderer';

type DbPromptAssetRow = {
  id: string;
  title: string;
  template_id: string;
  original_prompt: string;
  normalized_prompt: string;
  prompt_schema_json: string;
  variables_json: string;
  example_variables_json: string;
  prompt_instances_json: string;
  local_media_json: string;
  selected_media_path: string;
  prompt_page_slug: string;
  created_at: string;
  updated_at: string;
};

type PromptInstance = {
  instanceId?: string;
  variables?: Record<string, unknown>;
  promptSchema?: Record<string, unknown>;
  finalPrompt?: string;
  imagePathAbs?: string;
};

type LocalMedia = {
  kind?: string;
  value?: string;
  role?: string;
  label?: string;
};

type SourcePromptPair = Record<string, unknown> & {
  id: string;
  slug: string;
  source_group: string;
  source_group_title: string;
  source_type: string;
  source_label: string;
  post_url: string;
  source_url?: string;
  author_name: string;
  author_handle: string;
  published_at: string;
  gallery_published_at?: string;
  prompt_visibility: string;
  mapping_confidence: string;
  model_confidence: string;
  notes: string;
  image_url: string;
  local_image: string;
  title: string;
  sort_order: number;
  prompt: string;
  prompt_id: string;
  db_asset_id?: string;
  db_template_id?: string;
};

type PromptRemixVariable = {
  key: string;
  label: string;
  defaultValue: string;
  suggestions: string[];
};

type PromptRemixSchema = {
  promptId: string;
  variables: PromptRemixVariable[];
  keepTerms: string[];
};

const DEFAULT_DB_PATH =
  '/Users/kkkk/Desktop/KKKK外链整理/data/submit_agent.db';
const DEFAULT_SOURCE_REPO_PATH = '/Users/kkkk/Desktop/awesome-ai prompts';
const SOURCE_PAIRS_PATH = 'data/gpt-image-2/x-prompt-image-pairs.json';
const VOGUEAI_ASSET_DIR = 'assets/gpt-image-2-vogueai-originals';
const REMIX_SCHEMA_PATH =
  'src/lib/generated/vogueai-db-prompt-remix-schemas.json';

const runStartedAt = new Date();
const formatDateOnly = (date: Date) => date.toISOString().slice(0, 10);
const DEFAULT_PUBLISHED_AT = formatDateOnly(runStartedAt);

const genericTitleOverrides: Record<string, string> = {
  'claude-fable-5-vs-mythos-5-epic-tech-poster-v1':
    'Claude Fable 5 vs Mythos 5 Epic Tech Poster AI Prompt',
  'ai-image-prompt-x2062080407781392432-v1':
    'Virtual Creator Editorial Portrait AI Prompt',
  'ai-image-prompt-x2062325077912519045-v1':
    'Startup Founder Editorial Portrait AI Prompt',
  'ai-image-prompt-x2062447548577784083-v1':
    'Soft Waves Editorial Portrait Set AI Prompt',
  'ai-image-prompt-x2062696495741391006-v1':
    'Editorial Portrait Collage Set AI Prompt',
  'ai-image-prompt-x2062687215734645033-v1':
    'Astronaut Silhouette Universe Poster AI Prompt',
  'ai-image-prompt-x2062693385245261873-v1':
    'Cinematic Cosmic Spacecraft Vista AI Prompt',
};

const wordDisplayOverrides: Record<string, string> = {
  ai: 'AI',
  app: 'App',
  bazi: 'Bazi',
  e: 'e',
  ip: 'IP',
  sci: 'Sci',
  ui: 'UI',
  wechat: 'WeChat',
  xiaohongshu: 'Xiaohongshu',
  youtube: 'YouTube',
  vs: 'vs',
  '3d': '3D',
};

const getFlagValue = (name: string) => {
  const arg = process.argv.find((value) => value.startsWith(`${name}=`));
  return arg ? arg.slice(arg.indexOf('=') + 1) : undefined;
};

const hasFlag = (name: string) => process.argv.includes(name);

const dbPath = getFlagValue('--db') || DEFAULT_DB_PATH;
const sourceRepoPath =
  getFlagValue('--source-repo') || DEFAULT_SOURCE_REPO_PATH;
const publishedAt = getFlagValue('--published-at') || DEFAULT_PUBLISHED_AT;
const galleryPublishedAt =
  getFlagValue('--gallery-published-at') || runStartedAt.toISOString();
const dryRun = hasFlag('--dry-run');

const productRoot = process.cwd();
const sourcePairsFullPath = path.join(sourceRepoPath, SOURCE_PAIRS_PATH);
const remixSchemaFullPath = path.join(productRoot, REMIX_SCHEMA_PATH);

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value || '') as T;
  } catch {
    return fallback;
  }
}

function slugify(value: string, fallback = 'prompt') {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug || fallback;
}

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function titleCaseFromSlug(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((word) => {
      const override = wordDisplayOverrides[word.toLowerCase()];
      if (override) return override;
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(' ');
}

function stripTemplateSuffix(templateId: string) {
  return templateId
    .replace(/-v\d+$/i, '')
    .replace(/-x\d+$/i, '');
}

function isGenericTemplateId(templateId: string) {
  return /^ai-image-prompt-x\d+-v\d+$/i.test(templateId);
}

function deriveThemeTitle(row: DbPromptAssetRow) {
  const schema = parseJson<Record<string, unknown>>(row.prompt_schema_json, {});
  const theme = String(schema.theme || schema.intent || '').trim();
  const match = /reusable\s+(.+?)\s+built\s+around/i.exec(theme);
  if (!match?.[1]) return '';

  return `${titleCaseFromSlug(slugify(match[1]))} AI Prompt`;
}

function getPublicTitle(row: DbPromptAssetRow) {
  const override = genericTitleOverrides[row.template_id];
  if (override) return override;

  if (isGenericTemplateId(row.template_id)) {
    const themeTitle = deriveThemeTitle(row);
    if (themeTitle && !/\bX\d+\b/i.test(themeTitle)) return themeTitle;
  }

  const base = stripTemplateSuffix(row.template_id);
  return `${titleCaseFromSlug(base)} AI Prompt`;
}

function getGroupId(
  row: DbPromptAssetRow,
  title: string,
  used: Set<string>,
  existingGroupId?: string
) {
  if (row.prompt_page_slug.trim()) return row.prompt_page_slug.trim();
  if (existingGroupId) {
    used.add(existingGroupId);
    return existingGroupId;
  }

  const titleSlug = slugify(title.replace(/\s+AI Prompt$/i, ''));
  const base = `vogueai-${publishedAt.replace(/-/g, '')}-${titleSlug}-ai-prompt`;
  let groupId = base;
  let suffix = 2;

  while (used.has(groupId)) {
    groupId = `${base}-${suffix}`;
    suffix += 1;
  }

  used.add(groupId);
  return groupId;
}

function getExistingGalleryPublishedAt(
  pair: SourcePromptPair | undefined,
  fallbackPairs: SourcePromptPair[]
) {
  const candidates = pair ? [pair, ...fallbackPairs] : fallbackPairs;
  return candidates
    .map((candidate) => candidate.gallery_published_at?.trim())
    .find((value): value is string => Boolean(value));
}

function getStableSortOrder(
  pair: SourcePromptPair | undefined,
  fallbackSortOrder: number
) {
  const sortOrder = Number(pair?.sort_order);
  return Number.isFinite(sortOrder) ? sortOrder : fallbackSortOrder;
}

function humanizeVariableKey(key: string) {
  return key
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const override = wordDisplayOverrides[word.toLowerCase()];
      if (override) return override;
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(' ');
}

function stringifyVariableValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(stringifyVariableValue).filter(Boolean).join(', ');
  }
  if (value && typeof value === 'object') {
    return Object.values(value).map(stringifyVariableValue).filter(Boolean).join(', ');
  }
  return String(value ?? '').trim();
}

function uniqueValues(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values.map(compactWhitespace).filter(Boolean)) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }

  return result;
}

function titleFromIdentifier(value: string, fallback: string) {
  const cleaned = value
    .replace(/^\d{8}-/, '')
    .replace(/-\d+$/, '')
    .replace(/-{2,}/g, '-');

  return titleCaseFromSlug(slugify(cleaned, fallback));
}

function getInstanceId(instance: PromptInstance) {
  return instance.instanceId?.trim() || '';
}

function matchInstanceForMedia(
  media: LocalMedia,
  mediaIndex: number,
  instances: PromptInstance[]
) {
  const mediaPath = media.value?.trim();
  const mediaLabel = media.label?.trim();
  const byPath = instances.find((instance) => instance.imagePathAbs === mediaPath);
  if (byPath) return byPath;

  const byLabel = instances.find((instance) => {
    const instanceId = getInstanceId(instance);
    return instanceId && mediaLabel && instanceId === mediaLabel;
  });
  if (byLabel) return byLabel;

  if (instances.length === mediaIndex + 1 || instances.length > mediaIndex) {
    return instances[mediaIndex] ?? null;
  }

  return null;
}

function buildFallbackPrompt(
  row: DbPromptAssetRow,
  media: LocalMedia,
  groupTitle: string,
  firstInstance: PromptInstance | null
) {
  const schema =
    firstInstance?.promptSchema ??
    parseJson<Record<string, unknown>>(row.prompt_schema_json, {});
  const variantTitle = titleFromIdentifier(media.label || media.value || '', groupTitle);
  const parts = Object.entries(schema)
    .map(([key, value]) => {
      const text = stringifyVariableValue(value);
      if (!text) return '';
      return `${humanizeVariableKey(key)}: ${text}`;
    })
    .filter(Boolean);

  return compactWhitespace(
    [
      `Create a reusable ${groupTitle.replace(/\s+AI Prompt$/i, '').toLowerCase()} with controlled variables.`,
      parts.join(' '),
      `Variant focus: ${variantTitle}.`,
      'Keep the visual style consistent with the template while changing only the listed variables.',
    ].join(' ')
  );
}

function collectSuggestionValues(
  key: string,
  instances: PromptInstance[],
  examples: Array<Record<string, unknown>>
) {
  return uniqueValues([
    ...instances.map((instance) =>
      stringifyVariableValue(instance.variables?.[key])
    ),
    ...examples.map((example) => {
      const variables =
        example.variables && typeof example.variables === 'object'
          ? (example.variables as Record<string, unknown>)
          : example;
      return stringifyVariableValue(variables[key]);
    }),
  ]);
}

function extractKeepTerms(prompt: string, promptSchema: Record<string, unknown>) {
  const candidates = Object.entries(promptSchema)
    .filter(([key]) =>
      /style|composition|lighting|texture|layout|visual|typography|restriction/i.test(key)
    )
    .flatMap(([, value]) =>
      stringifyVariableValue(value)
        .split(/[,.;]/)
        .map(compactWhitespace)
    )
    .filter(
      (value) =>
        value.length >= 18 &&
        value.length <= 90 &&
        !/[{}]/.test(value) &&
        prompt.includes(value)
    );

  return uniqueValues(candidates).slice(0, 5);
}

function buildRemixSchema(
  promptId: string,
  prompt: string,
  instance: PromptInstance | null,
  allInstances: PromptInstance[],
  examples: Array<Record<string, unknown>>,
  fallbackTitle: string
): PromptRemixSchema {
  const variablesSource = instance?.variables ?? {
    variant: fallbackTitle,
  };
  const promptSchema = instance?.promptSchema ?? {};

  const variables = Object.entries(variablesSource)
    .map(([key, value]) => {
      const defaultValue = stringifyVariableValue(value);
      if (!defaultValue || defaultValue.length > 240) return null;
      const suggestions = collectSuggestionValues(key, allInstances, examples)
        .filter((suggestion) => suggestion !== defaultValue)
        .slice(0, 4);
      if (suggestions.length === 0) return null;

      return {
        key,
        label: humanizeVariableKey(key),
        defaultValue,
        suggestions,
      };
    })
    .filter((variable): variable is PromptRemixVariable => Boolean(variable))
    .slice(0, 8);

  return {
    promptId,
    variables,
    keepTerms: extractKeepTerms(prompt, promptSchema),
  };
}

async function copyMediaAsset(
  sourcePath: string,
  groupId: string,
  title: string,
  imageIndex: number,
  usedAssetNames: Set<string>,
  existingLocalImage?: string
) {
  if (existingLocalImage) {
    const existingDestinationPath = path.join(sourceRepoPath, existingLocalImage);
    try {
      await fs.access(existingDestinationPath);
      usedAssetNames.add(path.basename(existingLocalImage));
      return existingLocalImage;
    } catch {
      // Fall through and copy the source media again if the old path is stale.
    }
  }

  const extension = path.extname(sourcePath) || '.png';
  const base = slugify(`${groupId.replace(/^vogueai-\d+-/, '')}-${title}`)
    .slice(0, 130)
    .replace(/-+$/g, '');
  let fileName = `${base}-${String(imageIndex + 1).padStart(2, '0')}${extension}`;
  let suffix = 2;

  while (usedAssetNames.has(fileName)) {
    fileName = `${base}-${String(imageIndex + 1).padStart(2, '0')}-${suffix}${extension}`;
    suffix += 1;
  }

  usedAssetNames.add(fileName);
  const relativePath = `${VOGUEAI_ASSET_DIR}/${fileName}`;
  const destinationPath = path.join(sourceRepoPath, relativePath);

  if (!dryRun) {
    await fs.mkdir(path.dirname(destinationPath), { recursive: true });
    await fs.copyFile(sourcePath, destinationPath);
  }

  return relativePath;
}

function queryCandidateRows() {
  const sql = `
    select id, title, template_id, original_prompt, normalized_prompt,
           prompt_schema_json, variables_json, example_variables_json,
           prompt_instances_json, local_media_json, selected_media_path,
           prompt_page_slug, created_at, updated_at
    from vogue_prompt_assets
    where verification_status='pending_verification'
      and generation_status='generated'
      and page_status='not_started'
    order by created_at asc, template_id asc;
  `;
  const output = execFileSync('sqlite3', ['-json', dbPath, sql], {
    encoding: 'utf8',
    maxBuffer: 128 * 1024 * 1024,
  });

  return JSON.parse(output) as DbPromptAssetRow[];
}

function isGeneratedDbPair(pair: Record<string, unknown>) {
  return (
    typeof pair.db_asset_id === 'string' ||
    (typeof pair.notes === 'string' &&
      pair.notes.includes('Generated from vogue_prompt_assets'))
  );
}

async function run() {
  const rows = queryCandidateRows();
  const sourcePairs = parseJson<SourcePromptPair[]>(
    await fs.readFile(sourcePairsFullPath, 'utf8'),
    []
  );
  const previousGeneratedPairs = sourcePairs.filter(isGeneratedDbPair);
  const currentRowIds = new Set(rows.map((row) => row.id));
  const preservedPairs = sourcePairs.filter(
    (pair) =>
      !isGeneratedDbPair(pair) ||
      !currentRowIds.has(String(pair.db_asset_id || ''))
  );
  const previousGeneratedPairsById = new Map(
    previousGeneratedPairs.map((pair) => [pair.id, pair] as const)
  );
  const previousGeneratedPairsByAssetId = previousGeneratedPairs.reduce(
    (pairsByAssetId, pair) => {
      if (!pair.db_asset_id) return pairsByAssetId;

      const assetPairs = pairsByAssetId.get(pair.db_asset_id) ?? [];
      assetPairs.push(pair);
      pairsByAssetId.set(pair.db_asset_id, assetPairs);
      return pairsByAssetId;
    },
    new Map<string, SourcePromptPair[]>()
  );
  const existingGroupIdByAssetId = new Map(
    [...previousGeneratedPairsByAssetId.entries()].flatMap(
      ([assetId, assetPairs]) => {
        const groupId = assetPairs
          .map((pair) => pair.source_group?.trim())
          .find((value): value is string => Boolean(value));

        return groupId ? [[assetId, groupId] as const] : [];
      }
    )
  );
  const existingAssetNames = new Set(
    sourcePairs
      .map((pair) =>
        typeof pair.local_image === 'string' ? path.basename(pair.local_image) : ''
      )
      .filter(Boolean)
  );

  const maxExistingVogueSortOrder = sourcePairs
    .filter((pair) => pair.source_type === 'vogueai')
    .reduce((max, pair) => {
      const sortOrder = Number(pair.sort_order);
      return Number.isFinite(sortOrder) ? Math.max(max, sortOrder) : max;
    }, 0);
  let nextSortOrder = maxExistingVogueSortOrder + 1;
  const usedGroupIds = new Set(
    sourcePairs.map((pair) => String(pair.source_group || '')).filter(Boolean)
  );
  const generatedPairs: SourcePromptPair[] = [];
  const existingRemixSchemas = parseJson<Record<string, PromptRemixSchema>>(
    await fs.readFile(remixSchemaFullPath, 'utf8').catch(() => '{}'),
    {}
  );
  const remixSchemas: Record<string, PromptRemixSchema> = {
    ...existingRemixSchemas,
  };
  const problems: string[] = [];

  for (const row of rows) {
    const publicTitle = getPublicTitle(row);
    const existingAssetPairs = previousGeneratedPairsByAssetId.get(row.id) ?? [];
    const groupId = getGroupId(
      row,
      publicTitle,
      usedGroupIds,
      existingGroupIdByAssetId.get(row.id)
    );
    const mediaItems = parseJson<LocalMedia[]>(row.local_media_json, []);
    const instances = parseJson<PromptInstance[]>(row.prompt_instances_json, []);
    const examples = parseJson<Array<Record<string, unknown>>>(
      row.example_variables_json,
      []
    );

    if (mediaItems.length === 0) {
      problems.push(`${row.template_id}: missing media`);
      continue;
    }

    const groupFirstSchemaId = groupId;

    for (const [imageIndex, media] of mediaItems.entries()) {
      if (!media.value) {
        problems.push(`${row.template_id}: media ${imageIndex + 1} missing path`);
        continue;
      }

      try {
        await fs.access(media.value);
      } catch {
        problems.push(`${row.template_id}: missing local file ${media.value}`);
        continue;
      }

      const instance = matchInstanceForMedia(media, imageIndex, instances);
      const imageTitle = titleFromIdentifier(
        media.label || instance?.instanceId || media.value,
        publicTitle.replace(/\s+AI Prompt$/i, '')
      );
      const prompt = renderInlineVariablePrompt(
        compactWhitespace(
          instance?.finalPrompt ||
            buildFallbackPrompt(row, media, publicTitle, instances[0] ?? null)
        ),
        instance?.variables
      );
      const pairId = `${groupId}-${String(imageIndex + 1).padStart(2, '0')}`;
      const existingPair = previousGeneratedPairsById.get(pairId);
      const localImage = await copyMediaAsset(
        media.value,
        groupId,
        imageTitle,
        imageIndex,
        existingAssetNames,
        typeof existingPair?.local_image === 'string'
          ? existingPair.local_image
          : undefined
      );
      const promptIdBase = slugify(`${groupId}-${imageTitle}`);
      const promptId = `${promptIdBase.slice(0, 165).replace(/-+$/g, '')}-${String(
        imageIndex + 1
      ).padStart(2, '0')}`;
      const stableSortOrder = getStableSortOrder(existingPair, nextSortOrder);
      const stableGalleryPublishedAt =
        getExistingGalleryPublishedAt(existingPair, existingAssetPairs) ??
        galleryPublishedAt;

      generatedPairs.push({
        source_group: groupId,
        source_group_title: publicTitle,
        source_type: 'vogueai',
        source_label: 'Vogue AI',
        post_url: '',
        source_url: '',
        author_name: 'Vogue AI',
        author_handle: '',
        published_at: existingPair?.published_at || publishedAt,
        gallery_published_at: stableGalleryPublishedAt,
        prompt_visibility: 'vogueai_db_generated_schema',
        mapping_confidence: instance ? 'high' : 'medium',
        model_confidence: 'high',
        notes: `Generated from vogue_prompt_assets ${row.id}.`,
        image_url: '',
        id: pairId,
        slug: pairId,
        title: imageTitle,
        sort_order: stableSortOrder,
        prompt,
        local_image: localImage,
        prompt_id: promptId,
        db_asset_id: row.id,
        db_template_id: row.template_id,
      });

      const schema = buildRemixSchema(
        promptId,
        prompt,
        instance,
        instances,
        examples,
        imageTitle
      );
      remixSchemas[promptId] = schema;
      if (imageIndex === 0) {
        remixSchemas[groupFirstSchemaId] = {
          ...schema,
          promptId: groupFirstSchemaId,
        };
      }

      nextSortOrder = Math.max(nextSortOrder, stableSortOrder + 1);
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Cannot sync DB prompt pages:\n${problems.slice(0, 30).join('\n')}`
    );
  }

  const nextPairs = [...preservedPairs, ...generatedPairs];

  if (!dryRun) {
    await fs.writeFile(
      sourcePairsFullPath,
      `${JSON.stringify(nextPairs, null, 2)}\n`
    );
    await fs.mkdir(path.dirname(remixSchemaFullPath), { recursive: true });
    await fs.writeFile(
      remixSchemaFullPath,
      `${JSON.stringify(remixSchemas, null, 2)}\n`
    );
  }

  const groupCount = new Set(generatedPairs.map((pair) => pair.source_group)).size;
  console.log(
    JSON.stringify(
      {
        dryRun,
        dbRows: rows.length,
        generatedGroups: groupCount,
        generatedPairs: generatedPairs.length,
        remixSchemas: Object.keys(remixSchemas).length,
        sourcePairsPath: sourcePairsFullPath,
        remixSchemaPath: remixSchemaFullPath,
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
