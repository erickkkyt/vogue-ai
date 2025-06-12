import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Blog - VOGUE AI',
    template: '%s - VOGUE AI Blog',
  },
  description: 'Read the latest news, updates, and articles from VOGUE AI.',
  alternates: {
    canonical: 'https://www.babypodcast.pro/blog',
  },
  openGraph: {
    title: 'Blog - VOGUE AI',
    description: 'Stay updated with VOGUE AI news and articles.',
    url: 'https://www.babypodcast.pro/blog',
    // images: [ /* Add a specific social share image for the blog if desired */ ]
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-20 bg-gray-900">
        {children}
      </main>
      <Footer />
    </div>
  );
} 