'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

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
  const router = useRouter();
  const supabase = createClient();

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
      // 这里将来会调用实际的 Earth Zoom API
      await new Promise(resolve => setTimeout(resolve, 5000)); // 模拟5秒生成时间
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // 生成完成后的处理
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        alert('Earth Zoom video generated successfully!');
      }, 1000);
      
    } catch (error) {
      console.error('Generation error:', error);
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
      alert('Generation failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：图片上传和设置 */}
        <div className="space-y-6">
          {/* 图片上传区域 */}
          <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Upload Image</h4>
            
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors duration-300">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-300 mb-2">Drag and drop your image here</p>
                  <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors duration-200"
              >
                Choose Image
              </label>
            </div>
          </div>

          {/* 设置选项 */}
          <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Generation Settings</h4>
            
            <div className="space-y-4">
              {/* 缩放速度 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Zoom Speed
                </label>
                <select
                  value={zoomSpeed}
                  onChange={(e) => setZoomSpeed(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="slow">Slow (Cinematic)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="fast">Fast (Dynamic)</option>
                </select>
              </div>

              {/* 输出格式 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="16:9">Landscape (16:9) - YouTube</option>
                  <option value="9:16">Portrait (9:16) - TikTok/Instagram</option>
                  <option value="1:1">Square (1:1) - Instagram Posts</option>
                </select>
              </div>

              {/* 自定义描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Description (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe the location or add special instructions..."
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：预览和生成 */}
        <div className="space-y-6">
          {/* 预览区域 */}
          <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Preview</h4>
            
            <div className="aspect-video bg-gray-900 rounded-lg border border-gray-600 flex items-center justify-center">
              {imagePreview ? (
                <div className="text-center">
                  <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-white font-medium">Ready to generate</p>
                  <p className="text-gray-400 text-sm">Earth zoom effect will appear here</p>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400">Upload an image to see preview</p>
                </div>
              )}
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Generate Video</h4>
            
            {isGenerating ? (
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-gray-300">
                  Generating Earth zoom effect... {Math.round(generationProgress)}%
                </p>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!selectedImage || currentCredits < 1}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                {!selectedImage 
                  ? 'Upload Image First' 
                  : currentCredits < 1 
                    ? 'Insufficient Credits' 
                    : 'Generate Earth Zoom Video'
                }
              </button>
            )}
            
            <p className="text-gray-400 text-sm text-center mt-3">
              Estimated generation time: 30-60 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 