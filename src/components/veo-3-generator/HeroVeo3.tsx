'use client';

import Link from 'next/link';
import StarBorder from '../common/StarBorder';

export default function HeroVeo3() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-6">
              <span className="text-green-400 whitespace-nowrap">Veo 3 Generator</span><br />
              <span className="text-gray-300">AI Video with Audio</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              The <span className="text-green-400 font-semibold">cheapest Veo 3 generator</span> with <span className="text-green-400 font-semibold">no monthly limits</span> - unlike Google's official restrictions.
              Generate as many videos as you want with just credits.
            </p>

            <div className="space-y-4 mb-8 text-gray-300">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💰</span>
                <span className="font-medium">Cheapest Veo 3 Access Available</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xl">🚫</span>
                <span>No Monthly Limits (Unlike Google Official)</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xl">🔊</span>
                <span>Synchronized sound effects and dialogue</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xl">⚡️</span>
                <span>Professional videos in seconds</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xl">🎯</span>
                <span>Physics-based realistic motion</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <StarBorder
                as={Link}
                href="#dashboard"
                color="rgba(34, 197, 94, 0.8)"
                speed="4s"
                className="text-lg font-bold text-center no-underline"
              >
                Start Creating Now
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

            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Live & Ready</span>
              </div>
              <span className="text-gray-600">•</span>
              <span className="text-sm">Powered by Google Veo 3</span>
            </div>
          </div>

          {/* Right Column: Interactive Demo */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Main Demo Container */}
              <div className="w-96 h-96 rounded-3xl shadow-2xl overflow-hidden relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                {/* Demo Video Placeholder */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <div className="text-white font-bold text-xl mb-2">Veo 3 Demo</div>
                    <div className="text-gray-300 text-sm">Video with Audio Generation</div>
                  </div>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-green-500/80 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating Animation Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-200 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-teal-200 rounded-full animate-pulse"></div>
              <div className="absolute top-1/4 -left-6 w-6 h-6 bg-green-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/4 -right-6 w-6 h-6 bg-teal-300 rounded-full animate-bounce delay-300"></div>

              {/* Floating Icons */}
              <div className="absolute top-8 left-8 text-green-400 animate-float">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="absolute bottom-8 right-8 text-teal-400 animate-float delay-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>

            {/* Feature Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-green-400">8s</div>
                <div className="text-sm text-gray-300">Video Length</div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-teal-400">HD</div>
                <div className="text-sm text-gray-300">Quality</div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-green-400">🔊</div>
                <div className="text-sm text-gray-300">With Audio</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
