import { withDbRequestContext } from '@/db';
import { getEffectsByIds } from '@/lib/effects/effects';
import { buildPublicEffectsMetadata } from '@/lib/effects/public-effect-metadata';
import { NextResponse } from 'next/server';

const PUBLIC_EFFECT_METADATA_ALLOWLIST = new Set<number>();

const parseIds = (value: string | null) =>
  (value ?? '')
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));

export async function GET(request: Request) {
  return withDbRequestContext(() => getEffectsMetadata(request));
}

async function getEffectsMetadata(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = parseIds(searchParams.get('ids'));

  if (ids.length === 0) {
    return NextResponse.json({ error: 'ids is required' }, { status: 400 });
  }

  const effects = await getEffectsByIds(ids);
  const metadata = buildPublicEffectsMetadata(
    effects,
    PUBLIC_EFFECT_METADATA_ALLOWLIST
  );

  return NextResponse.json({ effects: metadata });
}
