import {
  getLocalizedPromptEntries,
  getLocalizedPromptGalleryEntries,
  getPromptEntryById,
  VOGUE_PROMPT_ENTRY_COUNT,
  type VoguePromptEntry,
} from '../src/lib/prompts';

type Locale = 'en' | 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko';

const locales = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'] as const;
const nonEnglishLocales = locales.filter(
  (locale): locale is Exclude<Locale, 'en'> => locale !== 'en'
);
const modelIds = ['gptimage2', 'nanobanana', 'midjourney'] as const;

const protectedTokenPatterns = [
  /\[[A-Z][A-Z0-9 _/-]{1,80}\]/g,
  /--[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^\s,;)]*)?/g,
  /https?:\/\/[^\s"'<>]+/g,
  /#[0-9a-fA-F]{3,8}\b/g,
  /\b\d+\s*x\s*\d+\b/gi,
  /\b\d+:\d+\b/g,
] as const;

const localeScriptPatterns = {
  zh: /[\u4e00-\u9fff]/,
  ja: /[\u3040-\u30ff]/,
  ko: /[\uac00-\ud7af]/,
  ru: /[\u0400-\u04ff]/,
} as const;

const localeWordHints = {
  fr: [
    'avec',
    'pour',
    'dans',
    'sans',
    'comme',
    'une',
    'des',
    'les',
    'aux',
    'lumiere',
    'lumiere',
    'arriere',
    'plan',
    'creez',
    'scene',
    'sujet',
  ],
  pt: [
    'com',
    'para',
    'uma',
    'dos',
    'das',
    'como',
    'sem',
    'imagem',
    'retrato',
    'luz',
    'crie',
    'estilo',
    'cena',
    'fundo',
    'realista',
  ],
} as const;

type Issue = {
  id: string;
  locale: Locale;
  reason: string;
  modelId?: string;
};

type LocaleSummary = {
  detailEntries: number;
  galleryCards: Record<(typeof modelIds)[number], number>;
  localizedSignalCount: number;
  localizedSignalRatio: number;
  sameAsOriginalAllowed: number;
  suspiciousFallbackCount: number;
  titleLocalizedCount: number;
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function collectProtectedTokens(value: string) {
  const tokens = new Set<string>();

  for (const pattern of protectedTokenPatterns) {
    for (const match of value.matchAll(pattern)) {
      const token = match[0].trim();
      if (token) tokens.add(token);
    }
  }

  return [...tokens].filter((token) => token.length <= 160);
}

function stripProtectedTokens(value: string) {
  return collectProtectedTokens(value).reduce(
    (current, token) => current.split(token).join(' '),
    value
  );
}

function latinFold(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function countWordHints(value: string, hints: readonly string[]) {
  const normalized = latinFold(value);
  return hints.filter((hint) => new RegExp(`\\b${hint}\\b`, 'i').test(normalized))
    .length;
}

function hasLocaleSignal(locale: Exclude<Locale, 'en'>, value: string) {
  const stripped = stripProtectedTokens(value);

  if (locale === 'fr' || locale === 'pt') {
    return countWordHints(stripped, localeWordHints[locale]) >= 2;
  }

  return localeScriptPatterns[locale].test(stripped);
}

function sourceAlreadyMatchesLocale(
  entry: VoguePromptEntry,
  locale: Exclude<Locale, 'en'>
) {
  if (entry.languages?.includes(locale)) return true;
  const originalPrompt = entry.originalPrompt ?? entry.prompt;
  if (locale === 'fr' || locale === 'pt') {
    return countWordHints(originalPrompt, localeWordHints[locale]) >= 1;
  }
  return hasLocaleSignal(locale, originalPrompt);
}

function assertUniqueActiveIds(entries: VoguePromptEntry[], issues: Issue[]) {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.id, (counts.get(entry.id) ?? 0) + 1);
  }

  for (const [id, count] of counts) {
    if (count > 1) {
      issues.push({
        id,
        locale: 'en',
        reason: `duplicate active id count=${count}`,
      });
    }
  }
}

function countGalleryCards(locale: Locale, modelId: (typeof modelIds)[number]) {
  let offset = 0;
  let count = 0;

  while (true) {
    const batch = getLocalizedPromptGalleryEntries(locale, {
      limit: 200,
      modelId,
      offset,
    });

    if (batch.length === 0) break;
    for (const card of batch) {
      if (!card.id || !card.title?.trim() || !card.images.length || card.imageCount <= 0) {
        throw new Error(
          `${locale}:${modelId}:${card.id || 'missing-id'} invalid gallery card`
        );
      }
    }
    count += batch.length;
    offset += batch.length;
  }

  return count;
}

function run() {
  const issues: Issue[] = [];
  const warnings: Issue[] = [];
  const englishEntries = getLocalizedPromptEntries('en');
  const englishById = new Map(englishEntries.map((entry) => [entry.id, entry]));
  const expectedModelCounts = Object.fromEntries(
    modelIds.map((modelId) => [
      modelId,
      englishEntries.filter((entry) => entry.modelId === modelId).length,
    ])
  ) as Record<(typeof modelIds)[number], number>;
  const summaries: Record<Locale, LocaleSummary> = {} as Record<
    Locale,
    LocaleSummary
  >;

  if (englishEntries.length !== VOGUE_PROMPT_ENTRY_COUNT) {
    issues.push({
      id: 'runtime',
      locale: 'en',
      reason: `entry count ${englishEntries.length} != VOGUE_PROMPT_ENTRY_COUNT ${VOGUE_PROMPT_ENTRY_COUNT}`,
    });
  }

  assertUniqueActiveIds(englishEntries, issues);

  for (const locale of locales) {
    const entries = getLocalizedPromptEntries(locale);
    const galleryCards = Object.fromEntries(
      modelIds.map((modelId) => [modelId, countGalleryCards(locale, modelId)])
    ) as LocaleSummary['galleryCards'];
    let localizedSignalCount = 0;
    let sameAsOriginalAllowed = 0;
    let suspiciousFallbackCount = 0;
    let titleLocalizedCount = 0;

    if (entries.length !== englishEntries.length) {
      issues.push({
        id: 'runtime',
        locale,
        reason: `localized entry count ${entries.length} != English count ${englishEntries.length}`,
      });
    }

    for (const modelId of modelIds) {
      if (galleryCards[modelId] !== expectedModelCounts[modelId]) {
        issues.push({
          id: modelId,
          locale,
          reason: `gallery count ${galleryCards[modelId]} != detail count ${expectedModelCounts[modelId]}`,
        });
      }
    }

    for (const entry of entries) {
      const detailEntry = getPromptEntryById(entry.id, locale);
      const englishEntry = englishById.get(entry.id);

      if (!detailEntry || !englishEntry) {
        issues.push({
          id: entry.id,
          locale,
          modelId: entry.modelId,
          reason: 'missing runtime detail entry',
        });
        continue;
      }

      const originalPrompt = detailEntry.originalPrompt ?? '';
      const currentPrompt = detailEntry.prompt ?? '';

      if (!originalPrompt.trim()) {
        issues.push({
          id: entry.id,
          locale,
          modelId: entry.modelId,
          reason: 'missing originalPrompt',
        });
      }

      if (!currentPrompt.trim()) {
        issues.push({
          id: entry.id,
          locale,
          modelId: entry.modelId,
          reason: 'missing current localized prompt',
        });
      }

      if (originalPrompt !== englishEntry.originalPrompt) {
        issues.push({
          id: entry.id,
          locale,
          modelId: entry.modelId,
          reason: 'originalPrompt changed across locales',
        });
      }

      if (locale === 'en') continue;

      const nonEnglishLocale = locale as Exclude<Locale, 'en'>;
      const sameAsOriginal =
        normalizeText(currentPrompt) === normalizeText(originalPrompt);
      const sameAsEnglish =
        normalizeText(currentPrompt) === normalizeText(englishEntry.prompt);
      const sourceMatchesTarget = sourceAlreadyMatchesLocale(
        detailEntry,
        nonEnglishLocale
      );

      if (hasLocaleSignal(nonEnglishLocale, currentPrompt)) {
        localizedSignalCount += 1;
      }

      if (detailEntry.title && detailEntry.title !== englishEntry.title) {
        titleLocalizedCount += 1;
      }

      if (sameAsOriginal && sourceMatchesTarget) {
        sameAsOriginalAllowed += 1;
      }

      if (
        (sameAsOriginal && !sourceMatchesTarget) ||
        (sameAsEnglish && !sourceMatchesTarget)
      ) {
        suspiciousFallbackCount += 1;
        warnings.push({
          id: entry.id,
          locale,
          modelId: entry.modelId,
          reason: sameAsEnglish
            ? 'current prompt equals English runtime prompt'
            : 'current prompt equals original source prompt without target-locale signal',
        });
      }

      const originalArgumentCount = (originalPrompt.match(/\{argument\b/g) ?? [])
        .length;
      const currentArgumentCount = (currentPrompt.match(/\{argument\b/g) ?? [])
        .length;

      if (originalArgumentCount !== currentArgumentCount) {
        issues.push({
          id: entry.id,
          locale,
          modelId: entry.modelId,
          reason: `argument placeholder count changed ${originalArgumentCount}->${currentArgumentCount}`,
        });
      }

      for (const token of collectProtectedTokens(originalPrompt)) {
        if (!currentPrompt.includes(token)) {
          issues.push({
            id: entry.id,
            locale,
            modelId: entry.modelId,
            reason: `protected token dropped: ${token}`,
          });
          break;
        }
      }
    }

    const localizedSignalRatio =
      locale === 'en' ? 1 : localizedSignalCount / Math.max(1, entries.length);

    summaries[locale] = {
      detailEntries: entries.length,
      galleryCards,
      localizedSignalCount,
      localizedSignalRatio,
      sameAsOriginalAllowed,
      suspiciousFallbackCount,
      titleLocalizedCount,
    };
  }

  const weakLocaleSignals = nonEnglishLocales.filter((locale) => {
    const ratio = summaries[locale].localizedSignalRatio;
    return locale === 'fr' || locale === 'pt' ? ratio < 0.8 : ratio < 0.95;
  });

  for (const locale of weakLocaleSignals) {
    issues.push({
      id: 'runtime',
      locale,
      reason: `localized signal ratio too low: ${summaries[
        locale
      ].localizedSignalRatio.toFixed(3)}`,
    });
  }

  console.log(
    JSON.stringify(
      {
        activePromptCount: englishEntries.length,
        expectedModelCounts,
        summaries,
        blockingIssueCount: issues.length,
        warningCount: warnings.length,
        issueSample: issues.slice(0, 30),
        warningSample: warnings.slice(0, 30),
        status:
          issues.length > 0
            ? 'failed'
            : warnings.length > 0
              ? 'ok_with_warnings'
              : 'ok',
      },
      null,
      2
    )
  );

  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

run();
