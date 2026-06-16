import type { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/routing';
import { getAllBlogPostSources } from '@/lib/blog-data';
import { getPromptPagePath } from '@/lib/prompt-page-routes';
import {
  PROMPT_SEO_LANDING_PAGE_SLUGS,
  getPromptSeoLandingPageConfig,
} from '@/lib/prompt-seo-landing-pages';
import { getIndexablePromptPageEntriesAsync } from '@/lib/prompts';
import { getUnlocalizedPathname, getUrlWithLocale } from '@/lib/urls/urls';

const BASE_URL = 'https://vogueai.net';
const SITE_LAST_UPDATED = new Date('2026-05-29');

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localizedPages = [
    { path: '/', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  const promptSeoLandingPages = PROMPT_SEO_LANDING_PAGE_SLUGS.map((slug) => {
    const config = getPromptSeoLandingPageConfig(slug);

    return {
      path: config.path,
      changeFrequency: 'weekly' as const,
      priority: config.sitemapPriority,
    };
  });

  const singleLanguagePages = [
    ...promptSeoLandingPages,
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

  const promptPageEntries: MetadataRoute.Sitemap =
    (await getIndexablePromptPageEntriesAsync()).map((entry) =>
      createEntry({
        path: getPromptPagePath(entry),
        lastModified: new Date(entry.publishedAtMs ?? SITE_LAST_UPDATED),
        changeFrequency: 'weekly' as const,
        priority: 0.68,
      })
    );

  return [
    ...localizedEntries,
    ...blogPostEntries,
    ...promptPageEntries,
    ...singleLanguageEntries,
  ];
}
