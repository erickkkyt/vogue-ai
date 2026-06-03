import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

test('blog list cards keep the desktop image frame square and compact', () => {
  const source = read('src/components/blog/VogueBlogIndex.tsx');

  assert.match(source, /md:h-\[202px\]/);
  assert.match(source, /md:grid-cols-\[200px_minmax\(0,1fr\)\]/);
  assert.match(source, /className="relative h-\[128px\][^"]*md:h-full/);
  assert.match(source, /unoptimized=\{isRemoteBlogImage\(post\.image\)\}/);
  assert.doesNotMatch(source, /md:h-\[216px\]/);
});

test('blog cards do not render generic model chips', () => {
  const source = read('src/components/blog/VogueBlogIndex.tsx');

  assert.doesNotMatch(source, /modelTagItems\.slice/);
  assert.doesNotMatch(source, /tag\.title/);
});

test('blog index keeps the featured guide header unframed', () => {
  const source = read('src/components/blog/VogueBlogIndex.tsx');

  assert.match(
    source,
    /<section className="px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pb-7 lg:pt-10">/
  );
  assert.doesNotMatch(source, /border-b border-\[var\(--vogue-border\)\]/);
  assert.doesNotMatch(source, /bg-\[linear-gradient\(180deg,#fffaf7_0%,#fbf2ed_100%\)\]/);
});

test('blog index renders the full hero title with the Vogue brand word style', () => {
  const source = read('src/components/blog/VogueBlogIndex.tsx');

  assert.match(source, /<VogueBrandWord[\s\S]*text=\{copy\.heading\}/);
  assert.doesNotMatch(source, /<\/VogueBrandWord>\s*\{copy\.heading\}/);
});

test('blog detail keeps the article header text-led without repeating the cover image', () => {
  const source = read('src/components/blog/VogueBlogPost.tsx');

  assert.match(source, /lg:py-9/);
  assert.match(source, /mt-4 max-w-6xl/);
  assert.match(source, /<h1 className="mt-3 max-w-6xl/);
  assert.match(source, /<p className="mt-3 max-w-5xl/);
  assert.doesNotMatch(source, /src=\{post\.image\}/);
  assert.doesNotMatch(source, /alt=\{post\.imageAlt\}/);
  assert.doesNotMatch(source, /priority/);
});

test('blog detail bypasses Next image optimization for remote prompt-library images', () => {
  const source = read('src/components/blog/VogueBlogPost.tsx');

  assert.match(source, /function isRemoteBlogImage/);
  assert.match(source, /media\.vogueai\.net\/blog\/auto\//);
  assert.match(source, /aspectRatio: `\$\{width\} \/ \$\{height\}`/);
  assert.match(source, /<Image[\s\S]*fill[\s\S]*unoptimized=\{isRemoteBlogImage\(block\.src\)\}/);
  assert.match(source, /unoptimized=\{isRemoteBlogImage\(block\.src\)\}/);
  assert.doesNotMatch(source, /unoptimized=\{isRemoteBlogImage\(post\.image\)\}/);
});

test('blog detail omits the generic model sidebar block', () => {
  const source = read('src/components/blog/VogueBlogPost.tsx');

  assert.doesNotMatch(source, /copy\.modelsLabel/);
  assert.doesNotMatch(source, /post\.modelTagItems\.map/);
  assert.doesNotMatch(source, /copy\.galleryDescription/);
  assert.doesNotMatch(source, /copy\.galleryCta/);
});

test('blog detail renders structured decision tables inside articles', () => {
  const postSource = read('src/components/blog/VogueBlogPost.tsx');
  const pageSource = read('src/app/[locale]/blog/[slug]/page.tsx');

  assert.match(postSource, /block\.type === 'table'/);
  assert.match(postSource, /<table className=/);
  assert.match(postSource, /block\.headers\.map/);
  assert.match(pageSource, /block\.type === 'table'/);
  assert.match(pageSource, /block\.headers\.join/);
});

test('blog detail emits FAQ structured data when article content includes FAQ blocks', () => {
  const source = read('src/app/[locale]/blog/[slug]/page.tsx');

  assert.match(source, /function getFaqEntriesFromBlocks/);
  assert.match(source, /'@type': 'FAQPage'/);
  assert.match(source, /acceptedAnswer/);
});
