import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

test('root layout keeps the Bing Webmaster verification meta tag in the head', () => {
  const rootLayout = read('src/app/layout.tsx');
  const headMatch = rootLayout.match(/<head>[\s\S]*?<\/head>/);

  assert.ok(headMatch, 'root layout should render a head section');
  assert.match(
    headMatch[0],
    /<meta\s+name="msvalidate\.01"\s+content="0D6AAD46F945AF92BE8D6CBF6D477A8C"\s*\/>/
  );
});
