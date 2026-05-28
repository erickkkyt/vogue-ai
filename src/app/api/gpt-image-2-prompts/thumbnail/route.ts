import { getPromptEntryById } from '@/lib/prompts';
import { NextResponse } from 'next/server';

const THUMBNAIL_FETCH_TIMEOUT_MS = 5000;
const THUMBNAIL_CACHE_CONTROL =
  'public, max-age=31536000, s-maxage=31536000, immutable, stale-while-revalidate=2592000';

const readImageIndex = (value: string | null) => {
  const index = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(index) || index <= 0) return 0;
  return index;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Prompt id is required' }, { status: 400 });
  }

  const entry = getPromptEntryById(id, 'en');
  const imageIndex = readImageIndex(searchParams.get('index'));
  const imageUrl = entry?.images[imageIndex] ?? entry?.images[0] ?? null;

  if (!imageUrl) {
    return NextResponse.json({ error: 'Prompt image not found' }, { status: 404 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    THUMBNAIL_FETCH_TIMEOUT_MS
  );

  let response: Response;

  try {
    response = await fetch(imageUrl, {
      cache: 'force-cache',
      next: {
        revalidate: 86400,
      },
      signal: controller.signal,
    });
  } catch {
    return NextResponse.redirect(imageUrl, 307);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok || !response.body) {
    return NextResponse.redirect(imageUrl, 307);
  }

  return new NextResponse(response.body, {
    headers: {
      'cache-control': THUMBNAIL_CACHE_CONTROL,
      'content-type': response.headers.get('content-type') ?? 'image/jpeg',
    },
  });
}
