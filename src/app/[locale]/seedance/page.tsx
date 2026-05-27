import Footer from '@/components/common/Footer';
import HeroSeedance from '@/components/seedance/HeroSeedance';
import SeedanceCoreFeatures from '@/components/seedance/SeedanceCoreFeatures';
import FeaturesSeedance from '@/components/seedance/FeaturesSeedance';
import SeedanceShowcase from '@/components/seedance/SeedanceShowcase';
import SeedanceFAQ from '@/components/seedance/SeedanceFAQ';
import DashboardSection from '@/components/shared/DashboardSection';
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
    <div className="vogue-marketing-light min-h-screen bg-[var(--vogue-page)] text-slate-950">
      <main className="pt-16">
        {/* Dashboard Section - 首先显示，让用户立即开始使用 */}
        <DashboardSection
          type="seedance"
          title="Seedance AI Generator"
        />

        {/* Hero Section - 移到下面，避免被侧边栏遮挡 */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <HeroSeedance />
        </div>

        {/* 其他页面内容 - 确保不被sidebar遮挡 */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SeedanceShowcase />
          <FeaturesSeedance />
          <SeedanceCoreFeatures />
          <SeedanceFAQ />
        </div>
      </main>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}
