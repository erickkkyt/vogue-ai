'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, Upload, Video, Image as ImageIcon, Wand2 } from 'lucide-react';
import { useToast } from '../common/Toast';

interface Veo3GeneratorClientProps {
  currentCredits?: number;
}

export default function Veo3GeneratorClient({ currentCredits = 0 }: Veo3GeneratorClientProps) {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // Ensure currentCredits is a valid number
  const validCredits = typeof currentCredits === 'number' && !isNaN(currentCredits) ? currentCredits : 0;

  // Mode selection: 'text-to-video' or 'image-to-video'
  const [generationMode, setGenerationMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video');

  // Model selection: 'veo3' or 'veo3_fast'
  const [selectedModel, setSelectedModel] = useState<'veo3' | 'veo3_fast'>('veo3');

  // Processing state management
  const [hasActiveProject, setHasActiveProject] = useState(false);
  const [isCheckingActiveProject, setIsCheckingActiveProject] = useState(true);
  
  // Text-to-video states
  const [textPrompt, setTextPrompt] = useState('');
  const [textPromptError, setTextPromptError] = useState('');
  
  // Image-to-video states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imagePromptError, setImagePromptError] = useState('');
  
  // Common states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);

  // Video preview states
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  // File input ref
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Constants
  const MAX_PROMPT_LENGTH = 2000;
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  // Model credits cost
  const MODEL_CREDITS = {
    veo3: 30,
    veo3_fast: 10
  };

  const REQUIRED_CREDITS = MODEL_CREDITS[selectedModel];

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clear any ongoing polling when component unmounts
      clearVideoPreview();
    };
  }, []);


  
  // Handle mode switch
  const handleModeSwitch = (mode: 'text-to-video' | 'image-to-video') => {
    setGenerationMode(mode);
    // If switching to image-to-video, force veo3 model
    if (mode === 'image-to-video') {
      setSelectedModel('veo3');
    }
    // Reset form states when switching modes
    setTextPrompt('');
    setTextPromptError('');
    setImageFile(null);
    setImagePreview(null);
    setImageError('');
    setImagePrompt('');
    setImagePromptError('');

    // Clear video preview when switching modes
    clearVideoPreview();
  };

  // Clear video preview
  const clearVideoPreview = () => {
    setCurrentJobId(null);
    setPreviewVideoUrl(null);
    setIsCheckingStatus(false);
  };

  // Handle model switch
  const handleModelSwitch = (model: 'veo3' | 'veo3_fast') => {
    setSelectedModel(model);
  };

  // Check if user has any active (processing) projects
  const checkActiveProject = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return false;

      const { data, error } = await supabase
        .from('veo3_generations')
        .select('job_id, status')
        .eq('user_id', user.id)
        .eq('status', 'processing')
        .limit(1);

      if (error) {
        console.error('Error checking active projects:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking active projects:', error);
      return false;
    }
  };

  // Check video generation status
  const checkVideoStatus = async (jobId: string) => {
    try {
      const response = await fetch(`/api/veo3/status/${jobId}`);

      if (!response.ok) {
        console.error('Error checking video status:', response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Exception checking video status:', error);
      return null;
    }
  };

  // Start polling for video completion
  const startVideoPolling = (jobId: string) => {
    setCurrentJobId(jobId);
    setIsCheckingStatus(true);

    const pollInterval = setInterval(async () => {
      const status = await checkVideoStatus(jobId);

      if (status) {
        if (status.status === 'completed' && status.videoUrl) {
          // Video is ready, show in preview
          setPreviewVideoUrl(status.videoUrl);
          setIsCheckingStatus(false);
          setHasActiveProject(false); // Reset active project state
          clearInterval(pollInterval);

          // Show success notification
          showToast('🎉 Video generation completed! You can view it in the preview box on the right, or go to the Projects page to manage all videos.', 'success');
        } else if (status.status === 'failed') {
          // Generation failed
          setIsCheckingStatus(false);
          setHasActiveProject(false); // Reset active project state
          clearInterval(pollInterval);
          showToast('❌ Video generation failed. Please try again or contact customer service.', 'error');
        }
        // If still processing, continue polling
      }
    }, 5000); // Check every 5 seconds

    // Stop polling after 10 minutes (timeout)
    setTimeout(() => {
      clearInterval(pollInterval);
      if (isCheckingStatus) {
        setIsCheckingStatus(false);
        setHasActiveProject(false); // Reset active project state on timeout
        showToast('⏰ Video generation is taking longer than expected. Please check the Projects page later for results.', 'warning');
      }
    }, 600000); // 10 minutes
  };
  
  // Handle text prompt change
  const handleTextPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_PROMPT_LENGTH) {
      setTextPrompt(value);
      setTextPromptError('');
    }
  };
  
  // Handle image prompt change
  const handleImagePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_PROMPT_LENGTH) {
      setImagePrompt(value);
      setImagePromptError('');
    }
  };
  
  // Handle file upload
  const handleFileChange = (file: File) => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setImageError('Only PNG, JPG, WEBP format images are supported');
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setImageError(`Image size cannot exceed 3MB, current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageFile(file);
      setImagePreview(result);
      setImageError('');
    };
    reader.readAsDataURL(file);
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };
  
  // Validation
  const isFormValid = () => {
    if (generationMode === 'text-to-video') {
      return textPrompt.trim().length > 0;
    } else {
      return imageFile !== null && imagePrompt.trim().length > 0;
    }
  };
  
  const isSubmitButtonDisabled = !isFormValid() || isSubmitting || validCredits < REQUIRED_CREDITS || hasActiveProject || isCheckingActiveProject;
  
  // Check for active projects on component mount
  useEffect(() => {
    const checkForActiveProjects = async () => {
      setIsCheckingActiveProject(true);
      const hasActive = await checkActiveProject();
      setHasActiveProject(hasActive);
      setIsCheckingActiveProject(false);
    };

    checkForActiveProjects();
  }, []);

  // Handle generate
  const handleGenerate = async () => {
    // Check if user is logged in
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      router.push('/login');
      return;
    }

    // Check credits
    if (validCredits < REQUIRED_CREDITS) {
      showToast(`Insufficient credits! Need ${REQUIRED_CREDITS} credits, but you only have ${validCredits} credits. Please purchase credits and try again.`, 'warning');
      return;
    }

    // Check for active projects before submitting
    const hasActive = await checkActiveProject();
    if (hasActive) {
      showToast('You have an active video generation task in progress. Please wait for it to complete before starting a new one. You can check the progress on the Projects page.', 'warning');
      setHasActiveProject(true);
      return;
    }

    setIsSubmitting(true);

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

      console.log('Sending video generation request...', {
        mode: generationMode,
        model: selectedModel,
        textPrompt: generationMode === 'text-to-video' ? textPrompt : undefined,
        imagePrompt: generationMode === 'image-to-video' ? imagePrompt : undefined,
        imageFile: imageFile?.name
      });

      // 调用 API
      const response = await fetch('/api/veo3/generate', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error_code === 'INSUFFICIENT_CREDITS') {
          showToast('Insufficient credits. Please purchase credits.', 'warning');
          return;
        } else if (result.error_code === 'ACTIVE_PROJECT_EXISTS') {
          showToast('You have an active video generation task in progress. Please wait for it to complete before trying again.', 'warning');
          return;
        } else {
          throw new Error(result.message || 'Generation failed');
        }
      }

      console.log('Video generation started successfully:', result);
      showToast(`🎬 Video generation started! Task ID: ${result.jobId}. ${result.creditsDeducted} credits deducted. The video will appear in the preview box when completed.`, 'success', 8000);

      // 设置有活跃项目状态
      setHasActiveProject(true);

      // 开始轮询检查视频状态
      startVideoPolling(result.jobId);

      // 成功提交后不跳转，让用户留在当前页面等待预览
      // router.push('/projects');

    } catch (error) {
      console.error('Generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Generation failed, please try again';
      showToast(`Generation failed: ${errorMessage}`, 'error');
    } finally {
      setIsSubmitting(false);
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
            Veo 3 Generator
          </span>
        </nav>
      </div>

      {/* Full Screen Layout - SuperMaker.ai Style with spacing */}
      <div className="flex flex-1 gap-4">
        {/* Left Side: Control Panel (调整为中间值宽度) */}
        <div className="w-[370px] bg-gray-800 flex flex-col rounded-xl border border-gray-700">
          {/* Header Section - 更紧凑 */}
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Veo 3 Video Maker</h2>
          </div>

          {/* Control Panel Content */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            {/* Mode Selection Tabs - 简约黑色风格 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Input Mode</label>
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => handleModeSwitch('text-to-video')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all duration-200 ${
                    generationMode === 'text-to-video'
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  Text-to-Video
                </button>
                <button
                  onClick={() => handleModeSwitch('image-to-video')}
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
              <div className="flex items-center gap-2 mb-3">
                <label className="block text-sm font-medium text-gray-300">Generation Model</label>
                <button
                  onClick={() => setShowModelInfo(!showModelInfo)}
                  className="w-4 h-4 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center transition-all duration-200"
                  title="Model Information"
                >
                  <svg className="w-2.5 h-2.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>

            {/* Model Information Modal */}
            {showModelInfo && (
              <div className="mb-5 p-4 bg-gray-700 border border-gray-600 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-semibold">Model Information</h4>
                  <button
                    onClick={() => setShowModelInfo(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg">
                    <div className="font-medium text-white mb-1">veo3</div>
                    <div className="text-gray-400 text-sm">Standard model, supports both text-to-video and image-to-video generation</div>
                  </div>
                  <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg">
                    <div className="font-medium text-white mb-1">veo3_fast</div>
                    <div className="text-gray-400 text-sm">Fast generation model, faster generation speed but only supports text-to-video</div>
                  </div>
                </div>
              </div>
            )}
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="model"
                      value="veo3"
                      checked={selectedModel === 'veo3'}
                      onChange={() => handleModelSwitch('veo3')}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                      selectedModel === 'veo3'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-600 bg-transparent group-hover:border-blue-400'
                    }`}>
                      {selectedModel === 'veo3' && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                  <div className="ml-2">
                    <span className="text-white font-medium text-sm">veo3</span>
                    <span className="text-gray-400 text-xs ml-1">(30 credits)</span>
                  </div>
                </label>

                {generationMode === 'text-to-video' && (
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="model"
                        value="veo3_fast"
                        checked={selectedModel === 'veo3_fast'}
                        onChange={() => handleModelSwitch('veo3_fast')}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        selectedModel === 'veo3_fast'
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-600 bg-transparent group-hover:border-orange-400'
                      }`}>
                        {selectedModel === 'veo3_fast' && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <div className="ml-2">
                      <span className="text-white font-medium text-sm">veo3_fast</span>
                      <span className="text-gray-400 text-xs ml-1">(10 credits, $1 for one video)</span>
                    </div>
                  </label>
                )}
              </div>
          </div>

            {/* Content based on selected mode */}
            {generationMode === 'text-to-video' ? (
              <div className="space-y-4">
                {/* Text-to-video mode with inline generate button */}
                <div>
                  <label htmlFor="textPrompt" className="block text-xs font-medium text-gray-300 mb-2">
                    Prompt <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="textPrompt"
                      value={textPrompt}
                      onChange={handleTextPromptChange}
                      placeholder="[English only and avoid special characters like %￥#@$&*] Describe the video you want to generate..."
                      className={`w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-white placeholder-gray-400 text-sm ${textPromptError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      rows={6}
                      maxLength={MAX_PROMPT_LENGTH}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      <span className={`${textPrompt.length > MAX_PROMPT_LENGTH * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {textPrompt.length}/{MAX_PROMPT_LENGTH}
                      </span>
                    </div>
                  </div>
                  {textPromptError && <p className="mt-1 text-sm text-red-600">{textPromptError}</p>}

                </div>
              </div>
            ) : (
              /* Combined Image Upload and Prompt */
              <div className="space-y-4">


                <div className="space-y-4">
                  {/* Source Image Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Image <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${
                        dragOver
                          ? 'border-gray-500 bg-gray-700'
                          : imageFile
                            ? 'border-green-500 bg-gray-700'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      }`}
                      onClick={() => imageInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <div className="space-y-3">
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-w-full max-h-32 mx-auto rounded-lg shadow-md"
                            />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300">
                            <p className="font-medium text-gray-200">{imageFile?.name}</p>
                            <p className="text-gray-400">{imageFile && (imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageFile(null);
                              setImagePreview(null);
                              setImageError('');
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md text-red-600 hover:text-red-700 text-xs font-medium transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto">
                            <Upload className="w-6 h-6 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-gray-200 font-medium text-sm">Upload Your Image</p>
                            <p className="text-gray-400 text-xs">Click here or drag & drop</p>
                            <p className="text-gray-500 text-xs">PNG, JPG, WEBP • Max 3MB</p>
                          </div>
                        </div>
                      )}
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileChange(file);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
                </div>

                  {/* Animation Prompt Section */}
                  <div>
                    <label htmlFor="imagePrompt" className="block text-xs font-medium text-gray-300 mb-2">
                      Prompt <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="imagePrompt"
                        value={imagePrompt}
                        onChange={handleImagePromptChange}
                        placeholder="[English only and avoid special characters like %￥#@$&*] Describe how you want the image to animate..."
                        className={`w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-white placeholder-gray-400 text-sm ${imagePromptError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        rows={6}
                        maxLength={MAX_PROMPT_LENGTH}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        <span className={`${imagePrompt.length > MAX_PROMPT_LENGTH * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
                          {imagePrompt.length}/{MAX_PROMPT_LENGTH}
                        </span>
                      </div>
                    </div>
                    {imagePromptError && <p className="mt-1 text-sm text-red-600">{imagePromptError}</p>}

                  </div>
                </div>
              </div>
            )}



            {/* Status Information */}
            {(hasActiveProject || isCheckingActiveProject) && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                    {isCheckingActiveProject ? (
                      <svg className="w-2.5 h-2.5 text-orange-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-2.5 h-2.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-orange-800 text-xs leading-relaxed">
                      {isCheckingActiveProject
                        ? 'Checking for active tasks...'
                        : 'You have an active video generation task in progress. Please wait for it to complete before starting a new generation, or go to the Projects page to check progress.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Credits Display and Generate Button - Fixed at bottom of left panel */}
          <div className="p-5 border-t border-gray-700">
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-medium text-gray-300">Required Credits</span>
              <span className="text-sm font-bold text-blue-400">{REQUIRED_CREDITS}</span>
            </div>

            {/* Generate Button - SuperMaker Style - Fixed at bottom */}
            <div className="pt-3">
              <button
                onClick={handleGenerate}
                disabled={isSubmitButtonDisabled}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isSubmitButtonDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting
                  ? 'Generating Video...'
                  : hasActiveProject
                    ? 'Video Processing...'
                    : isCheckingActiveProject
                      ? 'Checking Status...'
                      : 'Generate Video'
                }
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Video Preview Area (独立容器，参考SuperMaker右侧) */}
        <div className="flex-1 bg-gray-800 flex flex-col rounded-xl border border-gray-700">
          {/* Preview Header - 更紧凑 */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Video Preview</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Ready</span>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 p-6 flex items-center justify-center">
            {previewVideoUrl ? (
              // Show completed video
              <div className="w-full max-w-4xl">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4 border border-gray-700">
                  <video
                    controls
                    src={previewVideoUrl}
                    className="w-full h-full object-contain"
                    autoPlay
                    muted
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="text-center space-y-3">
                  <h4 className="text-lg font-bold text-white">🎉 Video Ready!</h4>
                  <p className="text-gray-400 text-sm">Your video has been generated successfully</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => router.push('/projects')}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                    >
                      View in Projects
                    </button>
                    <button
                      onClick={clearVideoPreview}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ) : isSubmitting || isCheckingStatus ? (
                  // Show loading state
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      {isSubmitting ? 'Submitting Request...' : 'Generating Video...'}
                    </h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                      {isSubmitting
                        ? 'Sending your request to Veo 3...'
                        : 'Veo 3 is creating your video. This usually takes 1-3 minutes.'
                      }
                    </p>
                    <div className="w-full max-w-xs mx-auto">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>{isSubmitting ? 'Submitting' : 'Processing'}</span>
                        <span>Please wait...</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: isSubmitting ? '30%' : '70%' }}></div>
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
                          src="https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/0723-1.webm"
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
