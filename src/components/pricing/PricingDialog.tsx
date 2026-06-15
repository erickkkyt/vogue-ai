'use client';

import { getLocalePrefix } from '@/components/auth/auth-copy';
import { Button } from '@/components/ui/button';
import { REGISTER_GIFT_CREDITS_AMOUNT } from '@/config/product-policy';
import {
  creditPackPrices,
  findVogueSubscriptionPrice,
  getPricingSubscriptionPlanIdsForInterval,
  type VogueCreditPackId,
  type VoguePriceInterval,
  type VogueSubscriptionPlanId,
  type VogueSubscriptionPrice,
} from '@/config/pricing';
import {
  getVogueCopyFromMessages,
  type VogueLocale,
  type VogueUICopy,
} from '@/i18n/vogue';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import {
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useLocale, useMessages } from 'next-intl';
import { useMemo, useState } from 'react';

type ZpayPaymentMethod = 'alipay' | 'wxpay';
type PricingTab = 'yearly' | 'monthly' | 'one-time';
type PricingPlanId = keyof VogueUICopy['pricing']['plans'];
type PricingPackId = keyof VogueUICopy['pricing']['packs'];

type PricingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const primaryCtaClassName =
  'vogue-pricing-primary-cta h-11 w-full rounded-full bg-[#090a07] text-sm font-bold text-white shadow-none transition hover:bg-[#171812]';

const softCtaClassName =
  'vogue-pricing-primary-cta h-11 w-full rounded-full bg-[#090a07] text-sm font-bold text-white shadow-none transition hover:bg-[#171812]';

const localPaymentCtaClassName =
  'vogue-pricing-local-payment-cta h-11 w-full rounded-full border border-[#ccd9ff] bg-[#eef4ff] text-sm font-bold text-[#171a23] shadow-none transition hover:border-[#b7c8ff] hover:bg-[#e2ebff] hover:text-[#171a23]';

const featureCheckClassName =
  'vogue-pricing-feature-check mt-0.5 h-4 w-4 shrink-0 text-[#11120d]';

const featureUnavailableClassName =
  'vogue-pricing-feature-unavailable mt-0.5 h-4 w-4 shrink-0 text-[#e5484d]';

const pricingCardClassName =
  'vogue-pricing-card relative z-10 flex h-full w-full min-h-[640px] flex-col rounded-[20px] border bg-white p-6 pt-7 text-left shadow-none xl:min-h-[660px]';

const mobilePricingCardClassName =
  'max-[639px]:min-h-0 max-[639px]:p-5 max-[639px]:pt-5';

const PRICING_CREDIT_METER_SEGMENTS = 28;

const subscriptionCreditMeterSegments: Record<
  VoguePriceInterval,
  Record<VogueSubscriptionPlanId, number>
> = {
  month: { basic: 6, pro: 6, creator: 16, elite: 28 },
  year: { basic: 6, pro: 10, creator: 16, elite: 28 },
};

type RuntimePricingCopy = {
  annualBillingLabel: string;
  allowanceImagePrefix: string;
  allowanceImageSuffix: string;
  selectPlanCtas: Record<VogueSubscriptionPlanId, string>;
  creditTopupDescription: string;
  creditTopupCta: string;
  oneTimePurchaseNoRenewal: string;
  agreementPrefix: string;
  agreementConnector: string;
  agreementSuffix: string;
  termsLabel: string;
  privacyLabel: string;
};

type MobilePricingFeature = {
  text: string;
  emphasized?: boolean;
  unavailable?: boolean;
};

const runtimePricingCopy: Record<VogueLocale, RuntimePricingCopy> = {
  en: {
    annualBillingLabel: 'Billed yearly',
    allowanceImagePrefix: 'up to',
    allowanceImageSuffix: 'images',
    selectPlanCtas: {
      basic: 'Select Basic',
      pro: 'Select Pro',
      creator: 'Select Creator',
      elite: 'Select Elite',
    },
    creditTopupDescription: 'Add credits anytime. No subscription.',
    creditTopupCta: 'Buy credits',
    oneTimePurchaseNoRenewal: 'One-time purchase, no renewal',
    agreementPrefix: 'By purchasing, you agree to our',
    agreementConnector: 'and',
    agreementSuffix: '',
    termsLabel: 'Terms',
    privacyLabel: 'Privacy',
  },
  zh: {
    annualBillingLabel: '按年结算',
    allowanceImagePrefix: '最多',
    allowanceImageSuffix: '张图',
    selectPlanCtas: {
      basic: '选择 Basic',
      pro: '选择 Pro',
      creator: '选择 Creator',
      elite: '选择 Elite',
    },
    creditTopupDescription: '随时补充积分，不开启订阅。',
    creditTopupCta: '购买积分',
    oneTimePurchaseNoRenewal: '一次性购买，不自动续费',
    agreementPrefix: '购买即表示您同意',
    agreementConnector: '和',
    agreementSuffix: '',
    termsLabel: '服务条款',
    privacyLabel: '隐私政策',
  },
  fr: {
    annualBillingLabel: 'Facturé annuellement',
    allowanceImagePrefix: "jusqu'à",
    allowanceImageSuffix: 'images',
    selectPlanCtas: {
      basic: 'Choisir Basic',
      pro: 'Choisir Pro',
      creator: 'Choisir Creator',
      elite: 'Choisir Elite',
    },
    creditTopupDescription: 'Ajoutez des crédits à tout moment. Sans abonnement.',
    creditTopupCta: 'Acheter des crédits',
    oneTimePurchaseNoRenewal: 'Achat ponctuel, sans renouvellement',
    agreementPrefix: 'En achetant, vous acceptez nos',
    agreementConnector: 'et notre',
    agreementSuffix: '',
    termsLabel: 'Conditions',
    privacyLabel: 'Confidentialité',
  },
  ru: {
    annualBillingLabel: 'Оплата за год',
    allowanceImagePrefix: 'до',
    allowanceImageSuffix: 'изображений',
    selectPlanCtas: {
      basic: 'Выбрать Basic',
      pro: 'Выбрать Pro',
      creator: 'Выбрать Creator',
      elite: 'Выбрать Elite',
    },
    creditTopupDescription: 'Пополняйте кредиты в любое время. Без подписки.',
    creditTopupCta: 'Купить кредиты',
    oneTimePurchaseNoRenewal: 'Разовая покупка, без продления',
    agreementPrefix: 'Покупая, вы соглашаетесь с',
    agreementConnector: 'и',
    agreementSuffix: '',
    termsLabel: 'Условиями',
    privacyLabel: 'Политикой конфиденциальности',
  },
  pt: {
    annualBillingLabel: 'Cobrado anualmente',
    allowanceImagePrefix: 'até',
    allowanceImageSuffix: 'imagens',
    selectPlanCtas: {
      basic: 'Selecionar Basic',
      pro: 'Selecionar Pro',
      creator: 'Selecionar Creator',
      elite: 'Selecionar Elite',
    },
    creditTopupDescription: 'Adicione créditos quando quiser. Sem assinatura.',
    creditTopupCta: 'Comprar créditos',
    oneTimePurchaseNoRenewal: 'Compra única, sem renovação',
    agreementPrefix: 'Ao comprar, você aceita nossos',
    agreementConnector: 'e nossa',
    agreementSuffix: '',
    termsLabel: 'Termos',
    privacyLabel: 'Privacidade',
  },
  ja: {
    annualBillingLabel: '年額請求',
    allowanceImagePrefix: '最大',
    allowanceImageSuffix: '枚',
    selectPlanCtas: {
      basic: 'Basic を選択',
      pro: 'Pro を選択',
      creator: 'Creator を選択',
      elite: 'Elite を選択',
    },
    creditTopupDescription: 'いつでも追加できます。サブスクではありません。',
    creditTopupCta: 'クレジットを購入',
    oneTimePurchaseNoRenewal: '1回限りの購入、自動更新なし',
    agreementPrefix: '購入により',
    agreementConnector: 'と',
    agreementSuffix: 'に同意したものとみなされます',
    termsLabel: '利用規約',
    privacyLabel: 'プライバシーポリシー',
  },
  ko: {
    annualBillingLabel: '연간 청구',
    allowanceImagePrefix: '최대',
    allowanceImageSuffix: '장',
    selectPlanCtas: {
      basic: 'Basic 선택',
      pro: 'Pro 선택',
      creator: 'Creator 선택',
      elite: 'Elite 선택',
    },
    creditTopupDescription: '언제든 크레딧을 추가하세요. 구독이 아닙니다.',
    creditTopupCta: '크레딧 구매',
    oneTimePurchaseNoRenewal: '일회성 구매, 자동 갱신 없음',
    agreementPrefix: '구매 시',
    agreementConnector: '및',
    agreementSuffix: '에 동의한 것으로 간주됩니다',
    termsLabel: '약관',
    privacyLabel: '개인정보 처리방침',
  },
};

function getRuntimePricingCopy(locale: string) {
  return (
    runtimePricingCopy[locale as VogueLocale] ?? runtimePricingCopy.en
  );
}

function formatLocalizedNumber(locale: string, value: number) {
  return new Intl.NumberFormat(locale).format(value);
}

function formatPricingFeatureText(template: string, locale: string) {
  return template.replace(
    '{credits}',
    formatLocalizedNumber(locale, REGISTER_GIFT_CREDITS_AMOUNT)
  );
}

function formatCreditAllowanceNumber(
  locale: string,
  value: number,
  options: { compact?: boolean } = {}
) {
  const shouldCompact = options.compact ?? true;

  if (shouldCompact && value >= 10000) {
    const compactValue = value / 1000;
    return `${new Intl.NumberFormat(locale, {
      maximumFractionDigits: Number.isInteger(compactValue) ? 0 : 1,
    }).format(compactValue)}K`;
  }

  return formatLocalizedNumber(locale, value);
}

function formatYearlyMonthlyDisplayPrice(locale: string, value: number) {
  const truncatedValue = Math.trunc(value * 10) / 10;

  return `$${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(truncatedValue) ? 0 : 1,
  }).format(truncatedValue)}`;
}

function formatUsdAmount(locale: string, value: number) {
  const roundedValue = Math.round(value * 10) / 10;

  return `$${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(roundedValue) ? 0 : 1,
  }).format(roundedValue)}`;
}

function getYearlySavingsLabel(
  locale: string,
  plan: VogueSubscriptionPrice,
  annualTotal: number
) {
  if (plan.id === 'basic') return null;

  const annualSavings = plan.monthlyPrice * 12 - annualTotal;
  return `${plan.yearlyDiscount}% OFF, Save ${formatUsdAmount(locale, annualSavings)}`;
}

function getEstimatedImageCount(credits: number) {
  return Math.max(1, credits);
}

function StripeLogo() {
  return (
    <span
      aria-hidden="true"
      className="mr-2 inline-flex h-6 min-w-[54px] items-center justify-center rounded-full bg-white px-2 font-black text-[16px] leading-none tracking-[-0.06em] text-[#635BFF]"
    >
      stripe
    </span>
  );
}

function AlipayLogo() {
  return (
    <span
      aria-hidden="true"
      className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#1677FF] font-black text-base leading-none text-white"
    >
      支
    </span>
  );
}

function WeChatPayLogo() {
  return (
    <svg
      aria-hidden="true"
      className="mr-2 h-7 w-7 shrink-0 text-[#07C160]"
      fill="none"
      viewBox="0 0 48 48"
    >
      <path
        d="M20.2 12C11.8 12 5 17.6 5 24.6c0 4 2.3 7.6 5.8 9.9l-1.1 4.1 5.1-2.3c1.6.5 3.4.8 5.4.8 8.4 0 15.2-5.6 15.2-12.5S28.6 12 20.2 12Z"
        fill="currentColor"
      />
      <path
        d="M30.4 22.5c-6.8 0-12.3 4.5-12.3 10.2 0 5.6 5.5 10.2 12.3 10.2 1.5 0 3-.2 4.3-.7l4.2 1.9-.9-3.4c2.9-1.8 4.7-4.7 4.7-8 0-5.7-5.5-10.2-12.3-10.2Z"
        fill="currentColor"
        opacity="0.82"
      />
      <circle cx="15.4" cy="22.2" fill="#101621" r="1.7" />
      <circle cx="24.5" cy="22.2" fill="#101621" r="1.7" />
      <circle cx="26.8" cy="31.8" fill="#101621" r="1.3" />
      <circle cx="34.1" cy="31.8" fill="#101621" r="1.3" />
    </svg>
  );
}

function clampCreditMeterSegments(segments: number) {
  if (!Number.isFinite(segments) || segments <= 0) {
    return 0;
  }

  return Math.max(
    1,
    Math.min(PRICING_CREDIT_METER_SEGMENTS, Math.round(segments))
  );
}

function getCreditMeterActiveSegments(credits: number, maxCredits: number) {
  if (
    !Number.isFinite(credits) ||
    credits <= 0 ||
    !Number.isFinite(maxCredits) ||
    maxCredits <= 0
  ) {
    return 0;
  }

  return clampCreditMeterSegments(
    Math.ceil((credits / maxCredits) * PRICING_CREDIT_METER_SEGMENTS)
  );
}

function getSubscriptionCreditMeterSegments(
  planId: VogueSubscriptionPlanId,
  interval: VoguePriceInterval
) {
  return subscriptionCreditMeterSegments[interval][planId];
}

function PricingCreditMeter({
  activeSegments,
  credits,
  maxCredits,
}: {
  activeSegments?: number;
  credits: number;
  maxCredits: number;
}) {
  const activeSegmentCount =
    activeSegments === undefined
      ? getCreditMeterActiveSegments(credits, maxCredits)
      : clampCreditMeterSegments(activeSegments);

  return (
    <div
      aria-hidden="true"
      className="flex h-7 w-full items-end gap-1 overflow-hidden"
      data-pricing-credit-meter="true"
    >
      {Array.from({ length: PRICING_CREDIT_METER_SEGMENTS }, (_, index) => {
        const active = index < activeSegmentCount;

        return (
          <span
            className={cn(
              'block h-5 min-w-0 flex-1 rounded-full transition-colors',
              active ? 'bg-[#11120d]' : 'bg-[#ecebea]'
            )}
            data-pricing-credit-meter-segment={active ? 'active' : 'inactive'}
            key={index}
          />
        );
      })}
    </div>
  );
}

function PricingMobileFeatureList({
  features,
}: {
  features: MobilePricingFeature[];
}) {
  return (
    <ul className="mt-4 space-y-2 text-sm leading-5 text-[#5a5360] sm:hidden">
      {features
        .filter((feature) => feature.text)
        .map((feature) => {
          const Icon = feature.unavailable ? X : Check;

          return (
            <li className="flex items-start gap-2" key={feature.text}>
              <Icon
                className={
                  feature.unavailable
                    ? featureUnavailableClassName
                    : featureCheckClassName
                }
              />
              <span
                className={cn(
                  feature.emphasized ? 'font-semibold text-[#171a23]' : ''
                )}
              >
                {feature.text}
              </span>
            </li>
          );
        })}
    </ul>
  );
}

function getCurrentPricingReturnPath() {
  if (typeof window === 'undefined') return '/app?pricing=1';

  const url = new URL(window.location.href);
  url.searchParams.set('pricing', '1');
  return `${url.pathname}${url.search}${url.hash}`;
}

const getIntervalForTab = (tab: PricingTab): VoguePriceInterval =>
  tab === 'monthly' ? 'month' : 'year';

function getPlanSelectCta(
  planId: VogueSubscriptionPlanId,
  runtimeCopy: RuntimePricingCopy
) {
  return runtimeCopy.selectPlanCtas[planId];
}

function getMobileSavingsLabel(plan: VogueSubscriptionPrice) {
  if (plan.id === 'basic') return null;
  return `${plan.yearlyDiscount}% OFF`;
}

function getSubscriptionCardGridClassName(cardCount: number) {
  return cn(
    'mt-6 grid items-stretch gap-4 sm:mt-11 xl:mt-12',
    cardCount === 3
      ? 'mx-auto w-full max-w-[1120px] sm:grid-cols-2 lg:grid-cols-3'
      : 'mx-auto w-full max-w-[1500px] sm:grid-cols-2 xl:grid-cols-4'
  );
}

export default function PricingDialog({
  open,
  onOpenChange,
}: PricingDialogProps) {
  const locale = useLocale();
  const messages = useMessages();
  const pricingCopy = getVogueCopyFromMessages(messages).pricing;
  const runtimeCopy = getRuntimePricingCopy(locale);
  const localizedLegalPrefix = locale === 'en' ? '' : `/${locale}`;
  const { data: session } = authClient.useSession();
  const [pricingTab, setPricingTab] = useState<PricingTab>('yearly');
  const [selectedPackId, setSelectedPackId] =
    useState<VogueCreditPackId | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs: Array<{ id: PricingTab; label: string; badge?: string }> = [
    { id: 'monthly', label: pricingCopy.toggle.monthly },
    { id: 'yearly', label: pricingCopy.toggle.yearly },
    { id: 'one-time', label: pricingCopy.toggle.oneTime },
  ];

  const subscriptionCards = useMemo(() => {
    if (pricingTab === 'one-time') return [];
    const interval = getIntervalForTab(pricingTab);
    return getPricingSubscriptionPlanIdsForInterval(interval)
      .map((planId) => findVogueSubscriptionPrice(planId, interval))
      .filter((plan): plan is VogueSubscriptionPrice => plan !== null);
  }, [pricingTab]);
  if (!open) return null;

  const requireLogin = () => {
    if (!session?.user) {
      const returnPath = getCurrentPricingReturnPath();
      const localePrefix = getLocalePrefix(window.location.pathname);
      window.location.assign(`${localePrefix}/login?callbackUrl=${encodeURIComponent(
        returnPath
      )}`);
      return false;
    }
    return true;
  };

  const startStripeCheckout = async (priceId: string) => {
    if (!priceId) {
      setCheckoutError(pricingCopy.errors.priceNotConfigured);
      return;
    }
    if (!requireLogin()) return;

    setCheckoutError(null);
    setIsSubmitting(true);
    const response = await fetch('/api/payment/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        callbackPath: getCurrentPricingReturnPath(),
      }),
    });
    const data = (await response.json()) as { url?: string; error?: string };
    setIsSubmitting(false);
    if (!response.ok || !data.url) {
      setCheckoutError(data.error || pricingCopy.errors.stripeCheckout);
      return;
    }
    window.location.assign(data.url);
  };

  const startZpayCheckout = async (
    packageId: VogueCreditPackId,
    paymentMethod: ZpayPaymentMethod
  ) => {
    if (!requireLogin()) return;

    setCheckoutError(null);
    setIsSubmitting(true);
    const response = await fetch('/api/payment/create-zpay-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId, paymentMethod }),
    });
    const data = (await response.json()) as { url?: string; error?: string };
    setIsSubmitting(false);
    if (!response.ok || !data.url) {
      setCheckoutError(data.error || pricingCopy.errors.zpayCheckout);
      return;
    }
    window.location.assign(data.url);
  };

  const openCreditCheckout = (packId: VogueCreditPackId) => {
    if (!requireLogin()) return;
    setCheckoutError(null);
    setSelectedPackId(packId);
  };

  const closeDialog = () => {
    if (isSubmitting) return;
    setSelectedPackId(null);
    setCheckoutError(null);
    onOpenChange(false);
  };

  const selectedPack =
    selectedPackId === null
      ? null
      : creditPackPrices.find((pack) => pack.id === selectedPackId) ?? null;
  const selectedPackCopy = selectedPack
    ? pricingCopy.packs[selectedPack.id as PricingPackId]
    : null;
  const selectedPackCheckoutTitle = selectedPackCopy
    ? `${pricingCopy.toggle.oneTime} - ${selectedPackCopy.name}`
    : pricingCopy.toggle.oneTime;
  const showCreditPacks = pricingTab === 'one-time';
  const showFreePlanCard = pricingTab === 'monthly';
  const displayedSubscriptionCardCount =
    subscriptionCards.length + (showFreePlanCard ? 1 : 0);
  const maxDisplayedCredits = Math.max(
    1,
    ...subscriptionCards.map((card) =>
      pricingTab === 'yearly' ? card.credits * 12 : card.credits
    )
  );
  const maxCreditPackCredits = Math.max(
    1,
    ...creditPackPrices.map((pack) => pack.credits)
  );

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-[120] flex items-center justify-center bg-[#2f3440]/20 px-3 py-4 backdrop-blur-[10px] sm:px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
      role="presentation"
    >
      <div
        aria-label={pricingCopy.ariaLabel}
        aria-modal="true"
        className="vogue-pricing-light relative flex max-h-[calc(100svh-2rem)] w-full max-w-[1720px] flex-col overflow-hidden rounded-[24px] border border-[var(--vogue-border)] bg-[var(--vogue-page)] font-[var(--font-vogue-sans)] text-[#171a23] shadow-[0_28px_88px_rgba(72,92,130,0.22)] sm:rounded-[28px]"
        role="dialog"
      >
        <button
          aria-label={pricingCopy.closeLabel}
          className="group absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--vogue-border)] bg-white/90 text-[#171a23] shadow-[0_12px_30px_rgba(72,92,130,0.12)] transition hover:bg-[#f1edff]"
          disabled={isSubmitting}
          onClick={closeDialog}
          type="button"
        >
          <X className="h-5 w-5 text-[#171a23] transition group-hover:text-[#8357F0]" />
          <span className="sr-only">{pricingCopy.closeLabel}</span>
        </button>

        <div className="overflow-y-auto px-4 pb-5 pt-5 sm:px-6 sm:pt-6 lg:px-8">
          <div className="vogue-pricing-header mx-auto max-w-4xl text-center">
            <h2 className="mx-auto max-w-3xl font-[var(--font-vogue-display)] text-[28px] font-semibold leading-[1.06] tracking-normal text-[#171a23] md:text-[38px]">
              {pricingCopy.title}
            </h2>
            <p className="mx-auto mt-2 max-w-full px-1 text-sm font-semibold leading-5 text-[#6f6472] md:max-w-3xl md:whitespace-nowrap md:text-[14px]">
              {pricingCopy.description}
            </p>

            <div className="relative mx-auto mt-4 w-full max-w-[500px] rounded-full border border-[#dedede] bg-[#eeeeee] p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_10px_24px_rgba(17,18,13,0.06)] sm:mt-5">
              <div className="grid grid-cols-3 gap-1">
                {tabs.map((tab) => (
                  <button
                    className={cn(
                      'relative inline-flex min-h-10 items-center justify-center overflow-visible rounded-full px-3 text-[13px] font-bold text-[#6b6c68] transition',
                      'whitespace-nowrap max-[420px]:px-2 max-[420px]:text-xs',
                      pricingTab === tab.id
                        ? 'bg-white text-[#171a23] shadow-[0_5px_14px_rgba(17,18,13,0.12)]'
                        : 'hover:bg-white/48 hover:text-[#171a23]'
                    )}
                    key={tab.id}
                    onClick={() => {
                      setCheckoutError(null);
                      setPricingTab(tab.id);
                    }}
                    type="button"
                  >
                    <span className="shrink-0">{tab.label}</span>
                    {tab.id === 'yearly' && (
                      <span className="vogue-pricing-toggle-badge pointer-events-none absolute -right-2 -top-4 z-10 hidden shrink-0 whitespace-nowrap rounded-full bg-[#8357F0] px-3 py-1 font-[var(--font-vogue-sans)] text-[11px] font-semibold leading-none tracking-normal text-[#ffffff] shadow-[0_10px_20px_rgba(131,87,240,0.2)] sm:inline-flex">
                        {pricingCopy.toggle.saveUpTo}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs font-bold leading-5 text-[#8357F0] sm:hidden">
              {pricingCopy.toggle.saveUpTo}
            </p>
          </div>

          {!showCreditPacks ? (
            <div className={getSubscriptionCardGridClassName(displayedSubscriptionCardCount)}>
              {showFreePlanCard && (
                <article
                  className={cn(
                    pricingCardClassName,
                    mobilePricingCardClassName,
                    'border-[#e1e1df]'
                  )}
                >
                  <div className="flex min-h-7 items-start justify-between gap-3">
                    <h3 className="min-w-0 font-[var(--font-vogue-display)] text-[25px] font-semibold leading-tight text-[#171a23]">
                      {pricingCopy.freePlan.name}
                    </h3>
                  </div>

                  <div className="mt-5 min-h-0 sm:mt-8 sm:min-h-[92px]">
                    <div className="flex flex-wrap items-end gap-x-1 gap-y-1">
                      <span className="font-[var(--font-vogue-display)] text-[34px] font-semibold leading-none text-[#171a23] 2xl:text-[38px]">
                        {pricingCopy.freePlan.price}
                      </span>
                      <span className="pb-1 text-sm font-semibold text-[#6f6472]">
                        {pricingCopy.monthSuffix}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="mt-4 h-11 w-full rounded-full border border-[#d9d8d6] bg-white text-sm font-bold text-[#171a23] shadow-none transition hover:bg-[#f7f7f5]"
                    disabled={isSubmitting}
                    onClick={closeDialog}
                    variant="outline"
                  >
                    {pricingCopy.freePlan.cta}
                  </Button>

                  <div className="mt-5 border-t border-[var(--vogue-border)] pt-5">
                    <div className="hidden sm:block">
                      <PricingCreditMeter
                        activeSegments={1}
                        credits={REGISTER_GIFT_CREDITS_AMOUNT}
                        maxCredits={maxDisplayedCredits}
                      />

                      <ul className="mt-5 space-y-1.5 text-sm leading-5 text-[#5a5360]">
                        <li className="flex items-start gap-2">
                          <Check className={featureCheckClassName} />
                          <span className="font-semibold text-[#171a23]">
                            {formatPricingFeatureText(
                              pricingCopy.freePlan.features[0],
                              locale
                            )}
                          </span>
                        </li>
                        {pricingCopy.freePlan.features.slice(1).map((feature) => (
                          <li className="flex items-start gap-2" key={feature}>
                            <Check className={featureCheckClassName} />
                            <span>{formatPricingFeatureText(feature, locale)}</span>
                          </li>
                        ))}
                        {pricingCopy.freePlan.limitations.map((limitation) => (
                          <li className="flex items-start gap-2" key={limitation}>
                            <X className={featureUnavailableClassName} />
                            <span>{formatPricingFeatureText(limitation, locale)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <PricingMobileFeatureList
                      features={[
                        {
                          text: formatPricingFeatureText(
                            pricingCopy.freePlan.features[0],
                            locale
                          ),
                          emphasized: true,
                        },
                        {
                          text: formatPricingFeatureText(
                            pricingCopy.freePlan.features[1],
                            locale
                          ),
                        },
                        {
                          text: formatPricingFeatureText(
                            pricingCopy.freePlan.features[2],
                            locale
                          ),
                        },
                        {
                          text: formatPricingFeatureText(
                            pricingCopy.freePlan.limitations[3],
                            locale
                          ),
                          unavailable: true,
                        },
                      ]}
                    />
                  </div>
                </article>
              )}

              {subscriptionCards.map((plan) => {
                const planCopy = pricingCopy.plans[plan.id as PricingPlanId];
                const isRecommended = Boolean(
                  plan.popular || planCopy.highlight
                );
                const isBestValue = pricingTab === 'yearly' && Boolean(plan.bestValue);
                const highlightLabel = isBestValue
                  ? pricingCopy.bestValueBadge
                  : isRecommended
                    ? pricingCopy.popularBadge
                    : null;
                const isHighlighted = Boolean(highlightLabel);
                const displayedCredits =
                  pricingTab === 'yearly' ? plan.credits * 12 : plan.credits;
                const displayedImages = getEstimatedImageCount(displayedCredits);
                const shouldCompactDisplayedCredits = pricingTab === 'yearly';
                const compactCreditCount = formatCreditAllowanceNumber(
                  locale,
                  displayedCredits,
                  { compact: shouldCompactDisplayedCredits }
                );
                const compactImageCount = formatCreditAllowanceNumber(
                  locale,
                  displayedImages,
                  { compact: shouldCompactDisplayedCredits }
                );
                const annualTotal = plan.yearlyMonthlyPrice * 12;
                const yearlySavingsLabel =
                  pricingTab === 'yearly'
                    ? getYearlySavingsLabel(locale, plan, annualTotal)
                    : null;
                const mobileSavingsLabel =
                  pricingTab === 'yearly' ? getMobileSavingsLabel(plan) : null;

                return (
                  <div
                    className={cn(
                      'relative transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(17,18,13,0.08)]',
                      isHighlighted
                        ? 'vogue-pricing-highlight-shell flex h-full w-full overflow-visible rounded-[22px]'
                        : ''
                    )}
                    key={`${plan.id}-${plan.interval}`}
                  >
                    {highlightLabel && (
                      <>
                        <div
                          className={
                            isBestValue
                              ? 'vogue-pricing-highlight-best-value-fill pointer-events-none absolute -top-7 bottom-0 left-0 right-0 z-0 rounded-[22px] bg-[linear-gradient(180deg,#D7FF00_0px,#D7FF00_42px,#ffffff_100%)]'
                              : 'vogue-pricing-highlight-fill pointer-events-none absolute -top-7 bottom-0 left-0 right-0 z-0 rounded-[22px] bg-[linear-gradient(180deg,#8357F0_0px,#8357F0_42px,#ffffff_100%)]'
                          }
                        />
                        <div
                          className={
                            isBestValue
                              ? 'vogue-pricing-highlight-best-value-banner pointer-events-none absolute -top-7 left-0 right-0 z-[1] flex h-9 items-start justify-center rounded-t-[22px] bg-[#D7FF00] pt-2 font-[var(--font-vogue-sans)] text-[13px] font-semibold leading-none tracking-normal text-[#171a23] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]'
                              : 'vogue-pricing-highlight-banner pointer-events-none absolute -top-7 left-0 right-0 z-[1] flex h-9 items-start justify-center rounded-t-[22px] bg-[#8357F0] pt-2 font-[var(--font-vogue-sans)] text-[13px] font-semibold leading-none tracking-normal text-[#ffffff] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]'
                          }
                        >
                          {highlightLabel}
                        </div>
                      </>
                    )}

                    <article
                      className={cn(
                        pricingCardClassName,
                        mobilePricingCardClassName,
                        isHighlighted
                          ? 'vogue-pricing-highlight-card border-[#e1e1df]'
                          : 'border-[#e1e1df]'
                      )}
                    >
                      <div className="flex min-h-7 items-start justify-between gap-3">
                        <h3 className="min-w-0 font-[var(--font-vogue-display)] text-[25px] font-semibold leading-tight text-[#171a23]">
                          {planCopy.name}
                        </h3>
                        {mobileSavingsLabel ? (
                          <span
                            className={cn(
                              'shrink-0 whitespace-nowrap rounded-[12px] px-2.5 py-1 text-right font-[var(--font-vogue-sans)] text-[10px] font-semibold leading-none tracking-normal sm:hidden',
                              isBestValue
                                ? 'bg-[#D7FF00] text-[#171a23]'
                                : 'bg-[#8357F0] text-[#ffffff]'
                            )}
                          >
                            {mobileSavingsLabel}
                          </span>
                        ) : null}
                        {yearlySavingsLabel ? (
                          <span
                            className={cn(
                              'hidden shrink-0 whitespace-nowrap rounded-[12px] px-3 py-1.5 text-right font-[var(--font-vogue-sans)] text-[11px] font-semibold leading-none tracking-normal sm:inline-flex',
                              isBestValue
                                ? 'bg-[#D7FF00] text-[#171a23] shadow-[0_10px_20px_rgba(215,255,0,0.18)]'
                                : 'bg-[#8357F0] text-[#ffffff] shadow-[0_10px_20px_rgba(131,87,240,0.18)]'
                            )}
                          >
                            {yearlySavingsLabel}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-5 min-h-0 sm:mt-8 sm:min-h-[92px]">
                        {pricingTab === 'yearly' ? (
                          <>
                            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                              <span className="font-[var(--font-vogue-display)] text-[34px] font-semibold leading-none text-[#171a23] 2xl:text-[38px]">
                                {formatYearlyMonthlyDisplayPrice(
                                  locale,
                                  plan.yearlyMonthlyPrice
                                )}
                              </span>
                              <span className="text-sm font-semibold text-[#9a919d] line-through">
                                {planCopy.monthlyOriginalPrice}
                              </span>
                              <span className="text-sm font-semibold text-[#6f6472]">
                                {pricingCopy.monthSuffix}
                              </span>
                            </div>
                            <p className="vogue-pricing-billing-note mt-2 text-xs leading-5 text-[#7a7280]">
                              {runtimeCopy.annualBillingLabel}{' '}
                              {formatUsdAmount(locale, annualTotal)}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-end gap-x-1 gap-y-1">
                              <span className="font-[var(--font-vogue-display)] text-[34px] font-semibold leading-none text-[#171a23] 2xl:text-[38px]">
                                {planCopy.price}
                              </span>
                              <span className="pb-1 text-sm font-semibold text-[#6f6472]">
                                {pricingCopy.monthSuffix}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <Button
                        className={cn(
                          isHighlighted ? primaryCtaClassName : softCtaClassName,
                          'mt-4'
                        )}
                        disabled={isSubmitting}
                        onClick={() => startStripeCheckout(plan.priceId)}
                      >
                        {getPlanSelectCta(plan.id, runtimeCopy)}
                      </Button>

                      <div className="mt-5 border-t border-[var(--vogue-border)] pt-5">
                        <div className="hidden sm:block">
                          <PricingCreditMeter
                            activeSegments={getSubscriptionCreditMeterSegments(
                              plan.id,
                              plan.interval
                            )}
                            credits={displayedCredits}
                            maxCredits={maxDisplayedCredits}
                          />

                          <ul className="mt-5 space-y-1.5 text-sm leading-5 text-[#5a5360]">
                            <li className="flex items-start gap-2">
                              <Check className={featureCheckClassName} />
                              <span className="font-semibold text-[#171a23]">
                                {compactCreditCount}{' '}
                                <span className="text-[#8357F0]">
                                  {pricingCopy.creditUnit}
                                </span>
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className={featureCheckClassName} />
                              <span>
                                {runtimeCopy.allowanceImagePrefix}{' '}
                                <span className="font-semibold text-[#171a23]">
                                  {compactImageCount}
                                </span>{' '}
                                {runtimeCopy.allowanceImageSuffix}
                              </span>
                            </li>
                            {planCopy.features.slice(1).map((feature) => (
                              <li className="flex items-start gap-2" key={feature}>
                                <Check className={featureCheckClassName} />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <PricingMobileFeatureList
                          features={[
                            {
                              text: `${compactCreditCount} ${pricingCopy.creditUnit}`,
                              emphasized: true,
                            },
                            {
                              text: `${runtimeCopy.allowanceImagePrefix} ${compactImageCount} ${runtimeCopy.allowanceImageSuffix}`,
                            },
                            { text: planCopy.features[4] },
                            { text: planCopy.features[5] },
                          ]}
                        />
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <div className="mx-auto mt-5 max-w-xl text-center">
                <p className="text-sm font-semibold leading-5 text-[#6f6472]">
                  {runtimeCopy.creditTopupDescription}
                </p>
              </div>

              <div className="mx-auto mt-4 grid max-w-[1160px] items-stretch gap-4 md:grid-cols-3 xl:mt-10">
                {creditPackPrices.map((pack) => {
                  const packCopy = pricingCopy.packs[pack.id as PricingPackId];
                  const isHighlighted = Boolean(
                    pack.popular || packCopy.highlight
                  );
                  const compactCreditCount = formatCreditAllowanceNumber(
                    locale,
                    pack.credits
                  );
                  const compactImageCount = formatCreditAllowanceNumber(
                    locale,
                    getEstimatedImageCount(pack.credits)
                  );
                  return (
                    <article
                      className={cn(
                        pricingCardClassName,
                        mobilePricingCardClassName,
                        'transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(17,18,13,0.08)]',
                        isHighlighted
                          ? 'border-[#d8ccff] ring-2 ring-[#f0eaff]'
                          : 'border-[#e1e1df]'
                      )}
                      key={pack.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-[var(--font-vogue-display)] text-[21px] font-semibold text-[#171a23]">
                            {packCopy.name}
                          </h4>
                        </div>
                        <span className="shrink-0 whitespace-nowrap rounded-[12px] bg-[#8357F0] px-2.5 py-1 font-[var(--font-vogue-sans)] text-[10px] font-semibold leading-none tracking-normal text-[#ffffff] shadow-[0_10px_20px_rgba(131,87,240,0.18)]">
                          {packCopy.badge}
                        </span>
                      </div>
                      <div className="mt-5 min-h-0 font-[var(--font-vogue-display)] text-[34px] font-semibold leading-none text-[#171a23] sm:mt-8 sm:min-h-[92px]">
                        {packCopy.price}
                      </div>
                      <Button
                        className={cn(
                          isHighlighted ? primaryCtaClassName : softCtaClassName,
                          'mt-4'
                        )}
                        disabled={isSubmitting}
                        onClick={() => openCreditCheckout(pack.id)}
                      >
                        {runtimeCopy.creditTopupCta}
                      </Button>
                      <div className="mt-6 flex-1 border-t border-[var(--vogue-border)] pt-5">
                        <div className="hidden sm:block">
                          <PricingCreditMeter
                            credits={pack.credits}
                            maxCredits={maxCreditPackCredits}
                          />
                          <ul className="mt-5 space-y-1.5 text-sm leading-5 text-[#5a5360]">
                            <li className="flex items-start gap-2">
                              <Check className={featureCheckClassName} />
                              <span className="font-semibold text-[#171a23]">
                                {compactCreditCount} {pricingCopy.creditUnit}
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className={featureCheckClassName} />
                              <span>
                                {runtimeCopy.allowanceImagePrefix}{' '}
                                <span className="font-semibold text-[#171a23]">
                                  {compactImageCount}
                                </span>{' '}
                                {runtimeCopy.allowanceImageSuffix}
                              </span>
                            </li>
                            {pricingCopy.plans.basic.features.slice(1).map((feature) => (
                              <li className="flex items-start gap-2" key={feature}>
                                <Check className={featureCheckClassName} />
                                <span>{feature}</span>
                              </li>
                            ))}
                            <li className="flex items-start gap-2">
                              <Check className={featureCheckClassName} />
                              <span>{runtimeCopy.oneTimePurchaseNoRenewal}</span>
                            </li>
                          </ul>
                        </div>
                        <PricingMobileFeatureList
                          features={[
                            {
                              text: `${compactCreditCount} ${pricingCopy.creditUnit}`,
                              emphasized: true,
                            },
                            {
                              text: `${runtimeCopy.allowanceImagePrefix} ${compactImageCount} ${runtimeCopy.allowanceImageSuffix}`,
                            },
                            { text: pricingCopy.plans.basic.features[4] },
                            { text: runtimeCopy.oneTimePurchaseNoRenewal },
                          ]}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {checkoutError && !selectedPack && (
            <p className="mx-auto mt-5 max-w-xl rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-700">
              {checkoutError}
            </p>
          )}

          <p className="vogue-pricing-agreement mt-8 pb-2 text-center text-xs leading-6 text-[#969097]">
            <span>{runtimeCopy.agreementPrefix} </span>
            <Link
              aria-label={runtimeCopy.termsLabel}
              className="font-semibold underline underline-offset-4 hover:text-[#8357F0]"
              href={`${localizedLegalPrefix}/terms-of-service`}
            >
              {runtimeCopy.termsLabel} ↗
            </Link>
            <span> {runtimeCopy.agreementConnector} </span>
            <Link
              aria-label={runtimeCopy.privacyLabel}
              className="font-semibold underline underline-offset-4 hover:text-[#8357F0]"
              href={`${localizedLegalPrefix}/privacy-policy`}
            >
              {runtimeCopy.privacyLabel} ↗
            </Link>
            {runtimeCopy.agreementSuffix ? (
              <span> {runtimeCopy.agreementSuffix}</span>
            ) : null}
          </p>
        </div>

        {selectedPack && selectedPackCopy && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-transparent px-4 py-6"
            onClick={() => {
              if (!isSubmitting) setSelectedPackId(null);
            }}
          >
            <div
              aria-label={selectedPackCheckoutTitle}
              aria-modal="true"
              className="w-full max-w-md rounded-[24px] border border-[var(--vogue-border)] bg-white p-5 text-[#171a23] shadow-[0_34px_100px_rgba(72,92,130,0.24)] sm:rounded-[22px] sm:p-6"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-[var(--font-vogue-display)] text-[26px] font-semibold leading-tight">
                    {selectedPackCheckoutTitle}
                  </h3>
                  <p className="mt-1 text-sm text-[#6f6472]">
                    {selectedPack.credits} {pricingCopy.creditUnit}
                  </p>
                </div>
                <button
                  className="rounded-[10px] px-2.5 py-1.5 text-sm font-semibold text-[#6f6472] transition hover:bg-[#fbf2ed] hover:text-[#171a23]"
                  disabled={isSubmitting}
                  onClick={() => setSelectedPackId(null)}
                  type="button"
                >
                  {pricingCopy.checkout.close}
                </button>
              </div>
              <div className="mt-6 grid gap-3">
                <Button
                  className={primaryCtaClassName}
                  disabled={isSubmitting}
                  onClick={() => startStripeCheckout(selectedPack.priceId)}
                >
                  <StripeLogo />
                  <span className="sm:hidden">Stripe</span>
                  <span className="hidden sm:inline">{pricingCopy.checkout.stripe}</span>
                </Button>
                <Button
                  className={localPaymentCtaClassName}
                  disabled={isSubmitting}
                  onClick={() => startZpayCheckout(selectedPack.id, 'alipay')}
                  variant="outline"
                >
                  <AlipayLogo />
                  <span className="sm:hidden">Alipay</span>
                  <span className="hidden sm:inline">{pricingCopy.checkout.alipay}</span>
                </Button>
                <Button
                  className={localPaymentCtaClassName}
                  disabled={isSubmitting}
                  onClick={() => startZpayCheckout(selectedPack.id, 'wxpay')}
                  variant="outline"
                >
                  <WeChatPayLogo />
                  <span className="sm:hidden">WeChat Pay</span>
                  <span className="hidden sm:inline">{pricingCopy.checkout.wechatPay}</span>
                </Button>
              </div>
              {checkoutError && (
                <p className="mt-4 rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {checkoutError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
