import Footer from '@/components/common/Footer';
import VogueGalleryWorkspace from '@/components/prompts/VogueGalleryWorkspace';
import SeoLandingHeroComposer from '@/components/seo/SeoLandingHeroComposer';
import { getPromptImageAssets } from '@/lib/prompt-image-assets';
import { getVoguePromptImageDimensions } from '@/lib/prompt-image-dimensions';
import {
  getPromptImageVariantSrc,
} from '@/lib/prompt-image-variants';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import {
  getPromptEntryByIdAsync,
  getPromptGalleryCountsAsync,
  type VoguePromptEntry,
  type VoguePromptGalleryEntry,
} from '@/lib/prompts';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Copy,
  Image as ImageIcon,
  Layers3,
  MousePointer2,
  Search,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  WandSparkles,
} from 'lucide-react';
import Link from 'next/link';
import {
  getSeoLandingPageConfig,
  type SeoLandingIconKey,
  type SeoLandingPageConfig,
  type SeoLandingPageSlug,
} from '@/lib/seo-landing-pages';

type VogueSeoLandingPageProps = {
  slug: SeoLandingPageSlug;
};

const BASE_URL = 'https://vogueai.net';

const sectionShellClassName =
  'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
const sectionHeaderClassName = 'mx-auto max-w-4xl text-center';
const sectionTitleClassName =
  'line-clamp-1 !text-[24px] !font-semibold !leading-[1.12] tracking-normal text-slate-950 sm:!text-[32px] lg:!text-[34px]';
const sectionDescriptionClassName =
  'mx-auto mt-3 max-w-3xl line-clamp-1 text-[14px] leading-6 text-slate-600 sm:text-base';
const promptSeoHeroSectionClassName =
  'prompt-seo-hero-section border-b border-[rgba(32,36,45,0.16)] bg-[var(--vogue-page)] px-4 pb-6 pt-4 text-slate-950 sm:px-6 sm:pt-5 lg:px-8';
const promptSeoHeroShellClassName = 'mx-auto max-w-7xl';
const promptSeoHeroBreadcrumbClassName =
  'prompt-seo-hero-breadcrumb mb-4 flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-500';
const promptSeoHeroTitleClassName =
  'seo-landing-hero-title mx-auto mt-4 w-full max-w-7xl text-center !text-[28px] !font-black !leading-[0.98] tracking-normal text-slate-950 sm:!text-[48px] lg:!text-[60px] xl:!text-[64px]';
const promptSeoHeroDescriptionClassName =
  'seo-landing-hero-description mx-auto mt-4 max-w-4xl line-clamp-1 text-[15px] leading-7 text-slate-600 sm:text-base';
const promptSeoHeroStatsClassName =
  'seo-landing-hero-stats mt-5 grid justify-items-center gap-2 text-[13px] font-semibold text-slate-600 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5';
const promptSeoGridBackground = {
  backgroundImage:
    'linear-gradient(rgba(72,55,44,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(72,55,44,0.03) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
};

const getIcon = (key: SeoLandingIconKey, className = 'h-4 w-4') => {
  switch (key) {
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'images':
      return <ImageIcon className={className} />;
    case 'upload':
      return <UploadCloud className={className} />;
    case 'sliders':
      return <SlidersHorizontal className={className} />;
    case 'badge':
      return <BadgeCheck className={className} />;
    case 'search':
      return <Search className={className} />;
    case 'layers':
      return <Layers3 className={className} />;
    case 'wand':
      return <WandSparkles className={className} />;
    case 'check':
      return <CheckCircle2 className={className} />;
  }
};

const getAbsoluteUrl = (path: string) =>
  path.startsWith('http') ? path : `${BASE_URL}${path}`;

const getSeoLandingThumbnailSrc = (
  entry: Pick<VoguePromptEntry | VoguePromptGalleryEntry, 'images'>,
  imageIndex = 0,
  width?: number
) => {
  const imageUrl = entry.images[imageIndex] ?? entry.images[0] ?? null;

  return getPromptImageVariantSrc({
    imageUrl,
    width,
  });
};

const toGalleryEntry = (entry: VoguePromptEntry): VoguePromptGalleryEntry => {
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
    images: firstImage ? [getSeoLandingThumbnailSrc(entry, 0, 768)] : [],
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
    galleryPublishedAt: entry.galleryPublishedAt,
    galleryPublishedAtMs: entry.galleryPublishedAtMs,
    sourceUrl: entry.sourceUrl,
    sourceType: entry.sourceType,
    languages: entry.languages,
    categoryKey: entry.categoryKey,
  };
};

async function getGalleryEntries(config: SeoLandingPageConfig) {
  const entries = await Promise.all(
    config.gallery.entryIds.map((id) => getPromptEntryByIdAsync(id, 'en'))
  );

  return entries
    .filter((entry): entry is VoguePromptEntry => Boolean(entry))
    .map(toGalleryEntry);
}

function buildJsonLd(
  config: SeoLandingPageConfig,
  entries: VoguePromptGalleryEntry[]
) {
  const canonicalUrl = getAbsoluteUrl(config.path);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.gallery.heading,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: getAbsoluteUrl(getPromptPagePath(entry)),
      item: {
        '@type': 'CreativeWork',
        name: entry.title,
        url: getAbsoluteUrl(getPromptPagePath(entry)),
        image: entry.images[0],
      },
    })),
  };
  const page =
    config.schemaType === 'WebApplication'
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: config.h1,
          url: canonicalUrl,
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Web',
          description: config.metaDescription,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: config.featureStrip.map((item) => item.title),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: config.h1,
          url: canonicalUrl,
          description: config.metaDescription,
          isPartOf: {
            '@type': 'WebSite',
            name: 'Vogue AI',
            url: BASE_URL,
          },
          mainEntity: itemList,
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
          name: config.breadcrumbLabel ?? config.h1,
          item: canonicalUrl,
        },
      ],
    },
    page,
    itemList,
  ];
}

function renderTitle(title: string) {
  const highlight = title.includes('Alternative')
    ? 'Alternative'
    : title.includes('Generator')
      ? 'Generator'
      : '';

  if (!highlight) return title;

  const [before, after] = title.split(highlight);

  return (
    <>
      {before}
      <span className="text-[var(--vogue-accent-strong)]">{highlight}</span>
      {after}
    </>
  );
}

function Hero({ config }: { config: SeoLandingPageConfig }) {
  const breadcrumbLabel = config.breadcrumbLabel ?? config.h1;

  return (
    <section
      className={promptSeoHeroSectionClassName}
      style={promptSeoGridBackground}
    >
      <div className={promptSeoHeroShellClassName}>
        <nav aria-label="Breadcrumb" className={promptSeoHeroBreadcrumbClassName}>
          <Link href="/" className="transition hover:text-slate-950">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="text-slate-900">{breadcrumbLabel}</span>
        </nav>

        <div className="mx-auto min-w-0 max-w-7xl py-5 text-center lg:py-8">
          <h1 className={promptSeoHeroTitleClassName}>
            {renderTitle(config.h1)}
          </h1>
          <p className={promptSeoHeroDescriptionClassName}>{config.intro}</p>
          {config.disclaimer ? (
            <p className="mt-3 inline-flex rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white/76 px-3 py-2 text-[12px] font-semibold text-slate-600">
              {config.disclaimer}
            </p>
          ) : null}
          <div className={promptSeoHeroStatsClassName}>
            {config.stats.map((stat) => (
              <span key={stat.label} className="block">
                {stat.value} {stat.label}
              </span>
            ))}
          </div>

          {config.slug === 'meigen-alternative' ? (
            <div className="mt-7 flex justify-center">
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-[8px] bg-slate-950 px-5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Browse full ai prompt gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : null}

          {config.slug === 'free-ai-image-generator' ? (
            <SeoLandingHeroComposer
              placeholder="Describe the image you want Vogue AI to create..."
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FeatureSection({ config }: { config: SeoLandingPageConfig }) {
  return (
    <section className="bg-[#fffaf7] py-14 sm:py-16">
      <div className={sectionShellClassName}>
        <div className={sectionHeaderClassName}>
          <h2 className={sectionTitleClassName}>{config.featureHeading}</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {config.featureStrip.map((item) => (
            <article
              key={item.title}
              className="rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[rgba(79,103,255,0.16)] bg-[#eef5ff] text-[var(--vogue-accent-strong)]">
                {getIcon(item.icon)}
              </div>
              <h3 className="mt-5 text-[17px] font-semibold leading-tight text-slate-950">
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
  );
}

function ComparisonSection({ config }: { config: SeoLandingPageConfig }) {
  return (
    <section className="bg-[var(--vogue-page)] py-14 sm:py-16">
      <div className={sectionShellClassName}>
        <div className={sectionHeaderClassName}>
          <h2 className={sectionTitleClassName}>{config.comparison.heading}</h2>
          <p className={sectionDescriptionClassName}>
            {config.comparison.description}
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white shadow-[0_14px_36px_rgba(72,55,44,0.05)]">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[0.72fr_1fr_1fr] border-b border-[rgba(72,55,44,0.1)] bg-[#fffaf7] text-[12px] font-bold uppercase text-slate-500">
              <div className="px-4 py-3">Decision</div>
              <div className="px-4 py-3">{config.comparison.columns[0]}</div>
              <div className="px-4 py-3">{config.comparison.columns[1]}</div>
            </div>
            {config.comparison.rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[0.72fr_1fr_1fr] border-b border-[rgba(72,55,44,0.08)] last:border-b-0"
              >
                <div className="px-4 py-4 text-[13px] font-semibold text-slate-950">
                  {row.label}
                </div>
                <div className="px-4 py-4 text-[13px] leading-6 text-slate-600">
                  {row.left}
                </div>
                <div className="px-4 py-4 text-[13px] leading-6 text-slate-800">
                  {row.right}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsSection({ config }: { config: SeoLandingPageConfig }) {
  return (
    <section className="bg-[#fffaf7] py-14 sm:py-16">
      <div className={sectionShellClassName}>
        <div className={sectionHeaderClassName}>
          <h2 className={sectionTitleClassName}>{config.steps.heading}</h2>
          <p className={sectionDescriptionClassName}>
            {config.steps.description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {config.steps.items.map((step, index) => {
            const icons = [Search, MousePointer2, Copy, WandSparkles];
            const StepIcon = icons[index] ?? CheckCircle2;

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
                <p className="mt-3 text-[14px] leading-7 text-slate-600">
                  {step.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function UseCasesSection({ config }: { config: SeoLandingPageConfig }) {
  return (
    <section className="bg-[var(--vogue-page)] py-14 sm:py-16">
      <div className={sectionShellClassName}>
        <div className={sectionHeaderClassName}>
          <h2 className={sectionTitleClassName}>{config.useCases.heading}</h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {config.useCases.items.map((item) => (
            <article
              key={item.title}
              className="rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-white/76 p-5 shadow-[0_14px_36px_rgba(72,55,44,0.05)]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[rgba(79,103,255,0.16)] bg-[#eef5ff] text-[var(--vogue-accent-strong)]">
                {getIcon(item.icon)}
              </div>
              <h3 className="mt-5 text-[18px] font-semibold leading-tight text-slate-950">
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
  );
}

function FaqSection({ config }: { config: SeoLandingPageConfig }) {
  return (
    <section className="bg-[#fffaf7] py-14 sm:py-16">
      <div className={sectionShellClassName}>
        <div className={sectionHeaderClassName}>
          <h2 className={sectionTitleClassName}>
            Frequently Asked Questions
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
  );
}

function RelatedSection({ config }: { config: SeoLandingPageConfig }) {
  return (
    <section className="bg-[var(--vogue-page)] px-4 pb-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.1)] bg-slate-950 px-5 py-10 text-center text-white shadow-[0_22px_54px_rgba(47,35,28,0.16)] sm:px-8 sm:py-12">
        <h2 className="mx-auto max-w-3xl !text-[26px] !font-semibold !leading-[1.1] tracking-normal text-white sm:!text-[38px]">
          Browse the full AI prompt gallery.
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-white px-5 text-[14px] font-semibold text-slate-950 transition hover:-translate-y-0.5"
          >
            View gallery
          </Link>
          {config.related.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({
  config,
  entries,
  counts,
}: {
  config: SeoLandingPageConfig;
  entries: VoguePromptGalleryEntry[];
  counts: Awaited<ReturnType<typeof getPromptGalleryCountsAsync>>;
}) {
  return (
    <VogueGalleryWorkspace
      entries={entries}
      counts={counts}
      pageSize={entries.length}
      maxEntries={entries.length}
      maxEntriesCta={
        config.slug === 'meigen-alternative'
          ? {
              href: '/',
              label: 'Browse full ai prompt gallery',
              description:
                'Want the full Vogue AI prompt gallery? Browse the homepage for more AI image prompt ideas.',
            }
          : undefined
      }
      heading={config.gallery.heading}
      description={config.gallery.description}
      initialModel="all"
      initialScenario="all"
      headingLevel="h2"
      imageAltSuffix="prompt example"
      surfaceStyle={promptSeoGridBackground}
      singleLineCardTitles={true}
    />
  );
}

export default async function VogueSeoLandingPage({
  slug,
}: VogueSeoLandingPageProps) {
  const config = getSeoLandingPageConfig(slug);
  const entries = await getGalleryEntries(config);
  const counts = await getPromptGalleryCountsAsync();
  const jsonLd = buildJsonLd(config, entries);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[var(--vogue-page)] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="min-w-0">
        <Hero config={config} />

        {config.slug === 'free-ai-image-generator' ? (
          <>
            <GallerySection config={config} entries={entries} counts={counts} />
            <FeatureSection config={config} />
            <StepsSection config={config} />
            <ComparisonSection config={config} />
            <UseCasesSection config={config} />
          </>
        ) : (
          <>
            <GallerySection config={config} entries={entries} counts={counts} />
            <FeatureSection config={config} />
            <ComparisonSection config={config} />
            <StepsSection config={config} />
            <UseCasesSection config={config} />
          </>
        )}

        <FaqSection config={config} />
        <RelatedSection config={config} />
      </main>
      <div className="[&>footer]:!bg-[var(--vogue-page)] [&>footer]:!bg-none">
        <Footer />
      </div>
    </div>
  );
}
