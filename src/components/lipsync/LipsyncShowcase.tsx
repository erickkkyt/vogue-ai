'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, TrendingUp, Eye, Heart, Share2, Video } from 'lucide-react';

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
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(236,72,153,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.1),transparent_40%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <Video className="w-4 h-4 mr-3 text-pink-400" />
            <span className="text-pink-400 text-sm font-medium tracking-wide">Live Showcase</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Discover The Magic Power Of
            <span className="bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 bg-clip-text text-transparent"> LipSync</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience the revolutionary AI technology that transforms any video into perfectly synchronized content.
          </p>

          {/* Performance Stats */}
          <div className="flex flex-wrap justify-center gap-12 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-gray-400 text-sm font-medium">Sync Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                &lt;2min
              </div>
              <div className="text-gray-400 text-sm font-medium">Processing Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-gray-400 text-sm font-medium">Languages</div>
            </div>
          </div>
        </div>

        {/* Three Feature Showcases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1: Real-time Processing */}
          <div className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 hover:border-pink-500/30 transition-all duration-300 hover:bg-slate-900/80">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors duration-300">
                Real-time Processing
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Advanced AI algorithms process your content in real-time, delivering professional-quality lip synchronization in under 2 minutes.
              </p>
            </div>
          </div>

          {/* Feature 2: Perfect Accuracy */}
          <div className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 hover:border-pink-500/30 transition-all duration-300 hover:bg-slate-900/80">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                99.9% Accuracy
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Industry-leading precision with natural mouth movements and perfect timing that rivals professional studio productions.
              </p>
            </div>
          </div>

          {/* Feature 3: Universal Compatibility */}
          <div className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 hover:border-pink-500/30 transition-all duration-300 hover:bg-slate-900/80">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                Universal Compatibility
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Works with any video format and supports multiple languages, making it perfect for global content creation.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-slate-900/60 border border-slate-700/40 rounded-3xl p-10 max-w-4xl mx-auto backdrop-blur-md relative overflow-hidden">
            {/* Subtle Background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Create Your Own
                <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent"> LipSync Videos</span>
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join thousands of creators using our AI technology to produce professional lip-sync content.
                Start creating high-quality videos in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a
                  href="#dashboard"
                  className="inline-flex items-center bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Video className="mr-2" size={18} />
                  Start Creating Free
                </a>

                <div className="flex items-center space-x-4 text-gray-400 text-sm">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                    No Credit Card
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Instant Results
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    HD Quality
                  </span>
                </div>
              </div>
            </div>
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
