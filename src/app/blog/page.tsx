import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Vogue AI Blog',
  robots: {
    index: false,
    follow: true,
  },
};

export default function BlogFallbackPage() {
  redirect('/en/blog');
}
