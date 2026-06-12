export const PROMPT_IMAGE_VARIANT_WIDTHS = [128, 160, 640, 1200] as const;

export type PromptImageVariantWidth =
  (typeof PROMPT_IMAGE_VARIANT_WIDTHS)[number];

export type PromptImageVariantMap = Partial<
  Record<`${PromptImageVariantWidth}`, string>
>;

export type VoguePromptImageAsset = {
  originalUrl: string;
  width: number | null;
  height: number | null;
  aspectRatio: string | null;
  variants: PromptImageVariantMap;
};

export const createFallbackPromptImageAsset = (
  originalUrl: string
): VoguePromptImageAsset => ({
  originalUrl,
  width: null,
  height: null,
  aspectRatio: null,
  variants: {},
});

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
