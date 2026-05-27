import { addRegisterGiftCredits } from '@/credits/credits';
import { getDb } from '@/db';
import { LOCALE_COOKIE_NAME } from '@/i18n/routing';
import { websiteConfig } from '@/config/website';
import { sendAuthEmail } from '@/lib/auth-email';
import {
  getConfiguredBaseUrl,
  getUrlWithLocaleInCallbackUrl,
} from '@/lib/urls/urls';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, oneTap } from 'better-auth/plugins';

const socialProviders: Record<
  string,
  { clientId: string; clientSecret: string }
> = {};

if (
  websiteConfig.auth.enableGoogleLogin &&
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (
  websiteConfig.auth.enableGithubLogin &&
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

function getRequestLocale(request?: Request) {
  const cookie = request?.headers.get('cookie') ?? '';
  const match = cookie.match(new RegExp(`${LOCALE_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const authPlugins = [
  admin({
    defaultBanExpiresIn: undefined,
    bannedUserMessage: 'Your account has been disabled.',
  }),
  ...(websiteConfig.auth.enableGoogleOneTap ? [oneTap()] : []),
];

function getAuthSecret() {
  const secret = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('BETTER_AUTH_SECRET or AUTH_SECRET is required in production');
  }

  return 'vogue-ai-development-secret-change-before-production';
}

export const auth = betterAuth({
  appName: websiteConfig.name,
  baseURL: getConfiguredBaseUrl(),
  secret: getAuthSecret(),
  database: drizzleAdapter(await getDb(), {
    provider: 'pg',
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  emailAndPassword: {
    enabled: websiteConfig.auth.enableCredentialLogin,
    requireEmailVerification: websiteConfig.auth.requireEmailVerification,
    sendResetPassword: async ({ user, url }, request) => {
      const resetUrl = getUrlWithLocaleInCallbackUrl(url, getRequestLocale(request));

      await sendAuthEmail({
        to: user.email,
        subject: 'Reset your Vogue AI password',
        text: `Reset your Vogue AI password: ${resetUrl}`,
        html: `<p>Reset your Vogue AI password:</p><p><a href="${resetUrl}">Reset password</a></p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: websiteConfig.auth.requireEmailVerification,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }, request) => {
      const verifyUrl = getUrlWithLocaleInCallbackUrl(
        url,
        getRequestLocale(request)
      );

      await sendAuthEmail({
        to: user.email,
        subject: 'Verify your Vogue AI email',
        text: `Verify your Vogue AI email: ${verifyUrl}`,
        html: `<p>Verify your Vogue AI email:</p><p><a href="${verifyUrl}">Verify email</a></p>`,
      });
    },
  },
  socialProviders,
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github'],
    },
  },
  user: {
    additionalFields: {
      customerId: {
        type: 'string',
        required: false,
      },
      subscriptionState: {
        type: 'string',
        required: false,
        defaultValue: 'free',
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          if (!websiteConfig.credits.enableRegisterGiftCredits) return;

          try {
            await addRegisterGiftCredits(createdUser.id);
          } catch (error) {
            console.error('register gift credits failed:', error);
          }
        },
      },
    },
  },
  plugins: authPlugins,
  onAPIError: {
    errorURL: '/auth/error',
  },
});
