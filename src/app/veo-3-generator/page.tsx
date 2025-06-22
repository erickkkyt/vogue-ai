import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroVeo3 from '../../components/veo-3-generator/HeroVeo3';
import Veo3CoreFeatures from '../../components/veo-3-generator/Veo3CoreFeatures';
import FeaturesVeo3 from '../../components/veo-3-generator/FeaturesVeo3';
import Veo3Showcase from '../../components/veo-3-generator/Veo3Showcase';

import Veo3FAQ from '../../components/veo-3-generator/Veo3FAQ';
import DashboardSection from '../../components/shared/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "Cheapest Veo 3 Generator - No Monthly Limits AI Video | Highest video quality";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Cheapest Veo 3 AI video generator with no monthly limits. Unlike Google\'s official restrictions, create unlimited professional videos with credits only. Start for just $19.99.',
  alternates: {
    canonical: 'https://www.vogueai.net/veo-3-generator',
  },
  openGraph: {
    title: newTitle,
    description: 'Cheapest Veo 3 AI video generator with no monthly limits. Unlike Google\'s official restrictions, create unlimited professional videos with credits only. Start for just $19.99.',
    url: 'https://www.vogueai.net/veo-3-generator',
    images: [
      {
        url: '/social-share.jpg',
        width: 1200,
        height: 630,
        alt: 'Veo 3 Generator - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Cheapest Veo 3 AI video generator with no monthly limits. Unlike Google\'s official restrictions, create unlimited professional videos with credits only. Start for just $19.99.',
    images: ['/social-share.jpg'],
  },
};

export default function Veo3GeneratorPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section - 放在最上面，避免被侧边栏遮挡 */}
        <div className="ml-64">
          <HeroVeo3 />
        </div>

        {/* Dashboard Section - 需要向下滚动才能看到 */}
        <DashboardSection
          type="veo-3-generator"
          title="Veo 3 Generator"
        />

        {/* 其他页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64">
          <Veo3Showcase />
          <FeaturesVeo3 />
          <Veo3CoreFeatures />
          <Veo3FAQ />
        </div>
      </main>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
