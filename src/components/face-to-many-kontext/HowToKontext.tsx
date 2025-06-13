'use client';

import { FACE_TO_MANY_KONTEXT_MEDIA } from '../../config/media';
import { GifLink } from '../common/MediaLink';

export default function HowToKontext() {
  const steps = [
    {
      title: 'Upload Your Photo',
      description: 'Upload a clear, high-quality photo of the face you want to transform. Our AI works best with well-lit, front-facing portraits.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      mediaPlaceholder: 'upload-demo'
    },
    {
      title: 'Choose Transformation Type',
      description: "Select from various transformation options: artistic styles, age progression, context adaptation, or creative scenarios.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v3m0 0v8a1 1 0 001 1h3M7 4h10M5 8h14M5 8V5a1 1 0 011-1h2a1 1 0 011 1v3" />
        </svg>
      ),
      mediaPlaceholder: 'selection-demo'
    },
    {
      title: 'Customize Parameters',
      description: 'Fine-tune transformation parameters such as intensity, style strength, and specific attributes to achieve your desired result.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      mediaPlaceholder: 'customization-demo'
    },
    {
      title: 'Generate & Download',
      description: 'Let our AI process your transformation. Download your results in high resolution, ready for use in your creative projects.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      mediaPlaceholder: 'generation-demo'
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How To Use Face-to-Many-Kontext
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform any face in just four simple steps with our advanced AI technology
          </p>
        </div>

        <div className="relative">
          {/* Animated Connection line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-teal-500 to-green-500 -translate-x-1/2 rounded-full"></div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className={`lg:flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Media Section */}
                  <div className="hidden lg:flex lg:w-1/2 justify-center mb-8 lg:mb-0">
                    <div className="relative">
                      {/* Step Demo Media */}
                      <div className="w-80 h-48 rounded-2xl shadow-xl overflow-hidden border-4 border-gray-700">
                        <GifLink
                          src={
                            step.mediaPlaceholder === 'upload-demo' ? FACE_TO_MANY_KONTEXT_MEDIA.features.artisticStyleDemo :
                            step.mediaPlaceholder === 'selection-demo' ? FACE_TO_MANY_KONTEXT_MEDIA.features.ageProgressionDemo :
                            step.mediaPlaceholder === 'customization-demo' ? FACE_TO_MANY_KONTEXT_MEDIA.features.contextAdaptationDemo :
                            FACE_TO_MANY_KONTEXT_MEDIA.features.expressionControlDemo
                          }
                          alt={
                            step.mediaPlaceholder === 'upload-demo' ? 'Upload Demo' :
                            step.mediaPlaceholder === 'selection-demo' ? 'Selection Demo' :
                            step.mediaPlaceholder === 'customization-demo' ? 'Customization Demo' :
                            'Generation Demo'
                          }
                          title={
                            step.mediaPlaceholder === 'upload-demo' ? 'Photo Upload' :
                            step.mediaPlaceholder === 'selection-demo' ? 'Style Selection' :
                            step.mediaPlaceholder === 'customization-demo' ? 'Parameter Customization' :
                            'Result Generation'
                          }
                          width={320}
                          height={192}
                          className="w-full h-full"
                        />
                      </div>

                      {/* Step number badge */}
                      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse border border-green-400">
                        {index + 1}
                      </div>

                      {/* Floating elements */}
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-teal-500/50 rounded-full animate-bounce"></div>
                      <div className="absolute -top-2 left-1/4 w-6 h-6 bg-green-500/50 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`lg:w-1/2 p-8 bg-gray-900/80 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl hover:border-gray-600 transition-all duration-300 ${index % 2 === 0 ? 'lg:ml-8' : 'lg:mr-8'}`}>
                    {/* Mobile step display */}
                    <div className="flex items-center mb-6 lg:hidden">
                      <div className="flex-shrink-0 relative mr-4">
                        <div className="w-16 h-16 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 border border-green-800">
                          {step.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm border border-green-400">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>

                    {/* Desktop title */}
                    <h3 className="hidden lg:block text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">{step.description}</p>

                    {/* Step-specific features */}
                    <div className="space-y-3">
                      {index === 0 && (
                        <div className="flex items-center space-x-3 text-sm text-green-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Supports multiple image formats</span>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="flex items-center space-x-3 text-sm text-green-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>50+ transformation styles available</span>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="flex items-center space-x-3 text-sm text-green-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Real-time preview available</span>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="flex items-center space-x-3 text-sm text-green-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>High-resolution output guaranteed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gray-900/80 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your First Face?
            </h3>
            <p className="text-gray-300 mb-6">
              Join the future of AI-powered face transformation technology.
            </p>
            <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500">
              Start Transforming Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
