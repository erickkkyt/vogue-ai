import { getSession } from '@/lib/server';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export async function VogueAccountRouteSurface({
  route,
}: {
  route: '/profile' | '/billings';
}) {
  const locale = await getLocale();
  const session = await getSession();

  if (!session?.user?.id) {
    redirect(
      `${getUrlWithLocale('/login', locale)}?callbackUrl=${encodeURIComponent(
        getUrlWithLocale(route, locale)
      )}`
    );
  }

  return <main className="min-h-screen bg-[var(--vogue-page)]" />;
}
