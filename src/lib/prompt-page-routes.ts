import {
  PROMPT_PUBLIC_ID_PATTERN,
  createPromptSeoSlug,
} from './prompt-slug-utils';

type PromptRouteEntry = {
  publicId: string;
  title: string;
  seoSlug?: string;
  categoryKey?: string | null;
  modelId?: string | null;
};

export const getPromptPageSeoSlug = (entry: PromptRouteEntry) =>
  entry.seoSlug || createPromptSeoSlug(entry);

export const getPromptPageSlug = (entry: PromptRouteEntry) =>
  `${getPromptPageSeoSlug(entry)}-${entry.publicId}`;

export const getPromptPagePath = (entry: PromptRouteEntry) =>
  `/prompt/${getPromptPageSlug(entry)}`;

export const getPromptPublicIdFromRouteSlug = (routeSlug: string) => {
  if (PROMPT_PUBLIC_ID_PATTERN.test(routeSlug)) return routeSlug;

  const match = routeSlug.match(/-(\d{9})$/);

  return match?.[1] ?? null;
};
export const isCanonicalPromptRouteSlug = (
  routeSlug: string,
  entry: PromptRouteEntry
) => routeSlug === getPromptPageSlug(entry);
