import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroKontext from '../../components/HeroKontext';
import FeaturesKontext from '../../components/FeaturesKontext';
import TransformationShowcase from '../../components/TransformationShowcase';
import ComingSoon from '../../components/ComingSoon';
import FAQ from '../../components/FAQ';
import DashboardSection from '../../components/DashboardSection';
import type { Metadata } from 'next';

const newTitle = "Face-to-Many-Kontext: AI Face Transformation";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Transform faces into multiple contexts and styles with advanced AI face manipulation and style transfer technology.',
  alternates: {
    canonical: 'https://www.vogueai.net/face-to-many-kontext',
  },
  openGraph: {
    title: newTitle,
    description: 'Transform faces into multiple contexts and styles with advanced AI face manipulation and style transfer technology.',
    url: 'https://www.vogueai.net/face-to-many-kontext',
    images: [
      {
        url: '/social-share.png',
        width: 1200,
        height: 630,
        alt: 'Face-to-Many-Kontext - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Transform faces into multiple contexts and styles with advanced AI face manipulation and style transfer technology.',
    images: ['/social-share.png'],
  },
};

export default function FaceToManyKontextPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Dashboard Section - 放在最上面 */}
        <DashboardSection
          type="face-to-many-kontext"
          title="Face-to-Many-Kontext"
        />

        {/* 原有的页面内容 - 确保不被sidebar遮挡 */}
        <div className="ml-64">
          <HeroKontext />
          <FeaturesKontext />
          <TransformationShowcase />
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
