import type { DefaultOptions } from '@tanstack/react-query';

export const WORKSPACE_STATUS_POLL_INTERVAL_MS = 4_000;

export const APP_QUERY_DEFAULT_OPTIONS = {
  queries: {
    staleTime: 5_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: false,
  },
} satisfies DefaultOptions;

export const APP_QUERY_KEYS = {
  credits: (userId: string) => ['app', 'credits', userId] as const,
  recentAssets: (userId: string) => ['app', 'recent-assets', userId] as const,
  generationStatus: (taskId: string) =>
    ['app', 'generation-status', taskId] as const,
};

export const shouldPollWorkspaceGenerationStatus = (
  status?: 'pending' | 'processing' | 'succeeded' | 'failed'
) => status === 'pending' || status === 'processing';
