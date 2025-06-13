'use client';

import { useState } from 'react';
import { AI_BABY_GENERATOR_MEDIA } from '../../config/media';
import { ImageLink, MediaGrid } from '../common/MediaLink';

export default function BeforeAfterShowcase() {
  const [activeExample, setActiveExample] = useState(0);

  const examples = [
    {
      id: 1,
      title: "Example Family 1",
      description: "Real couple with their AI-generated baby prediction",
      parent1: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family1,
      parent2: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family1,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily1
    },
    {
      id: 2,
      title: "Example Family 2",
      description: "Real couple with their AI-generated baby prediction",
      parent1: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family2,
      parent2: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family2,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily2
    },
    {
      id: 3,
      title: "Example Family 3",
      description: "Real couple with their AI-generated baby prediction",
      parent1: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family3,
      parent2: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family3,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily3
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See Real Results
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how our AI creates stunning baby predictions from real parent photos.
            Each result captures unique features from both parents.
          </p>
        </div>

        {/* Example Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-2 shadow-lg backdrop-blur-md">
            {examples.map((example, index) => (
              <button
                key={example.id}
                onClick={() => setActiveExample(index)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeExample === index
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-900/30'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>
        </div>

        {/* Before/After Display */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/90 border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {examples[activeExample].title}
              </h3>
              <p className="text-gray-300">{examples[activeExample].description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Parent 1 */}
              <div className="text-center group">
                {/* Label above image */}
                <div className="mb-3">
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg inline-block">
                    Parent 1
                  </div>
                </div>

                {/* Parent 1 Real Image */}
                <div className="w-56 h-56 mx-auto">
                  <ImageLink
                    src={examples[activeExample].parent1}
                    alt={`${examples[activeExample].title} Parent 1`}
                    title="Parent 1"
                    width={224}
                    height={224}
                    className="w-full h-full rounded-2xl object-cover shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* AI Created Result */}
              <div className="text-center">
                {/* Label above image */}
                <div className="mb-3">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg inline-block">
                    ✨ AI-generated prediction
                  </div>
                </div>

                <div className="relative inline-block">
                  {/* Generated Baby Real Image */}
                  <div className="w-64 h-64 mx-auto mb-4">
                    <ImageLink
                      src={examples[activeExample].baby}
                      alt={`${examples[activeExample].title} Generated Baby`}
                      title="Generated Baby"
                      width={256}
                      height={256}
                      className="w-full h-full rounded-2xl object-cover object-[center_20%] shadow-xl hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Floating hearts */}
                  <div className="absolute -top-4 -left-4 text-red-400 animate-float">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-red-400 animate-float animation-delay-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-white mb-3">Your Future Baby</h4>

                {/* Stats */}
                <div className="flex justify-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-purple-400">3.2s</div>
                    <div className="text-gray-400">Time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-400">4K</div>
                    <div className="text-gray-400">Quality</div>
                  </div>
                </div>
              </div>

              {/* Parent 2 */}
              <div className="text-center group">
                {/* Label above image */}
                <div className="mb-3">
                  <div className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg inline-block">
                    Parent 2
                  </div>
                </div>

                {/* Parent 2 Real Image */}
                <div className="w-56 h-56 mx-auto">
                  <ImageLink
                    src={examples[activeExample].parent2}
                    alt={`${examples[activeExample].title} Parent 2`}
                    title="Parent 2"
                    width={224}
                    height={224}
                    className="w-full h-full rounded-2xl object-cover shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to See Your Future Baby?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of families who have discovered their future with our AI technology.
            </p>
            <a
              href="/ai-baby-generator#dashboard"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-purple-500"
            >
              Create Your Baby Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
