import fs from 'node:fs';
import path from 'node:path';

import {
  applyExternalPromptBracketReplacements,
  normalizeExternalPromptBrackets,
} from '../src/lib/external-prompt-bracket-remix';
import { getPromptTranslationSourceHash } from '../src/lib/prompt-i18n-source-hash';

type SourceImagePrompt = {
  source_id?: string;
  title?: string;
  prompt?: string;
};

type SourcePromptRecord = {
  id: string;
  title?: string;
  prompt: string;
  source_type?: string;
  image_prompts?: SourceImagePrompt[];
};

type GeneratedImagePrompt = {
  sourceId?: string;
  title?: string;
  prompt?: string;
};

type GeneratedPromptRecord = {
  id: string;
  title: string;
  prompt: string;
  sourceType?: string;
  imagePrompts?: GeneratedImagePrompt[];
};

type TranslationFile = Record<
  string,
  { title?: string; prompt?: string; sourceHash?: string }
>;

const projectRoot = process.cwd();
const defaultSourceRepoPath = '/Users/kkkk/Desktop/awesome-ai prompts';
const sourceRepoFlag = process.argv
  .find((value) => value.startsWith('--source-repo='))
  ?.slice('--source-repo='.length);
const sourceRepoPath = path.resolve(sourceRepoFlag || defaultSourceRepoPath);

const generatedPromptFile = 'src/lib/generated/awesome-gptimage2-prompts.json';
const sourcePromptFile = 'prompts/prompts.json';
const translationFiles = [
  'src/lib/generated/awesome-gptimage2-prompts.i18n.zh.json',
  'src/lib/generated/awesome-gptimage2-prompts.i18n.fr.json',
  'src/lib/generated/awesome-gptimage2-prompts.i18n.ru.json',
  'src/lib/generated/awesome-gptimage2-prompts.i18n.pt.json',
  'src/lib/generated/awesome-gptimage2-prompts.i18n.ja.json',
  'src/lib/generated/awesome-gptimage2-prompts.i18n.ko.json',
  'src/lib/generated/awesome-ai-prompts.i18n.zh.json',
  'src/lib/generated/awesome-ai-prompts.i18n.fr.json',
  'src/lib/generated/awesome-ai-prompts.i18n.ru.json',
  'src/lib/generated/awesome-ai-prompts.i18n.pt.json',
  'src/lib/generated/awesome-ai-prompts.i18n.ja.json',
  'src/lib/generated/awesome-ai-prompts.i18n.ko.json',
] as const;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const generatedEntries = readJson<GeneratedPromptRecord[]>(
  path.join(projectRoot, generatedPromptFile)
);
const sourceEntries = readJson<SourcePromptRecord[]>(
  path.join(sourceRepoPath, sourcePromptFile)
);
const sourceEntryById = new Map(sourceEntries.map((entry) => [entry.id, entry]));

const sourcePromptById = new Map<string, { title: string; prompt: string }>();
const generatedPromptById = new Map<string, { title: string; prompt: string }>();

for (const generatedEntry of generatedEntries) {
  if (generatedEntry.sourceType?.toLowerCase() !== 'x') continue;

  generatedPromptById.set(generatedEntry.id, {
    title: generatedEntry.title,
    prompt: generatedEntry.prompt,
  });

  const sourceEntry = sourceEntryById.get(generatedEntry.id);
  if (sourceEntry?.prompt) {
    sourcePromptById.set(generatedEntry.id, {
      title: sourceEntry.title?.trim() || generatedEntry.title,
      prompt: sourceEntry.prompt,
    });
  }

  for (const imagePrompt of generatedEntry.imagePrompts ?? []) {
    const sourceId = imagePrompt.sourceId?.trim();
    if (!sourceId || !imagePrompt.prompt?.trim()) continue;

    generatedPromptById.set(sourceId, {
      title: imagePrompt.title?.trim() || generatedEntry.title,
      prompt: imagePrompt.prompt,
    });
  }

  for (const imagePrompt of sourceEntry?.image_prompts ?? []) {
    const sourceId = imagePrompt.source_id?.trim();
    const prompt = imagePrompt.prompt?.trim();
    if (!sourceId || !prompt) continue;

    sourcePromptById.set(sourceId, {
      title: imagePrompt.title?.trim() || generatedEntry.title,
      prompt,
    });
  }
}

const replacementsById = new Map<string, Record<string, string>>();
for (const [id, sourcePrompt] of sourcePromptById) {
  const normalization = normalizeExternalPromptBrackets(id, sourcePrompt.prompt);
  if (Object.keys(normalization.replacements).length > 0) {
    replacementsById.set(id, normalization.replacements);
  }
}

const summary = {
  sourceRepoPath,
  replacementSourceCount: replacementsById.size,
  files: [] as Array<{ file: string; changed: number; stamped: number }>,
};

for (const relativeFile of translationFiles) {
  const filePath = path.join(projectRoot, relativeFile);
  const translations = readJson<TranslationFile>(filePath);
  let changed = 0;
  let stamped = 0;

  for (const [id, replacementMap] of replacementsById) {
    const current = translations[id];
    const generatedPrompt = generatedPromptById.get(id);
    if (!current || !generatedPrompt) continue;

    const promptAfterExactReplacements = current.prompt
      ? applyExternalPromptBracketReplacements(current.prompt, replacementMap)
      : current.prompt;
    const promptAfterCatchAll = promptAfterExactReplacements
      ? normalizeExternalPromptBrackets(id, promptAfterExactReplacements).prompt
      : promptAfterExactReplacements;
    const sourceHash = getPromptTranslationSourceHash(generatedPrompt);

    const nextValue = {
      ...current,
      prompt: promptAfterCatchAll?.trim() || current.prompt,
      sourceHash,
    };

    if (current.sourceHash !== sourceHash) stamped += 1;
    if (
      current.prompt !== nextValue.prompt ||
      current.sourceHash !== nextValue.sourceHash
    ) {
      translations[id] = nextValue;
      changed += 1;
    }
  }

  writeJson(filePath, translations);
  summary.files.push({ file: relativeFile, changed, stamped });
}

console.log(JSON.stringify(summary, null, 2));
