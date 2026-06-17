import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('wrangler config keeps production URLs inside explicit environments', () => {
  const wranglerConfig = read('wrangler.jsonc');
  const topLevelVars =
    wranglerConfig.match(/"vars"\s*:\s*\{([\s\S]*?)\n  \}/)?.[1] ?? '';

  assert.match(wranglerConfig, /"env"\s*:\s*\{/);
  assert.match(wranglerConfig, /"staging"\s*:\s*\{/);
  assert.match(wranglerConfig, /"production"\s*:\s*\{/);
  assert.doesNotMatch(topLevelVars, /"NEXT_PUBLIC_BASE_URL"\s*:\s*"https:\/\/vogueai\.net"/);
  assert.doesNotMatch(topLevelVars, /"KIE_CALLBACK_URL"\s*:\s*"https:\/\/vogueai\.net\/api\/effects\/callback"/);
});

test('wrangler environments explicitly bind Hyperdrive', () => {
  const wranglerConfig = JSON.parse(read('wrangler.jsonc')) as {
    env?: Record<string, { hyperdrive?: Array<{ binding?: string; id?: string }> }>;
  };

  for (const environment of ['staging', 'production']) {
    assert.deepEqual(wranglerConfig.env?.[environment]?.hyperdrive, [
      {
        binding: 'HYPERDRIVE',
        id: 'b7648f9defb94c2daf71f91bf4b92bef',
      },
    ]);
  }
});

test('Cloudflare deploy script requires an explicit target environment', () => {
  const deployScript = read('scripts/run-cf-deploy.ts');

  assert.match(deployScript, /readTargetEnv/);
  assert.match(deployScript, /--env/);
  assert.match(deployScript, /staging/);
  assert.match(deployScript, /production/);
  assert.match(deployScript, /--confirm-production/);
});
