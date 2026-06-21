import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

test('footer featured links include SeekAIs with the requested external attributes', () => {
  const footerSource = readFileSync(
    join(process.cwd(), 'src/components/common/Footer.tsx'),
    'utf8'
  );

  assert.match(
    footerSource,
    /\{\s*href:\s*'https:\/\/SeekAIs\.com\/',\s*label:\s*'SeekAIs - AI Tools Directory',\s*title:\s*'SeekAIs',?\s*\}/
  );
});
