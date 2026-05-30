import { subscriptionPlanIds } from '@/config/pricing';

export type GenerationAccessTier = 'standard' | 'faster';

const SUBSCRIPTION_PLAN_ID_SET = new Set<string>(
  subscriptionPlanIds as readonly string[]
);

export const resolveGenerationAccessTierFromSubscriptionState = (
  subscriptionState?: string | null
): GenerationAccessTier =>
  SUBSCRIPTION_PLAN_ID_SET.has(subscriptionState?.trim().toLowerCase() ?? '')
    ? 'faster'
    : 'standard';
