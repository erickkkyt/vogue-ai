import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const routeFiles = [
  'src/app/api/cleanup-stale-generations/route.ts',
  'src/app/api/distribute-credits/route.ts',
  'src/app/api/effects/1080p/route.ts',
  'src/app/api/effects/4k/route.ts',
  'src/app/api/effects/anonymous-generate/route.ts',
  'src/app/api/effects/anonymous-status/route.ts',
  'src/app/api/effects/anonymous-trial/route.ts',
  'src/app/api/effects/callback/route.ts',
  'src/app/api/effects/metadata/route.ts',
  'src/app/api/effects/process/route.ts',
  'src/app/api/gpt-image-2-prompts/download/route.ts',
  'src/app/api/gpt-image-2-prompts/entries/route.ts',
  'src/app/api/ping/route.ts',
  'src/app/api/rewards/check-in/route.ts',
  'src/app/api/search/route.ts',
  'src/app/api/storage/upload/route.ts',
] as const;

const serviceFiles = [
  'src/lib/effects/client-api.ts',
  'src/lib/effects/credit-notice.ts',
  'src/lib/effects/generation-lifecycle.ts',
  'src/lib/effects/generation-operational-fields.ts',
  'src/lib/effects/generation-orchestrator.ts',
  'src/lib/effects/generation-slot.ts',
  'src/lib/effects/kie-callback.ts',
  'src/lib/effects/output-media.ts',
  'src/lib/effects/output-storage.ts',
  'src/lib/effects/provider-callback.ts',
  'src/lib/effects/public-effect-metadata.ts',
  'src/lib/effects/public-error.ts',
  'src/lib/effects/queue.ts',
  'src/lib/effects/record-generation.ts',
  'src/lib/effects/requested-quality.ts',
  'src/lib/effects/server-poller.ts',
  'src/lib/effects/stale-generations.ts',
  'src/lib/effects/video-storage.ts',
  'src/credits/daily-check-in.ts',
  'src/credits/distribute.ts',
  'src/credits/server.ts',
  'src/payment/index.ts',
  'src/payment/payment-status.ts',
  'src/payment/provider/stripe.ts',
  'src/payment/provider/zpay.ts',
] as const;

test('Vogue exposes the gptimg functional API route surface', () => {
  for (const file of routeFiles) {
    assert.ok(existsSync(join(process.cwd(), file)), `${file} is missing`);
  }
});

test('Vogue has the gptimg service-layer infrastructure behind those routes', () => {
  for (const file of serviceFiles) {
    assert.ok(existsSync(join(process.cwd(), file)), `${file} is missing`);
  }
});

test('database-backed infrastructure routes use concrete auth instead of a launch flag', () => {
  const databaseBackedRoutes = [
    'src/app/api/cleanup-stale-generations/route.ts',
    'src/app/api/distribute-credits/route.ts',
    'src/app/api/rewards/check-in/route.ts',
    'src/app/api/effects/process/route.ts',
  ] as const;

  for (const file of databaseBackedRoutes) {
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    assert.doesNotMatch(source, /requireGptimgInfraReady/);
    assert.doesNotMatch(source, /VOGUE_ENABLE_GPTIMG_DB_INFRA/);
  }

  const cleanupSource = readFileSync(
    join(process.cwd(), 'src/app/api/cleanup-stale-generations/route.ts'),
    'utf8'
  );
  const distributeSource = readFileSync(
    join(process.cwd(), 'src/app/api/distribute-credits/route.ts'),
    'utf8'
  );
  const processSource = readFileSync(
    join(process.cwd(), 'src/app/api/effects/process/route.ts'),
    'utf8'
  );
  const rewardsSource = readFileSync(
    join(process.cwd(), 'src/app/api/rewards/check-in/route.ts'),
    'utf8'
  );

  assert.match(cleanupSource, /requireCronRequest/);
  assert.match(distributeSource, /requireCronRequest/);
  assert.match(processSource, /requireCronRequest/);
  assert.match(rewardsSource, /getSession/);
});

test('prompt-library API is backed by Vogue prompt data instead of a placeholder', () => {
  const entriesSource = readFileSync(
    join(process.cwd(), 'src/app/api/gpt-image-2-prompts/entries/route.ts'),
    'utf8'
  );
  const downloadSource = readFileSync(
    join(process.cwd(), 'src/app/api/gpt-image-2-prompts/download/route.ts'),
    'utf8'
  );

  assert.match(entriesSource, /getFeaturedPromptEntries/);
  assert.match(downloadSource, /getPromptEntryById/);
  assert.doesNotMatch(entriesSource, /not implemented/i);
  assert.doesNotMatch(downloadSource, /not implemented/i);
});

test('anonymous generation accepts only prompt-library reference images', () => {
  const anonymousGenerateSource = readFileSync(
    join(process.cwd(), 'src/app/api/effects/anonymous-generate/route.ts'),
    'utf8'
  );

  assert.match(anonymousGenerateSource, /getAnonymousReferenceImageUrls/);
  assert.match(anonymousGenerateSource, /isAllowedPromptLibraryReferenceImageUrl/);
  assert.match(anonymousGenerateSource, /PROMPT_LIBRARY_REFERENCE_IMAGE_PATHS/);
  assert.match(anonymousGenerateSource, /image_urls: referenceImageUrls/);
  assert.match(anonymousGenerateSource, /Reference uploads require sign in\./);
});

test('anonymous trial status stays on the cookie-only fast path', () => {
  const anonymousTrialSource = readFileSync(
    join(process.cwd(), 'src/app/api/effects/anonymous-trial/route.ts'),
    'utf8'
  );

  assert.doesNotMatch(anonymousTrialSource, /getAnonymousTrialAvailability/);
  assert.match(anonymousTrialSource, /trialRemaining: trialUsed \? 0 : 1/);
});

test('R2 asset persistence uses the Vogue image bucket env only', () => {
  const storageConfigSource = readFileSync(
    join(process.cwd(), 'src/storage/config/storage-config.ts'),
    'utf8'
  );
  const directUploadSource = readFileSync(
    join(process.cwd(), 'src/storage/direct-upload.ts'),
    'utf8'
  );
  const outputAssetsSource = readFileSync(
    join(process.cwd(), 'src/lib/effects/output-assets.ts'),
    'utf8'
  );

  for (const source of [
    storageConfigSource,
    directUploadSource,
    outputAssetsSource,
  ]) {
    assert.match(source, /R2_IMAGE_BUCKET_NAME/);
    assert.doesNotMatch(source, /R2_BUCKET_NAME/);
  }
});
