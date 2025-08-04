'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, Upload, Video, Image as ImageIcon, Wand2, Mic, Play, Download, FileText, Volume2, Settings } from 'lucide-react';
import { useToast } from '../common/Toast';

interface LipsyncGeneratorClientProps {
  currentCredits?: number;
}

export default function LipsyncGeneratorClient({ currentCredits = 0 }: LipsyncGeneratorClientProps) {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // Ensure currentCredits is a valid number
  const validCredits = typeof currentCredits === 'number' && !isNaN(currentCredits) ? currentCredits : 0;

  // Mode selection: 'image-audio' or 'video-audio'
  const [generationMode, setGenerationMode] = useState<'image-audio' | 'video-audio'>('image-audio');

  // Model selection: 'lipsync' or 'lipsync_fast'
  const [selectedModel, setSelectedModel] = useState<'lipsync' | 'lipsync_fast'>('lipsync');

  // Audio input mode: 'text', 'upload', 'record'
  const [audioInputMode, setAudioInputMode] = useState<'text' | 'upload' | 'record'>('text');

  // Form states
  const [audioPrompt, setAudioPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [showCreditsUsed, setShowCreditsUsed] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [enableSubtitles, setEnableSubtitles] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Emily');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Calculate required credits based on model
  const getRequiredCredits = () => {
    return selectedModel === 'lipsync' ? 25 : 15;
  };

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size cannot exceed 5MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video file selection
  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        showToast('Video file size cannot exceed 20MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        showToast('Please select a valid video file', 'error');
        return;
      }

      setVideoFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // Handle audio file selection
  const handleAudioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showToast('Audio file size cannot exceed 10MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.startsWith('audio/')) {
        showToast('Please select a valid audio file', 'error');
        return;
      }

      setAudioFile(file);
    }
  };

  // Remove selected files
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeAudio = () => {
    setAudioFile(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Check if user is logged in
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showToast('Please login to use this feature', 'error');
      router.push('/login');
      return;
    }

    // Validate inputs
    if (generationMode === 'image-audio') {
      if (!imageFile) {
        showToast('Please select an image', 'error');
        return;
      }
    } else {
      if (!videoFile) {
        showToast('Please select a video file', 'error');
        return;
      }
    }

    if (!audioFile && !audioPrompt.trim()) {
      showToast('Please upload audio file or enter audio description', 'error');
      return;
    }

    // Check credits
    const requiredCredits = getRequiredCredits();
    if (validCredits < requiredCredits) {
      showToast(`Insufficient credits, need ${requiredCredits} credits`, 'error');
      return;
    }

    setIsGenerating(true);
    setPreviewVideoUrl(null);
    setShowCreditsUsed(false);

    try {
      // 准备表单数据
      const formData = new FormData();
      formData.append('generationMode', generationMode);
      formData.append('selectedModel', selectedModel);

      if (generationMode === 'image-audio' && imageFile) {
        formData.append('imageFile', imageFile);
      }
      
      if (generationMode === 'video-audio' && videoFile) {
        formData.append('videoFile', videoFile);
      }

      if (audioFile) {
        formData.append('audioFile', audioFile);
      } else if (audioPrompt.trim()) {
        formData.append('audioPrompt', audioPrompt);
      }

      console.log('Sending lipsync generation request...', {
        mode: generationMode,
        model: selectedModel,
        hasImage: !!imageFile,
        hasVideo: !!videoFile,
        hasAudio: !!audioFile,
        audioPrompt: audioPrompt || undefined
      });

      // Call API (temporarily show feature unavailable)
      showToast('This feature is temporarily unavailable, stay tuned!', 'info');
      setIsGenerating(false);
      return;

      // TODO: 实际的 API 调用
      // const response = await fetch('/api/lipsync/generate', {
      //   method: 'POST',
      //   body: formData
      // });

    } catch (error) {
      console.error('Generation error:', error);
      showToast('Generation failed, please try again', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer />

      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #f97316 0%, transparent 50%), radial-gradient(circle at 75% 75%, #ec4899 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative w-full px-6 py-12">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <nav className="inline-flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">
                Home
              </Link>
              <span className="text-gray-600 mx-1">›</span>
              <span className="text-orange-400 font-medium">LipSync Generator</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
              <Video className="text-white" size={32} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
              AI Lip Sync Generator
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform your content with AI-powered lip synchronization. Upload your media and let our advanced AI create perfect lip-sync videos in minutes.
            </p>
            <div className="flex items-center justify-center mt-8 space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                No Sign-up Required
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                High Quality Results
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Fast Processing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Choose Your Input Type */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <div className="w-6 h-6 bg-orange-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs">📁</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Choose Your Input Type</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                    generationMode === 'image-audio'
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-600/50 hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="generationMode"
                      value="image-audio"
                      checked={generationMode === 'image-audio'}
                      onChange={(e) => setGenerationMode(e.target.value as 'image-audio')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className={`${
                          generationMode === 'image-audio' ? 'text-orange-400' : 'text-gray-400'
                        }`} size={24} />
                      </div>
                      <span className="text-white font-medium block text-sm">Image + Audio</span>
                      <span className="text-gray-400 text-xs">Upload a photo and audio</span>
                    </div>
                  </label>

                  <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                    generationMode === 'video-audio'
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-600/50 hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="generationMode"
                      value="video-audio"
                      checked={generationMode === 'video-audio'}
                      onChange={(e) => setGenerationMode(e.target.value as 'video-audio')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Video className={`${
                          generationMode === 'video-audio' ? 'text-orange-400' : 'text-gray-400'
                        }`} size={24} />
                      </div>
                      <span className="text-white font-medium block text-sm">Video + Audio</span>
                      <span className="text-gray-400 text-xs">Upload a video and audio</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Select Quality Level */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <div className="w-6 h-6 bg-purple-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs">✨</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Select Quality Level</h3>
                </div>

                <div className="space-y-3">
                  <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 block ${
                    selectedModel === 'lipsync'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600/50 hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="selectedModel"
                      value="lipsync"
                      checked={selectedModel === 'lipsync'}
                      onChange={(e) => setSelectedModel(e.target.value as 'lipsync')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-semibold block">LipSync Pro</span>
                        <span className="text-gray-400 text-sm">High-quality lip synchronization</span>
                      </div>
                      <div className="text-right">
                        <span className="text-purple-400 font-bold text-lg">25</span>
                        <span className="text-gray-400 text-sm block">Credits</span>
                      </div>
                    </div>
                  </label>

                  <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 block ${
                    selectedModel === 'lipsync_fast'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600/50 hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="selectedModel"
                      value="lipsync_fast"
                      checked={selectedModel === 'lipsync_fast'}
                      onChange={(e) => setSelectedModel(e.target.value as 'lipsync_fast')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-semibold block">LipSync Fast</span>
                        <span className="text-gray-400 text-sm">Fast lip synchronization</span>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 font-bold text-lg">15</span>
                        <span className="text-gray-400 text-sm block">Credits</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Credits Usage */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded mr-3 flex items-center justify-center">
                      <span className="text-white text-xs">⭐</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Credits Usage</h3>
                  </div>
                  <button
                    onClick={() => setShowCreditsUsed(!showCreditsUsed)}
                    className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                  >
                    Show Details
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300 font-medium">Current Credits:</span>
                    <span className="text-yellow-400 font-bold">{validCredits}</span>
                  </div>

                  {showCreditsUsed && (
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300 font-medium">This Generation:</span>
                      <span className="text-orange-400 font-bold">-{getRequiredCredits()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Upload Your Assets */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <div className="w-6 h-6 bg-orange-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs">📤</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Upload Your Assets</h3>
                </div>

                {/* Upload Your Image */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-5 h-5 bg-orange-500 rounded mr-2 flex items-center justify-center">
                      <span className="text-white text-xs">🖼️</span>
                    </div>
                    <h4 className="text-white font-medium">Upload Your Image</h4>
                  </div>

                  {!imagePreview ? (
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600/50 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500/70 hover:bg-orange-500/5 transition-all duration-300"
                    >
                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="text-gray-400" size={32} />
                      </div>
                      <p className="text-white font-medium mb-1">Click to upload your image</p>
                      <p className="text-gray-400 text-sm">Supports JPG, PNG formats • Max 5MB</p>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                        <button
                          onClick={removeImage}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                {/* Add Your Audio */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-5 h-5 bg-orange-500 rounded mr-2 flex items-center justify-center">
                      <span className="text-white text-xs">🎵</span>
                    </div>
                    <h4 className="text-white font-medium">Add Your Audio</h4>
                  </div>

                  {!audioFile ? (
                    <div
                      onClick={() => audioInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600/50 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500/70 hover:bg-orange-500/5 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Mic className="text-gray-400" size={24} />
                      </div>
                      <p className="text-white font-medium mb-1">Click to upload audio file</p>
                      <p className="text-gray-400 text-sm">Supports MP3, WAV formats • Max 10MB</p>
                    </div>
                  ) : (
                    <div className="border-2 border-green-500 bg-green-500/10 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Mic className="text-white" size={24} />
                      </div>
                      <p className="text-white font-medium mb-1">✓ {audioFile.name}</p>
                      <button
                        onClick={removeAudio}
                        className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioSelect}
                    className="hidden"
                  />
                </div>

                {/* Text Input Alternative */}
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-400 text-sm mb-3 text-center">Or enter text to convert to speech</p>
                  <textarea
                    value={audioPrompt}
                    onChange={(e) => setAudioPrompt(e.target.value)}
                    placeholder="Enter text to convert to speech, e.g.: Welcome to our product introduction, today I will show you the latest features..."
                    className="w-full h-24 bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none text-sm"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-xs">{audioPrompt.length}/500 characters</span>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>Generate LipSync Video ({getRequiredCredits()} Credits)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
