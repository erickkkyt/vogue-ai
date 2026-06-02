import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('localized layout updates html lang without rendering raw script tags', () => {
  const localeLayout = read('src/app/[locale]/layout.tsx');

  assert.match(localeLayout, /<HtmlLangEffect locale=\{locale\} \/>/);
  assert.doesNotMatch(localeLayout, /<script\b/);
  assert.doesNotMatch(localeLayout, /document\.documentElement\.lang/);
});
