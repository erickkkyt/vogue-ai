import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('shared VoguePromptComposer owns the composer, model select, parameter popover, and credits display', () => {
  const composerPath = 'src/components/app/VoguePromptComposer.tsx';
  assert.equal(existsSync(join(root, composerPath)), true);

  const source = read(composerPath);
  const modelSelect = source.slice(
    source.indexOf('function VogueModelSelect'),
    source.indexOf('function VogueParameterPopover')
  );
  assert.match(source, /export function VoguePromptComposer/);
  assert.match(source, /function VogueModelSelect/);
  assert.match(source, /function VogueModelIcon/);
  assert.match(source, /function VogueParameterPopover/);
  assert.match(source, /function VogueCreditsDisplay/);
  assert.match(source, /onGenerateNavigate/);
  assert.match(source, /referenceItems/);
  assert.match(source, /group\/reference-images/);
  assert.match(source, /const idleGenerateLabel = copy\.composer\.generate/);
  assert.match(source, /const busyGenerateLabel = copy\.composer\.generating/);
  assert.doesNotMatch(source, /Use Now/);
  assert.match(modelSelect, /flex h-5 w-5 shrink-0 items-center justify-center text-slate-950/);
  assert.match(modelSelect, /'flex h-5 w-5 shrink-0 items-center justify-center'/);
  assert.doesNotMatch(modelSelect, /h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/);
  assert.doesNotMatch(modelSelect, /h-10 w-10 shrink-0 items-center justify-center rounded-\[12px\] border border-slate-200 bg-white/);
  assert.match(modelSelect, /text-\[14px\] font-medium tracking-normal/);
  assert.match(source, /text-\[12px\] font-medium text-slate-500/);
  assert.match(source, /min-h-8 rounded-lg border px-2 text-\[13px\] font-medium/);
});

test('shared VoguePromptComposer keeps the gallery dock polished without adding new prompt actions', () => {
  const source = read('src/components/app/VoguePromptComposer.tsx');

  assert.match(source, /vogue-composer-dock/);
  assert.match(source, /vogue-reference-well/);
  assert.match(source, /vogue-composer-control/);
  assert.match(source, /vogue-character-count/);
  assert.match(source, /shadow-\[0_30px_90px_rgba\(112,90,76,0\.18\)\]/);
  assert.match(source, /rgba\(250, 244, 239, 0\.78\)/);
  assert.match(source, /rgba\(238, 243, 255, 0\.68\)/);
  assert.match(source, /placeholder:text-slate-400\/80/);
  assert.match(source, /border-\[rgba\(118,92,70,0\.14\)\]/);
  assert.match(source, /border-\[rgba\(97,91,255,0\.18\)\]/);
  assert.doesNotMatch(source, /enhancePrompt|optimizePrompt|magicPrompt/i);
});

test('composer model and parameter menus use a refined light menu and close on outside click', () => {
  const source = read('src/components/app/VoguePromptComposer.tsx');
  const modelSelect = source.slice(
    source.indexOf('function VogueModelSelect'),
    source.indexOf('function VogueParameterPopover')
  );
  const parameterPopover = source.slice(
    source.indexOf('function VogueParameterPopover'),
    source.indexOf('function VogueLockedParameterSummary')
  );

  assert.match(source, /function useDismissibleComposerMenu/);
  assert.match(source, /document\.addEventListener\('pointerdown', handlePointerDown, true\)/);
  assert.match(source, /document\.addEventListener\('keydown', handleKeyDown\)/);
  assert.match(source, /rootRef\.current\.contains\(target\)/);
  assert.match(modelSelect, /vogue-model-menu/);
  assert.match(modelSelect, /vogue-model-option/);
  assert.match(modelSelect, /aria-current=\{active \? 'true' : undefined\}/);
  assert.match(modelSelect, /border-\[rgba\(97,91,255,0\.26\)\]/);
  assert.match(modelSelect, /bg-\[rgba\(246,248,255,0\.9\)\]/);
  assert.match(modelSelect, /Check className="h-4 w-4"/);
  assert.doesNotMatch(modelSelect, /bg-slate-950 text-white/);
  assert.match(parameterPopover, /useDismissibleComposerMenu/);
});

test('composer model dropdown uses localized model descriptions instead of credit fallback text', () => {
  const imageWorkspace = read('src/components/app/ImageWorkspace.tsx');
  const galleryWorkspace = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const helper = read('src/lib/vogue-model-copy.ts');
  const localeFiles = [
    'messages/en.json',
    'messages/zh.json',
    'messages/fr.json',
    'messages/ru.json',
    'messages/pt.json',
    'messages/ja.json',
    'messages/ko.json',
  ];
  const modelIds = [
    'gptimage2',
    'gptimage15',
    'nanobanana2',
    'nanobanana',
    'nanobananapro',
  ];

  assert.match(helper, /getVogueWorkspaceModelDescription/);
  assert.match(imageWorkspace, /getVogueWorkspaceModelDescription\(copy, item\.id\)/);
  assert.match(galleryWorkspace, /getVogueWorkspaceModelDescription\(copy, model\.id\)/);
  assert.doesNotMatch(imageWorkspace, /item\.id === model\.id \? copy\.composer\.imageGenerationModel/);

  for (const localeFile of localeFiles) {
    const messages = JSON.parse(read(localeFile));
    const appCopy = messages.Vogue.app;
    const descriptions = appCopy.modelDescriptions;
    assert.ok(descriptions, `${localeFile} must define modelDescriptions`);
    assert.equal('activeModelDescription' in appCopy, false);
    assert.equal('baseCreditsDescription' in appCopy, false);

    for (const modelId of modelIds) {
      const description = descriptions[modelId];
      assert.equal(typeof description, 'string', `${localeFile} ${modelId}`);
      assert.ok(description.length > 0, `${localeFile} ${modelId} is empty`);
      assert.ok(description.length <= 44, `${localeFile} ${modelId} is too long`);
      assert.doesNotMatch(description, /\n/, `${localeFile} ${modelId} wraps`);
      assert.doesNotMatch(
        description,
        /credits?|积分|кредит|crédit|créditos|クレジット|크레딧|基础|base/i,
        `${localeFile} ${modelId} should not mention credits`
      );
    }
  }
});

test('prompt gallery uses the shared composer and keeps card actions in the hover layer', () => {
  const source = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const promptCard = source.slice(
    source.indexOf('function PromptCard'),
    source.indexOf('export default function VogueGalleryWorkspace')
  );
  const promptDetailDialog = source.slice(
    source.indexOf('function PromptDetailDialog'),
    source.indexOf('function InfoRow')
  );

  assert.match(source, /VoguePromptComposer/);
  assert.match(source, /variant="gallery"/);
  assert.match(source, /copy\.gallery\.usePrompt/);
  assert.match(source, /copy\.gallery\.useAsRefShort/);
  assert.match(source, /composerOpen/);
  assert.match(source, /galleryComposerParameters/);
  assert.match(source, /galleryCreditEstimate/);
  assert.match(source, /estimate: galleryCreditEstimate/);
  assert.match(source, /MAX_GALLERY_REFERENCE_IMAGES = 6/);
  assert.match(source, /IconBrandX/);
  assert.match(source, /writeVogueAppTransferPayload/);
  assert.doesNotMatch(promptCard, /modelLabel\(entry\.modelId\)/);
  assert.match(source, /className="max-h-full max-w-full object-contain"/);
  assert.doesNotMatch(source, /max-h-full max-w-full rounded-\[20px\] border border-white object-contain/);
  assert.match(source, /border-transparent hover:border-slate-400\/70/);
  assert.match(source, /className="h-full w-full rounded-\[13px\] object-cover"/);
  assert.doesNotMatch(source, /bg-white\/70 p-0\.5 shadow-\[0_12px_30px_rgba\(72,92,130,0\.16\)\] backdrop-blur/);
  assert.doesNotMatch(source, /function PromptComposer/);
  assert.match(promptDetailDialog, /promptDisplayMode/);
  assert.match(promptDetailDialog, /visiblePrompt/);
  assert.match(promptDetailDialog, /originalPrompt/);
  assert.doesNotMatch(promptCard, /promptDisplayMode/);
});

test('prompt gallery keeps the page heading non-visual and starts with filters before cards', () => {
  const source = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const enMessages = read('messages/en.json');

  assert.match(
    source,
    /<h1[^>]*className="sr-only"[^>]*>\s*\{heading\}\s*<\/h1>/
  );
  assert.match(
    enMessages,
    /"metaTitle": "Free AI Image Prompts for GPT Image 2 & Nano Banana \| Vogue AI"/
  );
  assert.match(
    enMessages,
    /"h1": "Free AI Image Prompts for GPT Image 2, Nano Banana & Midjourney"/
  );
  assert.match(
    enMessages,
    /"itemListName": "Free AI Image Prompts for GPT Image 2 and Nano Banana"/
  );
  assert.match(enMessages, /GPT Image 2, Nano Banana and Midjourney prompts/);
  assert.doesNotMatch(
    enMessages,
    /Free Nano Banana, Midjourney & GPT Image Prompts Gallery/
  );
  assert.match(source, /aria-label=\{copy\.gallery\.filtersAria\}/);
  assert.match(source, /aria-label=\{copy\.gallery\.gridAria\}/);
  assert.doesNotMatch(source, /<h3 className="line-clamp-2 text-base font-black/);
  assert.doesNotMatch(source, /Prompt Library \+ Generator/);
  assert.doesNotMatch(source, /Browse by model or use case/);
  assert.doesNotMatch(source, /\{filteredEntries\.length\} results/);
});

test('prompt detail dialog supports prompt copy, compact X source text, aligned media controls, and refined actions', () => {
  const source = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const enMessages = read('messages/en.json');
  const zhMessages = read('messages/zh.json');
  const promptDetailDialog = source.slice(
    source.indexOf('function PromptDetailDialog'),
    source.indexOf('function InfoRow')
  );

  assert.match(promptDetailDialog, /navigator\.clipboard\.writeText\(visiblePrompt\)/);
  assert.match(promptDetailDialog, /document\.execCommand\('copy'\)/);
  assert.match(promptDetailDialog, /copy\.gallery\.copyPrompt/);
  assert.match(promptDetailDialog, /\{!isXSource \? copy\.gallery\.open : null\}/);
  assert.doesNotMatch(promptDetailDialog, /sourceLabel/);
  assert.doesNotMatch(promptDetailDialog, /const sourceLabel/);
  assert.doesNotMatch(promptDetailDialog, /sourceLabel\}/);
  assert.doesNotMatch(promptDetailDialog, /\{copy\.gallery\.open\}\s*\{isXSource/);
  assert.match(promptDetailDialog, /inline-flex h-10 w-10 items-center justify-center rounded-full/);
  assert.match(promptDetailDialog, /inline-flex h-10 min-w-10 items-center justify-center rounded-full/);
  assert.match(promptDetailDialog, /vogue-detail-primary-action/);
  assert.match(promptDetailDialog, /vogue-detail-secondary-action/);
  assert.match(enMessages, /"copyPrompt": "Copy prompt"/);
  assert.match(zhMessages, /"copyPrompt": "复制提示词"/);
});

test('prompt detail dialog suppresses shell rails while it is open', () => {
  const source = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const globals = read('src/app/globals.css');

  assert.match(source, /document\.body\.dataset\.voguePromptDetailOpen = 'true'/);
  assert.match(source, /delete document\.body\.dataset\.voguePromptDetailOpen/);
  assert.match(
    globals,
    /body\[data-vogue-prompt-detail-open="true"\] \.vogue-sidebar/
  );
  assert.match(
    globals,
    /body\[data-vogue-prompt-detail-open="true"\] \.vogue-mobile-rail/
  );
  assert.match(globals, /pointer-events: none/);
});

test('prompt gallery filter strip stays compact with short visible labels', () => {
  const source = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const enMessages = read('messages/en.json');
  const zhMessages = read('messages/zh.json');
  const modelIcons = read('src/lib/model-icons.ts');
  const globals = read('src/app/globals.css');
  const taxonomy = read('src/lib/prompt-taxonomy.ts');

  assert.match(source, /vogue-filter-strip/);
  assert.match(source, /variant="model"/);
  assert.doesNotMatch(source, /hidden h-5 w-px bg-\[rgba\(72,55,44,0\.08\)\] lg:block/);
  assert.doesNotMatch(source, /rounded-\[18px\] border border-\[rgba\(72,55,44,0\.1\)\] bg-white\/64 p-1 shadow/);
  assert.doesNotMatch(source, /h-5 w-5 bg-white\/86 shadow/);
  assert.match(source, /lg:flex-row/);
  assert.match(source, /ResizeObserver/);
  assert.match(source, /width >= 1440/);
  assert.match(source, /setColumnCount\(4\)/);
  assert.match(source, /denseActions={columnCount >= 4}/);
  assert.match(source, /denseActions \? 'sr-only' : ''/);
  assert.match(source, /vogue-gallery-columns/);
  assert.match(globals, /\.vogue-gallery-columns/);
  assert.match(globals, /@media \(min-width: 1800px\)/);
  assert.doesNotMatch(source, /columnCount,\s*\n\s*columnGap/);
  assert.match(enMessages, /"modelAll": "All"/);
  assert.match(enMessages, /"useFilter": "Type"/);
  assert.match(zhMessages, /"useFilter": "类型"/);
  assert.match(source, /return copy\.gallery\.gptImageFilter/);
  assert.doesNotMatch(zhMessages, /"gptImageFilter": "GPT 图像"/);
  assert.doesNotMatch(enMessages, /"gptImageFilter": "GPT-Image"/);
  assert.match(enMessages, /"gptImageFilter": "GPT Image"/);
  assert.match(modelIcons, /midjourney: '\/model-icons\/midjourney\.svg'/);
  assert.match(modelIcons, /midjourney: MODEL_ICON_PATHS\.midjourney/);
  assert.equal(existsSync(join(root, 'public/model-icons/midjourney.svg')), true);
  assert.doesNotMatch(globals, /\.vogue-filter-chip-active::after/);
  assert.match(enMessages, /"product": \{\s*"label": "Product"/);
  assert.match(enMessages, /"avatar": \{\s*"label": "Avatar"/);
  assert.match(enMessages, /"diagram": \{\s*"label": "Diagram"/);
  assert.match(enMessages, /"anime": \{\s*"label": "Anime"/);
  assert.match(enMessages, /"art": \{\s*"label": "Art"/);
  assert.match(enMessages, /"epic": \{\s*"label": "Epic"/);
  assert.match(zhMessages, /"product": \{\s*"label": "产品"/);
  assert.match(zhMessages, /"avatar": \{\s*"label": "头像"/);
  assert.match(zhMessages, /"diagram": \{\s*"label": "图表"/);
  assert.match(zhMessages, /"anime": \{\s*"label": "动漫"/);
  assert.match(zhMessages, /"art": \{\s*"label": "插画"/);
  assert.match(zhMessages, /"epic": \{\s*"label": "史诗"/);
  assert.match(taxonomy, /key: 'avatar'/);
  assert.match(taxonomy, /key: 'anime'/);
  assert.match(taxonomy, /key: 'art'/);
  assert.match(taxonomy, /key: 'epic'/);
  assert.match(source, /const entryModelIcon = entry\.modelId/);
  assert.match(source, /getModelIconPathByModelId\(entry\.modelId\)/);
  assert.match(source, /const entryCategoryTag = getEntryCategoryLabel\(entry, copy\);/);
  assert.match(source, /VOGUE_PROMPT_CATEGORY_DEFINITIONS/);
  assert.match(source, /if \(entry\.categoryKey\) return entry\.categoryKey === categoryKey/);
  assert.match(source, /'prompt' in entry && getVoguePromptCategoryKey\(entry\) === categoryKey/);
  assert.match(source, /\{entryModelIcon \? \(/);
  assert.match(source, /\{entryCategoryTag\}/);
  assert.match(source, /vogue-card-meta/);
  assert.match(source, /vogue-card-model-mark/);
  assert.match(source, /vogue-card-category-tag/);
  assert.doesNotMatch(source, /inline-flex h-8 w-8 items-center justify-center rounded-full border border-white\/70 bg-white\/88/);
  assert.doesNotMatch(source, /inline-flex h-8 items-center rounded-full border border-white\/70 bg-white\/88 px-2\.5/);
  assert.doesNotMatch(source, /All Models/);
  assert.doesNotMatch(source, /Product Ads/);
  assert.doesNotMatch(source, /Infographics/);
  assert.doesNotMatch(source, /Photography/);
  assert.doesNotMatch(source, />\\s*\\{counts\\[option\\.key\\]/);
});

test('pricing, sidebar account, FAQ, and footer use native Meigen-style light surfaces', () => {
  const pricing = read('src/components/pricing/PricingDialog.tsx');
  const pricingProvider = read('src/components/pricing/PricingDialogProvider.tsx');
  const localeLayout = read('src/app/[locale]/layout.tsx');
  const sidebar = read('src/components/app/VogueSidebarShell.tsx');
  const accountCenter = read('src/components/account/VogueAccountCenter.tsx');
  const accountRoute = read('src/components/account/VogueAccountRouteSurface.tsx');
  const profilePage = read('src/app/profile/page.tsx');
  const billingsPage = read('src/app/billings/page.tsx');
  const homeFAQ = read('src/components/home/HomeFAQ.tsx');
  const commonFAQ = read('src/components/common/FAQ.tsx');
  const footer = read('src/components/common/Footer.tsx');

  assert.match(pricing, /pricingCopy\.title/);
  assert.match(pricing, /vogue-pricing-light/);
  assert.match(pricing, /vogue-pricing-primary-cta/);
  assert.doesNotMatch(pricing, /bg-gray-800|bg-gray-900|border-gray-700/);
  assert.match(localeLayout, /<PricingDialogProvider>/);
  assert.match(
    pricingProvider,
    /getUnlocalizedPathname\(url\.pathname\) !== '\/pricing'/
  );
  assert.match(
    pricingProvider,
    /document\.addEventListener\('click', handlePricingLinkClick, true\)/
  );
  assert.match(pricingProvider, /stopImmediatePropagation/);
  assert.match(sidebar, /href: '\/pricing'/);
  assert.doesNotMatch(sidebar, /PricingDialog open=/);
  assert.match(sidebar, /VogueAccountDialog/);
  assert.match(sidebar, /getVogueAccountSectionFromPath/);
  assert.match(sidebar, /href="\/profile"/);
  assert.match(sidebar, /href="\/billings"/);
  assert.match(sidebar, /SUPPORTED_VOGUE_LOCALES\.map/);
  assert.match(sidebar, /authClient\.signOut/);
  assert.match(accountCenter, /role="dialog"/);
  assert.match(accountCenter, /validateUploadedImageFile/);
  assert.match(accountCenter, /authClient\.updateUser/);
  assert.match(accountCenter, /usePricingDialog/);
  assert.match(accountCenter, /fetch\('\/api\/user\/credits'/);
  assert.match(accountRoute, /route: '\/profile' \| '\/billings'/);
  assert.match(accountRoute, /getUrlWithLocale\('\/login', locale\)/);
  assert.match(profilePage, /VogueAccountRouteSurface route="\/profile"/);
  assert.match(billingsPage, /VogueAccountRouteSurface route="\/billings"/);
  assert.doesNotMatch(sidebar, /Guest/);
  assert.doesNotMatch(sidebar, /rgba\(246,251,255,0\.92\)/);
  assert.match(homeFAQ, /bg-\[var\(--vogue-page\)\] py-20/);
  assert.match(commonFAQ, /bg-\[var\(--vogue-page\)\] py-20/);
  assert.match(footer, /from-\[#fff3ec\]/);
  assert.doesNotMatch(footer, /bg-\[#05060d\]|border-white\/10/);
});

test('sidebar account menu stays within the rail and opens languages as a side flyout', () => {
  const sidebar = read('src/components/app/VogueSidebarShell.tsx');

  assert.match(sidebar, /w-\[216px\]/);
  assert.doesNotMatch(sidebar, /w-\[286px\]/);
  assert.match(sidebar, /overflow-visible/);
  assert.match(sidebar, /left-\[calc\(100%\+8px\)\]/);
  assert.match(sidebar, /z-\[1700\]/);
  assert.match(sidebar, /max-h-\[min\(320px,calc\(100vh-2rem\)\)\]/);
  assert.match(sidebar, /vogue-sidebar z-\[80\]/);
  assert.match(sidebar, /useLocaleRouter/);
  assert.match(sidebar, /useLocalePathname/);
  assert.match(sidebar, /localeRouter\.replace/);
  assert.match(sidebar, /locale: nextLocale/);
  assert.doesNotMatch(sidebar, /LOCALE_COOKIE_NAME/);
  assert.doesNotMatch(sidebar, /rememberLocaleChoice/);
  assert.doesNotMatch(sidebar, /router\.refresh\(\)/);
  assert.match(sidebar, /prefetch=\{false\}/);
});

test('sidebar blog label, compact account controls, and avatar fallback stay polished', () => {
  const sidebar = read('src/components/app/VogueSidebarShell.tsx');
  const accountCenter = read('src/components/account/VogueAccountCenter.tsx');
  const enMessages = read('messages/en.json');
  const zhMessages = read('messages/zh.json');
  const profileIndex = sidebar.indexOf('href="/profile"');
  const billingIndex = sidebar.indexOf('href="/billings"');
  const languageIndex = sidebar.indexOf('{localizedMenuCopy.language}');
  const assetsIndex = sidebar.indexOf('href="/assets"');

  assert.match(sidebar, /href: '\/blog'[\s\S]*labelKey: 'blog'/);
  assert.doesNotMatch(sidebar, /href: '\/blog'[\s\S]{0,100}labelKey: 'prompts'/);
  assert.match(enMessages, /"blog": "Blog"/);
  assert.match(zhMessages, /"blog": "博客"/);
  assert.match(sidebar, /vogue-sidebar-account-button/);
  assert.match(sidebar, /vogue-sidebar-credit-pill/);
  assert.match(sidebar, /vogue-sidebar-anonymous-account-row/);
  assert.match(sidebar, /vogue-sidebar-anonymous-login-button/);
  assert.match(sidebar, /vogue-sidebar-anonymous-credit-pill/);
  assert.doesNotMatch(sidebar, /vogue-sidebar-account flex/);
  assert.doesNotMatch(sidebar, /text-\[12px\] font-semibold text-slate-800/);
  assert.ok(profileIndex < billingIndex);
  assert.ok(billingIndex < languageIndex);
  assert.ok(languageIndex < assetsIndex);
  assert.match(accountCenter, /failedImageUrl/);
  assert.match(accountCenter, /onError=\{\(\) => setFailedImageUrl\(imageUrl\)\}/);
});

test('footer keeps Vogue branding, simplifies primary navigation, and refreshes the final external marquee', () => {
  const footer = read('src/components/common/Footer.tsx');
  const bottomIndex = footer.indexOf('vogue-footer-bottom');
  const copyrightIndex = footer.indexOf('&copy;');
  const finalMarqueeIndex = footer.lastIndexOf('vogue-footer-marquee');

  assert.match(footer, /VogueBrandLockup/);
  assert.doesNotMatch(footer, /Start Creating/);
  assert.doesNotMatch(footer, /Explore Prompts/);
  assert.doesNotMatch(footer, /\{ title: 'Product'/);
  assert.match(footer, /Best AI Prompts/);
  assert.doesNotMatch(footer, /Best GPT Image 2 Prompts/);
  assert.doesNotMatch(footer, /Best Nano Banana Prompts/);
  assert.doesNotMatch(footer, /Best Midjourney Prompts/);
  assert.doesNotMatch(footer, /Best Product Prompts/);
  assert.doesNotMatch(footer, /Best UI Design Prompts/);
  assert.doesNotMatch(footer, /\?model=gptimage2/);
  assert.doesNotMatch(footer, /\?category=product/);
  assert.match(footer, /AI Models/);
  assert.doesNotMatch(footer, /\/app\?target=image&model=gptimage2/);
  assert.doesNotMatch(footer, /Nano Banana Pro/);
  assert.match(footer, /Resources/);
  assert.doesNotMatch(footer, /\{ title: 'Legal'/);
  assert.match(footer, /getUrlWithLocale\(href, locale\)/);
  assert.match(footer, /Blog/);
  assert.match(footer, /Pricing/);
  assert.match(footer, /Privacy Policy/);
  assert.match(footer, /Terms of Service/);
  assert.match(footer, /href\.startsWith\('mailto:'\)/);
  assert.match(footer, /supportEmail = 'support@vogueai\.net'/);
  assert.match(footer, /onMouseEnter=\{\(\) => setOpen\(true\)\}/);
  assert.match(footer, /onClick=\{\(\) => setOpen\(true\)\}/);
  assert.match(footer, /navigator\.clipboard\.writeText\(supportEmail\)/);
  assert.match(footer, /document\.execCommand\('copy'\)/);
  assert.match(footer, /aria-label=\{copied \? copy\.emailCopied : copy\.copyEmail\}/);
  assert.doesNotMatch(footer, /Prompt workflows for image creators/);
  assert.doesNotMatch(footer, /AI Effects/);
  assert.doesNotMatch(footer, /href: '\/veo-3-generator'/);
  assert.doesNotMatch(footer, /href: '\/hailuo-ai-video-generator'/);
  assert.doesNotMatch(footer, /href: '\/ai-baby-generator'/);
  assert.doesNotMatch(footer, /href: '\/ai-baby-podcast'/);
  assert.doesNotMatch(footer, /href: '\/lipsync'/);
  assert.doesNotMatch(footer, /future prompt-library experience/);
  assert.doesNotMatch(footer, /Featured in and partner directories/);
  assert.doesNotMatch(footer, /Hover to pause/);
  assert.doesNotMatch(footer, /Buzzmatic/);
  assert.doesNotMatch(footer, /Game Sprunki/);
  assert.doesNotMatch(footer, /Dog Olympics/);
  assert.doesNotMatch(footer, /deltarune/);
  assert.doesNotMatch(footer, /bg-white\/86/);
  assert.doesNotMatch(footer, /rounded-\[14px\] bg-slate-950 px-4/);
  assert.doesNotMatch(footer, /rounded-md border border-slate-200 bg-white\/88/);
  assert.doesNotMatch(footer, /vogue-footer-linkline/);
  assert.match(footer, /World Hub/);
  assert.match(footer, /GPTIMG2 AI/);
  assert.match(footer, /https:\/\/twelve\.tools/);
  assert.match(footer, /https:\/\/wired\.business/);
  assert.match(footer, /https:\/\/showmebest\.ai/);
  assert.match(footer, /https:\/\/findly\.tools\/gptimg2-ai/);
  assert.match(footer, /https:\/\/turbo0\.com\/item\/gptimg2-ai/);
  assert.match(footer, /https:\/\/novatools\.ai/);
  assert.match(footer, /https:\/\/submitaitools\.org/);
  assert.ok(bottomIndex > -1);
  assert.ok(copyrightIndex > -1);
  assert.ok(finalMarqueeIndex > -1);
  assert.ok(bottomIndex < copyrightIndex);
  assert.ok(copyrightIndex < finalMarqueeIndex);
});

test('sidebar and footer keep legacy generator pages out of primary navigation', () => {
  const sidebar = read('src/components/app/VogueSidebarShell.tsx');
  const footer = read('src/components/common/Footer.tsx');

  for (const route of [
    '/veo-3-generator',
    '/hailuo-ai-video-generator',
    '/ai-baby-generator',
    '/ai-baby-podcast',
    '/lipsync',
  ]) {
    assert.doesNotMatch(sidebar, new RegExp(`href: '${route}'`));
    assert.doesNotMatch(footer, new RegExp(`href: '${route}'`));
  }

  assert.doesNotMatch(sidebar, /title=\{copy\.sidebar\.models\}/);
  assert.doesNotMatch(sidebar, /title=\{copy\.sidebar\.effects\}/);
  assert.match(footer, /models: 'AI Models'/);
  assert.doesNotMatch(footer, /\{ title: 'AI Effects'/);
});

test('pricing and model pages share the light marketing surface override', () => {
  const globals = read('src/app/globals.css');
  const nonPromptTemplate = read(
    'src/components/non-prompt/NonPromptToolPage.tsx'
  );
  const pages = [
    'src/app/[locale]/hailuo-ai-video-generator/page.tsx',
    'src/app/[locale]/veo-3-generator/page.tsx',
    'src/app/[locale]/seedance/page.tsx',
    'src/app/[locale]/ai-baby-generator/page.tsx',
    'src/app/[locale]/ai-baby-podcast/page.tsx',
    'src/app/[locale]/lipsync/page.tsx',
    'src/app/[locale]/effect/page.tsx',
    'src/app/[locale]/effect/earth-zoom/page.tsx',
  ];

  assert.match(globals, /\.vogue-marketing-light/);
  assert.match(globals, /\[class\*="bg-gray-900"\]/);
  assert.match(globals, /\[class\*="text-white"\]/);
  assert.match(nonPromptTemplate, /vogue-marketing-light/);
  assert.match(nonPromptTemplate, /var\(--vogue-page\)/);
  for (const page of pages) {
    const source = read(page);
    assert.match(source, /NonPromptToolPage/, page);
    assert.match(source, /createNonPromptPageMetadata/, page);
  }
});

test('pricing is a dialog entrypoint rather than a dedicated page destination', () => {
  const pricingDialog = read('src/components/pricing/PricingDialog.tsx');
  const pricingProvider = read('src/components/pricing/PricingDialogProvider.tsx');
  const pricingPage = read('src/app/pricing/page.tsx');
  const localizedPricingPage = read('src/app/[locale]/pricing/page.tsx');
  const sitemap = read('src/app/sitemap.ts');

  assert.match(pricingDialog, /role="dialog"/);
  assert.match(pricingDialog, /max-w-6xl/);
  assert.match(pricingDialog, /min-\[641px\]:left-\[248px\]/);
  assert.match(pricingProvider, /const \[open, setOpen\] = useState\(false\)/);
  assert.match(
    pricingProvider,
    /useEffect\(\(\) => \{\s*if \(new URL\(window\.location\.href\)\.searchParams\.has\('pricing'\)\) \{\s*setOpen\(true\);/
  );
  assert.match(pricingProvider, /new URL\(window\.location\.href\)\.searchParams\.has\('pricing'\)/);
  assert.doesNotMatch(pricingProvider, /useState\(\(\) => \{[\s\S]*window\.location\.href[\s\S]*\}\)/);
  assert.match(pricingPage, /redirect\('\/\?pricing=1'\)/);
  assert.match(localizedPricingPage, /redirect\(`\/\$\{locale\}\?pricing=1`\)/);
  assert.doesNotMatch(sitemap, /path: '\/pricing'/);
});

test('model page components no longer rely on old dark gray surface classes', () => {
  const componentFiles = [
    'src/components/hailuo-generator/FeaturesHailuo.tsx',
    'src/components/hailuo-generator/HailuoFAQ.tsx',
    'src/components/hailuo-generator/HailuoShowcase.tsx',
    'src/components/veo-3-generator/Veo3FAQ.tsx',
    'src/components/veo-3-generator/FeaturesVeo3.tsx',
    'src/components/seedance/SeedanceFAQ.tsx',
    'src/components/seedance/SeedanceShowcase.tsx',
    'src/components/ai-baby-generator/FAQGenerator.tsx',
    'src/components/ai-baby-podcast/HowToPodcast.tsx',
    'src/components/lipsync/LipsyncFAQ.tsx',
    'src/components/effect/EarthZoomFAQ.tsx',
  ];

  for (const file of componentFiles) {
    const source = read(file);
    assert.doesNotMatch(
      source,
      /bg-gray-|from-gray-|to-gray-|border-gray-|text-gray-/,
      file
    );
  }
});

test('core model page roots, pricing, app, FAQ, and footer use light backgrounds', () => {
  const roots = [
    'src/app/page.tsx',
    'src/app/app/page.tsx',
    'src/app/[locale]/hailuo-ai-video-generator/page.tsx',
    'src/app/[locale]/veo-3-generator/page.tsx',
    'src/app/[locale]/seedance/page.tsx',
    'src/app/[locale]/ai-baby-generator/page.tsx',
    'src/app/[locale]/ai-baby-podcast/page.tsx',
    'src/app/[locale]/lipsync/page.tsx',
    'src/app/[locale]/effect/page.tsx',
    'src/app/[locale]/effect/earth-zoom/page.tsx',
  ];

  for (const file of roots) {
    const source = read(file);
    assert.match(
      source,
      /var\(--vogue-page\)|vogue-marketing-light|vogue-pricing-light|NonPromptToolPage/,
      file
    );
  }
});

test('vogue shell, gallery, and composer use the Meigen-style light surface', () => {
  const globals = read('src/app/globals.css');
  const shell = read('src/components/app/VogueSidebarShell.tsx');
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const composer = read('src/components/app/VoguePromptComposer.tsx');

  assert.match(globals, /--vogue-page:\s*#fbf2ed/);
  assert.match(globals, /--vogue-sidebar:\s*#fffaf7/);
  assert.match(shell, /background:\s*'var\(--vogue-page\)'/);
  assert.match(gallery, /vogue-gallery-surface/);
  assert.match(gallery, /xIconActionStyle/);
  assert.match(gallery, /ml-auto flex h-8 w-8/);
  assert.match(gallery, /renderPromptText/);
  assert.match(composer, /vogue-composer-dock/);
  assert.match(composer, /rgba\(250,\s*244,\s*239,\s*0\.78\)/);
  assert.doesNotMatch(shell, /background:\s*'#070811'/);
  assert.doesNotMatch(shell, /background:\s*'#000'/);
});

test('vogue typography tokens keep body copy aligned to the sidebar scale', () => {
  const globals = read('src/app/globals.css');
  const sidebar = read('src/components/app/VogueSidebarShell.tsx');
  const guide = read('vogue ui准测.md');

  assert.match(globals, /--vogue-body-size:\s*14px/);
  assert.match(globals, /--vogue-body-line:\s*1\.62/);
  assert.match(globals, /--vogue-label-size:\s*12px/);
  assert.match(globals, /--vogue-page-title-size:\s*clamp\(1\.75rem,\s*2\.2vw,\s*2rem\)/);
  assert.match(globals, /--vogue-section-title-size:\s*clamp\(1\.375rem,\s*1\.6vw,\s*1\.625rem\)/);
  assert.match(globals, /\.vogue-marketing-light :is\(p, li, summary, dd, blockquote\)/);
  assert.match(globals, /\.vogue-pricing-light article :is\(p, li\)/);
  assert.match(globals, /\.vogue-shell h2,\n\.vogue-marketing-light h2,\n\.vogue-pricing-light h2/);
  assert.match(sidebar, /text-\[14px\] font-medium tracking-normal/);
  assert.match(sidebar, /text-\[12px\] font-medium tracking-normal text-slate-500/);
  assert.match(guide, /正文: `14px`/);
  assert.match(guide, /标题参考 MeiGen 的紧凑黑体风格/);
  assert.match(guide, /Prompt Card Hover/);
});

test('mobile shell uses a compact top rail so the gallery stays near the first viewport', () => {
  const source = read('src/components/app/VogueSidebarShell.tsx');

  assert.match(source, /const mobileLinks/);
  assert.match(source, /function MobileAccountButton/);
  assert.match(source, /if \(isNarrow\)/);
  assert.match(source, /vogue-mobile-rail/);
  assert.match(source, /aria-label=\{copy\.sidebar\.primaryMobileNavigation\}/);
});

test('app workspace uses a timeline layout with a sticky shared composer', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');
  const workspaceUtils = read('src/components/app/image-workspace-utils.ts');
  const composer = read('src/components/app/VoguePromptComposer.tsx');
  const globals = read('src/app/globals.css');

  assert.match(source, /VoguePromptComposer/);
  assert.match(source, /variant="workspace"/);
  assert.match(source, /\.getAll\('referenceImage'\)/);
  assert.match(source, /readVogueAppTransferPayload/);
  assert.match(source, /sticky bottom-0/);
  assert.match(source, /WorkspaceTimeline/);
  assert.match(workspaceUtils, /type TimelineFilter = 'all' \| 'video' \| 'image'/);
  assert.match(workspaceUtils, /export const formatParamsLabel/);
  assert.match(source, /copy\.app\.filters\[filter\]/);
  assert.match(source, /GalleryVerticalEnd/);
  assert.match(source, /max-w-7xl/);
  assert.match(source, /border border-dashed border-slate-300\/90/);
  assert.match(source, /emptyMessage=\{copy\.app\.emptyHistory\}/);
  assert.doesNotMatch(source, /Vogue AI Workspace/);
  assert.doesNotMatch(source, /Image Generator/);
  assert.doesNotMatch(source, /Workspace Timeline/);
  assert.doesNotMatch(source, /Generations and reusable assets/);
  assert.doesNotMatch(source, /Estimate \{Math\.ceil\(totalCreditEstimate\)\}/);
  assert.match(composer, /h-\[86px\].*sm:h-\[76px\].*md:h-\[82px\].*md:text-\[14px\]/);
  assert.match(composer, /text-\[14px\] font-normal leading-\[1\.62\]/);
  assert.match(composer, /placeholder:text-\[14px\] placeholder:font-normal/);
  assert.match(composer, /rounded-\[24px\].*px-3 pb-2\.5 pt-2\.5/);
  assert.match(composer, /h-\[78px\] w-\[78px\].*sm:h-\[88px\] sm:w-\[88px\]/);
  assert.doesNotMatch(composer, /modeLabel/);
  assert.match(composer, /modelControlLabel\?: string/);
  assert.match(composer, /parameterControlLabel\?: string/);
  assert.match(composer, /minWidth:\s*196/);
  assert.match(
    composer,
    /aria-label=\{getReferenceCounter\(referenceItems, maxReferenceImages, copy\)\}/
  );
  assert.match(composer, /referenceItems\.length\}\/\{Math\.max\(maxReferenceImages, 0\)\}/);
  assert.doesNotMatch(composer, /home-generate-button__letter/);
  assert.doesNotMatch(composer, /renderGenerateButtonLetters/);
  assert.doesNotMatch(composer, /ArrowRight/);
  assert.match(composer, /home-generate-button__credits/);
  assert.match(composer, /getGenerateCreditsLabel/);
  assert.match(composer, /home-generate-button relative inline-flex h-11/);
  assert.match(globals, /color: #ffffff/);
  assert.match(globals, /\.home-generate-button/);
  assert.match(globals, /rgba\(22, 29, 47, 0\.98\)/);
  assert.doesNotMatch(source, />\\s*Image Models\\s*</);
});

test('app workspace estimates request credits through shared effect pricing', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');

  assert.match(source, /estimateCreditsForEffect/);
  assert.match(source, /const pricingEffect = model/);
  assert.doesNotMatch(source, /model\.credit\s*\*\s*generationCount/);
  assert.doesNotMatch(source, /credit:\s*item\.credit/);
  assert.doesNotMatch(source, /baseCreditsDescription\.replace/);

  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  assert.match(gallery, /estimateCreditsForEffect/);
  assert.doesNotMatch(gallery, /selectedComposerModel\.credit\s*\*\s*generationCount/);
  assert.doesNotMatch(gallery, /credit:\s*model\.credit/);
});

test('app workspace shows an optimistic processing card before generation submission resolves', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');
  const workspaceUtils = read('src/components/app/image-workspace-utils.ts');
  const generateBody = source.slice(
    source.indexOf('const generate = async'),
    source.indexOf('const visibleAssets')
  );
  const createTaskIndex = generateBody.indexOf(
    'setCurrentTask(createOptimisticWorkspaceTask'
  );
  const uploadIndex = generateBody.indexOf('await uploadReferences()');
  const submitIndex = generateBody.indexOf("fetch('/api/effects/generate'");

  assert.match(workspaceUtils, /export const createOptimisticWorkspaceTask/);
  assert.match(workspaceUtils, /expectedGenerationSeconds\?: number \| null/);
  assert.match(workspaceUtils, /standardGenerationSeconds\?: number \| null/);
  assert.match(workspaceUtils, /fasterGenerationSeconds\?: number \| null/);
  assert.match(workspaceUtils, /generationAccessTier\?: GenerationAccessTier \| null/);
  assert.match(workspaceUtils, /export const reconcileOptimisticWorkspaceTask/);
  assert.match(source, /resolveWorkspaceGenerationTimeEstimateForTier/);
  assert.match(source, /resolveWorkspaceStandardGenerationTimeEstimate/);
  assert.match(source, /resolveWorkspaceGenerationTimeEstimate/);
  assert.match(source, /getSubmittedGenerationTiming/);
  assert.match(source, /createOptimisticWorkspaceTask/);
  assert.match(source, /reconcileOptimisticWorkspaceTask/);
  assert.match(generateBody, /const provisionalTaskId = `live-\$\{Date\.now\(\)\}`/);
  assert.match(generateBody, /generationAccessTier/);
  assert.match(generateBody, /submittedGenerationTiming/);
  assert.ok(createTaskIndex >= 0, 'optimistic card must be inserted');
  assert.ok(uploadIndex >= 0, 'reference upload must still happen');
  assert.ok(submitIndex >= 0, 'generation submit must still happen');
  assert.ok(
    createTaskIndex < uploadIndex && createTaskIndex < submitIndex,
    'optimistic card must appear before uploads and generation submission'
  );
  assert.match(
    generateBody,
    /setCurrentTask\(\(previous\) =>\s*previous\s*\?\s*reconcileOptimisticWorkspaceTask/
  );
});

test('app workspace shows estimated generation progress and faster upgrade messaging', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');
  const composer = read('src/components/app/VoguePromptComposer.tsx');
  const types = read('src/i18n/vogue.ts');
  const locales = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'];
  const assetTile = source.slice(
    source.indexOf('function AssetTile'),
    source.indexOf('function WorkspaceTimeline')
  );

  assert.match(source, /GENERATION_PROGRESS_SOFT_CAP_PERCENT/);
  assert.match(source, /getGenerationProgressState/);
  assert.match(source, /generationProgressNowMs/);
  assert.match(assetTile, /copy\.app\.progress\.timeLeft/);
  assert.match(assetTile, /copy\.app\.progress\.almostDone/);
  assert.match(assetTile, /copy\.app\.progress\.fasterActive/);
  assert.match(assetTile, /copy\.app\.progress\.upgradeCta/);
  assert.match(assetTile, /itemStandardGenerationSeconds/);
  assert.match(assetTile, /itemFasterGenerationSeconds/);
  assert.match(source, /generationEtaLabel/);
  assert.match(composer, /generationEtaLabel\?: string/);
  assert.match(composer, /VogueEtaDisplay/);
  assert.match(source, /generateMetaLabel=\{anonymousGenerateMetaLabel\}/);
  assert.match(types, /progress:\s*\{/);

  for (const locale of locales) {
    const messages = JSON.parse(read(`messages/${locale}.json`));
    assert.equal(typeof messages.Vogue.app.progress.almostDone, 'string');
    assert.equal(typeof messages.Vogue.app.progress.timeLeft, 'string');
    assert.equal(typeof messages.Vogue.app.progress.estimated, 'string');
    assert.equal(typeof messages.Vogue.app.progress.fasterActive, 'string');
    assert.equal(typeof messages.Vogue.app.progress.upgradeCta, 'string');
  }
});

test('anonymous standard generation holds succeeded output locally before reveal', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');
  const pollAnonymousStatus = source.slice(
    source.indexOf('const pollAnonymousStatus = async'),
    source.indexOf('const generateAnonymous = async')
  );

  assert.match(source, /ANONYMOUS_STANDARD_REVEAL_DELAY_MS/);
  assert.match(pollAnonymousStatus, /anonymousRevealReadyAtMs/);
  assert.match(pollAnonymousStatus, /await wait\(anonymousRevealReadyAtMs - Date\.now\(\)\)/);
  assert.match(pollAnonymousStatus, /status: 'processing'/);
  assert.match(pollAnonymousStatus, /status: 'succeeded'/);
});

test('app workspace rejects known insufficient credits before server precheck', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');
  const generateBody = source.slice(
    source.indexOf('const generate = async'),
    source.indexOf('const visibleAssets')
  );
  const localCreditGuardIndex = generateBody.indexOf(
    'const hasKnownInsufficientCredits'
  );
  const loadingIndex = generateBody.indexOf('setLoading(true)');
  const precheckIndex = generateBody.indexOf("fetch('/api/effects/precheck'");

  assert.ok(localCreditGuardIndex >= 0, 'local credit guard must exist');
  assert.ok(loadingIndex >= 0, 'loading state must exist');
  assert.ok(precheckIndex >= 0, 'server precheck must still exist');
  assert.ok(
    localCreditGuardIndex < loadingIndex && localCreditGuardIndex < precheckIndex,
    'known insufficient credits must be rejected before loading and server precheck'
  );
  assert.match(
    generateBody,
    /credits !== null && credits < estimatedRequiredCredits/
  );
  assert.match(generateBody, /copy\.app\.errors\.insufficientCredits/);
});

test('app workspace asset actions use localized hover tooltips', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');
  const types = read('src/i18n/vogue.ts');
  const locales = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'];
  const assetTile = source.slice(
    source.indexOf('function AssetTile'),
    source.indexOf('function WorkspaceTimeline')
  );

  assert.match(source, /function ActionTooltip/);
  assert.match(source, /group-hover\/action:opacity-100/);
  assert.match(assetTile, /copy\.app\.tooltips\.copyPrompt/);
  assert.match(assetTile, /copy\.app\.tooltips\.regenerate/);
  assert.match(assetTile, /copy\.app\.tooltips\.download/);
  assert.doesNotMatch(assetTile, /title=\{copy\.app\.usePrompt\}/);
  assert.doesNotMatch(assetTile, /title=\{copy\.app\.useAsReference\}/);
  assert.doesNotMatch(assetTile, /title=\{copy\.app\.download\}/);
  assert.match(types, /tooltips:\s*\{\s*copyPrompt: string;\s*regenerate: string;\s*download: string;/);

  for (const locale of locales) {
    const messages = JSON.parse(read(`messages/${locale}.json`));
    assert.equal(typeof messages.Vogue.app.tooltips.copyPrompt, 'string');
    assert.equal(typeof messages.Vogue.app.tooltips.regenerate, 'string');
    assert.equal(typeof messages.Vogue.app.tooltips.download, 'string');
  }
});

test('app workspace preview overlay stays inside the main workspace area', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');
  const previewDialog = source.slice(
    source.indexOf('{previewItem?.mediaUrl ? ('),
    source.indexOf('</main>')
  );

  assert.match(previewDialog, /role="dialog"/);
  assert.doesNotMatch(previewDialog, /className="fixed inset-0/);
  assert.match(previewDialog, /min-\[641px\]:left-\[248px\]/);
});

test('assets page uses a Meigen-style creations frame without replacing asset actions', () => {
  const page = read('src/app/assets/page.tsx');
  const gallery = read('src/components/assets/GeneratedAssetsGallery.tsx');

  assert.match(page, /copy\.assets\.title/);
  assert.match(page, /copy\.assets\.back/);
  assert.match(page, /copy\.assets\.new/);
  assert.match(page, /rounded-\[36px\]/);
  assert.match(page, /bg-\[linear-gradient\(90deg,#f4e8ff_0%,#ffffff_22%,#fff7f4_100%\)\]/);
  assert.match(page, /Grid3X3/);
  assert.match(gallery, /copy\.assets\.blankTitle/);
  assert.match(gallery, /copy\.assets\.blankDescription/);
  assert.match(gallery, /copy\.assets\.usePrompt/);
  assert.match(gallery, /copy\.assets\.useAsReference/);
  assert.match(gallery, /getUseAsReferenceHref/);
});

test('gallery-to-app transfer avoids oversized prompt URLs', () => {
  const source = read('src/lib/app/composer-transfer.ts');

  assert.match(source, /VOGUE_APP_TRANSFER_STORAGE_KEY/);
  assert.match(source, /sessionStorage\.setItem/);
  assert.match(source, /sessionStorage\.removeItem/);
});

test('gallery generate navigates to app with an explicit one-shot autostart intent', () => {
  const source = read('src/components/prompts/VogueGalleryWorkspace.tsx');

  assert.match(source, /autostart:\s*'1'/);
  assert.match(source, /writeVogueAppTransferPayload/);
  assert.match(source, /onGenerateNavigate=\{persistGenerateTransfer\}/);
});

test('app workspace consumes autostart once after transfer and anonymous state are ready', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');

  assert.match(source, /const initialAutoStart = searchParams\.get\('autostart'\) === '1'/);
  assert.match(source, /const hasAutoStartedRef = useRef\(false\)/);
  assert.match(source, /const \[transferReady, setTransferReady\] = useState\(false\)/);
  assert.match(
    source,
    /if \(!initialAutoStart \|\| hasAutoStartedRef\.current \|\| loading \|\| !transferReady\)/
  );
  assert.match(source, /if \(isSessionPending \|\| !hasHydrated\)/);
  assert.match(source, /if \(isAnonymousPreviewMode && anonymousTrialCount === null\)/);
  assert.match(source, /hasAutoStartedRef\.current = true/);
  assert.match(source, /nextUrl\.searchParams\.delete\('autostart'\)/);
  assert.match(source, /window\.history\.replaceState\(null, '', nextUrl\.toString\(\)\)/);
  assert.match(source, /const generateRef = useRef<\(\(\) => Promise<void>\) \| null>\(null\)/);
  assert.match(source, /void generateRef\.current\?\.\(\)/);
});

test('app workspace lets guests use one locked low-quality anonymous generation', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');
  const composer = read('src/components/app/VoguePromptComposer.tsx');
  const anonymousRoute = read('src/app/api/effects/anonymous-generate/route.ts');
  const types = read('src/i18n/vogue.ts');

  assert.match(source, /getAnonymousTrialStatus/);
  assert.match(source, /generateAnonymousEffect/);
  assert.match(source, /getAnonymousEffectStatus/);
  assert.match(source, /const ANONYMOUS_TRIAL_MODEL_ID = 'gptimage2'/);
  assert.match(source, /const ANONYMOUS_TRIAL_PARAMETER_TOKENS = \['Auto', '1K', 'Low', '1x'\]/);
  assert.match(source, /const isAnonymousPreviewMode =/);
  assert.match(source, /anonymousTrialCount === 0/);
  assert.match(source, /setAnonymousTrialRemaining\(localTrialUsed \? 0 : 1\)/);
  assert.match(source, /modelLocked=\{isAnonymousPreviewMode\}/);
  assert.match(source, /lockedParameterSummary=\{anonymousParameterSummary\}/);
  assert.match(source, /generateMetaLabel=\{anonymousGenerateMetaLabel\}/);
  assert.match(source, /onAddReference=\{\s*!isAnonymousPreviewMode && imageSlotLimit > 0/);
  assert.match(source, /onRemoveReference=\{isAnonymousPreviewMode \? undefined :/);
  assert.match(composer, /modelLocked\?: boolean/);
  assert.match(composer, /lockedParameterSummary\?: string/);
  assert.match(composer, /generateMetaLabel\?: string/);
  assert.match(composer, /Lock/);
  assert.match(anonymousRoute, /const ANONYMOUS_TRIAL_INPUT = \{\s*aspect_ratio: 'auto',\s*quality: 'low',\s*wmOutputQuality: '1k'/);
  assert.match(types, /anonymous:\s*\{/);
});
