'use client';

import Link from 'next/link';
import StarBorder from './StarBorder';
import { FACE_TO_MANY_KONTEXT_MEDIA } from '../config/media';
import { VideoLink } from './MediaLink';

export default function HeroKontext() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-6">
              <span className="text-green-400 whitespace-nowrap">Face-to-Many-Kontext</span><br />
              <span className="text-gray-300">AI Face Transformation</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Transform any face into multiple contexts and styles using cutting-edge AI technology.
              From artistic styles to different ages, explore endless possibilities with our revolutionary face transformation engine.
            </p>

            <div className="space-y-4 mb-8 text-gray-300">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎨</span>
                <span className="font-medium">#1 AI Face Transformation with Multi-Style Engine</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xl">⚡️</span>
                <span>Professional transformations in seconds</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xl">🔮</span>
                <span>Unlimited creative possibilities with advanced AI</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <StarBorder
                as={Link}
                href="/face-to-many-kontext"
                color="rgba(34, 197, 94, 0.8)"
                speed="4s"
                className="text-lg font-bold text-center no-underline"
              >
                Start Transforming
              </StarBorder>
              <StarBorder
                as={Link}
                href="#features"
                color="rgba(34, 197, 94, 0.6)"
                speed="6s"
                className="text-center font-medium no-underline"
              >
                Learn More
              </StarBorder>
            </div>

            <p className="text-gray-400">
              Coming soon! <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">Join waitlist</Link>
            </p>
          </div>

          {/* Right Column: Interactive Demo */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Main Demo Container */}
              <div className="w-96 h-96 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Hero Transformation Demo Video */}
                <VideoLink
                  src={FACE_TO_MANY_KONTEXT_MEDIA.hero.transformationDemo}
                  alt="Face Transformation Demo Video"
                  title="Transformation Demo"
                  width={384}
                  height={384}
                  className="w-full h-full"
                />
              </div>

              {/* Floating Animation Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-200 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-teal-200 rounded-full animate-pulse"></div>
              <div className="absolute top-1/4 -left-6 w-6 h-6 bg-green-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/4 -right-6 w-6 h-6 bg-teal-300 rounded-full animate-bounce delay-300"></div>

              {/* Floating Icons */}
              <div className="absolute top-8 left-8 text-green-400 animate-float">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                </svg>
              </div>
              <div className="absolute bottom-8 right-8 text-teal-400 animate-float delay-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v3m0 0v8a1 1 0 001 1h3M7 4h10M5 8h14M5 8V5a1 1 0 011-1h2a1 1 0 011 1v3"/>
                </svg>
              </div>
            </div>

            {/* Coming Soon Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-green-400">∞</div>
                <div className="text-sm text-gray-300">Styles</div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-teal-400">AI</div>
                <div className="text-sm text-gray-300">Powered</div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-green-400">Soon</div>
                <div className="text-sm text-gray-300">Coming</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
