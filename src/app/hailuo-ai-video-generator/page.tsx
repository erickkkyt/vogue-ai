import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroHailuo from '../../components/hailuo-generator/HeroHailuo';
import HailuoCoreFeatures from '../../components/hailuo-generator/HailuoCoreFeatures';
import FeaturesHailuo from '../../components/hailuo-generator/FeaturesHailuo';
import HailuoShowcase from '../../components/hailuo-generator/HailuoShowcase';
import HailuoFAQ from '../../components/hailuo-generator/HailuoFAQ';
import DashboardSection from '../../components/shared/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "Hailuo AI Video Generator - Next Gen Text to Video";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Hailuo AI video generator for next-generation text-to-video creation. Experience advanced Hailuo AI technology for professional video generation with cutting-edge artificial intelligence.',
  alternates: {
    canonical: 'https://vogueai.net/hailuo-ai-video-generator',
  },
  openGraph: {
    title: newTitle,
    description: 'Hailuo AI video generator for next-generation text-to-video creation. Experience advanced Hailuo AI technology for professional video generation with cutting-edge artificial intelligence.',
    url: 'https://vogueai.net/hailuo-ai-video-generator',
    images: [
      {
        url: '/social-share.jpg',
        width: 1200,
        height: 630,
        alt: 'Hailuo AI Video Generator - Cheapest Access',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Hailuo AI video generator for next-generation text-to-video creation. Experience advanced Hailuo AI technology for professional video generation with cutting-edge artificial intelligence.',
    images: ['/social-share.jpg'],
  },
};

export default function HailuoGeneratorPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section - 放在最上面，避免被侧边栏遮挡 */}
        <div className="ml-64">
          <HeroHailuo />
        </div>

        {/* Dashboard Section - 需要向下滚动才能看到 */}
        <DashboardSection
          type="hailuo-generator"
          title="Hailuo AI Video Generator"
        />

        {/* 其他页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64">
          <HailuoShowcase />
          <FeaturesHailuo />
          <HailuoCoreFeatures />
          <HailuoFAQ />
        </div>
      </main>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
