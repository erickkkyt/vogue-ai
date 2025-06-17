import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.vogueai.net/pricing',
  },
  // You can also set a default title or other metadata for the /pricing route here if desired
  title: 'Pricing Plans - AI Baby Generator',
  description: 'Explore flexible pricing plans for the AI Baby Generator. Find the perfect option to create unique baby videos, from free trials to premium features.',
  openGraph: {
    title: 'Pricing Plans - AI Baby Generator',
    description: 'Explore flexible pricing plans for the AI Baby Generator. Find the perfect option to create unique baby videos, from free trials to premium features.',
    url: 'https://www.vogueai.net/pricing',
    images: [
      {
        url: '/social-share.png',
        width: 1200,
        height: 630,
        alt: 'AI Baby Generator - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans - AI Baby Generator',
    description: 'Explore flexible pricing plans for the AI Baby Generator. Find the perfect option to create unique baby videos, from free trials to premium features.',
    images: ['/social-share.png'],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google AdSense 脚本 */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6313486072364487"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
} 