import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import type { AssetType } from '@/lib/assets/user-assets';
import { buildPublicStorageUrl, createPresignedUpload } from '.';
import { storageConfig } from './config/storage-config';

type AllowedBucket = {
  bucketName: string;
  publicUrl?: string;
};

export type DirectUploadDescriptor = {
  token: string;
  uploadUrl: string;
  method: 'PUT';
  headers: Record<string, string>;
  key: string;
  url: string;
  bucket: string;
  mimeType: string;
  sizeBytes: number;
  metadata: {
    originalFilename: string;
    folder: string | null;
  };
};

type UploadTokenPayload = {
  userId: string;
  bucket: string;
  key: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  metadata: {
    originalFilename: string;
    folder: string | null;
  };
  expiresAt: number;
};

const encodeBase64Url = (value: string) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : `${normalized}${'='.repeat(4 - padding)}`;
  return Buffer.from(padded, 'base64').toString('utf8');
};

const getUploadTokenSecret = () => {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET is required for direct uploads');
  }
  return secret;
};

const signUploadTokenPayload = (payload: string) =>
  encodeBase64Url(
    createHmac('sha256', getUploadTokenSecret())
      .update(payload)
      .digest('base64')
  );

const resolveAllowedBuckets = (): AllowedBucket[] =>
  [
    {
      bucketName: process.env.R2_IMAGE_BUCKET_NAME || storageConfig.bucketName,
      publicUrl: storageConfig.publicUrl,
    },
  ].filter((bucket) => Boolean(bucket.bucketName));

export const inferAssetTypeFromMime = (mimeType: string): AssetType => {
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'image';
};

export const resolveUploadBucket = (
  requestedBucket: string | undefined,
  mimeType: string
) => {
  const allowedBuckets = resolveAllowedBuckets();
  if (allowedBuckets.length === 0) {
    throw new Error('No storage buckets are configured');
  }

  const requested = requestedBucket?.trim();
  if (requested) {
    const selected = allowedBuckets.find(
      (bucket) => bucket.bucketName === requested
    );
    if (!selected) {
      throw new Error('Requested upload bucket is not allowed');
    }
    return selected;
  }

  if (!mimeType.startsWith('image/')) {
    throw new Error('Only image uploads are supported in this workspace');
  }

  return allowedBuckets[0];
};

export const buildDirectUploadKey = (filename: string, folder?: string) => {
  const extension = filename.includes('.') ? filename.split('.').pop() : '';
  const generatedName = extension
    ? `${randomUUID()}.${extension}`
    : randomUUID();
  const normalizedFolder = folder?.trim().replace(/^\/+|\/+$/g, '') || '';
  return normalizedFolder
    ? `${normalizedFolder}/${generatedName}`
    : generatedName;
};

export const createUploadToken = (payload: UploadTokenPayload) => {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signUploadTokenPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

export const verifyUploadToken = ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): UploadTokenPayload => {
  const [encodedPayload, encodedSignature] = token.split('.');
  if (!encodedPayload || !encodedSignature) {
    throw new Error('Invalid upload token');
  }

  const expectedSignature = signUploadTokenPayload(encodedPayload);
  const providedSignature = Buffer.from(encodedSignature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);
  if (
    providedSignature.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(providedSignature, expectedSignatureBuffer)
  ) {
    throw new Error('Invalid upload token signature');
  }

  const payload = JSON.parse(
    decodeBase64Url(encodedPayload)
  ) as UploadTokenPayload;
  if (payload.userId !== userId) {
    throw new Error('Upload token user mismatch');
  }
  if (payload.expiresAt < Date.now()) {
    throw new Error('Upload token expired');
  }
  return payload;
};

export const createDirectUploadDescriptor = async ({
  userId,
  filename,
  contentType,
  sizeBytes,
  folder,
  bucketName,
}: {
  userId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  folder?: string;
  bucketName?: string;
}): Promise<DirectUploadDescriptor> => {
  const selectedBucket = resolveUploadBucket(bucketName, contentType);
  const key = buildDirectUploadKey(filename, folder);
  const presignedUpload = await createPresignedUpload(contentType, key, {
    bucketName: selectedBucket.bucketName,
  });
  const url = buildPublicStorageUrl({
    bucketName: selectedBucket.bucketName,
    key,
    publicUrl: selectedBucket.publicUrl,
  });
  const metadata = {
    originalFilename: filename,
    folder: folder?.trim() || null,
  };
  const token = createUploadToken({
    userId,
    bucket: selectedBucket.bucketName,
    key,
    url,
    mimeType: contentType,
    sizeBytes,
    metadata,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return {
    token,
    uploadUrl: presignedUpload.uploadUrl,
    method: presignedUpload.method,
    headers: presignedUpload.headers,
    key,
    url,
    bucket: selectedBucket.bucketName,
    mimeType: contentType,
    sizeBytes,
    metadata,
  };
};
