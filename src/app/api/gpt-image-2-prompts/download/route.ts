import { getPromptEntryById } from '@/lib/prompts';
import { NextResponse } from 'next/server';

const readValidImageIndex = (value: string | null) => {
  if (!value) return 0;
  const imageIndex = Number.parseInt(value, 10);
  if (!Number.isFinite(imageIndex) || imageIndex < 0) return null;
  return imageIndex;
};

const getExtensionFromUrl = (value: string) => {
  try {
    const filename = new URL(value).pathname.split('/').pop() ?? '';
    const extension = filename.includes('.')
      ? filename.split('.').pop()?.toLowerCase()
      : null;
    return extension && /^[a-z0-9]+$/.test(extension) ? extension : null;
  } catch {
    return null;
  }
};

const getExtensionFromContentType = (contentType: string | null) => {
  if (!contentType) return null;
  if (contentType.includes('image/png')) return 'png';
  if (contentType.includes('image/webp')) return 'webp';
  if (contentType.includes('image/gif')) return 'gif';
  if (contentType.includes('image/jpeg')) return 'jpg';
  return null;
};

const getSafeFilenamePart = (value: string) => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);

  return normalized || 'prompt-image';
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('entryId');
  const imageIndex = readValidImageIndex(searchParams.get('imageIndex'));

  if (!entryId || imageIndex === null) {
    return NextResponse.json(
      { error: 'Invalid download request' },
      { status: 400 }
    );
  }

  const entry = getPromptEntryById(entryId);
  const imageUrl = entry?.images[imageIndex];
  if (!entry || !imageUrl) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  const upstream = await fetch(imageUrl);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: 'Failed to fetch prompt image' },
      { status: 502 }
    );
  }

  const contentType =
    upstream.headers.get('content-type') ?? 'application/octet-stream';
  const extension =
    getExtensionFromUrl(imageUrl) ??
    getExtensionFromContentType(contentType) ??
    'jpg';
  const filename = `vogue-ai-${getSafeFilenamePart(entry.title)}-${
    imageIndex + 1
  }.${extension}`;
  const headers = new Headers({
    'cache-control': 'public, max-age=3600',
    'content-disposition': `attachment; filename="${filename}"`,
    'content-type': contentType,
  });
  const contentLength = upstream.headers.get('content-length');
  if (contentLength) headers.set('content-length', contentLength);

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  });
}

