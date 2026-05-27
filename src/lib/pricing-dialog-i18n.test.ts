import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import {
  getVogueCopyFromMessages,
  SUPPORTED_VOGUE_LOCALES,
  type VogueLocale,
  type VogueUICopy,
} from '@/i18n/vogue';
import type { Messages } from 'next-intl';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const readVogueCopy = (locale: VogueLocale): VogueUICopy =>
  getVogueCopyFromMessages(
    JSON.parse(read(`messages/${locale}.json`)) as Messages
  );

test('pricing dialog uses provider messages instead of hardcoded English', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');

  assert.match(source, /useMessages/);
  assert.match(source, /getVogueCopyFromMessages/);
  assert.match(source, /useLocale/);
  assert.match(
    source,
    /const pricingCopy = getVogueCopyFromMessages\(messages\)\.pricing/
  );
  assert.match(source, /vogue-pricing-header/);
  assert.doesNotMatch(source, /VogueBrandLockup/);
  assert.match(source, /font-\[var\(--font-vogue-display\)\]/);
  assert.match(source, /bg-\[var\(--vogue-page\)\]/);
  assert.match(source, /border-\[var\(--vogue-border\)\]/);

  for (const staleCopy of [
    'Plans & Credits',
    'Choose credits without leaving your workflow',
    'Perfect for individual creators getting started',
    'Need extra credits?',
    'Failed to create payment session.',
    'Failed to create ZPAY checkout session.',
  ]) {
    assert.doesNotMatch(source, new RegExp(staleCopy.replaceAll('.', '\\.')));
  }
});

test('pricing copy exists for every Vogue locale', () => {
  for (const locale of SUPPORTED_VOGUE_LOCALES) {
    const pricing = (readVogueCopy(locale) as unknown as { pricing?: unknown })
      .pricing as
      | {
          eyebrow?: string;
          title?: string;
          subscriptionBadge?: string;
          bestValueBadge?: string;
          toggle?: {
            monthly?: string;
            yearly?: string;
            oneTime?: string;
            saveUpTo?: string;
          };
          creditPacksTitle?: string;
          plans?: Record<
            string,
            {
              cta?: string;
              features?: string[];
              yearlyMonthlyPrice?: string;
              monthlyOriginalPrice?: string;
              yearlyCaption?: string;
            }
          >;
          packs?: Record<string, { cta?: string }>;
          checkout?: { close?: string; stripe?: string; alipay?: string; wechatPay?: string };
          errors?: { priceNotConfigured?: string };
        }
      | undefined;

    assert.ok(pricing, `${locale} pricing copy is missing`);
    assert.ok(pricing.eyebrow, `${locale} pricing eyebrow is missing`);
    assert.ok(pricing.title, `${locale} pricing title is missing`);
    assert.ok(
      pricing.subscriptionBadge,
      `${locale} pricing subscription badge is missing`
    );
    assert.ok(pricing.bestValueBadge, `${locale} best value badge is missing`);
    assert.ok(pricing.toggle?.monthly, `${locale} monthly tab is missing`);
    assert.ok(pricing.toggle?.yearly, `${locale} yearly tab is missing`);
    assert.ok(pricing.toggle?.oneTime, `${locale} one-time tab is missing`);
    assert.ok(pricing.toggle?.saveUpTo, `${locale} yearly save badge is missing`);
    assert.ok(
      pricing.creditPacksTitle,
      `${locale} pricing credit packs title is missing`
    );
    assert.ok(pricing.plans?.basic?.cta, `${locale} basic CTA is missing`);
    assert.ok(
      pricing.plans?.basic?.features?.length,
      `${locale} basic features are missing`
    );
    assert.ok(
      pricing.plans?.basic?.yearlyMonthlyPrice,
      `${locale} basic yearly monthly price is missing`
    );
    assert.ok(
      pricing.plans?.basic?.monthlyOriginalPrice,
      `${locale} basic crossed monthly price is missing`
    );
    assert.ok(
      pricing.plans?.basic?.yearlyCaption,
      `${locale} basic yearly caption is missing`
    );
    assert.ok(
      pricing.packs?.starter?.cta,
      `${locale} starter credit pack CTA is missing`
    );
    assert.ok(pricing.checkout?.close, `${locale} checkout close is missing`);
    assert.ok(pricing.checkout?.stripe, `${locale} Stripe label is missing`);
    assert.ok(pricing.checkout?.alipay, `${locale} Alipay label is missing`);
    assert.ok(
      pricing.checkout?.wechatPay,
      `${locale} WeChat Pay label is missing`
    );
    assert.ok(
      pricing.errors?.priceNotConfigured,
      `${locale} price-not-configured copy is missing`
    );
  }

  const englishTitle = readVogueCopy('en') as unknown as {
    pricing?: { title?: string; plans?: { basic?: { yearlyCaption?: string } } };
  };
  const chineseTitle = readVogueCopy('zh') as unknown as {
    pricing?: { title?: string; plans?: { basic?: { yearlyCaption?: string } } };
  };
  assert.notEqual(englishTitle.pricing?.title, chineseTitle.pricing?.title);
  assert.match(
    englishTitle.pricing?.plans?.basic?.yearlyCaption ?? '',
    /upfront/i
  );
  assert.match(
    chineseTitle.pricing?.plans?.basic?.yearlyCaption ?? '',
    /一次性发放/
  );
});

test('Chinese subscription cards omit the plan suffix and descriptions', () => {
  const chinesePricing = readVogueCopy('zh').pricing;

  assert.equal(chinesePricing.popularBadge, '最受欢迎');
  for (const plan of Object.values(chinesePricing.plans)) {
    assert.doesNotMatch(plan.name, /套餐/);
    assert.equal(plan.description, '');
  }
});

test('localized pricing promo copy avoids English-only discount labels', () => {
  const portuguesePricing = readVogueCopy('pt').pricing;

  assert.equal(portuguesePricing.toggle.saveUpTo, 'Até 50% de desconto');
  assert.doesNotMatch(portuguesePricing.toggle.saveUpTo, /\boff\b/i);
});

test('pricing trust tagline is concise and localized on one line', () => {
  const expectedDescriptions = {
    en: 'No hidden fees • cancel anytime • unused credits roll over',
    zh: '无隐藏费用 • 随时取消 • 未用积分可结转',
    fr: 'Sans frais cachés • annulation à tout moment • crédits reportés',
    ru: 'Без скрытых платежей • отмена в любой момент • кредиты сохраняются',
    pt: 'Sem taxas ocultas • cancele quando quiser • créditos acumulam',
    ja: '隠れた手数料なし • いつでも解約 • 未使用クレジット繰り越し',
    ko: '숨은 수수료 없음 • 언제든 취소 • 미사용 크레딧 이월',
  } as const;

  for (const locale of SUPPORTED_VOGUE_LOCALES) {
    assert.equal(
      readVogueCopy(locale).pricing.description,
      expectedDescriptions[locale],
      `${locale} pricing trust tagline`
    );
  }

  const source = read('src/components/pricing/PricingDialog.tsx');
  assert.match(source, /whitespace-nowrap/);
  assert.doesNotMatch(source, /without leaving the workspace/);
});

test('subscription cards put billing details under price and savings under CTA', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const savingsIndex = source.indexOf('vogue-pricing-savings-note');
  const ctaIndex = source.indexOf('getPlanSelectCta(plan.id, runtimeCopy)');

  assert.match(source, /function getPlanSelectCta/);
  assert.match(source, /selectPlanCtas: Record<VogueSubscriptionPlanId, string>/);
  assert.match(source, /basic: '选择 Basic'/);
  assert.match(source, /getPlanSelectCta\(plan\.id, runtimeCopy\)/);
  assert.match(source, /const annualTotal = plan\.yearlyMonthlyPrice \* 12/);
  assert.match(source, /vogue-pricing-billing-note/);
  assert.match(source, /runtimeCopy\.annualBillingLabel/);
  assert.match(source, /formatUsdAmount\(locale, annualTotal\)/);
  assert.match(source, /monthlyHint: '按月计费'/);
  assert.match(source, /annualSavePrefix: '相比月付省下'/);
  assert.match(source, /annualSwitchSavePrefix: '年付立省'/);
  assert.match(source, /vogue-pricing-savings-note/);
  assert.ok(ctaIndex > -1);
  assert.ok(savingsIndex > ctaIndex);
  assert.doesNotMatch(source, /planCopy\.cta/);
  assert.doesNotMatch(source, /runtimeCopy\.annualSaveSuffix/);
  assert.doesNotMatch(source, /const planSelectLabels/);
});

test('pricing cards put yearly discount beside the plan name without interval pills', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');

  assert.match(source, /vogue-pricing-highlight-shell/);
  assert.match(source, /vogue-pricing-highlight-banner/);
  assert.match(source, /vogue-pricing-highlight-card/);
  assert.match(source, /pricingTab === 'yearly'\s*\?\s*\(/);
  assert.match(source, /\{plan\.yearlyDiscount\}% \{runtimeCopy\.discountSuffix\}/);
  assert.match(source, /discountSuffix: '折扣'/);
  assert.match(
    source,
    /rounded-\[8px\] bg-\[#f1f1f1\] px-3 py-1\.5 text-\[13px\]/
  );
  assert.doesNotMatch(source, /isRecommended \|\| isBestValue/);
  assert.doesNotMatch(
    source,
    /pricingTab === 'yearly'\s*\?\s*pricingCopy\.toggle\.yearly\s*:\s*pricingCopy\.subscriptionBadge/
  );
  assert.doesNotMatch(source, /mb-5 flex min-h-7 items-center justify-between/);
});

test('recommended pricing shell sits above equal-height white cards', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');

  assert.match(source, /mt-8 grid items-stretch gap-4/);
  assert.match(
    source,
    /vogue-pricing-highlight-shell flex h-full overflow-hidden rounded-\[24px\] border border-\[#d7ff43\] bg-\[#d7ff43\] pt-8/
  );
  assert.match(
    source,
    /vogue-pricing-highlight-banner absolute left-0 right-0 top-0 flex h-8/
  );
  assert.match(
    source,
    /'relative flex h-full min-h-\[548px\] flex-col rounded-\[22px\] border bg-white p-5 pt-7 shadow-none'/
  );
  assert.match(source, /vogue-pricing-highlight-card -mb-px border-0/);
  assert.doesNotMatch(source, /flex h-\[560px\] flex-col overflow-hidden/);
  assert.doesNotMatch(source, /overflow-hidden rounded-\[22px\] border bg-white/);
  assert.doesNotMatch(source, /flex min-h-\[548px\] flex-col/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-shell[^']*pt-11/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*h-11/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-shell[^']*pt-9/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*h-9/);
});

test('pricing agreement footer matches the quiet centered reference style', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');

  assert.match(source, /agreementPrefix: '购买即表示您同意'/);
  assert.match(source, /runtimeCopy\.agreementPrefix/);
  assert.match(source, /runtimeCopy\.agreementConnector/);
  assert.match(source, /vogue-pricing-agreement mt-8 pb-2 text-center/);
  assert.match(source, /aria-label=\{runtimeCopy\.termsLabel\}/);
  assert.match(source, /aria-label=\{runtimeCopy\.privacyLabel\}/);
  assert.doesNotMatch(source, /ShieldCheck/);
  assert.doesNotMatch(source, /runtimeCopy\.trustLine/);
});

test('credit pack cards use the compact one-time layout', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');

  assert.match(source, /mx-auto mt-5 grid max-w-5xl gap-3 md:grid-cols-3/);
  assert.match(source, /rounded-\[18px\] border p-4 text-left/);
  assert.match(source, /text-\[32px\] font-semibold leading-none/);
  assert.match(source, /mt-2 flex flex-wrap gap-1\.5 text-\[11px\]/);
  assert.doesNotMatch(source, /rounded-\[20px\] border p-5/);
});

test('pricing billing tabs use a compact pill switcher', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');

  assert.match(source, /max-w-\[520px\] rounded-full/);
  assert.match(source, /bg-white text-\[#171a23\]/);
  assert.match(source, /tab\.badge && \(\s*<span className="ml-1/);
  assert.doesNotMatch(source, /flex min-h-12 flex-col/);
});

test('workspace label is concise and localized across UI copy and messages', () => {
  const expectedLabels = {
    en: 'Workspace',
    zh: '工作台',
    fr: 'Espace de travail',
    ru: 'Рабочее пространство',
    pt: 'Área de trabalho',
    ja: 'ワークスペース',
    ko: '작업 공간',
  } as const;

  for (const locale of SUPPORTED_VOGUE_LOCALES) {
    const label = expectedLabels[locale];
    const copy = readVogueCopy(locale);
    const messages = JSON.parse(
      read(`messages/${locale}.json`)
    ) as { Common?: { app?: string } };

    assert.equal(copy.common.app, label, `${locale} common app label`);
    assert.equal(
      copy.sidebar.imageWorkspace,
      label,
      `${locale} sidebar app label`
    );
    assert.equal(
      copy.sidebar.workspace,
      label,
      `${locale} mobile workspace label`
    );
    assert.equal(messages.Common?.app, label, `${locale} message app label`);
  }
});

test('assets label is concise and localized across UI copy and messages', () => {
  const expectedLabels = {
    en: 'Assets',
    zh: '资产',
    fr: 'Ressources',
    ru: 'Активы',
    pt: 'Ativos',
    ja: 'アセット',
    ko: '에셋',
  } as const;
  const expectedSingularLabels = {
    en: 'Asset',
    zh: '资产',
    fr: 'Ressource',
    ru: 'Актив',
    pt: 'Ativo',
    ja: 'アセット',
    ko: '에셋',
  } as const;

  for (const locale of SUPPORTED_VOGUE_LOCALES) {
    const label = expectedLabels[locale];
    const singularLabel = expectedSingularLabels[locale];
    const copy = readVogueCopy(locale);
    const messages = JSON.parse(
      read(`messages/${locale}.json`)
    ) as { Common?: { assets?: string } };

    assert.equal(copy.common.assets, label, `${locale} common assets label`);
    assert.equal(
      copy.sidebar.projectAssets,
      label,
      `${locale} sidebar assets label`
    );
    assert.equal(
      copy.assets.projectAsset,
      singularLabel,
      `${locale} asset detail label`
    );
    assert.equal(
      messages.Common?.assets,
      label,
      `${locale} message assets label`
    );
  }
});

test('app locale provider lives in the locale layout like gptimg', () => {
  const rootLayout = read('src/app/layout.tsx');
  const localeLayout = read('src/app/[locale]/layout.tsx');

  assert.match(rootLayout, /export default function RootLayout/);
  assert.match(rootLayout, /return children/);
  assert.doesNotMatch(rootLayout, /<html/);
  assert.doesNotMatch(rootLayout, /<body/);
  assert.doesNotMatch(rootLayout, /NextIntlClientProvider/);
  assert.doesNotMatch(rootLayout, /getLocale/);
  assert.doesNotMatch(rootLayout, /getMessagesForLocale/);
  assert.doesNotMatch(rootLayout, /VogueSidebarShell/);
  assert.doesNotMatch(rootLayout, /PricingDialogProvider/);

  assert.match(localeLayout, /setRequestLocale\(locale\)/);
  assert.match(localeLayout, /<html lang=\{locale\}/);
  assert.match(localeLayout, /<NextIntlClientProvider>/);
  assert.match(localeLayout, /<PricingDialogProvider>/);
  assert.match(localeLayout, /<VogueSidebarShell>\{children\}<\/VogueSidebarShell>/);
});

test('sidebar language switch uses next-intl navigation without manual refresh', () => {
  const source = read('src/components/app/VogueSidebarShell.tsx');

  assert.match(source, /function SidebarAccount/);
  assert.match(
    source,
    /useLocalePathname,\s*useLocaleRouter/
  );
  assert.match(source, /const localeRouter = useLocaleRouter\(\)/);
  assert.match(source, /const localePathname = useLocalePathname\(\)/);
  assert.match(source, /const params = useParams\(\)/);
  assert.match(source, /const \[, startTransition\] = useTransition\(\)/);
  assert.match(
    source,
    /const handleLanguageChange = \(\s*event: MouseEvent<HTMLAnchorElement>,\s*nextLocale: VogueLocale\s*\) =>/
  );
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /startTransition\(\(\) => \{/);
  assert.match(source, /localeRouter\.replace\(/);
  assert.match(source, /pathname: localePathname/);
  assert.match(source, /params/);
  assert.match(source, /locale: nextLocale/);
  assert.match(source, /LocaleLink/);
  assert.doesNotMatch(source, /rememberLocaleChoice/);
  assert.doesNotMatch(source, /LOCALE_COOKIE_NAME/);
  assert.doesNotMatch(source, /router\.refresh\(\)/);
  assert.doesNotMatch(source, /getUrlWithLocale\(normalizedPathname, language\)/);
});

test('pricing dialog uses a flat header with cards directly under the billing tabs', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');

  assert.match(source, /vogue-pricing-header/);
  assert.doesNotMatch(source, /vogue-pricing-hero/);
  assert.match(source, /type PricingTab = 'yearly' \| 'monthly' \| 'one-time'/);
  assert.match(source, /useState<PricingTab>\('yearly'\)/);
  assert.match(source, /pricingCopy\.toggle\.saveUpTo/);
  assert.match(source, /planCopy\.yearlyMonthlyPrice/);
  assert.match(source, /planCopy\.monthlyOriginalPrice/);
  assert.match(source, /vogue-pricing-primary-cta/);
  assert.match(source, /vogue-pricing-feature-check/);
  assert.match(
    source,
    /<div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">/
  );
  assert.match(source, /<div className="mx-auto mt-5 grid max-w-5xl gap-3 md:grid-cols-3">/);
  assert.doesNotMatch(source, /bg-\[#171a23\]/);
  assert.doesNotMatch(source, /border-\[#171a23\]/);
});
