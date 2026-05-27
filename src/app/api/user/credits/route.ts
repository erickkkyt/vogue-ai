import { getUserCredits } from '@/credits/credits';
import { getSession } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ currentCredits: 0, authenticated: false });
  }

  const currentCredits = await getUserCredits(session.user.id);

  return NextResponse.json({ currentCredits, authenticated: true });
}
