'use client';

import { AI_BABY_GENERATOR_MEDIA } from '../config/media';
import { ImageLink, GifLink } from './MediaLink';

export default function HowToGenerator() {
  const steps = [
    {
      number: "1",
      title: "Upload Parent Photos",
      description: "Upload clear, front-facing photos of both parents. Our AI works best with high-quality images where faces are clearly visible.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      number: "2",
      title: "AI Analysis",
      description: "Our advanced AI analyzes facial features, bone structure, and genetic patterns from both photos to understand hereditary traits.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      number: "3",
      title: "Generate Baby Image",
      description: "Watch as our AI creates realistic baby photos that combine the best features from both parents in just seconds.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      number: "4",
      title: "Download & Share",
      description: "Download your AI-generated baby photos in high definition and share them with family and friends.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <section id="howTo" className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Creating your AI baby photo is simple and takes just a few minutes. Follow these easy steps to see your future baby.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-gray-800/90 text-center p-6 h-full rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl hover:-translate-y-2 hover:border-gray-600 transition-all duration-300 relative overflow-hidden backdrop-blur-md">
                {/* Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-purple-900/50 border border-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-400 group-hover:bg-purple-800/50 transition-colors duration-300">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>


                </div>
              </div>

              {/* Animated Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-gray-700 border border-gray-600 rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Progress indicator */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-4">
              Why Our AI Baby Generator is Different
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-white mb-2">🧬 Genetic Analysis</h4>
                <p className="text-gray-300 text-sm">Advanced algorithms analyze genetic patterns and hereditary traits</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🎨 Artistic Quality</h4>
                <p className="text-gray-300 text-sm">Professional-grade image generation with stunning detail</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">⚡ Lightning Fast</h4>
                <p className="text-gray-300 text-sm">Get results in seconds, not minutes or hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
