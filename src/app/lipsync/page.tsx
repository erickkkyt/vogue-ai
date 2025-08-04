import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import WhatIsLipSync from '../../components/lipsync/WhatIsLipSync';
import LipsyncCoreFeatures from '../../components/lipsync/LipsyncCoreFeatures';
import LipsyncShowcase from '../../components/lipsync/LipsyncShowcase';
import LipsyncFAQ from '../../components/lipsync/LipsyncFAQ';
import DashboardSection from '../../components/shared/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "LipSync Generator - Create Perfect AI Lip-Sync Videos";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Free AI Lip Sync Video Generator. Upload your audio and video, and AI will automatically match your lips for smooth, natural lip syncing. Create high-quality lip-synced videos in minutes, completely free.',
  alternates: {
    canonical: 'https://vogueai.net/lipsync',
  },
  openGraph: {
    title: newTitle,
    description: 'Free AI Lip Sync Video Generator. Upload your audio and video, and AI will automatically match your lips for smooth, natural lip syncing. Create high-quality lip-synced videos in minutes, completely free.',
    url: 'https://vogueai.net/lipsync',
    images: [
      {
        url: '/social-share.jpg',
        width: 1200,
        height: 630,
        alt: 'LipSync Generator - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Free AI Lip Sync Video Generator. Upload your audio and video, and AI will automatically match your lips for smooth, natural lip syncing. Create high-quality lip-synced videos in minutes, completely free.',
    images: ['/social-share.jpg'],
  },
};

export default function LipsyncPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16 bg-gray-900">
        {/* Dashboard Section - 直接显示，不需要向下滚动 */}
        <DashboardSection
          type="lipsync"
          title="LipSync Generator"
        />

        {/* 其他页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64">
          <WhatIsLipSync />
          <LipsyncShowcase />
          <LipsyncCoreFeatures />
          <LipsyncFAQ />
        </div>
      </main>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
