export type VoguePriceKind = 'subscription' | 'credit';
export type VoguePriceInterval = 'month' | 'year';
export type VogueSubscriptionPlanId = 'basic' | 'pro' | 'creator' | 'elite';
export type VogueCreditPackId = 'starter' | 'growth' | 'professional';

type VogueBasePrice = {
  priceId: string;
  priceEnvKey: string;
  kind: VoguePriceKind;
  name: string;
  credits: number;
};

export type VogueSubscriptionPrice = VogueBasePrice & {
  id: VogueSubscriptionPlanId;
  kind: 'subscription';
  interval: VoguePriceInterval;
  monthlyPrice: number;
  yearlyMonthlyPrice: number;
  yearlyDiscount: number;
  popular?: boolean;
  bestValue?: boolean;
};

export type VogueCreditPrice = VogueBasePrice & {
  id: VogueCreditPackId;
  kind: 'credit';
  interval?: never;
  amountUsd: number;
  zpayAmountEnvKey: string;
  popular?: boolean;
};

export type VoguePrice = VogueSubscriptionPrice | VogueCreditPrice;

export const subscriptionPlanIds = [
  'basic',
  'pro',
  'creator',
  'elite',
] as const satisfies readonly VogueSubscriptionPlanId[];

export const creditPackIds = [
  'starter',
  'growth',
  'professional',
] as const satisfies readonly VogueCreditPackId[];

const visibleMonthlySubscriptionPlanIds = [
  'pro',
  'creator',
  'elite',
] as const satisfies readonly VogueSubscriptionPlanId[];

const SUBSCRIPTION_PLAN_DEFINITIONS: Array<{
  id: VogueSubscriptionPlanId;
  name: string;
  credits: number;
  monthlyPrice: number;
  yearlyMonthlyPrice: number;
  yearlyDiscount: number;
  monthlyPriceId: string;
  monthlyPriceEnvKey: string;
  yearlyPriceId: string;
  yearlyPriceEnvKey: string;
  popular?: boolean;
  bestValue?: boolean;
}> = [
  {
    id: 'basic',
    name: 'Basic Plan',
    credits: 300,
    monthlyPrice: 9.9,
    yearlyMonthlyPrice: 83.2 / 12,
    yearlyDiscount: 30,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY || '',
    monthlyPriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY',
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY || '',
    yearlyPriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY',
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    credits: 1200,
    monthlyPrice: 29.9,
    yearlyMonthlyPrice: 215.3 / 12,
    yearlyDiscount: 40,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
    monthlyPriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY',
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
    yearlyPriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY',
  },
  {
    id: 'creator',
    name: 'Creator Plan',
    credits: 4000,
    monthlyPrice: 79.9,
    yearlyMonthlyPrice: 479.4 / 12,
    yearlyDiscount: 50,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_MONTHLY || '',
    monthlyPriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_CREATOR_MONTHLY',
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_YEARLY || '',
    yearlyPriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_CREATOR_YEARLY',
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite Plan',
    credits: 12000,
    monthlyPrice: 199.9,
    yearlyMonthlyPrice: 1199.4 / 12,
    yearlyDiscount: 50,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY || '',
    monthlyPriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY',
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_YEARLY || '',
    yearlyPriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_ELITE_YEARLY',
    bestValue: true,
  },
];

const CREDIT_PACK_DEFINITIONS: VogueCreditPrice[] = [
  {
    id: 'starter',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_STARTER || '',
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_CREDITS_STARTER',
    kind: 'credit',
    name: 'Starter Credits',
    credits: 200,
    amountUsd: 12.9,
    zpayAmountEnvKey: 'ZPAY_PRICE_CNY_CREDITS_STARTER',
  },
  {
    id: 'growth',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_GROWTH || '',
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_CREDITS_GROWTH',
    kind: 'credit',
    name: 'Growth Credits',
    credits: 1200,
    amountUsd: 49.9,
    zpayAmountEnvKey: 'ZPAY_PRICE_CNY_CREDITS_GROWTH',
  },
  {
    id: 'professional',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_PROFESSIONAL || '',
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_CREDITS_PROFESSIONAL',
    kind: 'credit',
    name: 'Studio Credits',
    credits: 2600,
    amountUsd: 99.9,
    zpayAmountEnvKey: 'ZPAY_PRICE_CNY_CREDITS_PROFESSIONAL',
    popular: true,
  },
];

export const subscriptionPrices: VogueSubscriptionPrice[] =
  SUBSCRIPTION_PLAN_DEFINITIONS.reduce<VogueSubscriptionPrice[]>(
    (prices, plan) => {
      prices.push(
        {
          id: plan.id,
          priceId: plan.monthlyPriceId,
          priceEnvKey: plan.monthlyPriceEnvKey,
          kind: 'subscription',
          name: plan.name,
          credits: plan.credits,
          interval: 'month',
          monthlyPrice: plan.monthlyPrice,
          yearlyMonthlyPrice: plan.yearlyMonthlyPrice,
          yearlyDiscount: plan.yearlyDiscount,
          popular: plan.popular,
          bestValue: plan.bestValue,
        },
        {
          id: plan.id,
          priceId: plan.yearlyPriceId,
          priceEnvKey: plan.yearlyPriceEnvKey,
          kind: 'subscription',
          name: plan.name,
          credits: plan.credits,
          interval: 'year',
          monthlyPrice: plan.monthlyPrice,
          yearlyMonthlyPrice: plan.yearlyMonthlyPrice,
          yearlyDiscount: plan.yearlyDiscount,
          popular: plan.popular,
          bestValue: plan.bestValue,
        }
      );

      return prices;
    },
    []
  );

export const creditPackPrices = CREDIT_PACK_DEFINITIONS;

export const VOGUE_PRICES: VoguePrice[] = [
  ...subscriptionPrices,
  ...creditPackPrices,
];

export const findVoguePriceByStripePriceId = (priceId: string) =>
  VOGUE_PRICES.find((price) => price.priceId === priceId && priceId !== '') ??
  null;

export const findVogueSubscriptionPrice = (
  id: VogueSubscriptionPlanId,
  interval: VoguePriceInterval
) =>
  subscriptionPrices.find(
    (price) => price.id === id && price.interval === interval
  ) ?? null;

export const findVogueCreditPackById = (id: string) =>
  creditPackPrices.find((price) => price.id === id) ?? null;

export const getPricingSubscriptionPlanIdsForInterval = (
  interval: VoguePriceInterval
) =>
  interval === 'month'
    ? [...visibleMonthlySubscriptionPlanIds]
    : [...subscriptionPlanIds];

export function getVogueCreditGrantAmount(price: VoguePrice) {
  if (price.kind === 'subscription' && price.interval === 'year') {
    return price.credits * 12;
  }

  return price.credits;
}
