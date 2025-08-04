'use client';

import { Sparkles, Zap, Shield, Globe, Clock, Star } from 'lucide-react';

export default function FeaturesLipsync() {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Perfect Sync",
      description: "AI-powered lip synchronization that matches audio perfectly with natural mouth movements.",
      gradient: "from-orange-500 to-pink-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Processing",
      description: "Quick turnaround times with optimized AI models. Get results in minutes, not hours.",
      gradient: "from-pink-500 to-red-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Multiple Formats",
      description: "Support for images, videos, and various audio formats for maximum flexibility.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multilingual Support",
      description: "Works with multiple languages and accents for global content creation.",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Preview",
      description: "See your lip-sync results instantly with our advanced preview technology.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Professional Quality",
      description: "Studio-grade output quality suitable for commercial and professional use.",
      gradient: "from-green-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Advanced Features</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose Our
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"> AI LipSync</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the most advanced lip synchronization technology with features designed
            for creators, professionals, and businesses worldwide.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10"
            >
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
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-pink-500 group-hover:w-16 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-3xl p-8 max-w-6xl mx-auto backdrop-blur-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  99.9%
                </div>
                <div className="text-gray-400 text-sm font-medium">Accuracy Rate</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  &lt;2min
                </div>
                <div className="text-gray-400 text-sm font-medium">Processing Time</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  50+
                </div>
                <div className="text-gray-400 text-sm font-medium">Languages</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  4K
                </div>
                <div className="text-gray-400 text-sm font-medium">Max Resolution</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/50 rounded-3xl p-10 max-w-4xl mx-auto backdrop-blur-md relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Content?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already making amazing lip-sync content with our cutting-edge AI technology.
              </p>
              <a
                href="#dashboard"
                className="inline-flex items-center bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-2" size={20} />
                Start Creating Now - It's Free!
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
