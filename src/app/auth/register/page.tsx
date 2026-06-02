import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Vogue AI',
  robots: {
    index: false,
    follow: true,
  },
};

export { default } from '../../[locale]/auth/register/page';
