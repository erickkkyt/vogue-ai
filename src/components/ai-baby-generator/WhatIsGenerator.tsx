'use client';

import { AI_BABY_GENERATOR_MEDIA } from '../../config/media';

export default function WhatIsGenerator() {
  return (
    <section id="whatIs" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            What Is AI Baby Generator?
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
            AI Baby Generator uses advanced artificial intelligence to predict what your future baby might look like by combining facial features from both parents. Our cutting-edge technology analyzes facial structures, genetics patterns, and creates realistic baby images that capture the essence of both parents.
          </p>
        </div>

        {/* Interactive Demo Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-gray-600">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-500 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400 rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="grid md:grid-cols-3 gap-8 items-center mb-12">
                {/* Parent 1 */}
                <div className="text-center group">
                  <div className="relative">
                    {/* Parent 1 Example Image */}
                    <div className="w-72 h-72 mx-auto mb-4">
                      <img
                        src={AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Demo}
                        alt="Parent 1 Example"
                        className="w-full h-full rounded-full object-cover object-top border-4 border-blue-500/50 shadow-lg"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Parent 1</h3>
                </div>

                {/* AI Magic Center */}
                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                      <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping opacity-30"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-pink-400 animate-ping opacity-40 animation-delay-300"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Magic</h3>
                  <p className="text-gray-300 loading-dots">Processing</p>

                  {/* Arrow Down */}
                  <div className="mt-6 flex justify-center">
                    <svg className="w-8 h-8 text-purple-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>

                {/* Parent 2 */}
                <div className="text-center group">
                  <div className="relative">
                    {/* Parent 2 Example Image */}
                    <div className="w-72 h-72 mx-auto mb-4">
                      <img
                        src={AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Demo}
                        alt="Parent 2 Example"
                        className="w-full h-full rounded-full object-cover object-top border-4 border-pink-500/50 shadow-lg"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Parent 2</h3>
                </div>
              </div>

              {/* Result Section */}
              <div className="text-center">
                <div className="relative inline-block">
                  {/* Baby Result Example Image */}
                  <div className="w-72 h-72 mx-auto mb-4">
                    <img
                      src={AI_BABY_GENERATOR_MEDIA.examples.babies.babyDemo}
                      alt="Generated Baby Example"
                      className="w-full h-full rounded-full object-cover object-[center_20%] border-4 border-purple-500/50 shadow-2xl"
                    />
                  </div>



                  {/* Sparkle effects */}
                  <div className="absolute -top-4 -left-4 text-yellow-400 animate-ping">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-3.01L12 0z"/>
                    </svg>
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-yellow-400 animate-ping animation-delay-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-3.01L12 0z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Your Future Baby</h3>
                <p className="text-gray-300">AI-generated prediction</p>


              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-900/50 border border-purple-700 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Advanced AI Technology</h3>
            <p className="text-gray-300">Our AI analyzes thousands of facial features to create the most accurate baby predictions possible.</p>
          </div>

          <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-900/50 border border-purple-700 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Privacy First</h3>
            <p className="text-gray-300">Your photos are processed securely and automatically deleted after generation. Your privacy is our priority.</p>
          </div>

          <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-900/50 border border-purple-700 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Instant Results</h3>
            <p className="text-gray-300">Get your baby predictions in seconds. No waiting, no delays - just instant AI-powered results.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
