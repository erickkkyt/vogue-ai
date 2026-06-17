import { withDbRequestContext } from '@/db';
import { loadGeneratedWorkspaceFeed } from '@/lib/app/generated-workspace-feed';
import { getSession } from '@/lib/server';

export async function GET() {
  return withDbRequestContext(getRecentAssets);
}

async function getRecentAssets() {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await loadGeneratedWorkspaceFeed({
    userId: session.user.id,
    limit: 10,
  });

  return Response.json({ items });
}
