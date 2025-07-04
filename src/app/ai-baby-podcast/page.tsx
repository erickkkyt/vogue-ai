import Header from '../../components/common/Header';
import Hero from '../../components/ai-baby-podcast/HeroPodcast';
import Features from '../../components/ai-baby-podcast/FeaturesPodcast';
import WhatIs from '../../components/ai-baby-podcast/WhatIsPodcast';
import HowTo from '../../components/ai-baby-podcast/HowToPodcast';
import Why from '../../components/ai-baby-podcast/WhyPodcast';
import FAQ from '../../components/common/FAQ';
import Footer from '../../components/common/Footer';
import DashboardSection from '../../components/shared/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "AI Baby Podcast Generator - Create Your Unique Baby Podcast";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Create viral AI baby podcast videos with animated hosts and voice technology. Perfect for TikTok and YouTube Shorts. Generate engaging content in minutes.',
  alternates: {
    canonical: 'https://vogueai.net/ai-baby-podcast',
  },
  openGraph: {
    title: newTitle,
    description: 'Create viral AI baby podcast videos with animated hosts and voice technology. Perfect for TikTok and YouTube Shorts. Generate engaging content in minutes.',
    url: 'https://vogueai.net/ai-baby-podcast',
    images: [
      {
        url: '/social-share.jpg',
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
    description: 'Create viral AI baby podcast videos with animated hosts and voice technology. Perfect for TikTok and YouTube Shorts. Generate engaging content in minutes.',
    images: ['/social-share.jpg'],
  },
};

export default function AIBabyPodcastPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section - 放在最上面，避免被侧边栏遮挡 */}
        <div className="ml-64">
          <Hero />
        </div>

        {/* Dashboard Section - 需要向下滚动才能看到 */}
        <DashboardSection
          type="ai-baby-podcast"
          title="AI Baby Podcast Generator"
        />

        {/* 其他页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64 min-h-screen">
          <div className="max-w-full">
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
