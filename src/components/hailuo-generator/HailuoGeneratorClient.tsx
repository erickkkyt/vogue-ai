'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/useToast';

interface HailuoGeneratorClientProps {
  currentCredits: number;
}

export default function HailuoGeneratorClient({ currentCredits }: HailuoGeneratorClientProps) {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<6 | 10>(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasActiveProject, setHasActiveProject] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // 确保currentCredits是有效数字
  const validCredits = typeof currentCredits === 'number' && !isNaN(currentCredits) ? currentCredits : 0;

  // 检查是否有待处理的项目
  useEffect(() => {
    checkPendingGeneration();
  }, []);

  const checkPendingGeneration = async () => {
    try {
      const response = await fetch('/api/hailuo/check-pending');
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
        const response = await fetch(`/api/hailuo/status/${jobId}`);
        if (response.ok) {
          const data = await response.json();

          if (data.status === 'completed' && data.videoUrl) {
            setPreviewVideoUrl(data.videoUrl);
            setIsCheckingStatus(false);
            setHasActiveProject(false);
            clearInterval(pollInterval);
            showToast('🎬 Video generation completed! Your video is ready.', 'success');
          } else if (data.status === 'failed') {
            setIsCheckingStatus(false);
            setHasActiveProject(false);
            clearInterval(pollInterval);
            showToast('❌ Video generation failed. Please try again.', 'error');
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

  const handleGenerate = async () => {
    // 检查用户是否登录
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      showToast('Please log in to generate videos.', 'warning');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }

    // 验证输入
    if (!prompt.trim() || prompt.trim().length < 10) {
      showToast('Please enter a prompt with at least 10 characters.', 'warning');
      return;
    }

    if (prompt.trim().length > 800) {
      showToast('Prompt must not exceed 800 characters.', 'warning');
      return;
    }

    // 检查积分 (6秒=10积分，10秒=15积分)
    const requiredCredits = duration === 6 ? 10 : 15;
    if (validCredits < requiredCredits) {
      showToast(`Insufficient credits! Need ${requiredCredits} credits, but you only have ${validCredits} credits. Please purchase credits and try again.`, 'warning');
      return;
    }

    // 检查是否有正在进行的项目
    if (hasActiveProject) {
      showToast('You already have a Hailuo video generation in progress. Please wait for it to complete before starting a new one.', 'warning');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/hailuo/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration: duration
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Generation failed');
      }

      console.log('Hailuo video generation started successfully:', result);
      showToast(`🎬 Hailuo video generation started! Task ID: ${result.jobId}. ${result.creditsUsed} credits deducted. The video will appear in the preview box when completed.`, 'success', 8000);

      // 设置有活跃项目状态
      setHasActiveProject(true);

      // 开始轮询检查视频状态
      startVideoPolling(result.jobId);

    } catch (error) {
      console.error('Generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Generation failed, please try again';
      showToast(`Generation failed: ${errorMessage}`, 'error');
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
              Hailuo Generator
            </span>
          </nav>
        </div>

        {/* Full Screen Layout - SuperMaker.ai Style with spacing */}
        <div className="flex flex-1 gap-4">
          {/* Left Side: Control Panel */}
          <div className="w-[370px] bg-gray-800 flex flex-col rounded-xl border border-gray-700">
            {/* Header Section */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Hailuo Video Maker</h2>
            </div>

            {/* Control Panel Content */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              {/* Prompt Input */}
              <div>
                <label htmlFor="hailuoPrompt" className="block text-xs font-medium text-gray-300 mb-2">
                  Prompt <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="hailuoPrompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="[English only and avoid special characters like %￥#@$&*] Describe the video you want to create..."
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-white placeholder-gray-400 text-sm"
                    rows={6}
                    maxLength={800}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    <span className={`${prompt.length > 720 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {prompt.length}/800
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Video Duration</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDuration(6)}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                      duration === 6
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 bg-gray-700/50 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-white mb-1">6 Seconds</div>
                      <div className="text-sm text-gray-300">10 Credits</div>
                      <div className="text-xs text-gray-400 mt-1">Fast & Affordable</div>
                    </div>
                  </div>
                  <div
                    onClick={() => setDuration(10)}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                      duration === 10
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 bg-gray-700/50 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-white mb-1">10 Seconds</div>
                      <div className="text-sm text-gray-300">15 Credits</div>
                      <div className="text-xs text-gray-400 mt-1">Extended Content</div>
                    </div>
                  </div>
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
                        value="hailuo"
                        defaultChecked
                        className="sr-only"
                      />
                      <div className="w-4 h-4 rounded-full border-2 border-purple-500 bg-purple-500">
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <span className="text-white font-medium text-sm">Hailuo 02</span>
                      <span className="text-gray-400 text-xs ml-1">({duration === 6 ? 10 : 15} credits)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Credits Display and Generate Button - Fixed at bottom of left panel */}
            <div className="p-5 border-t border-gray-700">
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-gray-300">Required Credits</span>
                <span className="text-sm font-bold text-purple-400">{duration === 6 ? 10 : 15}</span>
              </div>

              {/* Generate Button */}
              <div className="pt-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || validCredits < (duration === 6 ? 10 : 15) || hasActiveProject}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                    isGenerating || !prompt.trim() || validCredits < (duration === 6 ? 10 : 15) || hasActiveProject
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Video...
                    </div>
                  ) : hasActiveProject ? (
                    'Generation in Progress...'
                  ) : (
                    `Generate ${duration}s Video`
                  )}
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
              {(previewVideoUrl || isCheckingStatus) ? (
                <div className="w-full max-w-4xl">
                  {isCheckingStatus && !previewVideoUrl ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
                      <span className="text-gray-300">Processing your video...</span>
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
                          showToast('Failed to load video preview', 'error');
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : null}
                </div>
              ) : (
                // Show demo video when no user video is available
                <div className="w-full h-full flex items-center justify-center p-3">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-[95%] max-h-[90%] aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      <video
                        controls
                        src="https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/Hailuo%200811-2.webm"
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
