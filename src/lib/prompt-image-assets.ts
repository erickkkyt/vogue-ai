import { getVoguePromptImageDimensions } from './prompt-image-dimensions';
import { getPromptImageVariantSrc } from './prompt-image-variants';
import {
  PROMPT_IMAGE_VARIANT_WIDTHS,
  type VoguePromptImageAsset,
} from './prompt-image-types';

export const getPromptImageAsset = (
  imageUrl?: string | null
): VoguePromptImageAsset | null => {
  if (!imageUrl) return null;

  const dimensions = getVoguePromptImageDimensions(imageUrl);
  const variants = Object.fromEntries(
    PROMPT_IMAGE_VARIANT_WIDTHS.map((width) => [
      `${width}`,
      getPromptImageVariantSrc({ imageUrl, width }),
    ])
  ) as VoguePromptImageAsset['variants'];

  return {
    originalUrl: imageUrl,
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
    aspectRatio: dimensions?.aspectRatio ?? null,
    variants,
  };
};

export const getPromptImageAssets = (imageUrls: string[]) =>
  imageUrls
    .map((imageUrl) => getPromptImageAsset(imageUrl))
    .filter((asset): asset is VoguePromptImageAsset => Boolean(asset));

