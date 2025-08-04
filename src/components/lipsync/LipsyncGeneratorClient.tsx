'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, Upload, Video, Image as ImageIcon, Mic } from 'lucide-react';
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

  // Form states
  const [audioPrompt, setAudioPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreditsUsed, setShowCreditsUsed] = useState(false);
  const [enableSubtitles, setEnableSubtitles] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Emily');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Fixed required credits for LipSync
  const getRequiredCredits = () => {
    return 20; // Fixed credit cost for LipSync generation
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
    if (generationMode === 'image-audio' && !imageFile) {
      showToast('Please upload an image', 'error');
      return;
    }

    if (generationMode === 'video-audio' && !videoFile) {
      showToast('Please upload a video', 'error');
      return;
    }

    if (!audioFile && !audioPrompt.trim()) {
      showToast('Please upload an audio file or enter text for speech synthesis', 'error');
      return;
    }

    // Check credits
    const requiredCredits = getRequiredCredits();
    if (validCredits < requiredCredits) {
      showToast(`Insufficient credits, need ${requiredCredits} credits`, 'error');
      return;
    }

    setIsGenerating(true);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('generationMode', generationMode);
      formData.append('selectedModel', 'lipsync'); // Fixed model
      formData.append('enableSubtitles', enableSubtitles.toString());
      formData.append('selectedVoice', selectedVoice);

      if (generationMode === 'image-audio' && imageFile) {
        formData.append('imageFile', imageFile);
      }

      if (generationMode === 'video-audio' && videoFile) {
        formData.append('videoFile', videoFile);
      }

      if (audioFile) {
        formData.append('audioFile', audioFile);
      }

      if (audioPrompt.trim()) {
        formData.append('audioPrompt', audioPrompt.trim());
      }

      // Show temporary message
      showToast('This feature is temporarily unavailable, stay tuned!', 'info');

      // TODO: Implement actual API call
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
    <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center bg-gray-900 text-white">
      <ToastContainer />
      <div className="w-full h-full px-6 py-2 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="mb-2">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">
              AI Lip Sync Generator
            </span>
          </nav>
        </div>

        {/* Full Screen Layout - SuperMaker.ai Style with spacing */}
        <div className="flex flex-1 gap-4">
            {/* Left Side: Control Panel */}
            <div className="w-[370px] bg-gray-800 flex flex-col rounded-xl border border-gray-700 min-h-0">
              {/* Header Section */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">AI Lip Sync Generator</h2>
              </div>

              {/* Control Panel Content */}
              <div className="flex-1 p-5 overflow-y-auto space-y-5">
                {/* Input Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Input Mode</label>
                  <div className="flex bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setGenerationMode('image-audio')}
                      className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all duration-200 ${
                        generationMode === 'image-audio'
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Image + Audio
                    </button>
                    <button
                      onClick={() => setGenerationMode('video-audio')}
                      className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all duration-200 ${
                        generationMode === 'video-audio'
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Video + Audio
                    </button>
                  </div>
                </div>



                {/* File Upload Section */}
                {generationMode === 'image-audio' ? (
                  // Image Upload
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Image <span className="text-red-500 ml-1">*</span>
                    </label>
                    {!imagePreview ? (
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-300 text-sm">Click to upload image</p>
                        <p className="text-gray-500 text-xs">JPG, PNG • Max 5MB</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Video <span className="text-red-500 ml-1">*</span>
                    </label>
                    {!videoPreview ? (
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300"
                      >
                        <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-300 text-sm">Click to upload video</p>
                        <p className="text-gray-500 text-xs">MP4, MOV • Max 20MB</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <video
                          src={videoPreview}
                          className="w-full h-32 object-cover rounded-lg"
                          controls
                        />
                        <button
                          onClick={removeVideo}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
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

                {/* Audio Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Audio Input</label>
                  {!audioFile ? (
                    <div
                      onClick={() => audioInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300"
                    >
                      <Mic className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300 text-sm">Click to upload audio</p>
                      <p className="text-gray-500 text-xs">MP3, WAV • Max 10MB</p>
                    </div>
                  ) : (
                    <div className="border-2 border-orange-500 bg-orange-500/10 rounded-lg p-3 text-center">
                      <Mic className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">✓ {audioFile.name}</p>
                      <button
                        onClick={removeAudio}
                        className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
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
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Or Enter Text for Speech</label>
                  <textarea
                    value={audioPrompt}
                    onChange={(e) => setAudioPrompt(e.target.value)}
                    placeholder="Enter text to convert to speech..."
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-white placeholder-gray-400 text-sm"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-500 text-xs">{audioPrompt.length}/500</span>
                  </div>
                </div>

                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Voice Selection</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white text-sm"
                  >
                    <option value="Emily">Emily (Female, English)</option>
                    <option value="David">David (Male, English)</option>
                    <option value="Sarah">Sarah (Female, English)</option>
                    <option value="Michael">Michael (Male, English)</option>
                  </select>
                </div>

                {/* Enable Subtitles */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Enable Subtitles</label>
                  <button
                    onClick={() => setEnableSubtitles(!enableSubtitles)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      enableSubtitles ? 'bg-orange-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enableSubtitles ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Credits Display and Generate Button - Fixed at bottom of left panel */}
              <div className="p-5 border-t border-gray-700">
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-medium text-gray-300">Required Credits</span>
                  <span className="text-sm font-bold text-orange-400">{getRequiredCredits()}</span>
                </div>

                {/* Generate Button */}
                <div className="pt-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isGenerating ||
                      (generationMode === 'image-audio' && !imageFile) ||
                      (generationMode === 'video-audio' && !videoFile) ||
                      (!audioFile && !audioPrompt.trim()) ||
                      validCredits < getRequiredCredits()
                    }
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isGenerating ||
                      (generationMode === 'image-audio' && !imageFile) ||
                      (generationMode === 'video-audio' && !videoFile) ||
                      (!audioFile && !audioPrompt.trim()) ||
                      validCredits < getRequiredCredits()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Sparkles size={16} />
                        <span>Generate LipSync ({getRequiredCredits()} Credits)</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Preview Area */}
            <div className="flex-1 bg-gray-800 flex flex-col rounded-xl border border-gray-700 min-h-0">
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">LipSync Preview</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Credits: {validCredits}</span>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 p-6 flex items-center justify-center min-h-0">

                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-24 h-24 bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Generating LipSync Video...</h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">AI is processing your media and creating lip-synchronized video. This usually takes 1-3 minutes.</p>

                    {/* Processing animation */}
                    <div className="w-full max-w-xs mb-6">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Processing</span>
                        <span>Please wait...</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Ready to Generate</h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                      Upload your {generationMode === 'image-audio' ? 'image' : 'video'} and audio to generate lip-synchronized video
                    </p>

                    {/* Progress indicator */}
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            (generationMode === 'image-audio' && imageFile) || (generationMode === 'video-audio' && videoFile)
                              ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {(generationMode === 'image-audio' && imageFile) || (generationMode === 'video-audio' && videoFile) ? (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-white text-xs">1</span>
                            )}
                          </div>
                          <span className="text-gray-300 text-sm">
                            {generationMode === 'image-audio' ? 'Upload Image' : 'Upload Video'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            audioFile || audioPrompt.trim() ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {audioFile || audioPrompt.trim() ? (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-white text-xs">2</span>
                            )}
                          </div>
                          <span className="text-gray-300 text-sm">Add Audio or Text</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
