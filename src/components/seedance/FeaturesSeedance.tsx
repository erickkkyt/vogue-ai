'use client';

export default function FeaturesSeedance() {
  return (
    <section id="pricing" className="relative py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-6 py-2 mb-8">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-blue-300 text-sm font-medium">ByteDance Technology</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What is <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Seedance</span>?
          </h2>

          <div className="max-w-6xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 whitespace-nowrap overflow-hidden text-ellipsis">
              ByteDance's revolutionary AI model for <span className="text-cyan-400 font-semibold">multi-shot video creation</span> from text and images.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">
              Breakthrough <span className="text-purple-400 font-medium">semantic understanding</span> delivers 1080p videos with cinematic quality and unprecedented creative control.
            </p>
          </div>
        </div>

        {/* Seedance Core Capabilities */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Smooth & Stable Motion */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-10 hover:border-cyan-500/30 transition-all duration-500 group-hover:transform group-hover:scale-[1.02]">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">Smooth & Stable Motion</h3>
                    <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">
                      Wide dynamic range enabling smooth generation of large-scale movements. Maintains high stability and physical realism across all scene types.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Native Multi-Shot Storytelling */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-10 hover:border-purple-500/30 transition-all duration-500 group-hover:transform group-hover:scale-[1.02]">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">Multi-Shot Storytelling</h3>
                    <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">
                      Native support for narrative videos with multiple cohesive shots. Maintains consistency in subject, visual style, and atmosphere across transitions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Diverse Stylistic Expression */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-10 hover:border-emerald-500/30 transition-all duration-500 group-hover:transform group-hover:scale-[1.02]">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300">Diverse Stylistic Expression</h3>
                    <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">
                      From photorealism to illustration, accurately interprets diverse stylistic prompts to support a wide range of creative needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Precise Prompt Following */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-10 hover:border-orange-500/30 transition-all duration-500 group-hover:transform group-hover:scale-[1.02]">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/25">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-orange-300 transition-colors duration-300">Precise Prompt Following</h3>
                    <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">
                      Accurately parses natural language prompts, enabling stable control over multi-agent interactions and complex action sequences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>




      </div>
    </section>
  );
}
