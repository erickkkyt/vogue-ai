'use client';

import { getLocalePrefix } from '@/components/auth/auth-copy';
import { Button } from '@/components/ui/button';
import {
  creditPackPrices,
  findVogueSubscriptionPrice,
  subscriptionPlanIds,
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
  CreditCard,
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

const featureCheckClassName =
  'vogue-pricing-feature-check mt-0.5 h-4 w-4 shrink-0 text-[#11120d]';

type RuntimePricingCopy = {
  annualBillingLabel: string;
  allowanceImagePrefix: string;
  allowanceImageSuffix: string;
  selectPlanCtas: Record<VogueSubscriptionPlanId, string>;
  creditTopupDescription: string;
  creditTopupCta: string;
  instantDelivery: string;
  noRenewal: string;
  agreementPrefix: string;
  agreementConnector: string;
  agreementSuffix: string;
  termsLabel: string;
  privacyLabel: string;
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
    instantDelivery: 'Instant top-up',
    noRenewal: 'No auto-renewal',
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
    instantDelivery: '立即到账',
    noRenewal: '不自动续费',
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
    instantDelivery: 'Ajout immédiat',
    noRenewal: 'Sans renouvellement',
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
    instantDelivery: 'Мгновенно',
    noRenewal: 'Без автопродления',
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
    instantDelivery: 'Liberação imediata',
    noRenewal: 'Sem renovação',
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
    instantDelivery: '即時追加',
    noRenewal: '自動更新なし',
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
    instantDelivery: '즉시 지급',
    noRenewal: '자동 갱신 없음',
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

function formatCompactAllowanceNumber(locale: string, value: number) {
  if (value >= 1000) {
    const compactValue = value / 1000;
    return `${new Intl.NumberFormat(locale, {
      maximumFractionDigits: Number.isInteger(compactValue) ? 0 : 1,
    }).format(compactValue)}K`;
  }

  return formatLocalizedNumber(locale, value);
}

function formatSubscriptionAllowanceNumber(
  locale: string,
  value: number,
  planId: VogueSubscriptionPlanId
) {
  if (planId !== 'basic') {
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

function getEstimatedImageCount(credits: number) {
  return Math.max(1, credits);
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
    {
      id: 'yearly',
      label: pricingCopy.toggle.yearly,
      badge: pricingCopy.toggle.saveUpTo,
    },
    { id: 'one-time', label: pricingCopy.toggle.oneTime },
  ];

  const subscriptionCards = useMemo(() => {
    if (pricingTab === 'one-time') return [];
    const interval = getIntervalForTab(pricingTab);
    return subscriptionPlanIds
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
  const showCreditPacks = pricingTab === 'one-time';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-[120] flex items-center justify-center bg-[#2f3440]/20 px-3 py-4 backdrop-blur-[10px] min-[641px]:left-[248px] sm:px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
      role="presentation"
    >
      <div
        aria-label={pricingCopy.ariaLabel}
        aria-modal="true"
        className="vogue-pricing-light relative flex max-h-[calc(100svh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-[var(--vogue-border)] bg-[var(--vogue-page)] font-[var(--font-vogue-sans)] text-[#171a23] shadow-[0_28px_88px_rgba(72,92,130,0.22)] sm:rounded-[28px]"
        role="dialog"
      >
        <button
          aria-label={pricingCopy.closeLabel}
          className="group absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--vogue-border)] bg-white/90 text-[#171a23] shadow-[0_12px_30px_rgba(72,92,130,0.12)] transition hover:bg-[#eef4ff]"
          disabled={isSubmitting}
          onClick={closeDialog}
          type="button"
        >
          <X className="h-5 w-5 text-[#171a23] transition group-hover:text-[#426cff]" />
          <span className="sr-only">{pricingCopy.closeLabel}</span>
        </button>

        <div className="overflow-y-auto px-4 pb-5 pt-6 sm:px-6 sm:pt-7 lg:px-8">
          <div className="vogue-pricing-header mx-auto max-w-4xl text-center">
            <h2 className="mx-auto max-w-3xl font-[var(--font-vogue-display)] text-[30px] font-semibold leading-[1.06] tracking-normal text-[#171a23] md:text-[42px]">
              {pricingCopy.title}
            </h2>
            <p className="mx-auto mt-3 max-w-full px-1 text-sm font-semibold leading-6 text-[#6f6472] md:max-w-3xl md:whitespace-nowrap md:text-[15px]">
              {pricingCopy.description}
            </p>

            <div className="mx-auto mt-6 w-full max-w-[520px] rounded-full border border-[#dedede] bg-[#eeeeee] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_10px_24px_rgba(17,18,13,0.06)] sm:mt-7">
              <div className="grid grid-cols-3 gap-1">
                {tabs.map((tab) => (
                  <button
                    className={cn(
                      'relative inline-flex min-h-11 items-center justify-center overflow-visible rounded-full px-3 text-sm font-bold text-[#6b6c68] transition',
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
                    {tab.badge && (
                      <span className="pointer-events-none absolute -right-3 -top-5 shrink-0 rounded-full border border-[#c9d8ff] bg-[#eef4ff] px-3 py-1.5 text-xs font-black leading-none text-[#334ddb] shadow-[0_8px_18px_rgba(66,108,255,0.14)] max-[420px]:-right-2 max-[420px]:text-[9px]">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!showCreditPacks ? (
            <div className="mt-12 grid items-stretch gap-4 sm:mt-14 sm:grid-cols-2 xl:mt-16 xl:grid-cols-4">
              {subscriptionCards.map((plan) => {
                const planCopy = pricingCopy.plans[plan.id as PricingPlanId];
                const isRecommended = Boolean(
                  plan.popular || planCopy.highlight
                );
                const displayedCredits =
                  pricingTab === 'yearly' ? plan.credits * 12 : plan.credits;
                const displayedImages = getEstimatedImageCount(displayedCredits);
                const compactCreditCount = formatSubscriptionAllowanceNumber(
                  locale,
                  displayedCredits,
                  plan.id
                );
                const compactImageCount = formatSubscriptionAllowanceNumber(
                  locale,
                  displayedImages,
                  plan.id
                );
                const annualTotal = plan.yearlyMonthlyPrice * 12;

                return (
                  <div
                    className={cn(
                      'relative transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(17,18,13,0.08)]',
                      isRecommended
                        ? 'vogue-pricing-highlight-shell flex h-full w-full overflow-visible rounded-[22px]'
                        : ''
                    )}
                    key={`${plan.id}-${plan.interval}`}
                  >
                    {isRecommended && (
                      <>
                        <div className="vogue-pricing-highlight-fill pointer-events-none absolute -top-7 bottom-0 left-0 right-0 z-0 rounded-[22px] bg-[linear-gradient(180deg,#e9f0ff_0px,#dfe8ff_42px,#ffffff_100%)]" />
                        <div className="vogue-pricing-highlight-banner pointer-events-none absolute -top-7 left-0 right-0 z-[1] flex h-9 items-start justify-center rounded-t-[22px] pt-2 text-[11px] font-black text-[#334ddb] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                          {pricingCopy.popularBadge}
                        </div>
                      </>
                    )}

                    <article
                      className={cn(
                        'relative z-10 flex h-full w-full min-h-[510px] flex-col rounded-[20px] border bg-white p-5 pt-6 shadow-none xl:min-h-[532px]',
                        isRecommended
                          ? 'vogue-pricing-highlight-card border-[#e1e1df]'
                          : 'border-[#e1e1df]'
                      )}
                    >
                      <div className="flex min-h-7 items-start justify-between gap-3">
                        <h3 className="min-w-0 font-[var(--font-vogue-display)] text-[25px] font-semibold leading-tight text-[#171a23]">
                          {planCopy.name}
                        </h3>
                        {pricingTab === 'yearly' ? (
                          <span className="shrink-0 rounded-full border border-[#c9d8ff] bg-[#eef4ff] px-2.5 py-1 text-[10px] font-black uppercase leading-none text-[#334ddb] shadow-[0_8px_16px_rgba(66,108,255,0.12)]">
                            Save {plan.yearlyDiscount}% OFF
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-7">
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
                          isRecommended ? primaryCtaClassName : softCtaClassName,
                          'mt-5'
                        )}
                        disabled={isSubmitting}
                        onClick={() => startStripeCheckout(plan.priceId)}
                      >
                        {getPlanSelectCta(plan.id, runtimeCopy)}
                      </Button>

                      <div className="mt-5 border-t border-[var(--vogue-border)] pt-5">
                        <ul className="space-y-1.5 text-sm leading-5 text-[#5a5360]">
                          <li className="flex items-start gap-2">
                            <Check className={featureCheckClassName} />
                            <span className="font-semibold text-[#171a23]">
                              {compactCreditCount}{' '}
                              <span className="text-[#426cff]">
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
                    </article>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <div className="mx-auto mt-8 max-w-xl text-center">
                <p className="text-sm font-semibold leading-5 text-[#6f6472]">
                  {runtimeCopy.creditTopupDescription}
                </p>
              </div>

              <div className="mx-auto mt-5 grid max-w-5xl gap-4 md:grid-cols-3">
                {creditPackPrices.map((pack) => {
                  const packCopy = pricingCopy.packs[pack.id as PricingPackId];
                  const isHighlighted = Boolean(
                    pack.popular || packCopy.highlight
                  );
                  const compactCreditCount = formatCompactAllowanceNumber(
                    locale,
                    pack.credits
                  );
                  const compactImageCount = formatCompactAllowanceNumber(
                    locale,
                    getEstimatedImageCount(pack.credits)
                  );
                  return (
                    <article
                      className={cn(
                        'rounded-[20px] border bg-white p-5 text-left shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(17,18,13,0.08)]',
                        isHighlighted
                          ? 'border-[#d8e4ff] ring-2 ring-[#e8efff]'
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
                        <span
                          className={cn(
                            'shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase leading-none',
                            isHighlighted
                            ? 'border-[#c9d8ff] bg-[#eef4ff] text-[#334ddb]'
                              : 'border-[#e1e1df] bg-[#f7f7f5] text-[#6f6472]'
                          )}
                        >
                          {isHighlighted
                            ? pricingCopy.bestValueBadge
                            : pricingCopy.oneTimeBadge}
                        </span>
                      </div>
                      <div className="mt-6 font-[var(--font-vogue-display)] text-[34px] font-semibold leading-none text-[#171a23]">
                        {packCopy.price}
                      </div>
                      <div className="mt-5 border-t border-[var(--vogue-border)] pt-5">
                        <ul className="space-y-1.5 text-sm leading-5 text-[#5a5360]">
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
                          <li className="flex items-start gap-2">
                            <Check className={featureCheckClassName} />
                            <span>{runtimeCopy.instantDelivery}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className={featureCheckClassName} />
                            <span>{runtimeCopy.noRenewal}</span>
                          </li>
                        </ul>
                      </div>
                      <Button
                        className={cn(
                          isHighlighted ? primaryCtaClassName : softCtaClassName,
                          'mt-5'
                        )}
                        disabled={isSubmitting}
                        onClick={() => openCreditCheckout(pack.id)}
                      >
                        {runtimeCopy.creditTopupCta}
                      </Button>
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
              className="font-semibold underline underline-offset-4 hover:text-[#426cff]"
              href={`${localizedLegalPrefix}/terms-of-service`}
            >
              {runtimeCopy.termsLabel} ↗
            </Link>
            <span> {runtimeCopy.agreementConnector} </span>
            <Link
              aria-label={runtimeCopy.privacyLabel}
              className="font-semibold underline underline-offset-4 hover:text-[#426cff]"
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
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#fbf2ed]/82 px-4 backdrop-blur-xl"
            onClick={() => {
              if (!isSubmitting) setSelectedPackId(null);
            }}
          >
            <div
              aria-label={pricingCopy.checkoutTitle}
              aria-modal="true"
              className="w-full max-w-md rounded-[22px] border border-[var(--vogue-border)] bg-white p-6 text-[#171a23] shadow-[0_34px_100px_rgba(72,92,130,0.24)]"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-[var(--font-vogue-display)] text-[26px] font-semibold leading-tight">
                    {selectedPackCopy.name}
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
              <div className="mt-5 rounded-[16px] border border-[var(--vogue-border)] bg-[#fbf2ed] px-4 py-3">
                <p className="font-[var(--font-vogue-display)] text-xl font-semibold">
                  {pricingCopy.checkoutTitle}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#6f6472]">
                  {pricingCopy.checkoutDescription}
                </p>
              </div>
              <div className="mt-5 grid gap-3">
                <Button
                  className={primaryCtaClassName}
                  disabled={isSubmitting}
                  onClick={() => startStripeCheckout(selectedPack.priceId)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {pricingCopy.checkout.stripe}
                </Button>
                <Button
                  className={`${softCtaClassName} border border-[#d8e4ff] bg-white`}
                  disabled={isSubmitting}
                  onClick={() => startZpayCheckout(selectedPack.id, 'alipay')}
                  variant="outline"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {pricingCopy.checkout.alipay}
                </Button>
                <Button
                  className={`${softCtaClassName} border border-[#d8e4ff] bg-white`}
                  disabled={isSubmitting}
                  onClick={() => startZpayCheckout(selectedPack.id, 'wxpay')}
                  variant="outline"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {pricingCopy.checkout.wechatPay}
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
