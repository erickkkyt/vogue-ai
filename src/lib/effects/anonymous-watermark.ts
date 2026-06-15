import 'server-only';

import {
  getImageUrlsFromOutput,
  replaceGenerationImageUrls,
} from './output-image-urls';
import { createWatermarkedImage, getWatermarkObjectKey } from './watermark-worker';

export const watermarkAnonymousGenerationOutput = async ({
  generationId,
  output,
}: {
  generationId: string;
  output: unknown;
}) => {
  const urls = getImageUrlsFromOutput(output);
  if (urls.length === 0) return output;

  const watermarkedImages = await Promise.all(
    urls.map((sourceUrl, index) =>
      createWatermarkedImage({
        sourceUrl,
        objectKey: getWatermarkObjectKey({ generationId, index }),
      })
    )
  );

  return replaceGenerationImageUrls({
    output,
    sourceUrls: urls,
    storedUrls: watermarkedImages.map((image) => image.url),
    storedKeys: watermarkedImages.map((image) => image.key),
    exposeProviderResultUrl: false,
    watermarked: true,
  });
};
