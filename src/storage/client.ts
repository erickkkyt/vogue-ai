import type { UploadFileResult } from './types';

const API_STORAGE_PRESIGN = '/api/storage/presign';
const API_STORAGE_COMPLETE = '/api/storage/complete';

type DirectUploadResponse = {
  token: string;
  uploadUrl: string;
  method: 'PUT';
  headers?: Record<string, string>;
  key: string;
  url: string;
};

export const uploadFileFromBrowser = async (
  file: File,
  folder?: string,
  bucketName?: string
): Promise<UploadFileResult> => {
  const presignResponse = await fetch(API_STORAGE_PRESIGN, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      folder: folder || '',
      bucket: bucketName || '',
    }),
  });

  if (!presignResponse.ok) {
    if (presignResponse.status === 413) {
      throw new Error('File size exceeds the server limit');
    }
    const errorData = (await presignResponse.json().catch(() => null)) as
      | { error?: string; message?: string }
      | null;
    throw new Error(
      errorData?.error || errorData?.message || 'Failed to upload file'
    );
  }

  const directUpload = (await presignResponse.json()) as DirectUploadResponse;
  const uploadResponse = await fetch(directUpload.uploadUrl, {
    method: directUpload.method,
    headers: directUpload.headers,
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file');
  }

  const completeResponse = await fetch(API_STORAGE_COMPLETE, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      token: directUpload.token,
    }),
  });

  if (!completeResponse.ok) {
    const errorData = (await completeResponse.json().catch(() => null)) as
      | { error?: string; message?: string }
      | null;
    throw new Error(
      errorData?.error || errorData?.message || 'Failed to finalize upload'
    );
  }

  return await completeResponse.json();
};
