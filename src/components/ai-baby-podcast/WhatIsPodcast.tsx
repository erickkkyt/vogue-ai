'use client';

export default function WhatIs() {
  // YouTube Shorts 链接
  const youtubeShorts = [
    {
      id: 'WIMxP_a4oA0',
      url: 'https://www.youtube.com/shorts/WIMxP_a4oA0',
      title: 'Baby Podcast Example 1'
    },
    {
      id: 'TbneflvLBpM',
      url: 'https://www.youtube.com/shorts/TbneflvLBpM',
      title: 'Baby Podcast Example 2'
    },
    {
      id: 'I7L22OXEV9M',
      url: 'https://www.youtube.com/shorts/I7L22OXEV9M',
      title: 'Baby Podcast Example 3'
    },
    {
      id: 'KuBfJAd5mFM',
      url: 'https://www.youtube.com/shorts/KuBfJAd5mFM',
      title: 'Baby Podcast Example 4'
    }
  ];

  return (    <section id="whatIs" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            What Is BabyGenerator?
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
            BabyGenerator is a viral trend taking over TikTok and YouTube Shorts. These AI-generated videos feature baby avatars as hosts discussing various topics in entertaining and engaging ways. Combining advanced AI animation with creative scripting, BabyGenerator creates realistic baby faces that sync perfectly with audio.
          </p>
        </div>

        {/* Interactive Video Gallery */}
        <div className="mb-16">
          <div className="bg-gray-800/80 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-gray-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-cyan-500 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-400 rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  See BabyGenerator in Action
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Watch real examples of viral baby podcast videos created with our platform
                </p>
              </div>

              {/* YouTube Shorts Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {youtubeShorts.map((video, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-600 hover:border-gray-500 transition-all duration-300 group">
                    <div className="aspect-[9/16] relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1&controls=1&showinfo=0&rel=0&modestbranding=1`}
                        title={video.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors duration-200">
                        {video.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to action */}
              <div className="text-center mt-8">
                <a
                  href="#dashboard"
                  className="inline-flex items-center px-6 py-3 bg-blue-900/80 rounded-full text-blue-200 font-medium border border-blue-700 hover:bg-blue-800/80 hover:text-blue-100 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Create your own viral baby podcast now!
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 特点列表 */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4 border border-blue-800">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Novel Content Format</h3>
            <p className="text-gray-300">The BabyPodcast format offers a novel twist on traditional podcasts, making complex topics more accessible and entertaining.</p>
          </div>

          <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4 border border-blue-800">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Faceless Content Creation</h3>
            <p className="text-gray-300">BabyPodcast allows creators to produce high-engagement, faceless content optimized for algorithm-based distribution platforms without revealing their identity.</p>
          </div>

          <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4 border border-blue-800">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Evolving Technology</h3>
            <p className="text-gray-300">The BabyGenerator phenomenon represents the perfect intersection of AI technology, creative content production, and social media virality.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 