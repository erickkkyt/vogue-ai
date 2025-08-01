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
    <div className="max-w-6xl mx-auto">
      <ToastContainer />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left side: Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Generation Mode Selection - Veo3 Style */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" />
              Generation Mode
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setGenerationMode('text-to-video')}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  generationMode === 'text-to-video'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wand2 className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Text to Video</div>
                    <div className="text-sm opacity-75">Create video from text description</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setGenerationMode('image-to-video')}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  generationMode === 'image-to-video'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Image to Video</div>
                    <div className="text-sm opacity-75">Animate your image with AI</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}