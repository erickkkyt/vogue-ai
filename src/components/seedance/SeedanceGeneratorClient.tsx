'use client';

import { useState, useRef } from 'react';
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
    <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full h-full px-6 py-6 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">
              Seedance Generator
            </span>
          </nav>
        </div>

        {/* Full Screen Layout - SuperMaker.ai Style with spacing */}
        <div className="flex flex-1 gap-4">
          {/* Left Side: Control Panel */}
          <div className="w-[370px] bg-gray-800 flex flex-col rounded-xl border border-gray-700">
            {/* Header Section */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Seedance Video Maker</h2>
            </div>

            {/* Control Panel Content */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              {/* Generation Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Input Mode</label>
                <div className="flex bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setGenerationMode('text-to-video')}
                    className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all duration-200 ${
                      generationMode === 'text-to-video'
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    Text-to-Video
                  </button>
                  <button
                    onClick={() => setGenerationMode('image-to-video')}
                    className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all duration-200 ${
                      generationMode === 'image-to-video'
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    Image-to-Video
                  </button>
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Generation Model</label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="model"
                        value="seedance"
                        checked={selectedModel === 'seedance'}
                        onChange={(e) => setSelectedModel(e.target.value as 'seedance' | 'seedance_fast')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        selectedModel === 'seedance'
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-500 group-hover:border-gray-400'
                      }`}>
                        {selectedModel === 'seedance' && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <span className="text-white font-medium text-sm">seedance</span>
                      <span className="text-gray-400 text-xs ml-1">(30 credits)</span>
                    </div>
                  </label>

                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="model"
                        value="seedance_fast"
                        checked={selectedModel === 'seedance_fast'}
                        onChange={(e) => setSelectedModel(e.target.value as 'seedance' | 'seedance_fast')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        selectedModel === 'seedance_fast'
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-500 group-hover:border-gray-400'
                      }`}>
                        {selectedModel === 'seedance_fast' && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <span className="text-white font-medium text-sm">seedance_fast</span>
                      <span className="text-gray-400 text-xs ml-1">(10 credits)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Content based on selected mode */}
              {generationMode === 'text-to-video' ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="textPrompt" className="block text-xs font-medium text-gray-300 mb-2">
                      Prompt <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="textPrompt"
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                        placeholder="[English only and avoid special characters like %￥#@$&*] Describe the dance video you want to generate..."
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-white placeholder-gray-400 text-sm"
                        rows={6}
                        maxLength={800}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        <span className={`${textPrompt.length > 720 ? 'text-orange-500' : 'text-gray-400'}`}>
                          {textPrompt.length}/800
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Image <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-gray-500 transition-colors"
                         onClick={() => fileInputRef.current?.click()}>
                      {imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="max-w-full h-32 object-contain mx-auto rounded" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Click to upload image</p>
                          <p className="text-gray-500 text-xs">PNG, JPG, WEBP • Max 5MB</p>
                        </div>
                      )}
                    </div>
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
                    <label htmlFor="imagePrompt" className="block text-xs font-medium text-gray-300 mb-2">
                      Prompt <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="imagePrompt"
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="[English only and avoid special characters like %￥#@$&*] Describe how you want the image to dance..."
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-white placeholder-gray-400 text-sm"
                        rows={6}
                        maxLength={800}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        <span className={`${imagePrompt.length > 720 ? 'text-orange-500' : 'text-gray-400'}`}>
                          {imagePrompt.length}/800
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Credits Display and Generate Button - Fixed at bottom of left panel */}
            <div className="p-5 border-t border-gray-700">
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-gray-300">Required Credits</span>
                <span className="text-sm font-bold text-purple-400">{getRequiredCredits()}</span>
              </div>

              {/* Generate Button */}
              <div className="pt-3">
                <button
                  onClick={handleSubmit}
                  disabled={isGenerating || validCredits < getRequiredCredits()}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                    isGenerating || validCredits < getRequiredCredits()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isGenerating
                    ? 'Generating Video...'
                    : 'Generate Video'
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Video Preview Area */}
          <div className="flex-1 bg-gray-800 flex flex-col rounded-xl border border-gray-700">
            {/* Preview Header */}
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Video Preview</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Ready</span>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Ready to Generate</h4>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                  {generationMode === 'text-to-video'
                    ? 'Enter a detailed prompt to generate your dance video'
                    : 'Upload an image and add a prompt to animate it'
                  }
                </p>
                <div className="text-xs text-gray-500">
                  Your video will appear here when generation is complete
                </div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}