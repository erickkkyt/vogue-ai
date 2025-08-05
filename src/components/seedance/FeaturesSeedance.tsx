'use client';

export default function FeaturesSeedance() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            What is Seedance?
          </h2>
          <div className="text-lg text-gray-300 max-w-3xl mx-auto">
            <p>
              ByteDance's revolutionary AI model for <span className="text-cyan-400 font-medium">multi-shot video creation</span> from text and images.
              Breakthrough <span className="text-cyan-400 font-medium">semantic understanding</span> delivers 1080p videos with cinematic quality.
            </p>
          </div>
        </div>

        {/* Seedance Core Capabilities */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Smooth & Stable Motion */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Smooth & Stable Motion</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Wide dynamic range enabling smooth generation of large-scale movements. Maintains high stability and physical realism across all scene types.
              </p>
            </div>

            {/* Native Multi-Shot Storytelling */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Multi-Shot Storytelling</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Native support for narrative videos with multiple cohesive shots. Maintains consistency in subject, visual style, and atmosphere across transitions.
              </p>
            </div>

            {/* Diverse Stylistic Expression */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Diverse Stylistic Expression</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                From photorealism to illustration, accurately interprets diverse stylistic prompts to support a wide range of creative needs.
              </p>
            </div>

            {/* Precise Prompt Following */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Precise Prompt Following</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Accurately parses natural language prompts, enabling stable control over multi-agent interactions and complex action sequences.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Achievements */}
        <div className="bg-gray-800/50 rounded-3xl p-12 mt-20 border border-gray-700">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-6 text-center hover:bg-gray-850 transition-all duration-300 group border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1080p Quality</h3>
              <p className="text-gray-300 text-sm leading-relaxed">High-definition videos with smooth motion and cinematic aesthetics</p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 text-center hover:bg-gray-850 transition-all duration-300 group border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Dual Input Modes</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Text-to-video and image-to-video generation with advanced AI</p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 text-center hover:bg-gray-850 transition-all duration-300 group border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 011 1v1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ByteDance Technology</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Powered by cutting-edge AI research and breakthrough innovations</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-12 max-w-4xl mx-auto border border-gray-700">
            <h3 className="text-3xl font-bold text-white mb-4">
              Experience Seedance Technology
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Discover ByteDance's breakthrough AI video generation with multi-shot storytelling and cinematic quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#dashboard"
                className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Creating Now
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-700 font-medium py-4 px-8 rounded-xl transition-all duration-300"
              >
                View All Plans
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
