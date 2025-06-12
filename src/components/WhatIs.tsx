'use client';

import { AI_BABY_PODCAST_MEDIA } from '../config/media';
import { VideoLink, MediaGrid } from './MediaLink';

export default function WhatIs() {
  // 定义四个病毒视频示例
  const videoExamples = [
    {
      video: AI_BABY_PODCAST_MEDIA.examples.viralVideos.example1,
      thumbnail: AI_BABY_PODCAST_MEDIA.examples.thumbnails.thumb1,
      fallbackVideoId: 'EuWy150zyp8' // YouTube fallback
    },
    {
      video: AI_BABY_PODCAST_MEDIA.examples.viralVideos.example2,
      thumbnail: AI_BABY_PODCAST_MEDIA.examples.thumbnails.thumb2,
      fallbackVideoId: 'Oj_2aW7p0qc' // YouTube fallback
    },
    {
      video: AI_BABY_PODCAST_MEDIA.examples.viralVideos.example3,
      thumbnail: AI_BABY_PODCAST_MEDIA.examples.thumbnails.thumb3,
      fallbackVideoId: 'XKEbMspIrfo' // YouTube fallback
    },
    {
      video: AI_BABY_PODCAST_MEDIA.examples.viralVideos.example4,
      thumbnail: AI_BABY_PODCAST_MEDIA.examples.thumbnails.thumb4,
      fallbackVideoId: 'SA6SqTUiimY' // YouTube fallback
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

              {/* Podcast Examples Gallery */}
              <MediaGrid
                items={videoExamples.map((example, index) => ({
                  src: example.video,
                  alt: `Baby Podcast Example ${index + 1}`,
                  type: 'video' as const,
                  title: `Viral Example ${index + 1}`,
                  width: 300,
                  height: 533
                }))}
                columns={4}
                className="max-w-6xl mx-auto"
              />

              {/* Call to action */}
              <div className="text-center mt-8">
                <div className="inline-flex items-center px-6 py-3 bg-blue-900/80 rounded-full text-blue-200 font-medium border border-blue-700">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Create your own viral baby podcast now!
                </div>
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