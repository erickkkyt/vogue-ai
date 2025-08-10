'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Sparkles } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  views: string;
  likes: string;
  shares: string;
  platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter';
  trending?: boolean;
  featured?: boolean;
  size?: 'large' | 'medium';
}

const showcaseVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Ballet Dance Performance',
    description: 'Elegant ballet dancer in moonlight',
    videoUrl: 'https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/0806v2.webm',
    category: 'Ballet',
    views: '2.1M',
    likes: '89K',
    shares: '12K',
    platform: 'tiktok',
    trending: true,
    featured: true,
    size: 'large'
  },
  {
    id: '2',
    title: 'Hip Hop Street Dance',
    description: 'Urban street dance with dynamic moves',
    videoUrl: 'https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/0806v3.webm',
    category: 'Hip Hop',
    views: '1.8M',
    likes: '76K',
    shares: '9K',
    platform: 'instagram',
    trending: true,
    size: 'medium'
  },
  {
    id: '3',
    title: 'Contemporary Dance',
    description: 'Fluid contemporary dance movements',
    videoUrl: 'https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/0806v4.webm',
    category: 'Contemporary',
    views: '1.5M',
    likes: '65K',
    shares: '8K',
    platform: 'youtube',
    size: 'medium'
  },
  {
    id: '4',
    title: 'Latin Salsa Dance',
    description: 'Passionate salsa dance performance',
    videoUrl: 'https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/0806v5.webm',
    category: 'Latin',
    views: '1.2M',
    likes: '54K',
    shares: '7K',
    platform: 'tiktok',
    size: 'medium'
  },
  {
    id: '5',
    title: 'Jazz Dance Routine',
    description: 'Energetic jazz dance with style',
    videoUrl: 'https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/0806v6.webm',
    category: 'Jazz',
    views: '980K',
    likes: '42K',
    shares: '5K',
    platform: 'instagram',
    size: 'medium'
  },
  {
    id: '6',
    title: 'Breakdance Battle',
    description: 'Dynamic breakdance performance',
    videoUrl: 'https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/0806v7.webm',
    category: 'Breakdance',
    views: '850K',
    likes: '38K',
    shares: '4K',
    platform: 'youtube',
    size: 'medium'
  }
];

export default function SeedanceShowcase() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const togglePlay = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (video) {
      if (playingVideo === videoId) {
        video.pause();
        setPlayingVideo(null);
      } else {
        // Pause all other videos
        Object.values(videoRefs.current).forEach(v => v?.pause());
        video.play();
        setPlayingVideo(videoId);
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-green-400" />
            <span className="text-green-400 text-sm font-medium">AI Dance Showcase</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional Dance Videos Created with
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"> Seedance AI</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience next-generation video creation with our advanced AI technology.
            Transform text descriptions or static images into dynamic dance videos with professional quality.
          </p>
        </div>

        {/* 6-Video Grid Layout - 2 rows, 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {showcaseVideos.map((video) => (
            <div
              key={video.id}
              className="group relative"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              {/* Video Card - Simplified */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl group-hover:shadow-green-500/20 transition-all duration-500 group-hover:scale-[1.02]">
                <div className="relative aspect-video overflow-hidden">
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    autoPlay
                  />

                  {/* Simple Play/Pause Control */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => togglePlay(video.id)}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                    >
                      {playingVideo === video.id ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/50 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Create Your Own Dance Videos?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of creators who are already making amazing dance content with Seedance AI Generator.
            </p>
            <a
              href="#dashboard"
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Creating Dance Videos Now
              <Sparkles className="ml-2" size={16} />
            </a>
          </div>
        </div>
      </div>


    </section>
  );
}
