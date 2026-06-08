import {
  getFeaturedPromptEntries,
  getLocalizedPromptGalleryEntries,
  getPromptEntryById,
  getPromptGalleryEntryTotal,
} from '@/lib/prompts';
import type { VoguePromptCategoryKey } from '@/lib/prompt-taxonomy';
import { NextResponse } from 'next/server';

const readLimit = (value: string | null) => {
  const limit = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(limit) || limit <= 0) return 500;
  return Math.min(limit, 1000);
};

const readGalleryLimit = (value: string | null) => {
  const limit = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(limit) || limit <= 0) return 80;
  return Math.min(limit, 200);
};

const readOffset = (value: string | null) => {
  const offset = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(offset) || offset <= 0) return 0;
  return offset;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');
  const id = searchParams.get('id');
  const mode = searchParams.get('mode');

  if (id) {
    const entry = getPromptEntryById(id, locale);

    if (!entry) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json(
      { entry },
      {
        headers: {
          'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  if (mode === 'gallery') {
    const limit = readGalleryLimit(searchParams.get('limit'));
    const offset = readOffset(searchParams.get('offset'));
    const modelId = searchParams.get('model');
    const categoryKey = searchParams.get(
      'category'
    ) as VoguePromptCategoryKey | null;
    const sort: 'homepageFresh' | undefined =
      searchParams.get('sort') === 'homepageFresh' ? 'homepageFresh' : undefined;
    const options = {
      limit,
      offset,
      modelId,
      categoryKey,
      sort,
    };
    const entries = getLocalizedPromptGalleryEntries(locale, options);
    const total = getPromptGalleryEntryTotal(options);

    return NextResponse.json(
      {
        entries,
        total,
        offset,
        limit,
        hasMore: offset + entries.length < total,
      },
      {
        headers: {
          'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  const limit = readLimit(searchParams.get('limit'));
  const entries = getFeaturedPromptEntries(limit);

  return NextResponse.json(
    { entries },
    {
      headers: {
        'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    }
  );
}
