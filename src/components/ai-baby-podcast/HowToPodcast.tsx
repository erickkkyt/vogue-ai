'use client';

export default function HowTo() {
  const steps = [
    {
      step: '01',
      title: 'Generate Baby Avatar Images',
      description: 'Create high-quality baby avatar images using AI tools like Midjourney. Customize your BabyPodcast characters with headphones, microphones, and podcast studio backgrounds.',
      features: ['AI-powered avatar customization', 'Professional studio backgrounds', 'Multiple character styles'],
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      step: '02',
      title: 'Craft Engaging Scripts',
      description: "Develop scripts that balance humor, relevance, and engagement. Focus on either parodying existing podcasts, discussing trends, or creating fictional scenarios.",
      features: ['Viral content templates included', 'Humor and engagement balance', 'Trending topic integration'],
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      step: '03',
      title: 'Generate AI Voices',
      description: 'Use AI voice tools like ElevenLabs to produce audio that balances childlike qualities with clarity. Find the right voice modulation that fits your BabyPodcast style.',
      features: ['Multiple voice styles available', 'Childlike voice modulation', 'High-quality audio output'],
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      step: '04',
      title: 'Animate & Edit Your Video',
      description: 'Use animation tools like Hedra to create synchronized lip movements and facial expressions that match your audio track. Edit with tools like CapCut, adding subtitles and effects.',
      features: ['Professional editing tools integrated', 'Lip-sync animation', 'Subtitle and effects'],
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How To Create AI Baby Podcast Content
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Follow these steps to create engaging AI Baby Podcast videos that go viral
          </p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 via-green-500 to-orange-500 -translate-x-1/2 opacity-30"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Progress Node */}
                <div className="hidden lg:block absolute left-1/2 top-8 w-4 h-4 -translate-x-1/2 z-10">
                  <div className={`w-full h-full rounded-full bg-gradient-to-r ${step.color} shadow-lg animate-pulse`}></div>
                </div>
                {/* Step Content */}
                <div className={`lg:flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Empty Left/Right Section (where icon used to be) */}
                  <div className="hidden lg:block lg:w-1/2">
                    {/* This space is intentionally left empty */}
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-1/2 w-full">
                    <div className={`p-6 bg-gray-900/80 rounded-2xl shadow-lg border ${step.borderColor} hover:shadow-xl hover:border-opacity-50 transition-all duration-300`}>
                      {/* Step Number and Title */}
                      <div className="flex items-center mb-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg mr-3 flex-shrink-0`}>
                          {step.step}
                        </div>
                        <h3 className="text-lg lg:text-xl font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4 text-sm lg:text-base">{step.description}</p>

                      {/* Features */}
                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2 text-xs lg:text-sm text-gray-300">
                            <svg className="w-3 h-3 lg:w-4 lg:h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gray-900/80 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Create Your First Viral Baby Podcast?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of creators who are already making millions of views with our platform.
            </p>
            <a
              href="#dashboard"
              className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-500"
            >
              Start Creating Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 