export type PromptTransformExample = {
  sourceImage: string;
  sourceLabel?: string;
  resultLabel?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  styleReferenceImage?: string;
  styleReferenceLabel?: string;
};

export type PromptTransformExampleConfig = {
  mode: 'before-after';
  examples: PromptTransformExample[];
};

const lifestyleSourceImages = {
  source02:
    'https://media.vogueai.net/prompt-tests/ref-transform-20260608/inputs/lifestyle-02-68f5c34db6.png',
  source03:
    'https://media.vogueai.net/prompt-tests/ref-transform-20260608/inputs/lifestyle-03-1f6abdd720.png',
  source06:
    'https://media.vogueai.net/prompt-tests/ref-transform-20260608/inputs/lifestyle-06-10eefa9265.png',
  source08:
    'https://media.vogueai.net/prompt-tests/ref-transform-20260608/inputs/lifestyle-08-bf31458900.png',
} as const;

const naiveStyleReference =
  'https://media.vogueai.net/prompt-tests/ref-transform-20260608/inputs/style-naive-avatar-62fa65c6cb.jpg';

const retroStyleReference =
  'https://media.vogueai.net/prompt-tests/ref-transform-20260608/inputs/style-retro-print-0be7af75cb.jpg';

const vogueFashionIllustrationSourceBase =
  '/prompt-transform-sources/vogueai-20260610-vogue-style-fashion-illustration-photo-edit';

const PROMPT_TRANSFORM_EXAMPLE_CONFIGS: Record<
  string,
  PromptTransformExampleConfig
> = {
  'vogueai-20260608-naive-digital-portrait-avatar-from-selfie': {
    mode: 'before-after',
    examples: [
      {
        sourceImage: lifestyleSourceImages.source02,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        styleReferenceImage: naiveStyleReference,
        styleReferenceLabel: 'Naive avatar style',
      },
      {
        sourceImage: lifestyleSourceImages.source03,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        styleReferenceImage: naiveStyleReference,
        styleReferenceLabel: 'Naive avatar style',
      },
      {
        sourceImage: lifestyleSourceImages.source06,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        styleReferenceImage: naiveStyleReference,
        styleReferenceLabel: 'Naive avatar style',
      },
      {
        sourceImage: lifestyleSourceImages.source08,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        styleReferenceImage: naiveStyleReference,
        styleReferenceLabel: 'Naive avatar style',
      },
    ],
  },
  'vogueai-20260608-retro-art-print-portrait-poster-from-photo': {
    mode: 'before-after',
    examples: [
      {
        sourceImage: lifestyleSourceImages.source02,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        styleReferenceImage: retroStyleReference,
        styleReferenceLabel: 'Retro print style',
      },
      {
        sourceImage: lifestyleSourceImages.source03,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        styleReferenceImage: retroStyleReference,
        styleReferenceLabel: 'Retro print style',
      },
      {
        sourceImage: lifestyleSourceImages.source06,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        styleReferenceImage: retroStyleReference,
        styleReferenceLabel: 'Retro print style',
      },
      {
        sourceImage: lifestyleSourceImages.source08,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        styleReferenceImage: retroStyleReference,
        styleReferenceLabel: 'Retro print style',
      },
    ],
  },
  'vogueai-20260610-vogue-style-fashion-illustration-photo-edit-ai-prompt': {
    mode: 'before-after',
    examples: [
      {
        sourceImage: `${vogueFashionIllustrationSourceBase}/vogue-illustration-source-01-clean-editorial-portrait.png`,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        sourceWidth: 880,
        sourceHeight: 1184,
      },
      {
        sourceImage: `${vogueFashionIllustrationSourceBase}/vogue-illustration-source-02-full-body-fashion-studio.png`,
        sourceLabel: 'Source Image',
        resultLabel: 'Final Result',
        sourceWidth: 832,
        sourceHeight: 1248,
      },
    ],
  },
};

export const getPromptTransformExampleConfig = (
  promptEntryId: string
): PromptTransformExampleConfig | null =>
  PROMPT_TRANSFORM_EXAMPLE_CONFIGS[promptEntryId] ?? null;
