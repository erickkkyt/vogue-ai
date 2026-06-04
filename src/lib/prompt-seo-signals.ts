import type { VoguePromptEntry } from '@/lib/prompts';

const COMMON_PROMPT_WORDS = new Set([
  'about',
  'above',
  'across',
  'add',
  'after',
  'against',
  'all',
  'argument',
  'along',
  'around',
  'based',
  'beautiful',
  'body',
  'banana',
  'center',
  'centered',
  'central',
  'character',
  'class',
  'clean',
  'color',
  'colors',
  'composition',
  'concept',
  'create',
  'default',
  'design',
  'description',
  'detailed',
  'digital',
  'destination',
  'do',
  'dramatic',
  'entire',
  'era',
  'exact',
  'featuring',
  'focal',
  'focus',
  'format',
  'from',
  'generate',
  'headline',
  'high',
  'highly',
  'image',
  'images',
  'identity',
  'illustration',
  'include',
  'infer',
  'inferred',
  'large',
  'layout',
  'like',
  'make',
  'modern',
  'name',
  'number',
  'office',
  'old',
  'original',
  'person',
  'photo',
  'photograph',
  'please',
  'portrait',
  'premium',
  'prompt',
  'python',
  'quality',
  'reads',
  'realistic',
  'reference',
  'referenced',
  'referanced',
  'scene',
  'small',
  'striking',
  'style',
  'sref',
  'subject',
  'subheadline',
  'the',
  'then',
  'these',
  'those',
  'topic',
  'through',
  'title',
  'turn',
  'type',
  'ultra',
  'use',
  'using',
  'vertical',
  'version',
  'visual',
  'with',
  'without',
  'woman',
  'women',
  'would',
  'young',
  'for',
  'he',
  'her',
  'him',
  'his',
  'and',
  'into',
  'that',
  'their',
  'them',
  'they',
  'this',
  'she',
  'standing',
  'source',
  'structure',
  'wearing',
  'variable',
  'variables',
]);

const WEAK_PHRASE_WORDS = new Set([
  ...COMMON_PROMPT_WORDS,
  'brand',
  'city',
  'country',
  'examples',
  'exploring',
  'file',
  'final',
  'graph',
  'important',
  'inspiration',
  'insert',
  'landmark',
  'name',
  'nanobanana',
  'org',
  'phone',
  'parametric',
  'product',
  'prompts',
  'region',
  'replace',
  'uploaded',
  'your',
  'not',
  'strongly',
  'english',
]);

const TITLE_CASE_OVERRIDES: Record<string, string> = {
  ai: 'AI',
  ccd: 'CCD',
  gpt: 'GPT',
  gptimage2: 'GPT Image 2',
  macos: 'macOS',
  nft: 'NFT',
  pov: 'POV',
  ps1: 'PS1',
  saas: 'SaaS',
  ui: 'UI',
  ux: 'UX',
  vr: 'VR',
  y2k: 'Y2K',
};

export const normalizePromptSeoWhitespace = (value: string) =>
  value.replace(/\s+/g, ' ').trim();

export const stripPromptTitleSuffix = (value: string) =>
  normalizePromptSeoWhitespace(value).replace(/\s+AI\s+Prompt$/i, '');

export const truncatePromptSeoText = (value: string, maxLength: number) => {
  const normalizedValue = normalizePromptSeoWhitespace(value);
  const trimTrailingPunctuation = (nextValue: string) =>
    nextValue
      .replace(/[,:;.。！？、，；：\s-]+$/, '')
      .replace(/\s+(?:a|an|the|at|on|in|for|of|to|and|or|with|by)$/i, '');

  if (normalizedValue.length <= maxLength) {
    return trimTrailingPunctuation(normalizedValue);
  }

  const truncated = normalizedValue.slice(0, maxLength + 1);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  const safeCut = lastSpaceIndex > 18 ? lastSpaceIndex : maxLength;

  return trimTrailingPunctuation(normalizedValue.slice(0, safeCut));
};

export const getPromptSeoSourceText = (entry: VoguePromptEntry) => {
  const imagePrompt = entry.imagePrompts?.[0];

  return (
    imagePrompt?.promptTranslations?.en ||
    entry.promptTranslations?.en ||
    imagePrompt?.prompt ||
    entry.prompt ||
    entry.title
  );
};

const titleWordSet = (title: string) =>
  new Set(
    stripPromptTitleSuffix(title)
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter((word) => word.length > 2)
  );

const toTitleCase = (words: string[]) =>
  words
    .map((word) => {
      const lowerWord = word.toLowerCase();

      if (TITLE_CASE_OVERRIDES[lowerWord]) {
        return TITLE_CASE_OVERRIDES[lowerWord];
      }

      return /^\d+$/.test(word)
        ? word
        : `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;
    })
    .join(' ');

const normalizePromptSeoPhrase = (value: string) =>
  normalizePromptSeoWhitespace(value)
    .replace(/\.[a-z0-9]{2,5}$/i, '')
    .replace(/[_/|-]+/g, ' ')
    .replace(/[{}()[\]"'`]+/g, ' ')
    .replace(/\b(?:r2|dev|webp|jpeg|jpg|png)\b/gi, ' ')
    .replace(/\b(?:x|twitter|status)\b\s+\d{8,}/gi, ' ')
    .replace(/\b\d{8,}\b/g, ' ')
    .replace(/\b\d+\s+(?=[a-z])/gi, ' ')
    .replace(/\bdo\s+this\s+(?:for\s+)?ai\b:?/gi, ' ')
    .replace(/\bturn\s+(?:the\s+)?person\s+from\s+(?:the\s+)?photo\s+into\b:?/gi, ' ')
    .replace(/\b(?:prompt|create|design|generate|yapper|so|please)\b:?/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const phraseWords = (value: string) =>
  normalizePromptSeoPhrase(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);

const isWeakSeoPhrase = (value: string) => {
  const words = phraseWords(value);

  if (words.length === 0) return true;
  if (words.some((word) => ['insert', 'your', 'replace'].includes(word))) {
    return true;
  }

  const usefulWords = words.filter((word) => !WEAK_PHRASE_WORDS.has(word));

  return usefulWords.length === 0;
};

const toDisplayPhrase = (value: string, maxWords = 7) => {
  const words = normalizePromptSeoPhrase(value)
    .split(/[^a-z0-9]+/i)
    .filter((word) => word.length > 0)
    .slice(0, maxWords);

  return toTitleCase(words);
};

const pushUniquePhrase = (
  phrases: string[],
  value: string | null | undefined,
  maxWords = 7
) => {
  if (!value) return;

  const phrase = toDisplayPhrase(value, maxWords);
  if (!phrase || isWeakSeoPhrase(phrase)) return;

  const fingerprint = phrase.toLowerCase();
  if (phrases.some((item) => item.toLowerCase() === fingerprint)) return;

  phrases.push(phrase);
};

const extractBracketedPhrases = (sourceText: string) =>
  Array.from(sourceText.matchAll(/\[([^\]\n]{2,90})\]/g))
    .map((match) => match[1])
    .filter(Boolean);

const extractQuotedPhrases = (sourceText: string) =>
  Array.from(sourceText.matchAll(/["“”']([^"“”']{4,90})["“”']/g))
    .map((match) => match[1])
    .filter(Boolean);

const extractStructuredPhrases = (sourceText: string) =>
  Array.from(
    sourceText.matchAll(
      /\b(?:concept|destination|format|headline|name|style|subject|theme|title|topic)\s*[:=]\s*["“]?([^"”\n,.;}{]{4,90})/gi
    )
  )
    .map((match) => match[1])
    .filter(Boolean);

const extractNamedPhrases = (sourceText: string) =>
  Array.from(
    sourceText.matchAll(
      /\b(?:[A-Z][a-z]+|[A-Z]{2,}|[A-Z][a-z]+-[a-z]+)(?:[\s-]+(?:[A-Z][a-z]+|[A-Z]{2,}|\d{2,4}|[A-Z][a-z]+-[a-z]+)){0,4}\b/g
    )
  )
    .map((match) => match[0])
    .filter(
      (phrase) => {
        const words = phrase.split(/[^a-z0-9]+/i).filter(Boolean);

        return (
          words.length >= 2 &&
          !/^(Create|Design|Generate|Use|Using|Style|Layout|The|This|A|An)$/i.test(
            phrase
          )
        );
      }
    );

const getPathLeafPhrase = (value: string) => {
  if (!value) return null;

  try {
    const url = new URL(value);
    const leaf = url.pathname.split('/').filter(Boolean).pop();

    return leaf ?? null;
  } catch {
    const leaf = value.split('/').filter(Boolean).pop();

    return leaf ?? value;
  }
};

const getMediaPhrases = (entry: VoguePromptEntry) => [
  getPathLeafPhrase(entry.sourceUrl ?? ''),
  ...entry.images.map((image) => getPathLeafPhrase(image)),
];

const getSourceTitlePhrase = (entry: VoguePromptEntry) => {
  if (!entry.sourceTitle || entry.sourceTitle === entry.title) return null;
  if (
    /^(?:create|design|generate|make|do\s+this|turn\s+person)\b/i.test(
      entry.sourceTitle
    )
  ) {
    return null;
  }
  if (/\btype\s+image\s+prompt\s+title\b/i.test(entry.sourceTitle)) {
    return null;
  }
  if (/\bstyle\s+photorealistic\s+fashion\s+photography\s+subject\s+name\b/i.test(entry.sourceTitle)) {
    return null;
  }
  if (/^exploring\s+style\s+sref\b/i.test(entry.sourceTitle)) {
    return null;
  }

  return entry.sourceTitle;
};

export const getPromptSeoSignal = (
  entry: VoguePromptEntry,
  maxLength = 86
) => {
  const sanitizedPrompt = normalizePromptSeoWhitespace(
    getPromptSeoSourceText(entry)
  )
    .replace(/\[([^\]\n]{1,90})\]/g, ' $1 ')
    .replace(/--[a-zA-Z][a-zA-Z0-9-]*/g, ' ')
    .replace(/https?:\/\/[^\s"'<>]+/g, ' ')
    .replace(/[{}()[\]"'`]+/g, ' ')
    .replace(/[_/|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return truncatePromptSeoText(sanitizedPrompt || entry.title, maxLength);
};

const getQuotedDescriptor = (signal: string) => {
  const quotedMatch = signal.match(/["“”']([^"“”']{8,70})["“”']/);
  const quotedValue = quotedMatch?.[1];

  return quotedValue ? normalizePromptSeoWhitespace(quotedValue) : null;
};

const getStructuredDescriptor = (signal: string) => {
  const structuredMatch = signal.match(
    /\b(?:concept|destination|format|topic|theme|subject|name|style)\s*:?\s*([a-z0-9][a-z0-9 _/-]{5,80})/i
  );
  const structuredValue = structuredMatch?.[1]
    ?.split(/[,.;\n]/)[0]
    ?.replace(/["'{}[\]]/g, ' ');

  return structuredValue ? normalizePromptSeoWhitespace(structuredValue) : null;
};

export const getPromptSeoDescriptor = (
  entry: VoguePromptEntry,
  maxWords = 4
) => {
  const signal = getPromptSeoSignal(entry, 180);
  const titleWords = titleWordSet(entry.title);
  const directDescriptor =
    getQuotedDescriptor(signal) ?? getStructuredDescriptor(signal);
  const directWords = directDescriptor
    ?.split(/[^a-z0-9]+/i)
    .filter((word) => {
      const normalizedWord = word.toLowerCase();

      return (
        normalizedWord.length > 2 &&
        !COMMON_PROMPT_WORDS.has(normalizedWord) &&
        !titleWords.has(normalizedWord)
      );
    });

  if (directWords && directWords.length >= 2) {
    return toTitleCase(directWords.slice(0, maxWords));
  }

  const words = signal
    .split(/[^a-z0-9]+/i)
    .map((word) => word.toLowerCase())
    .filter((word) => {
      if (word.length <= 2) return false;
      if (COMMON_PROMPT_WORDS.has(word)) return false;
      if (titleWords.has(word)) return false;

      return true;
    });
  const uniqueWords: string[] = [];

  for (const word of words) {
    if (uniqueWords.includes(word)) continue;
    uniqueWords.push(word);
    if (uniqueWords.length >= maxWords) break;
  }

  return uniqueWords.length > 0 ? toTitleCase(uniqueWords) : null;
};

export const getPromptSeoAngles = (
  entry: VoguePromptEntry,
  maxAngles = 4
) => {
  const sourceText = getPromptSeoSourceText(entry);
  const phrases: string[] = [];

  for (const phrase of extractBracketedPhrases(sourceText)) {
    pushUniquePhrase(phrases, phrase, 6);
  }

  for (const phrase of extractStructuredPhrases(sourceText)) {
    pushUniquePhrase(phrases, phrase, 7);
  }

  for (const phrase of getMediaPhrases(entry)) {
    pushUniquePhrase(phrases, phrase, 6);
  }

  pushUniquePhrase(phrases, getSourceTitlePhrase(entry), 6);

  for (const phrase of extractQuotedPhrases(sourceText)) {
    pushUniquePhrase(phrases, phrase, 6);
  }

  for (const phrase of extractNamedPhrases(sourceText)) {
    pushUniquePhrase(phrases, phrase, 5);
  }

  pushUniquePhrase(phrases, getPromptSeoDescriptor(entry, 7), 7);

  if (entry.authorName) {
    pushUniquePhrase(phrases, entry.authorName, 3);
  }

  return phrases.slice(0, maxAngles);
};
