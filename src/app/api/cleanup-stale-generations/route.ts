import { cleanupStaleGenerations } from '@/lib/effects/stale-generations';
import { cronGuardErrorResponse, requireCronRequest } from '@/lib/admin/cron-guard';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cronGuard = requireCronRequest(request);
  if (!cronGuard.ok) {
    return cronGuardErrorResponse(cronGuard);
  }

  const result = await cleanupStaleGenerations();
  return NextResponse.json({
    message: `cleanup stale generations success, scanned: ${result.scannedCount}, processed: ${result.processedCount}, failed: ${result.failedCount}, succeeded: ${result.succeededCount}, errors: ${result.errorCount}`,
    ...result,
  });
}
