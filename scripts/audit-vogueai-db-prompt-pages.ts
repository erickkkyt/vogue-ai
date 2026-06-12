import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import {
  getIndexableRelatedPromptEntries,
  getPromptEntryById,
  getStaticPromptPageEntries,
  type VoguePromptEntry,
} from '../src/lib/prompts';
import { getPromptPagePath } from '../src/lib/prompt-page-routes';
import {
  buildPromptRemixSegments,
  formatPromptForRemixDisplay,
  getInitialPromptRemixValues,
  getPromptRemixSchema,
} from '../src/lib/prompt-remix';

type DbPromptAssetRow = {
  id: string;
  template_id: string;
  page_status: string;
  verification_status: string;
  generation_status: string;
  prompt_page_slug: string;
  prompt_page_url: string;
};

type SourcePromptPair = {
  source_group?: string;
  prompt_id?: string;
  db_asset_id?: string;
  db_template_id?: string;
};

type AuditIssue = {
  templateId: string;
  code: string;
  detail: string;
};

const DEFAULT_DB_PATH =
  '/Users/kkkk/Desktop/KKKK外链整理/data/submit_agent.db';
const DEFAULT_SOURCE_REPO_PATH = '/Users/kkkk/Desktop/awesome-ai prompts';
const SOURCE_PAIRS_PATH = 'data/gpt-image-2/x-prompt-image-pairs.json';
const DEFAULT_SITE_ORIGIN = 'https://vogueai.net';
const LOCALES = ['zh', 'fr', 'ru', 'pt', 'ja', 'ko'] as const;

const getFlagValue = (name: string) => {
  const arg = process.argv.find((value) => value.startsWith(`${name}=`));
  return arg ? arg.slice(arg.indexOf('=') + 1) : undefined;
};

const hasFlag = (name: string) => process.argv.includes(name);

const dbPath = getFlagValue('--db') || DEFAULT_DB_PATH;
const sourceRepoPath =
  getFlagValue('--source-repo') || DEFAULT_SOURCE_REPO_PATH;
const siteOrigin = (getFlagValue('--site-origin') || DEFAULT_SITE_ORIGIN).replace(
  /\/+$/,
  ''
);
const requirePublished = hasFlag('--require-published');
const skipI18n = hasFlag('--skip-i18n');
const skipRemix = hasFlag('--skip-remix');
const writeEntryIdsPath = getFlagValue('--write-entry-ids');

function splitIds(value: string) {
  return value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const templateIds = [
  ...splitIds(getFlagValue('--template-ids') || ''),
  ...(getFlagValue('--template-ids-file')
    ? splitIds(fs.readFileSync(getFlagValue('--template-ids-file') || '', 'utf8'))
    : []),
];

function escapeSqlString(value: string) {
  return value.replace(/'/g, "''");
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return fallback;
    throw error;
  }
}

function queryRows() {
  const whereClause =
    templateIds.length > 0
      ? `template_id in (${templateIds
          .map((templateId) => `'${escapeSqlString(templateId)}'`)
          .join(', ')})`
      : '1 = 1';
  const output = execFileSync(
    'sqlite3',
    [
      '-json',
      dbPath,
      `
        select id, template_id, page_status, verification_status,
               generation_status, prompt_page_slug, prompt_page_url
        from vogue_prompt_assets
        where ${whereClause}
        order by page_status asc, updated_at desc, template_id asc;
      `,
    ],
    {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    }
  );

  return JSON.parse(output) as DbPromptAssetRow[];
}

function uniqueValues(values: Array<string | undefined>) {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean))] as string[];
}

function addIssue(
  issues: AuditIssue[],
  row: DbPromptAssetRow,
  code: string,
  detail: string
) {
  issues.push({
    templateId: row.template_id,
    code,
    detail,
  });
}

function auditEntry(
  row: DbPromptAssetRow,
  entry: VoguePromptEntry,
  sourcePairs: SourcePromptPair[],
  issues: AuditIssue[]
) {
  const canonicalUrl = `${siteOrigin}${getPromptPagePath(entry)}`;

  if (requirePublished && row.page_status !== 'published') {
    addIssue(
      issues,
      row,
      'not_published',
      `page_status=${row.page_status || '(empty)'}`
    );
  }

  if (row.prompt_page_url.trim() && row.prompt_page_url.trim() !== canonicalUrl) {
    addIssue(
      issues,
      row,
      'url_mismatch',
      `${row.prompt_page_url} != ${canonicalUrl}`
    );
  }

  if ((requirePublished || row.page_status === 'published') && !row.prompt_page_url.trim()) {
    addIssue(issues, row, 'missing_url', `expected ${canonicalUrl}`);
  }

  if (
    row.prompt_page_slug.trim() &&
    row.prompt_page_slug.trim() !== entry.id
  ) {
    addIssue(
      issues,
      row,
      'slug_mismatch',
      `${row.prompt_page_slug} != ${entry.id}`
    );
  }

  if (requirePublished && !row.prompt_page_slug.trim()) {
    addIssue(issues, row, 'missing_slug', `expected ${entry.id}`);
  }

  if (entry.images.length === 0) {
    addIssue(issues, row, 'missing_images', entry.id);
  }

  if ((entry.imagePrompts?.length ?? 0) !== entry.images.length) {
    addIssue(
      issues,
      row,
      'image_prompt_count_mismatch',
      `${entry.imagePrompts?.length ?? 0} != ${entry.images.length}`
    );
  }

  if (sourcePairs.length !== entry.images.length) {
    addIssue(
      issues,
      row,
      'source_pair_image_count_mismatch',
      `${sourcePairs.length} != ${entry.images.length}`
    );
  }

  const related = getIndexableRelatedPromptEntries(entry, 3);
  if (related.length < 3) {
    addIssue(issues, row, 'related_too_few', String(related.length));
  }

  if (!skipI18n) {
    for (const locale of LOCALES) {
      const localized = getPromptEntryById(entry.id, locale);
      if (!localized?.title?.trim()) {
        addIssue(issues, row, 'missing_localized_title', locale);
      }
      if (!entry.promptTranslations?.[locale]?.trim()) {
        addIssue(issues, row, 'missing_entry_translation', locale);
      }
    }
  }

  const sourcePromptIds = new Set(
    sourcePairs.map((pair) => pair.prompt_id?.trim()).filter(Boolean)
  );

  for (const imagePrompt of entry.imagePrompts ?? []) {
    const sourceId = imagePrompt.sourceId?.trim();
    if (!sourceId) {
      addIssue(issues, row, 'missing_source_id', imagePrompt.title || entry.id);
      continue;
    }

    if (sourcePromptIds.size > 0 && !sourcePromptIds.has(sourceId)) {
      addIssue(issues, row, 'source_id_not_in_source_pairs', sourceId);
    }

    if (!skipI18n) {
      for (const locale of LOCALES) {
        if (!imagePrompt.promptTranslations?.[locale]?.trim()) {
          addIssue(
            issues,
            row,
            'missing_image_prompt_translation',
            `${sourceId}:${locale}`
          );
        }
      }
    }

    if (skipRemix) continue;

    const schema = getPromptRemixSchema(sourceId, entry.id);
    if (!schema) {
      addIssue(issues, row, 'missing_remix_schema', sourceId);
      continue;
    }

    if (/Concrete variant variables/i.test(imagePrompt.prompt)) {
      addIssue(issues, row, 'concrete_variant_tail', sourceId);
    }

    const values = getInitialPromptRemixValues(schema);
    const promptText = formatPromptForRemixDisplay(imagePrompt.prompt);
    const segments = buildPromptRemixSegments(promptText, schema, values);
    const variableSegments = segments.filter(
      (segment) => segment.type === 'variable'
    );

    for (const variable of schema.variables) {
      if (!promptText.includes(variable.defaultValue)) {
        addIssue(
          issues,
          row,
          'remix_default_missing_from_prompt',
          `${sourceId}:${variable.key}`
        );
      }

      if (
        !variableSegments.some(
          (segment) =>
            segment.type === 'variable' && segment.key === variable.key
        )
      ) {
        addIssue(
          issues,
          row,
          'remix_variable_not_segmented',
          `${sourceId}:${variable.key}`
        );
      }

      if (
        variable.suggestions.filter(
          (suggestion) => suggestion !== variable.defaultValue
        ).length === 0
      ) {
        addIssue(
          issues,
          row,
          'remix_variable_without_alternates',
          `${sourceId}:${variable.key}`
        );
      }
    }
  }
}

function run() {
  const rows = queryRows();
  const sourcePairs = readJson<SourcePromptPair[]>(
    path.join(sourceRepoPath, SOURCE_PAIRS_PATH),
    []
  );
  const sourcePairsByTemplateId = sourcePairs.reduce((map, pair) => {
    const templateId = pair.db_template_id?.trim();
    if (!templateId) return map;

    const pairs = map.get(templateId) ?? [];
    pairs.push(pair);
    map.set(templateId, pairs);
    return map;
  }, new Map<string, SourcePromptPair[]>());
  const runtimeEntriesById = new Map(
    getStaticPromptPageEntries().map((entry) => [entry.id, entry] as const)
  );
  const issues: AuditIssue[] = [];
  const matchedEntryIds = new Set<string>();
  const samples: Array<{
    templateId: string;
    entryId: string;
    publicId: string;
    canonicalUrl: string;
    imageCount: number;
  }> = [];

  for (const row of rows) {
    const rowSourcePairs = sourcePairsByTemplateId.get(row.template_id) ?? [];
    if (rowSourcePairs.length === 0) {
      addIssue(issues, row, 'missing_source_pairs', 'no db_template_id match');
      continue;
    }

    const sourceGroups = uniqueValues(
      rowSourcePairs.map((pair) => pair.source_group)
    );
    if (sourceGroups.length !== 1) {
      addIssue(
        issues,
        row,
        'source_group_count_mismatch',
        sourceGroups.join(', ') || '(none)'
      );
      continue;
    }

    const entry = runtimeEntriesById.get(sourceGroups[0]);
    if (!entry) {
      addIssue(issues, row, 'missing_runtime_entry', sourceGroups[0]);
      continue;
    }

    matchedEntryIds.add(entry.id);
    auditEntry(row, entry, rowSourcePairs, issues);

    if (samples.length < 10) {
      samples.push({
        templateId: row.template_id,
        entryId: entry.id,
        publicId: entry.publicId,
        canonicalUrl: `${siteOrigin}${getPromptPagePath(entry)}`,
        imageCount: entry.images.length,
      });
    }
  }

  if (writeEntryIdsPath) {
    fs.writeFileSync(
      writeEntryIdsPath,
      `${[...matchedEntryIds].sort().join('\n')}\n`
    );
  }

  const issueCounts = issues.reduce<Record<string, number>>((counts, issue) => {
    counts[issue.code] = (counts[issue.code] ?? 0) + 1;
    return counts;
  }, {});

  console.log(
    JSON.stringify(
      {
        dbRows: rows.length,
        matchedRuntimeEntries: matchedEntryIds.size,
        issueCount: issues.length,
        issueCounts,
        issues: issues.slice(0, 80),
        samples,
        wroteEntryIds: writeEntryIdsPath || null,
      },
      null,
      2
    )
  );

  if (issues.length > 0) process.exit(1);
}

run();
