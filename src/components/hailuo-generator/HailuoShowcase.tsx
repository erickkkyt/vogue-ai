'use client';

import { useState, useRef, useEffect } from 'react';

export default function HailuoShowcase() {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [openPrompt, setOpenPrompt] = useState<string | null>(null);
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
      id: '1',
      title: 'Hailuo AI Character Animation',
      description: 'Dynamic character movements with Hailuo AI technology',
      videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/Hailuo%2002.mp4',
      prompt: 'As the shockwave of the first clash fades, the divine warrior pivots with supernatural agility, sliding beneath the beast\'s follow-up strike — a sweeping claw that shatters a marble column behind him. He rises in a spiraling motion, his energy sword spinning in a luminous arc, slicing across the creature\'s flank. The blow sears the shadow-flesh, burning away part of its arm and releasing a burst of black mist and shrieking wails. The beast staggers, but before it can recover, the warrior slams his gauntleted fist into the ground, summoning a blinding ring of golden light that radiates outward like a divine pulse. The ancient symbols on his armor blaze to life, floating around him in orbit as protective sigils. The creature snarls, erupting into a storm of wings and tendrils, shifting forms chaotically in a desperate counter. As it lunges forward with multiple arms formed of smoke and bone, the warrior leaps skyward — cloak flaring, sword raised high — then crashes down like a meteor, striking with holy fury. The ground beneath the impact craters, a dome of golden light pushing the shadows back. Time seems to slow as both combatants lock eyes through fire and dust',
      stats: { views: '2.1M', likes: '89K' }
    },
    {
      id: '2',
      title: 'Hailuo AI Cinematic Landscapes',
      description: 'Breathtaking scenery generation with Hailuo AI',
      videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/Hailuo%2003.mp4',
      prompt: 'Visual elements: * Floating rock formations and islands * Luminescent jellyfish-like creatures drifting in the air * Massive crystal pillars growing from the ground * Magical particles sparkling in the atmosphere * Incredible giant structures visible in the distance[Push in,Pedestal up] can make chicken soup',
      stats: { views: '1.8M', likes: '76K' }
    },
    {
      id: '3',
      title: 'Hailuo AI Abstract Art Motion',
      description: 'Creative abstract video art with Hailuo AI',
      videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/dog%20showcase4.mp4',
      prompt: 'A dog speed climbs up a climbing wall at the olympics',
      stats: { views: '1.5M', likes: '62K' }
    },
    {
      id: '4',
      title: 'Product Showcase',
      description: 'Professional product demonstrations',
      videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/dog%20showcase5.mp4',
      prompt: 'A gorilla competes in Olympic weightlifting, lifting with ease.',
      stats: { views: '1.2M', likes: '54K' }
    }
  ];

  return (
    <section id="viral-videos" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hailuo AI Video Gallery
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover the power of Hailuo AI through our curated collection of generated videos.
            From cinematic scenes to creative animations, see what's possible with our platform.
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
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-purple-500/30">
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
                  
                </div>
              </div>

              {/* Prompt Box */}
              <div className="mt-4 relative">
                <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-md border border-gray-700/30 rounded-xl p-3 h-12 overflow-hidden relative shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                  {/* Prompt Text */}
                  <div className="text-sm text-gray-300 leading-relaxed overflow-hidden whitespace-nowrap text-ellipsis pr-16">
                    <span className="text-purple-400 font-medium">Prompt: </span>
                    {video.prompt}
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => setOpenPrompt(openPrompt === video.id ? null : video.id)}
                    className="absolute top-1/2 right-8 -translate-y-1/2 p-1.5 bg-gray-700/60 hover:bg-purple-600/60 rounded-lg transition-all duration-200 hover:scale-110"
                    title="View full prompt"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyPrompt(`Prompt: ${video.prompt}`, video.id)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 bg-gray-700/60 hover:bg-purple-600/60 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Copy prompt"
                  >
                    {copiedPrompt === video.id ? (
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Expandable Prompt Modal */}
                {openPrompt === video.id && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 z-30">
                    <div className="bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 shadow-2xl">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-medium text-purple-400">Full Prompt</h4>
                        <button
                          onClick={() => setOpenPrompt(null)}
                          className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                          title="Close"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-gray-200 leading-relaxed max-h-40 overflow-y-auto mb-3 p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-purple-400 font-medium">Prompt: </span>
                        {video.prompt}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            copyPrompt(`Prompt: ${video.prompt}`, video.id);
                            setOpenPrompt(null);
                          }}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-purple-600/60 hover:bg-purple-600/80 rounded-lg transition-all duration-200 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-white">Copy Prompt</span>
                        </button>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-500/30"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              🎬 Create Your Own Hailuo AI Videos
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Join thousands of creators using our platform to generate stunning videos with Hailuo AI technology.
              Start your creative journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#dashboard"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Creating Now
              </a>
              <div className="text-gray-400 text-sm">
                ✅ No monthly limits • ✅ Professional quality • ✅ Instant results
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
