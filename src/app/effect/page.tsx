import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import DashboardSidebar from '../../components/shared/DashboardSiderbar';
import Link from 'next/link';
import type { Metadata } from 'next';

const newTitle = "Effect Generator - Vogue AI";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Create stunning visual effects with our AI-powered Effect Generator. Transform your content with professional effects and filters.',
  alternates: {
    canonical: 'https://vogueai.net/effect',
  },
  openGraph: {
    title: newTitle,
    description: 'Create stunning visual effects with our AI-powered Effect Generator. Transform your content with professional effects and filters.',
    url: 'https://vogueai.net/effect',
    images: [
      {
        url: '/social-share.jpg',
        width: 1200,
        height: 630,
        alt: 'Effect Generator - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Create stunning visual effects with our AI-powered Effect Generator. Transform your content with professional effects and filters.',
    images: ['/social-share.jpg'],
  },
};

export default function EffectPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Main Content Section with Sidebar */}
      <div className="relative flex min-h-screen pt-16">
        {/* 侧边栏 - 固定在左侧 */}
        <div className="relative z-10">
          <DashboardSidebar />
        </div>

        {/* 主要内容区域 */}
        <main className="relative z-10 flex-1 overflow-y-auto p-6 ml-64 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Vogue AI Effect
              </h1>
            </div>
            
            {/* Earth Zoom 卡片 */}
            <div className="max-w-md mx-auto">
              <Link href="/effect/earth-zoom">
                <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 group-hover:from-blue-400 group-hover:to-green-400 transition-all duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">Earth Zoom</h3>
                      <p className="text-gray-400">Satellite-to-ground zoom effects</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Click to enter</span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
      
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
} 