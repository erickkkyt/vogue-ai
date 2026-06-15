import GeneratedAssetsGallery from '@/components/assets/GeneratedAssetsGallery';
import { getVogueCopyFromMessages } from '@/i18n/vogue';
import { loadGeneratedWorkspaceFeed } from '@/lib/app/generated-workspace-feed';
import { getSession } from '@/lib/server';
import { getLanguageAlternates, getUrlWithLocale } from '@/lib/urls/urls';
import { ArrowLeft } from 'lucide-react';
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
    robots: {
      index: false,
      follow: false,
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
  const ownerName =
    session.user.name?.trim() || session.user.email?.trim() || 'Vogue AI';
  const owner = {
    name: ownerName,
    image: session.user.image ?? null,
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(90deg,#f4e8ff_0%,#ffffff_22%,#fff7f4_100%)] p-3 text-slate-950 sm:p-5 lg:p-6">
      <section className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1880px] flex-col overflow-hidden rounded-[28px] border border-white/78 bg-[linear-gradient(130deg,#f8fbff_0%,#ffffff_48%,#f7f3ff_100%)] px-5 py-5 shadow-[0_24px_90px_rgba(151,132,190,0.12)] backdrop-blur-xl sm:min-h-[calc(100vh-2.5rem)] sm:rounded-[32px] sm:px-7 sm:py-6 lg:min-h-[calc(100vh-3rem)] lg:rounded-[36px]">
        <div className="flex flex-1">
          <GeneratedAssetsGallery
            items={visibleItems}
            currentLimit={assetLimit}
            hasMore={hasMore}
            owner={owner}
          >
            <header className="flex min-w-0 items-center gap-3">
              <Link
                href={getUrlWithLocale('/', locale)}
                aria-label={copy.assets.back}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-slate-500 transition hover:bg-white/72 hover:text-slate-950"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
              <div className="inline-flex min-w-0 flex-col justify-center">
                <h1 className="truncate font-[var(--font-vogue-display)] !text-[18px] !font-semibold !leading-none tracking-normal text-slate-950">
                  {copy.assets.title}
                </h1>
                <span className="mt-1.5 h-px w-full rounded-full bg-slate-950" />
              </div>
            </header>
          </GeneratedAssetsGallery>
        </div>
      </section>
    </main>
  );
}

export default function AssetsFallbackPage() {
  redirect('/en/assets');
}
