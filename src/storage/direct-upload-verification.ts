export type UploadedObjectVerification = {
  exists: boolean;
  sizeBytes?: number | null;
  contentType?: string | null;
  eTag?: string | null;
};

const normalizeContentType = (value: string | null | undefined) =>
  value?.split(';')[0]?.trim().toLowerCase() || null;

export function assertDirectUploadObjectMatches({
  upload,
  object,
}: {
  upload: {
    key: string;
    bucket: string;
    mimeType: string;
    sizeBytes: number;
  };
  object: UploadedObjectVerification;
}) {
  if (!object.exists) {
    throw new Error('Uploaded file was not found in storage');
  }

  if (
    typeof object.sizeBytes === 'number' &&
    Number.isFinite(object.sizeBytes) &&
    object.sizeBytes !== upload.sizeBytes
  ) {
    throw new Error('Uploaded file size does not match the presigned upload');
  }

  const expectedType = normalizeContentType(upload.mimeType);
  const actualType = normalizeContentType(object.contentType);
  if (expectedType && actualType && expectedType !== actualType) {
    throw new Error('Uploaded file type does not match the presigned upload');
  }
}
