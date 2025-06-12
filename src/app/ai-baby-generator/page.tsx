import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroGenerator from '../../components/HeroGenerator';
import FeaturesGenerator from '../../components/FeaturesGenerator';
import WhatIsGenerator from '../../components/WhatIsGenerator';
import HowToGenerator from '../../components/HowToGenerator';
import BeforeAfterShowcase from '../../components/BeforeAfterShowcase';
import WhyGenerator from '../../components/WhyGenerator';
import FAQ from '../../components/FAQ';
import DashboardSection from '../../components/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "AI Baby Generator: See Your Future Baby";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Generate adorable AI baby images by combining parent photos. See what your future baby might look like with advanced AI technology.',
  alternates: {
    canonical: 'https://www.babypodcast.pro/ai-baby-generator',
  },
  openGraph: {
    title: newTitle,
    description: 'Generate adorable AI baby images by combining parent photos. See what your future baby might look like with advanced AI technology.',
    url: 'https://www.babypodcast.pro/ai-baby-generator',
    images: [
      {
        url: '/social-share.png',
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
    description: 'Generate adorable AI baby images by combining parent photos. See what your future baby might look like with advanced AI technology.',
    images: ['/social-share.png'],
  },
};

export default function AIBabyGeneratorPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Dashboard Section - 放在最上面 */}
        <DashboardSection
          type="ai-baby-generator"
          title="AI Baby Generator"
        />

        {/* 原有的页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64">
          <HeroGenerator />
          <FeaturesGenerator />
          <WhatIsGenerator />
          <HowToGenerator />
          <BeforeAfterShowcase />
          <WhyGenerator />
          <FAQ />
        </div>
      </main>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
