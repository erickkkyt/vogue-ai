'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ConfirmationModal } from '../common/modals/ConfirmationModal';
import InsufficientCreditsModal from '../common/modals/InsufficientCreditsModal';
import { AI_BABY_GENERATOR_MEDIA } from '../../config/media';

// Toast notification component
interface ToastProps {
  message: string;
  type: 'error' | 'warning' | 'success';
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-green-500';
  const icon = type === 'error' ? '⚠️' : type === 'warning' ? '⚠️' : '✅';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md animate-slide-in`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{icon}</span>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface AIBabyGeneratorClientProps {
  currentCredits: number;
}

const REQUIRED_CREDITS_PER_GENERATION = 3; // 3 credits per baby generation

export default function AIBabyGeneratorClient({ currentCredits }: AIBabyGeneratorClientProps) {
  const router = useRouter();
  const [fatherImage, setFatherImage] = useState<File | null>(null);
  const [motherImage, setMotherImage] = useState<File | null>(null);
  const [fatherPreview, setFatherPreview] = useState<string | null>(null);
  const [motherPreview, setMotherPreview] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBaby, setGeneratedBaby] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<'father' | 'mother' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [hasPendingTask, setHasPendingTask] = useState<boolean>(false);
  const [pendingTaskInfo, setPendingTaskInfo] = useState<any>(null);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'warning' | 'success' } | null>(null);

  const fatherInputRef = useRef<HTMLInputElement>(null);
  const motherInputRef = useRef<HTMLInputElement>(null);

  // Ensure currentCredits is a valid number
  const validCredits = typeof currentCredits === 'number' && !isNaN(currentCredits) ? currentCredits : 0;

  // Toast notification function
  const showToast = (message: string, type: 'error' | 'warning' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // Auto-hide after 5 seconds
  };

  // 检查用户是否有正在处理中的任务
  const checkPendingTasks = async () => {
    try {
      const response = await fetch('/api/baby/check-pending');

      // 如果是401错误（未认证），说明用户未登录
      if (response.status === 401) {
        console.log('[AI Baby Generator] User not authenticated, skipping pending tasks check');
        return false;
      }

      if (!response.ok) {
        throw new Error(`Failed to check pending tasks: ${response.status}`);
      }

      const result = await response.json();
      setHasPendingTask(result.hasPendingTask);
      setPendingTaskInfo(result.pendingTask);

      // 如果有pending任务，自动开始轮询
      if (result.hasPendingTask && result.pendingTask) {
        setCurrentJobId(result.pendingTask.jobId);
        setGenerationStatus('processing');
        setIsGenerating(true);
        startPolling(result.pendingTask.jobId);
      }

      return result.hasPendingTask;
    } catch (error) {
      console.error('Error checking pending tasks:', error);
      return false;
    }
  };

  // 轮询检查生成状态
  const checkGenerationStatus = async (jobId: string) => {
    try {
      const response = await fetch(`/api/baby/status/${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to check status');
      }

      const result = await response.json();
      console.log('🔍 [DEBUG] Baby generation status check:', {
        jobId,
        result,
        currentGeneratedBaby: generatedBaby,
        generationStatus: generationStatus
      });

      setGenerationStatus(result.status);

      if (result.status === 'completed' && result.generatedBabyUrl) {
        console.log('✅ [DEBUG] Setting generated baby URL:', result.generatedBabyUrl);
        setGeneratedBaby(result.generatedBabyUrl);
        setIsGenerating(false);
        setHasPendingTask(false);
        setPendingTaskInfo(null);
        showToast('Baby generation completed successfully!', 'success');
        
        // 强制重新渲染验证
        setTimeout(() => {
          console.log('🔍 [DEBUG] After setState - generatedBaby should be:', result.generatedBabyUrl);
        }, 100);
        
        return true; // 停止轮询
      } else if (result.status === 'failed') {
        console.log('❌ [DEBUG] Baby generation failed:', result.errorMessage);
        setIsGenerating(false);
        setHasPendingTask(false);
        setPendingTaskInfo(null);
        showToast(`Baby generation failed: ${result.errorMessage || 'Unknown error'}`, 'error');
        return true; // 停止轮询
      } else {
        console.log('⏳ [DEBUG] Generation still in progress or missing URL:', {
          status: result.status,
          hasUrl: !!result.generatedBabyUrl,
          url: result.generatedBabyUrl
        });
      }

      return false; // 继续轮询
    } catch (error) {
      console.error('❌ [DEBUG] Error checking baby generation status:', error);
      return false; // 继续轮询
    }
  };

  // 开始轮询
  const startPolling = (jobId: string) => {
    setCurrentJobId(jobId);
    setGenerationStatus('processing');

    const pollInterval = setInterval(async () => {
      const shouldStop = await checkGenerationStatus(jobId);
      if (shouldStop) {
        clearInterval(pollInterval);
        setCurrentJobId(null);
      }
    }, 3000); // 每3秒检查一次

    // 设置最大轮询时间（5分钟）
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (generationStatus === 'processing') {
        setIsGenerating(false);
        setGenerationStatus('failed');
        showToast('Baby generation timed out. Please try again.', 'error');
      }
    }, 5 * 60 * 1000);

    // 返回清理函数
    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  };

  // 组件加载时检查用户登录状态和pending任务
  useEffect(() => {
    const checkUserAndPendingTasks = async () => {
      try {
        // 首先检查用户是否登录
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          // 用户未登录，不需要检查pending任务
          console.log('[AI Baby Generator] User not logged in, skipping pending tasks check');
          return;
        }

        // 用户已登录，检查pending任务
        console.log('[AI Baby Generator] User logged in, checking pending tasks');
        await checkPendingTasks();
      } catch (error) {
        console.error('[AI Baby Generator] Error in initial check:', error);
      }
    };

    checkUserAndPendingTasks();
  }, []);

  // 清理轮询当组件卸载时
  useEffect(() => {
    return () => {
      // 组件卸载时清理任何正在进行的轮询
      if (currentJobId) {
        setCurrentJobId(null);
        setIsGenerating(false);
      }
    };
  }, [currentJobId]);

  const handleFileChange = (file: File, type: 'father' | 'mother') => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Only PNG, JPG, WEBP format images are supported', 'error');
      return;
    }
    // Validate file size (max 2MB) - 适应Vercel限制
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast(`Image size cannot exceed 2MB, current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`, 'error');
      return;
    }
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'father') {
        setFatherImage(file);
        setFatherPreview(result);
      } else {
        setMotherImage(file);
        setMotherPreview(result);
      }
    };
    reader.onerror = () => {
      showToast('Failed to read image, please try again', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent, type: 'father' | 'mother') => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'father' | 'mother') => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0], type);
    }
  };

  const handleGeneratePress = async () => {
    // First check if user is logged in
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      // User not logged in, redirect to login page
      router.push('/login');
      return;
    }

    // Check if user has pending tasks
    const hasPending = await checkPendingTasks();
    if (hasPending) {
      showToast('You have a baby generation in progress. Please wait for it to complete before starting a new one.', 'warning');
      return;
    }

    // User is logged in and no pending tasks, continue with credit check
    if (validCredits < REQUIRED_CREDITS_PER_GENERATION) {
      setIsCreditsModalOpen(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const executeGeneration = async () => {
    if (!fatherImage || !motherImage || !selectedGender) {
      showToast('Please upload father and mother photos and select gender', 'warning');
      return;
    }

    setIsGenerating(true);

    try {
      // 准备FormData
      const formData = new FormData();
      formData.append('fatherImage', fatherImage);
      formData.append('motherImage', motherImage);
      formData.append('gender', selectedGender);

      // 调用baby-generate API
      const response = await fetch('/api/baby/generate', {
        method: 'POST',
        body: formData,
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        // 如果响应不是JSON格式，可能是HTML错误页面
        const responseText = await response.text();
        console.error('Response is not JSON:', responseText);
        throw new Error(`Server returned invalid response (Status: ${response.status}). Please try again.`);
      }

      if (!response.ok) {
        throw new Error(result.message || 'Generation failed');
      }

      console.log('Baby generation started:', result);

      // 成功发送到N8N后，开始轮询状态
      if (result.jobId) {
        showToast('Baby generation request submitted successfully! Processing...', 'success');
        startPolling(result.jobId);
      } else {
        showToast('Baby generation request submitted successfully! You will be notified when it\'s ready.', 'success');
        setIsGenerating(false);
      }

    } catch (error) {
      console.error('Baby generation error:', error);
      showToast(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
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
              AI Baby Generator
            </span>
          </nav>
        </div>

        {/* Full Screen Layout - SuperMaker.ai Style with spacing */}
        <div className="flex flex-1 gap-4">
          {/* Left Side: Control Panel */}
          <div className="w-[370px] bg-gray-800 flex flex-col rounded-xl border border-gray-700">
            {/* Header Section */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">AI Baby Generator</h2>
            </div>

            {/* Control Panel Content */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              {/* Father Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Father Photo <span className="text-red-500 ml-1">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors w-full h-32 flex items-center justify-center overflow-hidden relative ${
                    dragOver === 'father'
                      ? 'border-blue-400 bg-blue-900/20'
                      : 'border-gray-600 hover:border-blue-500'
                  }`}
                  onClick={() => fatherInputRef.current?.click()}
                  onDragOver={(e) => handleDragOver(e, 'father')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'father')}
                >
                  {fatherPreview ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={fatherPreview}
                          alt="Father preview"
                          className="object-contain max-w-full max-h-full rounded"
                        />
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Father
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFatherImage(null);
                          setFatherPreview(null);
                          if (fatherInputRef.current) {
                            fatherInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-8 h-8 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-gray-300 text-sm">Upload Father's Photo</p>
                      <p className="text-gray-500 text-xs">PNG, JPG, WEBP • Max 2MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fatherInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileChange(file, 'father');
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>

              {/* Mother Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mother Photo <span className="text-red-500 ml-1">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors w-full h-32 flex items-center justify-center overflow-hidden relative ${
                    dragOver === 'mother'
                      ? 'border-pink-400 bg-pink-900/20'
                      : 'border-gray-600 hover:border-pink-500'
                  }`}
                  onClick={() => motherInputRef.current?.click()}
                  onDragOver={(e) => handleDragOver(e, 'mother')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'mother')}
                >
                  {motherPreview ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={motherPreview}
                          alt="Mother preview"
                          className="object-contain max-w-full max-h-full rounded"
                        />
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Mother
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMotherImage(null);
                          setMotherPreview(null);
                          if (motherInputRef.current) {
                            motherInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-8 h-8 text-pink-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-gray-300 text-sm">Upload Mother's Photo</p>
                      <p className="text-gray-500 text-xs">PNG, JPG, WEBP • Max 2MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={motherInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileChange(file, 'mother');
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Baby Gender <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                </select>
              </div>

              {/* Pending Task Info */}
              {hasPendingTask && pendingTaskInfo && (
                <div className="p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                  <p className="text-yellow-200 text-sm">
                    <span className="font-medium">Generation in Progress:</span> {pendingTaskInfo.gender === 'boy' ? 'Boy' : 'Girl'} baby
                    <br />
                    <span className="text-xs text-yellow-300">
                      Started: {new Date(pendingTaskInfo.createdAt).toLocaleTimeString()}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Credits Display and Generate Button - Fixed at bottom of left panel */}
            <div className="p-5 border-t border-gray-700">
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-gray-300">Required Credits</span>
                <span className="text-sm font-bold text-purple-400">{REQUIRED_CREDITS_PER_GENERATION}</span>
              </div>

              {/* Generate Button */}
              <div className="pt-3">
                <button
                  onClick={handleGeneratePress}
                  disabled={!fatherImage || !motherImage || !selectedGender || isGenerating || hasPendingTask}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                    !fatherImage || !motherImage || !selectedGender || isGenerating || hasPendingTask
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {hasPendingTask ? 'Processing...' : 'Submitting...'}
                    </div>
                  ) : hasPendingTask ? (
                    'Generation in Progress'
                  ) : (
                    'Generate Baby'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Baby Preview Area */}
          <div className="flex-1 bg-gray-800 flex flex-col rounded-xl border border-gray-700">
            {/* Preview Header */}
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Baby Preview</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Ready</span>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-6 flex items-center justify-center">
              {/* Preview content */}
              {generationStatus === 'processing' ? (
                <div className="flex flex-col items-center justify-start min-h-[400px] text-center py-8">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center border-2 border-dashed border-purple-500/50 animate-pulse">
                      <svg className="w-16 h-16 text-purple-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Generating Your Baby...</h4>
                  <p className="text-gray-400 text-sm mb-6 max-w-xs">AI is analyzing parent photos and creating your future baby. This usually takes 5-15 seconds.</p>

                  {/* Processing animation */}
                  <div className="w-full max-w-xs mb-6">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Processing</span>
                      <span>Please wait...</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                  </div>

                  {/* Projects page hint - PROMINENT display during processing */}
                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-2 border-blue-400/70 rounded-xl max-w-md mx-auto shadow-xl animate-fade-in">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-blue-200 font-bold text-base">⚡ Quick Tip</span>
                    </div>
                    <p className="text-blue-50 text-sm text-center leading-relaxed font-medium">
                      Your baby image will appear here soon! If nothing shows after <span className="font-bold text-yellow-300 bg-yellow-600/20 px-2 py-1 rounded">20 seconds</span>,
                      <br />
                      <span className="text-blue-200">👉 Go to </span>
                      <button
                        onClick={() => router.push('/projects')}
                        className="text-yellow-300 hover:text-yellow-200 underline font-bold transition-colors bg-yellow-600/20 px-2 py-1 rounded mx-1"
                      >
                        Projects Page
                      </button>
                      <span className="text-blue-200"> to find your generated image!</span>
                    </p>
                  </div>
                </div>
              ) : generatedBaby ? (
                (() => {
                  console.log('🎨 [DEBUG] Rendering baby image preview:', {
                    generatedBaby,
                    generationStatus,
                    imageUrlLength: generatedBaby?.length,
                    isValidUrl: generatedBaby?.startsWith('http')
                  });
                  return (
                    <div className="space-y-6">
                      <div className="relative group">
                        <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 p-1 rounded-2xl shadow-2xl">
                          <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden">
                            <img
                              src={generatedBaby}
                              alt="Generated baby"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              suppressHydrationWarning={true}
                              onLoad={() => {
                                console.log('✅ [DEBUG] Baby image loaded successfully:', generatedBaby);
                              }}
                              onError={(e) => {
                                console.error('❌ [DEBUG] Baby image failed to load:', {
                                  url: generatedBaby,
                                  naturalWidth: e.currentTarget.naturalWidth,
                                  naturalHeight: e.currentTarget.naturalHeight
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="text-center space-y-4">
                        <h4 className="text-lg font-bold text-white">Your Future Baby</h4>
                        <div className="grid grid-cols-1 gap-3">
                          <a
                            href={`/api/download?url=${encodeURIComponent(generatedBaby)}&filename=ai-baby-generated.jpg`}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Download</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-4">
                  <h4 className="text-2xl font-bold text-white mb-8">AI Baby Generator Example</h4>

                  {/* Example Images Layout - Much Larger sizes to fill preview area */}
                  <div className="space-y-12 flex-1 flex flex-col justify-center">
                    {/* Parents Row */}
                    <div className="flex justify-center items-center gap-12">
                      {/* Parent 1 */}
                      <div className="text-center">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500/60 shadow-2xl">
                          <img
                            src={AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Demo}
                            alt="Parent 1 Example"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <p className="text-base text-blue-400 mt-4 font-medium">Parent 1</p>
                      </div>

                      {/* Plus Icon */}
                      <div className="text-purple-400 text-4xl font-bold">+</div>

                      {/* Parent 2 */}
                      <div className="text-center">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-pink-500/60 shadow-2xl">
                          <img
                            src={AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Demo}
                            alt="Parent 2 Example"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <p className="text-base text-pink-400 mt-4 font-medium">Parent 2</p>
                      </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex justify-center">
                      <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>

                    {/* Generated Baby */}
                    <div className="text-center">
                      <div className="w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-purple-500/70 shadow-2xl">
                        <img
                          src={AI_BABY_GENERATOR_MEDIA.examples.babies.babyDemo}
                          alt="Generated Baby Example"
                          className="w-full h-full object-cover object-[center_20%]"
                        />
                      </div>
                      <p className="text-lg text-purple-400 mt-5 font-semibold">✨ AI Generated Baby</p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            executeGeneration();
          }}
          title="Confirm Baby Generation"
          message="Are you sure you want to proceed with generating your AI baby?"
          confirmText="Yes, Generate Now"
          cancelText="Cancel"
        />

        <InsufficientCreditsModal
          isOpen={isCreditsModalOpen}
          onClose={() => setIsCreditsModalOpen(false)}
          service="baby-generator"
        />

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
