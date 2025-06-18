'use client';

export default function FeaturesVeo3() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
      title: "Native Audio Generation",
      description: "Automatically create and integrate audio into videos, including sound effects, ambient noises, and character dialogue with synchronized lip-syncing."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Advanced Prompt Understanding",
      description: "Interpret complex, narrative-driven prompts with high accuracy. Describe detailed scenes and story elements in everyday language."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "Consistent Characters",
      description: "Create character consistent videos based on reference images. Maintain visual consistency across multiple clips and scenes."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v3m0 0v8a1 1 0 001 1h3M7 4h10M5 8h14M5 8V5a1 1 0 011-1h2a1 1 0 011 1v3" />
        </svg>
      ),
      title: "Accurate Style Control",
      description: "Control the artistic style of video output using reference images. From photorealistic to cartoonish animation styles."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "Camera Controls",
      description: "Advanced camera manipulation with pans, zooms, and angle changes. Create cinematic shots with dynamic perspectives and smooth transitions."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Physics-Based Simulation",
      description: "Videos reflect real-world physics for natural motion and visuals. Realistic movement of fabric, water, and environmental elements."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Multi-Input Prompts",
      description: "Generate videos using text descriptions or image references. Combine different input types for more precise control."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "Integration with Flow",
      description: "Seamlessly integrate with Google's Flow AI filmmaking tool for creating cinematic clips and professional video production workflows."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      title: "Flexible Motion Control",
      description: "Customize movements of video objects with realistic and consistent motion. Produce fluid character animation and coherent environmental interactions."
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Veo 3 Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionary AI video generation technology with native audio capabilities and advanced creative controls.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl hover:-translate-y-2 hover:border-gray-600 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-green-900/50 rounded-xl flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 group-hover:bg-green-800/50 transition-all duration-300 border border-green-800">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>

                {/* Feature demo placeholder */}
                <div className="mt-4">
                  <div className="w-full h-24 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🎬</div>
                      <div className="text-xs text-gray-300">Demo Video</div>
                    </div>
                  </div>
                </div>

                {/* Coming soon badge */}
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-yellow-900/50 rounded-full text-yellow-200 text-sm font-medium border border-yellow-800">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Coming Soon
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
