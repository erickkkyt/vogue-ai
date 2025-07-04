import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroGenerator from '../../components/ai-baby-generator/HeroGenerator';
import FeaturesGenerator from '../../components/ai-baby-generator/FeaturesGenerator';
import WhatIsGenerator from '../../components/ai-baby-generator/WhatIsGenerator';
import HowToGenerator from '../../components/ai-baby-generator/HowToGenerator';
import BeforeAfterShowcase from '../../components/ai-baby-generator/BeforeAfterShowcase';
import WhyGenerator from '../../components/ai-baby-generator/WhyGenerator';
import FAQGenerator from '../../components/ai-baby-generator/FAQGenerator';
import DashboardSection from '../../components/shared/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "Free AI Baby Generator - See Your Future Baby in Seconds";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Predict your baby photos instantly. Our advanced AI baby generator combines facial features to predict what your future baby will look like.',
  alternates: {
    canonical: 'https://vogueai.net/ai-baby-generator',
  },
  openGraph: {
    title: newTitle,
    description: 'Predict your baby photos instantly. Our advanced AI baby generator combines facial features to predict what your future baby will look like.',
    url: 'https://vogueai.net/ai-baby-generator',
    images: [
      {
        url: '/social-share.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Baby Generator - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Predict your baby photos instantly. Our advanced AI baby generator combines facial features to predict what your future baby will look like.',
    images: ['/social-share.jpg'],
  },
};

export default function AIBabyGeneratorPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section - 放在最上面，避免被侧边栏遮挡 */}
        <div className="ml-64">
          <HeroGenerator />
        </div>

        {/* Dashboard Section - 需要向下滚动才能看到 */}
        <DashboardSection
          type="ai-baby-generator"
          title="AI Baby Generator"
        />

        {/* 其他页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64">
          <FeaturesGenerator />
          <WhatIsGenerator />
          <HowToGenerator />
          <BeforeAfterShowcase />
          <WhyGenerator />
          <FAQGenerator />
        </div>
      </main>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
