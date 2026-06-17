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

test('public prompt page uses the active image title while keeping the curated runtime title as fallback', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');
  const titleBlock = source.slice(
    source.indexOf('const entryDisplayTitle'),
    source.indexOf('const authorHandleLabel')
  );
  const imageTitleHelperBlock = source.slice(
    source.indexOf('const getImageHref'),
    source.indexOf('const availablePromptLanguages')
  );
  const mediaBlock = source.slice(
    source.indexOf('resultImageAlt={activeImageAlt}'),
    source.indexOf('vogue-prompt-thumbnail-rail')
  );
  const thumbnailBlock = source.slice(
    source.indexOf('vogue-prompt-thumbnail-rail'),
    source.indexOf('vogue-prompt-detail-panel')
  );

  assert.match(titleBlock, /const entryDisplayTitle = entry\.title;/);
  assert.match(titleBlock, /activeImagePrompt\?\.title\?\.trim\(\) \|\| entryDisplayTitle/);
  assert.match(titleBlock, /const activeImageAlt = activeDisplayTitle;/);
  assert.match(imageTitleHelperBlock, /const getImageDisplayTitle = \(imageIndex: number\) =>/);
  assert.match(mediaBlock, /alt=\{activeImageAlt\}/);
  assert.match(thumbnailBlock, /alt=\{getImageDisplayTitle\(imageIndex\)\}/);
  assert.match(thumbnailBlock, /aria-label=\{`Show \$\{getImageDisplayTitle\(imageIndex\)\}`\}/);
  assert.doesNotMatch(titleBlock, /entry\.sourceTitle\s*\|\|/);
});

test('prompt page metadata follows the selected image title and description', () => {
  const source = read('src/app/prompt/[slug]/page.tsx');
  const metadataBlock = source.slice(
    source.indexOf('const buildPromptPageMetadataForImage'),
    source.indexOf('export function generateStaticParams')
  );

  assert.match(metadataBlock, /const imagePromptTitle = promptEntry\.imagePrompts\?\.\[imageIndex\]\?\.title\?\.trim\(\);/);
  assert.match(metadataBlock, /const title = `\$\{imagePromptTitle\} \| Vogue AI`;/);
  assert.match(metadataBlock, /metadata\.description\.replace\(promptEntry\.title, imagePromptTitle\)/);
  assert.match(metadataBlock, /openGraph:\s*\{[\s\S]*title,[\s\S]*description,[\s\S]*images:/);
  assert.match(metadataBlock, /twitter:\s*\{[\s\S]*title,[\s\S]*description,[\s\S]*images:/);
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
  assert.match(source, /const activeImageWidth = activeImageAsset\?\.width/);
  assert.match(source, /const activeImageHeight = activeImageAsset\?\.height/);
  assert.match(source, /measuredImageDimensionsBySrc/);
  assert.match(source, /recordActiveImageDimensions/);
  assert.match(source, /const sourceActiveImageDimensions =/);
  assert.match(source, /const activeImageDimensions =/);
  assert.match(source, /typeof activeImageWidth === 'number' && typeof activeImageHeight === 'number'/);
  assert.match(source, /sourceActiveImageDimensions \?\? measuredActiveImageDimensions \?\? null/);
  assert.match(source, /const activeImageHasSourceDimensions = Boolean\(sourceActiveImageDimensions\)/);
  assert.match(source, /const activeImageIsPortrait =/);
  assert.match(source, /activeImageDimensions\.height > activeImageDimensions\.width/);
  assert.match(source, /:\s*null/);
  assert.match(source, /const activeImageSizingClass = activeImageIsPortrait/);
  assert.match(source, /lg:h-\[min\(calc\(100dvh-8rem\),86vh\)\] lg:w-auto lg:max-h-\[min\(calc\(100dvh-8rem\),86vh\)\] lg:max-w-\[min\(92%,1120px\)\]/);
  assert.match(source, /lg:h-auto lg:w-\[min\(90%,1120px\)\] lg:max-h-\[min\(calc\(100dvh-8rem\),86vh\)\] lg:max-w-none/);
  assert.match(source, /lg:h-auto lg:w-auto lg:max-h-\[min\(calc\(100dvh-8rem\),86vh\)\] lg:max-w-\[min\(92%,1120px\)\]/);
  assert.match(source, /activeImageAsset && activeImageHasSourceDimensions/);
  assert.match(source, /<img/);
  assert.match(source, /recordActiveImageDimensions\(event\.currentTarget\)/);
  assert.doesNotMatch(source, /lg:max-w-\[min\(78%,980px\)\]/);
  assert.match(source, /rounded-\[18px\]/);
});

test('public prompt page uses the split media layout before the lg breakpoint', () => {
  const source = read('src/components/prompts/PromptPublicPage.tsx');

  assert.match(
    source,
    /md:grid-cols-\[minmax\(0,1fr\)_minmax\(340px,34vw\)\]/
  );
  assert.match(source, /md:grid-rows-none/);
  assert.match(
    source,
    /vogue-prompt-detail-media[^\n]+md:h-dvh md:max-h-dvh/
  );
  assert.match(
    source,
    /vogue-prompt-media-stage[^\n]+md:h-dvh md:max-h-dvh md:px-8 md:py-20/
  );
  assert.match(
    source,
    /vogue-prompt-detail-panel[^\n]+md:h-dvh md:max-h-dvh md:border-l md:border-t-0/
  );
  assert.match(
    source,
    /md:h-\[min\(calc\(100dvh-7rem\),88vh\)\] md:w-auto md:max-h-\[min\(calc\(100dvh-7rem\),88vh\)\] md:max-w-\[min\(92%,980px\)\]/
  );
  assert.match(
    source,
    /md:h-auto md:w-\[min\(90%,980px\)\] md:max-h-\[min\(calc\(100dvh-7rem\),88vh\)\] md:max-w-none/
  );
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
    Math.max(source.indexOf('role="button"') - 800, 0),
    source.indexOf('role="button"') + 900
  );

  assert.match(source, /activePromptRemixId/);
  assert.match(source, /getPromptRemixSchema\(activePromptRemixId,\s*entry\.id\)/);
  assert.match(source, /visiblePrompt\.includes\(variable\.defaultValue\)/);
  assert.match(source, /vogue-prompt-remix-token/);
  assert.match(remixTokenSnippet, /<span/);
  assert.match(remixTokenSnippet, /role="button"/);
  assert.match(remixTokenSnippet, /tabIndex=\{0\}/);
  assert.doesNotMatch(source, /vogue-prompt-keep-token/);
  assert.doesNotMatch(source, /vogue-composer-keep-token/);
  assert.match(source, /formatPromptForRemixDisplay\(remixedPrompt\)/);
  assert.match(source, /whitespace-normal break-words/);
  assert.match(source, /box-decoration-clone/);
  assert.match(source, /rounded-\[999px\] px-1\.5 py-\[1px\]/);
  assert.match(source, /vogue-prompt-remix-token[^\n]+font-normal/);
  assert.match(source, /const remixTokenActiveClassName/);
  assert.match(source, /border-\[#B6DD21\] bg-\[#D1FE17\] text-slate-950/);
  assert.match(source, /shadow-\[2px_2px_0_#ffffff,2px_2px_0_1px_rgba\(15,23,42,0\.10\),0_8px_18px_rgba\(209,254,23,0\.16\)\]/);
  assert.match(source, /border-\[#C9DF60\] bg-\[#FCFFF0\] text-slate-900/);
  assert.match(source, /hover:border-\[#B6DD21\] hover:bg-\[#F2FF9A\]/);
  assert.doesNotMatch(source, /border-slate-300\/70 bg-white\/75 text-slate-800/);
  assert.doesNotMatch(source, /border-slate-950\/40 bg-white text-slate-950/);
  assert.doesNotMatch(source, /border-\[#8bbdc5\] bg-\[#e9f7f8\] text-\[#245966\]/);
  assert.doesNotMatch(source, /border-\[#4f9baa\] bg-\[#d8f0f3\] text-\[#174653\]/);
  assert.doesNotMatch(source, /text-\[#2d5f91\]/);
  assert.doesNotMatch(source, /border-\[#9fc5f3\]/);
  assert.doesNotMatch(source, /bg-\[#f3f8ff\]/);
  assert.doesNotMatch(source, /isLongToken/);
  assert.doesNotMatch(source, /border-transparent bg-\[#edf6ff\]\/75/);
  assert.doesNotMatch(remixTokenSnippet, /<button/);
  assert.match(source, /Swap the subject\. Keep the look\./);
  assert.match(source, /mt-3 rounded-\[24px\] border-0 border-r-2 border-b-2 border-\[#B6DD21\]/);
  assert.match(source, /bg-\[#D1FE17\]/);
  assert.doesNotMatch(source, /bg-\[#D7FF00\]/);
  assert.doesNotMatch(source, /bg-\[#F0FF78\]/);
  assert.doesNotMatch(source, /linear-gradient\(135deg,#F0FF78_0%,#F8FFB8_46%,#FFFEF5_100%\)/);
  assert.doesNotMatch(source, /radial-gradient\(circle_at_8%_0%/);
  assert.match(source, /shadow-\[5px_5px_0_rgba\(255,255,255,0\.9\),5px_5px_0_1px_rgba\(209,254,23,0\.22\)/);
  assert.doesNotMatch(source, /mt-3 rounded-\[24px\] border-2 border-\[#B6DD21\]/);
  assert.doesNotMatch(source, /ring-1 ring-white\/90/);
  assert.doesNotMatch(source, /shadow-\[12px_12px_0/);
  assert.match(source, /const remixSuggestionButtonActiveClassName/);
  assert.match(source, /rounded-\[15px\] border-2 px-3\.5 py-2 text-\[12px\] font-normal/);
  assert.match(source, /border-\[#B6DD21\] bg-\[#D1FE17\] shadow-\[8px_8px_0_#ffffff/);
  assert.match(source, /border-\[#D1D8E8\] bg-white hover:border-\[#B6DD21\] hover:bg-\[#FBFFE8\]/);
  assert.match(source, /suggestion === customRemixValue/);
  assert.match(source, /setCustomRemixValue\(suggestion\)/);
  assert.doesNotMatch(source, /activeRemixVariableKey === key/);
  assert.doesNotMatch(source, /updateRemixVariable\(\s*activeRemixVariable\.key,\s*suggestion\s*\)/);
  assert.match(source, /h-10 min-w-0 rounded-\[13px\] border border-\[#D1D8E8\] bg-white/);
  assert.match(source, /inline-flex h-10 items-center justify-center whitespace-nowrap rounded-\[13px\] bg-slate-950 px-4 text-\[13px\] font-medium/);
  assert.doesNotMatch(source, /border-\[#B8C6D8\] bg-\[#F4F7FB\] text-slate-800/);
  assert.doesNotMatch(source, /border-\[#6F86A8\] bg-\[#EEF4FF\]/);
  assert.doesNotMatch(source, /rounded-full border border-\[#C9D3E1\] bg-\[#F8FAFD\]/);
  assert.doesNotMatch(source, /border-\[#9bcbd2\]\/80 bg-\[#f2fbfc\]/);
  assert.doesNotMatch(source, /border-\[#b7d8de\]/);
  assert.doesNotMatch(source, /bg-\[#174653\]/);
  assert.doesNotMatch(source, /hover:bg-\[#245966\]|hover:bg-\[#0f3540\]/);
  assert.match(source, /Change Variable/);
  assert.doesNotMatch(source, /Custom replacement/);
  assert.match(source, /currentPromptForActions/);
  assert.match(transferHelper, /prompt: currentPromptForActions/);
  assert.doesNotMatch(source, /promptLanguageMode === 'original'/);
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
