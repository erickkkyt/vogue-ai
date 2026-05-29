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
  annualHint: string;
  monthlyHint: string;
  annualGrantLabel: string;
  monthlyGrantLabel: string;
  annualBillingLabel: string;
  annualSavePrefix: string;
  annualSwitchSavePrefix: string;
  discountSuffix: string;
  selectPlanCtas: Record<VogueSubscriptionPlanId, string>;
  estimatePrefix: string;
  estimateSuffix: string;
  creditTopupTitle: string;
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
    annualHint: 'Annual billing, full-year credits upfront',
    monthlyHint: 'Monthly billing',
    annualGrantLabel: 'Upfront annual credits',
    monthlyGrantLabel: 'Monthly credits',
    annualBillingLabel: 'Billed yearly',
    annualSavePrefix: 'Save vs monthly',
    annualSwitchSavePrefix: 'Save yearly',
    discountSuffix: 'Off',
    selectPlanCtas: {
      basic: 'Select Basic',
      pro: 'Select Pro',
      creator: 'Select Creator',
      elite: 'Select Elite',
    },
    estimatePrefix: 'Approx.',
    estimateSuffix: 'standard images',
    creditTopupTitle: 'Add credits without changing plan',
    creditTopupDescription:
      'One-time packs arrive immediately and do not start a subscription.',
    creditTopupCta: 'View credit packs',
    instantDelivery: 'Instant top-up',
    noRenewal: 'No auto-renewal',
    agreementPrefix: 'By purchasing, you agree to our',
    agreementConnector: 'and',
    agreementSuffix: '',
    termsLabel: 'Terms',
    privacyLabel: 'Privacy',
  },
  zh: {
    annualHint: '按年付费，全年积分一次性发放',
    monthlyHint: '按月计费',
    annualGrantLabel: '一次性获得全年积分',
    monthlyGrantLabel: '每月发放积分',
    annualBillingLabel: '按年结算',
    annualSavePrefix: '相比月付省下',
    annualSwitchSavePrefix: '年付立省',
    discountSuffix: '折扣',
    selectPlanCtas: {
      basic: '选择 Basic',
      pro: '选择 Pro',
      creator: '选择 Creator',
      elite: '选择 Elite',
    },
    estimatePrefix: '约可生成',
    estimateSuffix: '张标准图片',
    creditTopupTitle: '不改套餐，也可以随时补积分',
    creditTopupDescription: '一次性积分包立即到账，不会开启自动续费。',
    creditTopupCta: '查看积分包',
    instantDelivery: '立即到账',
    noRenewal: '不自动续费',
    agreementPrefix: '购买即表示您同意',
    agreementConnector: '和',
    agreementSuffix: '',
    termsLabel: '服务条款',
    privacyLabel: '隐私政策',
  },
  fr: {
    annualHint: "Paiement annuel, crédits de l'année versés d'avance",
    monthlyHint: 'Paiement mensuel, crédits renouvelés chaque mois',
    annualGrantLabel: "Crédits annuels versés d'avance",
    monthlyGrantLabel: 'Crédits mensuels',
    annualBillingLabel: 'Facturé annuellement',
    annualSavePrefix: 'Économisez vs mensuel',
    annualSwitchSavePrefix: 'Économisez en annuel',
    discountSuffix: 'de remise',
    selectPlanCtas: {
      basic: 'Choisir Basic',
      pro: 'Choisir Pro',
      creator: 'Choisir Creator',
      elite: 'Choisir Elite',
    },
    estimatePrefix: 'Env.',
    estimateSuffix: 'images standard',
    creditTopupTitle: 'Ajoutez des crédits sans changer de forfait',
    creditTopupDescription:
      'Les packs ponctuels arrivent immédiatement et ne lancent pas d’abonnement.',
    creditTopupCta: 'Voir les packs',
    instantDelivery: 'Ajout immédiat',
    noRenewal: 'Sans renouvellement',
    agreementPrefix: 'En achetant, vous acceptez nos',
    agreementConnector: 'et notre',
    agreementSuffix: '',
    termsLabel: 'Conditions',
    privacyLabel: 'Confidentialité',
  },
  ru: {
    annualHint: 'Годовая оплата, кредиты за год сразу',
    monthlyHint: 'Ежемесячная оплата, кредиты каждый месяц',
    annualGrantLabel: 'Годовые кредиты сразу',
    monthlyGrantLabel: 'Кредиты в месяц',
    annualBillingLabel: 'Оплата за год',
    annualSavePrefix: 'Экономия к месячной оплате',
    annualSwitchSavePrefix: 'Экономия за год',
    discountSuffix: 'скидка',
    selectPlanCtas: {
      basic: 'Выбрать Basic',
      pro: 'Выбрать Pro',
      creator: 'Выбрать Creator',
      elite: 'Выбрать Elite',
    },
    estimatePrefix: 'Около',
    estimateSuffix: 'стандартных изображений',
    creditTopupTitle: 'Пополняйте кредиты без смены тарифа',
    creditTopupDescription:
      'Разовые пакеты начисляются сразу и не включают автопродление.',
    creditTopupCta: 'Посмотреть пакеты',
    instantDelivery: 'Мгновенно',
    noRenewal: 'Без автопродления',
    agreementPrefix: 'Покупая, вы соглашаетесь с',
    agreementConnector: 'и',
    agreementSuffix: '',
    termsLabel: 'Условиями',
    privacyLabel: 'Политикой конфиденциальности',
  },
  pt: {
    annualHint: 'Cobrança anual, créditos do ano liberados de uma vez',
    monthlyHint: 'Cobrança mensal, créditos renovados todo mês',
    annualGrantLabel: 'Créditos anuais adiantados',
    monthlyGrantLabel: 'Créditos mensais',
    annualBillingLabel: 'Cobrado anualmente',
    annualSavePrefix: 'Economize vs mensal',
    annualSwitchSavePrefix: 'Economia anual',
    discountSuffix: 'de desconto',
    selectPlanCtas: {
      basic: 'Selecionar Basic',
      pro: 'Selecionar Pro',
      creator: 'Selecionar Creator',
      elite: 'Selecionar Elite',
    },
    estimatePrefix: 'Aprox.',
    estimateSuffix: 'imagens padrão',
    creditTopupTitle: 'Adicione créditos sem trocar de plano',
    creditTopupDescription:
      'Pacotes avulsos caem na hora e não iniciam assinatura.',
    creditTopupCta: 'Ver pacotes',
    instantDelivery: 'Liberação imediata',
    noRenewal: 'Sem renovação',
    agreementPrefix: 'Ao comprar, você aceita nossos',
    agreementConnector: 'e nossa',
    agreementSuffix: '',
    termsLabel: 'Termos',
    privacyLabel: 'Privacidade',
  },
  ja: {
    annualHint: '年払い、1年分のクレジットを前払い付与',
    monthlyHint: '月払い、毎月クレジットを付与',
    annualGrantLabel: '年額クレジット一括付与',
    monthlyGrantLabel: '月間クレジット',
    annualBillingLabel: '年額請求',
    annualSavePrefix: '月払いより節約',
    annualSwitchSavePrefix: '年払いで節約',
    discountSuffix: 'OFF',
    selectPlanCtas: {
      basic: 'Basic を選択',
      pro: 'Pro を選択',
      creator: 'Creator を選択',
      elite: 'Elite を選択',
    },
    estimatePrefix: '約',
    estimateSuffix: '枚の標準画像',
    creditTopupTitle: 'プラン変更なしでクレジット追加',
    creditTopupDescription:
      '単発パックはすぐ反映され、自動更新は始まりません。',
    creditTopupCta: 'クレジットパックを見る',
    instantDelivery: '即時追加',
    noRenewal: '自動更新なし',
    agreementPrefix: '購入により',
    agreementConnector: 'と',
    agreementSuffix: 'に同意したものとみなされます',
    termsLabel: '利用規約',
    privacyLabel: 'プライバシーポリシー',
  },
  ko: {
    annualHint: '연간 결제, 1년치 크레딧 선지급',
    monthlyHint: '월간 결제, 매월 크레딧 지급',
    annualGrantLabel: '연간 크레딧 선지급',
    monthlyGrantLabel: '월간 크레딧',
    annualBillingLabel: '연간 청구',
    annualSavePrefix: '월간 대비 절약',
    annualSwitchSavePrefix: '연간 결제로 절약',
    discountSuffix: '할인',
    selectPlanCtas: {
      basic: 'Basic 선택',
      pro: 'Pro 선택',
      creator: 'Creator 선택',
      elite: 'Elite 선택',
    },
    estimatePrefix: '약',
    estimateSuffix: '장의 표준 이미지',
    creditTopupTitle: '플랜 변경 없이 크레딧 추가',
    creditTopupDescription:
      '일회성 팩은 즉시 지급되며 자동 갱신을 시작하지 않습니다.',
    creditTopupCta: '크레딧 팩 보기',
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
  return Math.max(1, Math.floor(credits / 2));
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
  const maxSubscriptionCredits = Math.max(
    ...subscriptionCards.map((plan) => plan.credits),
    1
  );

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
      className="fixed bottom-0 left-0 right-0 top-0 z-[80] flex items-center justify-center bg-[#2f3440]/20 px-3 py-4 backdrop-blur-[10px] min-[641px]:left-[248px] sm:px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
      role="presentation"
    >
      <div
        aria-label={pricingCopy.ariaLabel}
        aria-modal="true"
        className="vogue-pricing-light relative flex max-h-[calc(100svh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[var(--vogue-border)] bg-[var(--vogue-page)] font-[var(--font-vogue-sans)] text-[#171a23] shadow-[0_34px_110px_rgba(72,92,130,0.26)]"
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

        <div className="overflow-y-auto px-4 pb-5 pt-7 sm:px-6 lg:px-8">
          <div className="vogue-pricing-header mx-auto max-w-4xl text-center">
            <h2 className="mx-auto max-w-3xl font-[var(--font-vogue-display)] text-[30px] font-semibold leading-[1.06] tracking-normal text-[#171a23] md:text-[42px]">
              {pricingCopy.title}
            </h2>
            <p className="mx-auto mt-3 max-w-full overflow-x-auto whitespace-nowrap px-1 text-sm font-semibold leading-6 text-[#6f6472] md:max-w-3xl md:text-[15px]">
              {pricingCopy.description}
            </p>

            <div className="mx-auto mt-8 w-full max-w-[520px] rounded-full border border-[#dedede] bg-[#eeeeee] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_10px_24px_rgba(17,18,13,0.06)]">
              <div className="grid grid-cols-3 gap-1">
                {tabs.map((tab) => (
                  <button
                    className={cn(
                      'inline-flex min-h-11 items-center justify-center rounded-full px-3 text-sm font-bold text-[#6b6c68] transition',
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
                      <span className="ml-1 shrink-0 text-[12px] font-black text-current max-[420px]:text-[11px]">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!showCreditPacks ? (
            <div className="mt-20 grid items-stretch gap-4 xl:mt-24 sm:grid-cols-2 xl:grid-cols-4">
              {subscriptionCards.map((plan) => {
                const planCopy = pricingCopy.plans[plan.id as PricingPlanId];
                const isRecommended = Boolean(
                  plan.popular || planCopy.highlight
                );
                const displayedCredits =
                  pricingTab === 'yearly' ? plan.credits * 12 : plan.credits;
                const annualSavings =
                  plan.monthlyPrice * 12 - plan.yearlyMonthlyPrice * 12;
                const annualTotal = plan.yearlyMonthlyPrice * 12;
                const creditFill = Math.max(
                  2,
                  Math.round((plan.credits / maxSubscriptionCredits) * 18)
                );

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
                        <div className="vogue-pricing-highlight-fill pointer-events-none absolute -top-7 bottom-0 left-0 right-0 z-0 rounded-[22px] bg-[linear-gradient(180deg,#e4ff6a_0px,#d8fb45_42px,#caf135_100%)]" />
                        <div className="vogue-pricing-highlight-banner pointer-events-none absolute -top-7 left-0 right-0 z-[1] flex h-9 items-start justify-center rounded-t-[22px] pt-2 text-[11px] font-black text-[#11120d] shadow-[inset_0_1px_0_rgba(255,255,255,0.64)]">
                          {pricingCopy.popularBadge}
                        </div>
                      </>
                    )}

                    <article
                      className={cn(
                        'relative z-10 flex h-full w-full min-h-[548px] flex-col rounded-[22px] border bg-white p-5 pt-7 shadow-none',
                        isRecommended
                          ? 'vogue-pricing-highlight-card border-[#e1e1df]'
                          : 'border-[#e1e1df]'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="min-w-0 font-[var(--font-vogue-display)] text-[25px] font-semibold leading-tight text-[#171a23]">
                          {planCopy.name}
                        </h3>
                        {pricingTab === 'yearly' ? (
                          <span className="shrink-0 rounded-[8px] bg-[#f1f1f1] px-3 py-1.5 text-[13px] font-black leading-none text-[#11120d]">
                            {plan.yearlyDiscount}% {runtimeCopy.discountSuffix}
                          </span>
                        ) : null}
                      </div>

                      {planCopy.description ? (
                        <p className="mt-2 min-h-[54px] text-sm leading-6 text-[#6f6472]">
                          {planCopy.description}
                        </p>
                      ) : null}

                      <div className="mt-5">
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
                            <p className="vogue-pricing-billing-note mt-2 text-xs leading-5 text-[#7a7280]">
                              {runtimeCopy.monthlyHint}
                            </p>
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

                      <p className="vogue-pricing-savings-note mt-3 text-center text-xs font-bold leading-5 text-[#7a7280]">
                        {pricingTab === 'yearly'
                          ? runtimeCopy.annualSavePrefix
                          : runtimeCopy.annualSwitchSavePrefix}{' '}
                        <span className="font-black text-[#6f6872]">
                          {formatUsdAmount(locale, annualSavings)}
                        </span>
                        {pricingTab === 'monthly' ? ' →' : null}
                      </p>

                      <div className="mt-5 border-t border-[var(--vogue-border)] pt-5">
                        <p className="text-sm font-bold leading-5 text-[#171a23]">
                          {pricingTab === 'yearly'
                            ? runtimeCopy.annualGrantLabel
                            : runtimeCopy.monthlyGrantLabel}{' '}
                          <span className="text-[#426cff]">
                            {formatLocalizedNumber(locale, displayedCredits)}{' '}
                            {pricingCopy.creditUnit}
                          </span>
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#6f6472]">
                          {runtimeCopy.estimatePrefix}{' '}
                          {formatLocalizedNumber(
                            locale,
                            getEstimatedImageCount(displayedCredits)
                          )}{' '}
                          {runtimeCopy.estimateSuffix}
                        </p>
                        <div className="mt-3 grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
                          {Array.from({ length: 18 }).map((_, index) => (
                            <span
                              className={cn(
                                'h-5 rounded-full',
                                index < creditFill
                                  ? 'bg-[linear-gradient(180deg,#171a23_0%,#4f5b75_100%)]'
                                  : 'bg-[#e8ebf1]'
                              )}
                              key={`${plan.id}-meter-${index}`}
                            />
                          ))}
                        </div>
                      </div>

                      <ul className="mt-5 space-y-1.5 text-sm leading-5 text-[#5a5360]">
                        {planCopy.features.slice(1).map((feature) => (
                          <li className="flex items-start gap-2" key={feature}>
                            <Check className={featureCheckClassName} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto mt-5 grid max-w-5xl gap-3 md:grid-cols-3">
              {creditPackPrices.map((pack) => {
                const packCopy = pricingCopy.packs[pack.id as PricingPackId];
                const isHighlighted = Boolean(pack.popular || packCopy.highlight);
                return (
                  <article
                    className={cn(
                      'rounded-[18px] border p-4 text-left shadow-[0_10px_22px_rgba(72,92,130,0.07)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(72,92,130,0.1)]',
                      isHighlighted
                        ? 'border-[#5f86ff] bg-white'
                        : 'border-[var(--vogue-border)] bg-[var(--vogue-panel-strong)]'
                    )}
                    key={pack.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-[var(--font-vogue-display)] text-[21px] font-semibold text-[#171a23]">
                          {packCopy.name}
                        </h4>
                        <p className="mt-1 text-xs leading-5 text-[#6f6472]">
                          {packCopy.description}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-[var(--vogue-border)] bg-[#fbf2ed] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#6f6472]">
                        {pricingCopy.oneTimeBadge}
                      </span>
                    </div>
                    <div className="mt-4 font-[var(--font-vogue-display)] text-[32px] font-semibold leading-none text-[#171a23]">
                      {packCopy.price}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-bold text-[#5268a3]">
                      <span className="rounded-full bg-[#eef4ff] px-2 py-0.5">
                        {formatLocalizedNumber(locale, pack.credits)}{' '}
                        {pricingCopy.creditUnit}
                      </span>
                      <span className="rounded-full bg-[#fbf2ed] px-2 py-0.5 text-[#6f6472]">
                        {runtimeCopy.instantDelivery}
                      </span>
                      <span className="rounded-full bg-[#fbf2ed] px-2 py-0.5 text-[#6f6472]">
                        {runtimeCopy.noRenewal}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-medium leading-5 text-[#6f6472]">
                      {runtimeCopy.estimatePrefix}{' '}
                      {formatLocalizedNumber(
                        locale,
                        getEstimatedImageCount(pack.credits)
                      )}{' '}
                      {runtimeCopy.estimateSuffix}
                    </p>
                    <Button
                      className={cn(
                        isHighlighted ? primaryCtaClassName : softCtaClassName,
                        'mt-3'
                      )}
                      disabled={isSubmitting}
                      onClick={() => openCreditCheckout(pack.id)}
                    >
                      {packCopy.cta}
                    </Button>
                  </article>
                );
              })}
            </div>
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
