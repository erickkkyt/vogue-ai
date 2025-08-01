import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroSeedance from '../../components/seedance/HeroSeedance';
import SeedanceCoreFeatures from '../../components/seedance/SeedanceCoreFeatures';
import FeaturesSeedance from '../../components/seedance/FeaturesSeedance';
import SeedanceShowcase from '../../components/seedance/SeedanceShowcase';
import SeedanceFAQ from '../../components/seedance/SeedanceFAQ';
import DashboardSection from '../../components/shared/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "Seedance AI Generator - Create AI Dance Videos from Text & Images";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Experience next-generation video creation with Seedance AI. Transform text descriptions or static images into dynamic dance videos through advanced AI technology with motion synthesis and temporal coherence.',
  alternates: {
    canonical: 'https://vogueai.net/seedance',
  },
  openGraph: {
    title: newTitle,
    description: 'Experience next-generation video creation with Seedance AI. Transform text descriptions or static images into dynamic dance videos through advanced AI technology with motion synthesis and temporal coherence.',
    url: 'https://vogueai.net/seedance',
    images: [
      {
        url: '/social-share.jpg',
        width: 1200,
        height: 630,
        alt: 'SeeAI Dance Generator - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Experience next-generation video creation with Seedance AI. Transform text descriptions or static images into dynamic dance videos through advanced AI technology with motion synthesis and temporal coherence.',
    images: ['/social-share.jpg'],
  },
};

export default function SeedancePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section - 放在最上面，避免被侧边栏遮挡 */}
        <div className="ml-64">
          <HeroSeedance />
        </div>

        {/* Dashboard Section - 需要向下滚动才能看到 */}
        <DashboardSection
          type="seedance"
          title="Seedance AI Generator"
        />

        {/* 其他页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64">
          <SeedanceShowcase />
          <FeaturesSeedance />
          <SeedanceCoreFeatures />
          <SeedanceFAQ />
        </div>
      </main>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
