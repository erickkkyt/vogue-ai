import { getDb } from '@/db';
import { generationAssetLink, generationHistory, userAsset } from '@/db/schema';
import { getSession } from '@/lib/server';
import { and, desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const getExtension = (value: string) => {
  try {
    const pathname = new URL(value).pathname;
    const ext = pathname.split('.').pop()?.toLowerCase();
    return ext && ext.length <= 5 ? ext : 'png';
  } catch {
    return 'png';
  }
};

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const taskId = url.searchParams.get('taskId');
  const requestedUrl = url.searchParams.get('url');
  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  const db = await getDb();
  const rows = await db
    .select({
      publicUrl: userAsset.publicUrl,
      mimeType: userAsset.mimeType,
    })
    .from(generationAssetLink)
    .leftJoin(userAsset, eq(userAsset.id, generationAssetLink.assetId))
    .leftJoin(
      generationHistory,
      eq(generationHistory.id, generationAssetLink.generationId)
    )
    .where(
      and(
        eq(generationAssetLink.generationId, taskId),
        eq(generationAssetLink.role, 'output'),
        eq(generationHistory.userId, session.user.id)
      )
    )
    .orderBy(desc(userAsset.createdAt))
    .limit(20);

  const selectedRow = requestedUrl
    ? rows.find((row) => row.publicUrl === requestedUrl)
    : rows[0];
  const publicUrl = selectedRow?.publicUrl;
  if (!publicUrl) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  const upstream = await fetch(publicUrl);
  if (!upstream.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 502 }
    );
  }

  const contentType =
    selectedRow?.mimeType || upstream.headers.get('content-type') || 'image/png';
  const extension = getExtension(publicUrl);
  if (!upstream.body) {
    return NextResponse.json(
      { error: 'Failed to read asset' },
      { status: 502 }
    );
  }

  const headers = new Headers({
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${taskId}.${extension}"`,
    'Cache-Control': 'private, max-age=60',
  });
  const contentLength = upstream.headers.get('content-length');
  if (contentLength) {
    headers.set('Content-Length', contentLength);
  }

  return new Response(upstream.body, { headers });
}
