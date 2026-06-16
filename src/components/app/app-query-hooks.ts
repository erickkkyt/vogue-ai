'use client';

import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { GenerationAccessTier } from '@/lib/effects/generation-access';
import { APP_QUERY_KEYS } from './app-query-config';

export type CreditsQueryData = {
  currentCredits?: number;
  authenticated?: boolean;
  generationAccessTier?: GenerationAccessTier;
};

export const fetchAppCredits = async (): Promise<CreditsQueryData> => {
  const response = await fetch('/api/user/credits', { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to refresh credits');

  return (await response.json()) as CreditsQueryData;
};

export function useAppCreditsQuery(userId?: string | null) {
  return useQuery({
    queryKey: APP_QUERY_KEYS.credits(userId ?? 'anonymous'),
    queryFn: fetchAppCredits,
    enabled: Boolean(userId),
    staleTime: 3_000,
  });
}

export function invalidateAppCredits(
  queryClient: QueryClient,
  userId?: string | null
) {
  if (!userId) return;

  void queryClient.invalidateQueries({
    queryKey: APP_QUERY_KEYS.credits(userId),
  });
}

export function setKnownAppCredits(
  queryClient: QueryClient,
  userId: string | null | undefined,
  currentCredits: number
) {
  if (!userId) return;

  queryClient.setQueryData<CreditsQueryData>(
    APP_QUERY_KEYS.credits(userId),
    (previous) => ({
      ...previous,
      authenticated: true,
      currentCredits,
    })
  );
}
