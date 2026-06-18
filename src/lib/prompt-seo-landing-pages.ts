import type { Metadata } from 'next';

export type PromptSeoLandingPageSlug =
  | 'ai-image-prompt'
  | 'gpt-image-prompt'
  | 'nano-banana-prompt'
  | 'midjourney-prompt';

export type PromptSeoLandingPageConfig = {
  slug: PromptSeoLandingPageSlug;
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  breadcrumbLabel?: string;
  eyebrow?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  modelId?: string;
  heroEntryId?: string;
  galleryHeading: string;
  galleryDescription: string;
  intro: string[];
  statLabel: string;
  workflowLabel: string;
  sectionHeading: string;
  sectionDescription: string;
  chips: {
    href: string;
    label: string;
    eyebrow: string;
  }[];
  sections: {
    heading: string;
    body: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  related: {
    href: string;
    label: string;
    description: string;
  }[];
  sitemapPriority: number;
};

export const PROMPT_SEO_LANDING_PAGE_SLUGS: PromptSeoLandingPageSlug[] = [
  'ai-image-prompt',
  'gpt-image-prompt',
  'nano-banana-prompt',
  'midjourney-prompt',
];

export const PROMPT_SEO_LANDING_PAGE_CONFIGS: Record<
  PromptSeoLandingPageSlug,
  PromptSeoLandingPageConfig
> = {
  'ai-image-prompt': {
    slug: 'ai-image-prompt',
    path: '/ai-image-prompt',
    title: 'AI Image Prompt Examples to Copy | Vogue AI',
    metaDescription:
      'Browse AI image prompt examples with preview images. Copy prompts for prompt to image workflows, product photos, posters, portraits, UI mockups and ads.',
    h1: 'AI Image Prompt',
    breadcrumbLabel: 'AI Image Prompt',
    primaryKeyword: 'ai image prompt',
    secondaryKeywords: [
      'prompt to image',
      'ai image prompts',
      'ai image prompt examples',
    ],
    heroEntryId: 'x-2061290699224387653',
    galleryHeading: 'AI image prompt gallery',
    galleryDescription:
      'Browse AI image prompt examples, choose a visual direction, then open a prompt page to copy the prompt or use the image as a reference.',
    intro: [
      'An AI image prompt is the reusable instruction behind a finished visual. This gallery collects prompt to image examples for product shots, posters, portraits, UI concepts, ads and social graphics, so you can start from a proven visual structure instead of a blank text box.',
      'Use this AI image prompt page as a fast scan: open any prompt page, copy the prompt, use the image as a reference, or send the idea into the Vogue AI workspace for a prompt to image generation flow.',
    ],
    statLabel: 'prompt examples',
    workflowLabel: 'Prompt to image workflow',
    sectionHeading: 'AI image prompt formula for better prompt to image results',
    sectionDescription:
      'A strong AI image prompt works like a short creative brief. Describe the subject, scene, composition, style, lighting, constraints and final use case before you generate.',
    chips: [
      {
        href: '/ai-image-prompt',
        label: 'AI Image Prompt',
        eyebrow: 'Primary keyword',
      },
      {
        href: '/gpt-image-prompt',
        label: 'GPT Image Prompt',
        eyebrow: 'Model prompts',
      },
      {
        href: '/nano-banana-prompt',
        label: 'Nano Banana Prompt',
        eyebrow: 'Model prompts',
      },
      {
        href: '/midjourney-prompt',
        label: 'Midjourney Prompt',
        eyebrow: 'Prompt examples',
      },
    ],
    sections: [
      {
        heading: 'What an AI image prompt controls',
        body: 'A visual prompt tells the model what to show, how to frame it and where the output will be used. Start with the subject and goal, such as a product image, poster, portrait, UI mockup, ad creative or social image.',
      },
      {
        heading: 'Style, lighting and composition',
        body: 'Add camera angle, framing, background, mood, color palette and lighting so the model understands the visual direction. These details turn a plain prompt to image request into a usable creative brief.',
      },
      {
        heading: 'Reference image and constraints',
        body: 'Use a reference image when pose, product angle, identity or layout matters. Then say what should stay fixed, what should change and which details to avoid, such as extra text, messy backgrounds or wrong proportions.',
      },
    ],
    faq: [
      {
        question: 'How do I write an AI image prompt that gets a usable result?',
        answer:
          'Start with the subject and final use case, then add the scene, composition, style, lighting, camera or medium, and constraints. A usable AI image prompt should tell the model what the image is for, such as a product hero shot, poster, portrait, UI mockup or social graphic.',
      },
      {
        question: 'What prompt structure works best for product photos, posters, portraits and UI images?',
        answer:
          'Use a repeatable structure: subject + use case + setting + composition + style + lighting + details to preserve + details to avoid. Product prompts need product shape and material, poster prompts need layout and hierarchy, portrait prompts need identity and mood, and UI prompts need screen context and readable structure.',
      },
      {
        question: 'How do I turn a rough idea into a prompt to image workflow?',
        answer:
          'Write the plain idea first, choose the closest example image, then copy the useful prompt structure and replace the subject, style, background and output goal. For example, turn "red sneaker ad" into a studio product shot with product placement, lighting, background, campaign mood and final ad format.',
      },
      {
        question: 'Can I copy an AI image prompt example and use it for my own image?',
        answer:
          'Yes. Use the example as a starting point, but replace the subject, product, person, brand mood and final format. Copying the structure is usually more valuable than copying every word because the structure carries the composition, lighting and visual logic.',
      },
      {
        question: 'How do I use a reference image without confusing the model?',
        answer:
          'In an AI image prompt, say exactly what the reference image should control and what should change. A clear instruction is better than a vague one: use the reference for pose and framing, keep the product angle, change the background, preserve the face direction, and avoid changing the outfit shape.',
      },
      {
        question: 'Why does my AI image output ignore details or change the subject?',
        answer:
          'The prompt is often too vague, too crowded or internally contradictory. Put the most important subject and constraint near the beginning, remove competing styles, and use concrete instructions like centered product, plain background, no visible text, same face angle or exact package shape.',
      },
      {
        question: 'How do I choose between GPT Image, Nano Banana and Midjourney prompts?',
        answer:
          'Use GPT Image prompts for direct commercial briefs, clean product visuals, UI concepts and ad layouts. Use Nano Banana prompts when reference-image iteration, portraits, fashion or fast variations matter. Use Midjourney prompts when style, mood, cinematic scenes or expressive art direction are the priority.',
      },
      {
        question: 'Can I use AI image prompts for commercial product images?',
        answer:
          'Yes. AI image prompts can support ecommerce shots, ad creatives, packaging mockups, campaign posters and social visuals. For commercial use, describe the product accurately, avoid protected logos or people you do not have rights to use, and check the usage terms of the model and reference assets.',
      },
    ],
    related: [
      {
        href: '/gpt-image-prompt',
        label: 'GPT Image Prompt',
        description: 'GPT Image 2 prompt examples for commercial visuals.',
      },
      {
        href: '/free-ai-image-generator',
        label: 'Free AI Image Generator',
        description: 'Create your first AI image without sign up in Vogue AI.',
      },
      {
        href: '/meigen-alternative',
        label: 'Meigen Alternative',
        description: 'Browse a prompt gallery alternative for Meigen-style ideas.',
      },
      {
        href: '/nano-banana-prompt',
        label: 'Nano Banana Prompt',
        description: 'Nano Banana prompt examples for fast visual iteration.',
      },
      {
        href: '/midjourney-prompt',
        label: 'Midjourney Prompt',
        description: 'Midjourney prompt examples to copy or adapt.',
      },
    ],
    sitemapPriority: 0.92,
  },
  'gpt-image-prompt': {
    slug: 'gpt-image-prompt',
    path: '/gpt-image-prompt',
    title: 'Free GPT Image 2 Prompt Examples to Copy | Vogue AI',
    metaDescription:
      'Browse free GPT image prompt examples for GPT Image 2. Copy prompts with preview images for product shots, posters, portraits, UI mockups and ads.',
    h1: 'GPT Image 2 Prompt',
    breadcrumbLabel: 'GPT Image Prompt',
    primaryKeyword: 'gpt image prompt',
    secondaryKeywords: [
      'gpt image 2 prompts',
      'gpt image prompt examples',
      'GPT Image 2 prompt examples',
    ],
    modelId: 'gptimage2',
    heroEntryId: 'x-2055516978383852002',
    galleryHeading: 'GPT Image Prompt',
    galleryDescription:
      'Browse GPT image prompt examples for GPT Image 2, then open a GPT image prompt page to copy the prompt or use the image as a reference.',
    intro: [
      'A GPT image prompt should be direct, visual and specific enough for GPT Image 2 to understand the subject, composition, style and output purpose. This GPT image prompt page focuses on prompt examples for product photos, posters, portraits, UI concepts, ads and social graphics.',
      'The first 18 GPT image prompt examples are rendered server-side for fast scanning. Open any prompt page to copy the GPT image prompt, reuse the reference image or continue the GPT Image 2 prompt workflow inside Vogue AI.',
    ],
    statLabel: 'GPT prompt examples',
    workflowLabel: 'GPT Image 2 prompt workflow',
    sectionHeading: 'GPT image prompt formula for GPT Image 2',
    sectionDescription:
      'Write a GPT image prompt like a compact art-direction brief. A useful GPT image prompt explains what to create, how it should be framed, where it will be used and which details must stay clear.',
    chips: [
      {
        href: '/ai-image-prompt',
        label: 'AI Image Prompt',
        eyebrow: 'Main hub',
      },
      {
        href: '/gpt-image-prompt',
        label: 'GPT Image Prompt',
        eyebrow: 'Current page',
      },
      {
        href: '/nano-banana-prompt',
        label: 'Nano Banana Prompt',
        eyebrow: 'Model prompts',
      },
      {
        href: '/midjourney-prompt',
        label: 'Midjourney Prompt',
        eyebrow: 'Prompt examples',
      },
    ],
    sections: [
      {
        heading: 'Subject and commercial goal',
        body: 'Start the GPT image prompt with the product, person, screen, poster or scene, then add the use case. A GPT image prompt for ecommerce images, ad creatives, UI mockups, campaign visuals or social posts should make the final output format clear.',
      },
      {
        heading: 'Camera, layout and lighting',
        body: 'Specify the camera angle, background, composition, lighting, text placement and visual hierarchy when GPT Image 2 needs to produce a clean commercial result instead of a generic image.',
      },
      {
        heading: 'Reference image and constraints',
        body: 'Use the example image as a reference when composition matters. A GPT image prompt with a reference image should add limits such as clean background, no extra text, preserve product shape or keep the subject centered.',
      },
    ],
    faq: [
      {
        question: 'How do I write a GPT Image 2 prompt for product photos or ads?',
        answer:
          'Write it like a concise art-direction brief: name the product or subject, define the ad or ecommerce use case, specify the setting, camera angle, lighting, background, layout and final format. GPT Image 2 usually responds well to clear commercial language rather than a loose style keyword list.',
      },
      {
        question: 'How do I make GPT Image 2 follow layout, text placement and product details?',
        answer:
          'Put layout-critical details near the start of the GPT image prompt. Say where the product sits, how much empty space is needed, whether text should appear, which product shape or label must be preserved, and what the image should avoid, such as extra captions, distorted packaging or busy backgrounds.',
      },
      {
        question: 'Can I copy these GPT Image 2 prompts and edit them?',
        answer:
          'Yes. Open a prompt page, copy the structure, then replace the product, person, scene, brand tone, colors and final use case. Keep the parts that control composition, lighting and visual hierarchy if the example image already matches the direction you want.',
      },
      {
        question: 'When should I use a reference image with a GPT Image 2 prompt?',
        answer:
          'Use a reference image when product angle, pose, room layout, character identity, UI structure or visual mood matters. In the prompt, separate what should stay fixed from what should change so the model does not treat the reference as both a strict copy and a loose inspiration.',
      },
      {
        question: 'Why does GPT Image 2 generate extra text, wrong labels or messy layouts?',
        answer:
          'The prompt may be asking for typography, labels or UI details without enough constraints. Say no extra text, no fake logos, no distorted labels, keep typography minimal, or leave blank space for copy. For product packaging, describe the label as a visual area instead of asking the model to invent exact wording.',
      },
      {
        question: 'Are GPT Image 2 prompts good for ecommerce, posters and social creatives?',
        answer:
          'Yes. GPT Image 2 prompts are useful for ecommerce hero images, clean product shots, ad concepts, posters, thumbnails, UI mockups and social visuals. Review the final image for brand accuracy, legal constraints, text quality and platform requirements before publishing.',
      },
      {
        question: 'How are GPT Image 2 prompts different from Nano Banana or Midjourney prompts?',
        answer:
          'GPT Image 2 prompts work best as direct visual briefs for commercial images, layouts and clear subject instructions. Nano Banana prompts are often stronger for fast reference-led variation, while Midjourney prompts usually lean more into style, mood, cinematic language and parameters.',
      },
      {
        question: 'Are these GPT Image 2 prompt examples free to browse and use?',
        answer:
          'Yes. You can browse the gallery and open prompt pages for free. Each GPT image prompt can be copied and adapted for your own workflow; generating new images inside Vogue AI may use workspace credits depending on the tool and model you choose.',
      },
    ],
    related: [
      {
        href: '/ai-image-prompt',
        label: 'AI Image Prompt',
        description: 'The AI image prompt library for prompt to image workflows.',
      },
      {
        href: '/meigen-alternative',
        label: 'Meigen Alternative',
        description: 'Find Meigen-style GPT Image prompt examples to copy.',
      },
      {
        href: '/free-ai-image-generator',
        label: 'Free AI Image Generator',
        description: 'Try a no sign-up image generation flow before saving work.',
      },
      {
        href: '/nano-banana-prompt',
        label: 'Nano Banana Prompt',
        description: 'Nano Banana prompt examples for adjacent model ideas.',
      },
      {
        href: '/midjourney-prompt',
        label: 'Midjourney Prompt',
        description: 'Midjourney prompt examples for style exploration.',
      },
    ],
    sitemapPriority: 0.9,
  },
  'nano-banana-prompt': {
    slug: 'nano-banana-prompt',
    path: '/nano-banana-prompt',
    title: 'Free Nano Banana Prompt Examples to Copy | Vogue AI',
    metaDescription:
      'Browse free Nano Banana prompt examples with preview images. Copy prompts for product images, fashion photos, portraits, posters and social visuals.',
    h1: 'Nano Banana Prompt',
    breadcrumbLabel: 'Nano Banana Prompt',
    primaryKeyword: 'nano banana prompt',
    secondaryKeywords: [
      'nano banana prompts',
      'nano banana prompt examples',
      'Nano Banana Pro prompts',
    ],
    modelId: 'nanobanana',
    heroEntryId: 'x-2061289055565062313',
    galleryHeading: 'Nano Banana Prompt',
    galleryDescription:
      'Browse Nano Banana prompt examples, then open a prompt page to copy the prompt or reuse the reference image.',
    intro: [
      'A Nano Banana prompt is useful when you want fast, visually direct prompt examples for product images, fashion photos, posters, portraits and social-ready creative. This Nano Banana prompt page keeps the focus on image-first discovery instead of a long model article.',
      'The first 18 Nano Banana prompt examples are visible immediately. Open a Nano Banana prompt page to copy the prompt structure, use the visual as a reference or adapt the idea for your next Vogue AI generation.',
    ],
    statLabel: 'Nano Banana examples',
    workflowLabel: 'Nano Banana prompt workflow',
    sectionHeading: 'Nano Banana prompt formula for fast visual variations',
    sectionDescription:
      'A useful Nano Banana prompt should make the visual change easy to understand: what to keep, what to replace and what style or scene the new image should follow.',
    chips: [
      {
        href: '/ai-image-prompt',
        label: 'AI Image Prompt',
        eyebrow: 'Main hub',
      },
      {
        href: '/gpt-image-prompt',
        label: 'GPT Image Prompt',
        eyebrow: 'Model prompts',
      },
      {
        href: '/nano-banana-prompt',
        label: 'Nano Banana Prompt',
        eyebrow: 'Current page',
      },
      {
        href: '/midjourney-prompt',
        label: 'Midjourney Prompt',
        eyebrow: 'Prompt examples',
      },
    ],
    sections: [
      {
        heading: 'Reference image control',
        body: 'Say whether the reference controls pose, product angle, face direction, room layout, outfit shape or overall mood. Nano Banana prompt examples are most useful when the edit target is clear.',
      },
      {
        heading: 'Subject and scene swap',
        body: 'Replace the person, product, background, color palette or setting while keeping the useful structure of the original Nano Banana prompt for lighting, framing and composition.',
      },
      {
        heading: 'Consistency and output goal',
        body: 'Add the final use case, such as product image, fashion photo, portrait, poster or social post, so Nano Banana prompt variations stay recognizable and usable.',
      },
    ],
    faq: [
      {
        question: 'How do I write a Nano Banana prompt from a reference image?',
        answer:
          'Start by saying what the reference image should preserve, such as face direction, pose, product angle, outfit shape or room layout. Then describe what should change: background, lighting, style, final use case, color palette or campaign mood. Clear preserve/change language usually works better than a vague transformation request.',
      },
      {
        question: 'How do I keep the same face, pose or product shape in Nano Banana?',
        answer:
          'Use the reference image as the identity or shape source and make that explicit. Ask the model to keep facial structure, pose, product silhouette, package proportions or outfit shape, then limit the change to background, lighting, camera angle or mood. Avoid asking for a total style change and exact identity lock in the same sentence.',
      },
      {
        question: 'Why does Nano Banana change the reference image instead of recreating it?',
        answer:
          'The prompt may not define which parts of the reference are fixed. If the model changes the face, product or pose, rewrite the prompt around fixed details first, then add the creative change second. For example: preserve the same face angle and outfit silhouette, change only the background to a clean studio setup.',
      },
      {
        question: 'Which Nano Banana prompts work best for product photos, portraits and social posts?',
        answer:
          'The strongest Nano Banana prompts are specific about the reference image and the final use case. Product prompts should preserve shape and material, portrait prompts should protect face and pose, and social prompts should define crop, mood, background and feed-ready composition.',
      },
      {
        question: 'Can I copy a Nano Banana prompt and change the subject or background?',
        answer:
          'Yes. Copy the prompt structure, then swap the person, product, location, color palette, background or output goal. Keep the parts that control framing, lighting and composition when the example image already has the visual structure you want.',
      },
      {
        question: 'How do I use Nano Banana prompts for fast visual variations?',
        answer:
          'Keep the same reference and base prompt, then change one variable at a time: background, outfit, lighting, camera distance, season, color palette or ad format. This makes it easier to compare results and keep the useful parts of the original image direction.',
      },
      {
        question: 'Are Nano Banana prompts good for commercial product or fashion images?',
        answer:
          'Yes. Nano Banana prompts can help with product scenes, fashion edits, portraits, social creatives and campaign concepts, especially when you need reference-led iteration. For commercial use, review product accuracy, identity rights, brand rules and platform requirements before publishing.',
      },
      {
        question: 'How are Nano Banana prompts different from GPT Image and Midjourney prompts?',
        answer:
          'Nano Banana prompts are usually best for fast image-first variation and reference-led editing. GPT Image prompts are better for direct commercial art-direction briefs, while Midjourney prompts are more useful for stylized concepts, moodboards, cinematic looks and expressive art direction.',
      },
    ],
    related: [
      {
        href: '/ai-image-prompt',
        label: 'AI Image Prompt',
        description: 'The broader AI image prompt library for prompt to image examples.',
      },
      {
        href: '/gpt-image-prompt',
        label: 'GPT Image Prompt',
        description: 'GPT Image 2 prompt examples for commercial generation.',
      },
      {
        href: '/midjourney-prompt',
        label: 'Midjourney Prompt',
        description: 'Midjourney prompt examples for creative styles.',
      },
    ],
    sitemapPriority: 0.88,
  },
  'midjourney-prompt': {
    slug: 'midjourney-prompt',
    path: '/midjourney-prompt',
    title: 'Free Midjourney Prompt Examples to Copy | Vogue AI',
    metaDescription:
      'Browse free Midjourney prompt examples with preview images. Copy or adapt prompts for posters, characters, product visuals, portraits and cinematic AI images.',
    h1: 'Midjourney Prompt',
    breadcrumbLabel: 'Midjourney Prompt',
    primaryKeyword: 'midjourney prompt',
    secondaryKeywords: [
      'midjourney prompt examples',
      'midjourney prompts',
      'Midjourney image prompts',
    ],
    modelId: 'midjourney',
    heroEntryId: 'x-2059635744591818798',
    galleryHeading: 'Midjourney Prompt',
    galleryDescription:
      'Browse Midjourney prompt examples, then open a prompt page to copy or adapt the prompt structure for your next image.',
    intro: [
      'Midjourney-style prompts are often used for expressive looks, cinematic scenes, character sheets, posters, product concepts and detailed visual art direction. This page collects image-first examples you can inspect, copy and adapt.',
      'The first 18 Midjourney prompt examples are rendered server-side for fast SEO and fast browsing. Open a Midjourney prompt page to study the image, copy the prompt structure or adapt the visual idea for a Vogue AI prompt to image workflow.',
    ],
    statLabel: 'Midjourney examples',
    workflowLabel: 'Midjourney prompt workflow',
    sectionHeading: 'Midjourney prompt structure for reusable visual direction',
    sectionDescription:
      'A strong Midjourney prompt usually combines subject, medium, style, camera language, lighting, mood and optional parameters. Use each example as a structure, not just a sentence to copy.',
    chips: [
      {
        href: '/ai-image-prompt',
        label: 'AI Image Prompt',
        eyebrow: 'Main hub',
      },
      {
        href: '/gpt-image-prompt',
        label: 'GPT Image Prompt',
        eyebrow: 'Model prompts',
      },
      {
        href: '/nano-banana-prompt',
        label: 'Nano Banana Prompt',
        eyebrow: 'Model prompts',
      },
      {
        href: '/midjourney-prompt',
        label: 'Midjourney Prompt',
        eyebrow: 'Current page',
      },
    ],
    sections: [
      {
        heading: 'Subject and style',
        body: 'Start the Midjourney prompt with the main subject, then add the artistic style, medium, era, genre or visual reference that defines the final look.',
      },
      {
        heading: 'Camera and composition',
        body: 'Use framing, lens, angle, lighting and atmosphere to control whether the Midjourney prompt feels cinematic, editorial, graphic, realistic or commercial.',
      },
      {
        heading: 'Parameters and reusable parts',
        body: 'Keep useful aspect-ratio, style and composition language when needed, but remove model-specific parameters if you adapt the Midjourney prompt for another image workflow.',
      },
    ],
    faq: [
      {
        question: 'How do I write a Midjourney prompt for a specific style or scene?',
        answer:
          'Start with the subject and scene, then add the medium, visual style, camera language, lighting, mood and composition. Midjourney-style prompts usually perform better when the style direction is concrete, such as cinematic night portrait, editorial product poster, watercolor travel illustration or graphic novel character board.',
      },
      {
        question: 'How do image prompts, style references and character references change a Midjourney result?',
        answer:
          'Image prompts guide the subject, composition or visual content. Style references push the overall look, color, texture and mood. Character references help with recurring characters or identity cues. The best results come from saying which reference controls which part of the final image.',
      },
      {
        question: 'Which Midjourney parameters should I keep when adapting a prompt?',
        answer:
          'Keep parameters that are tied to the result you want, such as aspect ratio for poster or social formats and style or reference settings for a consistent look. Remove parameters you do not understand when adapting the prompt to another model, and keep the reusable subject, style, lighting and composition language.',
      },
      {
        question: 'Can I copy these Midjourney prompt structures for another image workflow?',
        answer:
          'Yes. Treat them as reusable art-direction structures. Copy the subject, scene, medium, style, lighting and composition language, then remove or rewrite Midjourney-specific parameters if you use the idea in Vogue AI, GPT Image or another prompt to image workflow.',
      },
      {
        question: 'How do I make a Midjourney prompt more cinematic, realistic or editorial?',
        answer:
          'Add concrete camera and production language: lens, framing, angle, lighting source, color grade, set design, wardrobe, material texture and mood. For realism, avoid stacking too many conflicting art styles. For editorial results, define layout, negative space, hierarchy and campaign context.',
      },
      {
        question: 'Why does a Midjourney prompt lose the face, character or brand style I wanted?',
        answer:
          'The prompt may be relying on style words without enough identity or reference guidance. Use a clearer character or image reference, keep the most important identity details early, reduce conflicting style terms, and separate fixed details from creative changes.',
      },
      {
        question: 'Are Midjourney prompts useful for commercial creative, posters and product concepts?',
        answer:
          'Yes. Midjourney prompts are useful for campaign moodboards, cinematic posters, character concepts, cover art, visual styles and product concept exploration. For final commercial use, check brand accuracy, usage rights, typography quality and whether the result needs further production editing.',
      },
      {
        question: 'How are Midjourney prompts different from GPT Image or Nano Banana prompts?',
        answer:
          'Midjourney prompts usually lean into style, mood, cinematic language, references and parameters. GPT Image prompts are more direct for product, UI and ad-oriented instructions. Nano Banana prompts are more useful when you want fast reference-led image variation and edits.',
      },
    ],
    related: [
      {
        href: '/ai-image-prompt',
        label: 'AI Image Prompt',
        description: 'The AI image prompt library for prompt to image workflows.',
      },
      {
        href: '/gpt-image-prompt',
        label: 'GPT Image Prompt',
        description: 'GPT Image 2 prompt examples for direct generation.',
      },
      {
        href: '/nano-banana-prompt',
        label: 'Nano Banana Prompt',
        description: 'Nano Banana prompt examples for image-first reuse.',
      },
    ],
    sitemapPriority: 0.88,
  },
};

export function getPromptSeoLandingPageConfig(
  slug: PromptSeoLandingPageSlug
) {
  return PROMPT_SEO_LANDING_PAGE_CONFIGS[slug];
}

export function createPromptSeoLandingMetadata(
  slug: PromptSeoLandingPageSlug
): Metadata {
  const config = getPromptSeoLandingPageConfig(slug);

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
          alt: `${config.h1} on Vogue AI`,
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
