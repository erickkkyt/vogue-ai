'use client';

import {
  adminClient,
  inferAdditionalFields,
  oneTapClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { auth } from './auth';
import { getBaseUrl } from './urls/urls';

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  fetchOptions: {
    timeout: 12000,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    ? {
        plugins: [
          adminClient(),
          inferAdditionalFields<typeof auth>(),
          oneTapClient({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            promptOptions: {
              fedCM: false,
              baseDelay: 1000,
              maxAttempts: 3,
            },
            additionalOptions: {
              use_fedcm_for_prompt: false,
              use_fedcm_for_button: false,
            } as Record<string, unknown>,
          }),
        ],
      }
    : {
        plugins: [adminClient(), inferAdditionalFields<typeof auth>()],
      }),
});
