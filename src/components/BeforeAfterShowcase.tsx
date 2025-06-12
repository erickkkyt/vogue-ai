'use client';

import { useState } from 'react';
import { AI_BABY_GENERATOR_MEDIA } from '../config/media';
import { ImageLink, MediaGrid } from './MediaLink';

export default function BeforeAfterShowcase() {
  const [activeExample, setActiveExample] = useState(0);

  const examples = [
    {
      id: 1,
      title: "Example Family 1",
      description: "Caucasian couple with brown and blonde hair",
      parent1: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family1,
      parent2: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family1,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily1
    },
    {
      id: 2,
      title: "Example Family 2",
      description: "Asian couple with dark hair",
      parent1: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family2,
      parent2: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family2,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily2
    },
    {
      id: 3,
      title: "Example Family 3",
      description: "Mixed heritage couple",
      parent1: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family3,
      parent2: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family3,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily3
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See Real Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our AI creates stunning baby predictions from real parent photos. 
            Each result captures unique features from both parents.
          </p>
        </div>

        {/* Example Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            {examples.map((example, index) => (
              <button
                key={example.id}
                onClick={() => setActiveExample(index)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeExample === index
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>
        </div>

        {/* Before/After Display */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {examples[activeExample].title}
              </h3>
              <p className="text-gray-600">{examples[activeExample].description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Parent 1 */}
              <div className="text-center group">
                <div className="relative">
                  {/* Parent 1 Real Image */}
                  <div className="w-48 h-48 mx-auto mb-4">
                    <ImageLink
                      src={examples[activeExample].parent1}
                      alt={`${examples[activeExample].title} Parent 1`}
                      title="Parent 1"
                      width={192}
                      height={192}
                      className="w-full h-full rounded-2xl"
                    />
                  </div>

                  {/* Floating label */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Parent 1
                  </div>
                </div>
              </div>

              {/* AI Magic Center */}
              <div className="text-center">
                <div className="relative">
                  {/* Magic wand animation */}
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  
                  {/* Sparkle effects */}
                  <div className="absolute top-0 left-0 text-yellow-400 animate-ping">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-3.01L12 0z"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-0 right-0 text-yellow-400 animate-ping animation-delay-300">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-3.01L12 0z"/>
                    </svg>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Magic</h4>
                <p className="text-gray-600 text-sm">Combining features</p>
                
                {/* Plus symbol */}
                <div className="mt-4 mb-4">
                  <svg className="w-8 h-8 text-purple-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>

              {/* Parent 2 */}
              <div className="text-center group">
                <div className="relative">
                  {/* 🎯 PARENT 2 REAL IMAGE PLACEHOLDER */}
                  {/* TODO: Replace with actual parent image */}
                  <div className="w-48 h-48 bg-pink-200 rounded-2xl mx-auto mb-4 overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-20 h-20 text-pink-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div className="text-sm text-pink-600">Parent 2 Photo</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating label */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Parent 2
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow Down */}
            <div className="text-center my-12">
              <svg className="w-12 h-12 text-purple-500 mx-auto animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Result */}
            <div className="text-center">
              <div className="relative inline-block">
                {/* 🎯 GENERATED BABY REAL IMAGE PLACEHOLDER */}
                {/* TODO: Replace with actual generated baby image */}
                <div className="w-64 h-64 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl mx-auto mb-6 overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-24 h-24 text-white mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <div className="text-white">Generated Baby</div>
                    </div>
                  </div>
                </div>
                
                {/* Success badge */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  ✨ AI Generated
                </div>
                
                {/* Floating hearts */}
                <div className="absolute -top-6 -left-6 text-red-400 animate-float">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div className="absolute -bottom-6 -right-6 text-red-400 animate-float animation-delay-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
              
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Your Future Baby</h4>
              <p className="text-gray-600 mb-4">AI-generated with 98% accuracy</p>
              
              {/* Stats */}
              <div className="flex justify-center space-x-8 text-sm">
                <div className="text-center">
                  <div className="font-bold text-purple-600">3.2s</div>
                  <div className="text-gray-500">Generation Time</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">98%</div>
                  <div className="text-gray-500">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">4K</div>
                  <div className="text-gray-500">Resolution</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to See Your Future Baby?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of families who have discovered their future with our AI technology.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Create Your Baby Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
