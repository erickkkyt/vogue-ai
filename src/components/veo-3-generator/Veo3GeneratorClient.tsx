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

  // Model selection: 'veo3' or 'veo3-fast' or 'hailuo'
  const [selectedModel, setSelectedModel] = useState<'veo3' | 'veo3-fast' | 'hailuo'>('veo3');

  // Duration selection for Hailuo model (6 or 10 seconds)
  const [selectedDuration, setSelectedDuration] = useState<6 | 10>(6);

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
  const MAX_PROMPT_LENGTH = 800;
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  // Model credits cost
  const MODEL_CREDITS = {
    veo3: 30,
    'veo3-fast': 10
  };

  const REQUIRED_CREDITS = MODEL_CREDITS[selectedModel];

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clear any ongoing polling when component unmounts
      clearVideoPreview();
    };
  }, []);

  // Enhanced Style classes for premium look
  const sectionTitleClasses = "flex items-center gap-3 text-2xl font-bold text-white mb-4";
  const sectionDescriptionClasses = "text-gray-300 mb-6 leading-relaxed";
  const contentBoxClasses = "bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-lg rounded-2xl p-8 border border-gray-600/50 shadow-2xl";
  const labelClasses = "block text-base font-semibold text-white mb-4 flex items-center gap-2";
  const inputBaseClasses = "w-full px-6 py-4 bg-gradient-to-r from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-700/80 transition-all duration-300 backdrop-blur-sm shadow-lg";
  const textareaClasses = "w-full px-6 py-4 bg-gradient-to-r from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-700/80 transition-all duration-300 resize-none backdrop-blur-sm shadow-lg";
  const charCountClasses = "text-xs text-gray-400 mt-2 text-right font-medium";
  const errorClasses = "text-red-400 text-sm mt-2 font-medium";
  
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
  const handleModelSwitch = (model: 'veo3' | 'veo3-fast') => {
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
  
  // Check if image-to-video mode is disabled
  const isImageToVideoDisabled = generationMode === 'image-to-video';

  const isSubmitButtonDisabled = !isFormValid() || isSubmitting || validCredits < REQUIRED_CREDITS || hasActiveProject || isCheckingActiveProject || isImageToVideoDisabled;
  
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
    <div className="space-y-10 p-8 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl">
      {/* Main content area */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left side: Input area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mode Selection Tabs - Simplified */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Input Mode</h3>
            <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50">
              <button
                onClick={() => handleModeSwitch('text-to-video')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  generationMode === 'text-to-video'
                    ? 'bg-gray-700 text-white border border-gray-600'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Text-to-Video
              </button>
              <button
                onClick={() => handleModeSwitch('image-to-video')}
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

          {/* Model Selection */}
          <div className="mb-8">
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
                  <div className="p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <div className="font-medium text-blue-200 mb-1">veo3</div>
                    <div className="text-gray-300">Standard model, supports both text-to-video and image-to-video generation</div>
                  </div>
                  <div className="p-3 bg-orange-900/20 border border-orange-700/30 rounded-lg">
                    <div className="font-medium text-orange-200 mb-1">veo3-fast</div>
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
                    value="veo3"
                    checked={selectedModel === 'veo3'}
                    onChange={() => handleModelSwitch('veo3')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    selectedModel === 'veo3'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400 bg-transparent group-hover:border-blue-400'
                  }`}>
                    {selectedModel === 'veo3' && (
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <span className="text-white font-medium">veo3</span>
                  <span className="text-white text-sm ml-2">(30 credits)</span>
                </div>
              </label>

              {generationMode === 'text-to-video' && (
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="model"
                      value="veo3-fast"
                      checked={selectedModel === 'veo3-fast'}
                      onChange={() => handleModelSwitch('veo3-fast')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                      selectedModel === 'veo3-fast'
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-400 bg-transparent group-hover:border-orange-400'
                    }`}>
                      {selectedModel === 'veo3-fast' && (
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <span className="text-white font-medium">veo3-fast</span>
                    <span className="text-white text-sm ml-2">(10 credits, $1 for one video)</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Content based on selected mode */}
          {generationMode === 'text-to-video' ? (
            <div className={contentBoxClasses}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="textPrompt" className={labelClasses}>
                    Prompt <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="textPrompt"
                      value={textPrompt}
                      onChange={handleTextPromptChange}
                      placeholder="Describe the video you want to generate with synchronized audio... Be specific about scenes, actions, characters, and desired audio elements."
                      className={`${textareaClasses} h-40 ${textPromptError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      maxLength={MAX_PROMPT_LENGTH}
                    />
                    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className={`text-xs font-medium ${textPrompt.length > MAX_PROMPT_LENGTH * 0.9 ? 'text-orange-400' : 'text-gray-400'}`}>
                        {textPrompt.length}/{MAX_PROMPT_LENGTH}
                      </span>
                    </div>
                  </div>
                  {textPromptError && <div className={errorClasses}>{textPromptError}</div>}
                  <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-blue-200 text-sm leading-relaxed">
                        <span className="font-semibold text-blue-100">Tip:</span> Be detailed and specific about what you want to see in the video. Veo 3 will generate synchronized audio effects, dialogue, and ambient sounds automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Combined Image Upload and Prompt */
            <div className={contentBoxClasses}>
              {/* Image-to-Video Disabled Notice */}
              <div className="mb-6 p-6 bg-yellow-900/20 border border-yellow-700/30 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-xl flex items-center justify-center mt-0.5">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-yellow-100 font-semibold mb-2">Image-to-Video Feature Coming Soon</h4>
                    <p className="text-yellow-200 text-sm leading-relaxed mb-3">
                      The image-to-video functionality is currently under development.
                    </p>
                    <p className="text-yellow-300 text-xs">
                      For now, please use the <span className="font-semibold">Text-to-Video</span> mode to generate amazing videos with synchronized audio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 opacity-50 pointer-events-none">
                {/* Source Image Section */}
                <div className="space-y-6">
                  <label className={labelClasses}>
                    Upload Image <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                      dragOver
                        ? 'border-purple-400 bg-purple-900/20 scale-105'
                        : imageFile
                          ? 'border-green-500 bg-green-900/10'
                          : 'border-gray-600 hover:border-purple-500 bg-gradient-to-br from-gray-700/30 to-gray-800/30 hover:scale-102'
                    }`}
                    onClick={() => imageInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="space-y-6">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-72 mx-auto rounded-xl shadow-2xl border border-gray-600/50"
                          />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4">
                          <p className="text-gray-200 font-medium text-sm">{imageFile?.name}</p>
                          <p className="text-gray-400 text-xs mt-1">{imageFile && (imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview(null);
                            setImageError('');
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 hover:text-red-300 text-sm font-medium transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/30">
                          <Upload className="w-10 h-10 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-gray-200 font-semibold text-lg mb-2">Upload Your Image</p>
                          <p className="text-gray-400 text-sm">Click here or drag & drop your image</p>
                          <p className="text-gray-500 text-xs mt-2">Supports PNG, JPG, WEBP • Max 3MB</p>
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
                  {imageError && <div className={errorClasses}>{imageError}</div>}
                </div>

                {/* Animation Prompt Section */}
                <div className="space-y-6">
                  <label htmlFor="imagePrompt" className={labelClasses}>
                    Prompt <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="imagePrompt"
                      value={imagePrompt}
                      onChange={handleImagePromptChange}
                      placeholder="Describe how you want the image to animate with audio... Include camera movements, character actions, and desired sound effects."
                      className={`${textareaClasses} h-32 ${imagePromptError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      maxLength={MAX_PROMPT_LENGTH}
                    />
                    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className={`text-xs font-medium ${imagePrompt.length > MAX_PROMPT_LENGTH * 0.9 ? 'text-orange-400' : 'text-gray-400'}`}>
                        {imagePrompt.length}/{MAX_PROMPT_LENGTH}
                      </span>
                    </div>
                  </div>
                  {imagePromptError && <div className={errorClasses}>{imagePromptError}</div>}
                  <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-purple-200 text-sm leading-relaxed">
                        <span className="font-semibold text-purple-100">Tip:</span> Describe how you want the image to animate and what audio should accompany it. Be specific about movements, transitions, and sound effects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex items-center justify-between pt-6">
            <button
              onClick={() => {
                // Reset form
                setGenerationMode('text-to-video');
                setSelectedModel('veo3');
                setTextPrompt('');
                setImageFile(null);
                setImagePreview(null);
                setImagePrompt('');

                // Clear video preview
                clearVideoPreview();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-xl transition-all duration-300 border border-gray-600/50 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>

            <button
              onClick={handleGenerate}
              disabled={isSubmitButtonDisabled}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                isSubmitButtonDisabled
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 hover:shadow-blue-500/25'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSubmitting ? 'animate-spin' : ''}`}>
                {isSubmitting ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <Wand2 size={20} />
                )}
              </div>
              <span>
                {isSubmitting
                  ? 'Generating Video...'
                  : hasActiveProject
                    ? 'Video Processing...'
                    : isCheckingActiveProject
                      ? 'Checking Status...'
                      : 'Generate Video'
                }
              </span>
            </button>
          </div>

          {/* Status Information */}
          {(hasActiveProject || isCheckingActiveProject) && (
            <div className="mt-4 p-4 bg-orange-900/20 border border-orange-700/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                  {isCheckingActiveProject ? (
                    <svg className="w-3 h-3 text-orange-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-orange-200 text-sm leading-relaxed">
                    {isCheckingActiveProject
                      ? 'Checking for active tasks...'
                      : 'You have an active video generation task in progress. Please wait for it to complete before starting a new generation, or go to the Projects page to check progress.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Image-to-Video Disabled Notice */}
          {isImageToVideoDisabled && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-yellow-200 text-sm leading-relaxed">
                    Image-to-Video mode is currently unavailable. Please switch to <span className="font-semibold text-yellow-100">Text-to-Video</span> mode to generate videos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Advantages */}
          <div className="pt-6 border-t border-gray-700/50">
            <div className="p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-2xl">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-green-100 font-semibold mb-2">Why Choose Vogue Veo 3?</h4>
                  <p className="text-green-200 text-sm leading-relaxed">
                    Cheapest Veo 3 access with no monthly limits (unlike Google's official restrictions). Generate as many videos as you want with just credits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Preview box */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 h-full backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                <h3 className="text-xl font-bold text-center">Video Preview</h3>
              </div>
            </div>

            {/* Preview content */}
            {previewVideoUrl ? (
              // Show completed video
              <div className="flex flex-col h-full">
                <div className="flex-1 mb-4">
                  <video
                    controls
                    src={previewVideoUrl}
                    className="w-full h-full object-contain rounded-xl border border-gray-600/50"
                    autoPlay
                    muted
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="text-center space-y-3">
                  <h4 className="text-lg font-bold text-white">🎉 Video Ready!</h4>
                  <p className="text-gray-400 text-sm">Your video has been generated successfully</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push('/projects')}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      View in Projects
                    </button>
                    <button
                      onClick={clearVideoPreview}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ) : isSubmitting || isCheckingStatus ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center border-2 border-dashed border-blue-500/50 animate-pulse">
                    <svg className="w-16 h-16 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">
                  {isSubmitting ? 'Submitting Request...' : 'Generating Video...'}
                </h4>
                <p className="text-gray-400 text-sm mb-8 max-w-xs">
                  {isSubmitting
                    ? 'Sending your request to Veo 3...'
                    : 'Veo 3 is creating your video with synchronized audio. This usually takes 1-3 minutes.'
                  }
                </p>

                {/* Processing animation */}
                <div className="w-full max-w-xs mb-6">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>{isSubmitting ? 'Submitting' : 'Processing'}</span>
                    <span>Please wait...</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: isSubmitting ? '30%' : '70%' }}></div>
                  </div>
                </div>

                {/* Projects page hint - only show during video generation */}
                {!isSubmitting && (
                  <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg max-w-sm mx-auto animate-fade-in">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-blue-300 font-medium text-xs">Tip</span>
                    </div>
                    <p className="text-blue-200 text-xs text-center leading-relaxed">
                      If your video doesn't load after <span className="font-semibold text-blue-100">5 minutes</span>, please check the{' '}
                      <button
                        onClick={() => router.push('/projects')}
                        className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
                      >
                        Projects page
                      </button>
                      {' '}for your generated video.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center border-2 border-dashed border-gray-500/50">
                    <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-white mb-3">Your AI Video</h4>
                <p className="text-gray-400 text-sm mb-8 max-w-xs">
                  {generationMode === 'text-to-video'
                    ? 'Enter a detailed prompt to generate your video with audio'
                    : 'Upload an image and add a prompt to animate it with audio'
                  }
                </p>

                {/* Enhanced Progress indicator */}
                <div className="w-full space-y-4">
                  {generationMode === 'text-to-video' ? (
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${textPrompt.trim() ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30' : 'bg-gray-600'}`}>
                          {textPrompt.trim() && (
                            <svg className="w-3 h-3 text-white m-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${textPrompt.trim() ? 'text-blue-400' : 'text-gray-500'}`}>Text Prompt</span>
                      </div>
                      {textPrompt.trim() && <span className="text-xs text-blue-400">✓</span>}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full transition-all duration-300 ${imageFile ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30' : 'bg-gray-600'}`}>
                            {imageFile && (
                              <svg className="w-3 h-3 text-white m-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm font-medium transition-colors duration-300 ${imageFile ? 'text-purple-400' : 'text-gray-500'}`}>Source Image</span>
                        </div>
                        {imageFile && <span className="text-xs text-purple-400">✓</span>}
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full transition-all duration-300 ${imagePrompt.trim() ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30' : 'bg-gray-600'}`}>
                            {imagePrompt.trim() && (
                              <svg className="w-3 h-3 text-white m-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm font-medium transition-colors duration-300 ${imagePrompt.trim() ? 'text-blue-400' : 'text-gray-500'}`}>Animation Prompt</span>
                        </div>
                        {imagePrompt.trim() && <span className="text-xs text-blue-400">✓</span>}
                      </div>
                    </>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full mt-6">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>
                      {generationMode === 'text-to-video'
                        ? (textPrompt.trim() ? 100 : 0)
                        : Math.round(((imageFile ? 1 : 0) + (imagePrompt.trim() ? 1 : 0)) / 2 * 100)
                      }%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${generationMode === 'text-to-video'
                          ? (textPrompt.trim() ? 100 : 0)
                          : ((imageFile ? 1 : 0) + (imagePrompt.trim() ? 1 : 0)) / 2 * 100
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
