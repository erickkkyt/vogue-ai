import type { VoguePromptEntry } from '@/lib/prompts';
import {
  getPromptSeoAngles,
  getPromptSeoDescriptor,
  getPromptSeoSignal,
  normalizePromptSeoWhitespace,
  stripPromptTitleSuffix,
  truncatePromptSeoText,
} from '@/lib/prompt-seo-signals';

export type PromptDetailInsights = {
  whyItWorks: string;
  anatomy: Array<{
    label: string;
    value: string;
  }>;
  variables: string[];
  useCases: string[];
  adaptationTips: string[];
  modelFit: string;
};

const MODEL_LABELS: Record<string, string> = {
  gptimage2: 'GPT Image 2',
  nanobanana: 'Nano Banana',
  midjourney: 'Midjourney',
};

const CATEGORY_LABELS: Record<string, string> = {
  product: 'product mockup',
  poster: 'poster design',
  avatar: 'portrait or avatar',
  ui: 'UI concept',
  diagram: 'diagram or infographic',
  anime: 'anime visual',
  photo: 'photo-real image',
  art: 'illustration or art style',
  epic: 'cinematic concept',
};

const CATEGORY_VARIABLES: Record<string, string[]> = {
  product: ['product type', 'material finish', 'background', 'lighting setup'],
  poster: ['subject', 'headline text', 'palette', 'layout density'],
  avatar: ['person type', 'wardrobe', 'pose', 'background mood'],
  ui: ['screen type', 'device frame', 'layout system', 'brand palette'],
  diagram: ['topic', 'labels', 'layout flow', 'visual hierarchy'],
  anime: ['character', 'setting', 'expression', 'style reference'],
  photo: ['subject', 'camera angle', 'lighting', 'environment'],
  art: ['subject', 'medium', 'texture', 'composition'],
  epic: ['world setting', 'hero subject', 'scale', 'atmosphere'],
};

const CATEGORY_USE_CASES: Record<string, string[]> = {
  product: ['ecommerce hero images', 'ad concept testing', 'packaging mockups'],
  poster: ['campaign key visuals', 'event posters', 'social announcement art'],
  avatar: ['profile images', 'character references', 'personal brand visuals'],
  ui: ['app concept screens', 'landing-page mockups', 'interface moodboards'],
  diagram: ['explainers', 'process graphics', 'presentation visuals'],
  anime: ['character concepts', 'story scenes', 'stylized profile art'],
  photo: ['editorial concepts', 'lifestyle scenes', 'reference-image tests'],
  art: ['style exploration', 'illustration concepts', 'creative direction boards'],
  epic: ['cinematic keyframes', 'game concept art', 'world-building references'],
};

const CATEGORY_ADAPTATION_TIPS: Record<string, string[]> = {
  product: ['Swap the product and material finish.', 'Change the lighting setup and backdrop.', 'Keep the product placement consistent.'],
  poster: ['Replace the subject or headline.', 'Shift the palette and poster era.', 'Keep the layout ratio and hierarchy.'],
  avatar: ['Swap wardrobe, pose, or age range.', 'Keep identity cues and facial angle clear.', 'Test background mood separately.'],
  ui: ['Change the screen type or device frame.', 'Swap the brand palette and content density.', 'Keep interface hierarchy explicit.'],
  diagram: ['Replace the topic and label set.', 'Keep the layout flow and information hierarchy.', 'Adjust icons or callouts by audience.'],
  anime: ['Swap character, setting, or expression.', 'Keep the style reference and pose direction.', 'Test one scene change at a time.'],
  photo: ['Change subject, camera angle, or lens feel.', 'Keep lighting and environment consistent.', 'Use reference images for identity-heavy edits.'],
  art: ['Swap medium, texture, or subject.', 'Keep the composition and style era clear.', 'Test palette changes separately.'],
  epic: ['Change the hero subject or world setting.', 'Keep scale, atmosphere, and camera direction.', 'Use a consistent cinematic color script.'],
};

const CATEGORY_METHOD_NOTES: Record<string, string> = {
  product:
    'separates the product, material, lighting, and background so the asset can be remixed for ads or ecommerce tests',
  poster:
    'sets the subject, poster format, typography, and mood before the decorative details',
  avatar:
    'keeps identity, pose, wardrobe, and background cues explicit enough for portrait variations',
  ui:
    'describes the screen purpose, layout hierarchy, device context, and surface style in one prompt',
  diagram:
    'turns a topic into labeled sections, hierarchy, and a readable visual flow',
  anime:
    'spells out character direction, pose, scene mood, and style reference instead of relying on one broad anime label',
  photo:
    'defines subject, lens feel, lighting, environment, and reference-image behavior for a photo-real result',
  art:
    'keeps medium, texture, composition, and style era visible as separate controls',
  epic:
    'builds scale, camera direction, atmosphere, and story setting before secondary details',
};

const uniqueList = (items: string[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const normalizedItem = item.toLowerCase();
    if (seen.has(normalizedItem)) return false;
    seen.add(normalizedItem);
    return true;
  });
};

const getMidjourneyCodeAngle = (entry: VoguePromptEntry, promptSignal: string) => {
  if (entry.modelId !== 'midjourney') return null;

  const codes = Array.from(
    `${entry.sourceTitle ?? ''} ${promptSignal}`.matchAll(/\b\d{6,10}\b/g)
  )
    .map((match) => match[0])
    .filter((code, index, values) => values.indexOf(code) === index)
    .slice(0, 2);

  return codes.length > 0 ? `Midjourney code ${codes.join(' ')}` : null;
};

const getMidjourneyParameterAngle = (entry: VoguePromptEntry) => {
  if (entry.modelId !== 'midjourney') return null;

  const sourceText = entry.prompt;
  const aspectRatio = sourceText.match(/--ar\s+([0-9]+(?::[0-9]+)?)/i)?.[1];
  const version = sourceText.match(/--v\s+([0-9]+(?:\.[0-9]+)?)/i)?.[1];

  if (!aspectRatio && !version) return null;

  return normalizePromptSeoWhitespace(
    `${aspectRatio ? `${aspectRatio} aspect ratio` : ''} ${
      version ? `Midjourney v${version}` : 'Midjourney'
    } setup`
  );
};

const getTextureAngle = (promptSignal: string) => {
  const filmGrainMatch = promptSignal.match(/\bfilm grain and (?:dust|damage)\b/i);
  if (filmGrainMatch) {
    return filmGrainMatch[0]
      .split(/\s+/)
      .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`)
      .join(' ');
  }

  const textureMatch = promptSignal.match(
    /\b(?:desert dust|ink diffusion edges|soft blur transitions)\b/i
  );

  if (!textureMatch) return null;

  return textureMatch[0]
    .split(/\s+/)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');
};

const INSIGHT_WEAK_WORDS = new Set([
  'ai',
  'based',
  'class',
  'create',
  'design',
  'focus',
  'format',
  'image',
  'prompt',
  'source',
  'structure',
  'subject',
  'title',
  'type',
]);

const cleanInsightPhrase = (value?: string | null) => {
  if (!value) return '';
  if (/\btype\s+image(?:\s+prompt)?\s+title\b/i.test(value)) return '';
  if (/\bstyle\s+photorealistic\s+fashion\s+photography\s+subject\s+name\b/i.test(value)) {
    return '';
  }
  if (/^exploring\s+style\s+sref\b/i.test(value)) return '';

  const cleanedValue = normalizePromptSeoWhitespace(value)
    .replace(/^(?:do\s+this(?:\s+for\s+ai)?|turn\s+person\s+photo\s+into|create|design|generate|make|use)\s+/i, '')
    .replace(/\b(?:type|image|prompt|title|subject|source|focus|structure|class|variables?)\b/gi, ' ')
    .replace(/^features\b.*$/i, '')
    .replace(/\s+features\b.*$/i, '')
    .replace(/\s+\b(?:based|based on)\b$/i, '')
    .replace(/[,:;.\s-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanedValue) return '';

  const usefulWordCount = cleanedValue
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((word) => word.length > 2 && !INSIGHT_WEAK_WORDS.has(word)).length;

  return usefulWordCount >= 2 ? cleanedValue : '';
};

const hasPhrase = (value: string, phrase: string) =>
  value.toLowerCase().includes(phrase.toLowerCase());

const isWeakInsightTitle = (title: string) =>
  title.length < 4 || /^[^a-z0-9]*\d?[^a-z0-9]*$/i.test(title);

export function getPromptDetailInsights(
  entry: VoguePromptEntry
): PromptDetailInsights {
  const rawTitle = stripPromptTitleSuffix(entry.title);
  const modelLabel = MODEL_LABELS[entry.modelId ?? ''] ?? 'AI image model';
  const categoryLabel =
    CATEGORY_LABELS[entry.categoryKey ?? ''] ?? 'creative image';
  const promptSignal = getPromptSeoSignal(entry, 116);
  const promptAngles = uniqueList(
    getPromptSeoAngles(entry, 8).map(cleanInsightPhrase).filter(Boolean)
  );
  const promptDescriptor = cleanInsightPhrase(getPromptSeoDescriptor(entry, 6));
  const title = isWeakInsightTitle(rawTitle)
    ? truncatePromptSeoText(promptDescriptor || promptAngles[0] || rawTitle, 64)
    : rawTitle;
  const midjourneyCodeAngle = getMidjourneyCodeAngle(entry, promptSignal);
  const midjourneyParameterAngle = getMidjourneyParameterAngle(entry);
  const textureAngle = getTextureAngle(entry.prompt || promptSignal);
  const resultSetAngle =
    entry.modelId === 'midjourney'
      ? entry.images.length > 1
        ? `${entry.images.length} result images`
        : 'single result image'
      : null;
  const primaryAngle =
    [
      ...(entry.modelId !== 'midjourney' && promptDescriptor
        ? [promptDescriptor]
        : []),
      ...promptAngles.filter(
        (angle) => !hasPhrase(title, angle) && !hasPhrase(angle, title)
      ),
      ...(entry.modelId === 'midjourney' && promptDescriptor
        ? [promptDescriptor]
        : []),
      ...promptAngles,
      title,
    ].find(Boolean) ?? title;
  const secondaryAngle = [...promptAngles, promptDescriptor].find((angle) => {
    if (!angle) return false;
    const normalizedAngle = angle.toLowerCase();
    const normalizedPrimaryAngle = primaryAngle.toLowerCase();

    return (
      normalizedAngle !== normalizedPrimaryAngle &&
      !hasPhrase(title, angle) &&
      !hasPhrase(angle, title) &&
      !hasPhrase(primaryAngle, angle) &&
      !hasPhrase(angle, primaryAngle)
    );
  });
  const baseVariables =
    CATEGORY_VARIABLES[entry.categoryKey ?? ''] ??
    ['main subject', 'style direction', 'composition', 'color palette'];
  const variables = uniqueList([
    `${baseVariables[0]}: ${truncatePromptSeoText(primaryAngle, 28)}`,
    ...baseVariables.slice(1),
  ]);
  const baseUseCases =
    CATEGORY_USE_CASES[entry.categoryKey ?? ''] ??
    ['visual exploration', 'prompt testing', 'creative references'];
  const useCases = uniqueList([
    `${truncatePromptSeoText(primaryAngle, 42)} variations`,
    ...baseUseCases,
  ]);
  const baseAdaptationTips =
    CATEGORY_ADAPTATION_TIPS[entry.categoryKey ?? ''] ??
    ['Swap the main subject.', 'Keep the style direction clear.', 'Test one major variable at a time.'];
  const adaptationTips = uniqueList([
    `Change ${baseVariables[0]} first, then keep ${truncatePromptSeoText(primaryAngle, 34)} as the reference point.`,
    secondaryAngle
      ? `Use ${truncatePromptSeoText(secondaryAngle, 34)} as the style or scene control.`
      : `Keep ${truncatePromptSeoText(promptDescriptor ?? promptSignal, 38)} as the visual control.`,
    ...baseAdaptationTips,
  ]).slice(0, 5);
  const useCaseSummary = truncatePromptSeoText(useCases.join(', '), 82);
  const promptType = `${modelLabel} ${categoryLabel} prompt`;
  const focusParts = entry.modelId === 'midjourney'
    ? [
        midjourneyCodeAngle,
        midjourneyParameterAngle,
        textureAngle,
        secondaryAngle,
        primaryAngle,
        resultSetAngle,
      ]
    : [
      midjourneyCodeAngle,
      midjourneyParameterAngle,
      primaryAngle,
      secondaryAngle,
      textureAngle,
      resultSetAngle,
      ];
  const focusPhrase = truncatePromptSeoText(
    focusParts.filter(Boolean).join(', ') || promptSignal,
    96
  );
  const methodNote =
    CATEGORY_METHOD_NOTES[entry.categoryKey ?? ''] ??
    'turns the subject, format, and visual direction into separate controls';

  return {
    whyItWorks: normalizePromptSeoWhitespace(
      `${title} gives ${modelLabel} a clear ${categoryLabel} job around ${focusPhrase}. It is useful because it ${methodNote}, so the image result has enough structure to copy, compare, and revise without rebuilding the whole prompt.`
    ),
    anatomy: [
      {
        label: 'Subject',
        value: truncatePromptSeoText(primaryAngle, 72),
      },
      {
        label: 'Prompt job',
        value: promptType,
      },
      {
        label: 'Visual theme',
        value: truncatePromptSeoText(
          secondaryAngle ? `${primaryAngle} with ${secondaryAngle}` : primaryAngle,
          112
        ),
      },
      {
        label: 'Reuse lever',
        value: truncatePromptSeoText(
          secondaryAngle
            ? `${baseVariables[0]} plus ${secondaryAngle}`
            : `${baseVariables[0]} plus ${baseVariables[1] ?? 'style direction'}`,
          90
        ),
      },
    ],
    variables,
    useCases,
    adaptationTips,
    modelFit: `Use this ${promptType} for ${useCaseSummary}. Start with the full prompt, keep the output job intact, then change one variable so the next result is easy to judge.`,
  };
}
