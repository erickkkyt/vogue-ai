import { distributeCreditsToAllUsers } from '@/credits/distribute';
import { cronGuardErrorResponse, requireCronRequest } from '@/lib/admin/cron-guard';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cronGuard = requireCronRequest(request);
  if (!cronGuard.ok) {
    return cronGuardErrorResponse(cronGuard);
  }

  const { usersCount, processedCount, errorCount, skipped } =
    await distributeCreditsToAllUsers();
  return NextResponse.json({
    message: skipped
      ? 'distribute credits skipped because another run is already active'
      : `distribute credits success, users: ${usersCount}, processed: ${processedCount}, errors: ${errorCount}`,
    usersCount,
    processedCount,
    errorCount,
    skipped,
  });
}
