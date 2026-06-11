const PROMPT_SLUG_MAX_LENGTH = 72;

export const PROMPT_PUBLIC_ID_PATTERN = /^\d{9}$/;

const stripPromptTitleSuffix = (value: string) =>
  value.replace(/\s+AI\s+Prompt$/i, '').trim();

const GENERIC_SLUG_WORDS = new Set([
  'ai',
  'art',
  'based',
  'character',
  'cinematic',
  'concept',
  'create',
  'dashboard',
  'design',
  'detailed',
  'editorial',
  'fashion',
  'high',
  'image',
  'illustration',
  'mockup',
  'page',
  'photo',
  'poster',
  'prompt',
  'realistic',
  'reference',
  'sheet',
  'style',
  'stylized',
  'ui',
  'ultra',
  'visual',
]);

const truncateSlug = (value: string, maxLength = PROMPT_SLUG_MAX_LENGTH) => {
  if (value.length <= maxLength) return value;

  const truncated = value.slice(0, maxLength + 1);
  const lastHyphenIndex = truncated.lastIndexOf('-');
  const safeCut = lastHyphenIndex > 24 ? lastHyphenIndex : maxLength;

  return value.slice(0, safeCut).replace(/-+$/g, '');
};

export const normalizePromptSeoSlug = (value: string) => {
  const normalizedValue = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return truncateSlug(normalizedValue);
};

const slugUsefulWordCount = (slug: string) =>
  slug
    .split('-')
    .filter((word) => word.length > 2 && !GENERIC_SLUG_WORDS.has(word)).length;

const SPECIFIC_SLUG_PHRASES = [
  'official-style-character-reference-sheet',
];

const isGenericSlug = (slug: string) =>
  !SPECIFIC_SLUG_PHRASES.some((phrase) => slug.includes(phrase)) &&
  slugUsefulWordCount(slug) <= 1;

const getPathLeaf = (value?: string | null) => {
  if (!value) return '';

  try {
    const url = new URL(value);

    return url.pathname.split('/').filter(Boolean).pop() ?? '';
  } catch {
    return value.split('/').filter(Boolean).pop() ?? value;
  }
};

const cleanSlugCandidate = (value: string) =>
  value
    .replace(/\.[a-z0-9]{2,5}$/i, '')
    .replace(/\[[^\]\n]*?(insert|your|replace)[^\]\n]*?\]/gi, ' ')
    .replace(/\[([^\]\n]{2,90})\]/g, ' $1 ')
    .replace(/\b(?:prompt|create|design|generate|yapper|so)\b:?/gi, ' ')
    .replace(/\b\d{8,}\b/g, ' ')
    .replace(/\b\d+\s+(?=[a-z])/gi, ' ');

const extractBracketCandidates = (value: string) =>
  Array.from(value.matchAll(/\[([^\]\n]{2,90})\]/g))
    .map((match) => match[1])
    .filter((candidate) => !/(insert|your|replace)/i.test(candidate));

const getSlugCandidates = ({
  title,
  sourceTitle,
  sourceUrl,
  prompt,
  images,
  imagePrompts,
}: {
  title: string;
  sourceTitle?: string | null;
  sourceUrl?: string | null;
  prompt?: string | null;
  images?: string[];
  imagePrompts?: Array<{ title?: string | null; prompt?: string | null }>;
}) => {
  const promptText = prompt ?? '';
  const imagePromptText = imagePrompts?.[0]?.prompt ?? '';

  return [
    ...extractBracketCandidates(promptText),
    ...extractBracketCandidates(imagePromptText),
    ...(images ?? []).map(getPathLeaf),
    getPathLeaf(sourceUrl),
    imagePrompts?.[0]?.title ?? '',
    sourceTitle && sourceTitle !== title ? sourceTitle : '',
    promptText,
    imagePromptText,
  ].filter(Boolean);
};

export function createPromptSeoSlug({
  title,
  sourceTitle,
  sourceUrl,
  prompt,
  images,
  imagePrompts,
  categoryKey,
  modelId,
}: {
  title: string;
  sourceTitle?: string | null;
  sourceUrl?: string | null;
  prompt?: string | null;
  images?: string[];
  imagePrompts?: Array<{ title?: string | null; prompt?: string | null }>;
  categoryKey?: string | null;
  modelId?: string | null;
}) {
  const titleSlug = normalizePromptSeoSlug(stripPromptTitleSuffix(title));

  if (titleSlug.length >= 8 && !isGenericSlug(titleSlug)) return titleSlug;

  for (const candidate of getSlugCandidates({
    title,
    sourceTitle,
    sourceUrl,
    prompt,
    images,
    imagePrompts,
  })) {
    const candidateSlug = normalizePromptSeoSlug(
      `${cleanSlugCandidate(candidate)} ${stripPromptTitleSuffix(title)}`
    );

    if (candidateSlug.length >= 8 && !isGenericSlug(candidateSlug)) {
      return candidateSlug;
    }
  }

  return (
    normalizePromptSeoSlug(
      `${stripPromptTitleSuffix(title)} ${categoryKey ?? ''} ${modelId ?? ''} ai prompt`
    ) || 'ai-image-prompt'
  );
}
