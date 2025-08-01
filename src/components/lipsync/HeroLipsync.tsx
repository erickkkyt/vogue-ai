'use client';

import Link from 'next/link';
import StarBorder from '../common/StarBorder';

export default function HeroLipsync() {
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
        >
          <source src="https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-2.webm" type="video/webm" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[600px]">
          {/* Left Column: Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <span className="text-orange-400 text-sm font-medium">🎤 Free AI Lip Sync Video Generator</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-600 bg-clip-text text-transparent">
                Free AI Lip Sync
              </span>
              <br />
              <span className="text-white">Generator</span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Just upload your audio and video, and AI will automatically match your lips for smooth, natural lip syncing. Create high-quality lip-synced videos in minutes.
            </p>

            {/* Features List */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center text-orange-400">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Completely Free</span>
              </div>
              <div className="flex items-center text-pink-400">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Efficient</span>
              </div>
              <div className="flex items-center text-red-400">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">No Production Required</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#dashboard"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Create Free AI Lip Sync Videos
              </a>
              
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border-2 border-white/30 hover:border-white/50 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:bg-white/10 backdrop-blur-sm text-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                View Pricing
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-gray-700/50">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-gray-400">
                <div className="flex items-center">
                  <StarBorder className="text-yellow-400 mr-1" />
                  <StarBorder className="text-yellow-400 mr-1" />
                  <StarBorder className="text-yellow-400 mr-1" />
                  <StarBorder className="text-yellow-400 mr-1" />
                  <StarBorder className="text-yellow-400 mr-2" />
                  <span className="text-sm">4.9/5 from 1000+ users</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No monthly limits
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Credit-based pricing
                </div>
              </div>
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
                >
                  <source src="https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-1.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
