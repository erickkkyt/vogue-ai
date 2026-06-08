import {
  getIndexableRelatedPromptEntries,
  getPromptEntryById,
  getStaticPromptPageEntries,
} from '../src/lib/prompts';
import { getPromptPagePath } from '../src/lib/prompt-page-routes';
import {
  buildPromptRemixSegments,
  formatPromptForRemixDisplay,
  getInitialPromptRemixValues,
  getPromptRemixSchema,
} from '../src/lib/prompt-remix';

const existingVogueAiPromptIds = new Set([
  'vogueai-20260603-codex-macos-permission-dialog-ai-prompt',
  'vogueai-20260603-watercolor-travel-poster-ai-prompt',
  'vogueai-20260603-double-exposure-city-poster-ai-prompt',
]);
const locales = ['zh', 'fr', 'ru', 'pt', 'ja', 'ko'] as const;

const entries = getStaticPromptPageEntries().filter(
  (entry) =>
    entry.sourceType === 'vogueai' &&
    entry.id.startsWith('vogueai-20260603-') &&
    !existingVogueAiPromptIds.has(entry.id)
);
const issues: string[] = [];

for (const entry of entries) {
  if (entry.images.length === 0) issues.push(`${entry.id}:missing images`);

  if (entry.imagePrompts?.length !== entry.images.length) {
    issues.push(`${entry.id}:image prompt count mismatch`);
  }

  const path = getPromptPagePath(entry);
  if (!/^\/prompt\/.+-\d{9}$/.test(path)) {
    issues.push(`${entry.id}:bad path ${path}`);
  }

  const related = getIndexableRelatedPromptEntries(entry, 3);
  if (related.length < 3) issues.push(`${entry.id}:related ${related.length}`);

  for (const locale of locales) {
    const localized = getPromptEntryById(entry.id, locale);
    if (
      !localized?.title?.trim() ||
      !localized?.promptTranslations?.[locale]?.trim()
    ) {
      issues.push(`${entry.id}:${locale}:missing entry translation`);
    }
  }

  for (const imagePrompt of entry.imagePrompts ?? []) {
    if (!imagePrompt.sourceId) issues.push(`${entry.id}:missing sourceId`);

    for (const locale of locales) {
      if (!imagePrompt.promptTranslations?.[locale]?.trim()) {
        issues.push(
          `${entry.id}:${imagePrompt.sourceId}:${locale}:missing image translation`
        );
      }
    }

    const schema = getPromptRemixSchema(imagePrompt.sourceId || '', entry.id);
    if (!schema) {
      issues.push(`${entry.id}:${imagePrompt.sourceId}:missing remix schema`);
      continue;
    }

    if (/Concrete variant variables/i.test(imagePrompt.prompt)) {
      issues.push(`${entry.id}:${imagePrompt.sourceId}:concrete variable line`);
    }

    if (/\.\./.test(imagePrompt.prompt)) {
      issues.push(`${entry.id}:${imagePrompt.sourceId}:double period`);
    }

    if (schema.variables.length === 0) continue;

    const values = getInitialPromptRemixValues(schema);
    const promptText = formatPromptForRemixDisplay(imagePrompt.prompt);
    const segments = buildPromptRemixSegments(
      promptText,
      schema,
      values
    );
    const variableSegments = segments.filter(
      (segment) => segment.type === 'variable'
    );
    if (variableSegments.length === 0) {
      issues.push(`${entry.id}:${imagePrompt.sourceId}:no variable segment`);
    }

    for (const variable of schema.variables) {
      const alternatives = variable.suggestions.filter(
        (suggestion) => suggestion !== variable.defaultValue
      );
      if (alternatives.length === 0) {
        issues.push(
          `${entry.id}:${imagePrompt.sourceId}:${variable.key}:no alternate suggestions`
        );
      }

      if (!promptText.includes(variable.defaultValue)) {
        issues.push(
          `${entry.id}:${imagePrompt.sourceId}:${variable.key}:default not in prompt`
        );
      }

      if (
        !variableSegments.some(
          (segment) =>
            segment.type === 'variable' && segment.key === variable.key
        )
      ) {
        issues.push(
          `${entry.id}:${imagePrompt.sourceId}:${variable.key}:no variable pill segment`
        );
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      newVogueAiEntries: entries.length,
      imageCount: entries.reduce((total, entry) => total + entry.images.length, 0),
      issueCount: issues.length,
      issues: issues.slice(0, 40),
      sample: entries.slice(0, 5).map((entry) => ({
        id: entry.id,
        publicId: entry.publicId,
        path: getPromptPagePath(entry),
        images: entry.images.length,
        related: getIndexableRelatedPromptEntries(entry, 3).map(
          (related) => related.publicId
        ),
      })),
    },
    null,
    2
  )
);

if (issues.length > 0) process.exit(1);
