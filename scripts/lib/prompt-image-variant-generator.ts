import { createHash } from 'node:crypto';

import type {
  PromptImageVariantManifest,
  PromptImageVariantWidth,
} from '../../src/lib/prompt-image-variants';

const PROMPT_IMAGE_VARIANT_OBJECT_PREFIX = 'prompt-image-variants';

export const buildPromptImageVariantObjectKey = (
  sourceUrl: string,
  width: PromptImageVariantWidth
) => {
  const sourceHash = createHash('sha1').update(sourceUrl).digest('hex');

  return `${PROMPT_IMAGE_VARIANT_OBJECT_PREFIX}/${sourceHash}/${width}.webp`;
};

export const buildPromptImageVariantPublicUrl = (
  publicBase: string,
  objectKey: string
) => `${publicBase.replace(/\/$/, '')}/${objectKey}`;

export const mergePromptImageVariant = (
  manifest: PromptImageVariantManifest,
  sourceUrl: string,
  width: PromptImageVariantWidth,
  variantUrl: string
): PromptImageVariantManifest => ({
  ...manifest,
  [sourceUrl]: {
    ...(manifest[sourceUrl] ?? {}),
    [`${width}`]: variantUrl,
  },
});
