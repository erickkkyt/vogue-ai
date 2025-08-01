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
    id: '2',
    title: 'AI Dynamic Scene',
    description: 'Mesmerizing dynamic scenes created with advanced AI technology',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0718-3.webm',
    category: 'Dynamic Art',
    views: '2.7M',
    likes: '195K',
    shares: '38K',
    platform: 'instagram',
    trending: true,
    size: 'medium'
  },
  {
    id: '5',
    title: 'AI Abstract Art',
    description: 'Abstract artistic expressions brought to life through AI innovation',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0718-6.webm',
    category: 'Abstract Art',
    views: '2.9M',
    likes: '230K',
    shares: '41K',
    platform: 'instagram',
    trending: true,
    size: 'medium'
  },
  {
    id: '6',
    title: 'AI Future Vision',
    description: 'Futuristic visions and concepts visualized with AI precision',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0718-7.webm',
    category: 'Futuristic',
    views: '3.8M',
    likes: '295K',
    shares: '58K',
    platform: 'youtube',
    featured: true,
    size: 'medium'
  },
  {
    id: '1',
    title: 'AI Creative Vision',
    description: 'Stunning AI-generated visual storytelling that captivates audiences',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-3.webm',
    category: 'Creative Art',
    views: '3.2M',
    likes: '280K',
    shares: '52K',
    platform: 'tiktok',
    trending: true,
    featured: true,
    size: 'large'
  },
  {
    id: '4',
    title: 'AI Cinematic Story',
    description: 'Cinematic storytelling powered by cutting-edge AI generation',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-5.webm',
    category: 'Cinematic',
    views: '5.3M',
    likes: '425K',
    shares: '89K',
    platform: 'twitter',
    featured: true,
    size: 'large'
  },
  {
    id: '3',
    title: 'AI Visual Magic',
    description: 'Magical visual effects that push the boundaries of creativity',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-4.webm',
    category: 'Visual Effects',
    views: '4.1M',
    likes: '320K',
    shares: '67K',
    platform: 'youtube',
    size: 'medium'
  }
];

export default function Veo3Showcase() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set(['2', '5', '6', '1', '4', '3']));
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    // Auto-play preview for hovered videos
    Object.keys(videoRefs.current).forEach(videoId => {
      const video = videoRefs.current[videoId];
      if (video) {
        if (hoveredVideo === videoId) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else if (playingVideo !== videoId) {
          video.pause();
        }
      }
    });
  }, [hoveredVideo, playingVideo]);

  const togglePlay = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (video) {
      if (playingVideo === videoId) {
        video.pause();
        setPlayingVideo(null);
      } else {
        video.play().catch(() => {});
        setPlayingVideo(videoId);
      }
    }
  };

  const toggleMute = (videoId: string) => {
    const newMutedVideos = new Set(mutedVideos);
    if (newMutedVideos.has(videoId)) {
      newMutedVideos.delete(videoId);
    } else {
      newMutedVideos.add(videoId);
    }
    setMutedVideos(newMutedVideos);

    const video = videoRefs.current[videoId];
    if (video) {
      video.muted = newMutedVideos.has(videoId);
    }
  };

  const openFullscreen = (videoId: string) => {
    setFullscreenVideo(videoId);
  };

  const closeFullscreen = () => {
    setFullscreenVideo(null);
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      tiktok: '🎵',
      instagram: '📸',
      youtube: '📺',
      twitter: '🐦'
    };
    return icons[platform as keyof typeof icons] || '🎬';
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      tiktok: 'from-pink-500 to-red-500',
      instagram: 'from-purple-500 to-pink-500',
      youtube: 'from-red-500 to-red-600',
      twitter: 'from-blue-400 to-blue-500'
    };
    return colors[platform as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <section id="viral-videos" className="py-20 px-4 relative overflow-hidden">
      {/* Sophisticated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.15),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(139,92,246,0.05)_60deg,transparent_120deg)]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Viral Videos Made with veo3
            </span>
          </h2>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Join millions of creators who are already using veo3 to bring their wildest ideas to life
              and create content that captures the world's attention.
            </p>
          </div>

          {/* Elegant Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-8 py-3 border border-white/10 min-w-[180px]">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="text-white font-bold text-lg">1B+ Total Views</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-8 py-3 border border-white/10 min-w-[150px]">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="text-white font-bold text-lg">13M+ Likes</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-8 py-3 border border-white/10 min-w-[160px]">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="text-white font-bold text-lg">1M+ Shares</span>
              </div>
            </div>
          </div>
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
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-purple-500/30">
                <div className="relative aspect-video overflow-hidden">
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    src={video.videoUrl}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    loop
                    muted={mutedVideos.has(video.id)}
                    playsInline
                    preload="metadata"
                  />

                  {/* Play Controls */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => togglePlay(video.id)}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                      >
                        {playingVideo === video.id ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={() => toggleMute(video.id)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                      >
                        {mutedVideos.has(video.id) ? (
                          <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => openFullscreen(video.id)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                      >
                        <Maximize2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}


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
