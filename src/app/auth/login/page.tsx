import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Vogue AI',
  robots: {
    index: false,
    follow: true,
  },
};

export { default } from '../../[locale]/auth/login/page';
