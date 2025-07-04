import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Blog - VOGUE AI',
    template: '%s - VOGUE AI Blog',
  },
  description: 'Read the latest news, updates, and articles from VOGUE AI.',
  alternates: {
    canonical: 'https://vogueai.net/blog',
  },
  openGraph: {
    title: 'Blog - VOGUE AI',
    description: 'Stay updated with VOGUE AI news and articles.',
    url: 'https://vogueai.net/blog',
    // images: [ /* Add a specific social share image for the blog if desired */ ]
  }
};

export default function BlogLayout({
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
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16 md:pt-20 bg-gray-900">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
} 