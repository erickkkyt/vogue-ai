import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Vogue AI',
  robots: {
    index: false,
    follow: true,
  },
};

export { default } from '../../[locale]/auth/reset-password/page';
