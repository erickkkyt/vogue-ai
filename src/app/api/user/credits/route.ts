import { getUserCredits } from '@/credits/credits';
import { getUserGenerationAccessTier } from '@/lib/effects/generation-access-server';
import { getSession } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ currentCredits: 0, authenticated: false });
  }

  const currentCredits = await getUserCredits(session.user.id);
  const generationAccessTier = await getUserGenerationAccessTier(
    session.user.id
  );

  return NextResponse.json({
    currentCredits,
    authenticated: true,
    generationAccessTier,
  });
}
