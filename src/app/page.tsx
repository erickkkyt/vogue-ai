import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

const newTitle = "Vogue AI: Create Unique AI Baby Pictures&Videos";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Discover three powerful AI tools under Vogue AI: AI Baby Podcast Generator, AI Baby Generator, and Face-to-Many-Kontext. Create amazing content with cutting-edge AI technology.',
  alternates: {
    canonical: 'https://www.babypodcast.pro',
  },
  openGraph: {
    title: newTitle,
    description: 'Discover three powerful AI tools under Vogue AI: AI Baby Podcast Generator, AI Baby Generator, and Face-to-Many-Kontext. Create amazing content with cutting-edge AI technology.',
    url: 'https://www.babypodcast.pro',
    images: [
      {
        url: '/social-share.png',
        width: 1200,
        height: 630,
        alt: 'Vogue AI - Social Share Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newTitle,
    description: 'Discover three powerful AI tools under Vogue AI: AI Baby Podcast Generator, AI Baby Generator, and Face-to-Many-Kontext. Create amazing content with cutting-edge AI technology.',
    images: ['/social-share.png'],
  },
};

export default function Home() {
  // 定义AI工具数据
  const aiTools = [
    {
      id: 'ai-baby-generator',
      title: 'AI Baby Generator',
      description: 'Generate adorable AI baby images by combining parent photos. See what your future baby might look like with advanced AI technology.',
      icon: (
        <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      bgGradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      accentColor: 'text-purple-600',
      features: [
        'Parent Photo Combination',
        'High-Quality AI Images',
        'Multiple Style Options'
      ],
      href: '/ai-baby-generator',
      buttonText: 'Explore Baby Generator',
      imagePlaceholder: '/api/placeholder/400/300' // 预留图片位置
    },
    {
      id: 'ai-baby-podcast',
      title: 'AI Baby Podcast Generator',
      description: 'Create viral baby podcast videos with AI-generated hosts, advanced animation, and voice technology. Perfect for TikTok and YouTube Shorts.',
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      bgGradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      accentColor: 'text-blue-600',
      features: [
        'AI-Generated Baby Hosts',
        'Advanced Animation Technology',
        'Viral Content Creation'
      ],
      href: '/ai-baby-podcast',
      buttonText: 'Explore Podcast Generator',
      imagePlaceholder: '/api/placeholder/400/300' // 预留图片位置
    },
    {
      id: 'face-to-many-kontext',
      title: 'Face-to-Many-Kontext',
      description: 'Transform faces into multiple contexts and styles. Advanced AI face manipulation and style transfer technology.',
      icon: (
        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      bgGradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      accentColor: 'text-green-600',
      features: [
        'Face Style Transfer',
        'Multiple Context Options',
        'Advanced AI Processing'
      ],
      href: '/face-to-many-kontext',
      buttonText: 'Explore Face Kontext',
      imagePlaceholder: '/api/placeholder/400/300' // 预留图片位置
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50"
         style={{backgroundImage: 'url(/background.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
                <span className="text-blue-600">Vogue AI</span> Creative Suite
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover powerful AI tools designed to revolutionize your content creation.
                From baby podcasts to image generation, unleash your creativity with cutting-edge AI technology.
              </p>

              {/* Create Now Button */}
              <div className="mb-8">
                <Link
                  href="/ai-baby-generator"
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:from-purple-700 hover:to-purple-800"
                >
                  <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Now
                  <svg className="ml-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AI Tools Sections - Each tool gets its own full section */}
        {aiTools.map((tool, index) => (
          <section
            key={tool.id}
            className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} relative overflow-hidden`}
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${tool.bgGradient} rounded-full opacity-5`}></div>
              <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br ${tool.bgGradient} rounded-full opacity-5`}></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-center min-h-[600px]">
                {/* Content Side */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12 lg:order-2'}`}>
                  {/* Section Number */}
                  <div className="flex items-center mb-6">
                    <span className={`text-6xl font-bold ${tool.accentColor} opacity-20 mr-4`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className={`w-16 h-1 bg-gradient-to-r ${tool.bgGradient} rounded-full`}></div>
                  </div>

                  {/* Title and Icon */}
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tool.bgGradient} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                      {tool.icon}
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">{tool.title}</h2>
                  </div>

                  {/* Description */}
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-4 mb-10">
                    {tool.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center group">
                        <div className={`w-10 h-10 bg-gradient-to-br ${tool.bgGradient} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-lg text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div>
                    <Link
                      href={tool.href}
                      className={`inline-flex items-center ${tool.buttonColor} text-white font-semibold px-10 py-5 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105`}
                    >
                      {tool.buttonText}
                      <svg className="ml-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Image/Visual Side */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12 lg:order-1'} mt-12 lg:mt-0`}>
                  <div className="relative">
                    {/* Main Image Container */}
                    <div className={`relative bg-gradient-to-br ${tool.bgGradient} rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
                      {/* Image Placeholder */}
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                          <div className={`w-24 h-24 bg-gradient-to-br ${tool.bgGradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                            {tool.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Preview</h3>
                          <p className="text-gray-600">High-quality screenshots and demos coming soon</p>
                          <div className="mt-6 grid grid-cols-3 gap-4">
                            <div className={`h-16 ${tool.bgColor} rounded-lg`}></div>
                            <div className={`h-16 ${tool.bgColor} rounded-lg`}></div>
                            <div className={`h-16 ${tool.bgColor} rounded-lg`}></div>
                          </div>
                        </div>
                      </div>

                      {/* Floating Elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/30 rounded-full"></div>
                      <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/20 rounded-full"></div>
                    </div>

                    {/* Background Decoration */}
                    <div className={`absolute -inset-4 bg-gradient-to-br ${tool.bgGradient} rounded-3xl opacity-10 -z-10`}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Unified Platform Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Unified AI Platform</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                All tools use the same account and credit system. Start with any tool and explore others seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Unified Account</h3>
                <p className="text-gray-600">One account for all AI tools. Seamless experience across all platforms.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Shared Credits</h3>
                <p className="text-gray-600">Credits work across all tools. Buy once, use everywhere.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Switch</h3>
                <p className="text-gray-600">Easy navigation between tools. Switch contexts instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Join thousands of creators who are already using our AI tools to create amazing content.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  href="/pricing"
                  className="inline-block bg-blue-600 text-white font-semibold px-10 py-5 rounded-2xl text-lg text-center hover:bg-blue-700 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  View Pricing Plans
                </Link>
                <Link
                  href="/login"
                  className="inline-block bg-white text-blue-600 border-2 border-blue-600 font-semibold px-10 py-5 rounded-2xl text-lg text-center hover:bg-blue-50 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

