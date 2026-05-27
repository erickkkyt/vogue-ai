import type { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/routing';
import { getAllBlogPostSources } from '@/lib/blog-data';
import { getUnlocalizedPathname, getUrlWithLocale } from '@/lib/urls/urls';

const BASE_URL = 'https://vogueai.net';
const SITE_LAST_UPDATED = new Date('2026-05-26');

const createEntry = ({
  path,
  lastModified = SITE_LAST_UPDATED,
  changeFrequency,
  priority,
  withAlternates = false,
}: {
  path: string;
  lastModified?: Date;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  withAlternates?: boolean;
}): MetadataRoute.Sitemap[number] => {
  const entry: MetadataRoute.Sitemap[number] = {
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };

  if (withAlternates) {
    const unlocalizedPath = getUnlocalizedPathname(path);

    entry.alternates = {
      languages: {
        ...Object.fromEntries(
          LOCALES.map((locale) => [
            locale,
            `${BASE_URL}${getUrlWithLocale(unlocalizedPath, locale)}`,
          ])
        ),
        'x-default': `${BASE_URL}${getUrlWithLocale(
          unlocalizedPath,
          'en'
        )}`,
      },
    };
  }

  return entry;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedPages = [
    { path: '/', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  const singleLanguagePages = [
    {
      path: '/ai-baby-podcast',
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      path: '/ai-baby-generator',
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      path: '/veo-3-generator',
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      path: '/seedance',
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      path: '/effect',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      path: '/effect/earth-zoom',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      path: '/hailuo-ai-video-generator',
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    { path: '/lipsync', changeFrequency: 'monthly' as const, priority: 0.85 },
    {
      path: '/privacy-policy',
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      path: '/terms-of-service',
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  const localizedEntries = localizedPages.flatMap((page) =>
    LOCALES.map((locale) =>
      createEntry({
        ...page,
        path: getUrlWithLocale(page.path, locale),
        withAlternates: true,
      })
    )
  );

  const singleLanguageEntries = singleLanguagePages.map((page) =>
    createEntry(page)
  );

  const blogPostEntries: MetadataRoute.Sitemap = getAllBlogPostSources().flatMap(
    (post) =>
      LOCALES.map((locale) =>
        createEntry({
          path: getUrlWithLocale(`/blog/${post.slug}`, locale),
          lastModified: new Date(post.updatedAt ?? post.date),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          withAlternates: true,
        })
      )
  );

  return [...localizedEntries, ...blogPostEntries, ...singleLanguageEntries];
}
