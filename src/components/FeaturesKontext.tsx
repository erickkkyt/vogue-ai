'use client';

import { FACE_TO_MANY_KONTEXT_MEDIA } from '../config/media';
import { GifLink } from './MediaLink';

export default function FeaturesKontext() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v3m0 0v8a1 1 0 001 1h3M7 4h10M5 8h14M5 8V5a1 1 0 011-1h2a1 1 0 011 1v3" />
        </svg>
      ),
      title: "Artistic Style Transfer",
      description: "Transform faces into different artistic styles, from classical paintings to modern digital art with stunning accuracy."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Age Progression",
      description: "See how faces would look at different ages, from childhood to elderly years with realistic aging effects."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "Context Adaptation",
      description: "Adapt faces to different contexts, environments, and scenarios with realistic and natural results."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Expression Control",
      description: "Control facial expressions and emotions to create the perfect look for any situation or mood."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Lighting Effects",
      description: "Apply different lighting conditions and effects to enhance the transformed faces with professional quality."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Batch Processing",
      description: "Process multiple faces at once and apply transformations to entire photo collections efficiently."
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionary AI technology for unlimited creative possibilities with advanced face transformation capabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 group-hover:bg-green-200 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>

                {/* Feature-specific demo */}
                <div className="mt-4">
                  <div className="w-full h-24 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <GifLink
                      src={
                        index === 0 ? FACE_TO_MANY_KONTEXT_MEDIA.features.artisticStyleDemo :
                        index === 1 ? FACE_TO_MANY_KONTEXT_MEDIA.features.ageProgressionDemo :
                        index === 2 ? FACE_TO_MANY_KONTEXT_MEDIA.features.contextAdaptationDemo :
                        index === 3 ? FACE_TO_MANY_KONTEXT_MEDIA.features.expressionControlDemo :
                        index === 4 ? FACE_TO_MANY_KONTEXT_MEDIA.features.lightingEffectsDemo :
                        FACE_TO_MANY_KONTEXT_MEDIA.features.batchProcessingDemo
                      }
                      alt={
                        index === 0 ? 'Artistic Style Demo' :
                        index === 1 ? 'Age Progression Demo' :
                        index === 2 ? 'Context Adaptation Demo' :
                        index === 3 ? 'Expression Control Demo' :
                        index === 4 ? 'Lighting Effects Demo' :
                        'Batch Processing Demo'
                      }
                      title={
                        index === 0 ? 'Artistic Style' :
                        index === 1 ? 'Age Progression' :
                        index === 2 ? 'Context Adaptation' :
                        index === 3 ? 'Expression Control' :
                        index === 4 ? 'Lighting Effects' :
                        'Batch Processing'
                      }
                      width={400}
                      height={96}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Coming soon badge */}
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-yellow-100 rounded-full text-yellow-800 text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Coming Soon
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
