'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, Upload, Video, Image as ImageIcon, Wand2, Mic } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto">
      <ToastContainer />
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left side: Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Generation Mode Selection */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Video className="mr-2 text-blue-400" size={20} />
              Generation Mode
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="generationMode"
                  value="image-audio"
                  checked={generationMode === 'image-audio'}
                  onChange={(e) => setGenerationMode(e.target.value as 'image-audio')}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                />
                <span className="text-white font-medium">Image + Audio</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="generationMode"
                  value="video-audio"
                  checked={generationMode === 'video-audio'}
                  onChange={(e) => setGenerationMode(e.target.value as 'video-audio')}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                />
                <span className="text-white font-medium">Video + Audio</span>
              </label>
            </div>
          </div>

          {/* Model Selection */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Sparkles className="mr-2 text-purple-400" size={20} />
              Generation Model
              <button className="ml-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-gray-600/30 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="selectedModel"
                    value="lipsync"
                    checked={selectedModel === 'lipsync'}
                    onChange={(e) => setSelectedModel(e.target.value as 'lipsync')}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-white font-medium">LipSync Pro</span>
                    <p className="text-xs text-gray-400">High-quality lip synchronization</p>
                  </div>
                </div>
                <span className="text-purple-400 font-bold text-sm">25 Credits</span>
              </label>
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-gray-600/30 hover:border-green-500/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="selectedModel"
                    value="lipsync_fast"
                    checked={selectedModel === 'lipsync_fast'}
                    onChange={(e) => setSelectedModel(e.target.value as 'lipsync_fast')}
                    className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 focus:ring-green-500"
                  />
                  <div>
                    <span className="text-white font-medium">LipSync Fast</span>
                    <p className="text-xs text-gray-400">Fast lip synchronization</p>
                  </div>
                </div>
                <span className="text-green-400 font-bold text-sm">15 Credits</span>
              </label>
            </div>
          </div>

          {/* Credits Display */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Sparkles className="mr-2 text-yellow-400" size={20} />
                Credits Usage
              </h3>
              <button
                onClick={() => setShowCreditsUsed(!showCreditsUsed)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {showCreditsUsed ? 'Hide' : 'Show'}
              </button>
            </div>

            {showCreditsUsed && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Credits:</span>
                  <span className="text-yellow-400 font-bold">{validCredits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">This Generation:</span>
                  <span className="text-red-400 font-bold">{getRequiredCredits()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                  <span className="text-gray-300">Remaining Credits:</span>
                  <span className="text-green-400 font-bold">{Math.max(0, validCredits - getRequiredCredits())}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Input and Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Section */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Upload className="mr-2 text-orange-400" size={20} />
              Upload Files
            </h3>
            
            <div className="space-y-6">
              {/* Image/Video Upload */}
              <div>
                <h4 className="text-white font-medium mb-3">
                  {generationMode === 'image-audio' ? 'Upload Image' : 'Upload Video'}
                </h4>
                
                {generationMode === 'image-audio' ? (
                  // Image Upload
                  <div className="space-y-4">
                    {!imagePreview ? (
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-300 mb-2">Click to upload image</p>
                        <p className="text-sm text-gray-500">Supports JPG, PNG formats, max 5MB</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
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
                        className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <Video className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-300 mb-2">Click to upload video</p>
                        <p className="text-sm text-gray-500">Supports MP4, MOV formats, max 20MB</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <video
                          src={videoPreview}
                          className="w-full h-48 object-cover rounded-xl"
                          controls
                        />
                        <button
                          onClick={removeVideo}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <h4 className="text-white font-medium mb-3">Audio Input</h4>
                
                <div className="space-y-4">
                  {/* Audio File Upload */}
                  <div>
                    <div
                      onClick={() => audioInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
                    >
                      <Mic className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-gray-300 mb-1">
                        {audioFile ? `Selected: ${audioFile.name}` : 'Click to upload audio file'}
                      </p>
                      <p className="text-sm text-gray-500">Supports MP3, WAV formats, max 10MB</p>
                      {audioFile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAudio();
                          }}
                          className="mt-2 text-red-400 hover:text-red-300 text-sm"
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
                  <div className="text-center text-gray-400">Or</div>

                  <div>
                    <textarea
                      value={audioPrompt}
                      onChange={(e) => setAudioPrompt(e.target.value)}
                      placeholder="Enter text to convert to speech, e.g.: Welcome to our product introduction, today I will show you the latest features..."
                      className="w-full h-24 bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        {audioPrompt.length}/500 characters
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

          {/* Preview Section */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                <h3 className="text-xl font-bold text-center">Video Preview</h3>
              </div>
            </div>

            {/* Preview content */}
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-xl">
              <Video className="text-gray-400 mb-4" size={48} />
              <p className="text-gray-400 text-center">
                {isGenerating ? 'Generating your lip-sync video...' : 'Generated video will appear here'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
