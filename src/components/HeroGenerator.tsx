'use client';

import Link from 'next/link';
import StarBorder from './StarBorder';
import { AI_BABY_GENERATOR_MEDIA } from '../config/media';
import { VideoLink } from './MediaLink';

export default function HeroGenerator() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
              Free AI Baby Generator:<br />
              <span className="text-purple-600">See Your Future Baby In One Click</span>
            </h1>

            <div className="space-y-4 mb-8 text-gray-700">
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
                href="/ai-baby-generator"
                color="rgba(147, 51, 234, 0.8)"
                speed="4s"
                className="text-lg font-bold text-center no-underline"
              >
                Meet Your Baby Now
              </StarBorder>
            </div>

            <p className="text-gray-600">
              Already joined us? <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">Log in</Link>
            </p>
          </div>

          {/* Right Column: Interactive Demo */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Main Demo Container */}
              <div className="w-96 h-96 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Hero Demo Video Link */}
                <VideoLink
                  src={AI_BABY_GENERATOR_MEDIA.hero.demoVideo}
                  alt="Baby Generation Demo Video"
                  title="Hero Demo Video"
                  width={384}
                  height={384}
                  className="w-full h-full"
                />
              </div>

              {/* Floating Animation Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-200 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-200 rounded-full animate-pulse"></div>
              <div className="absolute top-1/4 -left-6 w-6 h-6 bg-purple-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/4 -right-6 w-6 h-6 bg-pink-300 rounded-full animate-bounce delay-300"></div>

              {/* Floating Hearts */}
              <div className="absolute top-8 left-8 text-purple-400 animate-float">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div className="absolute bottom-8 right-8 text-pink-400 animate-float delay-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>

            {/* Success Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-purple-600">12K+</div>
                <div className="text-sm text-gray-600">Happy Families</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-pink-600">98%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-purple-600">3s</div>
                <div className="text-sm text-gray-600">Generation Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
