import GeneratedAssetsGallery from '@/components/assets/GeneratedAssetsGallery';
import { getVogueCopyFromMessages } from '@/i18n/vogue';
import { loadGeneratedWorkspaceFeed } from '@/lib/app/generated-workspace-feed';
import { getSession } from '@/lib/server';
import { getLanguageAlternates, getUrlWithLocale } from '@/lib/urls/urls';
import { ArrowLeft, Grid3X3, List, Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';

const DEFAULT_ASSETS_LIMIT = 24;
const ASSETS_PATH = '/assets';

export async function generateAssetsMetadata(locale: string): Promise<Metadata> {
  const copy = getVogueCopyFromMessages(await getMessages({ locale }));

  return {
    title: `${copy.assets.title} - Vogue AI`,
    alternates: {
      canonical: getUrlWithLocale(ASSETS_PATH, locale),
      languages: getLanguageAlternates(ASSETS_PATH),
    },
  };
}

export function generateMetadata(): Promise<Metadata> {
  return generateAssetsMetadata('en');
}

export async function AssetsPageContent({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams: Promise<{ limit?: string }>;
}) {
  const copy = getVogueCopyFromMessages(await getMessages({ locale }));
  const session = await getSession();
  if (!session?.user?.id) {
    redirect(
      `${getUrlWithLocale('/login', locale)}?callbackUrl=${encodeURIComponent(
        getUrlWithLocale(ASSETS_PATH, locale)
      )}`
    );
  }

  const { limit: limitParam } = await searchParams;
  const requestedLimit = Number.parseInt(limitParam ?? '', 10);
  const assetLimit = Number.isFinite(requestedLimit)
    ? Math.max(1, requestedLimit)
    : DEFAULT_ASSETS_LIMIT;

  const items = await loadGeneratedWorkspaceFeed({
    userId: session.user.id,
    limit: assetLimit + 1,
  });
  const hasMore = items.length > assetLimit;
  const visibleItems = hasMore ? items.slice(0, assetLimit) : items;

  return (
    <main className="min-h-screen bg-[linear-gradient(90deg,#f4e8ff_0%,#ffffff_22%,#fff7f4_100%)] p-3 text-slate-950 sm:p-5 lg:p-6">
      <section className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1880px] flex-col overflow-hidden rounded-[28px] bg-white/86 px-5 py-5 shadow-[0_34px_120px_rgba(151,132,190,0.16)] backdrop-blur-xl sm:min-h-[calc(100vh-2.5rem)] sm:rounded-[32px] sm:px-7 sm:py-6 lg:min-h-[calc(100vh-3rem)] lg:rounded-[36px]">
        <header className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5">
            <Link
              href={getUrlWithLocale('/', locale)}
              className="inline-flex shrink-0 items-center gap-2 text-[14px] font-medium text-slate-500 transition hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              {copy.assets.back}
            </Link>
            <h1 className="truncate text-[20px] font-semibold leading-none tracking-normal text-slate-950">
              {copy.assets.title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href={getUrlWithLocale('/app', locale)}
              className="hidden h-10 items-center gap-2 rounded-[14px] border border-slate-200 bg-white/72 px-3 text-[14px] font-medium text-slate-700 shadow-[0_10px_26px_rgba(72,92,130,0.08)] transition hover:bg-white hover:text-slate-950 sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              {copy.assets.new}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              aria-label={copy.assets.listView}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-slate-950 shadow-[0_10px_26px_rgba(72,92,130,0.14)] transition hover:bg-slate-50"
              aria-label={copy.assets.gridView}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 pt-8">
          <GeneratedAssetsGallery
            items={visibleItems}
            currentLimit={assetLimit}
            hasMore={hasMore}
          />
        </div>
      </section>
    </main>
  );
}

export default function AssetsFallbackPage() {
  redirect('/en/assets');
}
