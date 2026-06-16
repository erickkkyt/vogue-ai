import type {
  VoguePromptCategoryKey,
  VoguePromptConcreteCategoryKey,
  VoguePromptPublicIdCategoryKey,
} from '../prompt-taxonomy';
import type { VoguePromptImageDimensions } from '../prompt-image-dimensions';
import type { VoguePromptImageAsset } from '../prompt-image-types';
import type { VogueLocale } from '@/i18n/vogue';

export type VoguePromptImagePrompt = {
  image: string;
  prompt: string;
  promptTranslations?: Partial<Record<VogueLocale, string>>;
  sourceId?: string;
  title?: string;
};

export type VoguePromptEntry = {
  id: string;
  publicId: string;
  seoSlug?: string;
  sourceOrder: number;
  title: string;
  sourceTitle?: string;
  description?: string;
  images: string[];
  imagePrompts?: VoguePromptImagePrompt[];
  prompt: string;
  originalPrompt?: string;
  promptTranslations?: Partial<Record<VogueLocale, string>>;
  modelId?: string;
  authorName?: string;
  authorHandle?: string;
  publishedLabel: string;
  publishedAtMs?: number;
  galleryPublishedAt?: string;
  galleryPublishedAtMs?: number;
  sourceUrl?: string;
  sourceType?: string;
  languages?: string[];
  categoryText?: string;
  categoryKey?: VoguePromptConcreteCategoryKey;
  publicIdCategoryKey?: VoguePromptPublicIdCategoryKey;
  imageAssets?: VoguePromptImageAsset[];
  defaultImageIndex?: number;
};

export type VoguePromptGalleryEntry = Pick<
  VoguePromptEntry,
  | 'id'
  | 'publicId'
  | 'seoSlug'
  | 'sourceOrder'
  | 'title'
  | 'sourceTitle'
  | 'images'
  | 'imageAssets'
  | 'modelId'
  | 'authorName'
  | 'authorHandle'
  | 'publishedLabel'
  | 'publishedAtMs'
  | 'galleryPublishedAt'
  | 'galleryPublishedAtMs'
  | 'sourceUrl'
  | 'sourceType'
  | 'languages'
  | 'categoryKey'
> & {
  imageCount: number;
  imageDimensions?: VoguePromptImageDimensions | null;
};

export type VogueRelatedPromptEntry = Pick<
  VoguePromptEntry,
  | 'id'
  | 'publicId'
  | 'seoSlug'
  | 'title'
  | 'images'
  | 'imageAssets'
  | 'modelId'
  | 'categoryKey'
>;

export type PromptGalleryOptions = {
  limit?: number;
  offset?: number;
  modelId?: string | null;
  featured?: boolean;
  categoryKey?: VoguePromptCategoryKey | null;
  categoryKeys?: VoguePromptConcreteCategoryKey[];
  sort?: 'default' | 'homepageFresh';
};
