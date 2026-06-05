import { getIndexNowRuntimeConfig } from '@/lib/indexnow';

export const revalidate = false;

export async function GET() {
  try {
    const { key } = getIndexNowRuntimeConfig();

    return new Response(key, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=300',
      },
    });
  } catch {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    });
  }
}
