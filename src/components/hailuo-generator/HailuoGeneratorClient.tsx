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
    <div className="max-w-4xl mx-auto">


      {/* Generation Form */}
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">Generate Hailuo AI Video</h3>
        
        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to create..."
            className="w-full h-32 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            maxLength={800}
          />
          <div className="text-right text-sm text-gray-400 mt-1">
            {prompt.length}/800 characters
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Video Duration
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setDuration(6)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                duration === 6
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 bg-gray-700/50 hover:border-purple-400'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">6 Seconds</div>
                <div className="text-sm text-gray-300">10 Credits</div>
                <div className="text-xs text-gray-400 mt-1">Fast & Affordable</div>
              </div>
            </div>
            <div
              onClick={() => setDuration(10)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                duration === 10
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 bg-gray-700/50 hover:border-purple-400'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">10 Seconds</div>
                <div className="text-sm text-gray-300">15 Credits</div>
                <div className="text-xs text-gray-400 mt-1">Extended Content</div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Generation Model
          </label>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="hailuo-standard"
                name="model"
                value="hailuo"
                defaultChecked
                className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 focus:ring-purple-500"
              />
              <div className="ml-3">
                <span className="text-white font-medium">Hailuo 02</span>
                <span className="text-white text-sm ml-2">({duration === 6 ? 10 : 15} credits for {duration}s video)</span>
                <div className="text-xs text-gray-400 mt-1">High-quality text-to-video generation</div>
              </div>
            </div>
          </div>
        </div>



        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim() || validCredits < (duration === 6 ? 10 : 15) || hasActiveProject}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
            isGenerating || !prompt.trim() || validCredits < (duration === 6 ? 10 : 15) || hasActiveProject
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transform hover:scale-105 shadow-lg'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Generating Video...
            </div>
          ) : hasActiveProject ? (
            'Generation in Progress...'
          ) : (
            `Generate ${duration}s Hailuo AI Video`
          )}
        </button>

        {/* Video Preview */}
        {(previewVideoUrl || isCheckingStatus) && (
          <div className="mt-8 p-6 bg-gray-700/30 border border-gray-600 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-4">Video Preview</h4>
            {isCheckingStatus && !previewVideoUrl ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mr-3"></div>
                <span className="text-gray-300">Processing your video...</span>
              </div>
            ) : previewVideoUrl ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={previewVideoUrl}
                  controls
                  className="w-full h-full object-contain"
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
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
