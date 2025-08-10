'use client';

import { useState, useRef, useEffect } from 'react';

export default function EarthZoomShowcase() {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // 复制提示词功能
  const copyPrompt = async (prompt: string, videoId: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(videoId);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  // Handle video hover effects
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (video) {
        if (hoveredVideo === key) {
          video.play().catch(() => {
            // Ignore autoplay errors
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [hoveredVideo]);

  const showcaseVideos = [
    {
      id: 'landmark1',
      title: 'Landmark Zoom Out',
      videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/earth-zoom-1.mp4',
      prompt: 'Zoom out from the Eiffel Tower to show Paris from space, cinematic smooth transition with satellite view',
      description: 'Famous landmark to satellite view transition'
    },
    {
      id: 'city1',
      title: 'City Overview',
      videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/earth-zoom-2.mp4',
      prompt: 'Smooth zoom out from street level to orbital view of New York City, cinematic Earth zoom effect',
      description: 'Urban landscape to orbital perspective'
    },
    {
      id: 'nature1',
      title: 'Natural Wonder',
      videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/earth-zoom-3.mp4',
      prompt: 'Zoom out from mountain peak to show entire mountain range from space, dramatic Earth zoom sequence',
      description: 'Natural landscapes from space view'
    },
    {
      id: 'beach1',
      title: 'Coastal Zoom',
      videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/earth-zoom-4.mp4',
      prompt: 'Beach coastline zoom out to orbital view showing entire coastline, smooth Earth zoom transition',
      description: 'Coastal areas to satellite perspective'
    }
  ];

  return (
    <section id="showcase" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-blue-400 font-medium">Showcase</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Check out these amazing transformations created with our Earth Zoom AI technology.
            From landmarks to natural wonders, see what's possible.
          </p>
        </div>

        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {showcaseVideos.map((video, index) => (
            <div
              key={video.id}
              className="group relative"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              {/* Video Card */}
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-blue-500/30">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    muted
                    loop
                    playsInline
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg mb-1">{video.title}</h3>
                      <p className="text-gray-300 text-sm">{video.description}</p>
                    </div>
                  </div>
                </div>

                {/* Prompt Box */}
                <div className="p-6">
                  <div className="bg-gray-800/60 rounded-xl border border-gray-600/50 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-blue-400 font-medium text-sm">Prompt</span>
                      </div>
                      <button
                        onClick={() => copyPrompt(video.prompt, video.id)}
                        className="p-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200 group/btn"
                        title="Copy prompt"
                      >
                        {copiedPrompt === video.id ? (
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {video.prompt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-900/40 to-green-900/40 border border-blue-700/50 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              🌍 Create Your Own Earth Zoom Effects
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Join thousands of creators using our platform to generate stunning Earth zoom sequences.
              Transform your photos into viral-worthy content today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#dashboard"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Creating Now
              </a>
              <div className="text-gray-400 text-sm">
                ✅ No registration required • ✅ Professional quality • ✅ Instant results
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 