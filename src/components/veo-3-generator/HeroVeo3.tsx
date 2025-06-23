'use client';

import Link from 'next/link';
import StarBorder from '../common/StarBorder';

export default function HeroVeo3() {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/api/placeholder/1920/1080"
        >
          <source src="https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/veo%E9%A6%96%E9%A1%B5%E5%9B%BE.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>

        {/* Sophisticated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap drop-shadow-lg">Vogue Veo 3 Generator</span><br />
              <span className="text-gray-100 drop-shadow-lg text-2xl sm:text-3xl md:text-4xl">SOTA Model - Cheapest Access</span>
            </h2>


            <div className="space-y-4 mb-8 text-gray-100">
              <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <span className="font-medium drop-shadow-lg">State-of-the-Art Video Generation Technology</span>
              </div>

              <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <span className="drop-shadow-lg">Create TikTok Viral AI Bigfoot-Style Content</span>
              </div>

              <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="drop-shadow-lg">Unbeatable Pricing - Cheaper Than Most Competitors</span>
              </div>

              <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="drop-shadow-lg">No need for $249.99 - start your Veo 3 journey for just $19.99</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <StarBorder
                as={Link}
                href="#dashboard"
                color="rgba(99, 102, 241, 0.8)"
                speed="4s"
                className="text-lg font-bold text-center no-underline"
              >
                Start Creating Now
              </StarBorder>
              <StarBorder
                as={Link}
                href="#viral-videos"
                color="rgba(139, 92, 246, 0.6)"
                speed="6s"
                className="text-center font-medium no-underline"
              >
                Gallery
              </StarBorder>
              <StarBorder
                as={Link}
                href="#pricing"
                color="rgba(168, 85, 247, 0.6)"
                speed="5s"
                className="text-center font-medium no-underline"
              >
                Price Comparison
              </StarBorder>
            </div>


          </div>

          {/* Right Column: Video Showcase */}
          <div className="lg:w-1/2 flex items-center justify-center">
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
        </div>
      </div>
    </section>
  );
}
