import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import BabyGeneratorGallery from '@/components/home/BabyGeneratorGallery';
import BabyPodcastGallery from '@/components/home/BabyPodcastGallery';
import StarBorder from '@/components/common/StarBorder';

const newTitle = "Vogue AI: Create Unique AI Baby Pictures&Videos";

export const metadata: Metadata = {
  title: newTitle,
  description: 'Discover three powerful AI tools under Vogue AI: AI Baby Podcast Generator, AI Baby Generator, and Face-to-Many-Kontext. Create amazing content with cutting-edge AI technology.',
  alternates: {
    canonical: 'https://www.vogueai.net',
  },
  openGraph: {
    title: newTitle,
    description: 'Discover three powerful AI tools under Vogue AI: AI Baby Podcast Generator, AI Baby Generator, and Face-to-Many-Kontext. Create amazing content with cutting-edge AI technology.',
    url: 'https://www.vogueai.net',
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
      id: 'veo-3-generator',
      title: 'Vogue Veo 3 Generator',
      subtitle: 'SOTA Model - Cheapest Access',
      description: 'Create professional AI videos with Google\'s most advanced Veo 3 technology. Generate viral content with synchronized audio at unbeatable prices.',
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      bgGradient: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50',
      buttonColor: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
      accentColor: 'text-blue-400',
      features: [
        'State-of-the-Art Video Generation Technology',
        'Create TikTok Viral AI Bigfoot-Style Content',
        'Unbeatable Pricing - Cheaper Than Most Competitors',
        'No need for $249.99 - start your Veo 3 journey for just $19.99'
      ],
      href: '/veo-3-generator',
      buttonText: 'Start Creating Now',
      imagePlaceholder: '/api/placeholder/400/300' // 预留图片位置
    },
    {
      id: 'ai-baby-generator',
      title: 'Free AI Baby Generator',
      subtitle: 'See Your Future Baby In One Click',
      description: 'Ultra-realistic baby photos delivered almost instantly. #1 Baby Generator powered by newly released AI.',
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      bgGradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      accentColor: 'text-purple-600',
      features: [
        '#1 Baby Generator powered by newly released AI',
        'Ultra-realistic baby photos delivered almost instantly',
        '12,000+ photos delivered to 3000+ families'
      ],
      href: '/ai-baby-generator',
      buttonText: 'Meet Your Baby Now',
      imagePlaceholder: '/api/placeholder/400/300' // 预留图片位置
    },
    {
      id: 'ai-baby-podcast',
      title: 'AI Baby Podcast Generator',
      subtitle: 'Create Viral Content',
      description: 'Learn how to create, optimize, and monetize the latest viral trend taking TikTok and YouTube Shorts by storm. Join thousands of creators making AI baby videos that generate millions of views!',
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      bgGradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      accentColor: 'text-blue-600',
      features: [
        '#1 AI Baby Podcast Generator with 4-AI Engine',
        'Professional videos delivered in 2-3 minutes',
        '10,000+ viral videos created by 5000+ creators'
      ],
      href: '/ai-baby-podcast',
      buttonText: 'Start Creating Now',
      secondaryButtonText: 'See Examples',
      imagePlaceholder: '/api/placeholder/400/300' // 预留图片位置
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900"
         style={{backgroundImage: 'url(/background.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-6">
                <span className="text-blue-400">Vogue AI</span> Creative Suite
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Discover powerful AI tools designed to revolutionize your content creation.
                From image/audio to video generation, unleash creativity with cutting-edge AI.
              </p>

              {/* Create Now Button */}
              <div className="mb-8">
                <Link
                  href="/ai-baby-generator"
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:from-purple-700 hover:to-purple-800 border border-purple-500"
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
            className={`py-20 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} relative overflow-hidden`}
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
                  {/* AI Baby Generator 使用专门的布局 */}
                  {tool.id === 'ai-baby-generator' ? (
                    <>
                      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-6">
                        Free AI Baby Generator:<br />
                        <span className="text-purple-400">See Your Future Baby In One Click</span>
                      </h1>

                      <div className="space-y-4 mb-8 text-gray-300">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🏆</span>
                          <span className="font-medium">#1 Baby Generator powered by newly released AI</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xl">⚡️</span>
                          <span>Ultra-realistic baby photos delivered almost instantly</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xl">👶</span>
                          <span>12,000+ photos delivered to 3000+ families</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                        <StarBorder
                          as={Link}
                          href="/ai-baby-generator#dashboard"
                          color="rgba(147, 51, 234, 0.8)"
                          speed="4s"
                          className="text-lg font-bold text-center no-underline"
                        >
                          Meet Your Baby Now
                        </StarBorder>
                      </div>

                      <p className="text-gray-400">
                        Already joined us? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Log in</Link>
                      </p>
                    </>
                  ) : tool.id === 'ai-baby-podcast' ? (
                    <>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-white mb-6">
                        <span className="text-blue-400">AI Baby Podcast Generator</span><br />
                        <span className="text-gray-300">Create Viral Content</span>
                      </h1>
                      <p className="text-lg xl:text-xl text-gray-300 mb-8 max-w-2xl">
                        Learn how to create, optimize, and monetize the latest viral trend taking TikTok and YouTube Shorts by storm. Join thousands of creators making AI baby videos that generate millions of views!
                      </p>

                      <div className="space-y-4 mb-8 text-gray-300">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🎬</span>
                          <span className="font-medium">#1 AI Baby Podcast Generator with 4-AI Engine</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xl">⚡️</span>
                          <span>Professional videos delivered in 2-3 minutes</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xl">🔥</span>
                          <span>10,000+ viral videos created by 5000+ creators</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                        <StarBorder
                          as={Link}
                          href="/ai-baby-podcast"
                          color="rgba(37, 99, 235, 0.8)"
                          speed="4s"
                          className="text-lg font-bold text-center no-underline"
                        >
                          Start Creating Now
                        </StarBorder>
                      </div>

                      <p className="text-gray-400">
                        Already joined us? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Log in</Link>
                      </p>
                    </>
                  ) : tool.id === 'veo-3-generator' ? (
                    <>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-6">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Vogue Veo 3 Generator</span><br />
                        <span className="text-gray-100 text-2xl sm:text-3xl md:text-4xl">SOTA Model - Cheapest Access</span>
                      </h1>

                      <div className="space-y-4 mb-8 text-gray-100">
                        <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <span className="font-medium">State-of-the-Art Video Generation Technology</span>
                        </div>

                        <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                          </div>
                          <span>Create TikTok Viral AI Bigfoot-Style Content</span>
                        </div>

                        <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <span>Unbeatable Pricing - Cheaper Than Most Competitors</span>
                        </div>

                        <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <span>No need for $249.99 - start your Veo 3 journey for just $19.99</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                        <StarBorder
                          as={Link}
                          href="/veo-3-generator#dashboard"
                          color="rgba(99, 102, 241, 0.8)"
                          speed="4s"
                          className="text-lg font-bold text-center no-underline"
                        >
                          Start Creating Now
                        </StarBorder>
                        <StarBorder
                          as={Link}
                          href="/veo-3-generator#viral-videos"
                          color="rgba(139, 92, 246, 0.6)"
                          speed="6s"
                          className="text-center font-medium no-underline"
                        >
                          Gallery
                        </StarBorder>
                        <StarBorder
                          as={Link}
                          href="/veo-3-generator#pricing"
                          color="rgba(168, 85, 247, 0.6)"
                          speed="5s"
                          className="text-center font-medium no-underline"
                        >
                          Price Comparison
                        </StarBorder>
                      </div>

                      <p className="text-gray-400">
                        Already joined us? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Log in</Link>
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Section Number and Title */}
                      <div className="flex items-center mb-6">
                        <div className={`bg-gradient-to-br ${tool.bgGradient} rounded-xl px-4 py-2 mr-4 shadow-lg`}>
                          <span className="text-2xl font-bold text-white">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-3xl lg:text-4xl font-bold text-white">{tool.title}</h2>
                          {tool.subtitle && (
                            <h3 className={`text-xl lg:text-2xl font-semibold ${tool.accentColor} mt-1`}>
                              {tool.subtitle}
                            </h3>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
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
                            <span className="text-lg text-gray-300 font-medium">{feature}</span>
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
                    </>
                  )}
                </div>

                {/* Image/Visual Side */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12 lg:order-1'} mt-12 lg:mt-0`}>
                  {/* AI Baby Generator 使用专门的画廊组件 */}
                  {tool.id === 'ai-baby-generator' ? (
                    <div className="flex flex-col items-center justify-center">
                      <BabyGeneratorGallery />
                    </div>
                  ) : tool.id === 'ai-baby-podcast' ? (
                    <div className="flex flex-col items-center justify-center">
                      <BabyPodcastGallery />
                    </div>
                  ) : tool.id === 'veo-3-generator' ? (
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        {/* Main Video Container - Enlarged */}
                        <div className="w-[500px] h-[500px] rounded-3xl shadow-2xl overflow-hidden relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600/30 backdrop-blur-lg">
                          {/* Actual Video */}
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            poster="/api/placeholder/500/500"
                          >
                            <source src="https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/%E9%A6%96%E5%9B%BE%E5%B1%95%E7%A4%BA.mp4" type="video/mp4" />
                          </video>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      {/* Main Media Container */}
                      <div className="relative bg-gray-800/90 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md hover:shadow-3xl transition-all duration-300">
                        {/* Media Content Area */}
                        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                          {/* Placeholder for future media */}
                          <div className="text-center p-8">
                            <div className={`w-20 h-20 bg-gradient-to-br ${tool.bgGradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              {tool.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                            <p className="text-gray-400 text-sm">Demo Video/Screenshot</p>
                          </div>

                          {/* Play Button Overlay (for future videos) */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Media Info Bar */}
                        <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 bg-gradient-to-r ${tool.bgGradient} rounded-full animate-pulse`}></div>
                              <span className="text-sm text-gray-300">Live Preview</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-400">HD Quality</span>
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Floating Accent Elements */}
                      <div className={`absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br ${tool.bgGradient} rounded-full opacity-80 animate-bounce`}></div>
                      <div className={`absolute -bottom-3 -left-3 w-4 h-4 bg-gradient-to-br ${tool.bgGradient} rounded-full opacity-60 animate-pulse`}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Unified Platform Section */}
        <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Unified AI Image & Video Platform</h2>
              <p className="text-xl text-gray-300 max-w-5xl mx-auto">
                All tools use the same account and credit system. Start with any tool and explore others seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-10 shadow-lg text-center hover:shadow-xl hover:border-gray-600 transition-all duration-300 backdrop-blur-md">
                <div className="w-16 h-16 bg-blue-900/50 border border-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Unified Account</h3>
                <p className="text-gray-300 leading-relaxed">One account for all AI tools. Seamless experience across all platforms.</p>
              </div>

              <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-10 shadow-lg text-center hover:shadow-xl hover:border-gray-600 transition-all duration-300 backdrop-blur-md">
                <div className="w-16 h-16 bg-purple-900/50 border border-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Shared Credits</h3>
                <p className="text-gray-300 leading-relaxed">Credits work across all tools. Buy once, use everywhere.</p>
              </div>

              <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-10 shadow-lg text-center hover:shadow-xl hover:border-gray-600 transition-all duration-300 backdrop-blur-md">
                <div className="w-16 h-16 bg-green-900/50 border border-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Seamless Switch</h3>
                <p className="text-gray-300 leading-relaxed">Easy navigation between tools. Switch contexts instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join thousands of creators who are already using our AI tools to create amazing content.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  href="/pricing"
                  className="inline-block bg-blue-600 text-white font-semibold px-10 py-5 rounded-2xl text-lg text-center hover:bg-blue-700 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105 border border-blue-500"
                >
                  View Pricing Plans
                </Link>
                <Link
                  href="/veo-3-generator"
                  className="inline-block bg-gray-700 text-blue-400 border-2 border-blue-600 font-semibold px-10 py-5 rounded-2xl text-lg text-center hover:bg-gray-600 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105"
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

