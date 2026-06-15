import Footer from '@/components/common/Footer';
import VogueGalleryWorkspace from '@/components/prompts/VogueGalleryWorkspace';
import { getPromptImageAssets } from '@/lib/prompt-image-assets';
import {
  type PromptSeoLandingPageSlug,
  getPromptSeoLandingPageConfig,
} from '@/lib/prompt-seo-landing-pages';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import { getVoguePromptImageDimensions } from '@/lib/prompt-image-dimensions';
import {
  getPromptImageVariantSrc,
  isPromptImageVariantSrc,
} from '@/lib/prompt-image-variants';
import {
  getLocalizedIndexablePromptGalleryEntries,
  getPromptEntryById,
  getPromptGalleryCounts,
  getPromptGalleryEntryTotal,
  type VoguePromptEntry,
  type VoguePromptGalleryEntry,
} from '@/lib/prompts';
import {
  ArrowRight,
  ChevronRight,
  Copy,
  MousePointer2,
  Search,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const BASE_URL = 'https://vogueai.net';
const PROMPT_SEO_GALLERY_PAGE_SIZE = 24;
const PROMPT_SEO_GALLERY_MAX_ENTRIES = 96;
const AI_IMAGE_PROMPT_HUB_FEATURED_COUNT = 8;
const AI_IMAGE_PROMPT_HUB_CURATED_COUNT =
  AI_IMAGE_PROMPT_HUB_FEATURED_COUNT + 1;

const AI_IMAGE_PROMPT_MODEL_LIBRARIES = [
  {
    modelId: 'gptimage2',
    href: '/gpt-image-prompt',
    label: 'GPT Image Prompt',
    ctaLabel: 'View more GPT Image prompts',
    description:
      'GPT Image 2 prompt examples for product shots, UI concepts, posters and commercial image generation.',
  },
  {
    modelId: 'nanobanana',
    href: '/nano-banana-prompt',
    label: 'Nano Banana Prompt',
    ctaLabel: 'View more Nano Banana prompts',
    description:
      'Nano Banana prompt examples for fast visual iteration, character scenes and reference-led image ideas.',
  },
  {
    modelId: 'midjourney',
    href: '/midjourney-prompt',
    label: 'Midjourney Prompt',
    ctaLabel: 'View more Midjourney prompts',
    description:
      'Midjourney prompt examples for stylized concepts, editorial scenes and visual exploration.',
  },
];

const AI_IMAGE_PROMPT_TAXONOMY = [
  {
    label: 'Use cases',
    items: [
      { label: 'Product', href: '/?category=product' },
      { label: 'Brand / Ads', href: '/?category=brandAds' },
      { label: 'Poster', href: '/?category=poster' },
      { label: 'Portrait', href: '/?category=portrait' },
      { label: 'Fashion', href: '/?category=fashion' },
      { label: 'Social', href: '/?category=social' },
      { label: 'UI', href: '/?category=ui' },
      { label: 'Infographic', href: '/?category=diagram' },
    ],
  },
  {
    label: 'Styles',
    items: [
      { label: 'Photo', href: '/?category=photo' },
      { label: 'Editorial', href: '/?category=photo' },
      { label: 'Anime', href: '/?category=anime' },
      { label: 'Illustration', href: '/?category=art' },
      { label: '3D', href: '/?category=art' },
      { label: 'Watercolor', href: '/?category=poster' },
    ],
  },
  {
    label: 'Models',
    items: [
      { label: 'GPT Image', href: '/gpt-image-prompt' },
      { label: 'Nano Banana', href: '/nano-banana-prompt' },
      { label: 'Midjourney', href: '/midjourney-prompt' },
    ],
  },
];

const sectionShellClassName =
  'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
const sectionHeaderClassName = 'mx-auto max-w-3xl text-center';
const sectionEyebrowClassName =
  'text-[12px] font-bold uppercase tracking-normal text-[var(--vogue-accent-strong)]';
const sectionTitleClassName =
  '!text-[28px] !font-semibold !leading-[1.12] tracking-normal text-slate-950 sm:!text-[34px]';
const sectionDescriptionClassName =
  'mt-3 text-[15px] leading-7 text-slate-600 sm:text-base';
const modelSectionHeaderClassName = 'mx-auto max-w-5xl text-center';
const modelSectionDescriptionClassName =
  'mt-3 text-[15px] leading-7 text-slate-600 sm:text-base';
const promptSeoHeroSectionClassName =
  'prompt-seo-hero-section border-b border-[rgba(32,36,45,0.16)] bg-[var(--vogue-page)] px-4 pb-6 pt-4 text-slate-950 sm:px-6 sm:pt-5 lg:px-8';
const promptSeoHeroShellClassName = 'mx-auto max-w-7xl';
const promptSeoHeroBreadcrumbClassName =
  'prompt-seo-hero-breadcrumb mb-4 flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-500';
const promptSeoHeroGridClassName =
  'prompt-seo-hero-grid grid gap-6 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-center lg:py-7';
const promptSeoHeroPillClassName =
  'prompt-seo-hero-pill inline-flex items-center gap-2 rounded-full border border-[rgba(32,36,45,0.14)] bg-white/76 px-3 py-1.5 text-[12px] font-bold text-slate-600 shadow-[0_10px_24px_rgba(72,55,44,0.05)]';
const promptSeoHeroDotClassName =
  'h-1.5 w-1.5 rounded-full bg-[var(--vogue-accent-strong)]';
const promptSeoHeroTitleClassName =
  'prompt-seo-hero-title mt-4 max-w-4xl whitespace-normal break-words !text-[34px] !font-black !leading-[0.98] tracking-normal text-slate-950 [overflow-wrap:anywhere] sm:!text-[52px] lg:!text-[64px]';
const promptSeoHeroDescriptionClassName =
  'prompt-seo-hero-description mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:text-base';
const promptSeoHeroStatsClassName =
  'prompt-seo-hero-stats mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-slate-600';
const promptSeoHeroImageLinkClassName =
  'prompt-seo-hero-image-link group relative block w-full max-w-[380px] overflow-hidden rounded-[22px] border border-[rgba(72,55,44,0.14)] bg-white/72 p-2 shadow-[0_18px_46px_rgba(72,55,44,0.1)] backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_56px_rgba(72,55,44,0.14)] lg:justify-self-end';
const promptSeoHeroImageFrameClassName =
  'relative aspect-[16/11] overflow-hidden rounded-[18px] bg-slate-100';
const promptSeoGridBackground = {
  backgroundImage:
    'linear-gradient(rgba(72,55,44,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(72,55,44,0.03) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
};

const renderPromptSeoTitle = (title: string) => {
  const promptIndex = title.toLowerCase().indexOf('prompt');

  if (promptIndex < 0) return title;

  const beforePrompt = title.slice(0, promptIndex);
  const promptWord = title.slice(promptIndex, promptIndex + 'prompt'.length);
  const afterPrompt = title.slice(promptIndex + 'prompt'.length);

  return (
    <>
      {beforePrompt}
      <span className="text-[var(--vogue-accent-strong)]">{promptWord}</span>
      {afterPrompt}
    </>
  );
};

const modelPromptUseCaseCopy: Record<
  Exclude<PromptSeoLandingPageSlug, 'ai-image-prompt'>,
  {
    heading: string;
    description: string;
    popularHeading: string;
    popularDescription: string;
    cards: {
      title: string;
      body: string;
    }[];
  }
> = {
  'gpt-image-prompt': {
    heading: 'GPT image prompt use cases',
    description:
      'Start with a GPT image prompt use case, then open a matching example and adapt the structure.',
    popularHeading: 'Popular GPT image prompts to copy',
    popularDescription:
      'Each GPT image prompt example links to the finished image, full prompt and reference workflow.',
    cards: [
      {
        title: 'Product photos and ecommerce mockups',
        body: 'Use these examples for clean product shots, packaging scenes, hero images and ad-ready commercial layouts.',
      },
      {
        title: 'Posters, ads and campaign layouts',
        body: 'Find prompt structures for posters, social graphics, thumbnails and brand visuals that need strong composition.',
      },
      {
        title: 'Portraits, UI screens and diagrams',
        body: 'Compare examples for avatars, editorial portraits, interface concepts and information-heavy visual directions.',
      },
    ],
  },
  'nano-banana-prompt': {
    heading: 'Nano Banana prompt use cases',
    description:
      'Choose a Nano Banana prompt use case first, then copy and customize the matching example.',
    popularHeading: 'Popular Nano Banana prompts to copy',
    popularDescription:
      'Open an example to inspect the result, copy the structure and reuse the reference image.',
    cards: [
      {
        title: 'Fast product and fashion variations',
        body: 'Use these examples when you need quick iterations for products, outfits, portraits and social-ready photo ideas.',
      },
      {
        title: 'Reference-led image edits',
        body: 'Start from a finished result when pose, product angle, room layout or visual mood needs to stay recognizable.',
      },
      {
        title: 'Posters, characters and creator visuals',
        body: 'Adapt prompt structures for campaign concepts, stylized portraits, character scenes and feed-ready creative tests.',
      },
    ],
  },
  'midjourney-prompt': {
    heading: 'Midjourney prompt use cases',
    description:
      'Use each Midjourney prompt example to study style, composition and visual direction before adapting the prompt.',
    popularHeading: 'Popular Midjourney prompts to copy',
    popularDescription:
      'Open an example to compare the image, prompt structure and reusable visual direction.',
    cards: [
      {
        title: 'Cinematic scenes and moodboards',
        body: 'Use these examples for expressive lighting, atmosphere, camera language and stylized scene exploration.',
      },
      {
        title: 'Characters, posters and cover art',
        body: 'Find reusable prompt patterns for character concepts, editorial posters, graphic design and campaign art.',
      },
      {
        title: 'Product concepts and visual styles',
        body: 'Adapt the structure for product concepts, fashion looks, illustration styles and polished creative directions.',
      },
    ],
  },
};

const modelHeroScopeCopy: Record<
  Exclude<PromptSeoLandingPageSlug, 'ai-image-prompt'>,
  string
> = {
  'gpt-image-prompt': 'Product, poster, portrait and UI',
  'nano-banana-prompt': 'Product, fashion, portrait and social',
  'midjourney-prompt': 'Poster, character, cinematic and product',
};

const formatPromptCategoryLabel = (categoryKey?: string) => {
  if (!categoryKey) return 'Full prompt';
  if (categoryKey.toLowerCase() === 'ui') return 'UI';

  return categoryKey
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
};

const getPromptSeoThumbnailSrc = (
  entry: Pick<VoguePromptEntry | VoguePromptGalleryEntry, 'id' | 'images'>,
  imageIndex = 0,
  width?: number
) => {
  const imageUrl = entry.images[imageIndex] ?? entry.images[0] ?? null;

  return getPromptImageVariantSrc({
    entryId: entry.id,
    imageIndex,
    imageUrl,
    width,
  });
};

const toPromptSeoGalleryEntry = (
  entry: VoguePromptEntry
): VoguePromptGalleryEntry => {
  const firstImage = entry.images[0];
  const firstImageAsset =
    getPromptImageAssets(firstImage ? [firstImage] : [])[0] ?? null;

  return {
    id: entry.id,
    publicId: entry.publicId,
    seoSlug: entry.seoSlug,
    sourceOrder: entry.sourceOrder,
    title: entry.title,
    sourceTitle: entry.sourceTitle,
    images: firstImage ? [getPromptSeoThumbnailSrc(entry, 0, 768)] : [],
    imageAssets: firstImageAsset ? [firstImageAsset] : [],
    imageCount: entry.images.length,
    imageDimensions: firstImage
      ? getVoguePromptImageDimensions(firstImage)
      : null,
    modelId: entry.modelId,
    authorName: entry.authorName,
    authorHandle: entry.authorHandle,
    publishedLabel: entry.publishedLabel,
    publishedAtMs: entry.publishedAtMs,
    sourceUrl: entry.sourceUrl,
    sourceType: entry.sourceType,
    languages: entry.languages,
    categoryKey: entry.categoryKey,
  };
};

const getPromptSeoPinnedHeroEntry = (
  config: ReturnType<typeof getPromptSeoLandingPageConfig>
) => {
  if (!config.heroEntryId) return null;

  const entry = getPromptEntryById(config.heroEntryId, 'en');
  if (!entry) return null;
  if (config.modelId && entry.modelId !== config.modelId) return null;

  const galleryEntry = toPromptSeoGalleryEntry(entry);

  return isAiImagePromptHubFeaturedEntry(galleryEntry) ? galleryEntry : null;
};

const AI_IMAGE_PROMPT_HUB_EXCLUDED_TITLE_PATTERNS = [
  /codex/i,
  /permission/i,
  /terminal/i,
  /automation/i,
];

const isAiImagePromptHubFeaturedEntry = (entry: VoguePromptGalleryEntry) =>
  !AI_IMAGE_PROMPT_HUB_EXCLUDED_TITLE_PATTERNS.some((pattern) =>
    pattern.test(entry.title)
  );

const findPromptEntryByStableId = (
  entries: VoguePromptGalleryEntry[],
  stableId?: string
) =>
  stableId
    ? entries.find(
        (entry) => entry.id === stableId || entry.publicId === stableId
      )
    : undefined;

const appendUniqueAiImagePromptEntries = (
  target: VoguePromptGalleryEntry[],
  candidates: VoguePromptGalleryEntry[],
  limit: number
) => {
  const selectedIds = new Set(target.map((entry) => entry.id));

  for (const candidate of candidates) {
    if (target.length >= limit) break;
    if (selectedIds.has(candidate.id)) continue;
    if (!isAiImagePromptHubFeaturedEntry(candidate)) continue;

    target.push(candidate);
    selectedIds.add(candidate.id);
  }
};

const getAiImagePromptHubCuratedEntries = () => {
  const groupedEntries = AI_IMAGE_PROMPT_MODEL_LIBRARIES.map((library) =>
    getLocalizedIndexablePromptGalleryEntries('en', {
      limit: 24,
      modelId: library.modelId,
    }).filter(isAiImagePromptHubFeaturedEntry)
  );
  const curatedEntries: VoguePromptGalleryEntry[] = [];
  const maxGroupLength = Math.max(
    0,
    ...groupedEntries.map((entries) => entries.length)
  );

  for (
    let entryIndex = 0;
    entryIndex < maxGroupLength &&
    curatedEntries.length < AI_IMAGE_PROMPT_HUB_CURATED_COUNT;
    entryIndex += 1
  ) {
    for (const entries of groupedEntries) {
      appendUniqueAiImagePromptEntries(
        curatedEntries,
        entries.slice(entryIndex, entryIndex + 1),
        AI_IMAGE_PROMPT_HUB_CURATED_COUNT
      );
    }
  }

  if (curatedEntries.length < AI_IMAGE_PROMPT_HUB_CURATED_COUNT) {
    appendUniqueAiImagePromptEntries(
      curatedEntries,
      getLocalizedIndexablePromptGalleryEntries('en', {
        limit: 48,
      }),
      AI_IMAGE_PROMPT_HUB_CURATED_COUNT
    );
  }

  return curatedEntries;
};

const getAiImagePromptModelPreviewEntries = (
  modelId: string,
  excludedEntryIds: Set<string>
) =>
  getLocalizedIndexablePromptGalleryEntries('en', {
    limit: 24,
    modelId,
  })
    .filter(
      (entry) =>
        isAiImagePromptHubFeaturedEntry(entry) &&
        !excludedEntryIds.has(entry.id)
    )
    .slice(0, 6);

function AiImagePromptPreviewCard({
  entry,
  priority,
}: {
  entry: VoguePromptGalleryEntry;
  priority?: boolean;
}) {
  const imageSrc = getPromptSeoThumbnailSrc(entry, 0, 640);

  return (
    <Link
      href={getPromptPagePath(entry)}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[8px] border border-[rgba(32,36,45,0.24)] bg-[#fffdfb] shadow-[5px_5px_0_rgba(32,36,45,0.08)] transition hover:-translate-y-1 hover:border-slate-950 hover:shadow-[7px_7px_0_rgba(32,36,45,0.16)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[rgba(32,36,45,0.22)] bg-slate-100">
        <Image
          src={imageSrc}
          alt={`${entry.title} prompt example`}
          fill
          unoptimized={isPromptImageVariantSrc(imageSrc)}
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.035]"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
        />
      </div>
      <div className="flex min-h-[82px] flex-1 flex-col justify-between bg-[#fffdfb] p-3.5">
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-tight text-slate-950">
          {entry.title}
        </h3>
        <p className="mt-2 truncate text-[12px] font-medium text-slate-500">
          {entry.authorHandle || entry.authorName || 'Vogue AI'}
        </p>
      </div>
    </Link>
  );
}

function AiImagePromptHubPage({
  config,
  breadcrumbLabel,
  entries,
  jsonLd,
  total,
}: {
  config: ReturnType<typeof getPromptSeoLandingPageConfig>;
  breadcrumbLabel: string;
  entries: VoguePromptGalleryEntry[];
  jsonLd: unknown;
  total: number;
}) {
  const curatedEntries = entries.filter(isAiImagePromptHubFeaturedEntry);
  const heroEntry =
    findPromptEntryByStableId(entries, config.heroEntryId) ??
    getPromptSeoPinnedHeroEntry(config) ??
    curatedEntries[0] ??
    entries[0];
  const heroImageSrc = heroEntry
    ? getPromptSeoThumbnailSrc(heroEntry, 0, 768)
    : '';
  const featuredEntries = curatedEntries
    .filter((entry) => entry.id !== heroEntry?.id)
    .slice(0, AI_IMAGE_PROMPT_HUB_FEATURED_COUNT);
  const reservedEntryIds = new Set(
    [heroEntry, ...featuredEntries]
      .filter((entry): entry is VoguePromptGalleryEntry => Boolean(entry))
      .map((entry) => entry.id)
  );
  const modelLibraries = AI_IMAGE_PROMPT_MODEL_LIBRARIES.map((library) => ({
    ...library,
    total: getPromptGalleryEntryTotal({ modelId: library.modelId }),
    previews: getAiImagePromptModelPreviewEntries(
      library.modelId,
      reservedEntryIds
    ),
  }));
  const workflowSteps = [
    {
      title: 'Choose a finished image',
      body: 'Start from a curated visual prompt example instead of a blank text box.',
      icon: Search,
    },
    {
      title: 'Open the prompt page',
      body: 'Inspect the image, model label and prompt structure on the canonical prompt URL.',
      icon: MousePointer2,
    },
    {
      title: 'Copy or use as reference',
      body: 'Copy the prompt, use the image as a reference, or continue the prompt to image workflow in Vogue AI.',
      icon: Copy,
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[var(--vogue-page)] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="min-w-0">
        <section
          className={promptSeoHeroSectionClassName}
          style={promptSeoGridBackground}
        >
          <div className={promptSeoHeroShellClassName}>
            <nav
              aria-label="Breadcrumb"
              className={promptSeoHeroBreadcrumbClassName}
            >
              <Link href="/" className="transition hover:text-slate-950">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="text-slate-900">{breadcrumbLabel}</span>
            </nav>

            <div className={promptSeoHeroGridClassName}>
              <div className="min-w-0">
                <div className={promptSeoHeroPillClassName}>
                  <span className={promptSeoHeroDotClassName} />
                  Image prompt gallery · Fresh picks · Copy-ready
                </div>
                <h1 className={promptSeoHeroTitleClassName}>
                  {renderPromptSeoTitle(config.h1)}
                </h1>
                <p className={promptSeoHeroDescriptionClassName}>
                  {config.intro[0]}
                </p>
                <div className={promptSeoHeroStatsClassName}>
                  <span>{total} examples</span>
                  <span>Product, poster, portrait and UI</span>
                  <span>Copy prompt or use as reference</span>
                </div>
              </div>

              {heroEntry ? (
                <Link
                  href={getPromptPagePath(heroEntry)}
                  aria-label={`Open ${heroEntry.title} prompt`}
                  className={promptSeoHeroImageLinkClassName}
                >
                  <div className={promptSeoHeroImageFrameClassName}>
                    <Image
                      src={heroImageSrc}
                      alt={`${heroEntry.title} featured prompt example`}
                      fill
                      unoptimized={isPromptImageVariantSrc(heroImageSrc)}
                      priority
                      sizes="(min-width: 1024px) 520px, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.035]"
                    />
                  </div>
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="prompt-seo-taxonomy-strip border-b border-[rgba(32,36,45,0.22)] bg-[#fffaf7] px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-3">
            {AI_IMAGE_PROMPT_TAXONOMY.map((group) => (
              <div
                key={group.label}
                className="grid min-w-0 gap-2 sm:grid-cols-[86px_minmax(0,1fr)] sm:items-center"
              >
                <span className="text-[13px] font-bold text-[var(--vogue-accent-strong)]">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Link
                      key={`${group.label}-${item.label}`}
                      href={item.href}
                      className="inline-flex h-8 shrink-0 items-center rounded-full border border-[rgba(32,36,45,0.22)] bg-white/72 px-3 text-[12px] font-semibold text-slate-700 transition hover:border-slate-950 hover:bg-white hover:text-slate-950"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[var(--vogue-page)] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={sectionEyebrowClassName}>This week's picks</p>
                <h2 className={sectionTitleClassName}>
                  Featured AI image prompts
                </h2>
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
                  A small curated set of visual prompt examples. For the full
                  masonry gallery, go back to the Vogue AI homepage.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex h-11 w-fit items-center rounded-full bg-slate-950 px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Explore full gallery
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {featuredEntries.map((entry) => (
                <AiImagePromptPreviewCard
                  key={entry.id}
                  entry={entry}
                  priority={false}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf7] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className="grid gap-12">
              {modelLibraries.map((library) => (
                <section key={library.href}>
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-[28px] font-semibold leading-tight text-slate-950 sm:text-[34px]">
                        {library.label}
                      </h3>
                    </div>
                    <Link
                      href={library.href}
                      className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-[rgba(32,36,45,0.16)] bg-white px-4 text-[13px] font-semibold text-slate-950 shadow-[0_10px_24px_rgba(72,55,44,0.06)] transition hover:-translate-y-0.5 hover:border-slate-950"
                    >
                      {library.ctaLabel}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="mb-5 max-w-3xl text-[14px] leading-6 text-slate-600">
                    {library.description}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {library.previews.map((entry) => (
                      <AiImagePromptPreviewCard
                        key={`${library.href}-${entry.id}`}
                        entry={entry}
                        priority={false}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--vogue-page)] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className={sectionHeaderClassName}>
              <h2 className={sectionTitleClassName}>
                Use an AI image prompt in three steps
              </h2>
              <p className={sectionDescriptionClassName}>{config.intro[1]}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {workflowSteps.map((step, index) => {
                const StepIcon = step.icon;

                return (
                  <article
                    key={step.title}
                    className="rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white/76 p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)]"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[rgba(79,103,255,0.16)] bg-[#eef5ff] text-[var(--vogue-accent-strong)]">
                      <StepIcon className="h-4.5 w-4.5" />
                    </div>
                    <p className="mt-5 text-[13px] font-bold uppercase text-slate-400">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-1 text-[18px] font-semibold leading-tight text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-7 text-slate-600">
                      {step.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf7] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className={sectionHeaderClassName}>
              <h2 className={sectionTitleClassName}>
                {config.sectionHeading}
              </h2>
              <p className={sectionDescriptionClassName}>
                {config.sectionDescription}
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {config.sections.map((section) => (
                <article
                  key={section.heading}
                  className="rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)]"
                >
                  <h3 className="text-[18px] font-semibold leading-tight text-slate-950">
                    {section.heading}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-slate-600">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--vogue-page)] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className="mx-auto max-w-5xl text-center">
              <h2 className={sectionTitleClassName}>
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-slate-600 sm:text-base lg:whitespace-nowrap">
                Practical answers for writing, adapting and reusing AI image prompts across prompt to image workflows and model-specific prompt pages.
              </p>
            </div>

            <div className="mx-auto mt-8 grid max-w-4xl gap-3">
              {config.faq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white/76 px-5 py-4 shadow-[0_14px_36px_rgba(72,55,44,0.04)] open:border-[rgba(79,103,255,0.18)]"
                >
                  <summary className="cursor-pointer list-none text-[16px] font-semibold leading-6 text-slate-950 marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf7] px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-slate-950 px-5 py-10 text-center text-white shadow-[0_22px_54px_rgba(47,35,28,0.16)] sm:px-8 sm:py-12">
            <p className="text-[12px] font-bold uppercase text-white/60">
              Browse more prompts
            </p>
            <h2 className="mx-auto mt-2 max-w-3xl !text-[30px] !font-semibold !leading-[1.1] tracking-normal text-white sm:!text-[42px]">
              Need more AI image prompt examples?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-white/68">
              The homepage keeps the full prompt gallery. Use it when you want
              more categories, more images and more prompt directions.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center rounded-full bg-white px-5 text-[14px] font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Explore full gallery
              </Link>
              <Link
                href="/app"
                className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Open workspace
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div className="[&>footer]:!bg-[var(--vogue-page)] [&>footer]:!bg-none">
        <Footer />
      </div>
    </div>
  );
}

function createJsonLd({
  entries,
  slug,
  total,
}: {
  entries: VoguePromptGalleryEntry[];
  slug: PromptSeoLandingPageSlug;
  total: number;
}) {
  const config = getPromptSeoLandingPageConfig(slug);
  const breadcrumbLabel = config.breadcrumbLabel ?? config.h1;
  const pageUrl = `${BASE_URL}${config.path}`;
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.galleryHeading,
    numberOfItems: total,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}${getPromptPagePath(entry)}`,
      item: {
        '@type': 'CreativeWork',
        name: `${entry.title} prompt example`,
        url: `${BASE_URL}${getPromptPagePath(entry)}`,
        image: entry.images[0],
        genre: entry.categoryKey,
      },
    })),
  };

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: breadcrumbLabel,
          item: pageUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: config.h1,
      url: pageUrl,
      description: config.metaDescription,
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Vogue AI',
        url: BASE_URL,
      },
      mainEntity: itemList,
    },
    itemList,
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: config.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];
}

export default function PromptSeoLandingPage({
  slug,
}: {
  slug: PromptSeoLandingPageSlug;
}) {
  const config = getPromptSeoLandingPageConfig(slug);
  const breadcrumbLabel = config.breadcrumbLabel ?? config.h1;
  const galleryFetchLimit =
    slug === 'ai-image-prompt'
      ? AI_IMAGE_PROMPT_HUB_CURATED_COUNT
      : PROMPT_SEO_GALLERY_MAX_ENTRIES + 24;
  const galleryOptions = {
    limit: galleryFetchLimit,
    modelId: config.modelId,
  };
  const entries =
    slug === 'ai-image-prompt'
      ? getAiImagePromptHubCuratedEntries()
      : getLocalizedIndexablePromptGalleryEntries('en', galleryOptions)
          .filter(isAiImagePromptHubFeaturedEntry)
          .slice(0, PROMPT_SEO_GALLERY_MAX_ENTRIES);
  const total = getPromptGalleryEntryTotal(
    config.modelId ? { modelId: config.modelId } : {}
  );
  const jsonLd = createJsonLd({ entries, slug, total });
  if (slug === 'ai-image-prompt') {
    return (
      <AiImagePromptHubPage
        config={config}
        breadcrumbLabel={breadcrumbLabel}
        entries={entries}
        jsonLd={jsonLd}
        total={total}
      />
    );
  }

  const counts = getPromptGalleryCounts(
    config.modelId ? { modelId: config.modelId } : {}
  );
  const workflowSteps = [
    {
      title: 'Find a tested visual direction',
      body: `Scan curated ${config.primaryKeyword} examples and choose the image style closest to your goal.`,
      icon: Search,
    },
    {
      title: 'Open the prompt page',
      body: `Each gallery item links to a full prompt page with the finished image, prompt text and reference workflow.`,
      icon: MousePointer2,
    },
    {
      title: 'Copy or use as reference',
      body: `Copy the ${config.primaryKeyword}, reuse the reference image, or continue generation inside Vogue AI.`,
      icon: Copy,
    },
  ];
  const modelUseCaseCopy =
    modelPromptUseCaseCopy[slug as Exclude<
      PromptSeoLandingPageSlug,
      'ai-image-prompt'
    >];
  const modelHeroScope =
    modelHeroScopeCopy[
      slug as Exclude<PromptSeoLandingPageSlug, 'ai-image-prompt'>
    ];
  const modelHeroPillLabel = `${breadcrumbLabel} · Fresh picks · Copy-ready`;
  const modelHeroEntry =
    findPromptEntryByStableId(entries, config.heroEntryId) ??
    getPromptSeoPinnedHeroEntry(config) ??
    entries.find(isAiImagePromptHubFeaturedEntry) ??
    entries[0];
  const modelHeroImageSrc = modelHeroEntry
    ? getPromptSeoThumbnailSrc(modelHeroEntry, 0, 768)
    : '';

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[var(--vogue-page)] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="min-w-0">
        <section
          className={promptSeoHeroSectionClassName}
          style={promptSeoGridBackground}
        >
          <div className={promptSeoHeroShellClassName}>
            <nav
              aria-label="Breadcrumb"
              className={promptSeoHeroBreadcrumbClassName}
            >
              <Link href="/" className="transition hover:text-slate-950">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="text-slate-900">{breadcrumbLabel}</span>
            </nav>

            <div className={promptSeoHeroGridClassName}>
              <div className="min-w-0">
                <div className={promptSeoHeroPillClassName}>
                  <span className={promptSeoHeroDotClassName} />
                  {modelHeroPillLabel}
                </div>
                <h1 className={promptSeoHeroTitleClassName}>
                  {renderPromptSeoTitle(config.h1)}
                </h1>
                <p className={promptSeoHeroDescriptionClassName}>
                  {config.intro[0]}
                </p>
                <div className={promptSeoHeroStatsClassName}>
                  <span>
                    {total} {config.statLabel}
                  </span>
                  <span>{modelHeroScope}</span>
                  <span>Copy prompt or use as reference</span>
                </div>

                <nav
                  aria-label="Prompt library pages"
                  className="prompt-seo-taxonomy-strip mt-5 flex min-w-0 flex-wrap gap-2"
                >
                  {config.chips.map((chip) => {
                    const active = chip.href === config.path;
                    const mobileLabel = chip.label.replace(' Prompt', '');

                    return (
                      <Link
                        key={chip.href}
                        href={chip.href}
                        className={`inline-flex h-8 min-w-0 shrink-0 items-center justify-center rounded-full border px-3 text-center text-[12px] font-semibold transition hover:-translate-y-0.5 ${
                          active
                            ? 'border-slate-950 bg-slate-950 text-white shadow-[0_10px_24px_rgba(47,35,28,0.14)]'
                            : 'border-[rgba(32,36,45,0.22)] bg-white/72 text-slate-700 hover:border-slate-950 hover:bg-white hover:text-slate-950'
                        }`}
                      >
                        <span className="truncate sm:hidden">{mobileLabel}</span>
                        <span className="hidden sm:inline">{chip.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {modelHeroEntry ? (
                <Link
                  href={getPromptPagePath(modelHeroEntry)}
                  aria-label={`Open ${modelHeroEntry.title} prompt`}
                  className={promptSeoHeroImageLinkClassName}
                >
                  <div className={promptSeoHeroImageFrameClassName}>
                    <Image
                      src={modelHeroImageSrc}
                      alt={`${modelHeroEntry.title} ${config.primaryKeyword} example`}
                      fill
                      unoptimized={isPromptImageVariantSrc(modelHeroImageSrc)}
                      priority
                      sizes="(min-width: 1024px) 520px, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.035]"
                    />
                  </div>
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <VogueGalleryWorkspace
          entries={entries}
          counts={counts}
          pageSize={PROMPT_SEO_GALLERY_PAGE_SIZE}
          maxEntries={entries.length}
          maxEntriesCta={{
            href: '/',
            label: 'More prompts',
            description: `This page shows curated ${config.primaryKeyword} examples. Explore the full Vogue AI prompt gallery for more images, categories and prompt ideas.`,
          }}
          heading={config.galleryHeading}
          description={config.galleryDescription}
          initialModel={config.modelId ?? 'all'}
          initialScenario="all"
          lockedModelId={config.modelId}
          headingLevel="h2"
          imageAltSuffix="prompt example"
          surfaceStyle={promptSeoGridBackground}
        />

        <section className="bg-[#fffaf7] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className={modelSectionHeaderClassName}>
              <h2 className={sectionTitleClassName}>
                Find and use {config.primaryKeyword} in three steps
              </h2>
              <p className={modelSectionDescriptionClassName}>
                Move from a finished image to a reusable prompt in three quick
                steps.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {workflowSteps.map((step, index) => {
                const StepIcon = step.icon;

                return (
                  <article
                    key={step.title}
                    className="rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)]"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[rgba(79,103,255,0.16)] bg-[#eef5ff] text-[var(--vogue-accent-strong)]">
                      <StepIcon className="h-4.5 w-4.5" />
                    </div>
                    <p className="mt-5 text-[13px] font-bold uppercase text-slate-400">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-1 text-[18px] font-semibold leading-tight text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-6 text-slate-600">
                      {step.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[var(--vogue-page)] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className={modelSectionHeaderClassName}>
              <h2 className={sectionTitleClassName}>
                {config.sectionHeading}
              </h2>
              <p className={modelSectionDescriptionClassName}>
                {config.sectionDescription}
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {config.sections.map((section) => (
                <article
                  key={section.heading}
                  className="rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white/76 p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)]"
                >
                  <h3 className="text-[18px] font-semibold leading-tight text-slate-950">
                    {section.heading}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-slate-600">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf7] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className={modelSectionHeaderClassName}>
              <h2 className={sectionTitleClassName}>
                {modelUseCaseCopy.heading}
              </h2>
              <p className={modelSectionDescriptionClassName}>
                {modelUseCaseCopy.description}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {modelUseCaseCopy.cards.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)]"
                >
                  <h3 className="text-[18px] font-semibold leading-tight text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-slate-600">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--vogue-page)] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className={modelSectionHeaderClassName}>
              <h2 className={sectionTitleClassName}>
                {modelUseCaseCopy.popularHeading}
              </h2>
              <p className={modelSectionDescriptionClassName}>
                {modelUseCaseCopy.popularDescription}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entries.slice(0, 6).map((entry) => (
                <Link
                  key={entry.id}
                  href={getPromptPagePath(entry)}
                  className="group rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white/76 px-4 py-3 transition hover:-translate-y-0.5 hover:border-[rgba(79,103,255,0.22)] hover:bg-white"
                >
                  <p className="line-clamp-1 text-[15px] font-semibold text-slate-950">
                    {entry.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-slate-500">
                    {config.primaryKeyword} example with full prompt and
                    reference image
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf7] py-14 sm:py-16">
          <div className={sectionShellClassName}>
            <div className={modelSectionHeaderClassName}>
              <h2 className={sectionTitleClassName}>
                Frequently asked questions
              </h2>
            </div>

            <div className="mx-auto mt-8 grid max-w-4xl gap-3">
              {config.faq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white px-5 py-4 shadow-[0_14px_36px_rgba(72,55,44,0.04)] open:border-[rgba(79,103,255,0.18)]"
                >
                  <summary className="cursor-pointer list-none text-[16px] font-semibold leading-6 text-slate-950 marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--vogue-page)] px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-slate-950 px-5 py-10 text-center text-white shadow-[0_22px_54px_rgba(47,35,28,0.16)] sm:px-8 sm:py-12">
            <h2 className="mx-auto max-w-3xl !text-[30px] !font-semibold !leading-[1.1] tracking-normal text-white sm:!text-[42px]">
              Open the gallery, copy a {config.primaryKeyword}, and generate in
              Vogue AI.
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="#vogue-prompt-gallery-heading"
                className="inline-flex h-11 items-center rounded-full bg-white px-5 text-[14px] font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Browse prompts
              </Link>
              <Link
                href="/app"
                className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Open workspace
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div className="[&>footer]:!bg-[var(--vogue-page)] [&>footer]:!bg-none">
        <Footer />
      </div>
    </div>
  );
}
