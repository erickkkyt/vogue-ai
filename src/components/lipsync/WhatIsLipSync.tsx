'use client';

import { Sparkles, Video, Mic, Brain, Zap, Star, Play, ArrowRight } from 'lucide-react';

export default function WhatIsLipSync() {
  const magicFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description: "Advanced neural networks analyze speech patterns and facial movements to create perfect synchronization",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Transformation",
      description: "Transform any video into a perfectly lip-synced masterpiece in just minutes with our lightning-fast processing",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Professional Quality",
      description: "Achieve studio-grade results with natural mouth movements that look authentic and professionally polished",
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 mr-3 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Discover the Magic</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            What is 
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"> AI LipSync?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Experience the revolutionary power of artificial intelligence that transforms ordinary videos 
            into perfectly synchronized masterpieces. Our cutting-edge technology analyzes audio patterns 
            and creates natural lip movements that bring your content to life.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto mb-20">
          {/* Left Side - Video Demo */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">See LipSync in Action</h3>
                  <p className="text-gray-400">Watch how AI transforms videos</p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 left-4 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg px-3 py-1 text-purple-300 text-sm font-medium">
                AI Processing
              </div>
              <div className="absolute top-4 right-4 bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 rounded-lg px-3 py-1 text-pink-300 text-sm font-medium">
                99.9% Accuracy
              </div>
              <div className="absolute bottom-4 left-4 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-3 py-1 text-blue-300 text-sm font-medium">
                Real-time Sync
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                The Magic Behind Perfect Synchronization
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Our AI LipSync technology represents a breakthrough in video processing. By analyzing 
                audio frequencies, phoneme patterns, and facial structures, our advanced algorithms 
                create seamless lip movements that perfectly match any spoken content.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Whether you're creating content for social media, education, marketing, or entertainment, 
                our platform delivers professional-quality results that captivate audiences and bring 
                your vision to life.
              </p>
            </div>

            {/* Process Steps */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-white font-semibold">Audio Analysis</h4>
                  <p className="text-gray-400 text-sm">AI analyzes speech patterns and phonemes</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-white font-semibold">Facial Mapping</h4>
                  <p className="text-gray-400 text-sm">Identifies facial features and mouth structure</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-white font-semibold">Perfect Sync</h4>
                  <p className="text-gray-400 text-sm">Generates natural lip movements in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Magic Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {magicFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-3xl p-10 max-w-4xl mx-auto backdrop-blur-md relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Experience the Magic?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join millions of creators who have discovered the power of AI LipSync. 
                Transform your videos today and see the magic happen in real-time.
              </p>
              <a
                href="#dashboard"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-2" size={20} />
                Discover the Magic Now
                <ArrowRight className="ml-2" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
