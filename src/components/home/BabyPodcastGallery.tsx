'use client';

import Link from 'next/link';
import StarBorder from '../common/StarBorder';
import { AI_BABY_PODCAST_MEDIA } from '../../config/media';
import { VideoLink } from '../common/MediaLink';

export default function BabyPodcastGallery() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative group w-full max-w-md mx-auto">
        {/* Featured Video Badge */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-900/80 rounded-full text-blue-200 font-medium shadow-lg animate-pulse text-sm border border-blue-700">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
            </svg>
            Popular BabyPodcast example with 3.6M views
          </div>
        </div>

        {/* Main Video Container */}
        <div className="relative flex justify-center">
          {/* Hero Podcast Video */}
          <div className="w-80 aspect-[9/16] rounded-2xl shadow-2xl overflow-hidden border-4 border-gray-700 video-container-hover">
            <VideoLink
              src={AI_BABY_PODCAST_MEDIA.hero.featuredVideo}
              alt="Featured Baby Podcast Video"
              title="Featured Video"
              width={320}
              height={568}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/30 rounded-full floating-element"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-cyan-500/30 rounded-full floating-element"></div>
          <div className="absolute top-1/4 -left-6 w-6 h-6 bg-blue-400/30 rounded-full floating-element"></div>
          <div className="absolute bottom-1/4 -right-6 w-6 h-6 bg-cyan-400/30 rounded-full floating-element"></div>

          {/* Floating Icons */}
          <div className="absolute top-8 left-8 text-blue-400 animate-float">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
            </svg>
          </div>
          <div className="absolute bottom-8 right-8 text-cyan-400 animate-float delay-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        {/* Success Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center w-full max-w-sm mx-auto">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-700">
            <div className="text-lg font-bold text-blue-400">5K+</div>
            <div className="text-xs text-gray-400">Creators</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-700">
            <div className="text-lg font-bold text-cyan-400">10K+</div>
            <div className="text-xs text-gray-400">Videos Created</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-700">
            <div className="text-lg font-bold text-blue-400">2min</div>
            <div className="text-xs text-gray-400">Generation Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
