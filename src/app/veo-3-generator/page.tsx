import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroVeo3 from '../../components/veo-3-generator/HeroVeo3';
import FeaturesVeo3 from '../../components/veo-3-generator/FeaturesVeo3';
import Veo3Showcase from '../../components/veo-3-generator/Veo3Showcase';
import ComingSoon from '../../components/common/ComingSoon';
import FAQ from '../../components/common/FAQ';
import DashboardSection from '../../components/shared/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "Veo 3 Generator: AI Video with Audio";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Generate high-quality videos with synchronized audio using Google Veo 3 AI. Create videos with sound effects, dialogue, and ambient noise.',
  alternates: {
    canonical: 'https://www.vogueai.net/veo-3-generator',
  },
  openGraph: {
    title: newTitle,
    description: 'Generate high-quality videos with synchronized audio using Google Veo 3 AI. Create videos with sound effects, dialogue, and ambient noise.',
    url: 'https://www.vogueai.net/veo-3-generator',
    images: [
      {
        url: '/social-share.png',
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
    description: 'Generate high-quality videos with synchronized audio using Google Veo 3 AI. Create videos with sound effects, dialogue, and ambient noise.',
    images: ['/social-share.png'],
  },
};

export default function Veo3GeneratorPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Dashboard Section - 放在最上面 */}
        <DashboardSection
          type="veo-3-generator"
          title="Veo 3 Generator"
        />

        {/* 原有的页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64">
          <HeroVeo3 />
          <FeaturesVeo3 />
          <Veo3Showcase />
          <ComingSoon />
          <FAQ />
        </div>
      </main>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
