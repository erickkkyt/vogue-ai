import generatedPromptImageVariants from './generated/vogue-prompt-image-variants.json';
import {
  PROMPT_IMAGE_VARIANT_WIDTHS,
  isPromptImageVariantSrc,
  normalizePromptImageVariantWidth,
  type PromptImageVariantWidth,
} from './prompt-image-types';

export {
  PROMPT_IMAGE_VARIANT_WIDTHS,
  isPromptImageVariantSrc,
  normalizePromptImageVariantWidth,
  type PromptImageVariantWidth,
};

export type PromptImageVariantManifest = Record<
  string,
  Partial<Record<`${PromptImageVariantWidth}`, string>>
>;

type PromptImageVariantArgs = {
  entryId?: string;
  imageIndex?: number;
  width?: number | null;
  imageUrl?: string | null;
  manifest?: PromptImageVariantManifest;
};

const promptImageVariantManifest =
  generatedPromptImageVariants as PromptImageVariantManifest;

const getBestAvailableVariantUrl = (
  variants: PromptImageVariantManifest[string] | undefined,
  width: PromptImageVariantWidth
) => {
  if (!variants) return null;

  const exactVariant = variants[String(width) as `${PromptImageVariantWidth}`];
  if (exactVariant) return exactVariant;

  const widerVariant = PROMPT_IMAGE_VARIANT_WIDTHS.find(
    (variantWidth) => width <= variantWidth && variants[`${variantWidth}`]
  );
  if (widerVariant) return variants[`${widerVariant}`] ?? null;

  const fallbackVariant = [...PROMPT_IMAGE_VARIANT_WIDTHS]
    .reverse()
    .find((variantWidth) => variants[`${variantWidth}`]);

  return fallbackVariant ? variants[`${fallbackVariant}`] ?? null : null;
};

export const getPromptImageVariantSrc = ({
  imageUrl,
  manifest = promptImageVariantManifest,
  width,
}: PromptImageVariantArgs) => {
  const variantWidth = normalizePromptImageVariantWidth(width);
  const variantUrl = imageUrl
    ? getBestAvailableVariantUrl(manifest[imageUrl], variantWidth)
    : null;

  return variantUrl ?? imageUrl ?? '';
};
