import 'server-only';

import {
  linkGenerationAsset,
  recordUserAsset,
  type AssetType,
} from '@/lib/assets/user-assets';
import { uploadFile } from '@/storage';

const asObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const isUrlLike = (value: string) => /^https?:\/\//i.test(value);

const getImageUrlsFromOutput = (output: unknown) => {
  const payload = asObject(output);
  if (!payload) return [] as string[];

  const urls = new Set<string>();
  if (typeof payload.result_url === 'string' && isUrlLike(payload.result_url)) {
    urls.add(payload.result_url);
  }
  if (Array.isArray(payload.image_urls)) {
    for (const item of payload.image_urls) {
      if (typeof item === 'string' && isUrlLike(item)) urls.add(item);
    }
  }

  return [...urls];
};

const getMimeType = (url: string, type: AssetType) => {
  const pathname = (() => {
    try {
      return new URL(url).pathname.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  })();

  if (type === 'video') return 'video/mp4';
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (pathname.endsWith('.webp')) return 'image/webp';
  if (pathname.endsWith('.gif')) return 'image/gif';
  return 'image/png';
};

const getObjectKey = ({
  generationId,
  index,
  url,
}: {
  generationId: string;
  index: number;
  url: string;
}) => {
  try {
    const parsed = new URL(url);
    const filename =
      parsed.pathname.split('/').filter(Boolean).pop() || `output-${index}`;
    return `${generationId}/${index}-${filename}`;
  } catch {
    return `${generationId}/${index}-output`;
  }
};

const getStorageBucketName = () =>
  process.env.R2_IMAGE_BUCKET_NAME || '';

const getStoragePublicUrl = () =>
  process.env.R2_IMAGE_PUBLIC_URL ||
  process.env.R2_PUBLIC_URL ||
  (process.env.R2_PUBLIC_HOSTNAME
    ? `https://${process.env.R2_PUBLIC_HOSTNAME.replace(/^https?:\/\//, '')}`
    : undefined);

const extensionByType = (contentType: string) => {
  if (contentType.includes('image/png')) return 'png';
  if (contentType.includes('image/webp')) return 'webp';
  if (contentType.includes('image/gif')) return 'gif';
  if (contentType.includes('image/jpeg')) return 'jpg';
  return 'jpg';
};

const persistProviderImageUrl = async ({
  generationId,
  userId,
  index,
  url,
}: {
  generationId: string;
  userId: string;
  index: number;
  url: string;
}) => {
  const bucketName = getStorageBucketName();
  if (!bucketName) {
    const assetId = await recordUserAsset({
      userId,
      type: 'image',
      source: 'provider',
      bucket: 'provider-output',
      objectKey: getObjectKey({ generationId, index, url }),
      publicUrl: url,
      mimeType: getMimeType(url, 'image'),
      metadata: {
        generationId,
        providerUrl: url,
        storageSyncSkipped: true,
      },
    });

    await linkGenerationAsset({
      generationId,
      assetId,
      role: 'output',
    });

    return { publicUrl: url, storageKey: null };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Provider image fetch failed with ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || getMimeType(url, 'image');
    const extension = extensionByType(contentType);
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const uploadResult = await uploadFile(
      imageBuffer,
      `${generationId}-${index}.${extension}`,
      contentType,
      `effects/${generationId}/images`,
      {
        bucketName,
        publicUrl: getStoragePublicUrl(),
      }
    );

    const assetId = await recordUserAsset({
      userId,
      type: 'image',
      source: 'provider',
      bucket: bucketName,
      objectKey: uploadResult.key,
      publicUrl: uploadResult.url,
      mimeType: contentType,
      sizeBytes: imageBuffer.byteLength,
      metadata: {
        generationId,
        providerUrl: url,
      },
    });

    await linkGenerationAsset({
      generationId,
      assetId,
      role: 'output',
    });

    return { publicUrl: uploadResult.url, storageKey: uploadResult.key };
  } catch (error) {
    console.error('persist provider image failed:', error);
    const assetId = await recordUserAsset({
      userId,
      type: 'image',
      source: 'provider',
      bucket: 'provider-output',
      objectKey: getObjectKey({ generationId, index, url }),
      publicUrl: url,
      mimeType: getMimeType(url, 'image'),
      metadata: {
        generationId,
        providerUrl: url,
        storageSyncFailed: true,
      },
    });

    await linkGenerationAsset({
      generationId,
      assetId,
      role: 'output',
    });

    return { publicUrl: url, storageKey: null };
  }
};

export async function persistGenerationOutputAssets({
  generationId,
  userId,
  output,
  assetType = 'image',
}: {
  generationId: string;
  userId: string;
  output: unknown;
  assetType?: AssetType;
}) {
  const urls =
    assetType === 'image'
      ? getImageUrlsFromOutput(output)
      : ([] as string[]);
  if (urls.length === 0) return output;

  const storedUrls: string[] = [];
  const storedKeys: string[] = [];
  for (const [index, url] of urls.entries()) {
    const stored = await persistProviderImageUrl({
      generationId,
      userId,
      index,
      url,
    });
    storedUrls.push(stored.publicUrl);
    if (stored.storageKey) storedKeys.push(stored.storageKey);
  }

  const payload = asObject(output);
  if (!payload || assetType !== 'image' || storedUrls.length === 0) {
    return output;
  }

  return {
    ...payload,
    provider_result_url: urls[0],
    stored_result_url: storedUrls[0],
    stored_image_keys: storedKeys,
    image_urls: storedUrls,
    result_url: storedUrls[0],
    storage_sync_failed: storedUrls.some((url, index) => url === urls[index])
      ? undefined
      : false,
  };
}
