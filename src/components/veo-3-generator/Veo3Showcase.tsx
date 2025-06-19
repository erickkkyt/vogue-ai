'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, Sparkles, TrendingUp, Eye, Heart, Share2 } from 'lucide-react';

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
    title: 'AI Bigfoot Vlog',
    description: 'Mysterious forest adventure with the legendary Bigfoot sharing daily life',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/tiktokio.com_JhrWc1e2nj09KyV0iAHs.mp4',
    category: 'Adventure Vlog',
    views: '2.8M',
    likes: '220K',
    shares: '45K',
    platform: 'tiktok',
    trending: true,
    featured: true,
    size: 'large'
  },
  {
    id: '2',
    title: 'AI Stormtrooper Vlog',
    description: 'Behind-the-scenes life of a Stormtrooper in the galactic empire',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/%E4%B8%8B%E8%BD%BD%20(1).mp4',
    category: 'Sci-Fi Vlog',
    views: '4.2M',
    likes: '380K',
    shares: '92K',
    platform: 'instagram',
    trending: true,
    size: 'medium'
  },
  {
    id: '3',
    title: 'AI Saturn Cow',
    description: 'Surreal space adventure featuring a cosmic cow exploring Saturn\'s rings',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/%E4%B8%8B%E8%BD%BD%20(2).mp4',
    category: 'Surreal Art',
    views: '1.9M',
    likes: '150K',
    shares: '28K',
    platform: 'youtube',
    size: 'medium'
  },
  {
    id: '4',
    title: 'Cutting Glass Vegetables AI ASMR',
    description: 'Satisfying glass vegetable cutting sounds that mesmerize millions',
    videoUrl: 'https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/%E4%B8%8B%E8%BD%BD.mp4',
    category: 'ASMR',
    views: '3.1M',
    likes: '275K',
    shares: '67K',
    platform: 'twitter',
    featured: true,
    size: 'large'
  }
];

export default function Veo3Showcase() {
  const router = useRouter();
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set(['1', '2', '3', '4']));
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
              Viral Videos Made with Veo 3
            </span>
          </h2>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Join millions of creators who are already using Veo 3 to bring their wildest ideas to life
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

        {/* Custom Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max">
          {/* Video 1 - AI Bigfoot Vlog (Large, spans 2 columns) */}
          <div
            className="group relative md:col-span-2 md:row-span-2"
            onMouseEnter={() => setHoveredVideo('1')}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            {/* Video Card for Video 1 */}
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-purple-500/30">
              <div className="relative aspect-[9/16] overflow-hidden">
                <video
                  ref={(el) => (videoRefs.current['1'] = el)}
                  src={showcaseVideos[0].videoUrl}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loop
                  muted={mutedVideos.has('1')}
                  playsInline
                  preload="metadata"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className={`bg-gradient-to-r ${getPlatformColor(showcaseVideos[0].platform)} px-3 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1 shadow-lg`}>
                    <span>{getPlatformIcon(showcaseVideos[0].platform)}</span>
                    <span className="capitalize">{showcaseVideos[0].platform}</span>
                  </div>

                  {showcaseVideos[0].trending && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1 shadow-lg animate-pulse">
                      <TrendingUp className="w-3 h-3" />
                      <span>VIRAL</span>
                    </div>
                  )}
                </div>

                {/* Play Controls */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => togglePlay('1')}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    >
                      {playingVideo === '1' ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleMute('1')}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                    >
                      {mutedVideos.has('1') ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>

                    <button
                      onClick={() => openFullscreen('1')}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                    >
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-3">
                    <span className="text-white text-xs font-medium">{showcaseVideos[0].category}</span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                    {showcaseVideos[0].title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed opacity-90">
                    {showcaseVideos[0].description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Eye className="w-3 h-3" />
                        <span>{showcaseVideos[0].views}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Heart className="w-3 h-3" />
                        <span>{showcaseVideos[0].likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Share2 className="w-3 h-3" />
                        <span>{showcaseVideos[0].shares}</span>
                      </div>
                    </div>

                    {showcaseVideos[0].featured && (
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs font-medium">Featured</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Videos 2 & 3 - Medium size */}
          {showcaseVideos.slice(1, 3).map((video, index) => (
            <div
              key={video.id}
              className="group relative md:col-span-1 md:row-span-1"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-purple-500/30">
                <div className="relative aspect-[9/16] overflow-hidden">
                  <video
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    src={video.videoUrl}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loop
                    muted={mutedVideos.has(video.id)}
                    playsInline
                    preload="metadata"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className={`bg-gradient-to-r ${getPlatformColor(video.platform)} px-2 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1 shadow-lg`}>
                      <span>{getPlatformIcon(video.platform)}</span>
                      <span className="capitalize">{video.platform}</span>
                    </div>

                    {video.trending && (
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1 shadow-lg animate-pulse">
                        <TrendingUp className="w-3 h-3" />
                        <span>VIRAL</span>
                      </div>
                    )}
                  </div>

                  {/* Play Controls */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => togglePlay(video.id)}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                      >
                        {playingVideo === video.id ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-1" />
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

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2 py-1 mb-2">
                      <span className="text-white text-xs font-medium">{video.category}</span>
                    </div>

                    <h3 className="text-white font-bold text-base mb-1 leading-tight">
                      {video.title}
                    </h3>
                    <p className="text-gray-300 text-xs mb-3 leading-relaxed opacity-90 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs">
                        <div className="flex items-center space-x-1 text-gray-300">
                          <Eye className="w-3 h-3" />
                          <span>{video.views}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-300">
                          <Heart className="w-3 h-3" />
                          <span>{video.likes}</span>
                        </div>
                      </div>

                      {video.featured && (
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Sparkles className="w-3 h-3" />
                          <span className="text-xs font-medium">Featured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}



          {/* Video 4 - AI ASMR (Large, spans 2 columns, 2 rows) */}
          <div
            className="group relative md:col-span-2 md:row-span-2 lg:col-start-3"
            onMouseEnter={() => setHoveredVideo('4')}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-purple-500/30 h-full">
              <div className="relative aspect-[9/16] overflow-hidden h-full">
                <video
                  ref={(el) => (videoRefs.current['4'] = el)}
                  src={showcaseVideos[3].videoUrl}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loop
                  muted={mutedVideos.has('4')}
                  playsInline
                  preload="metadata"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className={`bg-gradient-to-r ${getPlatformColor(showcaseVideos[3].platform)} px-3 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1 shadow-lg`}>
                    <span>{getPlatformIcon(showcaseVideos[3].platform)}</span>
                    <span className="capitalize">{showcaseVideos[3].platform}</span>
                  </div>

                  {showcaseVideos[3].featured && (
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      <span>FEATURED</span>
                    </div>
                  )}
                </div>

                {/* Play Controls */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => togglePlay('4')}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    >
                      {playingVideo === '4' ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleMute('4')}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                    >
                      {mutedVideos.has('4') ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>

                    <button
                      onClick={() => openFullscreen('4')}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                    >
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-3">
                    <span className="text-white text-xs font-medium">{showcaseVideos[3].category}</span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                    {showcaseVideos[3].title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed opacity-90">
                    {showcaseVideos[3].description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Eye className="w-3 h-3" />
                        <span>{showcaseVideos[3].views}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Heart className="w-3 h-3" />
                        <span>{showcaseVideos[3].likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Share2 className="w-3 h-3" />
                        <span>{showcaseVideos[3].shares}</span>
                      </div>
                    </div>

                    {showcaseVideos[3].featured && (
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs font-medium">Featured</span>
                      </div>
                    )}
                  </div>
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
