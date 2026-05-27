import { config as loadEnv } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

loadEnv({ path: '.env.local' });
loadEnv();

type Locale = 'en' | 'zh' | 'fr' | 'ru' | 'pt' | 'ja' | 'ko';

type PromptEntry = {
  id: string;
  sourceOrder: number;
  title: string;
  images: string[];
  prompt: string;
  modelId?: string;
  languages?: string[];
};

type LocalizedFields = {
  title: string;
  prompt: string;
};

type TranslationFile = Record<string, LocalizedFields>;

type TranslationItem = {
  id: string;
  title: string;
  prompt: string;
};

const projectRoot = process.cwd();

const sourceFiles = [
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

const outputFiles = {
  en: 'src/lib/generated/awesome-ai-prompts.i18n.en.json',
  zh: 'src/lib/generated/awesome-ai-prompts.i18n.zh.json',
  fr: 'src/lib/generated/awesome-ai-prompts.i18n.fr.json',
  ru: 'src/lib/generated/awesome-ai-prompts.i18n.ru.json',
  pt: 'src/lib/generated/awesome-ai-prompts.i18n.pt.json',
  ja: 'src/lib/generated/awesome-ai-prompts.i18n.ja.json',
  ko: 'src/lib/generated/awesome-ai-prompts.i18n.ko.json',
} satisfies Record<Locale, string>;

const localeGuides = {
  en: {
    name: 'English',
    target: 'natural English',
    style:
      'Use polished, idiomatic English for image-generation users. Preserve brand names and technical flags.',
  },
  zh: {
    name: 'Simplified Chinese',
    target: '地道简体中文',
    style:
      '使用自然、专业、可直接复制使用的简体中文。避免机器翻译腔，保留必要的模型、品牌、参数和英文专有名词。',
  },
  fr: {
    name: 'French',
    target: 'idiomatic French',
    style:
      'Use polished French suitable for designers and image-generation users. Keep brand names, model names, and technical flags intact.',
  },
  ru: {
    name: 'Russian',
    target: 'idiomatic Russian',
    style:
      'Use fluent Russian suitable for creative prompt writing. Keep brand names, model names, and technical flags intact.',
  },
  pt: {
    name: 'Portuguese (Brazil)',
    target: 'Brazilian Portuguese',
    style:
      'Use natural Brazilian Portuguese suitable for designers and creators. Keep brand names, model names, and technical flags intact.',
  },
  ja: {
    name: 'Japanese',
    target: 'natural Japanese',
    style:
      'Use natural Japanese suitable for creative prompt writing. Keep brand names, model names, and technical flags intact.',
  },
  ko: {
    name: 'Korean',
    target: 'natural Korean',
    style:
      'Use natural Korean suitable for creative prompt writing. Keep brand names, model names, and technical flags intact.',
  },
} satisfies Record<Locale, { name: string; target: string; style: string }>;

const visualDuplicatePromptIds = new Set([
  'x-2046546991006802057-r0-youtube-thumbnail-explosive-japanese-x-monetization-thumbnail',
  'x-2046546991006802057-r1-youtube-thumbnail-japanese-x-monetization-thumbnail',
  'x-2046546991006802057-r2-youtube-thumbnail-flashy-x-monetization-youtube-thumbnail',
  'x-2046956068417278208-r0-convex-mirror-night-street-selfie',
  'x-2047086715911999728-r1-cyberpunk-girl-with-giant-mech-claw',
  'x-2046971122558611682-r0-e-commerce-main-image-split-screen-athleisure-couch-ad',
  'x-2046929515092554025-r1-e-commerce-main-image-child-three-view-clothing-reference',
  'x-2047085107979419924-r1-minimal-sci-fi-anime-girl-portrait',
]);

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const repairInvalid = args.has('--repair');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number.parseInt(limitArg.split('=')[1] ?? '', 10) : null;
const localeArg = process.argv.find((arg) => arg.startsWith('--locale='));
const selectedLocales = localeArg
  ? localeArg
      .split('=')[1]
      .split(',')
      .map((locale) => locale.trim())
      .filter(Boolean)
  : (['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'] as Locale[]);

const model =
  process.env.PROMPT_I18N_MODEL ||
  process.env.AI302_TRANSLATION_MODEL ||
  'gpt-4.1-mini';
const apiBase = process.env.AI302_API_BASE || 'https://api.302.ai/v1';
const maxBatchChars = Number.parseInt(
  process.env.PROMPT_I18N_MAX_BATCH_CHARS || '18000',
  10
);
const concurrency = Number.parseInt(process.env.PROMPT_I18N_CONCURRENCY || '3', 10);

function readJson<T>(relativePath: string, fallback?: T): T {
  const filePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing file: ${relativePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function writeJson(relativePath: string, value: unknown) {
  const filePath = path.join(projectRoot, relativePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function getActiveEntries() {
  return sourceFiles
    .flatMap((file) => readJson<PromptEntry[]>(file))
    .filter(
      (entry) =>
        entry.prompt &&
        entry.images?.length > 0 &&
        !visualDuplicatePromptIds.has(entry.id)
    )
    .toSorted((left, right) => left.sourceOrder - right.sourceOrder);
}

function loadMergedExistingTranslations(locale: Exclude<Locale, 'en'>) {
  return {
    ...readJson<TranslationFile>(gptImage2TranslationFiles[locale]),
    ...readJson<TranslationFile>(siteAdditionTranslationFiles[locale]),
    ...readJson<TranslationFile>(outputFiles[locale], {}),
  };
}

function loadExistingTranslations(locale: Locale) {
  if (locale === 'en') return readJson<TranslationFile>(outputFiles.en, {});
  return loadMergedExistingTranslations(locale);
}

function loadWritableTranslations(locale: Locale) {
  return readJson<TranslationFile>(outputFiles[locale], {});
}

function needsTranslation(entry: PromptEntry, locale: Locale, existing: TranslationFile) {
  const current = existing[entry.id];
  if (current?.title?.trim() && current.prompt?.trim()) {
    if (!repairInvalid) return false;
    return (
      validateItem(entry, {
        id: entry.id,
        title: current.title,
        prompt: current.prompt,
      }).length > 0
    );
  }
  if (locale === 'en') return !entry.languages?.includes('en');
  return true;
}

function chunkEntries(entries: PromptEntry[]) {
  const chunks: PromptEntry[][] = [];
  let current: PromptEntry[] = [];
  let currentChars = 0;

  for (const entry of entries) {
    const entryChars = entry.title.length + entry.prompt.length + 320;
    if (current.length > 0 && currentChars + entryChars > maxBatchChars) {
      chunks.push(current);
      current = [];
      currentChars = 0;
    }

    current.push(entry);
    currentChars += entryChars;
  }

  if (current.length > 0) chunks.push(current);

  return chunks;
}

function extractJsonObject(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first >= 0 && last > first) return trimmed.slice(first, last + 1);

  return trimmed;
}

const protectedTokenPatterns = [
  /\[[A-Z][A-Z0-9 _/-]{1,80}\]/g,
  /--[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^\s,;)]*)?/g,
  /https?:\/\/[^\s"'<>]+/g,
  /#[0-9a-fA-F]{3,8}\b/g,
  /\b\d+\s*x\s*\d+\b/gi,
  /\b\d+:\d+\b/g,
];

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

function protectPrompt(value: string) {
  const tokens = [
    ...[...value.matchAll(/\{argument[^{}]*\}/g)].map((match) => match[0]),
    ...collectProtectedTokens(value),
  ].sort((left, right) => right.length - left.length);
  let protectedValue = value;
  const replacements: Array<[marker: string, token: string]> = [];

  tokens.forEach((token, index) => {
    const marker = `@@VOGUE_KEEP_${index}@@`;
    replacements.push([marker, token]);
    protectedValue = protectedValue.split(token).join(marker);
  });

  return {
    value: protectedValue,
    restore(nextValue: string) {
      return replacements.reduce(
        (current, [marker, token]) => current.split(marker).join(token),
        nextValue
      );
    },
  };
}

function validateItem(original: PromptEntry, translated: TranslationItem) {
  const issues: string[] = [];
  if (translated.id !== original.id) issues.push('id mismatch');
  if (!translated.title?.trim()) issues.push('missing title');
  if (!translated.prompt?.trim()) issues.push('missing prompt');

  const originalFenceCount = (original.prompt.match(/```/g) ?? []).length;
  const translatedFenceCount = (translated.prompt.match(/```/g) ?? []).length;
  if (originalFenceCount % 2 === 0 && originalFenceCount !== translatedFenceCount) {
    issues.push(`fence count changed ${originalFenceCount}->${translatedFenceCount}`);
  }

  const originalArgumentCount = (original.prompt.match(/\{argument\b/g) ?? []).length;
  const translatedArgumentCount = (translated.prompt.match(/\{argument\b/g) ?? []).length;
  if (originalArgumentCount !== translatedArgumentCount) {
    issues.push(
      `argument placeholder count changed ${originalArgumentCount}->${translatedArgumentCount}`
    );
  }

  for (const token of collectProtectedTokens(original.prompt)) {
    if (!translated.prompt.includes(token)) {
      issues.push(`protected token missing: ${token.slice(0, 80)}`);
      break;
    }
  }

  return issues;
}

async function translateBatch(
  locale: Locale,
  batch: PromptEntry[],
  attempt = 1
): Promise<TranslationItem[]> {
  const key = process.env.AI302_API_KEY;
  if (!key) throw new Error('AI302_API_KEY is not configured');

  const guide = localeGuides[locale];
  const protectedPrompts = new Map(
    batch.map((entry) => [entry.id, protectPrompt(entry.prompt)] as const)
  );
  const userPayload = {
    targetLocale: locale,
    targetLanguage: guide.name,
    items: batch.map((entry) => ({
      id: entry.id,
      title: entry.title,
      prompt: protectedPrompts.get(entry.id)?.value ?? entry.prompt,
    })),
  };

  const messages = [
    {
      role: 'system',
      content: [
        'You are a senior localization editor for an AI image prompt gallery.',
        `Translate every title and prompt into ${guide.target}. ${guide.style}`,
        'Return only valid JSON: {"items":[{"id":"...","title":"...","prompt":"..."}]}.',
        'Preserve the original prompt structure: paragraph breaks, numbered lists, headings, JSON/Markdown fences, XML-like tags, command flags, aspect ratios, weights, placeholders, URLs, hex colors, and variable tokens.',
        'Markers shaped like @@VOGUE_KEEP_0@@ are protected source tokens. Copy them exactly without translating, deleting, or reordering them.',
        'For {argument name="..." default="..."} placeholders, keep the curly-brace syntax and attribute names; localize attribute values only when it reads naturally in the target language.',
        'For JSON prompts, keep JSON valid and keep keys unchanged; translate string values only.',
        'Do not summarize, omit, reorder, add explanations, add disclaimers, or improve the prompt beyond faithful localization.',
        'If a source prompt is already in the target language, keep its wording but still return it with a polished localized title.',
      ].join('\n'),
    },
    {
      role: 'user',
      content: JSON.stringify(userPayload),
    },
  ];

  const requestBody = JSON.stringify({
    model,
    messages,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  let response: Response | null = null;
  let responseText = '';
  const maxRequestAttempts = 8;
  for (
    let requestAttempt = 1;
    requestAttempt <= maxRequestAttempts;
    requestAttempt += 1
  ) {
    try {
      response = await fetch(`${apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      responseText = await response.text();
      if (response.ok || (response.status < 500 && response.status !== 429)) break;
    } catch (error) {
      if (requestAttempt === maxRequestAttempts) throw error;
      response = null;
      responseText = '';
    }

    await new Promise((resolve) => setTimeout(resolve, 1800 * requestAttempt));
  }

  if (!response?.ok) {
    throw new Error(
      `Translation request failed ${response?.status ?? 'network'}: ${responseText.slice(0, 600)}`
    );
  }

  const payload = JSON.parse(responseText);
  const content =
    payload.choices?.[0]?.message?.content ??
    payload.choices?.[0]?.delta?.content ??
    '';
  const parsed = JSON.parse(extractJsonObject(content)) as { items?: TranslationItem[] };
  const items = parsed.items ?? [];
  for (const item of items) {
    const protectedPrompt = protectedPrompts.get(item.id);
    if (protectedPrompt) {
      item.prompt = protectedPrompt.restore(item.prompt);
    }
  }
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const translatedItems = batch.map((entry) => itemMap.get(entry.id));
  const missing = translatedItems
    .map((item, index) => (item ? null : batch[index].id))
    .filter(Boolean);

  const issues = translatedItems.flatMap((item, index) =>
    item ? validateItem(batch[index], item).map((issue) => `${item.id}: ${issue}`) : []
  );

  if ((missing.length > 0 || issues.length > 0) && attempt < 3) {
    console.warn(
      `[${locale}] retry batch attempt ${attempt + 1}: missing=${missing.length}, issues=${issues
        .slice(0, 3)
        .join('; ')}`
    );
    return translateBatch(locale, batch, attempt + 1);
  }

  if ((missing.length > 0 || issues.length > 0) && batch.length > 1) {
    const splitIndex = Math.max(1, Math.floor(batch.length / 2));
    console.warn(
      `[${locale}] splitting invalid batch of ${batch.length}: missing=${missing.length}, issues=${issues
        .slice(0, 3)
        .join('; ')}`
    );
    const left = await translateBatch(locale, batch.slice(0, splitIndex));
    const right = await translateBatch(locale, batch.slice(splitIndex));
    return [...left, ...right];
  }

  if (missing.length > 0 || issues.length > 0) {
    throw new Error(
      `[${locale}] invalid translated batch: missing=${missing.join(', ')} issues=${issues
        .slice(0, 12)
        .join('; ')}`
    );
  }

  return translatedItems as TranslationItem[];
}

async function mapConcurrent<T, R>(
  items: T[],
  workerCount: number,
  worker: (item: T, index: number) => Promise<R>
) {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: Math.max(1, workerCount) }, async () => {
      while (nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        results[index] = await worker(items[index], index);
      }
    })
  );

  return results;
}

function sortTranslations(writable: TranslationFile, entries: PromptEntry[]) {
  return Object.fromEntries(
    Object.entries(writable).sort(([left], [right]) => {
      const leftOrder =
        entries.find((entry) => entry.id === left)?.sourceOrder ?? Number.MAX_SAFE_INTEGER;
      const rightOrder =
        entries.find((entry) => entry.id === right)?.sourceOrder ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder || left.localeCompare(right);
    })
  );
}

async function run() {
  const locales = selectedLocales as Locale[];
  const entries = getActiveEntries();

  for (const locale of locales) {
    if (!(locale in outputFiles)) {
      throw new Error(`Unsupported locale: ${locale}`);
    }

    const existingMerged = loadExistingTranslations(locale);
    const writable = loadWritableTranslations(locale);
    let missingEntries = entries.filter((entry) =>
      needsTranslation(entry, locale, existingMerged)
    );

    if (limit && Number.isFinite(limit)) {
      missingEntries = missingEntries.slice(0, limit);
    }

    console.log(
      `[${locale}] active=${entries.length} existing=${Object.keys(existingMerged).length} missing=${missingEntries.length}`
    );

    if (missingEntries.length === 0) continue;
    if (dryRun) {
      console.log(
        `[${locale}] sample missing: ${missingEntries
          .slice(0, 8)
          .map((entry) => `${entry.id}:${entry.title}`)
          .join(' | ')}`
      );
      continue;
    }

    const chunks = chunkEntries(missingEntries);
    console.log(
      `[${locale}] translating ${missingEntries.length} entries in ${chunks.length} chunks with ${model}`
    );

    let completedEntries = 0;
    const translatedChunks = await mapConcurrent(
      chunks,
      concurrency,
      async (chunk, index) => {
        const result = await translateBatch(locale, chunk);
        for (const item of result) {
          writable[item.id] = {
            title: item.title.trim(),
            prompt: item.prompt.trim(),
          };
        }
        completedEntries += result.length;
        writeJson(outputFiles[locale], sortTranslations(writable, entries));
        console.log(
          `[${locale}] chunk ${index + 1}/${chunks.length} translated ${result.length}; saved=${completedEntries}/${missingEntries.length}`
        );
        return result;
      }
    );

    for (const item of translatedChunks.flat()) {
      writable[item.id] = {
        title: item.title.trim(),
        prompt: item.prompt.trim(),
      };
    }

    const sortedWritable = sortTranslations(writable, entries);

    writeJson(outputFiles[locale], sortedWritable);
    console.log(
      `[${locale}] wrote ${outputFiles[locale]} entries=${Object.keys(sortedWritable).length}`
    );
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
