'use client';

import { DollarSign, Zap, Music, Upload, Sparkles, Download, ArrowRight, CheckCircle } from 'lucide-react';

export default function LipsyncCoreFeatures() {
  const processSteps = [
    {
      icon: <Upload className="w-5 h-5" />,
      title: "Upload Content",
      description: "Upload your video and audio files or choose from our templates to get started quickly.",
      gradient: "from-blue-500 to-cyan-500",
      step: "01"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI Processing",
      description: "Our neural networks analyze audio patterns and facial features for perfect synchronization.",
      gradient: "from-purple-500 to-pink-500",
      step: "02"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Generate Video",
      description: "AI creates natural lip movements with frame-perfect timing in under 2 minutes.",
      gradient: "from-amber-500 to-orange-500",
      step: "03"
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Download Result",
      description: "Get your professional-quality lip-synced video ready for any platform or project.",
      gradient: "from-emerald-500 to-teal-500",
      step: "04"
    }
  ];

  const keyBenefits = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Completely Free",
      description: "Start creating professional lip-sync videos at no cost. No hidden fees or subscriptions required.",
      color: "text-emerald-400"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Lightning Fast",
      description: "Transform videos in minutes with our optimized AI processing pipeline.",
      color: "text-amber-400"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Professional Quality",
      description: "Achieve studio-grade results with natural movements and perfect synchronization.",
      color: "text-blue-400"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_40%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Redesigned */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Simple
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"> Process</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Professional lip-sync videos in 4 simple steps.
            No technical skills required – just upload and let AI do the magic.
          </p>
        </div>

        {/* Process Steps - Redesigned */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-slate-600 to-slate-700 z-0"></div>
                )}

                {/* Step Card */}
                <div className="relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-500 hover:bg-slate-900/80 group-hover:scale-105 z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white scale-125">
                        {step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Process Flow Indicator */}
          <div className="flex items-center justify-center mt-16 space-x-4">
            <div className="text-gray-400 text-sm font-medium">Complete Process Time:</div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent text-lg font-bold">
              Under 2 Minutes
            </div>
          </div>
        </div>

        {/* Key Benefits - Redesigned */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose Our
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"> AI LipSync?</span>
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of AI-powered lip synchronization technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {keyBenefits.map((benefit, index) => (
              <div key={index} className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-10 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-900/80 hover:scale-105">
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${
                    index === 0 ? 'from-emerald-500 to-teal-500' :
                    index === 1 ? 'from-amber-500 to-orange-500' :
                    'from-blue-500 to-indigo-500'
                  } rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white scale-150">
                      {benefit.icon}
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-slate-900/60 border border-slate-700/40 rounded-3xl p-8 max-w-4xl mx-auto backdrop-blur-md relative overflow-hidden">
            {/* Subtle Background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Start Creating Today
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience the power of AI lip-sync technology.
                No technical skills required – just upload and create.
              </p>
              <a
                href="#dashboard"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-2" size={18} />
                Try LipSync Now
                <ArrowRight className="ml-2" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
