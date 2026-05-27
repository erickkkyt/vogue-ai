'use client';

import Link from 'next/link';
import StarBorder from '../common/StarBorder';
import { AI_BABY_PODCAST_MEDIA } from '../../config/media';
import { VideoLink } from '../common/MediaLink';

export default function Hero() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-[var(--vogue-page)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:space-x-12 gap-8">
          {/* Left Column: Demo Video - 调整宽度比例，让视频稍微左移 */}
          <div className="xl:w-2/5 flex flex-col items-center justify-center xl:pl-0 xl:-ml-16">
            <div className="relative group w-full max-w-sm mx-auto xl:mx-0">
              {/* Featured Video Badge - 居中对齐视频，减小下边距 */}
              <div className="mb-4 flex justify-center xl:mx-0 w-full">
                <div className="inline-flex items-center px-6 py-2 bg-blue-50 rounded-full text-blue-700 font-medium shadow-[0_12px_30px_rgba(72,92,130,0.1)] animate-pulse text-sm border border-blue-100 whitespace-nowrap min-w-[340px]">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
                  </svg>
                  Popular BabyPodcast example with 3.6M views
                </div>
              </div>

              {/* Main Video Container */}
              <div className="relative flex justify-center">
                {/* Hero Podcast Video */}
                <div className="w-72 aspect-[9/16] rounded-2xl shadow-[0_18px_46px_rgba(72,92,130,0.12)] overflow-hidden border-4 border-slate-200 video-container-hover">
                  <VideoLink
                    src={AI_BABY_PODCAST_MEDIA.hero.featuredVideo}
                    alt="Featured Baby Podcast Video"
                    title="Featured Video"
                    width={320}
                    height={568}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Elements - 调整位置 */}
                <div className="absolute -top-2 -right-3 w-8 h-8 bg-blue-500/30 rounded-full floating-element"></div>
                <div className="absolute -bottom-2 -left-3 w-12 h-12 bg-cyan-500/30 rounded-full floating-element"></div>
                <div className="absolute top-1/3 -left-8 w-6 h-6 bg-blue-400/30 rounded-full floating-element"></div>
                <div className="absolute bottom-1/3 -right-8 w-6 h-6 bg-cyan-400/30 rounded-full floating-element"></div>

                {/* Floating Icons */}
                <div className="absolute top-8 left-8 text-blue-400 animate-float">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                  </svg>
                </div>
                <div className="absolute bottom-8 right-8 text-cyan-400 animate-float delay-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>

              {/* Success Stats - 调整宽度确保文本单行显示 */}
              <div className="mt-6 flex justify-center w-full">
                <div className="flex justify-center w-[500px] sm:w-[540px] gap-3">
                  <div className="flex-1 min-w-[140px] bg-white/78 backdrop-blur-sm rounded-lg py-2 px-4 shadow-[0_12px_30px_rgba(72,92,130,0.1)] border border-slate-200 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold text-blue-400">5K+</div>
                    <div className="text-xs text-slate-500 text-center whitespace-nowrap">Creators</div>
                  </div>
                  <div className="flex-1 min-w-[140px] bg-white/78 backdrop-blur-sm rounded-lg py-2 px-4 shadow-[0_12px_30px_rgba(72,92,130,0.1)] border border-slate-200 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold text-cyan-400">10K+</div>
                    <div className="text-xs text-slate-500 text-center whitespace-nowrap">Videos Created</div>
                  </div>
                  <div className="flex-1 min-w-[140px] bg-white/78 backdrop-blur-sm rounded-lg py-2 px-4 shadow-[0_12px_30px_rgba(72,92,130,0.1)] border border-slate-200 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold text-blue-400">2min</div>
                    <div className="text-xs text-slate-500 text-center whitespace-nowrap">Generation Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title and Content - 增加宽度比例，减少左边距 */}
          <div className="xl:w-3/5 mb-8 xl:mb-0 xl:pl-12 xl:pr-8 xl:-mr-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-extrabold leading-tight mb-6">
              <span className="text-blue-400">AI Baby Podcast Generator</span>
              <br />
              <span className="text-slate-950">Create Viral Videos Fast</span>
            </h2>


            <p className="text-lg xl:text-xl text-slate-600 mb-8 leading-relaxed">
              Learn how to create, optimize, and monetize the latest viral trend taking TikTok and YouTube Shorts by storm. Join thousands of creators making AI baby videos that generate millions of views!
            </p>

            <div className="space-y-4 mb-8 text-slate-600">
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
                href="#dashboard"
                color="rgba(37, 99, 235, 0.8)"
                speed="4s"
                className="text-lg font-bold text-center no-underline"
              >
                Start Creating Now
              </StarBorder>
              <StarBorder
                as={Link}
                href="#whatIs"
                color="rgba(37, 99, 235, 0.6)"
                speed="6s"
                className="text-center font-medium no-underline"
              >
                See Examples
              </StarBorder>
            </div>

            <p className="text-slate-500">
              Already joined us? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}