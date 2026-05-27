import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('KIE callback fails closed when webhook signing key is not configured', () => {
  const callbackRoute = read('src/app/api/effects/callback/route.ts');

  assert.match(callbackRoute, /process\.env\.KIE_WEBHOOK_SECRET/);
  assert.match(callbackRoute, /status:\s*503/);
  assert.doesNotMatch(callbackRoute, /if \(!signingKey\) return \{ ok: true \}/);
});

test('asset downloads stream upstream responses instead of buffering them', () => {
  const downloadRoute = read('src/app/api/assets/download/route.ts');

  assert.match(downloadRoute, /upstream\.body/);
  assert.doesNotMatch(downloadRoute, /arrayBuffer\(\)/);
});
