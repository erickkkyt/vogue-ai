'use client';

import { DollarSign, Zap, Music, Upload, Sparkles, Download, ArrowRight, CheckCircle } from 'lucide-react';

export default function LipsyncCoreFeatures() {
  const coreFeatures = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Completely Free",
      description: "Use our AI Lip Sync tool for free. Whether you're a creator, educator, or marketer, you can start making talking photo videos for free, with no subscription required.",
      gradient: "from-green-500 to-emerald-500",
      step: "01"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create high-quality lip-synced videos in minutes. Our advanced AI lip-sync technology automates the heavy lifting, with no editing, filming, or animation skills required.",
      gradient: "from-yellow-500 to-orange-500",
      step: "02"
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "No Expensive Production",
      description: "Say goodbye to expensive shoots, actors, and studios. With just a picture and your voice, AI Lip Sync brings your content to life, saving you time and money.",
      gradient: "from-purple-500 to-pink-500",
      step: "03"
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Assets or Use Templates",
      description: "Upload your video and audio assets, or choose one of our customizable templates to start your lip sync project.",
      gradient: "from-blue-500 to-cyan-500",
      step: "04"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Magic Generation",
      description: "When everything is ready, click the Generate button and let our AI technology create perfect lip sync animations for your video.",
      gradient: "from-pink-500 to-red-500",
      step: "05"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Download Your Video",
      description: "Once the processing is complete, download your high-quality lip sync video, ready to use in your project.",
      gradient: "from-indigo-500 to-purple-500",
      step: "06"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <CheckCircle className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">How It Works</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple Steps to
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Perfect LipSync</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the cutting-edge capabilities of our AI lip-sync technology.
            Create professional videos with unprecedented audio-visual synchronization in just 6 simple steps.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {coreFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {feature.step}
              </div>

              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-16 transition-all duration-500"></div>
              </div>

              {/* Arrow to next step (except for last item) */}
              {index < coreFeatures.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-gray-600 group-hover:text-blue-400 transition-colors duration-300">
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-3xl p-8 max-w-6xl mx-auto backdrop-blur-md">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                The Complete LipSync Process
              </h3>
              <p className="text-gray-300">
                From upload to download - see how simple it is to create professional lip-sync videos
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <span>Upload</span>
              </div>
              <ArrowRight className="text-gray-600 hidden md:block" size={20} />
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <span>AI Process</span>
              </div>
              <ArrowRight className="text-gray-600 hidden md:block" size={20} />
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <span>Generate</span>
              </div>
              <ArrowRight className="text-gray-600 hidden md:block" size={20} />
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <span>Download</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/50 rounded-3xl p-10 max-w-4xl mx-auto backdrop-blur-md relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Start creating professional lip-sync videos with all these advanced capabilities.
                No experience required - just upload and let AI do the magic!
              </p>
              <a
                href="#dashboard"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-2" size={20} />
                Try LipSync Features Now
                <ArrowRight className="ml-2" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
