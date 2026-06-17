import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('Cloudflare database access uses request-scoped reuse instead of per-call clients', () => {
  const source = read('src/db/index.ts');

  assert.match(source, /AsyncLocalStorage/);
  assert.match(source, /requestDbStorage/);
  assert.match(source, /withDbRequestContext/);
  assert.match(source, /requestDbStorage\.getStore\(\)/);
  assert.doesNotMatch(
    source,
    /globalThis\.vogueDb[\s\S]*isCloudflareWorkerRuntime/
  );
});

test('database-heavy route handlers enter the request db context', () => {
  for (const route of [
    'src/app/api/effects/generate/route.ts',
    'src/app/api/effects/status/route.ts',
    'src/app/api/effects/callback/route.ts',
    'src/app/api/payment/create-checkout/route.ts',
    'src/app/api/payment/create-zpay-checkout/route.ts',
  ]) {
    const source = read(route);

    assert.match(source, /withDbRequestContext/);
    assert.match(source, /return withDbRequestContext\(\(\) =>/);
  }
});
