import type { NonPromptPageSlug } from '@/lib/non-prompt-pages';

export type NonPromptCollectionSlug = 'effect' | 'model';

export type NonPromptCollectionConfig = {
  slug: NonPromptCollectionSlug;
  path: string;
  label: string;
  metadata: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
  };
  items: NonPromptPageSlug[];
};

export const NON_PROMPT_COLLECTION_CONFIGS = {
  effect: {
    slug: 'effect',
    path: '/effect',
    label: 'AI Effects',
    metadata: {
      title: 'AI Effects Collection - Vogue AI Tools',
      description:
        'Browse Vogue AI effect tools for image-to-video transformations, Earth zoom scenes, AI baby concepts, podcast clips, and lip-sync creator workflows.',
      image: '/social-share.jpg',
      imageAlt: 'Vogue AI effects collection',
    },
    hero: {
      eyebrow: 'Effect tools',
      title: 'AI effects for image, video, and social concepts',
      description:
        'Start from the effect you need, then open the dedicated workspace with the right upload slots, prompt controls, examples, and workflow guidance already tuned for that creative format.',
      primaryCta: 'Browse effect tools',
    },
    items: ['earth-zoom', 'ai-baby-generator', 'ai-baby-podcast', 'lipsync'],
  },
  model: {
    slug: 'model',
    path: '/model',
    label: 'AI Models',
    metadata: {
      title: 'AI Video Model Collection - Vogue AI Tools',
      description:
        'Compare Vogue AI model workspaces for Hailuo AI, Seedance, and Veo 3 style video generation with prompt, image, motion, and audio controls.',
      image: '/social-share.jpg',
      imageAlt: 'Vogue AI model collection',
    },
    hero: {
      eyebrow: 'Model workspaces',
      title: 'AI video model workspaces in one place',
      description:
        'Choose the model surface by the generation job: fast image-to-video motion, cinematic character clips, or audio-aware Veo-style prompting with each workspace keeping its own controls.',
      primaryCta: 'Browse model workspaces',
    },
    items: ['hailuo-ai-video-generator', 'seedance', 'veo-3-generator'],
  },
} as const satisfies Record<NonPromptCollectionSlug, NonPromptCollectionConfig>;

export const NON_PROMPT_COLLECTION_SLUGS = Object.keys(
  NON_PROMPT_COLLECTION_CONFIGS
) as NonPromptCollectionSlug[];

export function getNonPromptCollectionConfig(slug: NonPromptCollectionSlug) {
  return NON_PROMPT_COLLECTION_CONFIGS[slug];
}
