import fs from 'node:fs';
import path from 'node:path';

import {
  getLocalizedPromptEntries,
  getPromptEntryById,
  VOGUE_PROMPT_ENTRY_COUNT,
  type VoguePromptEntry,
} from '../src/lib/prompts';

type Locale = 'en' | 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko';

type RawPromptEntry = {
  id: string;
  title: string;
  prompt: string;
  images: string[];
  languages?: string[];
};

type TranslationFile = Record<string, { title?: string; prompt?: string }>;

const root = process.cwd();
const locales = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'] as const;
const nonEnglishLocales = locales.filter(
  (locale): locale is Exclude<Locale, 'en'> => locale !== 'en'
);

const rawSourceFiles = [
  'src/lib/generated/awesome-gptimage2-prompts.json',
  'src/lib/generated/awesome-gptimage2-site-additions.json',
  'src/lib/generated/awesome-ai-prompts-nano-banana.json',
  'src/lib/generated/awesome-ai-prompts-midjourney.json',
] as const;

const gptImage2TranslationFiles = {
  zh: 'src/lib/generated/awesome-gptimage2-prompts.i18n.zh.json',
  fr: 'src/lib/generated/awesome-gptimage2-prompts.i18n.fr.json',
  ru: 'src/lib/generated/awesome-gptimage2-prompts.i18n.ru.json',
  pt: 'src/lib/generated/awesome-gptimage2-prompts.i18n.pt.json',
  ja: 'src/lib/generated/awesome-gptimage2-prompts.i18n.ja.json',
  ko: 'src/lib/generated/awesome-gptimage2-prompts.i18n.ko.json',
} satisfies Record<Exclude<Locale, 'en'>, string>;

const siteAdditionTranslationFiles = {
  zh: 'src/lib/generated/awesome-gptimage2-site-additions.i18n.zh.json',
  fr: 'src/lib/generated/awesome-gptimage2-site-additions.i18n.fr.json',
  ru: 'src/lib/generated/awesome-gptimage2-site-additions.i18n.ru.json',
  pt: 'src/lib/generated/awesome-gptimage2-site-additions.i18n.pt.json',
  ja: 'src/lib/generated/awesome-gptimage2-site-additions.i18n.ja.json',
  ko: 'src/lib/generated/awesome-gptimage2-site-additions.i18n.ko.json',
} satisfies Record<Exclude<Locale, 'en'>, string>;

const awesomeAiTranslationFiles = {
  en: 'src/lib/generated/awesome-ai-prompts.i18n.en.json',
  zh: 'src/lib/generated/awesome-ai-prompts.i18n.zh.json',
  fr: 'src/lib/generated/awesome-ai-prompts.i18n.fr.json',
  ru: 'src/lib/generated/awesome-ai-prompts.i18n.ru.json',
  pt: 'src/lib/generated/awesome-ai-prompts.i18n.pt.json',
  ja: 'src/lib/generated/awesome-ai-prompts.i18n.ja.json',
  ko: 'src/lib/generated/awesome-ai-prompts.i18n.ko.json',
} satisfies Record<Locale, string>;

const scriptPatterns = {
  zh: /[\u4e00-\u9fff]/,
  ja: /[\u3040-\u30ff]/,
  ko: /[\uac00-\ud7af]/,
  ru: /[\u0400-\u04ff]/,
} as const;

function readJson<T>(relativePath: string, fallback?: T): T {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing file: ${relativePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function loadRawEntries() {
  return new Map(
    rawSourceFiles
      .flatMap((file) => readJson<RawPromptEntry[]>(file))
      .map((entry) => [entry.id, entry] as const)
  );
}

function loadMergedTranslations(locale: Locale) {
  if (locale === 'en') {
    return readJson<TranslationFile>(awesomeAiTranslationFiles.en, {});
  }

  return {
    ...readJson<TranslationFile>(gptImage2TranslationFiles[locale]),
    ...readJson<TranslationFile>(siteAdditionTranslationFiles[locale]),
    ...readJson<TranslationFile>(awesomeAiTranslationFiles[locale], {}),
  };
}

function collectProtectedTokens(value: string) {
  const patterns = [
    /\[[A-Z][A-Z0-9 _/-]{1,80}\]/g,
    /--[a-zA-Z][a-zA-Z0-9-]*/g,
    /https?:\/\/[^\s"'<>]+/g,
    /#[0-9a-fA-F]{3,8}\b/g,
    /\b\d+\s*x\s*\d+\b/gi,
    /\b\d+:\d+\b/g,
  ];
  const tokens = new Set<string>();

  for (const pattern of patterns) {
    for (const match of value.matchAll(pattern)) {
      tokens.add(match[0].trim());
    }
  }

  return [...tokens].filter((token) => token.length <= 160);
}

function collectEditablePlaceholderValues(value: string) {
  return [
    ...[...value.matchAll(/\{argument[^{}]*\}/g)].map((match) => match[0]),
    ...[...value.matchAll(/\[[^\]\n]{1,80}\]/g)].map((match) => match[0]),
  ];
}

function hasUnlocalizedEnglishPlaceholder(value: string) {
  return collectEditablePlaceholderValues(value).some((token) =>
    /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(token)
  );
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function getPromptTextForLocale(entry: VoguePromptEntry, locale: Locale) {
  return entry.promptTranslations?.[locale]?.trim() || entry.prompt;
}

function stripProtectedPromptSyntax(value: string) {
  return value
    .replace(/--[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^\s,;)]+)?/g, ' ')
    .replace(/\{argument[^{}]*\}/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ');
}

function isPromptPrimarilyNonEnglish(value: string) {
  const plainText = stripProtectedPromptSyntax(value);
  const nonEnglishScriptCount = (
    plainText.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af\u0400-\u04ff]/g) ??
    []
  ).length;
  const latinLetterCount = (plainText.match(/[A-Za-z]/g) ?? []).length;
  const textSignalCount = nonEnglishScriptCount + latinLetterCount;

  return (
    nonEnglishScriptCount >= 12 &&
    textSignalCount > 0 &&
    nonEnglishScriptCount / textSignalCount >= 0.25
  );
}

function hasScript(locale: keyof typeof scriptPatterns, entry: VoguePromptEntry) {
  return scriptPatterns[locale].test(getPromptTextForLocale(entry, locale));
}

function run() {
  const rawEntries = loadRawEntries();
  const activeEnglishEntries = getLocalizedPromptEntries('en');
  const activeIds = new Set(activeEnglishEntries.map((entry) => entry.id));

  assert(
    activeIds.size === VOGUE_PROMPT_ENTRY_COUNT,
    `Active id count ${activeIds.size} does not match VOGUE_PROMPT_ENTRY_COUNT ${VOGUE_PROMPT_ENTRY_COUNT}`
  );

  for (const locale of locales) {
    const entries = getLocalizedPromptEntries(locale);
    assert(entries.length === activeIds.size, `${locale} runtime count mismatch`);
    assert(
      entries.every((entry) => entry.originalPrompt?.trim()),
      `${locale} has entries without originalPrompt`
    );
  }

  for (const locale of nonEnglishLocales) {
    const translations = loadMergedTranslations(locale);
    const missing = [...activeIds].filter(
      (id) => !translations[id]?.title?.trim() || !translations[id]?.prompt?.trim()
    );

    assert(
      missing.length === 0,
      `${locale} missing prompt translations: ${missing.slice(0, 20).join(', ')}`
    );
  }

  const englishTranslations = loadMergedTranslations('en');
  const nonEnglishSourceIds = [...activeIds].filter((id) => {
    const raw = rawEntries.get(id);
    return raw && isPromptPrimarilyNonEnglish(raw.prompt);
  });
  const nonEnglishSourceIdSet = new Set(nonEnglishSourceIds);
  const missingEnglish = nonEnglishSourceIds.filter(
    (id) =>
      !englishTranslations[id]?.title?.trim() ||
      !englishTranslations[id]?.prompt?.trim()
  );

  assert(
    missingEnglish.length === 0,
    `English missing source-language translations: ${missingEnglish
      .slice(0, 20)
      .join(', ')}`
  );

  for (const id of nonEnglishSourceIds) {
    const entry = getPromptEntryById(id, 'en');
    assert(entry, `${id} missing English runtime entry`);
    assert(
      entry.promptTranslations?.en?.trim() &&
        entry.promptTranslations.en.trim() !== entry.originalPrompt?.trim(),
      `${id} English runtime missing source-language prompt translation`
    );
  }

  for (const locale of ['zh', 'ja', 'ko', 'ru'] as const) {
    const entries = getLocalizedPromptEntries(locale);
    const localizedRatio =
      entries.filter((entry) => hasScript(locale, entry)).length / entries.length;
    assert(
      localizedRatio >= 0.95,
      `${locale} localized-script ratio too low: ${localizedRatio.toFixed(3)}`
    );
  }

  const protectedIssues: string[] = [];
  for (const locale of locales) {
    for (const entry of getLocalizedPromptEntries(locale)) {
      const original = entry.originalPrompt ?? rawEntries.get(entry.id)?.prompt ?? '';
      const promptText = getPromptTextForLocale(entry, locale);
      const originalArgumentCount = (original.match(/\{argument\b/g) ?? []).length;
      const translatedArgumentCount = (promptText.match(/\{argument\b/g) ?? [])
        .length;
      if (originalArgumentCount !== translatedArgumentCount) {
        protectedIssues.push(
          `${locale}:${entry.id}:argument count ${originalArgumentCount}->${translatedArgumentCount}`
        );
        continue;
      }
      if (
        locale === 'en' &&
        nonEnglishSourceIdSet.has(entry.id) &&
        hasUnlocalizedEnglishPlaceholder(promptText)
      ) {
        protectedIssues.push(`${locale}:${entry.id}:unlocalized placeholder text`);
        continue;
      }
      for (const token of collectProtectedTokens(original)) {
        if (!promptText.includes(token)) {
          protectedIssues.push(`${locale}:${entry.id}:${token}`);
          break;
        }
      }
    }
  }

  assert(
    protectedIssues.length === 0,
    `Localized prompts dropped protected tokens: ${protectedIssues
      .slice(0, 20)
      .join(', ')}`
  );

  console.log(
    JSON.stringify(
      {
        activePromptCount: activeIds.size,
        checkedLocales: locales,
        nonEnglishSourceCount: nonEnglishSourceIds.length,
        status: 'ok',
      },
      null,
      2
    )
  );
}

run();
