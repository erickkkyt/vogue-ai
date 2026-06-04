import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { getPromptDetailInsights } from '../src/lib/prompt-detail-insights';
import {
  buildPromptPageMetadata,
  getPromptPageCanonicalPath,
} from '../src/lib/prompt-page-seo';
import {
  getIndexablePromptPageEntries,
  getLocalizedPromptEntries,
} from '../src/lib/prompts';
import { getPromptPagePath } from '../src/lib/prompt-page-routes';
import {
  getPromptSeoSignal,
  getPromptSeoSourceText,
} from '../src/lib/prompt-seo-signals';

type PageStatus = 'pass' | 'review' | 'fail';

type PageAuditRow = {
  publicId: string;
  path: string;
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  robots: string;
  indexableNow: boolean;
  category?: string;
  model?: string;
  imageCount: number;
  promptLength: number;
  detailTextLength: number;
  status: PageStatus;
  issues: string[];
};

const args = process.argv.slice(2);
const getArgValue = (name: string) => {
  const index = args.indexOf(name);

  return index >= 0 ? args[index + 1] : undefined;
};

const jsonOutputPath =
  getArgValue('--output') ?? 'reports/prompt-detail-seo-quality.json';
const markdownOutputPath =
  getArgValue('--markdown') ?? 'reports/prompt-detail-seo-quality.md';

const normalizeFingerprint = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(?:create|design|prompt|image|style|photo|visual|using)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140);

const normalizeDetailFingerprint = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(
      /\b(?:prompt|image|style|use|change|keep|model|subject|visual|details|works|because|copy|remix|vogue|ai)\b/g,
      ' '
    )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);

const addCount = (counts: Map<string, number>, value: string) => {
  counts.set(value, (counts.get(value) ?? 0) + 1);
};

const countBy = <T>(items: T[], getKey: (item: T) => string) =>
  items.reduce<Record<string, number>>((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeMarkdown(path: string, rows: PageAuditRow[]) {
  await mkdir(dirname(path), { recursive: true });

  const summary = countBy(rows, (row) => row.status);
  const reviewRows = rows
    .filter((row) => row.status !== 'pass')
    .slice(0, 120)
    .map(
      (row) =>
        `| ${row.status} | ${row.publicId} | ${row.path} | ${row.issues.join('; ')} |`
    );
  const markdown = [
    '# Prompt Detail SEO Quality Audit',
    '',
    `- Total pages: ${rows.length}`,
    `- Pass: ${summary.pass ?? 0}`,
    `- Review: ${summary.review ?? 0}`,
    `- Fail: ${summary.fail ?? 0}`,
    `- Indexable now: ${rows.filter((row) => row.indexableNow).length}`,
    `- Noindex follow now: ${rows.filter((row) => !row.indexableNow).length}`,
    '',
    '## Review Queue',
    '',
    '| Status | Public ID | URL | Issues |',
    '| --- | --- | --- | --- |',
    ...(reviewRows.length > 0 ? reviewRows : ['| pass | - | - | No review rows |']),
    '',
  ].join('\n');

  await writeFile(path, markdown);
}

async function main() {
  const entries = getLocalizedPromptEntries('en');
  const indexableIds = new Set(
    getIndexablePromptPageEntries().map((entry) => entry.publicId)
  );
  const titleCounts = new Map<string, number>();
  const descriptionCounts = new Map<string, number>();
  const fingerprintCounts = new Map<string, number>();
  const detailFingerprintCounts = new Map<string, number>();

  for (const entry of entries) {
    const metadata = buildPromptPageMetadata(entry);
    const title = String(metadata.title ?? '');
    const description = String(metadata.description ?? '');
    const fingerprint = normalizeFingerprint(
      `${entry.title} ${getPromptSeoSignal(entry, 180)}`
    );
    const insights = getPromptDetailInsights(entry);
    const detailText = [
      insights.whyItWorks,
      ...insights.anatomy.map((item) => `${item.label}: ${item.value}`),
      ...insights.variables,
      ...insights.useCases,
      ...insights.adaptationTips,
      insights.modelFit,
    ].join(' ');

    addCount(titleCounts, title);
    addCount(descriptionCounts, description);
    addCount(fingerprintCounts, fingerprint);
    addCount(detailFingerprintCounts, normalizeDetailFingerprint(detailText));
  }

  const rows: PageAuditRow[] = entries.map((entry) => {
    const metadata = buildPromptPageMetadata(entry);
    const title = String(metadata.title ?? '');
    const description = String(metadata.description ?? '');
    const canonicalPath = getPromptPageCanonicalPath(entry);
    const path = getPromptPagePath(entry);
    const insights = getPromptDetailInsights(entry);
    const detailText = [
      insights.whyItWorks,
      ...insights.anatomy.map((item) => `${item.label}: ${item.value}`),
      ...insights.variables,
      ...insights.useCases,
      ...insights.adaptationTips,
      insights.modelFit,
    ].join(' ');
    const fingerprint = normalizeFingerprint(
      `${entry.title} ${getPromptSeoSignal(entry, 180)}`
    );
    const detailFingerprint = normalizeDetailFingerprint(detailText);
    const bestPromptText = getPromptSeoSourceText(entry);
    const issues: string[] = [];

    if (path !== canonicalPath) issues.push('canonical_path_mismatch');
    if (!path.endsWith(`-${entry.publicId}`)) issues.push('missing_slug_public_id');
    if (title.length < 35 || title.length > 60) issues.push('title_length');
    if (description.length < 120 || description.length > 170) {
      issues.push('description_length');
    }
    if ((titleCounts.get(title) ?? 0) > 1) issues.push('duplicate_title');
    if ((descriptionCounts.get(description) ?? 0) > 1) {
      issues.push('duplicate_description');
    }
    if ((fingerprintCounts.get(fingerprint) ?? 0) > 1) {
      issues.push('near_duplicate_prompt');
    }
    if ((detailFingerprintCounts.get(detailFingerprint) ?? 0) > 1) {
      issues.push('duplicate_more_details');
    }
    if (entry.images.length <= 0) issues.push('missing_image');
    if (bestPromptText.length < 20) issues.push('thin_prompt');
    if (detailText.length < 900) issues.push('thin_more_details');

    const hasFailIssue = issues.some((issue) =>
      [
        'canonical_path_mismatch',
        'missing_slug_public_id',
        'title_length',
        'description_length',
        'missing_image',
        'thin_prompt',
        'thin_more_details',
      ].includes(issue)
    );
    const status: PageStatus = hasFailIssue
      ? 'fail'
      : issues.length > 0
        ? 'review'
        : 'pass';

    return {
      publicId: entry.publicId,
      path,
      title,
      titleLength: title.length,
      description,
      descriptionLength: description.length,
      robots: JSON.stringify(metadata.robots),
      indexableNow: indexableIds.has(entry.publicId),
      category: entry.categoryKey,
      model: entry.modelId,
      imageCount: entry.images.length,
      promptLength: bestPromptText.length,
      detailTextLength: detailText.length,
      status,
      issues,
    };
  });
  const summary = {
    total: rows.length,
    indexableNow: rows.filter((row) => row.indexableNow).length,
    noindexFollowNow: rows.filter((row) => !row.indexableNow).length,
    status: countBy(rows, (row) => row.status),
    issues: countBy(rows.flatMap((row) => row.issues), (issue) => issue),
    categories: countBy(rows, (row) => row.category ?? 'unknown'),
    models: countBy(rows, (row) => row.model ?? 'unknown'),
  };
  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    rows,
  };

  await writeJson(jsonOutputPath, report);
  await writeMarkdown(markdownOutputPath, rows);

  console.log(JSON.stringify(summary, null, 2));
  console.log(`Wrote ${jsonOutputPath}`);
  console.log(`Wrote ${markdownOutputPath}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
