import promptSeoSlugs from './generated/prompt-seo-slugs.json';
import { getPromptPublicIdFromRouteSlug } from './prompt-page-routes';

const promptSeoSlugMap = promptSeoSlugs as Record<string, string>;

export const getCanonicalPromptPathFromPublicId = (publicId: string) => {
  const seoSlug = promptSeoSlugMap[publicId];

  return seoSlug ? `/prompt/${seoSlug}-${publicId}` : null;
};

export const getCanonicalPromptPathFromRouteSlug = (routeSlug: string) => {
  const publicId = getPromptPublicIdFromRouteSlug(routeSlug);

  return publicId ? getCanonicalPromptPathFromPublicId(publicId) : null;
};
