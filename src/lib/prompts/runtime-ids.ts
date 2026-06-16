import featuredPromptIdsJson from '../../../public/data/prompts/featured.json';
import indexablePromptPublicIdsJson from '../../../public/data/prompts/indexable-public-ids.json';
import runtimeMetaJson from '../../../public/data/prompts/meta.json';
import type { VoguePromptEntry } from './types';

export const VOGUE_FEATURED_PROMPT_IDS = featuredPromptIdsJson as string[];
export const VOGUE_FEATURED_PROMPT_PUBLIC_IDS = VOGUE_FEATURED_PROMPT_IDS;
export const VOGUE_INDEXABLE_PROMPT_PUBLIC_IDS =
  indexablePromptPublicIdsJson as string[];
export const VOGUE_PROMPT_ENTRY_COUNT = (
  runtimeMetaJson as { entryCount: number }
).entryCount;
export const INDEXABLE_PROMPT_PAGE_LIMIT =
  VOGUE_INDEXABLE_PROMPT_PUBLIC_IDS.length;

const indexablePromptPublicIdSet = new Set(VOGUE_INDEXABLE_PROMPT_PUBLIC_IDS);
const vogueFeaturedPromptIdSet = new Set<string>(VOGUE_FEATURED_PROMPT_IDS);

export const isVogueFeaturedPromptEntry = (
  entry: Pick<VoguePromptEntry, 'id' | 'publicId'>
) =>
  vogueFeaturedPromptIdSet.has(entry.publicId) ||
  vogueFeaturedPromptIdSet.has(entry.id);

export const isIndexablePromptPublicId = (publicId: string) =>
  indexablePromptPublicIdSet.has(publicId);
