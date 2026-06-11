import generatedPromptImageVariants from './generated/vogue-prompt-image-variants.json';

export const PROMPT_IMAGE_VARIANT_WIDTHS = [128, 160, 640, 1200] as const;

export type PromptImageVariantWidth =
  (typeof PROMPT_IMAGE_VARIANT_WIDTHS)[number];

export type PromptImageVariantManifest = Record<
  string,
  Partial<Record<`${PromptImageVariantWidth}`, string>>
>;

type PromptImageVariantArgs = {
  entryId: string;
  imageIndex: number;
  width?: number | null;
  imageUrl?: string | null;
  manifest?: PromptImageVariantManifest;
};

const promptImageVariantManifest =
  generatedPromptImageVariants as PromptImageVariantManifest;

export const isPromptImageVariantSrc = (src?: string | null) =>
  Boolean(
    src?.startsWith('https://media.vogueai.net/prompt-image-variants/')
  );

export const normalizePromptImageVariantWidth = (
  width?: number | null
): PromptImageVariantWidth => {
  const requestedWidth =
    typeof width === 'number' && Number.isFinite(width) ? width : 640;

  return (
    PROMPT_IMAGE_VARIANT_WIDTHS.find(
      (variantWidth) => requestedWidth <= variantWidth
    ) ?? PROMPT_IMAGE_VARIANT_WIDTHS[PROMPT_IMAGE_VARIANT_WIDTHS.length - 1]
  );
};

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
