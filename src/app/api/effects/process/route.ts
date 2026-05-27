import { cronGuardErrorResponse, requireCronRequest } from '@/lib/admin/cron-guard';
import { runGenerationStatusPass } from '@/lib/effects/server-poller';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cronGuard = requireCronRequest(request);
  if (!cronGuard.ok) {
    return cronGuardErrorResponse(cronGuard);
  }

  const message = (await request.json().catch(() => null)) as {
    wmTaskId?: string;
    userId?: string;
    effectId?: number;
  } | null;

  if (!message?.wmTaskId || !message.userId || !message.effectId) {
    return NextResponse.json(
      { error: 'Invalid effects status check payload' },
      { status: 400 }
    );
  }

  const result = await runGenerationStatusPass({
    wmTaskId: message.wmTaskId,
    userId: message.userId,
    effectId: message.effectId,
  });

  return NextResponse.json(result);
}
