import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('public prompt page reuses the full-screen detail-card layout instead of the site card layout', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const languageTrigger = source.slice(
    source.indexOf('vogue-prompt-language-trigger'),
    source.indexOf('aria-label="Prompt language"')
  );

  assert.match(source, /vogue-prompt-detail-page/);
  assert.match(source, /vogue-prompt-detail-surface/);
  assert.match(source, /vogue-prompt-detail-media/);
  assert.match(source, /vogue-prompt-detail-panel/);
  assert.match(source, /entry\.promptTranslations\?\.\[promptLanguageMode\]/);
  assert.match(source, /const promptLanguageOrder: VogueLocale\[\] = \[\s*'en'/);
  assert.match(source, /vogue-prompt-language-trigger/);
  assert.match(source, /vogue-prompt-language-menu/);
  assert.match(source, /setPromptLanguageMode\(mode\)/);
  assert.match(source, /vogue-prompt-language-trigger inline-flex h-8 w-auto items-center justify-center gap-1\.5/);
  assert.match(source, /Use as Ref/);
  assert.match(source, /Use as Prompt/);
  assert.doesNotMatch(source, /<select/);
  assert.doesNotMatch(source, /appearance-none/);
  assert.doesNotMatch(languageTrigger, /min-w-\[7\.5rem\]/);
  assert.doesNotMatch(languageTrigger, /justify-between/);
  assert.doesNotMatch(languageTrigger, /ring-1 ring-white\/80/);
  assert.doesNotMatch(source, /max-w-\[1480px\]/);
  assert.doesNotMatch(source, /Prompt ID \{entry\.publicId\}/);
  assert.doesNotMatch(source, /Original Prompt/);
});

test('public prompt page stays in one viewport while prompt text scrolls inside a compact card', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');

  assert.match(source, /h-dvh/);
  assert.match(source, /overflow-hidden/);
  assert.match(source, /grid-rows-\[auto_minmax\(0,1fr\)_auto\]/);
  assert.match(source, /vogue-prompt-text-scroll/);
  assert.match(source, /min-h-\[7\.25rem\]/);
  assert.match(source, /max-h-\[clamp\(136px,24vh,220px\)\]/);
  assert.match(source, /overflow-y-auto/);
  assert.match(source, /vogue-prompt-info-card/);
  assert.match(source, /vogue-prompt-info-card[^\n]+shrink-0/);
  assert.match(source, /max-h-\[min\(calc\(100dvh-8rem\),86vh\)\]/);
  assert.match(source, /max-w-\[min\(78%,980px\)\]/);
  assert.match(source, /rounded-\[18px\]/);
});

test('public prompt page uses polished competitor-style media controls', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');

  assert.match(source, /vogue-prompt-media-control/);
  assert.match(source, /vogue-prompt-media-counter/);
  assert.match(source, /h-\[34px\] w-\[34px\]/);
  assert.match(source, /h-\[34px\] min-w-\[46px\]/);
  assert.match(source, /font-\[var\(--font-vogue-display\)\]/);
  assert.match(source, /bg-white\/\[0\.72\]/);
  assert.match(source, /shadow-\[0_5px_14px_rgba\(15,23,42,0\.075\)\]/);
  assert.match(source, /backdrop-blur-xl/);
  assert.doesNotMatch(source, /h-12 w-12/);
  assert.doesNotMatch(source, /h-14 min-w-14/);
});

test('public prompt page keeps the right header compact and refined', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const header = source.slice(
    source.indexOf('vogue-prompt-panel-header'),
    source.indexOf('vogue-prompt-panel-body')
  );

  assert.match(source, /grid-cols-\[minmax\(0,1fr\)\]/);
  assert.match(source, /vogue-prompt-detail-panel grid h-dvh max-h-dvh min-w-0/);
  assert.match(source, /vogue-prompt-panel-header min-w-0 w-full max-w-full/);
  assert.match(source, /vogue-prompt-panel-body min-w-0 w-full max-w-full/);
  assert.match(source, /vogue-prompt-panel-footer min-w-0 w-full max-w-full/);
  assert.match(source, /px-5 pb-3\.5 pt-5/);
  assert.match(source, /vogue-prompt-title-line/);
  assert.match(source, /vogue-prompt-meta-row/);
  assert.match(source, /vogue-prompt-author-chip/);
  assert.match(source, /const metaChipClass =/);
  assert.match(header, /vogue-prompt-author-chip \$\{metaChipClass\}/);
  assert.match(header, /vogue-prompt-category-chip \$\{metaChipClass\}/);
  assert.match(header, /vogue-prompt-model-chip \$\{metaChipClass\}/);
  assert.match(source, /getAuthorHandleLabel\(entry\.authorHandle\)/);
  assert.match(source, /getPromptDetailCategoryLabel\(entry\)/);
  assert.match(source, /getModelIconPathByModelId\(entry\.modelId\)/);
  assert.match(source, /gptimage2: 'GPT Image'/);
  assert.match(header, /!text-\[1rem\]/);
  assert.match(header, /!leading-snug/);
  assert.match(header, /text-\[1rem\]/);
  assert.match(source, /h-7 shrink-0[^\n]+rounded-full/);
  assert.match(header, /className=\{`vogue-prompt-author-chip \$\{metaChipClass\}`\}/);
  assert.doesNotMatch(header, /href=\{entry\.sourceUrl\}/);
  assert.doesNotMatch(header, /IconBrandX/);
  assert.doesNotMatch(header, /ExternalLink/);
  assert.doesNotMatch(header, /text-\[1\.12rem\]/);
  assert.doesNotMatch(source, /entry\.authorName \|\| entry\.authorHandle \|\| 'V'/);
  assert.doesNotMatch(source, /vogue-prompt-author-line/);
  assert.doesNotMatch(source, /vogue-prompt-model-badge/);
  assert.doesNotMatch(source, /rounded-full bg-slate-950 text-\[13px\]/);
  assert.doesNotMatch(source, /gptimage2: 'GPT Image 2'/);
  assert.doesNotMatch(source, /text-\[1\.55rem\]/);
  assert.doesNotMatch(source, /entry\.publishedLabel \? \(/);
});

test('public prompt routes hide the global shell rails and occupy the full viewport', () => {
  const globals = read('src/app/globals.css');
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const shell = read('src/components/app/VogueSidebarShell.tsx');

  assert.match(source, /data-vogue-prompt-public-page/);
  assert.match(shell, /isPromptDetailRoute\(localePathname\)/);
  assert.match(shell, /vogue-shell prompt-detail-shell/);
  assert.match(globals, /\.vogue-shell:has\(\.vogue-prompt-detail-page\) \.vogue-sidebar/);
  assert.match(globals, /\.vogue-shell:has\(\.vogue-prompt-detail-page\) \.vogue-mobile-rail/);
  assert.match(globals, /\.vogue-shell:has\(\.vogue-prompt-detail-page\) \.vogue-shell-content/);
  assert.match(globals, /flex-basis: 100%/);
  assert.match(globals, /width: 100%/);
});
