import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { storageConfig } from './config/storage-config';
import {
  ConfigurationError,
  type PresignedUploadResult,
  type StorageConfig,
  StorageError,
  UploadError,
  type UploadFileResult,
  type VerifiedObjectResult,
} from './types';

let s3Client: S3Client | null = null;

const getStorageConfig = (): StorageConfig => {
  if (!storageConfig.region) {
    throw new ConfigurationError('Storage region is not configured');
  }
  if (!storageConfig.endpoint) {
    throw new ConfigurationError('Storage endpoint is not configured');
  }
  if (!storageConfig.accessKeyId || !storageConfig.secretAccessKey) {
    throw new ConfigurationError('Storage credentials are not configured');
  }
  if (!storageConfig.bucketName) {
    throw new ConfigurationError('Storage bucket name is not configured');
  }
  return storageConfig;
};

const getClient = () => {
  if (s3Client) return s3Client;
  const config = getStorageConfig();
  s3Client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  return s3Client;
};

const getBucketName = (bucketName?: string) =>
  bucketName || getStorageConfig().bucketName;

const getPublicUrl = ({
  bucketName,
  key,
  publicUrl,
}: {
  bucketName: string;
  key: string;
  publicUrl?: string;
}) => {
  const config = getStorageConfig();
  if (publicUrl || config.publicUrl) {
    return `${(publicUrl || config.publicUrl)!.replace(/\/$/, '')}/${key}`;
  }
  return `${config.endpoint.replace(/\/$/, '')}/${bucketName}/${key}`;
};

const generateKey = (filename: string, folder?: string) => {
  const extension = filename.includes('.') ? filename.split('.').pop() : '';
  const generatedName = extension
    ? `${randomUUID()}.${extension}`
    : randomUUID();
  const normalizedFolder = folder?.trim().replace(/^\/+|\/+$/g, '') || '';
  return normalizedFolder
    ? `${normalizedFolder}/${generatedName}`
    : generatedName;
};

export const uploadFile = async (
  file: Buffer | Blob,
  filename: string,
  contentType: string,
  folder?: string,
  options?: {
    bucketName?: string;
    publicUrl?: string;
  }
): Promise<UploadFileResult> => {
  try {
    const bucketName = getBucketName(options?.bucketName);
    const key = generateKey(filename, folder);
    const body =
      file instanceof Blob ? Buffer.from(await file.arrayBuffer()) : file;

    await getClient().send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );

    return {
      key,
      url: getPublicUrl({ bucketName, key, publicUrl: options?.publicUrl }),
    };
  } catch (error) {
    if (error instanceof ConfigurationError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error occurred during file upload';
    throw new UploadError(message);
  }
};

export const createPresignedUpload = async (
  contentType: string,
  key: string,
  options?: {
    bucketName?: string;
  }
): Promise<PresignedUploadResult> => {
  const bucketName = getBucketName(options?.bucketName);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(getClient(), command, {
    expiresIn: 60 * 5,
  });

  return {
    uploadUrl,
    method: 'PUT',
    headers: {
      'content-type': contentType,
    },
  };
};

export const verifyUploadedObject = async (
  key: string,
  options?: {
    bucketName?: string;
  }
): Promise<VerifiedObjectResult> => {
  const bucketName = getBucketName(options?.bucketName);

  try {
    const result = await getClient().send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );

    return {
      exists: true,
      sizeBytes:
        typeof result.ContentLength === 'number' ? result.ContentLength : null,
      contentType: result.ContentType ?? null,
      eTag: result.ETag ?? null,
    };
  } catch (error) {
    const isMissingObject =
      typeof error === 'object' &&
      error !== null &&
      (('name' in error &&
        (error.name === 'NotFound' ||
          error.name === 'NoSuchKey' ||
          error.name === 'NoSuchBucket')) ||
        ('$metadata' in error &&
          typeof error.$metadata === 'object' &&
          error.$metadata !== null &&
          'httpStatusCode' in error.$metadata &&
          error.$metadata.httpStatusCode === 404));

    if (isMissingObject) {
      return { exists: false };
    }

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error occurred while verifying uploaded object';
    throw new StorageError(message);
  }
};

export const buildPublicStorageUrl = ({
  bucketName,
  key,
  publicUrl,
}: {
  bucketName: string;
  key: string;
  publicUrl?: string;
}) => getPublicUrl({ bucketName, key, publicUrl });
