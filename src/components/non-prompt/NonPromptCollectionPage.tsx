import Footer from '@/components/common/Footer';
import type { NonPromptCollectionConfig } from '@/lib/non-prompt-collections';
import {
  getNonPromptPageConfig,
  type NonPromptPageConfig,
} from '@/lib/non-prompt-pages';
import {
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

type NonPromptCollectionPageProps = {
  config: NonPromptCollectionConfig;
};

type CollectionCardMedia = {
  kind: 'image' | 'video';
  variant: string;
  posterSrc?: string;
  videoSrc?: string;
};

const collectionCardMedia: Record<string, CollectionCardMedia> = {
  'earth-zoom': {
    kind: 'video',
    variant: 'earth',
  },
  'ai-baby-generator': {
    kind: 'image',
    variant: 'baby',
  },
  'ai-baby-podcast': {
    kind: 'video',
    variant: 'podcast',
  },
  lipsync: {
    kind: 'video',
    variant: 'lipsync',
  },
  'hailuo-ai-video-generator': {
    kind: 'video',
    variant: 'hailuo',
  },
  seedance: {
    kind: 'video',
    variant: 'seedance',
  },
  'veo-3-generator': {
    kind: 'video',
    variant: 'veo',
  },
};

const collectionCardTitles: Record<string, string> = {
  'earth-zoom': 'Earth Zoom Out',
  'ai-baby-generator': 'AI Baby Generator',
  'ai-baby-podcast': 'AI Baby Podcast',
  lipsync: 'LipSync',
  'hailuo-ai-video-generator': 'Hailuo AI',
  seedance: 'Seedance',
  'veo-3-generator': 'Veo 3',
};

function getArtworkClassName(variant: string) {
  switch (variant) {
    case 'baby':
      return 'bg-[linear-gradient(135deg,#fff4eb_0%,#e8bca8_38%,#8ca1ad_72%,#172033_100%)]';
    case 'podcast':
      return 'bg-[linear-gradient(135deg,#fff2e8_0%,#d6a987_36%,#5b6574_70%,#101827_100%)]';
    case 'lipsync':
      return 'bg-[linear-gradient(135deg,#f8fafc_0%,#d9e4ec_34%,#8d9aa6_70%,#151515_100%)]';
    case 'seedance':
      return 'bg-[linear-gradient(135deg,#f7dfaa_0%,#819b8b_42%,#25334a_100%)]';
    case 'hailuo':
      return 'bg-[linear-gradient(135deg,#dbeafe_0%,#8ba8ae_42%,#1b293d_100%)]';
    case 'veo':
      return 'bg-[linear-gradient(135deg,#f4efe5_0%,#9baabd_42%,#101725_100%)]';
    case 'earth':
    default:
      return 'bg-[linear-gradient(135deg,#eef8f5_0%,#a6cbc1_38%,#597381_66%,#0f1a2d_100%)]';
  }
}

function Artwork({ posterSrc, variant, videoSrc }: CollectionCardMedia) {
  const mediaStyle = posterSrc
    ? {
        backgroundImage: `url(${posterSrc})`,
      }
    : undefined;

  return (
    <div
      className={[
        'relative h-full overflow-hidden bg-cover bg-center',
        posterSrc || videoSrc ? 'bg-slate-100' : getArtworkClassName(variant),
      ].join(' ')}
      style={mediaStyle}
      aria-hidden="true"
    >
      {videoSrc ? (
        <video
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}
      {!posterSrc && !videoSrc ? (
        <>
          <div className="absolute left-[10%] top-[10%] h-[42%] w-[80%] rounded-[7px] border border-white/28 bg-white/15 shadow-[0_20px_42px_rgba(15,23,42,0.14)]" />
          <div className="absolute left-[17%] top-[18%] h-[20%] w-[34%] rounded-[6px] bg-white/22" />
          <div className="absolute right-[14%] top-[18%] h-[30%] w-[25%] rounded-[6px] border border-white/24 bg-white/12" />
          <div className="absolute bottom-[27%] left-[12%] h-px w-[76%] bg-white/36" />
          <div className="absolute bottom-[22%] left-[18%] h-px w-[55%] bg-white/24" />
          <div className="absolute inset-x-[12%] bottom-[11%] h-[8%] rounded-[999px] bg-white/18" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),transparent_38%,rgba(15,23,42,0.18)_100%)]" />
        </>
      ) : null}
    </div>
  );
}

function VisualRouteCard({ tool }: { tool: NonPromptPageConfig }) {
  const media =
    collectionCardMedia[tool.slug] ??
    ({
      kind: 'image',
      variant: tool.workspace.previewVariant,
    } satisfies CollectionCardMedia);
  const title = collectionCardTitles[tool.slug] ?? tool.label;

  return (
    <Link
      href={tool.path}
      className="group flex min-w-0 flex-col overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white shadow-[0_12px_28px_rgba(72,55,44,0.055)] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(72,55,44,0.24)] hover:shadow-[0_18px_40px_rgba(72,55,44,0.09)]"
      aria-label={`Open ${title}`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Artwork {...media} />
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-[6px] border border-white/38 bg-white/84 text-slate-900 opacity-0 shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition group-hover:opacity-100">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="flex h-[58px] shrink-0 items-center justify-center border-t border-[rgba(72,55,44,0.1)] bg-[rgba(255,253,251,0.96)] px-2.5 text-center">
        <h2 className="line-clamp-2 !text-[13px] !font-semibold !leading-[1.18] text-slate-950">
          {title}
        </h2>
      </div>
    </Link>
  );
}

function JsonLd({
  config,
  tools,
}: {
  config: NonPromptCollectionConfig;
  tools: NonPromptPageConfig[];
}) {
  const itemListData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.label,
    url: `https://vogueai.net${config.path}`,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://vogueai.net${tool.path}`,
      name: tool.label,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListData) }}
    />
  );
}

export default function NonPromptCollectionPage({
  config,
}: NonPromptCollectionPageProps) {
  const tools = config.items.map((slug) => getNonPromptPageConfig(slug));

  return (
    <div className="vogue-marketing-light min-h-screen bg-[var(--vogue-page)] !bg-none text-slate-950">
      <JsonLd config={config} tools={tools} />
      <main>
        <section className="bg-[var(--vogue-page)] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-[1500px]">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-500"
            >
              <Link href="/" className="transition hover:text-slate-950">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="text-slate-900">{config.label}</span>
            </nav>

            <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
              <div>
                <h1 className="max-w-3xl !text-[30px] !font-semibold !leading-[1.08] text-slate-950 sm:!text-[34px]">
                  {config.label}
                </h1>
              </div>
              <div className="text-sm font-semibold text-slate-400">
                {tools.length} templates
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
              {tools.map((tool) => (
                <VisualRouteCard key={tool.slug} tool={tool} />
              ))}
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
