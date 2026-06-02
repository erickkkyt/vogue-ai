import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Vogue AI',
  robots: {
    index: false,
    follow: true,
  },
};

export { default } from '../../[locale]/auth/forgot-password/page';
