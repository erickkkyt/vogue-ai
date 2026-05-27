import VogueBlogIndex from '@/components/blog/VogueBlogIndex';
import {
  getBlogArticleTagBySlug,
  getBlogCopy,
  type BlogArticleTagSlug,
} from '@/lib/blog-data';
import { getLanguageAlternates, getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type BlogPageParams = Promise<{
  locale: string;
}>;

type BlogPageSearchParams = Promise<{
  tag?: string | string[];
}>;

function getSingleSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: {
  params: BlogPageParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = getBlogCopy(locale);
  const title = `${copy.eyebrow} | Vogue AI`;
  const description = copy.subtitle;
  const localizedPath = getUrlWithLocale('/blog', locale);

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates('/blog'),
    },
    openGraph: {
      title,
      description,
      url: localizedPath,
      type: 'website',
      images: [
        {
          url: '/social-share.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/social-share.jpg'],
    },
  };
}

export default async function BlogListPage({
  params,
  searchParams,
}: {
  params: BlogPageParams;
  searchParams?: BlogPageSearchParams;
}) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedTagParam = getSingleSearchParam(resolvedSearchParams.tag);
  const selectedTag = selectedTagParam
    ? getBlogArticleTagBySlug(selectedTagParam)?.slug
    : null;

  if (selectedTagParam && !selectedTag) {
    notFound();
  }

  return (
    <VogueBlogIndex
      locale={locale}
      selectedTag={selectedTag as BlogArticleTagSlug | null}
    />
  );
}
