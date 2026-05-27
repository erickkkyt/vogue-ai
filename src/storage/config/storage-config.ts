import type { StorageConfig } from '../types';

const stripTrailingSlash = (value: string) => value.replace(/\/$/, '');

const getEndpoint = () => {
  if (process.env.R2_ENDPOINT) {
    return stripTrailingSlash(process.env.R2_ENDPOINT);
  }
  if (process.env.R2_ACCOUNT_ID) {
    return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  }
  return '';
};

const getPublicUrl = () => {
  if (process.env.R2_IMAGE_PUBLIC_URL) {
    return stripTrailingSlash(process.env.R2_IMAGE_PUBLIC_URL);
  }
  if (process.env.R2_PUBLIC_URL) {
    return stripTrailingSlash(process.env.R2_PUBLIC_URL);
  }
  if (process.env.R2_PUBLIC_HOSTNAME) {
    return `https://${process.env.R2_PUBLIC_HOSTNAME.replace(/^https?:\/\//, '')}`;
  }
  return undefined;
};

export const storageConfig: StorageConfig = {
  region: process.env.R2_REGION || 'auto',
  endpoint: getEndpoint(),
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.R2_IMAGE_BUCKET_NAME || '',
  publicUrl: getPublicUrl(),
  forcePathStyle: process.env.R2_FORCE_PATH_STYLE !== 'false',
};
