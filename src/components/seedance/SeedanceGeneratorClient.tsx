'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, Upload, Video, Image as ImageIcon, Wand2 } from 'lucide-react';
import { useToast } from '../common/Toast';

interface SeedanceGeneratorClientProps {
  currentCredits?: number;
}

export default function SeedanceGeneratorClient({ currentCredits = 0 }: SeedanceGeneratorClientProps) {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // Ensure currentCredits is a valid number
  const validCredits = typeof currentCredits === 'number' && !isNaN(currentCredits) ? currentCredits : 0;

  // Mode selection: 'text-to-video' or 'image-to-video'
  const [generationMode, setGenerationMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video');

  // Model selection: 'seedance' or 'seedance_fast'
  const [selectedModel, setSelectedModel] = useState<'seedance' | 'seedance_fast'>('seedance');

  // Form states
  const [textPrompt, setTextPrompt] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [showCreditsUsed, setShowCreditsUsed] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate required credits based on model
  const getRequiredCredits = () => {
    return selectedModel === 'seedance' ? 30 : 10;
  };

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size cannot exceed 5MB', 'error');
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

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    if (generationMode === 'text-to-video' && !textPrompt.trim()) {
      showToast('Please enter video description', 'error');
      return;
    }

    if (generationMode === 'image-to-video') {
      if (!imageFile) {
        showToast('Please select an image', 'error');
        return;
      }
      if (!imagePrompt.trim()) {
        showToast('Please enter image description', 'error');
        return;
      }
    }

    // Check if seedance_fast supports image-to-video
    if (generationMode === 'image-to-video' && selectedModel === 'seedance_fast') {
      showToast('Fast mode only supports text-to-video generation', 'error');
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

      if (generationMode === 'text-to-video') {
        formData.append('textPrompt', textPrompt);
      } else {
        formData.append('imagePrompt', imagePrompt);
        if (imageFile) {
          formData.append('imageFile', imageFile);
        }
      }

      console.log('Sending dance video generation request...', {
        mode: generationMode,
        model: selectedModel,
        textPrompt: generationMode === 'text-to-video' ? textPrompt : undefined,
        imagePrompt: generationMode === 'image-to-video' ? imagePrompt : undefined,
        imageFile: imageFile?.name
      });

      // Call API (temporarily show feature unavailable)
      showToast('This feature is temporarily unavailable, stay tuned!', 'info');

      // TODO: 实际的 API 调用
      // const response = await fetch('/api/seedance/generate', {
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
          {/* Generation Mode Selection - Veo3 Style */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Generation Mode</h3>
            <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-600/50">
              <button
                onClick={() => setGenerationMode('text-to-video')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  generationMode === 'text-to-video'
                    ? 'bg-gray-700 text-white border border-gray-600'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Text-to-Video
              </button>
              <button
                onClick={() => setGenerationMode('image-to-video')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  generationMode === 'image-to-video'
                    ? 'bg-gray-700 text-white border border-gray-600'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Image-to-Video
              </button>
            </div>
          </div>

          {/* Model Selection - Veo3 Style */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-white">Generation Model</h3>
              <button
                onClick={() => setShowModelInfo(!showModelInfo)}
                className="w-5 h-5 rounded-full bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 flex items-center justify-center transition-all duration-200 group"
                title="Model Information"
              >
                <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Model Information Modal */}
            {showModelInfo && (
              <div className="mb-4 p-4 bg-gray-800/90 border border-gray-600/50 rounded-xl backdrop-blur-sm shadow-xl">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-semibold">Model Information</h4>
                  <button
                    onClick={() => setShowModelInfo(false)}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
                    <div className="font-medium text-purple-200 mb-1">seedance</div>
                    <div className="text-gray-300">Standard model, supports both text-to-video and image-to-video generation</div>
                  </div>
                  <div className="p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                    <div className="font-medium text-green-200 mb-1">seedance_fast</div>
                    <div className="text-gray-300">Fast generation model, faster generation speed but only supports text-to-video</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="model"
                    value="seedance"
                    checked={selectedModel === 'seedance'}
                    onChange={() => setSelectedModel('seedance')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    selectedModel === 'seedance'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-400 bg-transparent group-hover:border-purple-400'
                  }`}>
                    {selectedModel === 'seedance' && (
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <span className="text-white font-medium">seedance</span>
                  <span className="text-white text-sm ml-2">(30 credits)</span>
                </div>
              </label>

              {generationMode === 'text-to-video' && (
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="model"
                      value="seedance_fast"
                      checked={selectedModel === 'seedance_fast'}
                      onChange={() => setSelectedModel('seedance_fast')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                      selectedModel === 'seedance_fast'
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-400 bg-transparent group-hover:border-green-400'
                    }`}>
                      {selectedModel === 'seedance_fast' && (
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <span className="text-white font-medium">seedance_fast</span>
                    <span className="text-white text-sm ml-2">(10 credits)</span>
                  </div>
                </label>
              )}
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
          {/* Content based on selected mode - Veo3 Style */}
          {generationMode === 'text-to-video' ? (
            <div className="bg-gray-700/50 p-6 rounded-xl border-2 border-gray-600 shadow-lg backdrop-blur-md hover:shadow-xl hover:border-gray-500 transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <label htmlFor="textPrompt" className="block text-sm font-semibold text-white mb-3">
                    Prompt <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="textPrompt"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      placeholder="[English Only] Describe the dance video you want to generate... Be specific about dance style, movements, setting, and desired elements."
                      className="w-full h-40 bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      maxLength={800}
                    />
                    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className={`text-xs font-medium ${textPrompt.length > 800 * 0.9 ? 'text-orange-400' : 'text-gray-400'}`}>
                        {textPrompt.length}/800
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-green-900/20 border border-green-700/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-green-200 text-sm leading-relaxed">
                        <span className="font-semibold text-green-100">Tip:</span> Please write your prompt in English only and describe dance movements, style, and setting clearly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <ImageIcon className="mr-2 text-blue-400" size={20} />
                  Upload Image and Describe
                </h3>

                {/* Image Upload */}
                <div className="space-y-4">
                  {!imagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <Upload className="mx-auto mb-4 text-gray-400" size={48} />
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
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                {/* Image Prompt */}
                <div>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe how the person in the image should dance, e.g.: Make the person in the image perform modern dance with rhythmic and expressive movements..."
                    className="w-full h-24 bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    maxLength={800}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {imagePrompt.length}/800 characters
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate Dance Video ({getRequiredCredits()} Credits)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                <h3 className="text-xl font-bold text-center">Video Preview</h3>
              </div>
            </div>

            {/* Preview content */}
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-xl">
              <Video className="text-gray-400 mb-4" size={48} />
              <p className="text-gray-400 text-center">
                {isGenerating ? 'Generating your dance video...' : 'Generated video will appear here'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
