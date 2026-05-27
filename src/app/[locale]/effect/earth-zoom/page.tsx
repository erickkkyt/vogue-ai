import Footer from '@/components/common/Footer';
import DashboardSection from '@/components/shared/DashboardSection';
import HeroEarthZoom from '@/components/effect/HeroEarthZoom';
import EarthZoomShowcase from '@/components/effect/EarthZoomShowcase';
import EarthZoomAbout from '@/components/effect/EarthZoomAbout';
import EarthZoomFAQ from '@/components/effect/EarthZoomFAQ';
import type { Metadata } from 'next';

const newTitle = "Earth Zoom Effect Generator - Vogue AI";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Transform your photos into stunning cinematic zoom-out sequences from Earth to space. Create viral-worthy content in seconds with our AI-powered Earth Zoom effects.',
  alternates: {
    canonical: 'https://vogueai.net/effect/earth-zoom',
  },
  openGraph: {
    title: newTitle,
    description: 'Transform your photos into stunning cinematic zoom-out sequences from Earth to space. Create viral-worthy content in seconds with our AI-powered Earth Zoom effects.',
    url: 'https://vogueai.net/effect/earth-zoom',
    images: [
      {
        url: '/social-share.jpg',
        width: 1200,
        height: 630,
        alt: 'Earth Zoom Effect Generator - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Transform your photos into stunning cinematic zoom-out sequences from Earth to space. Create viral-worthy content in seconds with our AI-powered Earth Zoom effects.',
    images: ['/social-share.jpg'],
  },
};

export default function EarthZoomPage() {
  return (
    <div className="vogue-marketing-light min-h-screen bg-[var(--vogue-page)] text-slate-950">
      <main className="pt-16">
        {/* Dashboard Section - 首先显示，让用户立即开始使用 */}
        <DashboardSection
          type="earth-zoom"
          title="Earth Zoom Effect Generator"
        />

        {/* Hero Section - 移到下面，避免被侧边栏遮挡 */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <HeroEarthZoom />
        </div>

        {/* 其他页面内容 - 确保不被sidebar遮挡 */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EarthZoomShowcase />
          <EarthZoomAbout />
          <EarthZoomFAQ />
        </div>
      </main>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
} 
