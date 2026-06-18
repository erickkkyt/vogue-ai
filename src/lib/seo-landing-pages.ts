import type { Metadata } from 'next';

export type SeoLandingPageSlug =
  | 'free-ai-image-generator'
  | 'meigen-alternative';

export type SeoLandingIconKey =
  | 'sparkles'
  | 'images'
  | 'upload'
  | 'sliders'
  | 'badge'
  | 'search'
  | 'layers'
  | 'wand'
  | 'check';

export type SeoLandingPageConfig = {
  slug: SeoLandingPageSlug;
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  breadcrumbLabel?: string;
  intro: string;
  disclaimer?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  heroPrompt: string;
  heroControls: {
    model: string;
    aspectRatio: string;
    quality: string;
    output: string;
  };
  primaryCta: {
    label: string;
    prompt: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  stats: {
    value: string;
    label: string;
  }[];
  featureHeading: string;
  featureStrip: {
    icon: SeoLandingIconKey;
    title: string;
    body: string;
  }[];
  gallery: {
    heading: string;
    description: string;
    entryIds: string[];
  };
  comparison: {
    heading: string;
    description: string;
    columns: [string, string];
    rows: {
      label: string;
      left: string;
      right: string;
    }[];
  };
  steps: {
    heading: string;
    description: string;
    items: {
      title: string;
      body: string;
    }[];
  };
  useCases: {
    heading: string;
    items: {
      icon: SeoLandingIconKey;
      title: string;
      body: string;
    }[];
  };
  faq: {
    question: string;
    answer: string;
  }[];
  related: {
    href: string;
    label: string;
    description: string;
  }[];
  schemaType: 'WebApplication' | 'CollectionPage';
  sitemapPriority: number;
};

export const SEO_LANDING_PAGE_SLUGS: SeoLandingPageSlug[] = [
  'free-ai-image-generator',
  'meigen-alternative',
];

const buildWorkspaceHref = (prompt: string) => {
  const params = new URLSearchParams({
    target: 'image',
    model: 'zimage',
    prompt,
  });

  return `/app?${params.toString()}`;
};

export const SEO_LANDING_PAGE_CONFIGS: Record<
  SeoLandingPageSlug,
  SeoLandingPageConfig
> = {
  'free-ai-image-generator': {
    slug: 'free-ai-image-generator',
    path: '/free-ai-image-generator',
    title: 'Free AI Image Generator No Sign Up | Vogue AI',
    metaDescription:
      "Use Vogue AI's free AI image generator - no sign up for your first image. Then sign in for daily free credits and prompt-to-image workflows.",
    h1: 'Free AI Image Generator | Vogue AI',
    breadcrumbLabel: 'Free AI Image Generator',
    intro:
      'Use a free AI image generator for your first image without login, then sign in for daily free generation credits and a full prompt-to-image workspace.',
    primaryKeyword: 'free ai image generator',
    secondaryKeywords: [
      'free ai image generator no sign up',
      'free ai image generator no login',
      'text to image generator free',
      'ai image generator from text',
      'free online AI image generator',
      'AI art generator no signup',
      'no credit card AI image generator',
      'daily free AI image credits',
    ],
    heroPrompt:
      'Create a premium editorial product image for a pearl white fragrance bottle on a clean porcelain surface, soft studio light, restrained graphite typography space, luxury campaign mood.',
    heroControls: {
      model: 'GPT Image 2',
      aspectRatio: 'Auto',
      quality: 'Low preview',
      output: '1 image',
    },
    primaryCta: {
      label: 'Generate a free preview',
      prompt:
        'Create a premium editorial product image for a pearl white fragrance bottle on a clean porcelain surface, soft studio light, restrained graphite typography space, luxury campaign mood.',
    },
    secondaryCta: {
      label: 'Browse prompt examples',
      href: '/ai-image-prompt',
    },
    stats: [
      {
        value: 'Vogue',
        label: 'AI workspace',
      },
      {
        value: 'Prompt',
        label: 'to generation',
      },
    ],
    featureHeading: 'Why this free AI image generator works',
    featureStrip: [
      {
        icon: 'sparkles',
        title: 'No sign-up first image',
        body: 'Use the free AI image generator to create your first image from text before you make an account.',
      },
      {
        icon: 'wand',
        title: 'Copyable prompt examples',
        body: 'Start from reusable AI image prompts, then send the adapted idea into the free AI image generator for products, portraits, posters, logos, packaging, ads, and social posts.',
      },
      {
        icon: 'upload',
        title: 'Daily free credits',
        body: 'After sign-in, the free AI image generator continues with daily free generation credits, saved assets, reference images, and more iterations.',
      },
      {
        icon: 'sliders',
        title: 'Prompt-to-image workflow',
        body: 'Move from a no-login free AI image generator preview into controls for aspect ratio, output size, quality, and repeatable image generation.',
      },
    ],
    gallery: {
      heading: 'Free AI image generator examples',
      description:
        'Browse free AI image generator examples before sending your own text-to-image idea into Vogue AI.',
      entryIds: [
        'vogueai-20260615-aurora-run-lab-trail-sneaker-nine-panel-ad-poster-ai-prompt',
        'vogueai-20260615-fashion-cover-editorial-portrait-ai-prompt',
        'vogueai-20260615-an-instantly-readable-pareidolia-logo-ai-prompt',
        'vogueai-20260615-moss-and-rice-packaging-system-thinking-packaging-board-ai-prompt',
        'vogueai-20260615-architecture-window-view-photo-ai-prompt',
        'vogueai-20260615-algeria-travel-card-collage-poster-ai-prompt',
        'vogueai-20260615-friendly-bald-founder-logo-ai-prompt',
        'vogueai-20260615-aurora-run-lab-trail-sneaker-overhead-shot-ad-poster-ai-prompt',
        'vogueai-20260615-black-and-white-cinematic-emotional-portrait-ai-prompt',
        'vogueai-20260615-moss-and-rice-mockup-board-ai-prompt',
        'vogueai-20260615-high-impact-commercial-food-double-juice-burger-commercial-poster-ai-prompt',
        'vogueai-20260615-the-last-roar-magazine-cover-editorial-poster-ai-prompt',
      ],
    },
    comparison: {
      heading: 'No-sign-up preview vs signed-in workspace',
      description:
        'Start with a no-login free AI image generator preview, then use daily credits, saved assets, and controls after sign-in.',
      columns: ['No sign-up image generator', 'Signed-in Vogue AI workspace'],
      rows: [
        {
          label: 'Best for',
          left: 'Trying a free AI image generator quickly',
          right: 'Saving images, prompts, and projects',
        },
        {
          label: 'Generation',
          left: 'First free AI image generator run without login',
          right: 'Daily free credits plus paid credit options',
        },
        {
          label: 'References',
          left: 'Text-to-image prompt first',
          right: 'Reference images and prompt remix workflows',
        },
        {
          label: 'Output control',
          left: 'Simple free AI image generator preview settings',
          right: 'More quality, format, and asset controls',
        },
      ],
    },
    steps: {
      heading: 'How to use the free AI image generator',
      description:
        'Write a prompt in the free AI image generator, create your first image without login, then continue with daily credits.',
      items: [
        {
          title: 'Write the image goal',
          body: 'Before using the free AI image generator, describe the subject, style, scene, lighting, composition, and use case for your text-to-image generation.',
        },
        {
          title: 'Create in the free AI image generator',
          body: 'Use the no sign-up free AI image generator flow to test whether the model understands the visual direction.',
        },
        {
          title: 'Refine from an example',
          body: 'Open a free prompt example, copy the structure, and replace the product, person, scene, or campaign mood.',
        },
        {
          title: 'Use daily free credits',
          body: 'Sign in when you want daily free AI image credits, reference images, saved assets, or higher iteration volume.',
        },
      ],
    },
    useCases: {
      heading: 'Free AI image generator use cases',
      items: [
        {
          icon: 'images',
          title: 'Product image generation',
          body: 'Use the free AI image generator to create product hero shots, ecommerce images, packaging mockups, fragrance posters, and ad campaign key visuals.',
        },
        {
          icon: 'badge',
          title: 'Brand and social visuals',
          body: 'Draft logos, mascot ideas, social covers, poster systems, thumbnails, and fast AI art concepts from text.',
        },
        {
          icon: 'layers',
          title: 'Prompt testing',
          body: 'Use the free AI image generator to test rough prompts before building a saved prompt-to-image workflow in Vogue AI.',
        },
      ],
    },
    faq: [
      {
        question: 'Is Vogue AI a free AI image generator with no sign up?',
        answer:
          'Yes. Vogue AI lets you create your first AI image without signing up. After the first no-login generation, you can sign in to keep assets, use daily free generation credits, and continue in the full image workspace.',
      },
      {
        question: 'Do I need to log in for my first AI image generation?',
        answer:
          'No. The first image generation is designed as a low-friction preview, so you can enter a prompt and test the free AI image generator before creating an account.',
      },
      {
        question: 'Do I get free AI image credits every day?',
        answer:
          'Yes. After sign-in, the free AI image generator provides daily free generation credits for continued image creation. The current allowance is shown inside the app, because model cost and abuse controls can change over time.',
      },
      {
        question: 'Is this an unlimited free AI image generator?',
        answer:
          'No. Vogue AI is a free-to-start AI image generator, not an unlimited anonymous generator. The first generation works without login, and ongoing free use is handled through daily credits after sign-in.',
      },
      {
        question: 'Can I use the free AI image generator as a text to image generator?',
        answer:
          'Yes. Write a text prompt that names the subject, scene, style, composition, lighting, and final use case, then open the prompt in the free AI image generator to create an image from text.',
      },
      {
        question: 'Does the free AI image generator require a credit card?',
        answer:
          'No credit card is needed to try the first no sign-up image generation. Paid credits are optional when you need more generations or a heavier production workflow.',
      },
      {
        question: 'Can I use prompt examples with the AI image generator?',
        answer:
          'Yes. Open any AI image prompt example, copy the reusable structure, then replace the subject, product, setting, style, lighting, and final use case before using the free AI image generator.',
      },
      {
        question: 'What happens after I enter a prompt on this page?',
        answer:
          'The prompt opens in the Vogue AI app with the default free AI image generator workflow ready. The page is intentionally prompt-only, so generation happens in the app where credits, saved assets, and controls are handled.',
      },
    ],
    related: [
      {
        href: '/gpt-image-prompt',
        label: 'GPT Image Prompt',
        description: 'Copy GPT Image 2 prompt examples for commercial visuals.',
      },
      {
        href: '/ai-image-prompt',
        label: 'AI Image Prompt',
        description: 'Browse prompt examples for text-to-image generation.',
      },
      {
        href: '/nano-banana-prompt',
        label: 'Nano Banana Prompt',
        description: 'Explore Nano Banana prompt examples for image workflows.',
      },
      {
        href: '/midjourney-prompt',
        label: 'Midjourney Prompt',
        description: 'Browse Midjourney prompt structures for visual ideas.',
      },
      {
        href: '/meigen-alternative',
        label: 'Meigen AI Prompt Gallery',
        description: 'Explore a Vogue AI prompt-gallery alternative to Meigen.',
      },
    ],
    schemaType: 'WebApplication',
    sitemapPriority: 0.96,
  },
  'meigen-alternative': {
    slug: 'meigen-alternative',
    path: '/meigen-alternative',
    title: 'Meigen Alternative for AI Image Prompts | Vogue AI',
    metaDescription:
      'Use Vogue AI as a Meigen alternative: browse an AI image prompt gallery, copy GPT Image prompt structures, and generate images in one workflow.',
    h1: 'Meigen Alternative：Better AI Image Prompt Gallery',
    intro:
      'Browse a Meigen-like AI prompt gallery, copy GPT Image prompt structures, and generate images in Vogue AI.',
    primaryKeyword: 'meigen',
    secondaryKeywords: [
      'meigen alternative',
      'meigen ai prompt gallery',
      'meigen ai prompts',
      'Meigen GPT Image 2 prompts',
      'Nano Banana prompts',
      'AI image prompt gallery',
      'copy AI image prompts',
      'generate images from prompts',
    ],
    heroPrompt:
      'Create a high-fashion advertisement image with a clean editorial composition, pearl white studio light, structured styling, premium product placement, and restrained campaign typography space.',
    heroControls: {
      model: 'GPT Image 2',
      aspectRatio: '4:5',
      quality: 'Studio preview',
      output: 'Prompt gallery',
    },
    primaryCta: {
      label: 'Try Vogue AI instead',
      prompt:
        'Create a high-fashion advertisement image with a clean editorial composition, pearl white studio light, structured styling, premium product placement, and restrained campaign typography space.',
    },
    secondaryCta: {
      label: 'View GPT Image prompts',
      href: '/gpt-image-prompt',
    },
    stats: [
      {
        value: '2000+',
        label: 'prompt sets',
      },
      {
        value: 'Vogue',
        label: 'AI workspace',
      },
      {
        value: 'Copy',
        label: 'and adapt',
      },
    ],
    featureHeading: 'Why this is a better AI prompt gallery',
    featureStrip: [
      {
        icon: 'search',
        title: 'Visual examples before copy',
        body: 'Start from finished images, not prompt text alone, so you can judge composition, styling, and output format before adapting.',
      },
      {
        icon: 'images',
        title: 'Reusable prompt pages',
        body: 'Open each prompt page to inspect the image, prompt structure, model context, and related examples before you copy.',
      },
      {
        icon: 'wand',
        title: 'Copy, adapt, then generate',
        body: 'Move from Meigen-style discovery into a Vogue AI workflow where the same prompt can be edited and generated.',
      },
      {
        icon: 'layers',
        title: 'Connected prompt hubs',
        body: 'Jump between GPT Image, Nano Banana, Midjourney, and broader AI image prompt hubs instead of browsing one isolated feed.',
      },
    ],
    gallery: {
      heading: 'Meigen-like AI prompt gallery',
      description:
        'Browse Meigen-style GPT Image 2 prompts for product ads, fashion, posters, characters, and commercial visuals.',
      entryIds: [
        'meigen-featured-arri-alexa-dynamic-commercial-shot-79712a31',
        'meigen-featured-high-fashion-advertisement-photo-01e335ca',
        'meigen-featured-premium-youth-culture-advertising-poster-8ed2e239',
        'meigen-featured-matte-black-trophy-premium-poster-c3506832',
        'meigen-featured-minimalist-editorial-character-poster-b0e0676b',
        'meigen-featured-ultra-realistic-black-and-white-high-fashion-editorial-4ca1a6a2',
        'meigen-featured-photorealistic-premium-product-render-409a5681',
        'meigen-featured-perfume-key-visual-poster-3ef619c7',
        'meigen-featured-cinematic-movie-poster-with-powerful-female-lead-aefeb7c7',
        'meigen-featured-creative-collectible-character-packaging-poster-f9d28dcd',
        'meigen-featured-cinematic-high-end-sneaker-advertisement-poster-5347c1db',
        'meigen-featured-bold-y2k-japanese-street-editorial-collage-poster-703a5fc5',
      ],
    },
    comparison: {
      heading: 'Meigen alternative comparison',
      description:
        'Compare a gallery similar to Meigen with a prompt workspace that connects directly to generation.',
      columns: ['Meigen-style prompt gallery', 'Vogue AI Meigen-like workflow'],
      rows: [
        {
          label: 'Search intent',
          left: 'Find viral AI image prompt ideas',
          right: 'Find, copy, remix, and generate prompts',
        },
        {
          label: 'Best use',
          left: 'Prompt browsing and visual inspiration',
          right: 'AI image prompt gallery plus workspace',
        },
        {
          label: 'Models',
          left: 'GPT Image 2, Nano Banana, and similar prompt ideas',
          right: 'Prompt hubs connected to Vogue AI generation',
        },
        {
          label: 'Next action',
          left: 'Copy a prompt into another generator',
          right: 'Open a prompt page or generate in Vogue AI',
        },
      ],
    },
    steps: {
      heading: 'How to use Meigen-like prompts',
      description:
        'Find a visual, copy the prompt logic, then generate and iterate in Vogue AI.',
      items: [
        {
          title: 'Choose a prompt style',
          body: 'Start with Meigen-inspired prompts for product ads, fashion campaigns, cinematic posters, character packaging, or portraits.',
        },
        {
          title: 'Open the prompt page',
          body: 'Inspect the finished image, read the AI image prompt, and identify the subject, lighting, composition, and output format.',
        },
        {
          title: 'Replace the variables',
          body: 'Swap the product, person, brand mood, color palette, background, and headline space without losing the prompt structure.',
        },
        {
          title: 'Generate and iterate',
          body: 'Send the adapted prompt into Vogue AI, then continue with reference images, saved assets, or prompt-to-image variations.',
        },
      ],
    },
    useCases: {
      heading: 'Meigen alternative use cases',
      items: [
        {
          icon: 'badge',
          title: 'Commercial prompt discovery',
          body: 'Find reusable AI image prompt structures for ads, ecommerce hero images, packaging boards, and product launch visuals.',
        },
        {
          icon: 'images',
          title: 'Fashion and editorial concepts',
          body: 'Use Meigen-like prompt examples for high-fashion photography, campaign posters, portraits, and magazine compositions.',
        },
        {
          icon: 'sliders',
          title: 'GPT Image prompt workflows',
          body: 'Move beyond copy-paste prompt browsing by generating, refining, and saving image directions inside Vogue AI.',
        },
      ],
    },
    faq: [
      {
        question: 'What makes Vogue AI a good Meigen alternative?',
        answer:
          'Vogue AI gives users a Meigen-like prompt gallery, copyable AI image prompt structures, preview images, and a workspace for generating images instead of stopping at inspiration.',
      },
      {
        question: 'What is a Meigen alternative?',
        answer:
          'A Meigen alternative should help users browse AI image prompt examples, inspect finished visuals, copy prompt structures, and move into image generation without rebuilding the workflow from scratch.',
      },
      {
        question: 'What changes after I find a Meigen-style prompt?',
        answer:
          'You can open the prompt page, inspect the finished visual, copy or adapt the structure, and generate images in the same Vogue AI product flow.',
      },
      {
        question: 'Does Vogue AI include Meigen-style prompt examples?',
        answer:
          'Yes. Vogue AI includes curated commercial, fashion, product, poster, portrait, and character prompt examples that match the Meigen-style prompt gallery search intent.',
      },
      {
        question: 'Can I copy these prompts into GPT Image 2 or Nano Banana?',
        answer:
          'Yes. Many Vogue AI examples are designed around GPT Image 2-style and Nano Banana-style workflows. Replace the subject, product, brand mood, visual constraints, and output use case before generating.',
      },
      {
        question: 'Does Vogue AI work like an AI image prompt gallery?',
        answer:
          'Yes. The page surfaces a curated prompt gallery with preview images, prompt pages, and related prompt hubs, so users can scan visuals before choosing a prompt to copy.',
      },
      {
        question: 'Can I generate images after finding a Meigen-style prompt?',
        answer:
          'Yes. Open a prompt in Vogue AI, adapt the variables, and generate images from the prompt. This is the main difference from a pure inspiration gallery that stops at copy-and-paste.',
      },
      {
        question: 'Who should use this Meigen alternative page?',
        answer:
          'Use it if you want reusable prompt structures for product visuals, fashion campaigns, ecommerce images, posters, character packaging, social graphics, or commercial AI image generation.',
      },
    ],
    related: [
      {
        href: '/gpt-image-prompt',
        label: 'GPT Image Prompt',
        description: 'Browse GPT Image 2 prompt examples to copy and adapt.',
      },
      {
        href: '/ai-image-prompt',
        label: 'AI Image Prompt',
        description: 'Use the main prompt hub for broader prompt-to-image ideas.',
      },
      {
        href: '/nano-banana-prompt',
        label: 'Nano Banana Prompt',
        description: 'Explore Nano Banana prompt examples for image workflows.',
      },
      {
        href: '/midjourney-prompt',
        label: 'Midjourney Prompt',
        description: 'Browse Midjourney prompt structures for visual ideas.',
      },
      {
        href: '/free-ai-image-generator',
        label: 'Free AI Image Generator',
        description: 'Try a first AI image preview without signing up.',
      },
    ],
    schemaType: 'CollectionPage',
    sitemapPriority: 0.94,
  },
};

export const getSeoLandingPageConfig = (slug: SeoLandingPageSlug) =>
  SEO_LANDING_PAGE_CONFIGS[slug];

export const getSeoLandingWorkspaceHref = (slug: SeoLandingPageSlug) =>
  buildWorkspaceHref(getSeoLandingPageConfig(slug).primaryCta.prompt);

export function createSeoLandingMetadata(
  slug: SeoLandingPageSlug
): Metadata {
  const config = getSeoLandingPageConfig(slug);

  return {
    title: config.title,
    description: config.metaDescription,
    alternates: {
      canonical: config.path,
    },
    openGraph: {
      title: config.title,
      description: config.metaDescription,
      url: config.path,
      siteName: 'Vogue AI',
      images: [
        {
          url: '/social-share.jpg',
          width: 1200,
          height: 630,
          alt: config.h1,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.metaDescription,
      images: ['/social-share.jpg'],
    },
  };
}
