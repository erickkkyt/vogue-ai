import type { VoguePromptImageAsset } from '@/lib/prompt-image-types';
import {
  PROMPT_IMAGE_VARIANT_WIDTHS,
  normalizePromptImageVariantWidth,
} from '@/lib/prompt-image-types';
import Image, { type ImageProps } from 'next/image';

export const getPromptImageAssetSrc = (
  asset: VoguePromptImageAsset | null | undefined,
  width?: number | null
) => {
  if (!asset) return '';

  const variantWidth = normalizePromptImageVariantWidth(width);
  const exactVariant = asset.variants[`${variantWidth}`];
  if (exactVariant) return exactVariant;

  const widerVariant = PROMPT_IMAGE_VARIANT_WIDTHS.find(
    (candidateWidth) =>
      variantWidth <= candidateWidth && asset.variants[`${candidateWidth}`]
  );
  if (widerVariant) return asset.variants[`${widerVariant}`] ?? asset.originalUrl;

  const fallbackVariant = [...PROMPT_IMAGE_VARIANT_WIDTHS]
    .reverse()
    .find((candidateWidth) => asset.variants[`${candidateWidth}`]);

  return fallbackVariant
    ? asset.variants[`${fallbackVariant}`] ?? asset.originalUrl
    : asset.originalUrl;
};

type PromptResolvedImageProps = Omit<
  ImageProps,
  'src' | 'loader' | 'unoptimized'
> & {
  asset: VoguePromptImageAsset;
  preferredWidth?: number;
};

export default function PromptResolvedImage({
  asset,
  alt,
  preferredWidth = 640,
  ...props
}: PromptResolvedImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      src={getPromptImageAssetSrc(asset, preferredWidth)}
      unoptimized
    />
  );
}
