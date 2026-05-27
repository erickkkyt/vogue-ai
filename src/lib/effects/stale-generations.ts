import 'server-only';

export type CleanupStaleGenerationsResult = {
  scannedCount: number;
  processedCount: number;
  failedCount: number;
  succeededCount: number;
  errorCount: number;
};

export async function cleanupStaleGenerations(): Promise<CleanupStaleGenerationsResult> {
  return {
    scannedCount: 0,
    processedCount: 0,
    failedCount: 0,
    succeededCount: 0,
    errorCount: 0,
  };
}

