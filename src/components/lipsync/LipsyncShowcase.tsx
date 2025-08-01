'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, TrendingUp, Eye, Heart, Share2 } from 'lucide-react';

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
    title: 'Portrait LipSync Demo',
    description: 'Perfect lip synchronization with audio',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-1.webm',
    category: 'Portrait',
    views: '3.2M',
    likes: '125K',
    shares: '18K',
    platform: 'tiktok',
    trending: true,
    featured: true,
    size: 'large'
  },
  {
    id: '2',
    title: 'Character Voice Acting',
    description: 'Animated character with voice sync',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-2.webm',
    category: 'Character',
    views: '2.8M',
    likes: '98K',
    shares: '14K',
    platform: 'instagram',
    trending: true,
    size: 'medium'
  },
  {
    id: '3',
    title: 'Multilingual Speech',
    description: 'Perfect sync in multiple languages',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-1.webm',
    category: 'Multilingual',
    views: '2.1M',
    likes: '87K',
    shares: '12K',
    platform: 'youtube',
    size: 'medium'
  },
  {
    id: '4',
    title: 'Music Video Sync',
    description: 'Singing with perfect lip sync',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-2.webm',
    category: 'Music',
    views: '1.9M',
    likes: '76K',
    shares: '11K',
    platform: 'tiktok',
    size: 'medium'
  },
  {
    id: '5',
    title: 'Educational Content',
    description: 'Clear speech for learning videos',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-1.webm',
    category: 'Education',
    views: '1.5M',
    likes: '65K',
    shares: '9K',
    platform: 'instagram',
    size: 'medium'
  },
  {
    id: '6',
    title: 'Commercial Voiceover',
    description: 'Professional commercial sync',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-2.webm',
    category: 'Commercial',
    views: '1.2M',
    likes: '52K',
    shares: '7K',
    platform: 'youtube',
    size: 'medium'
  }
];

export default function LipsyncShowcase() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set(['2', '5', '6', '1', '4', '3']));
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);
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

  const toggleMute = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (video) {
      video.muted = !video.muted;
      const newMutedVideos = new Set(mutedVideos);
      if (video.muted) {
        newMutedVideos.add(videoId);
      } else {
        newMutedVideos.delete(videoId);
      }
      setMutedVideos(newMutedVideos);
    }
  };

  const openFullscreen = (videoId: string) => {
    setFullscreenVideo(videoId);
  };

  const closeFullscreen = () => {
    setFullscreenVideo(null);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return '🎵';
      case 'instagram':
        return '📸';
      case 'youtube':
        return '📺';
      case 'twitter':
        return '🐦';
      default:
        return '🎬';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'from-pink-500 to-red-500';
      case 'instagram':
        return 'from-purple-500 to-pink-500';
      case 'youtube':
        return 'from-red-500 to-red-600';
      case 'twitter':
        return 'from-blue-400 to-blue-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">AI LipSync Showcase</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Free AI Lip Sync Videos Created with
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"> Advanced Technology</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create high-quality lip-synced videos completely free. Upload your video and audio,
            and our AI automatically matches lips for smooth, natural synchronization.
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
              {/* Video Card */}
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl group-hover:shadow-orange-500/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-orange-500/30">
                <div className="relative aspect-video overflow-hidden">
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    src={video.videoUrl}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loop
                    muted={mutedVideos.has(video.id)}
                    playsInline
                  />
                  
                  {/* Video Overlay Controls */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => togglePlay(video.id)}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                      >
                        {playingVideo === video.id ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button
                        onClick={() => toggleMute(video.id)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                      >
                        {mutedVideos.has(video.id) ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <button
                        onClick={() => openFullscreen(video.id)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                      >
                        <Maximize2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Platform Badge */}
                  <div className={`absolute top-3 left-3 bg-gradient-to-r ${getPlatformColor(video.platform)} px-2 py-1 rounded-full text-white text-xs font-medium flex items-center space-x-1 shadow-lg`}>
                    <span>{getPlatformIcon(video.platform)}</span>
                    <span className="capitalize">{video.platform}</span>
                  </div>

                  {/* Trending Badge */}
                  {video.trending && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 rounded-full text-white text-xs font-medium flex items-center space-x-1 shadow-lg">
                      <TrendingUp size={12} />
                      <span>Trending</span>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{video.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye size={12} />
                        <span>{video.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart size={12} />
                        <span>{video.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share2 size={12} />
                        <span>{video.shares}</span>
                      </div>
                    </div>
                    <span className="bg-gray-700/50 px-2 py-1 rounded text-xs">{video.category}</span>
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
              Ready to Create Your Own LipSync Videos?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of creators who are already making amazing lip-sync content with our AI technology.
            </p>
            <a
              href="#dashboard"
              className="inline-flex items-center bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Creating LipSync Videos Now
              <Sparkles className="ml-2" size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenVideo && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <video
              src={showcaseVideos.find(v => v.id === fullscreenVideo)?.videoUrl}
              className="w-full h-full object-contain rounded-lg"
              controls
              autoPlay
            />
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
