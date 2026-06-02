import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication Error - Vogue AI',
  robots: {
    index: false,
    follow: true,
  },
};

export { default } from '../../[locale]/auth/error/page';
