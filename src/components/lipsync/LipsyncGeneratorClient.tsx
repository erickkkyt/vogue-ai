'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, Upload, Video, Image as ImageIcon, Wand2, Mic, Play, Download } from 'lucide-react';
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
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="inline-flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Home
              </Link>
              <span className="text-gray-500 mx-1">›</span>
              <span className="text-orange-400 font-medium">LipSync Generator</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-4">
              Free AI Lip Sync Generator
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Just upload your audio and video, and AI will automatically match your lips for smooth, natural lip syncing.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left side: Upload Section */}
          <div className="space-y-8">
            {/* Generation Mode Selection */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Video className="mr-3 text-orange-400" size={24} />
                Choose Your Input Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                  generationMode === 'image-audio'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-600 hover:border-gray-500'
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
                    <ImageIcon className={`mx-auto mb-3 ${
                      generationMode === 'image-audio' ? 'text-orange-400' : 'text-gray-400'
                    }`} size={32} />
                    <span className="text-white font-semibold block">Image + Audio</span>
                    <span className="text-gray-400 text-sm">Upload a photo and audio</span>
                  </div>
                </label>
                <label className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                  generationMode === 'video-audio'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-600 hover:border-gray-500'
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
                    <Video className={`mx-auto mb-3 ${
                      generationMode === 'video-audio' ? 'text-orange-400' : 'text-gray-400'
                    }`} size={32} />
                    <span className="text-white font-semibold block">Video + Audio</span>
                    <span className="text-gray-400 text-sm">Upload a video and audio</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Model Selection */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Sparkles className="mr-3 text-purple-400" size={24} />
                Select Quality Level
              </h3>
              <div className="space-y-4">
                <label className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedModel === 'lipsync'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-600 hover:border-gray-500'
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
                      <span className="text-white font-semibold text-lg block">LipSync Pro</span>
                      <span className="text-gray-400">High-quality lip synchronization</span>
                    </div>
                    <div className="text-right">
                      <span className="text-purple-400 font-bold text-lg">25</span>
                      <span className="text-gray-400 text-sm block">Credits</span>
                    </div>
                  </div>
                </label>
                <label className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedModel === 'lipsync_fast'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-600 hover:border-gray-500'
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
                      <span className="text-white font-semibold text-lg block">LipSync Fast</span>
                      <span className="text-gray-400">Fast lip synchronization</span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-bold text-lg">15</span>
                      <span className="text-gray-400 text-sm block">Credits</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Credits Display */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="mr-3 text-yellow-400" size={24} />
                  Credits Usage
                </h3>
                <button
                  onClick={() => setShowCreditsUsed(!showCreditsUsed)}
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors px-4 py-2 rounded-lg border border-orange-400/30 hover:border-orange-400/50"
                >
                  {showCreditsUsed ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-300 font-medium">Current Credits:</span>
                  <span className="text-yellow-400 font-bold text-xl">{validCredits}</span>
                </div>

                {showCreditsUsed && (
                  <>
                    <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300 font-medium">This Generation:</span>
                      <span className="text-red-400 font-bold text-xl">-{getRequiredCredits()}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg border-2 border-green-500/30">
                      <span className="text-gray-300 font-medium">Remaining Credits:</span>
                      <span className="text-green-400 font-bold text-xl">{Math.max(0, validCredits - getRequiredCredits())}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Upload and Preview */}
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Upload className="mr-3 text-orange-400" size={24} />
                Upload Your Assets
              </h3>

              <div className="space-y-8">
                {/* Image/Video Upload */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
                    {generationMode === 'image-audio' ? (
                      <>
                        <ImageIcon className="mr-2 text-orange-400" size={20} />
                        Upload Your Image
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 text-orange-400" size={20} />
                        Upload Your Video
                      </>
                    )}
                  </h4>

                  {generationMode === 'image-audio' ? (
                    // Image Upload
                    <div className="space-y-4">
                      {!imagePreview ? (
                        <div
                          onClick={() => imageInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300"
                        >
                          <ImageIcon className="mx-auto mb-6 text-gray-400" size={64} />
                          <p className="text-white text-lg font-medium mb-2">Click to upload your image</p>
                          <p className="text-gray-400">Supports JPG, PNG formats • Max 5MB</p>
                        </div>
                      ) : (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-2xl"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                            <button
                              onClick={removeImage}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  ) : (
                    // Video Upload
                    <div className="space-y-4">
                      {!videoPreview ? (
                        <div
                          onClick={() => videoInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300"
                        >
                          <Video className="mx-auto mb-6 text-gray-400" size={64} />
                          <p className="text-white text-lg font-medium mb-2">Click to upload your video</p>
                          <p className="text-gray-400">Supports MP4, MOV formats • Max 20MB</p>
                        </div>
                      ) : (
                        <div className="relative group">
                          <video
                            src={videoPreview}
                            className="w-full h-64 object-cover rounded-2xl"
                            controls
                          />
                          <button
                            onClick={removeVideo}
                            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}

                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoSelect}
                        className="hidden"
                      />
                    </div>
                  )}
              </div>

                {/* Audio Upload or Text Input */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Mic className="mr-2 text-orange-400" size={20} />
                    Add Your Audio
                  </h4>

                  <div className="space-y-6">
                    {/* Audio File Upload */}
                    <div>
                      <div
                        onClick={() => audioInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                          audioFile
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-600 hover:border-orange-500 hover:bg-orange-500/5'
                        }`}
                      >
                        <Mic className={`mx-auto mb-4 ${audioFile ? 'text-green-400' : 'text-gray-400'}`} size={48} />
                        <p className="text-white text-lg font-medium mb-2">
                          {audioFile ? `✓ ${audioFile.name}` : 'Click to upload audio file'}
                        </p>
                        <p className="text-gray-400">Supports MP3, WAV formats • Max 10MB</p>
                        {audioFile && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAudio();
                            }}
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                          >
                            Remove File
                          </button>
                        )}
                      </div>

                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioSelect}
                        className="hidden"
                      />
                    </div>

                    {/* Or Text Input */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-800 text-gray-400">Or enter text to convert to speech</span>
                      </div>
                    </div>

                    <div>
                      <textarea
                        value={audioPrompt}
                        onChange={(e) => setAudioPrompt(e.target.value)}
                        placeholder="Enter text to convert to speech, e.g.: Welcome to our product introduction, today I will show you the latest features..."
                        className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-lg"
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-400">
                          {audioPrompt.length}/500 characters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

              {/* Generate Button */}
              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Generating Your LipSync Video...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      <span>Generate LipSync Video ({getRequiredCredits()} Credits)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  Video Preview
                </h3>
                <p className="text-gray-400 mt-2">Your generated lip-sync video will appear here</p>
              </div>

              {/* Preview content */}
              <div className="relative">
                {previewVideoUrl ? (
                  <div className="relative">
                    <video
                      src={previewVideoUrl}
                      className="w-full h-80 object-cover rounded-2xl"
                      controls
                      poster="/placeholder-video.jpg"
                    />
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors">
                        <Play size={20} />
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors">
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-600 rounded-2xl bg-gray-700/20">
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-400 mb-6"></div>
                        <p className="text-white text-lg font-medium mb-2">Generating your lip-sync video...</p>
                        <p className="text-gray-400">This may take a few minutes</p>
                      </>
                    ) : (
                      <>
                        <Video className="text-gray-400 mb-6" size={64} />
                        <p className="text-white text-lg font-medium mb-2">Ready to create magic?</p>
                        <p className="text-gray-400 text-center max-w-md">
                          Upload your {generationMode === 'image-audio' ? 'image' : 'video'} and audio, then click generate to see your lip-sync video here
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
