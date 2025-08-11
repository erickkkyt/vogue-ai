'use client';

import { Brain, Zap, Play, Wand2, Target } from 'lucide-react';

export default function WhatIsLipSync() {
  const coreCapabilities = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Neural Intelligence",
      description: "Advanced AI analyzes speech patterns and facial structures for perfect synchronization",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Speed",
      description: "Transform videos in under 2 minutes with our optimized processing pipeline",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "99.9% Precision",
      description: "Industry-leading accuracy with natural mouth movements and perfect timing",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.1),transparent_40%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <Wand2 className="w-4 h-4 mr-3 text-indigo-400" />
            <span className="text-indigo-400 text-sm font-medium tracking-wide">AI Technology</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What is
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> AI LipSync?</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Revolutionary AI technology that creates perfect lip synchronization<br />
            between audio and video with unprecedented accuracy.
          </p>
        </div>

        {/* Core Technology Showcase */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="bg-gradient-to-br from-slate-900/50 to-gray-900/50 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Technology Demo */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-500/20 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">AI LipSync Demo</h3>
                    <p className="text-gray-400 text-sm">See the technology in action</p>
                  </div>

                  {/* Floating Tech Indicators */}
                  <div className="absolute top-3 left-3 bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30 rounded-lg px-3 py-1.5 text-indigo-300 text-xs font-medium">
                    Neural Processing
                  </div>
                  <div className="absolute top-3 right-3 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-lg px-3 py-1.5 text-purple-300 text-xs font-medium">
                    99.9% Accuracy
                  </div>
                  <div className="absolute bottom-3 left-3 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-lg px-3 py-1.5 text-emerald-300 text-xs font-medium">
                    Real-time Sync
                  </div>
                </div>
              </div>

              {/* Technology Explanation */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Advanced Neural Synchronization
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Our breakthrough AI technology analyzes audio at the phoneme level, maps facial structures,
                    and generates perfectly timed lip movements that look completely natural and professional.
                  </p>
                </div>

                {/* Key Features */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">Audio Intelligence</h4>
                      <p className="text-gray-400 text-sm">Deep analysis of speech patterns, phonemes, and timing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">Facial Recognition</h4>
                      <p className="text-gray-400 text-sm">Precise mapping of facial features and mouth structure</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">Perfect Generation</h4>
                      <p className="text-gray-400 text-sm">Natural lip movements with frame-perfect synchronization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Capabilities */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {coreCapabilities.map((capability, index) => (
            <div
              key={index}
              className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 hover:bg-slate-900/60"
            >
              <div className="text-center">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-r ${capability.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <div className="text-white">
                    {capability.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                  {capability.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {capability.description}
                </p>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
