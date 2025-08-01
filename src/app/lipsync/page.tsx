import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroLipsync from '../../components/lipsync/HeroLipsync';
import LipsyncCoreFeatures from '../../components/lipsync/LipsyncCoreFeatures';
import FeaturesLipsync from '../../components/lipsync/FeaturesLipsync';
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
      <main className="pt-16">
        {/* Hero Section - 放在最上面，避免被侧边栏遮挡 */}
        <div className="ml-64">
          <HeroLipsync />
        </div>

        {/* Dashboard Section - 需要向下滚动才能看到 */}
        <DashboardSection
          type="lipsync"
          title="LipSync Generator"
        />

        {/* 其他页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64">
          <LipsyncShowcase />
          <FeaturesLipsync />
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
