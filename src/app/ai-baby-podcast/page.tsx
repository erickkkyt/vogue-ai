import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import WhatIs from '../../components/WhatIs';
import HowTo from '../../components/HowTo';
import Why from '../../components/Why';
import FAQ from '../../components/FAQ';
import Footer from '../../components/Footer';
import DashboardSection from '../../components/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "AI Baby Podcast Generator: Create Viral Baby Podcast Videos";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Create viral baby podcast videos with AI-generated hosts, advanced animation, and voice technology. Perfect for TikTok and YouTube Shorts content creation.',
  alternates: {
    canonical: 'https://www.babypodcast.pro/ai-baby-podcast',
  },
  openGraph: {
    title: newTitle,
    description: 'Create viral baby podcast videos with AI-generated hosts, advanced animation, and voice technology. Perfect for TikTok and YouTube Shorts content creation.',
    url: 'https://www.babypodcast.pro/ai-baby-podcast',
    images: [
      {
        url: '/social-share.png',
        width: 1200,
        height: 630,
        alt: 'AI Baby Podcast Generator - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Create viral baby podcast videos with AI-generated hosts, advanced animation, and voice technology. Perfect for TikTok and YouTube Shorts content creation.',
    images: ['/social-share.png'],
  },
};

export default function AIBabyPodcastPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Dashboard Section - 放在最上面 */}
        <DashboardSection
          type="ai-baby-podcast"
          title="AI Baby Podcast Generator"
        />

        {/* 原有的页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64 min-h-screen">
          <div className="max-w-full">
            <Hero />
            <Features />
            <WhatIs />
            <HowTo />
            <Why />
            <FAQ />
          </div>
        </div>
      </main>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
