'use client';

export default function EarthZoomCoreFeatures() {
  const coreFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "AI-Powered Earth Mapping",
      description: "Our advanced AI analyzes your photo's geographical context and seamlessly blends it with real satellite imagery to create ultra-realistic Earth zoom-out sequences."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "Cinematic Zoom Transitions",
      description: "Experience smooth, professional-grade zoom-out effects that rival Hollywood productions. Perfect for creating viral content on social media platforms."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast Processing",
      description: "Generate stunning Earth zoom videos in under 60 seconds. Our optimized AI pipeline ensures quick turnaround without compromising on quality."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Global Location Support",
      description: "Works with photos from anywhere on Earth. Our AI recognizes landmarks, cities, and natural features worldwide for accurate geographical positioning."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      title: "Advanced Customization",
      description: "Fine-tune every aspect of your Earth zoom effect. Control zoom speed, atmospheric conditions, time of day, cloud coverage, and camera trajectory."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: "Multi-Platform Optimization",
      description: "Export in formats optimized for every social platform. Whether it's vertical for TikTok/Instagram or landscape for YouTube, we've got you covered."
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-blue-400 font-medium">Core Technology</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Transform Your Content with Earth Zoom AI
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Experience the next generation of Earth zoom-out effects with our comprehensive suite of professional features. 
            From advanced AI processing to seamless satellite integration, Earth Zoom AI provides everything you need to create stunning visual content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {coreFeatures.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/80 hover:border-gray-600/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-105"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center text-white group-hover:from-blue-400 group-hover:to-green-500 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white ml-4 group-hover:text-blue-300 transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Experience These Features?
            </h3>
            <p className="text-gray-300 mb-6">
              Start creating professional Earth zoom videos with all these advanced capabilities. 
              Transform your photos into viral content today.
            </p>
            <a
              href="#dashboard"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Try Earth Zoom AI Now
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 