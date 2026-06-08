export type PromptDisplaySection = {
  key: string;
  text: string;
};

const KEEP_STYLE_SENTENCE =
  'Keep the visual style consistent with the template while changing only the listed variables.';

const PROMPT_DISPLAY_SECTION_LABELS = [
  'intent',
  'theme',
  'signature elements',
  'layout logic',
  'transformation rule',
  'annotation system',
  'worldbuilding',
  'composition',
  'style goal',
  'style',
  'restrictions',
  'subject',
  'scene',
  'setting',
  'color palette',
  'typography',
  'lighting',
  'camera',
  'materials',
  'texture',
  'paper environment',
  'screen modules',
  'guide sections',
  'info modules',
  'rating system',
  'board modules',
  'board sections',
  'analysis modules',
  'ui regions',
  'card sections',
  'data modules',
  'detail modules',
  'label items',
  'technical annotations',
  'main visual',
  'semantic mood',
  'visual metaphor',
  'type structure',
  'diagnosis focus',
  'product category',
  'brand colors',
  'palette',
  'app name',
  'brand name',
  'topic',
  'food name',
  'destination',
  'city',
  'country',
  'product',
  'character',
  'person profile',
  'target word',
  'consistency',
] as const;

const DISPLAY_WORD_OVERRIDES: Record<string, string> = {
  ai: 'AI',
  api: 'API',
  bazi: 'Bazi',
  ip: 'IP',
  ui: 'UI',
  url: 'URL',
  wechat: 'WeChat',
  youtube: 'YouTube',
  '3d': '3D',
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeLabelKey(label: string) {
  return label
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function humanizeSectionLabel(label: string) {
  const words = label
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      const displayWord = DISPLAY_WORD_OVERRIDES[lower] ?? lower;

      if (index > 0 || DISPLAY_WORD_OVERRIDES[lower]) return displayWord;

      return `${displayWord.charAt(0).toUpperCase()}${displayWord.slice(1)}`;
    });

  return words.join(' ');
}

function normalizePromptForDisplaySections(prompt: string) {
  const compactPrompt = compactWhitespace(prompt);
  const keepPattern = new RegExp(
    `\\s+${escapeRegExp(KEEP_STYLE_SENTENCE)}$`,
    'i'
  );

  return compactPrompt.replace(
    keepPattern,
    ` consistency: ${KEEP_STYLE_SENTENCE}`
  );
}

const sectionLabelPattern = new RegExp(
  `\\b(${[...PROMPT_DISPLAY_SECTION_LABELS]
    .sort((left, right) => right.length - left.length)
    .map(escapeRegExp)
    .join('|')})\\s*:`,
  'gi'
);

export function buildPromptDisplaySections(prompt: string): PromptDisplaySection[] {
  const normalizedPrompt = normalizePromptForDisplaySections(prompt);
  if (!normalizedPrompt) return [];

  const matches = [...normalizedPrompt.matchAll(sectionLabelPattern)];
  if (matches.length === 0) {
    return [
      {
        key: 'prompt',
        text: normalizedPrompt,
      },
    ];
  }

  const sections: PromptDisplaySection[] = [];
  const intro = normalizedPrompt.slice(0, matches[0].index).trim();
  if (intro) {
    sections.push({
      key: 'intent',
      text: intro,
    });
  }

  matches.forEach((match, index) => {
    const rawLabel = match[1].toLowerCase();
    const start = (match.index ?? 0) + match[0].length;
    const end =
      index + 1 < matches.length
        ? matches[index + 1].index ?? normalizedPrompt.length
        : normalizedPrompt.length;
    const text = normalizedPrompt.slice(start, end).trim();

    if (!text) return;

    sections.push({
      key: normalizeLabelKey(rawLabel),
      text:
        rawLabel === 'consistency'
          ? text
          : `${humanizeSectionLabel(rawLabel)}: ${text}`,
    });
  });

  return sections.length > 0
    ? sections
    : [
        {
          key: 'prompt',
          text: normalizedPrompt,
        },
      ];
}
