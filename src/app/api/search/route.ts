import { getFeaturedPromptEntriesAsync } from '@/lib/prompts';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? searchParams.get('query') ?? '')
    .trim()
    .toLowerCase();
  const limit = Math.min(
    Math.max(Number.parseInt(searchParams.get('limit') ?? '20', 10) || 20, 1),
    50
  );
  const entries = await getFeaturedPromptEntriesAsync(1000);
  const results = query
    ? entries.filter((entry) =>
        [entry.title, entry.description, entry.prompt, entry.authorName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
    : entries;

  return NextResponse.json({
    query,
    results: results.slice(0, limit).map((entry) => ({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      url: `/app?prompt=${encodeURIComponent(entry.prompt)}`,
      image: entry.images[0] ?? null,
    })),
  });
}
