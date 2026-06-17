import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('prompt runtime build reuses generatedAt when runtime content is unchanged', () => {
  const source = read('scripts/build-prompt-runtime-data.ts');

  assert.match(source, /resolveGeneratedAt/);
  assert.match(source, /readFileSync\(RUNTIME_DATA_PATH/);
  assert.match(source, /withoutGeneratedAt/);
  assert.doesNotMatch(source, /generatedAt:\s*new Date\(\)\.toISOString\(\)/);
});
