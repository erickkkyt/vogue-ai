'use client';

import { useState } from 'react';
import { FACE_TO_MANY_KONTEXT_MEDIA } from '../../config/media';
import { ImageLink } from '../common/MediaLink';

export default function TransformationShowcase() {
  const [activeCategory, setActiveCategory] = useState(0);

  const transformationCategories = [
    {
      id: 'artistic',
      title: 'Artistic Styles',
      description: 'Transform faces into famous art styles',
      examples: [
        {
          title: 'Van Gogh Style',
          before: FACE_TO_MANY_KONTEXT_MEDIA.transformations.artistic.beforeVangogh,
          after: FACE_TO_MANY_KONTEXT_MEDIA.transformations.artistic.afterVangogh
        },
        {
          title: 'Picasso Style',
          before: FACE_TO_MANY_KONTEXT_MEDIA.transformations.artistic.beforePicasso,
          after: FACE_TO_MANY_KONTEXT_MEDIA.transformations.artistic.afterPicasso
        },
        {
          title: 'Renaissance Style',
          before: FACE_TO_MANY_KONTEXT_MEDIA.transformations.artistic.beforeRenaissance,
          after: FACE_TO_MANY_KONTEXT_MEDIA.transformations.artistic.afterRenaissance
        }
      ]
    },
    {
      id: 'age',
      title: 'Age Progression',
      description: 'See faces at different ages',
      examples: [
        {
          title: 'Child to Adult',
          before: FACE_TO_MANY_KONTEXT_MEDIA.transformations.age.childToAdultBefore,
          after: FACE_TO_MANY_KONTEXT_MEDIA.transformations.age.childToAdultAfter
        },
        {
          title: 'Adult to Elder',
          before: FACE_TO_MANY_KONTEXT_MEDIA.transformations.age.adultToElderBefore,
          after: FACE_TO_MANY_KONTEXT_MEDIA.transformations.age.adultToElderAfter
        },
        {
          title: 'Time Progression',
          before: FACE_TO_MANY_KONTEXT_MEDIA.transformations.age.timeProgressionBefore,
          after: FACE_TO_MANY_KONTEXT_MEDIA.transformations.age.timeProgressionAfter
        }
      ]
    },
    {
      id: 'context',
      title: 'Context Adaptation',
      description: 'Adapt faces to different environments',
      examples: [
        {
          title: 'Professional Setting',
          before: FACE_TO_MANY_KONTEXT_MEDIA.transformations.context.casualToProfessionalBefore,
          after: FACE_TO_MANY_KONTEXT_MEDIA.transformations.context.casualToProfessionalAfter
        },
        {
          title: 'Fantasy World',
          before: FACE_TO_MANY_KONTEXT_MEDIA.transformations.context.normalToFantasyBefore,
          after: FACE_TO_MANY_KONTEXT_MEDIA.transformations.context.normalToFantasyAfter
        },
        {
          title: 'Historical Era',
          before: FACE_TO_MANY_KONTEXT_MEDIA.transformations.context.modernToHistoricalBefore,
          after: FACE_TO_MANY_KONTEXT_MEDIA.transformations.context.modernToHistoricalAfter
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Transformation Gallery
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the endless possibilities of AI face transformation.
            See how our technology can adapt any face to different styles, ages, and contexts.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-2 shadow-lg backdrop-blur-md">
            {transformationCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(index)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === index
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-green-400 hover:bg-green-900/30'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Transformation Display */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/90 border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {transformationCategories[activeCategory].title}
              </h3>
              <p className="text-gray-300">{transformationCategories[activeCategory].description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {transformationCategories[activeCategory].examples.map((example, index) => (
                <div key={index} className="text-center group">
                  <h4 className="text-lg font-semibold text-white mb-4">{example.title}</h4>
                  
                  <div className="relative">
                    {/* Before/After Container */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Before Image */}
                      <div className="relative">
                        <div className="w-full aspect-square rounded-xl overflow-hidden shadow-lg">
                          <ImageLink
                            src={example.before}
                            alt={`${example.title} - Before`}
                            title={`${example.title} - Before`}
                            width={300}
                            height={300}
                            className="w-full h-full"
                          />
                        </div>
                        
                        {/* Before label */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Before
                        </div>
                      </div>

                      {/* After Image */}
                      <div className="relative">
                        <div className="w-full aspect-square rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <ImageLink
                            src={example.after}
                            alt={`${example.title} - After`}
                            title={`${example.title} - After`}
                            width={300}
                            height={300}
                            className="w-full h-full"
                          />
                          {/* Fallback placeholder */}
                          <div className="w-full h-full bg-gradient-to-br from-green-200 to-teal-200 flex items-center justify-center" style={{display: 'none'}}>
                            <div className="text-center">
                              <svg className="w-16 h-16 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                              </svg>
                              <div className="text-sm text-green-600">After</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* After label */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 border border-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          After
                        </div>
                        
                        {/* Magic sparkle */}
                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-ping">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-3.01L12 0z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transformation Arrow */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded-full shadow-lg flex items-center justify-center border-4 border-green-500">
                        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Transformation stats */}
                  <div className="mt-4 text-sm text-gray-400">
                    <div className="flex justify-center space-x-4">
                      <span>✨ AI Enhanced</span>
                      <span>⚡ 3s Process</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="text-center mt-16">
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <div className="inline-flex items-center px-6 py-3 bg-yellow-900/50 border border-yellow-700 rounded-full text-yellow-200 font-medium mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Revolutionary Face Transformation Technology
            </h3>
            <p className="text-gray-300 mb-6">
              We're developing the most advanced face transformation engine ever created.
              Join our waitlist to be the first to experience unlimited creative possibilities.
            </p>
            <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500">
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
