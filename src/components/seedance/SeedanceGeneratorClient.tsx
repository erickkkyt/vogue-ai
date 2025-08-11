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

  // Model selection: 'seedance-pro' or 'seedance-lite'
  const [selectedModel, setSelectedModel] = useState<'seedance-pro' | 'seedance-lite'>('seedance-pro');

  // New options for Seedance API
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [duration, setDuration] = useState<'5' | '10'>('5');

  // Form states
  const [textPrompt, setTextPrompt] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [showCreditsUsed, setShowCreditsUsed] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState(0);

  // 🎯 任务追踪和视频预览状态
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🎯 任务状态轮询函数 (硬编码配置)
  const FRONTEND_POLL_INTERVAL = 15000; // 前端每15秒查询一次
  const FRONTEND_POLL_TIMEOUT = 600000; // 10分钟超时

  const startPollingStatus = (jobId: string) => {
    setCurrentJobId(jobId);
    setTaskStatus('processing');

    console.log(`[Frontend Polling] Starting poll for job ${jobId}, interval: ${FRONTEND_POLL_INTERVAL}ms`);

    // 清除之前的轮询
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/seedance/status/${jobId}`);
        const data = await response.json();

        if (data.status === 'completed' && data.videoUrl) {
          // 🎯 视频生成完成
          clearInterval(pollIntervalRef.current!);
          setTaskStatus('completed');
          setGeneratedVideoUrl(data.videoUrl);
          showToast('🎉 Video generated successfully!', 'success');

        } else if (data.status === 'failed') {
          // 🎯 生成失败
          clearInterval(pollIntervalRef.current!);
          setTaskStatus('failed');
          showToast(`❌ Generation failed: ${data.errorMessage}`, 'error');

        } else {
          // 🎯 仍在处理中
          console.log(`⏳ Task ${jobId} status: ${data.status}`);
        }

      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, FRONTEND_POLL_INTERVAL); // 使用硬编码间隔

    // 硬编码超时时间
    setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        if (taskStatus === 'processing') {
          setTaskStatus('failed');
          showToast('⏰ Generation timeout. Please check your history later.', 'warning');
        }
      }
    }, FRONTEND_POLL_TIMEOUT); // 使用硬编码超时
  };

  // 清理轮询
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Calculate required credits based on model and duration
  const getRequiredCredits = () => {
    const baseCredits = selectedModel === 'seedance-pro' ? 30 : 10;
    const durationMultiplier = duration === '10' ? 2 : 1;
    return baseCredits * durationMultiplier;
  };

  // Map frontend model names to backend model names
  const getBackendModelName = () => {
    if (selectedModel === 'seedance-pro') {
      return 'doubao-seedance-1-0-pro-250528';
    } else {
      // seedance-lite
      if (generationMode === 'text-to-video') {
        return 'doubao-seedance-1-0-lite-t2v-250428';
      } else {
        return 'doubao-seedance-1-0-lite-i2v-250428';
      }
    }
  };

  // Image validation function (simplified - only check size and format)
  const validateImage = async (file: File): Promise<{ valid: boolean; error?: string; base64?: string }> => {
    return new Promise((resolve) => {
      // Check file size (10MB limit for Seedance)
      if (file.size > 10 * 1024 * 1024) {
        resolve({ valid: false, error: 'File size cannot exceed 10MB' });
        return;
      }

      // Check file format
      const allowedFormats = ['jpeg', 'jpg', 'png', 'webp', 'bmp', 'tiff', 'gif'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type.toLowerCase();

      const isValidFormat = allowedFormats.some(format =>
        mimeType.includes(format) || fileExtension === format
      );

      if (!isValidFormat) {
        resolve({ valid: false, error: 'Invalid image format. Supported: JPEG, PNG, WebP, BMP, TIFF, GIF' });
        return;
      }

      // Convert to base64 format (dimensions and ratio validation moved to backend)
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;

        // Convert to proper base64 format
        const mimeTypeFromFile = file.type || `image/${fileExtension}`;
        const base64Data = result.split(',')[1];
        const formattedBase64 = `data:${mimeTypeFromFile.toLowerCase()};base64,${base64Data}`;

        resolve({ valid: true, base64: formattedBase64 });
      };

      reader.onerror = () => {
        resolve({ valid: false, error: 'Failed to read image file' });
      };

      reader.readAsDataURL(file);
    });
  };

  // Handle image file selection with validation
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate image
      const validation = await validateImage(file);

      if (!validation.valid) {
        showToast(validation.error || 'Invalid image file', 'error');
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setImageFile(file);
      setImageBase64(validation.base64 || null);

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
    setImageBase64(null);
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

    // Check if seedance-lite supports image-to-video (it does, so this check is not needed)
    // Both seedance-pro and seedance-lite support image-to-video

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
      formData.append('selectedModel', getBackendModelName()); // 使用后端模型名称
      formData.append('aspectRatio', aspectRatio);
      formData.append('resolution', resolution);
      formData.append('duration', duration);

      if (generationMode === 'text-to-video') {
        formData.append('textPrompt', textPrompt);
      } else {
        formData.append('imagePrompt', imagePrompt);
        if (imageBase64) {
          formData.append('imageBase64', imageBase64);
        }
      }

      console.log('Sending dance video generation request...', {
        mode: generationMode,
        frontendModel: selectedModel,
        backendModel: getBackendModelName(),
        aspectRatio,
        resolution,
        duration,
        textPrompt: generationMode === 'text-to-video' ? textPrompt : undefined,
        imagePrompt: generationMode === 'image-to-video' ? imagePrompt : undefined,
        hasImageBase64: !!imageBase64
      });

      // 调用 API
      const response = await fetch('/api/seedance/generate', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Generation failed');
      }

      console.log('Seedance video generation started successfully:', result);

      showToast(`🎭 Seedance video generation started! Task ID: ${result.id}. ${result.creditsDeducted} credits deducted.`, 'success');

      // 🎯 开始轮询任务状态
      startPollingStatus(result.jobId);

    } catch (error) {
      console.error('Generation error:', error);
      showToast(`Generation failed: ${error instanceof Error ? error.message : 'Please try again.'}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full h-full px-6 py-2 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="mb-2">
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
                        value="seedance-pro"
                        checked={selectedModel === 'seedance-pro'}
                        onChange={(e) => setSelectedModel(e.target.value as 'seedance-pro' | 'seedance-lite')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        selectedModel === 'seedance-pro'
                          ? 'border-purple-600 bg-gradient-to-r from-purple-600 to-blue-600'
                          : 'border-gray-500 group-hover:border-gray-400'
                      }`}>
                        {selectedModel === 'seedance-pro' && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <span className="text-white font-medium text-sm">Seedance Pro</span>
                      <span className="text-gray-400 text-xs ml-1">(30 credits)</span>
                    </div>
                  </label>

                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="model"
                        value="seedance-lite"
                        checked={selectedModel === 'seedance-lite'}
                        onChange={(e) => setSelectedModel(e.target.value as 'seedance-pro' | 'seedance-lite')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        selectedModel === 'seedance-lite'
                          ? 'border-purple-600 bg-gradient-to-r from-purple-600 to-blue-600'
                          : 'border-gray-500 group-hover:border-gray-400'
                      }`}>
                        {selectedModel === 'seedance-lite' && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <span className="text-white font-medium text-sm">Seedance Lite</span>
                      <span className="text-gray-400 text-xs ml-1">(10 credits)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Video Settings */}
              <div className="space-y-4">
                {/* Aspect Ratio */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16' | '1:1')}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                  >
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value as '720p' | '1080p')}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                  >
                    <option value="720p">720p (HD)</option>
                    {selectedModel === 'seedance-pro' && <option value="1080p">1080p (Full HD - Pro only)</option>}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as '5' | '10')}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                  >
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds (2x credits)</option>
                  </select>
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
                          <p className="text-gray-500 text-xs">JPEG, PNG, WebP, BMP, TIFF, GIF</p>
                          <p className="text-gray-500 text-xs">Max 10MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp,image/tiff,image/gif"
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
                    : `Generate Video (${getRequiredCredits()} Credits)`
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
              {generatedVideoUrl ? (
                // 🎯 显示生成的视频
                <div className="w-full max-w-2xl">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-white mb-2">🎉 Video Generated!</h4>
                    <p className="text-gray-400 text-sm">Your Seedance video is ready</p>
                  </div>

                  <video
                    controls
                    className="w-full rounded-lg shadow-lg mb-4"
                    poster="/video-placeholder.jpg"
                  >
                    <source src={generatedVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => window.open(generatedVideoUrl, '_blank')}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      🔗 Open
                    </button>

                    <button
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = generatedVideoUrl;
                        a.download = `seedance-video-${Date.now()}.mp4`;
                        a.click();
                      }}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                    >
                      ⬇️ Download
                    </button>

                    <button
                      onClick={() => {
                        setGeneratedVideoUrl(null);
                        setTaskStatus('idle');
                        setCurrentJobId(null);
                      }}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                    >
                      🔄 New
                    </button>
                  </div>
                </div>
              ) : taskStatus === 'processing' ? (
                // 🎯 显示处理中状态
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="text-4xl">🎭</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Generating Video...</h4>
                  <p className="text-gray-400 text-sm mb-2">Task: {currentJobId?.slice(-8)}</p>
                  <p className="text-gray-400 text-sm mb-6">This may take 2-10 minutes</p>
                  <div className="w-48 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ) : taskStatus === 'failed' ? (
                // 🎯 显示失败状态
                <div className="text-center">
                  <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">❌</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Generation Failed</h4>
                  <p className="text-gray-400 text-sm mb-6">Please try again or check your parameters</p>
                  <button
                    onClick={() => {
                      setTaskStatus('idle');
                      setCurrentJobId(null);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    🔄 Try Again
                  </button>
                </div>
              ) : (
                // Show demo video when no user video is available
                <div className="w-full h-full flex items-center justify-center p-3">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-[95%] max-h-[90%] aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      <video
                        controls
                        src="https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/0806v4.webm"
                        className="w-full h-full object-contain"
                        muted
                        loop
                        autoPlay
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}