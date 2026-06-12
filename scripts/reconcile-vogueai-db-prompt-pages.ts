import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { getStaticPromptPageEntries } from '../src/lib/prompts';
import { getPromptPagePath } from '../src/lib/prompt-page-routes';

type DbPromptAssetRow = {
  id: string;
  template_id: string;
  page_status: string;
  prompt_page_slug: string;
  prompt_page_url: string;
};

type SourcePromptPair = {
  source_group?: string;
  db_template_id?: string;
};

const DEFAULT_DB_PATH =
  '/Users/kkkk/Desktop/KKKK外链整理/data/submit_agent.db';
const DEFAULT_SOURCE_REPO_PATH = '/Users/kkkk/Desktop/awesome-ai prompts';
const SOURCE_PAIRS_PATH = 'data/gpt-image-2/x-prompt-image-pairs.json';
const DEFAULT_SITE_ORIGIN = 'https://vogueai.net';

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
const write = hasFlag('--write');
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
        select id, template_id, page_status, prompt_page_slug, prompt_page_url
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
  const timestamp = new Date().toISOString();
  const updates: Array<{
    id: string;
    templateId: string;
    entryId: string;
    publicId: string;
    promptPageUrl: string;
    changes: string[];
  }> = [];
  const missing: Array<{
    templateId: string;
    reason: string;
    detail: string;
  }> = [];
  const matchedEntryIds = new Set<string>();

  for (const row of rows) {
    const rowSourcePairs = sourcePairsByTemplateId.get(row.template_id) ?? [];
    if (rowSourcePairs.length === 0) {
      missing.push({
        templateId: row.template_id,
        reason: 'missing_source_pairs',
        detail: 'no db_template_id match',
      });
      continue;
    }

    const sourceGroups = uniqueValues(
      rowSourcePairs.map((pair) => pair.source_group)
    );
    if (sourceGroups.length !== 1) {
      missing.push({
        templateId: row.template_id,
        reason: 'source_group_count_mismatch',
        detail: sourceGroups.join(', ') || '(none)',
      });
      continue;
    }

    const entry = runtimeEntriesById.get(sourceGroups[0]);
    if (!entry) {
      missing.push({
        templateId: row.template_id,
        reason: 'missing_runtime_entry',
        detail: sourceGroups[0],
      });
      continue;
    }

    const promptPageUrl = `${siteOrigin}${getPromptPagePath(entry)}`;
    const changes: string[] = [];
    if (row.page_status !== 'published') changes.push('page_status');
    if (row.prompt_page_slug !== entry.id) changes.push('prompt_page_slug');
    if (row.prompt_page_url !== promptPageUrl) changes.push('prompt_page_url');
    matchedEntryIds.add(entry.id);

    if (changes.length > 0) {
      updates.push({
        id: row.id,
        templateId: row.template_id,
        entryId: entry.id,
        publicId: entry.publicId,
        promptPageUrl,
        changes,
      });
    }
  }

  if (writeEntryIdsPath) {
    fs.writeFileSync(
      writeEntryIdsPath,
      `${[...matchedEntryIds].sort().join('\n')}\n`
    );
  }

  if (write && updates.length > 0) {
    const sql = [
      'BEGIN;',
      ...updates.map(
        (update) => `
          update vogue_prompt_assets
          set page_status = 'published',
              prompt_page_slug = '${escapeSqlString(update.entryId)}',
              prompt_page_url = '${escapeSqlString(update.promptPageUrl)}',
              updated_at = '${escapeSqlString(timestamp)}'
          where id = '${escapeSqlString(update.id)}';
        `
      ),
      'COMMIT;',
    ].join('\n');

    execFileSync('sqlite3', [dbPath], {
      input: sql,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
  }

  console.log(
    JSON.stringify(
      {
        dryRun: !write,
        dbRows: rows.length,
        matchedRuntimeEntries: matchedEntryIds.size,
        updateCount: updates.length,
        missingCount: missing.length,
        updates: updates.slice(0, 80),
        missing: missing.slice(0, 80),
        wroteEntryIds: writeEntryIdsPath || null,
      },
      null,
      2
    )
  );

  if (missing.length > 0) process.exitCode = 1;
}

run();
