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
  assert.match(source, /const getImagePrompt = \(/);
  assert.match(source, /imagePrompt\?\.promptTranslations\?\.\[mode\]/);
  assert.match(source, /entry\.promptTranslations\?\.\[mode\]/);
  assert.match(source, /getAvailablePromptLanguages\(entry, activeImageIndex\)/);
  assert.match(source, /setLanguageMenuOpen\(false\)/);
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

test('public prompt page respects taxonomy category labels instead of overriding art prompts by title keywords', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const categoryHelper = source.slice(
    source.indexOf('const getPromptDetailCategoryLabel'),
    source.indexOf('const getAuthorHandleLabel')
  );

  assert.match(categoryHelper, /=>\s*getCategoryLabel\(entry\.categoryKey\)/);
  assert.doesNotMatch(categoryHelper, /poster\|key visual/);
});

test('public prompt page stays in one viewport while prompt text scrolls inside a compact card', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');

  assert.match(source, /h-dvh/);
  assert.match(source, /overflow-hidden/);
  assert.match(source, /grid-rows-\[auto_minmax\(0,1fr\)_auto\]/);
  assert.match(source, /vogue-prompt-text-scroll/);
  assert.match(source, /min-h-\[12rem\]/);
  assert.match(source, /max-h-\[clamp\(220px,38vh,420px\)\]/);
  assert.match(source, /overflow-y-auto/);
  assert.match(source, /vogue-prompt-info-card/);
  assert.match(source, /vogue-prompt-info-card[^\n]+shrink-0/);
  assert.match(source, /max-h-\[min\(calc\(100dvh-8rem\),86vh\)\]/);
  assert.match(source, /max-w-\[min\(78%,980px\)\]/);
  assert.match(source, /rounded-\[18px\]/);
});

test('public prompt page keeps SEO detail content behind a compact more-details popover', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');

  assert.match(source, /getPromptDetailInsights\(entry\)/);
  assert.match(source, /const \[moreDetailsOpen, setMoreDetailsOpen\] = useState\(false\)/);
  assert.match(source, /const moreDetailsRef = useRef<HTMLDetailsElement \| null>\(null\)/);
  assert.match(source, /if \(!moreDetailsOpen\) return/);
  assert.match(source, /moreDetailsRef\.current\?\.contains\(target\)/);
  assert.match(source, /document\.addEventListener\('pointerdown', handlePointerDown, true\)/);
  assert.match(source, /document\.removeEventListener\('pointerdown', handlePointerDown, true\)/);
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /setMoreDetailsOpen\(false\)/);
  assert.match(source, /vogue-prompt-more-details/);
  assert.match(source, /ref=\{moreDetailsRef\}/);
  assert.match(source, /open=\{moreDetailsOpen\}/);
  assert.match(source, /onToggle=\{\(event\) => setMoreDetailsOpen\(event\.currentTarget\.open\)\}/);
  assert.match(source, /More details/);
  assert.match(source, /vogue-prompt-seo-popover/);
  assert.match(source, /Prompt details/);
  assert.match(source, /fixed bottom-\[7\.25rem\] left-5 right-5 z-50/);
  assert.match(source, /lg:left-auto lg:right-6/);
  assert.match(source, /lg:w-\[min\(400px,calc\(31vw-2rem\)\)\]/);
  assert.match(source, /lg:max-h-\[min\(360px,calc\(100dvh-10rem\)\)\]/);
  assert.match(source, /<DetailPopoverSection title="Why it works">/);
  assert.match(source, /<DetailPopoverSection title="Prompt anatomy">/);
  assert.match(source, /<DetailPopoverSection title="Variables">/);
  assert.match(source, /<DetailPopoverSection title="Best uses">/);
  assert.match(source, /<DetailPopoverSection title="Try variations">/);
  assert.match(source, /promptInsights\.adaptationTips\.map/);
  assert.match(source, /<details/);
  assert.match(source, /overflow-y-auto/);
  assert.doesNotMatch(source, /bottom-\[calc\(100%\+0\.65rem\)\]/);
  assert.doesNotMatch(source, /vogue-prompt-seo-card/);
  assert.doesNotMatch(source, /function InsightSection/);
  assert.doesNotMatch(source, /<h2 className/);
});

test('public prompt page highlights remix-ready prompt variables inside the prompt box', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const transferHelper = source.slice(
    source.indexOf('const persistPromptTransfer'),
    source.indexOf('const persistReferenceTransfer')
  );
  const remixTokenSnippet = source.slice(
    Math.max(source.indexOf('vogue-prompt-remix-token') - 800, 0),
    source.indexOf('vogue-prompt-remix-token') + 900
  );

  assert.match(source, /activePromptRemixId/);
  assert.match(source, /getPromptRemixSchema\(activePromptRemixId,\s*entry\.id\)/);
  assert.match(source, /vogue-prompt-remix-token/);
  assert.match(remixTokenSnippet, /<span/);
  assert.match(remixTokenSnippet, /role="button"/);
  assert.match(remixTokenSnippet, /tabIndex=\{0\}/);
  assert.doesNotMatch(source, /vogue-prompt-keep-token/);
  assert.doesNotMatch(source, /vogue-composer-keep-token/);
  assert.match(source, /formatPromptForRemixDisplay\(remixedPrompt\)/);
  assert.match(source, /whitespace-normal break-words/);
  assert.match(source, /box-decoration-clone/);
  assert.match(source, /rounded-full px-1\.5 py-\[1px\]/);
  assert.match(source, /border-\[#8bbdc5\] bg-\[#e9f7f8\] text-\[#245966\]/);
  assert.match(source, /border-\[#4f9baa\] bg-\[#d8f0f3\] text-\[#174653\]/);
  assert.doesNotMatch(source, /border-\[#d9e2eb\] bg-\[#f7fafc\] text-\[#3f5368\]/);
  assert.doesNotMatch(source, /border-\[#aebdca\] bg-\[#edf2f6\] text-\[#243447\]/);
  assert.doesNotMatch(source, /text-\[#2d5f91\]/);
  assert.doesNotMatch(source, /border-\[#9fc5f3\]/);
  assert.doesNotMatch(source, /bg-\[#f3f8ff\]/);
  assert.doesNotMatch(source, /isLongToken/);
  assert.doesNotMatch(source, /border-transparent bg-\[#edf6ff\]\/75/);
  assert.doesNotMatch(remixTokenSnippet, /<button/);
  assert.match(source, /Swap the subject\. Keep the look\./);
  assert.match(source, /Change Variable/);
  assert.doesNotMatch(source, /Custom replacement/);
  assert.match(source, /currentPromptForActions/);
  assert.match(transferHelper, /prompt: currentPromptForActions/);
  assert.doesNotMatch(source, /schema-ready prompt/i);
});

test('public prompt page displays prompts as lightly spaced schema-like paragraphs while keeping variable pills inline', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const promptBox = source.slice(
    source.indexOf('vogue-prompt-copy-card'),
    source.indexOf('vogue-prompt-info-card')
  );

  assert.match(source, /buildPromptDisplaySections/);
  assert.match(source, /promptDisplaySections/);
  assert.match(source, /renderPromptSectionContent/);
  assert.match(promptBox, /vogue-prompt-section-list/);
  assert.match(promptBox, /vogue-prompt-section-text/);
  assert.match(promptBox, /space-y-2\.5/);
  assert.match(promptBox, /renderPromptSectionContent/);
  assert.match(source, /vogue-prompt-remix-token/);
  assert.doesNotMatch(promptBox, /remixSegments\.map/);
  assert.doesNotMatch(promptBox, /vogue-prompt-section-label/);
  assert.doesNotMatch(promptBox, /border-t border-slate-200/);
});

test('public prompt page renders related prompts as lightweight detail links', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');

  assert.match(source, /relatedPrompts = \[\]/);
  assert.match(source, /vogue-prompt-related-list/);
  assert.match(source, /vogue-prompt-related-row/);
  assert.match(source, /More related prompts/);
  assert.match(source, /relatedPrompts\.map\(\(relatedPrompt\)/);
  assert.match(source, /getPromptPagePath\(relatedPrompt\)/);
  assert.match(source, /\{relatedPrompt\.title\}/);
  assert.match(source, /line-clamp-2/);

  const relatedSection = source.slice(
    source.indexOf('vogue-prompt-related-list'),
    source.indexOf('vogue-prompt-more-details')
  );

  assert.match(relatedSection, /alt=""/);
  assert.match(relatedSection, /ChevronRight/);
  assert.match(relatedSection, /h-\[44px\] w-\[44px\]/);
  assert.doesNotMatch(relatedSection, /rounded-\[16px\] bg-white px-4 py-3 shadow/);
  assert.doesNotMatch(relatedSection, /grid-cols-\[46px_minmax\(0,1fr\)\]/);
  assert.doesNotMatch(relatedSection, /Use as Prompt|Use as Ref|Copy prompt/);
  assert.doesNotMatch(relatedSection, /onClick=/);
  assert.doesNotMatch(relatedSection, /button/);
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
  assert.match(source, /grid-rows-\[44dvh_56dvh\]/);
  assert.match(source, /lg:grid-rows-none/);
  assert.match(source, /vogue-prompt-detail-media relative h-\[44dvh\]/);
  assert.match(source, /vogue-prompt-detail-panel grid h-\[56dvh\] max-h-\[56dvh\] min-w-0/);
  assert.match(source, /lg:h-dvh lg:max-h-dvh/);
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

test('public prompt page links the model chip back to its prompt hub', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const header = source.slice(
    source.indexOf('vogue-prompt-panel-header'),
    source.indexOf('vogue-prompt-panel-body')
  );

  assert.match(source, /const MODEL_PROMPT_HUB_HREFS/);
  assert.match(source, /gptimage2:\s*'\/gpt-image-prompt'/);
  assert.match(source, /nanobanana:\s*'\/nano-banana-prompt'/);
  assert.match(source, /midjourney:\s*'\/midjourney-prompt'/);
  assert.match(source, /const modelHubHref = getModelPromptHubHref\(entry\.modelId\)/);
  assert.match(header, /href=\{modelHubHref\}/);
  assert.match(header, /vogue-prompt-model-chip \$\{metaChipClass\}/);
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
