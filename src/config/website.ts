import { REGISTER_GIFT_CREDITS_AMOUNT } from './product-policy';

export const websiteConfig = {
  name: 'Vogue AI',
  auth: {
    enableGoogleLogin: true,
    enableGoogleOneTap:
      process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED === 'true',
    enableGithubLogin: false,
    enableCredentialLogin: true,
    requireEmailVerification:
      process.env.AUTH_REQUIRE_EMAIL_VERIFICATION !== 'false',
  },
  credits: {
    enableRegisterGiftCredits: true,
    registerGiftCredits: REGISTER_GIFT_CREDITS_AMOUNT,
  },
  mail: {
    provider: 'resend',
    from: 'Vogue AI <noreply@vogueai.net>',
    supportEmail: 'support@vogueai.net',
  },
  routes: {
    defaultLoginRedirect: '/app',
  },
} as const;
