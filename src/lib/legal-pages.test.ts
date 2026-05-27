import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const readPage = (path: string) =>
  readFileSync(join(process.cwd(), path), 'utf8');

test('terms describe the Vogue AI image generation and credit product', () => {
  const terms = readPage('src/app/terms-of-service/page.tsx');

  assert.match(terms, /AI image prompts, reference images, generated outputs/);
  assert.match(terms, /credits, subscriptions, and one-time credit packs/);
  assert.match(terms, /Stripe, ZPAY, Alipay, and WeChat Pay/);
  assert.match(terms, /Prompt and output safety rules/);
  assert.doesNotMatch(
    terms,
    /following Terms of Use \("Terms"\) related to the use of Google Login/
  );
});

test('privacy policy names the real Vogue AI processors and generated-content data', () => {
  const privacy = readPage('src/app/privacy-policy/page.tsx');

  assert.match(privacy, /prompts, reference images, uploaded assets, generated outputs/);
  assert.match(privacy, /Google OAuth, Better Auth, Stripe, ZPAY, Cloudflare R2/);
  assert.match(privacy, /KIE, Evolink, 302\.ai/);
  assert.match(privacy, /Microsoft Clarity and Google Analytics/);
  assert.doesNotMatch(privacy, /Your privacy is our priority/);
});

test('legal pages do not render a right-side visual aside in the hero', () => {
  const legalPage = readPage('src/components/legal/VogueLegalPage.tsx');

  assert.doesNotMatch(legalPage, /VogueBrandWord/);
  assert.doesNotMatch(legalPage, /lg:grid-cols-\[minmax\(0,1fr\)_340px\]/);
  assert.doesNotMatch(legalPage, /asideText/);
});

test('legal pages keep the hero concise and use the shared footer', () => {
  const legalPage = readPage('src/components/legal/VogueLegalPage.tsx');
  const terms = readPage('src/app/terms-of-service/page.tsx');
  const privacy = readPage('src/app/privacy-policy/page.tsx');

  assert.match(legalPage, /import Footer from '@\/components\/common\/Footer'/);
  assert.match(legalPage, /<Footer \/>/);
  assert.match(legalPage, /description\?: string/);
  assert.match(legalPage, /description \?/);
  assert.doesNotMatch(legalPage, /eyebrow/);
  assert.doesNotMatch(legalPage, /relatedLink/);
  assert.doesNotMatch(legalPage, /ShieldCheck/);
  assert.doesNotMatch(legalPage, /ArrowRight/);
  assert.doesNotMatch(terms, /description="These Terms govern/);
  assert.doesNotMatch(privacy, /description="This policy explains/);
  assert.doesNotMatch(terms, /Read Privacy Policy/);
  assert.doesNotMatch(privacy, /Read Terms of Service/);
  assert.doesNotMatch(terms, /eyebrow="Legal"/);
  assert.doesNotMatch(privacy, /eyebrow="Legal"/);
});

test('privacy usage notice renders near the footer instead of the top intro', () => {
  const legalPage = readPage('src/components/legal/VogueLegalPage.tsx');
  const privacy = readPage('src/app/privacy-policy/page.tsx');

  assert.match(privacy, /closingNotice=\{/);
  assert.doesNotMatch(privacy, /intro=\{[\s\S]*By using Vogue AI/);
  assert.ok(legalPage.indexOf('{closingNotice}') < legalPage.indexOf('<Footer />'));
});

test('blog footer is present for both root and localized blog routes', () => {
  const blogLayout = readPage('src/app/blog/layout.tsx');
  const localizedBlogLayout = readPage('src/app/[locale]/blog/layout.tsx');

  assert.match(blogLayout, /<Footer \/>/);
  assert.match(localizedBlogLayout, /<Footer \/>/);
});
