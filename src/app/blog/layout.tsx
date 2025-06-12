import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Blog - AI Baby Generator',
    template: '%s - AI Baby Generator Blog',
  },
  description: 'Read the latest news, updates, and articles from AI Baby Generator.',
  alternates: {
    canonical: 'https://www.babypodcast.pro/blog',
  },
  openGraph: {
    title: 'Blog - AI Baby Generator',
    description: 'Stay updated with AI Baby Generator news and articles.',
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
      <main className="flex-grow pt-16 md:pt-20 bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
} 