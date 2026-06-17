import { withDbRequestContext } from '@/db';
import { validateUploadedImageFile } from '@/lib/effects/validation';
import { getSession } from '@/lib/server';
import { createDirectUploadDescriptor } from '@/storage/direct-upload';
import { type NextRequest, NextResponse } from 'next/server';

type DirectUploadRequest = {
  filename?: string;
  contentType?: string;
  sizeBytes?: number;
  folder?: string;
  bucket?: string;
};

export async function POST(request: NextRequest) {
  return withDbRequestContext(() => postStoragePresign(request));
}

async function postStoragePresign(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as DirectUploadRequest;
    const filename = body.filename?.trim();
    const contentType = body.contentType?.trim();
    const sizeBytes = body.sizeBytes;

    if (!filename || !contentType || !Number.isFinite(sizeBytes)) {
      return NextResponse.json(
        { error: 'Missing upload file metadata' },
        { status: 400 }
      );
    }

    const normalizedSizeBytes = Number(sizeBytes);
    const validation = validateUploadedImageFile({
      size: normalizedSizeBytes,
      type: contentType,
    });

    if (!validation.ok) {
      return NextResponse.json(
        {
          error:
            validation.code === 'IMAGE_TOO_LARGE'
              ? 'File size exceeds the server limit'
              : 'File type not supported',
        },
        { status: 400 }
      );
    }

    const descriptor = await createDirectUploadDescriptor({
      userId: session.user.id,
      filename,
      contentType,
      sizeBytes: normalizedSizeBytes,
      folder: body.folder,
      bucketName: body.bucket,
    });

    return NextResponse.json(descriptor);
  } catch (error) {
    console.error('Error creating upload URL:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong while preparing the upload';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
