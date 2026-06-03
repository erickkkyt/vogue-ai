import { NON_PROMPT_COLLECTION_CONFIGS } from '@/lib/non-prompt-collections';
import type { NonPromptPageConfig } from '@/lib/non-prompt-pages';

const BASE_URL = 'https://vogueai.net';

export type NonPromptBreadcrumbParent = {
  name: string;
  item: string;
};

export function getNonPromptBreadcrumbParent(
  config: Pick<NonPromptPageConfig, 'slug' | 'category'>
): NonPromptBreadcrumbParent {
  const collection = Object.values(NON_PROMPT_COLLECTION_CONFIGS).find((item) =>
    item.items.some((slug) => slug === config.slug)
  );

  if (!collection) {
    return {
      name: config.category,
      item: BASE_URL,
    };
  }

  return {
    name: collection.label,
    item: `${BASE_URL}${collection.path}`,
  };
}
