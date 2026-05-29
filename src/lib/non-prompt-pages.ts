import aiBabyGenerator from '@/config/pages/non-prompt/ai-baby-generator.json';
import aiBabyPodcast from '@/config/pages/non-prompt/ai-baby-podcast.json';
import effect from '@/config/pages/non-prompt/effect.json';
import earthZoom from '@/config/pages/non-prompt/earth-zoom.json';
import hailuoAiVideoGenerator from '@/config/pages/non-prompt/hailuo-ai-video-generator.json';
import lipsync from '@/config/pages/non-prompt/lipsync.json';
import seedance from '@/config/pages/non-prompt/seedance.json';
import veo3Generator from '@/config/pages/non-prompt/veo-3-generator.json';

export type NonPromptInputKind =
  | 'prompt'
  | 'image'
  | 'two-images'
  | 'image-video'
  | 'audio-video';

export type NonPromptControlType = 'select' | 'text';

export type NonPromptToolControl = {
  id: string;
  label: string;
  defaultValue: string;
  options?: string[];
  type?: NonPromptControlType;
};

export type NonPromptUploadSlot = {
  id: string;
  label: string;
  description: string;
  accept: string;
};

export type NonPromptWorkspaceConfig = {
  eyebrow: string;
  title: string;
  description: string;
  inputKind: NonPromptInputKind;
  promptLabel: string;
  defaultPrompt: string;
  promptMaxLength: number;
  uploadSlots: NonPromptUploadSlot[];
  controls: NonPromptToolControl[];
  actionLabel: string;
  previewLabel: string;
  previewTitle: string;
  previewDescription: string;
  readyText: string;
  previewVariant: string;
  resultChips: string[];
};

export type NonPromptCard = {
  title: string;
  description: string;
};

export type NonPromptShowcaseItem = NonPromptCard & {
  prompt: string;
  variant?: string;
};

export type NonPromptHowStep = NonPromptCard & {
  step: string;
};

export type NonPromptRelatedTool = NonPromptCard & {
  href: string;
};

export type NonPromptFaqItem = {
  question: string;
  answer: string;
};

export type NonPromptPageConfig = {
  slug: string;
  path: string;
  category: string;
  label: string;
  metadata: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  workspace: NonPromptWorkspaceConfig;
  sections: {
    showcase: {
      eyebrow: string;
      title: string;
      description: string;
      items: NonPromptShowcaseItem[];
    };
    what: {
      eyebrow: string;
      title: string;
      description: string;
      items: NonPromptCard[];
    };
    how: {
      eyebrow: string;
      title: string;
      description: string;
      steps: NonPromptHowStep[];
    };
    features: {
      eyebrow: string;
      title: string;
      description: string;
      items: NonPromptCard[];
    };
    useCases: {
      eyebrow: string;
      title: string;
      description: string;
      items: NonPromptCard[];
    };
    value: {
      eyebrow: string;
      title: string;
      description: string;
      points: NonPromptCard[];
    };
    related: {
      eyebrow: string;
      title: string;
      description: string;
      tools: NonPromptRelatedTool[];
    };
    faq: {
      eyebrow: string;
      title: string;
      description: string;
      items: NonPromptFaqItem[];
    };
    finalCta: {
      title: string;
      description: string;
      actionLabel: string;
    };
  };
};

export const NON_PROMPT_PAGE_CONFIGS = {
  'ai-baby-generator': aiBabyGenerator as NonPromptPageConfig,
  'ai-baby-podcast': aiBabyPodcast as NonPromptPageConfig,
  effect: effect as NonPromptPageConfig,
  'earth-zoom': earthZoom as NonPromptPageConfig,
  'hailuo-ai-video-generator': hailuoAiVideoGenerator as NonPromptPageConfig,
  lipsync: lipsync as NonPromptPageConfig,
  seedance: seedance as NonPromptPageConfig,
  'veo-3-generator': veo3Generator as NonPromptPageConfig,
} as const satisfies Record<string, NonPromptPageConfig>;

export type NonPromptPageSlug = keyof typeof NON_PROMPT_PAGE_CONFIGS;

export const NON_PROMPT_PAGE_SLUGS = Object.keys(
  NON_PROMPT_PAGE_CONFIGS
) as NonPromptPageSlug[];

export function getNonPromptPageConfig(slug: NonPromptPageSlug) {
  return NON_PROMPT_PAGE_CONFIGS[slug];
}
