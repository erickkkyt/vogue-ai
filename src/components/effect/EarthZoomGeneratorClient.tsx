'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Upload, Video, Image as ImageIcon, Sparkles } from 'lucide-react';

interface EarthZoomGeneratorClientProps {
  currentCredits: number;
}

export default function EarthZoomGeneratorClient({ currentCredits }: EarthZoomGeneratorClientProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [zoomSpeed, setZoomSpeed] = useState('medium');
  const [outputFormat, setOutputFormat] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [hasActiveProject, setHasActiveProject] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 检查是否有待处理的项目
  useEffect(() => {
    checkPendingGeneration();
  }, []);

  const checkPendingGeneration = async () => {
    try {
      const response = await fetch('/api/earth-zoom/check-pending');
      if (response.ok) {
        const data = await response.json();
        if (data.hasPending) {
          setHasActiveProject(true);
          setCurrentJobId(data.pendingGeneration.job_id);
          startVideoPolling(data.pendingGeneration.job_id);
        }
      }
    } catch (error) {
      console.error('Error checking pending generation:', error);
    }
  };

  // 开始轮询检查视频状态
  const startVideoPolling = (jobId: string) => {
    setCurrentJobId(jobId);
    setIsCheckingStatus(true);

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/earth-zoom/status/${jobId}`);
        if (response.ok) {
          const data = await response.json();

          if (data.status === 'completed' && data.videoUrl) {
            setPreviewVideoUrl(data.videoUrl);
            setIsCheckingStatus(false);
            setHasActiveProject(false);
            clearInterval(pollInterval);
            alert('🌍 Earth Zoom video generation completed! Your video is ready.');
          } else if (data.status === 'failed') {
            setIsCheckingStatus(false);
            setHasActiveProject(false);
            clearInterval(pollInterval);
            alert('❌ Earth Zoom video generation failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Error polling video status:', error);
      }
    }, 3000);

    // 清理定时器（10分钟后停止轮询）
    setTimeout(() => {
      clearInterval(pollInterval);
      setIsCheckingStatus(false);
    }, 600000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      alert('Please upload an image first');
      return;
    }

    if (currentCredits < 15) {
      alert('Insufficient credits. You need 15 credits to generate an Earth Zoom video.');
      return;
    }

    // 检查是否有正在进行的项目
    if (hasActiveProject) {
      alert('You already have an Earth Zoom video generation in progress. Please wait for it to complete before starting a new one.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // 模拟生成进度
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 1000);

    try {
      // 准备表单数据
      const formData = new FormData();
      formData.append('imageFile', selectedImage);
      formData.append('customPrompt', customPrompt);
      formData.append('zoomSpeed', zoomSpeed);
      formData.append('outputFormat', outputFormat);
      formData.append('effectType', 'earth-zoom');

      console.log('Sending Earth Zoom generation request...', {
        customPrompt,
        zoomSpeed,
        outputFormat,
        imageFile: selectedImage.name
      });

      // 调用 API
      const response = await fetch('/api/earth-zoom/generate', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Generation failed');
      }

      console.log('Earth Zoom video generation started successfully:', result);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // 生成完成后的处理
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        alert(`🌍 Earth Zoom video generation started! Task ID: ${result.jobId}. ${result.creditsDeducted} credits deducted. The video will appear in the preview box when completed.`);

        // 设置有活跃项目状态
        setHasActiveProject(true);

        // 开始轮询检查视频状态
        startVideoPolling(result.jobId);
      }, 1000);

    } catch (error) {
      console.error('Generation error:', error);
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
      alert(`Generation failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
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
            <a href="/effect" className="hover:text-white transition-colors">
              Effects
            </a>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">
              Earth Zoom Generator
            </span>
          </nav>
        </div>

        {/* Full Screen Layout - SuperMaker.ai Style with spacing */}
        <div className="flex flex-1 gap-4">
            {/* Left Side: Control Panel */}
            <div className="w-[370px] bg-gray-800 flex flex-col rounded-xl border border-gray-700">
              {/* Header Section */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Earth Zoom Generator</h2>
              </div>

              {/* Control Panel Content */}
              <div className="flex-1 p-5 overflow-y-auto space-y-5">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Image <span className="text-red-500 ml-1">*</span>
                  </label>
                  {!imagePreview ? (
                    <div
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300"
                    >
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300 text-sm">Click to upload image</p>
                      <p className="text-gray-500 text-xs">JPG, PNG • Max 10MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                </div>

                {/* Zoom Speed Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Zoom Speed</label>
                  <select
                    value={zoomSpeed}
                    onChange={(e) => setZoomSpeed(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
                  >
                    <option value="slow">Slow (Cinematic)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="fast">Fast (Dynamic)</option>
                  </select>
                </div>

                {/* Output Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Output Format</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
                  >
                    <option value="16:9">Landscape (16:9) - YouTube</option>
                    <option value="9:16">Portrait (9:16) - TikTok/Instagram</option>
                    <option value="1:1">Square (1:1) - Instagram Posts</option>
                  </select>
                </div>

                {/* Custom Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Custom Description (Optional)</label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe the location or add special instructions..."
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-white placeholder-gray-400 text-sm"
                    rows={4}
                  />
                </div>
              </div>

              {/* Credits Display and Generate Button - Fixed at bottom of left panel */}
              <div className="p-5 border-t border-gray-700">
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-medium text-gray-300">Required Credits</span>
                  <span className="text-sm font-bold text-blue-400">1</span>
                </div>

                {/* Generate Button */}
                <div className="pt-3">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedImage || currentCredits < 15 || hasActiveProject}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isGenerating || !selectedImage || currentCredits < 15 || hasActiveProject
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </div>
                    ) : hasActiveProject ? (
                      'Generation in Progress...'
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Sparkles size={16} />
                        <span>Generate Earth Zoom (15 Credits)</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Preview Area */}
            <div className="flex-1 bg-gray-800 flex flex-col rounded-xl border border-gray-700">
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Earth Zoom Preview</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Credits: {currentCredits}</span>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 p-6 flex items-center justify-center">
                {(previewVideoUrl || isCheckingStatus) ? (
                  <div className="w-full max-w-4xl">
                    {isCheckingStatus && !previewVideoUrl ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                        <span className="text-gray-300">Processing your Earth Zoom video...</span>
                      </div>
                    ) : previewVideoUrl ? (
                      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        <video
                          src={previewVideoUrl}
                          controls
                          className="w-full h-full object-contain"
                          autoPlay
                          muted
                          onError={() => {
                            console.error('Video failed to load:', previewVideoUrl);
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : null}
                  </div>
                ) : isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-24 h-24 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Generating Earth Zoom...</h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">AI is creating your cinematic zoom-out effect from Earth to space. This usually takes 30-60 seconds.</p>

                    {/* Processing animation */}
                    <div className="w-full max-w-xs mb-6">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Processing</span>
                        <span>{Math.round(generationProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show demo video when no user video is available
                  <div className="w-full h-full flex items-center justify-center p-3">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-full max-w-[95%] max-h-[90%] aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        <video
                          controls
                          src="https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/EarthZoomOutAI-demo-001.webm"
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
      </div>
    </div>
  );
} 