export interface StorageConfig {
  region: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl?: string;
  forcePathStyle?: boolean;
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class ConfigurationError extends StorageError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class UploadError extends StorageError {
  constructor(message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

export interface UploadFileResult {
  url: string;
  key: string;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  method: 'PUT';
  headers: Record<string, string>;
}

export interface VerifiedObjectResult {
  exists: boolean;
  sizeBytes?: number | null;
  contentType?: string | null;
  eTag?: string | null;
}
