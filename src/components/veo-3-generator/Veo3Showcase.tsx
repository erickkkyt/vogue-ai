'use client';

import { useState } from 'react';

export default function Veo3Showcase() {
  const [activeCategory, setActiveCategory] = useState(0);

  const videoCategories = [
    {
      id: 'audio-sync',
      title: 'Audio Synchronization',
      description: 'Videos with perfectly synced audio and dialogue',
      examples: [
        {
          title: 'Character Dialogue',
          description: 'AI-generated character speaking with lip sync',
          prompt: 'A person speaking about their day with natural expressions and gestures'
        },
        {
          title: 'Sound Effects',
          description: 'Environmental sounds matching video content',
          prompt: 'A forest scene with birds chirping and wind through trees'
        },
        {
          title: 'Ambient Audio',
          description: 'Background sounds enhancing video atmosphere',
          prompt: 'A busy city street with traffic sounds and footsteps'
        }
      ]
    },
    {
      id: 'camera-control',
      title: 'Camera Controls',
      description: 'Dynamic camera movements and cinematic shots',
      examples: [
        {
          title: 'Pan Movement',
          description: 'Smooth horizontal camera panning',
          prompt: 'Pan across a beautiful landscape from left to right'
        },
        {
          title: 'Zoom Effect',
          description: 'Dramatic zoom in/out effects',
          prompt: 'Zoom in on a character\'s surprised facial expression'
        },
        {
          title: 'Angle Changes',
          description: 'Dynamic perspective shifts',
          prompt: 'Low angle shot of a superhero landing dramatically'
        }
      ]
    },
    {
      id: 'physics-sim',
      title: 'Physics Simulation',
      description: 'Realistic physics and natural motion',
      examples: [
        {
          title: 'Fabric Movement',
          description: 'Realistic cloth and fabric physics',
          prompt: 'A person in flowing robes walking in the wind'
        },
        {
          title: 'Water Effects',
          description: 'Natural water movement and splashes',
          prompt: 'Waves crashing against rocks on a stormy beach'
        },
        {
          title: 'Object Interaction',
          description: 'Realistic object physics and collisions',
          prompt: 'A ball bouncing down a flight of stairs'
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Veo 3 Video Gallery
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the revolutionary capabilities of Veo 3 AI video generation.
            See how our technology creates videos with synchronized audio and realistic physics.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-2 shadow-lg backdrop-blur-md">
            {videoCategories.map((category, index) => (
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

        {/* Video Display */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/90 border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {videoCategories[activeCategory].title}
              </h3>
              <p className="text-gray-300">{videoCategories[activeCategory].description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {videoCategories[activeCategory].examples.map((example, index) => (
                <div key={index} className="text-center group">
                  <h4 className="text-lg font-semibold text-white mb-4">{example.title}</h4>
                  
                  <div className="relative">
                    {/* Video Container */}
                    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 group-hover:scale-105 transition-transform duration-300">
                      {/* Video Placeholder */}
                      <div className="w-full h-full flex items-center justify-center relative">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎬</div>
                          <div className="text-white font-medium text-sm mb-1">{example.title}</div>
                          <div className="text-gray-300 text-xs">{example.description}</div>
                        </div>
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer">
                          <div className="w-12 h-12 bg-green-500/80 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Audio indicator */}
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                          </svg>
                          Audio
                        </div>
                      </div>
                    </div>
                    
                    {/* Prompt Display */}
                    <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Prompt:</div>
                      <div className="text-sm text-gray-300 italic">"{example.prompt}"</div>
                    </div>
                  </div>

                  {/* Video stats */}
                  <div className="mt-4 text-sm text-gray-400">
                    <div className="flex justify-center space-x-4">
                      <span>🎬 8s Video</span>
                      <span>🔊 With Audio</span>
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
              Revolutionary AI Video Generation with Audio
            </h3>
            <p className="text-gray-300 mb-6">
              We're bringing Google's Veo 3 technology to create the most advanced AI video generator with native audio capabilities.
              Join our waitlist to be the first to experience this groundbreaking technology.
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
