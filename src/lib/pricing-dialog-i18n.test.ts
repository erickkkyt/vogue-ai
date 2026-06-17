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
          freePlan?: {
            cta?: string;
            features?: string[];
            limitations?: string[];
            name?: string;
            price?: string;
          };
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
          packs?: Record<string, { badge?: string; cta?: string }>;
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
    assert.ok(pricing.freePlan?.name, `${locale} free plan name is missing`);
    assert.ok(pricing.freePlan?.price, `${locale} free plan price is missing`);
    assert.ok(pricing.freePlan?.cta, `${locale} free plan CTA is missing`);
    assert.ok(
      pricing.freePlan?.features?.length,
      `${locale} free plan features are missing`
    );
    assert.ok(
      pricing.freePlan?.limitations?.length,
      `${locale} free plan limitations are missing`
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
    assert.ok(
      pricing.packs?.starter?.badge,
      `${locale} starter credit pack badge is missing`
    );
    assert.ok(
      pricing.packs?.growth?.badge,
      `${locale} growth credit pack badge is missing`
    );
    assert.ok(
      pricing.packs?.professional?.badge,
      `${locale} professional credit pack badge is missing`
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
    pricing?: {
      title?: string;
      toggle?: { oneTime?: string };
      plans?: { basic?: { yearlyCaption?: string } };
    };
  };
  const chineseTitle = readVogueCopy('zh') as unknown as {
    pricing?: { title?: string; plans?: { basic?: { yearlyCaption?: string } } };
  };
  assert.notEqual(englishTitle.pricing?.title, chineseTitle.pricing?.title);
  assert.equal(englishTitle.pricing?.toggle?.oneTime, 'Pay as you go');
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

test('subscription cards use quiet headers and compact credit allowances', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const ctaIndex = source.indexOf('getPlanSelectCta(plan.id, runtimeCopy)');
  const allowanceIndex = source.indexOf('runtimeCopy.allowanceImagePrefix');

  assert.match(source, /function getPlanSelectCta/);
  assert.match(source, /getPricingSubscriptionPlanIdsForInterval/);
  assert.match(source, /selectPlanCtas: Record<VogueSubscriptionPlanId, string>/);
  assert.match(source, /basic: '选择 Basic'/);
  assert.match(source, /getPlanSelectCta\(plan\.id, runtimeCopy\)/);
  assert.match(source, /const annualTotal = plan\.yearlyMonthlyPrice \* 12/);
  assert.match(source, /vogue-pricing-billing-note/);
  assert.match(source, /runtimeCopy\.annualBillingLabel/);
  assert.match(source, /formatUsdAmount\(locale, annualTotal\)/);
  assert.match(source, /allowanceImagePrefix: '最多'/);
  assert.match(source, /allowanceImageSuffix: '张图'/);
  assert.match(
    source,
    /function formatCreditAllowanceNumber\(\s*locale: string,\s*value: number,\s*options: \{ compact\?: boolean \} = \{\}\s*\)/
  );
  assert.match(source, /function getEstimatedImageCount\(credits: number\) \{\s*return Math\.max\(1, credits\);\s*\}/);
  assert.match(source, /compactCreditCount/);
  assert.match(source, /compactImageCount/);
  assert.match(source, /runtimeCopy\.allowanceImagePrefix/);
  assert.match(source, /<ul className="mt-5 space-y-1\.5 text-sm leading-5 text-\[#5a5360\]">/);
  assert.match(source, /<Check className=\{featureCheckClassName\} \/>/);
  assert.ok(ctaIndex > -1);
  assert.ok(allowanceIndex > ctaIndex);
  assert.doesNotMatch(source, /planCopy\.cta/);
  assert.doesNotMatch(source, /planCopy\.description/);
  assert.doesNotMatch(source, /vogue-pricing-savings-note/);
  assert.doesNotMatch(source, /monthlyHint/);
  assert.doesNotMatch(source, /annualSaveLabel/);
  assert.doesNotMatch(source, /runtimeCopy\.annualSaveSuffix/);
  assert.doesNotMatch(source, /const planSelectLabels/);
});

test('subscription plan titles use bare tier names in every locale', () => {
  const expectedNames = {
    basic: 'Basic',
    pro: 'Pro',
    creator: 'Creator',
    elite: 'Elite',
  };
  const planSuffixPattern =
    /\bPlan\b|プラン|플랜|Plano|Forfait|Formule|План|Тариф|套餐|方案/i;

  for (const locale of SUPPORTED_VOGUE_LOCALES) {
    const plans = readVogueCopy(locale).pricing.plans;

    for (const [planId, expectedName] of Object.entries(expectedNames)) {
      assert.equal(
        plans[planId as keyof typeof plans].name,
        expectedName,
        `${locale} ${planId} plan title`
      );
      assert.doesNotMatch(
        plans[planId as keyof typeof plans].name,
        planSuffixPattern,
        `${locale} ${planId} plan title suffix`
      );
    }
  }
});

test('credit allowance numbers compact only at ten thousand and above', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const formatterStart = source.indexOf('function formatCreditAllowanceNumber');
  const formatterEnd = source.indexOf(
    'function formatYearlyMonthlyDisplayPrice',
    formatterStart
  );
  const formatterSource = source.slice(formatterStart, formatterEnd);

  assert.ok(formatterStart > -1);
  assert.ok(formatterEnd > formatterStart);
  assert.match(formatterSource, /const shouldCompact = options\.compact \?\? true/);
  assert.match(formatterSource, /if \(shouldCompact && value >= 10000\)/);
  assert.match(formatterSource, /const compactValue = value \/ 1000/);
  assert.match(formatterSource, /format\(compactValue\)\}K`/);
  assert.match(formatterSource, /return formatLocalizedNumber\(locale, value\)/);
  assert.match(
    source,
    /const shouldCompactDisplayedCredits = pricingTab === 'yearly'/
  );
  assert.match(
    source,
    /formatCreditAllowanceNumber\(\s*locale,\s*displayedCredits,\s*\{\s*compact: shouldCompactDisplayedCredits\s*\}\s*\)/
  );
  assert.match(
    source,
    /formatCreditAllowanceNumber\(\s*locale,\s*displayedImages,\s*\{\s*compact: shouldCompactDisplayedCredits\s*\}\s*\)/
  );
  assert.match(source, /formatCreditAllowanceNumber\(\s*locale,\s*pack\.credits\s*\)/);
  assert.match(
    source,
    /formatCreditAllowanceNumber\(\s*locale,\s*getEstimatedImageCount\(pack\.credits\)\s*\)/
  );
  assert.doesNotMatch(source, /function formatCompactAllowanceNumber/);
  assert.doesNotMatch(source, /function formatSubscriptionAllowanceNumber/);
  assert.doesNotMatch(source, /planId !== 'basic'/);
  assert.doesNotMatch(formatterSource, /if \(value >= 1000\)/);
});

test('yearly headline prices truncate to one decimal only in the UI', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const displayFormatterStart = source.indexOf(
    'function formatYearlyMonthlyDisplayPrice'
  );
  const displayFormatterEnd = source.indexOf(
    'function formatUsdAmount',
    displayFormatterStart
  );
  const displayFormatterSource = source.slice(
    displayFormatterStart,
    displayFormatterEnd
  );

  assert.match(source, /function formatYearlyMonthlyDisplayPrice\(locale: string, value: number\)/);
  assert.match(source, /const truncatedValue = Math\.trunc\(value \* 10\) \/ 10/);
  assert.match(
    source,
    /formatYearlyMonthlyDisplayPrice\(\s*locale,\s*plan\.yearlyMonthlyPrice\s*\)/
  );
  assert.match(source, /planCopy\.monthlyOriginalPrice/);
  assert.match(source, /const annualTotal = plan\.yearlyMonthlyPrice \* 12/);
  assert.match(source, /formatUsdAmount\(locale, annualTotal\)/);
  assert.doesNotMatch(displayFormatterSource, /Math\.round/);
  assert.doesNotMatch(source, /\{planCopy\.yearlyMonthlyPrice\}/);
});

test('pricing cards move yearly savings into the yearly tab badge', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const labelStart = source.indexOf('function getYearlySavingsLabel');
  const labelEnd = source.indexOf(
    'function getEstimatedImageCount',
    labelStart
  );
  const labelSource = source.slice(labelStart, labelEnd);
  const badgeStart = source.indexOf('yearlySavingsLabel ?');
  const badgeEnd = source.indexOf('{pricingTab ===', badgeStart);
  const badgeSource = source.slice(badgeStart, badgeEnd);

  assert.match(source, /vogue-pricing-highlight-shell/);
  assert.match(source, /vogue-pricing-highlight-banner/);
  assert.match(source, /vogue-pricing-highlight-card/);
  assert.ok(labelStart > -1);
  assert.ok(labelEnd > labelStart);
  assert.match(labelSource, /plan\.id === 'basic'/);
  assert.match(labelSource, /return null/);
  assert.match(labelSource, /const annualSavings = plan\.monthlyPrice \* 12 - annualTotal/);
  assert.match(
    labelSource,
    /`\$\{plan\.yearlyDiscount\}% OFF, Save \$\{formatUsdAmount\(locale, annualSavings\)\}`/
  );
  assert.match(
    source,
    /pricingTab === 'yearly'\s*\?\s*getYearlySavingsLabel\(\s*locale,\s*plan,\s*annualTotal\s*\)\s*:\s*null/
  );
  assert.match(source, /yearlySavingsLabel \?/);
  assert.match(badgeSource, /bg-\[#8357F0\]/);
  assert.match(badgeSource, /whitespace-nowrap/);
  assert.match(badgeSource, /text-right/);
  assert.match(badgeSource, /font-\[var\(--font-vogue-sans\)\]/);
  assert.match(badgeSource, /font-semibold/);
  assert.match(badgeSource, /tracking-normal/);
  assert.match(badgeSource, /text-\[#ffffff\]/);
  assert.doesNotMatch(badgeSource, /max-w-\[96px\]/);
  assert.doesNotMatch(badgeSource, /whitespace-normal/);
  assert.match(badgeSource, /\{yearlySavingsLabel\}/);
  assert.match(source, /\{pricingCopy\.toggle\.saveUpTo\}/);
  assert.doesNotMatch(source, /\{tab\.badge\}/);
  assert.doesNotMatch(source, /Save \{plan\.yearlyDiscount\}% OFF/);
  assert.doesNotMatch(source, /\{plan\.yearlyDiscount\}% \{runtimeCopy\.discountSuffix\}/);
  assert.doesNotMatch(badgeSource, /border-\[#c9d8ff\]/);
  assert.doesNotMatch(badgeSource, /bg-\[#eef4ff\]/);
  assert.doesNotMatch(badgeSource, /bg-\[#f2f2f0\]/);
  assert.doesNotMatch(badgeSource, /text-\[#334ddb\]/);
  assert.doesNotMatch(badgeSource, /uppercase/);
  assert.doesNotMatch(badgeSource, /font-black/);
  assert.doesNotMatch(
    source,
    /pricingTab === 'yearly'\s*\?\s*pricingCopy\.toggle\.yearly\s*:\s*pricingCopy\.subscriptionBadge/
  );
  assert.doesNotMatch(source, /mb-5 flex min-h-7 items-center justify-between/);
});

test('yearly elite card uses a yellow best value strip', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const highlightStart = source.indexOf("const isBestValue = pricingTab === 'yearly'");
  const highlightEnd = source.indexOf('const displayedCredits', highlightStart);
  const highlightSource = source.slice(highlightStart, highlightEnd);

  assert.ok(highlightStart > -1);
  assert.ok(highlightEnd > highlightStart);
  assert.match(highlightSource, /Boolean\(\s*plan\.bestValue\s*\)/);
  assert.match(highlightSource, /const highlightLabel = isBestValue/);
  assert.match(highlightSource, /pricingCopy\.bestValueBadge/);
  assert.match(highlightSource, /pricingCopy\.popularBadge/);
  assert.match(highlightSource, /const isHighlighted = Boolean\(highlightLabel\)/);
  assert.match(source, /vogue-pricing-highlight-best-value-fill/);
  assert.match(
    source,
    /vogue-pricing-highlight-best-value-fill[^']*bg-\[linear-gradient\(180deg,#D7FF00_0px,#D7FF00_42px,#ffffff_100%\)\]/
  );
  assert.match(
    source,
    /vogue-pricing-highlight-best-value-banner[^']*bg-\[#D7FF00\][^']*text-\[#171a23\]/
  );
  assert.match(source, /\{highlightLabel\}/);
  assert.doesNotMatch(source, /pricingCopy\.bestValueBadge[^?]*pricingTab === 'monthly'/);
});

test('yearly savings badges keep best value yellow and ordinary discounts blue', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const badgeStart = source.indexOf('yearlySavingsLabel ?');
  const badgeEnd = source.indexOf('{pricingTab ===', badgeStart);
  const badgeSource = source.slice(badgeStart, badgeEnd);

  assert.ok(badgeStart > -1);
  assert.ok(badgeEnd > badgeStart);
  assert.match(badgeSource, /className=\{cn\(/);
  assert.match(
    badgeSource,
    /isBestValue\s*\?\s*'bg-\[#D7FF00\] text-\[#171a23\] shadow-\[0_10px_20px_rgba\(215,255,0,0\.18\)\]'/
  );
  assert.match(
    badgeSource,
    /:\s*'bg-\[#8357F0\] text-\[#ffffff\] shadow-\[0_10px_20px_rgba\(131,87,240,0\.18\)\]'/
  );
  assert.match(badgeSource, /\{yearlySavingsLabel\}/);
});

test('credit pack titles use bare tier names without credits or pack suffixes', () => {
  const expectedPackNames = {
    starter: 'Starter',
    growth: 'Growth',
    professional: 'Studio',
  } as const;
  const expectedEnglishBadges = {
    starter: 'Quick top-up',
    growth: 'Most Popular',
    professional: 'Best value',
  } as const;
  const expectedChineseBadges = {
    starter: '快速补充',
    growth: 'Most Popular',
    professional: '最划算',
  } as const;
  const blockedSuffixes =
    /Credits|积分包|积分套餐|クレジット|크레딧|Créditos|crédits|кредиты/i;

  for (const locale of SUPPORTED_VOGUE_LOCALES) {
    const packs = readVogueCopy(locale).pricing.packs;

    assert.equal(
      packs.starter.name,
      expectedPackNames.starter,
      `${locale} starter pack name`
    );
    assert.equal(
      packs.growth.name,
      expectedPackNames.growth,
      `${locale} growth pack name`
    );
    assert.equal(
      packs.professional.name,
      expectedPackNames.professional,
      `${locale} professional pack name`
    );

    for (const pack of Object.values(packs)) {
      assert.doesNotMatch(pack.name, blockedSuffixes);
    }
  }

  assert.deepEqual(
    {
      starter: readVogueCopy('en').pricing.packs.starter.badge,
      growth: readVogueCopy('en').pricing.packs.growth.badge,
      professional: readVogueCopy('en').pricing.packs.professional.badge,
    },
    expectedEnglishBadges
  );
  assert.deepEqual(
    {
      starter: readVogueCopy('zh').pricing.packs.starter.badge,
      growth: readVogueCopy('zh').pricing.packs.growth.badge,
      professional: readVogueCopy('zh').pricing.packs.professional.badge,
    },
    expectedChineseBadges
  );
});

test('credit pack checkout modal stays over pricing cards with readable payment buttons', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const checkoutStart = source.indexOf('selectedPack && selectedPackCopy');
  const checkoutSource = source.slice(checkoutStart);

  assert.ok(checkoutStart > -1);
  assert.match(source, /const selectedPackCheckoutTitle = selectedPackCopy/);
  assert.match(
    source,
    /`\$\{pricingCopy\.toggle\.oneTime\} - \$\{selectedPackCopy\.name\}`/
  );
  assert.match(checkoutSource, /\{selectedPackCheckoutTitle\}/);
  assert.match(checkoutSource, /aria-label=\{selectedPackCheckoutTitle\}/);
  assert.match(source, /const localPaymentCtaClassName =/);
  assert.match(
    source,
    /localPaymentCtaClassName =\s*'[^']*bg-\[#eef4ff\][^']*text-\[#171a23\]/
  );
  assert.match(source, /function StripeLogo\(\)/);
  assert.match(source, /function AlipayLogo\(\)/);
  assert.match(source, /function WeChatPayLogo\(\)/);
  assert.match(checkoutSource, /<StripeLogo \/>/);
  assert.match(checkoutSource, /<AlipayLogo \/>/);
  assert.match(checkoutSource, /<WeChatPayLogo \/>/);
  assert.match(checkoutSource, /bg-transparent/);
  assert.doesNotMatch(checkoutSource, /backdrop-blur/);
  assert.doesNotMatch(checkoutSource, /bg-\[#fbf2ed\]\/82/);
  assert.doesNotMatch(checkoutSource, /pricingCopy\.checkoutTitle/);
  assert.doesNotMatch(checkoutSource, /pricingCopy\.checkoutDescription/);
  assert.doesNotMatch(
    checkoutSource,
    /rounded-\[16px\] border border-\[var\(--vogue-border\)\] bg-\[#fbf2ed\]/
  );
  assert.match(checkoutSource, /className=\{localPaymentCtaClassName\}/);
  assert.match(checkoutSource, /pricingCopy\.checkout\.alipay/);
  assert.match(checkoutSource, /pricingCopy\.checkout\.wechatPay/);
  assert.doesNotMatch(
    checkoutSource,
    /className=\{`\$\{softCtaClassName\} border border-\[#d8e4ff\] bg-white`\}/
  );
  assert.doesNotMatch(source, /CreditCard/);
  assert.doesNotMatch(source, /WalletCards/);
});

test('recommended pricing shell sits above equal-height white cards', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');

  assert.match(source, /getSubscriptionCardGridClassName\(displayedSubscriptionCardCount\)/);
  assert.match(
    source,
    /vogue-pricing-highlight-shell flex h-full w-full overflow-visible rounded-\[22px\]/
  );
  assert.match(
    source,
    /vogue-pricing-highlight-fill pointer-events-none absolute -top-7 bottom-0 left-0 right-0 z-0 rounded-\[22px\] bg-\[linear-gradient\(180deg,#8357F0_0px,#8357F0_42px,#ffffff_100%\)\]/
  );
  assert.match(
    source,
    /vogue-pricing-highlight-banner pointer-events-none absolute -top-7 left-0 right-0 z-\[1\] flex h-9/
  );
  assert.match(
    source,
    /vogue-pricing-highlight-banner[^']*rounded-t-\[22px\][^']*bg-\[#8357F0\][^']*pt-2/
  );
  assert.match(
    source,
    /vogue-pricing-highlight-banner[^']*font-\[var\(--font-vogue-sans\)\][^']*font-semibold[^']*tracking-normal[^']*text-\[#ffffff\]/
  );
  assert.match(
    source,
    /const pricingCardClassName =\s*'vogue-pricing-card relative z-10 flex h-full w-full min-h-\[640px\] flex-col rounded-\[20px\] border bg-white p-6 pt-7 text-left shadow-none xl:min-h-\[660px\]'/
  );
  assert.match(source, /className=\{cn\(\s*pricingCardClassName,/);
  assert.match(source, /vogue-pricing-highlight-card border-\[#e1e1df\]/);
  assert.doesNotMatch(source, /flex h-\[560px\] flex-col overflow-hidden/);
  assert.doesNotMatch(source, /overflow-hidden rounded-\[22px\] border bg-white/);
  assert.doesNotMatch(source, /flex min-h-\[548px\] flex-col/);
  assert.doesNotMatch(source, /min-h-\[510px\]/);
  assert.doesNotMatch(source, /xl:min-h-\[532px\]/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-shell[^']*bg-\[#d7ff43\]/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-shell[^']*border-\[#d7ff43\]/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-shell[^']*bg-\[linear-gradient/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*bg-\[linear-gradient/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*top-0/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-shell[^']*pt-11/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-shell[^']*pt-9/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*-top-9/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*left-3 right-3/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*w-\[78%\]/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*max-w-\[260px\]/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*h-11/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*h-10/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*h-8/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*font-black/);
  assert.doesNotMatch(source, /vogue-pricing-highlight-banner[^']*text-\[#334ddb\]/);
});

test('monthly subscription grid includes the free card in its column count', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');

  assert.match(source, /function getSubscriptionCardGridClassName\(cardCount: number\)/);
  assert.match(source, /const showFreePlanCard = pricingTab === 'monthly'/);
  assert.match(
    source,
    /const displayedSubscriptionCardCount =\s*subscriptionCards\.length \+ \(showFreePlanCard \? 1 : 0\)/
  );
  assert.match(
    source,
    /getSubscriptionCardGridClassName\(displayedSubscriptionCardCount\)/
  );
  assert.match(source, /mx-auto w-full max-w-\[1120px\] sm:grid-cols-2 lg:grid-cols-3/);
  assert.match(source, /mx-auto w-full max-w-\[1500px\] sm:grid-cols-2 xl:grid-cols-4/);
});

test('monthly pricing prepends a free comparison card without checkout', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const freeCardStart = source.indexOf('showFreePlanCard && (');
  const freeCardEnd = source.indexOf('{subscriptionCards.map', freeCardStart);
  const freeCardSource = source.slice(freeCardStart, freeCardEnd);
  const englishFreePlan = readVogueCopy('en').pricing.freePlan;
  const chineseFreePlan = readVogueCopy('zh').pricing.freePlan;

  assert.equal(englishFreePlan.name, 'Free');
  assert.equal(englishFreePlan.price, '$0');
  assert.match(englishFreePlan.features[0], /\{credits\}/);
  assert.equal(
    englishFreePlan.features[0],
    '{credits} welcome credits'
  );
  assert.ok(
    englishFreePlan.features.includes('1 free generation, no sign-up')
  );
  assert.ok(
    englishFreePlan.features.includes('Access to selected models only')
  );
  assert.ok(
    englishFreePlan.features.includes('1K output quality only')
  );
  assert.ok(
    englishFreePlan.features.includes('1 concurrent job')
  );
  assert.deepEqual(englishFreePlan.limitations, [
    'Advanced models',
    '2K & 4K output quality',
    'Fast generation',
    'Watermark-free output',
  ]);
  assert.equal(chineseFreePlan.name, 'Free');
  assert.equal(chineseFreePlan.price, '$0');
  assert.match(chineseFreePlan.features[0], /\{credits\}/);
  assert.equal(chineseFreePlan.features[0], '赠送 {credits} 积分');
  assert.ok(chineseFreePlan.features.includes('免登录免费生成 1 次'));
  assert.ok(
    chineseFreePlan.features.includes('仅可使用部分模型')
  );
  assert.ok(
    chineseFreePlan.features.includes('仅限 1K 画质')
  );
  assert.ok(
    chineseFreePlan.features.includes('1 个并发任务')
  );
  assert.deepEqual(chineseFreePlan.limitations, [
    '高级模型',
    '2K/4K 画质',
    '快速生成',
    '无水印输出',
  ]);
  assert.ok(freeCardStart > -1);
  assert.ok(freeCardEnd > freeCardStart);
  assert.match(source, /REGISTER_GIFT_CREDITS_AMOUNT/);
  assert.match(source, /formatPricingFeatureText/);
  assert.match(freeCardSource, /\{pricingCopy\.freePlan\.name\}/);
  assert.match(freeCardSource, /\{pricingCopy\.freePlan\.price\}/);
  assert.match(freeCardSource, /\{pricingCopy\.freePlan\.cta\}/);
  assert.match(
    freeCardSource,
    /credits=\{REGISTER_GIFT_CREDITS_AMOUNT\}\s+maxCredits=\{maxDisplayedCredits\}/
  );
  assert.match(freeCardSource, /activeSegments=\{1\}/);
  assert.match(
    freeCardSource,
    /formatPricingFeatureText\(\s*pricingCopy\.freePlan\.features\[0\],\s*locale\s*\)/
  );
  assert.match(
    freeCardSource,
    /pricingCopy\.freePlan\.features\.slice\(1\)\.map/
  );
  assert.match(
    freeCardSource,
    /pricingCopy\.freePlan\.limitations\.map/
  );
  assert.match(freeCardSource, /featureUnavailableClassName/);
  assert.doesNotMatch(freeCardSource, /startStripeCheckout/);
  assert.doesNotMatch(freeCardSource, /plan\.priceId/);
});

test('paid subscription cards spell out shared upgraded benefits', () => {
  const expectedGalleryByLocale = {
    en: 'Browse & copy AI Prompt Gallery',
    zh: '免费浏览并复制 AI Prompt Gallery',
    fr: 'Parcourir et copier la galerie de prompts IA',
    ru: 'Просмотр и копирование AI Prompt Gallery',
    pt: 'Explore e copie a AI Prompt Gallery',
    ja: 'AI Prompt Gallery を閲覧・コピー',
    ko: 'AI Prompt Gallery 탐색 및 복사',
  } as const;
  const expectedAllModelsByLocale = {
    en: 'All models available',
    zh: '全部模型可用',
    fr: 'Tous les modèles disponibles',
    ru: 'Доступны все модели',
    pt: 'Todos os modelos disponíveis',
    ja: '全モデル利用可能',
    ko: '모든 모델 사용 가능',
  } as const;
  const expectedQualityByLocale = {
    en: '2K & 4K output quality',
    zh: '2K/4K 画质',
    fr: 'Qualité de sortie 2K et 4K',
    ru: 'Качество вывода 2K и 4K',
    pt: 'Qualidade de saída 2K e 4K',
    ja: '2K/4K 出力品質',
    ko: '2K/4K 출력 품질',
  } as const;
  const expectedNoWatermarkByLocale = {
    en: 'No watermark output',
    zh: '无水印输出',
    fr: 'Sorties sans filigrane',
    ru: 'Вывод без водяного знака',
    pt: 'Saída sem marca d’água',
    ja: 'ウォーターマークなし',
    ko: '워터마크 없는 출력',
  } as const;
  const expectedConcurrentJobsByLocale = {
    en: { basic: '1 concurrent job', pro: '2 concurrent jobs', creator: '4 concurrent jobs', elite: '4 concurrent jobs' },
    zh: { basic: '1 个并发任务', pro: '2 个并发任务', creator: '4 个并发任务', elite: '4 个并发任务' },
    fr: { basic: '1 tâche parallèle', pro: '2 tâches parallèles', creator: '4 tâches parallèles', elite: '4 tâches parallèles' },
    ru: { basic: '1 параллельная задача', pro: '2 параллельные задачи', creator: '4 параллельные задачи', elite: '4 параллельные задачи' },
    pt: { basic: '1 tarefa paralela', pro: '2 tarefas paralelas', creator: '4 tarefas paralelas', elite: '4 tarefas paralelas' },
    ja: { basic: '並列ジョブ 1 件', pro: '並列ジョブ 2 件', creator: '並列ジョブ 4 件', elite: '並列ジョブ 4 件' },
    ko: { basic: '동시 작업 1개', pro: '동시 작업 2개', creator: '동시 작업 4개', elite: '동시 작업 4개' },
  } as const;
  const expectedHistoryByLocale = {
    en: { basic: '30-day generation history', pro: '30-day generation history', creator: 'Permanent generation history', elite: 'Permanent generation history' },
    zh: { basic: '30 天生成记录', pro: '30 天生成记录', creator: '永久生成记录', elite: '永久生成记录' },
    fr: { basic: 'Historique de 30 jours', pro: 'Historique de 30 jours', creator: 'Historique permanent', elite: 'Historique permanent' },
    ru: { basic: 'История за 30 дней', pro: 'История за 30 дней', creator: 'Постоянная история', elite: 'Постоянная история' },
    pt: { basic: 'Histórico de 30 dias', pro: 'Histórico de 30 dias', creator: 'Histórico permanente', elite: 'Histórico permanente' },
    ja: { basic: '30日間の生成履歴', pro: '30日間の生成履歴', creator: '永続的な生成履歴', elite: '永続的な生成履歴' },
    ko: { basic: '30일 생성 기록', pro: '30일 생성 기록', creator: '영구 생성 기록', elite: '영구 생성 기록' },
  } as const;
  const expectedFasterGenerationByLocale = {
    en: 'Faster generation',
    zh: '更快生成',
    fr: 'Génération plus rapide',
    ru: 'Более быстрая генерация',
    pt: 'Geração mais rápida',
    ja: 'より高速な生成',
    ko: '더 빠른 생성',
  } as const;
  const expectedSupportByLocale = {
    en: { creator: 'Priority support', elite: 'Top-priority customer support' },
    zh: { creator: '优先客服支持', elite: '最高优先级客服' },
    fr: { creator: 'Support prioritaire', elite: 'Support client top priorité' },
    ru: { creator: 'Приоритетная поддержка', elite: 'Поддержка высшего приоритета' },
    pt: { creator: 'Suporte prioritário', elite: 'Suporte ao cliente top prioridade' },
    ja: { creator: '優先サポート', elite: '最優先カスタマーサポート' },
    ko: { creator: '우선 지원', elite: '최고 우선 고객 지원' },
  } as const;
  const inheritedBenefitPattern =
    /Everything in|包含 .* 全部权益|Tout .* inclus|Все из|Tudo do|のすべて|전체 포함/i;
  const staleBenefitPattern =
    /More reference uploads|更多参考图上传|Plus d’images de référence|Больше референсов|Mais uploads de referência|参考画像アップロード増加|더 많은 레퍼런스 업로드|parallel jobs?|Priority generation|Highest priority generation|Standard generation speed|标准生成速度|Vitesse de génération standard|Стандартная скорость генерации|Velocidade de geração padrão|標準生成速度|표준 생성 속도|优先生成|最高优先级生成|Génération prioritaire|Génération en priorité maximale|Приоритетная генерация|Генерация с максимальным приоритетом|Geração prioritária|Geração com prioridade máxima|優先生成|最高優先生成|우선 생성|최고 우선순위 생성/i;

  for (const locale of SUPPORTED_VOGUE_LOCALES) {
    const pricing = readVogueCopy(locale).pricing;
    const expectedGallery = expectedGalleryByLocale[locale];
    const expectedAllModels = expectedAllModelsByLocale[locale];
    const expectedQuality = expectedQualityByLocale[locale];
    const expectedNoWatermark = expectedNoWatermarkByLocale[locale];

    for (const planId of ['basic', 'pro', 'creator', 'elite'] as const) {
      assert.ok(
        pricing.plans[planId].features.includes(expectedGallery),
        `${locale} ${planId} plan should mention prompt gallery access`
      );
      assert.ok(
        pricing.plans[planId].features.includes(expectedAllModels),
        `${locale} ${planId} plan should mention all model access`
      );
      assert.ok(
        pricing.plans[planId].features.includes(expectedQuality),
        `${locale} ${planId} plan should mention upgraded output quality`
      );
      assert.ok(
        pricing.plans[planId].features.includes(expectedNoWatermark),
        `${locale} ${planId} plan should mention watermark-free output`
      );
      assert.ok(
        pricing.plans[planId].features.includes(
          expectedConcurrentJobsByLocale[locale][planId]
        ),
        `${locale} ${planId} plan should mention concurrent job allowance`
      );
      assert.ok(
        pricing.plans[planId].features.includes(
          expectedHistoryByLocale[locale][planId]
        ),
        `${locale} ${planId} plan should mention the right history retention`
      );
      assert.ok(
        pricing.plans[planId].features.includes(
          expectedFasterGenerationByLocale[locale]
        ),
        `${locale} ${planId} plan should mention faster generation`
      );
      assert.doesNotMatch(
        pricing.plans[planId].features.join('\n'),
        inheritedBenefitPattern,
        `${locale} ${planId} plan should not use inherited benefit copy`
      );
    }
    for (const planId of ['creator', 'elite'] as const) {
      const features = pricing.plans[planId].features;
      const fasterIndex = features.indexOf(expectedFasterGenerationByLocale[locale]);
      const historyIndex = features.indexOf(expectedHistoryByLocale[locale][planId]);
      const supportIndex = features.indexOf(expectedSupportByLocale[locale][planId]);

      assert.ok(fasterIndex > -1, `${locale} ${planId} should use faster generation copy`);
      assert.ok(
        historyIndex === fasterIndex + 1,
        `${locale} ${planId} should place permanent history right after faster generation`
      );
      assert.ok(
        supportIndex === historyIndex + 1,
        `${locale} ${planId} should place support last after permanent history`
      );
      assert.equal(
        supportIndex,
        features.length - 1,
        `${locale} ${planId} support should be the last feature`
      );
    }
    assert.doesNotMatch(
      [
        pricing.plans.basic.features,
        pricing.plans.pro.features,
        pricing.plans.creator.features,
        pricing.plans.elite.features,
      ].flat().join('\n'),
      staleBenefitPattern,
      `${locale} plans should not keep vague reference-upload copy`
    );
  }
});

test('subscription cards render a visual-only credit scale below the CTA', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const subscriptionSectionStart = source.indexOf('{subscriptionCards.map((plan) =>');
  const subscriptionSectionEnd = source.indexOf('{checkoutError', subscriptionSectionStart);
  const subscriptionSectionSource = source.slice(
    subscriptionSectionStart,
    subscriptionSectionEnd
  );
  const ctaIndex = subscriptionSectionSource.indexOf(
    '{getPlanSelectCta(plan.id, runtimeCopy)}'
  );
  const dividerIndex = subscriptionSectionSource.indexOf(
    '<div className="mt-5 border-t border-[var(--vogue-border)] pt-5">'
  );
  const meterIndex = subscriptionSectionSource.indexOf('<PricingCreditMeter');
  const featuresIndex = subscriptionSectionSource.indexOf(
    '<ul className="mt-5 space-y-1.5'
  );

  assert.match(source, /const PRICING_CREDIT_METER_SEGMENTS = 28/);
  assert.match(
    source,
    /function getCreditMeterActiveSegments\(\s*credits: number,\s*maxCredits: number\s*\)/
  );
  assert.match(source, /function getSubscriptionCreditMeterSegments\(/);
  assert.match(
    source,
    /month:\s*\{\s*basic:\s*6,\s*pro:\s*6,\s*creator:\s*16,\s*elite:\s*28\s*,?\s*\}/
  );
  assert.match(
    source,
    /year:\s*\{\s*basic:\s*6,\s*pro:\s*10,\s*creator:\s*16,\s*elite:\s*28\s*,?\s*\}/
  );
  assert.match(
    source,
    /Math\.ceil\(\(credits \/ maxCredits\) \* PRICING_CREDIT_METER_SEGMENTS\)/
  );
  assert.match(source, /activeSegments\?: number/);
  assert.match(source, /function PricingCreditMeter\(/);
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /data-pricing-credit-meter="true"/);
  assert.match(
    source,
    /data-pricing-credit-meter-segment=\{active \? 'active' : 'inactive'\}/
  );
  assert.match(
    source,
    /Array\.from\(\{ length: PRICING_CREDIT_METER_SEGMENTS \}/
  );
  assert.match(source, /const maxDisplayedCredits = Math\.max\(\s*1,\s*\.\.\.subscriptionCards\.map\(/);
  assert.match(
    subscriptionSectionSource,
    /<PricingCreditMeter\s+activeSegments=\{getSubscriptionCreditMeterSegments\(\s*plan\.id,\s*plan\.interval\s*\)\}\s+credits=\{displayedCredits\}\s+maxCredits=\{maxDisplayedCredits\}\s*\/>/
  );
  assert.ok(ctaIndex > -1);
  assert.ok(dividerIndex > ctaIndex);
  assert.ok(meterIndex > dividerIndex);
  assert.ok(featuresIndex > meterIndex);
  assert.doesNotMatch(source, /快速生成|热门模型|Popular models|quick generation/i);
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
  const packBadgeStart = source.indexOf(
    'className="shrink-0 whitespace-nowrap rounded-[12px] bg-[#8357F0]'
  );
  const packBadgeEnd = source.indexOf('</span>', packBadgeStart);
  const packBadgeSource = source.slice(packBadgeStart, packBadgeEnd);
  const creditSectionStart = source.indexOf('creditPackPrices.map((pack) => {');
  const creditSectionEnd = source.indexOf('{checkoutError', creditSectionStart);
  const creditSectionSource = source.slice(creditSectionStart, creditSectionEnd);
  const creditButtonIndex = creditSectionSource.indexOf('{runtimeCopy.creditTopupCta}');
  const creditDividerIndex = creditSectionSource.indexOf(
    '<div className="mt-6 flex-1 border-t border-[var(--vogue-border)] pt-5">'
  );
  const creditMeterIndex = creditSectionSource.indexOf(
    '<PricingCreditMeter'
  );

  assert.match(source, /creditTopupCta: '购买积分'/);
  assert.match(source, /mx-auto mt-5 max-w-xl text-center/);
  assert.match(source, /mx-auto mt-4 grid max-w-\[1160px\] items-stretch gap-4 md:grid-cols-3 xl:mt-10/);
  assert.match(source, /className=\{cn\(\s*pricingCardClassName,/);
  assert.match(source, /\{packCopy\.badge\}/);
  assert.doesNotMatch(source, /pricingCopy\.oneTimeBadge/);
  assert.ok(packBadgeStart > -1);
  assert.ok(packBadgeEnd > packBadgeStart);
  assert.match(packBadgeSource, /bg-\[#8357F0\]/);
  assert.match(packBadgeSource, /font-\[var\(--font-vogue-sans\)\]/);
  assert.match(packBadgeSource, /font-semibold/);
  assert.match(packBadgeSource, /tracking-normal/);
  assert.match(packBadgeSource, /text-\[#ffffff\]/);
  assert.match(source, /oneTimePurchaseNoRenewal: '一次性购买，不自动续费'/);
  assert.match(source, /oneTimePurchaseNoRenewal: 'One-time purchase, no renewal'/);
  assert.match(source, /runtimeCopy\.oneTimePurchaseNoRenewal/);
  assert.match(source, /runtimeCopy\.creditTopupCta/);
  assert.match(source, /const maxCreditPackCredits = Math\.max\(\s*1,\s*\.\.\.creditPackPrices\.map\(\(pack\) => pack\.credits\)\s*\)/);
  assert.match(
    creditSectionSource,
    /<PricingCreditMeter\s+credits=\{pack\.credits\}\s+maxCredits=\{maxCreditPackCredits\}\s*\/>/
  );
  assert.ok(creditButtonIndex > -1);
  assert.ok(creditDividerIndex > creditButtonIndex);
  assert.ok(creditMeterIndex > creditDividerIndex);
  assert.doesNotMatch(source, /creditTopupTitle/);
  assert.doesNotMatch(source, /font-\[var\(--font-vogue-display\)\] text-\[24px\][^']*runtimeCopy\.creditTopupTitle/);
  assert.doesNotMatch(source, /runtimeCopy\.instantDelivery/);
  assert.doesNotMatch(source, /runtimeCopy\.noRenewal/);
  assert.doesNotMatch(source, /Instant top-up/);
  assert.doesNotMatch(source, /No auto-renewal/);
  assert.doesNotMatch(source, /text-\[#9a919d\]"> · </);
  assert.doesNotMatch(source, /packCopy\.description/);
  assert.doesNotMatch(source, /packCopy\.cta/);
  assert.doesNotMatch(source, /runtimeCopy\.estimatePrefix/);
  assert.doesNotMatch(source, /rounded-\[20px\] border p-5/);
  assert.doesNotMatch(source, /mx-auto mt-5 grid max-w-5xl gap-4 md:grid-cols-3/);
  assert.doesNotMatch(packBadgeSource, /font-black/);
  assert.doesNotMatch(packBadgeSource, /uppercase/);
  assert.doesNotMatch(packBadgeSource, /border-\[#c9d8ff\]/);
  assert.doesNotMatch(packBadgeSource, /bg-\[#eef4ff\]/);
  assert.doesNotMatch(packBadgeSource, /text-\[#334ddb\]/);
});

test('credit pack cards align one-time benefits with Basic access', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const creditSectionStart = source.indexOf('creditPackPrices.map((pack) => {');
  const creditSectionEnd = source.indexOf('{checkoutError', creditSectionStart);
  const creditSectionSource = source.slice(
    creditSectionStart,
    creditSectionEnd
  );
  const basicBenefitsIndex = creditSectionSource.indexOf(
    'pricingCopy.plans.basic.features.slice(1).map'
  );
  const oneTimePurchaseIndex = creditSectionSource.indexOf(
    '{runtimeCopy.oneTimePurchaseNoRenewal}'
  );

  assert.deepEqual(readVogueCopy('en').pricing.plans.basic.features.slice(1), [
    'Browse & copy AI Prompt Gallery',
    'All models available',
    '2K & 4K output quality',
    'No watermark output',
    '1 concurrent job',
    'Faster generation',
    '30-day generation history',
  ]);
  assert.deepEqual(readVogueCopy('zh').pricing.plans.basic.features.slice(1), [
    '免费浏览并复制 AI Prompt Gallery',
    '全部模型可用',
    '2K/4K 画质',
    '无水印输出',
    '1 个并发任务',
    '更快生成',
    '30 天生成记录',
  ]);
  assert.ok(creditSectionStart > -1);
  assert.ok(creditSectionEnd > creditSectionStart);
  assert.match(
    creditSectionSource,
    /pricingCopy\.plans\.basic\.features\.slice\(1\)\.map\(\(feature\) => \(/
  );
  assert.ok(basicBenefitsIndex > -1);
  assert.ok(oneTimePurchaseIndex > basicBenefitsIndex);
  assert.doesNotMatch(
    creditSectionSource,
    /pricingCopy\.plans\.(pro|creator|elite)\.features/
  );
  assert.doesNotMatch(
    creditSectionSource,
    /runtimeCopy\.(instantDelivery|noRenewal)/
  );
});

test('pricing billing tabs use a compact pill switcher', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const switcherStart = source.indexOf(
    '<div className="relative mx-auto mt-4 w-full max-w-[500px]'
  );
  const switcherGridStart = source.indexOf('<div className="grid grid-cols-3 gap-1">', switcherStart);
  const tabBadgeStart = source.indexOf('vogue-pricing-toggle-badge');
  const tabBadgeEnd = source.indexOf('</span>', tabBadgeStart);
  const tabBadgeSource = source.slice(tabBadgeStart, tabBadgeEnd);

  assert.ok(switcherStart > -1);
  assert.ok(switcherGridStart > switcherStart);
  assert.match(source, /relative mx-auto mt-4 w-full max-w-\[500px\] rounded-full/);
  assert.match(source, /sm:mt-5/);
  assert.match(source, /bg-white text-\[#171a23\]/);
  assert.match(source, /min-h-10/);
  assert.doesNotMatch(
    source.slice(switcherStart, switcherGridStart),
    /vogue-pricing-toggle-badge/
  );
  assert.match(source, /tab\.id === 'yearly' && \(/);
  assert.match(source, /vogue-pricing-toggle-badge pointer-events-none absolute -right-2 -top-4/);
  assert.match(source, /\{pricingCopy\.toggle\.saveUpTo\}/);
  assert.match(tabBadgeSource, /bg-\[#8357F0\]/);
  assert.match(tabBadgeSource, /font-\[var\(--font-vogue-sans\)\]/);
  assert.match(tabBadgeSource, /font-semibold/);
  assert.match(tabBadgeSource, /tracking-normal/);
  assert.match(tabBadgeSource, /text-\[#ffffff\]/);
  assert.doesNotMatch(source, /tab\.badge &&/);
  assert.doesNotMatch(source, /ml-1\.5 hidden shrink-0 whitespace-nowrap rounded-full/);
  assert.doesNotMatch(source, /mx-auto mt-6 w-full max-w-\[520px\]/);
  assert.doesNotMatch(source, /sm:mt-7/);
  assert.doesNotMatch(source, /flex min-h-12 flex-col/);
  assert.doesNotMatch(tabBadgeSource, /font-black/);
  assert.doesNotMatch(tabBadgeSource, /border-\[#c9d8ff\]/);
  assert.doesNotMatch(tabBadgeSource, /bg-\[#eef4ff\]/);
  assert.doesNotMatch(tabBadgeSource, /text-\[#334ddb\]/);
});

test('yearly savings badges are large enough to read without changing palette', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const badgeStart = source.indexOf('yearlySavingsLabel ?');
  const badgeEnd = source.indexOf('{pricingTab ===', badgeStart);
  const badgeSource = source.slice(badgeStart, badgeEnd);

  assert.ok(badgeStart > -1);
  assert.ok(badgeEnd > badgeStart);
  assert.match(
    badgeSource,
    /rounded-\[12px\] px-3 py-1\.5 text-right font-\[var\(--font-vogue-sans\)\] text-\[11px\]/
  );
  assert.match(badgeSource, /font-semibold/);
  assert.match(badgeSource, /tracking-normal/);
  assert.match(badgeSource, /bg-\[#8357F0\]/);
  assert.match(badgeSource, /bg-\[#D7FF00\]/);
  assert.doesNotMatch(badgeSource, /text-\[10px\]/);
  assert.doesNotMatch(badgeSource, /px-2\.5 py-1/);
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

test('app locale provider and root html language stay server-rendered', () => {
  const rootLayout = read('src/app/layout.tsx');
  const localeLayout = read('src/app/[locale]/layout.tsx');
  const middleware = read('src/middleware.ts');

  assert.match(rootLayout, /export default async function RootLayout/);
  assert.match(rootLayout, /headers\(\)/);
  assert.match(rootLayout, /REQUEST_LOCALE_HEADER/);
  assert.match(rootLayout, /getCookieLocale/);
  assert.match(rootLayout, /getAcceptedLocale/);
  assert.match(rootLayout, /<html lang=\{htmlLang\}/);
  assert.doesNotMatch(rootLayout, /<html lang="en"/);
  assert.doesNotMatch(rootLayout, /NextIntlClientProvider/);
  assert.doesNotMatch(rootLayout, /getLocale/);
  assert.doesNotMatch(rootLayout, /getMessagesForLocale/);
  assert.doesNotMatch(rootLayout, /VogueSidebarShell/);
  assert.doesNotMatch(rootLayout, /PricingDialogProvider/);

  assert.match(middleware, /REQUEST_LOCALE_HEADER/);
  assert.match(middleware, /NextResponse\.next\(\{\s*request:\s*\{\s*headers:/);

  assert.match(localeLayout, /setRequestLocale\(locale\)/);
  assert.match(localeLayout, /<HtmlLangEffect locale=\{locale\}/);
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
  assert.match(
    source,
    /formatYearlyMonthlyDisplayPrice\(\s*locale,\s*plan\.yearlyMonthlyPrice\s*\)/
  );
  assert.match(source, /planCopy\.monthlyOriginalPrice/);
  assert.match(source, /vogue-pricing-primary-cta/);
  assert.match(source, /vogue-pricing-feature-check/);
  assert.match(
    source,
    /className=\{getSubscriptionCardGridClassName\(displayedSubscriptionCardCount\)\}/
  );
  assert.match(source, /<div className="mx-auto mt-4 grid max-w-\[1160px\] items-stretch gap-4 md:grid-cols-3 xl:mt-10">/);
  assert.match(source, /const pricingCardClassName =/);
  assert.doesNotMatch(source, /bg-\[#171a23\]/);
  assert.doesNotMatch(source, /border-\[#171a23\]/);
});

test('pricing dialog covers the whole viewport instead of the sidebar content area', () => {
  const source = read('src/components/pricing/PricingDialog.tsx');
  const overlayStart = source.indexOf('className="fixed bottom-0 left-0 right-0 top-0');
  const overlayEnd = source.indexOf('onMouseDown=', overlayStart);
  const overlaySource = source.slice(overlayStart, overlayEnd);
  const dialogStart = source.indexOf('className="vogue-pricing-light');
  const dialogEnd = source.indexOf('role="dialog"', dialogStart);
  const dialogSource = source.slice(dialogStart, dialogEnd);

  assert.ok(overlayStart > -1);
  assert.ok(overlayEnd > overlayStart);
  assert.ok(dialogStart > -1);
  assert.ok(dialogEnd > dialogStart);
  assert.match(overlaySource, /left-0 right-0 top-0/);
  assert.doesNotMatch(overlaySource, /min-\[641px\]:left-\[248px\]/);
  assert.match(dialogSource, /w-full max-w-\[1720px\]/);
  assert.doesNotMatch(dialogSource, /max-w-6xl/);
});
