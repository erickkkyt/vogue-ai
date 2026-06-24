import { withDbRequestContext } from '@/db';
import { recordUserAsset } from '@/lib/assets/user-assets';
import { getSession } from '@/lib/server';
import { deleteObject, verifyUploadedObject } from '@/storage';
import {
  inferAssetTypeFromMime,
  verifyUploadToken,
} from '@/storage/direct-upload';
import { assertDirectUploadObjectMatchesOrCleanup } from '@/storage/direct-upload-verification';
import { type NextRequest, NextResponse } from 'next/server';

type CompleteUploadRequest = {
  token?: string;
};

export async function POST(request: NextRequest) {
  return withDbRequestContext(() => postStorageComplete(request));
}

async function postStorageComplete(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CompleteUploadRequest;
    if (!body.token) {
      return NextResponse.json(
        { error: 'Missing upload token' },
        { status: 400 }
      );
    }

    const upload = verifyUploadToken({
      token: body.token,
      userId: session.user.id,
    });
    const uploadedObject = await verifyUploadedObject(upload.key, {
      bucketName: upload.bucket,
    });

    await assertDirectUploadObjectMatchesOrCleanup({
      upload: {
        key: upload.key,
        bucket: upload.bucket,
        mimeType: upload.mimeType,
        sizeBytes: upload.sizeBytes,
      },
      object: uploadedObject,
      cleanup: async ({ key, bucket }) =>
        deleteObject(key, { bucketName: bucket }),
      onCleanupError: (cleanupError) => {
        console.error('Error deleting rejected direct upload:', cleanupError);
      },
    });

    await recordUserAsset({
      userId: session.user.id,
      type: inferAssetTypeFromMime(upload.mimeType),
      source: 'upload',
      bucket: upload.bucket,
      objectKey: upload.key,
      publicUrl: upload.url,
      mimeType: upload.mimeType,
      sizeBytes: upload.sizeBytes,
      metadata: upload.metadata,
    });

    return NextResponse.json({
      key: upload.key,
      url: upload.url,
    });
  } catch (error) {
    console.error('Error completing upload:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong while completing the upload';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
