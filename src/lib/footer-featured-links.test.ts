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

test('footer featured links include the requested Indie.Deals, Tool Journey, and Startup AIdeas links', () => {
  const footerSource = readFileSync(
    join(process.cwd(), 'src/components/common/Footer.tsx'),
    'utf8'
  );

  const requestedLinks = [
    'https://indie.deals?ref=https%3A%2F%2Fvogueai.net%2F',
    'https://tooljourney.com/tool/vogueai',
    'https://startupaideas.com/ai/vogueai',
  ];

  for (const href of requestedLinks) {
    const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(footerSource, new RegExp(`href:\\s*'${escapedHref}'`));
  }

  assert.match(
    footerSource,
    /imageSrc:\s*'https:\/\/tooljourney\.com\/assets\/images\/badge-dark\.png'/
  );
  assert.match(
    footerSource,
    /imageSrc:\s*'https:\/\/startupaideas\.com\/assets\/images\/badge-dark\.png'/
  );
});
