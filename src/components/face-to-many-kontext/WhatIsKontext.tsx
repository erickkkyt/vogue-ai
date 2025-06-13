'use client';

import { FACE_TO_MANY_KONTEXT_MEDIA } from '../../config/media';
import { VideoLink, MediaGrid } from '../common/MediaLink';

export default function WhatIsKontext() {
  // 定义转换示例
  const transformationExamples = [
    {
      video: FACE_TO_MANY_KONTEXT_MEDIA.features.artisticStyleDemo,
      thumbnail: FACE_TO_MANY_KONTEXT_MEDIA.transformations.artistic.beforeVangogh,
      title: 'Artistic Style Transfer'
    },
    {
      video: FACE_TO_MANY_KONTEXT_MEDIA.features.ageProgressionDemo,
      thumbnail: FACE_TO_MANY_KONTEXT_MEDIA.transformations.age.childToAdultBefore,
      title: 'Age Progression'
    },
    {
      video: FACE_TO_MANY_KONTEXT_MEDIA.features.contextAdaptationDemo,
      thumbnail: FACE_TO_MANY_KONTEXT_MEDIA.transformations.context.casualToProfessionalBefore,
      title: 'Context Adaptation'
    },
    {
      video: FACE_TO_MANY_KONTEXT_MEDIA.features.expressionControlDemo,
      thumbnail: FACE_TO_MANY_KONTEXT_MEDIA.transformations.artistic.beforePicasso,
      title: 'Digital Art Style'
    }
  ];

  return (
    <section id="whatIs" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            What Is Face-to-Many-Kontext?
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
            Face-to-Many-Kontext is a revolutionary AI-powered face transformation platform that allows you to transform any face into multiple contexts, styles, and scenarios. Using cutting-edge artificial intelligence, we can adapt faces to different artistic styles, age progressions, environmental contexts, and creative scenarios with stunning realism.
          </p>
        </div>

        {/* Interactive Transformation Gallery */}
        <div className="mb-16">
          <div className="bg-gray-800/80 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-gray-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-teal-500 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-400 rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  See Face Transformation in Action
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Watch real examples of face transformations created with our platform
                </p>
              </div>

              {/* Transformation Examples Gallery */}
              <MediaGrid
                items={transformationExamples.map((example, index) => ({
                  src: example.video,
                  alt: `Face Transformation Example ${index + 1}`,
                  type: 'video' as const,
                  title: example.title,
                  width: 300,
                  height: 300
                }))}
                columns={4}
                className="max-w-6xl mx-auto"
              />

              {/* Call to action */}
              <div className="text-center mt-8">
                <div className="inline-flex items-center px-6 py-3 bg-green-900/80 rounded-full text-green-200 font-medium border border-green-700">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Transform your face now!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 特点列表 */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center mb-4 border border-green-800">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Advanced AI Technology</h3>
            <p className="text-gray-300">Powered by state-of-the-art machine learning models for realistic and high-quality transformations.</p>
          </div>

          <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center mb-4 border border-green-800">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Multiple Transformation Types</h3>
            <p className="text-gray-300">From artistic styles to age progression, context adaptation, and creative scenarios - endless possibilities.</p>
          </div>

          <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center mb-4 border border-green-800">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Professional Quality</h3>
            <p className="text-gray-300">Generate professional-grade transformations suitable for creative projects, entertainment, and artistic exploration.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
